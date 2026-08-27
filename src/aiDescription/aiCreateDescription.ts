import { generateProductDescription } from '../lib/api/admin';

export const aiCreateDescription = ({ name, imagUrl }: { name: string; imagUrl?: string }) => async () => {
  return generateProductDescription({ name, specifications: '', brand: '', category: '', imageUrl: imagUrl });
};
