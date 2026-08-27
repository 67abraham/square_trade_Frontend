import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'horizontal' | 'icon-only' | 'compact';
  theme?: 'light' | 'dark';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const SquareTradeIcon: React.FC<{ className?: string; size?: number }> = ({ 
  className = "w-9 h-9", 
  size = 36 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Upper diagonal accent bars */}
      <path
        d="M52 20 L62 20 L48 44 L38 44 Z"
        fill="#FA9D1B"
      />
      <path
        d="M66 20 L76 20 L62 44 L52 44 Z"
        fill="#6E72EB"
      />

      {/* Lower diagonal accent bars */}
      <path
        d="M38 56 L48 56 L34 80 L24 80 Z"
        fill="#6E72EB"
      />
      <path
        d="M52 56 L62 56 L48 80 L38 80 Z"
        fill="#FA9D1B"
      />

      {/* Main S Ribbon outline */}
      <path
        d="M68 28 C68 22 62 18 52 18 L32 18 C22 18 16 24 16 34 C16 44 24 48 36 50 L56 52 C64 53 68 56 68 64 C68 74 60 80 46 80 L24 80 C15 80 12 75 12 70"
        stroke="#0F172A"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M68 28 C68 22 62 18 52 18 L32 18 C22 18 16 24 16 34 C16 44 24 48 36 50 L56 52 C64 53 68 56 68 64 C68 74 60 80 46 80 L24 80"
        stroke="#1E293B"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Front interlocking curves */}
      <path
        d="M32 18 C22 18 18 24 18 33 C18 43 25 47 38 49 L58 52 C68 54 74 58 74 67 C74 77 64 82 50 82 L26 82"
        stroke="#000000"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'horizontal',
  theme = 'light',
  className = '',
  size = 'md',
  showSubtitle = true
}) => {
  const isDark = theme === 'dark';

  const iconSizes = {
    sm: 28,
    md: 36,
    lg: 48,
    xl: 60
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const subSizes = {
    sm: 'text-[8px] tracking-[0.24em]',
    md: 'text-[9.5px] tracking-[0.3em]',
    lg: 'text-[11px] tracking-[0.34em]',
    xl: 'text-[13px] tracking-[0.38em]'
  };

  if (variant === 'icon-only') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <SquareTradeIcon size={iconSizes[size]} />
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        {/* Top Stylized S Icon */}
        <div className="mb-2">
          <SquareTradeIcon size={iconSizes[size] * 1.3} />
        </div>

        {/* Wordmark: SQUARE with two-tone */}
        <div className="flex items-center leading-none">
          <span className={`font-black font-public-sans tracking-tight ${isDark ? 'text-white' : 'text-black'} ${textSizes[size]}`}>
            SQU
          </span>
          <span className={`font-black font-public-sans tracking-tight text-[#FA9D1B] ${textSizes[size]}`}>
            ARE
          </span>
        </div>

        {/* Subtitle: TRADE SOURCING */}
        {showSubtitle && (
          <span className={`font-bold font-inter uppercase mt-1 ${isDark ? 'text-slate-300' : 'text-[#0F172A]'} ${subSizes[size]}`}>
            TRADE SOURCING
          </span>
        )}
      </div>
    );
  }

  // Horizontal variant (Ideal for Navbar & Headers)
  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Icon */}
      <div className="flex-shrink-0 flex items-center justify-center">
        <SquareTradeIcon size={iconSizes[size]} />
      </div>

      {/* Text Group */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline leading-tight">
          <span className={`font-black font-public-sans tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'} ${textSizes[size]}`}>
            SQU
          </span>
          <span className={`font-black font-public-sans tracking-tight text-[#FA9D1B] ${textSizes[size]}`}>
            ARE
          </span>
        </div>

        {showSubtitle && (
          <span className={`font-bold font-inter uppercase leading-none mt-0.5 ${isDark ? 'text-slate-300' : 'text-[#191c1e]'} ${subSizes[size]}`}>
            TRADE SOURCING
          </span>
        )}
      </div>
    </div>
  );
};
