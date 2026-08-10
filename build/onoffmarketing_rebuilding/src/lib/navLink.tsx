import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

/** Paths that leave the HashRouter SPA and hit Gnuboard pretty URLs. */
const EXTERNAL_PATHS = new Set(['/notice', '/faq', '/youtube']);

export function isSiteExternalPath(path: string): boolean {
  if (!path) return false;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) return true;
  if (EXTERNAL_PATHS.has(path)) return true;
  if (path.startsWith('/bbs/') || path.startsWith('/adm/')) return true;
  return false;
}

type AppNavLinkProps = Omit<LinkProps, 'to'> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    to: string;
    children?: ReactNode;
  };

/** Use React Router for SPA routes; plain anchors for Gnuboard board URLs. */
export function AppNavLink({ to, children, ...rest }: AppNavLinkProps) {
  if (isSiteExternalPath(to)) {
    return (
      <a href={to} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link to={to} {...rest}>
      {children}
    </Link>
  );
}
