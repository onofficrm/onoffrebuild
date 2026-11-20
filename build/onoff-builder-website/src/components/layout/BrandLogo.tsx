type BrandLogoProps = {
  variant?: 'light' | 'dark';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

const LOGO_SRC = {
  light: '/img/logo/logo-pc.png',
  dark: '/img/logo/logo-pc-white.png',
} as const;

const HEIGHT: Record<NonNullable<BrandLogoProps['size']>, string> = {
  sm: 'h-8',
  md: 'h-10 sm:h-11',
  lg: 'h-12 sm:h-14',
};

export function BrandLogo({ variant = 'light', className = '', size = 'md' }: BrandLogoProps) {
  return (
    <img
      src={LOGO_SRC[variant]}
      alt="온오프마케팅 ONOFF MARKETING"
      className={`${HEIGHT[size]} w-auto block object-contain ${className}`.trim()}
      width={182}
      height={54}
      decoding="async"
    />
  );
}