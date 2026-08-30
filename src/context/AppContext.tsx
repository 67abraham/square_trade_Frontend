import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { CartItem, Category, DeliveryInfo, Order, Product } from '../types';
import { getCategories, getProducts } from '../lib/api/catalog';
import { createCartItem, deleteCartItem, getCart, updateCartItem } from '../lib/api/cart';
import { createOrder, getOrders } from '../lib/api/orders';
import { authClient, type AuthSession } from '../lib/auth-client';
import { api } from '../lib/api/client';
import { useDebouncedCartUpdate } from '../lib/useDebouncedCartUpdate';

interface LastOrder { orderNumber: string; totalAmount: number; }

interface AppContextValue {
  products: Product[]; categories: Category[]; orders: Order[]; cartItems: CartItem[];
  deliveryInfo: DeliveryInfo; searchQuery: string; userRole: 'admin' | 'buyer' | null;
  session: AuthSession | null; authLoading: boolean; productsLoading: boolean; productsError: string | null;
  refreshProducts: () => Promise<void>; refreshCart: () => Promise<void>; refreshOrders: () => Promise<void>; refreshSession: () => Promise<AuthSession | null>;
  isCartOpen: boolean; isEditDeliveryOpen: boolean; isOrderSuccessOpen: boolean;
  lastOrder: LastOrder | null; setSearchQuery: (q: string) => void;
  openCart: () => void; closeCart: () => void;
  openEditDelivery: () => void; closeEditDelivery: () => void; closeOrderSuccess: () => void;
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => Promise<void>;
  updateQuantity: (cartItem: CartItem, delta: number) => Promise<void>;
  removeFromCart: (cartItem: CartItem) => Promise<void>;
  saveDeliveryInfo: (info: DeliveryInfo) => Promise<void>;
  placeOrder: (shippingMethod: import('../types').ShippingMethod) => Promise<void>;
  logout: () => Promise<void>;
}

const EMPTY_DELIVERY_INFO: DeliveryInfo = { name: '', address: '', city: '', zipCode: '', mobile: '', email: '' };
const AppContext = createContext<AppContextValue | undefined>(undefined);

