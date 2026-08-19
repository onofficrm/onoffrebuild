import type { ReactNode, AnchorHTMLAttributes } from 'react';
import { KAKAO_CHAT_URL } from '../data/landingData';

export type KakaoCtaLocation =
  | 'header'
  | 'header-mobile'
  | 'hero'
  | 'class-method'
  | 'pricing'
  | 'faq'
  | 'final'
  | 'floating'
  | 'mobile-sticky';

type KakaoCtaProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target' | 'rel'> & {
  location: KakaoCtaLocation;
  children: ReactNode;
};

/** Kakao consult CTA — keeps UTM on the landing URL; opens chat in a new tab. */
export function KakaoCta({ location, children, className, id, ...rest }: KakaoCtaProps) {
  return (
    <a
      {...rest}
      id={id}
      href={KAKAO_CHAT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      data-cta="kakao-consult"
      data-cta-location={location}
    >
      {children}
    </a>
  );
}