const mapOrders = (orders: Awaited<ReturnType<typeof getOrders>>['getO']): Order[] => orders.map(order => ({
  id: order.id,
  orderNumber: order.orderNumber,
  totalAmount: order.totalAmount,
  status: order.status,
  shippingMethod: order.shippingMethod,
  date: new Date(order.createAt).toLocaleDateString(),
  customerName: order.user?.name,
  customerEmail: order.user?.email,
  items: order.item.map(item => ({ name: item.product.name, quantity: item.quantity, price: item.unitPrice ?? item.product.price, image: item.product.imageUrl?.[0], selectedColor: item.selectedColor ?? undefined, selectedSize: item.selectedSize ?? undefined })),
}));

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>(EMPTY_DELIVERY_INFO);
  const [searchQuery, setSearchQuery] = useState('');
  const [session, setSession] = useState<AuthSession | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isEditDeliveryOpen, setIsEditDeliveryOpen] = useState(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<LastOrder | null>(null);
  const guestCartRef = useRef<CartItem[]>([]);
  const productRequestRef = useRef(0);

  const refreshSession = useCallback(async () => {
    const value = await authClient.getSession();
    setSession(value);
    setAuthLoading(false);
    return value;
  }, []);

  const refreshProducts = useCallback(async () => {
    const requestId = ++productRequestRef.current;
    setProductsLoading(true); setProductsError(null);
    try {
      const [p, c] = await Promise.all([getProducts({ page: 1, limit: 100, search: searchQuery || undefined }), getCategories()]);
      if (requestId !== productRequestRef.current) return;
      setProducts(p.products); setCategories(c);
    } catch (error) {
      if (requestId !== productRequestRef.current) return;
      setProductsError(error instanceof Error ? error.message : 'Unable to load products');
    } finally {
      if (requestId === productRequestRef.current) setProductsLoading(false);
    }
  }, [searchQuery, session?.user.role]);

  const refreshCart = useCallback(async () => {
    if (!session) { setCartItems([]); return; }
    try {
      const result = await getCart();
      setCartItems(result.items);
      if (result.billingAddress) {
        setDeliveryInfo({ name: result.billingAddress.fullName, address: result.billingAddress.currentAddress, city: result.billingAddress.city, zipCode: result.billingAddress.zipCode ?? '', mobile: result.billingAddress.contact, email: session.user.email });
      }
    } catch { /* Preserve the current cart on transient network failures. */ }
  }, [session]);

  const refreshOrders = useCallback(async () => {
    if (!session) { setOrders([]); return; }
    try { const result = await getOrders(); setOrders(mapOrders(result.getO)); } catch { /* Preserve cached orders on transient failures. */ }
  }, [session]);

  useEffect(() => { void refreshProducts(); }, [refreshProducts]);
  useEffect(() => { void refreshSession(); }, [refreshSession]);
  useEffect(() => {
    if (!session) { setCartItems([]); setOrders([]); return; }
    setDeliveryInfo(prev => prev.email ? prev : { ...prev, email: session.user.email });
    const guestItems = guestCartRef.current;
    void (async () => {
      try {
        if (guestItems.length) {
          const failed: CartItem[] = [];
          for (const item of guestItems) {
            try {
              await createCartItem(item.product.id, item.quantity, item.selectedColor, item.selectedSize);
            } catch {
              failed.push(item);
            }
          }
          guestCartRef.current = failed;
        }
        await Promise.all([refreshCart(), refreshOrders()]);
      } catch { /* Keep the existing local state on transient failures. */ }
    })();
  }, [session, refreshCart, refreshOrders]);
  useEffect(() => {
    const backend = String(import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8000').replace(/\/+$/, '').replace(/\/api$/, '');
    const wsUrl = backend.replace(/^http/, 'ws');
    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
    let stopped = false;

    const connect = () => {
      if (stopped) return;
      socket = new WebSocket(wsUrl);

      socket.onmessage = event => {
        try {
          const payload = JSON.parse(event.data) as { event?: string };
          if (payload.event === 'create:product' || payload.event === 'product:updated' || payload.event === 'product:status-updated' || payload.event === 'category:created' || payload.event === 'category:updated' || payload.event === 'category:deleted') void refreshProducts();
          if (payload.event === 'order:updated' || payload.event === 'order:created') void refreshOrders();
          if (payload.event === 'cart:updated') void refreshCart();
        } catch { /* Ignore malformed socket messages. */ }
      };

      socket.onclose = () => {
        if (!stopped) reconnectTimer = setTimeout(connect, 3000);
      };
      socket.onerror = () => socket?.close();
    };

    connect();

    return () => {
      stopped = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, [refreshProducts, refreshCart, refreshOrders]);


const addToCart = useCallback(async (
  product: Product,
  quantity = 1,
  selectedColor?: string,
  selectedSize?: string
): Promise<void> => {
  const safeQuantity = Math.max(product.minimumOrder ?? 1, quantity);

  setCartItems(prev => {
    const existing = prev.find(item =>
      item.product.id === product.id &&
      item.selectedColor === selectedColor &&
      item.selectedSize === selectedSize
    );

    const next = existing
      ? prev.map(item => item === existing ? { ...item, quantity: item.quantity + safeQuantity } : item)
      : [...prev, { product, quantity: safeQuantity, selectedColor, selectedSize } as CartItem];

    if (!session) guestCartRef.current = next;
    return next;
  });

  if (!session) return;

  try {
    await createCartItem(product.id, safeQuantity, selectedColor, selectedSize);
    await refreshCart();
  } catch (error) {
    await refreshCart();
    throw error;
  }
}, [session, refreshCart]);

const { scheduleUpdate: scheduleCartUpdate, cancelUpdate: cancelCartUpdate } = useDebouncedCartUpdate(500);


const updateQuantity = useCallback((item: CartItem, delta: number) => {
  const minimum = item.product.minimumOrder ?? 1;
  let finalQuantity: number | null = null;

  setCartItems(prev => {
    const current = prev.find(i => i.id === item.id);
    if (!current) return prev; // item no longer in cart (e.g. removed meanwhile) — nothing to do

    const quantity = Math.max(minimum, current.quantity + delta);
    if (quantity === current.quantity) {
      finalQuantity = null;
      return prev;
    }

    finalQuantity = quantity;
    const next = prev.map(i => i.id === item.id ? { ...i, quantity } : i);
    if (!session || !item.id) guestCartRef.current = next;
    return next;
  });

  if (!session || !item.id || finalQuantity === null) return;

  scheduleCartUpdate(item.id, finalQuantity, async () => {
    await refreshCart();
  });
}, [scheduleCartUpdate, refreshCart, session]);


const removeFromCart = useCallback((item: CartItem) => {
  if (!session || !item.id) {
    setCartItems(prev => {
      const next = prev.filter(i => i.id !== item.id);
      guestCartRef.current = next;
      return next;
    });
    return;
  }

  cancelCartUpdate(item.id);

  const previousItems = cartItems;
  setCartItems(prev => prev.filter(i => i.id !== item.id));

  deleteCartItem(item.id).catch(async () => {
    setCartItems(previousItems);
    await refreshCart();
  });
},[session, cartItems, cancelCartUpdate, refreshCart]);

  const saveDeliveryInfo = async (info: DeliveryInfo) => {
    if (!session) throw new Error('Please sign in before saving delivery information');
    const normalized = { ...info, name: info.name.trim(), address: info.address.trim(), city: info.city.trim(), zipCode: info.zipCode.trim(), mobile: info.mobile.trim(), email: session.user.email };
    if (!normalized.name || !normalized.address || !normalized.city || !normalized.zipCode || !normalized.mobile) throw new Error('All delivery fields are required');
    await api.put('/billing', { fullName: normalized.name, city: normalized.city, county: '', currentAddress: normalized.address, contact: normalized.mobile, country: 'Liberia', zipCode: normalized.zipCode });
    setDeliveryInfo(normalized); setIsEditDeliveryOpen(false);
  };

  const placeOrder = async (shippingMethod: import('../types').ShippingMethod) => {
    if (!session) throw new Error('Please sign in before placing an order');
    if (!cartItems.length) throw new Error('Your cart is empty');
    if (cartItems.some(item => item.product.status === 'NOT_AVAILABLE' || item.product.inStock === false)) throw new Error('One or more products in your cart are no longer available. Please remove them before placing the order');
    if (!deliveryInfo.name.trim() || !deliveryInfo.address.trim() || !deliveryInfo.city.trim() || !deliveryInfo.zipCode.trim() || !deliveryInfo.mobile.trim()) throw new Error('Please add your complete delivery information before placing the order');
    const ids = cartItems.map(item => item.id).filter((id): id is string => Boolean(id));
    if (ids.length !== cartItems.length) throw new Error('Cart is not synchronized with the server');
    const order = await createOrder(ids, shippingMethod);
    setLastOrder({ orderNumber: order.orderNumber, totalAmount: order.totalAmount });
    setIsOrderSuccessOpen(true); await refreshCart(); await refreshOrders();
  };

  const logout = async () => { await authClient.signOut(); setSession(null); setCartItems([]); setOrders([]); };
  const userRole = session?.user.role === 'ADMIN' ? 'admin' : session ? 'buyer' : null;

  const value = useMemo<AppContextValue>(() => ({
    products, categories, orders, cartItems, deliveryInfo, searchQuery, userRole, session, authLoading,
    productsLoading, productsError, refreshProducts, refreshCart, refreshOrders, refreshSession,
    isCartOpen, isEditDeliveryOpen, isOrderSuccessOpen, lastOrder, setSearchQuery,
    openCart: () => setIsCartOpen(true), closeCart: () => setIsCartOpen(false),
    openEditDelivery: () => setIsEditDeliveryOpen(true), closeEditDelivery: () => setIsEditDeliveryOpen(false), closeOrderSuccess: () => setIsOrderSuccessOpen(false),
    addToCart, updateQuantity, removeFromCart, saveDeliveryInfo, placeOrder, logout,
  }), [products, categories, orders, cartItems, deliveryInfo, searchQuery, userRole, session, authLoading, productsLoading, productsError, refreshProducts, refreshCart, refreshOrders, refreshSession, isCartOpen, isEditDeliveryOpen, isOrderSuccessOpen, lastOrder]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export const useAppContext = (): AppContextValue => { const ctx = useContext(AppContext); if (!ctx) throw new Error('useAppContext must be used within an AppProvider'); return ctx; };
