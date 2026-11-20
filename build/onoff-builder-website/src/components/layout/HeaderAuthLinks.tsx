import { useSyncExternalStore } from 'react';
import {
  readSiteBoot,
  resolveLoginHref,
  resolveLogoutHref,
  resolveRegisterHref,
  type SiteBoot,
} from '../../lib/siteAuth';

const SSR_BOOT: SiteBoot = Object.freeze({});

const bootStore = {
  subscribe(onChange: () => void) {
    if (typeof window === 'undefined') return () => {};
    window.addEventListener('pageshow', onChange);
    return () => window.removeEventListener('pageshow', onChange);
  },
  getSnapshot() {
    return readSiteBoot();
  },
};

const authLinkClass =
  'hidden lg:inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-[13px] font-semibold text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-colors whitespace-nowrap';

type HeaderAuthLinksProps = {
  layout?: 'desktop' | 'mobile';
  onNavigate?: () => void;
};

export function HeaderAuthLinks({ layout = 'desktop', onNavigate }: HeaderAuthLinksProps) {
  const boot = useSyncExternalStore(bootStore.subscribe, bootStore.getSnapshot, () => SSR_BOOT);
  const isMember = Boolean(boot.isMember);

  const loginHref = resolveLoginHref(boot);
  const registerHref = resolveRegisterHref(boot);
  const logoutHref = resolveLogoutHref(boot);

  if (layout === 'mobile') {
    if (isMember) {
      return (
        <div className="grid grid-cols-2 gap-2 pb-3">
          <a
            href={logoutHref}
            onClick={onNavigate}
            className="flex min-h-[48px] items-center justify-center rounded-lg border border-slate-200 text-[15px] font-semibold text-slate-600"
          >
            로그아웃
          </a>
          <a
            href="/"
            onClick={onNavigate}
            className="flex min-h-[48px] items-center justify-center rounded-lg bg-slate-50 text-[15px] font-semibold text-slate-950"
          >
            {boot.mbNick || '내 계정'}
          </a>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-2 pb-3">
        <a
          href={loginHref}
          onClick={onNavigate}
          className="flex min-h-[48px] items-center justify-center rounded-lg border border-slate-200 text-[15px] font-semibold text-slate-600"
        >
          로그인
        </a>
        <a
          href={registerHref}
          onClick={onNavigate}
          className="flex min-h-[48px] items-center justify-center rounded-lg bg-slate-50 text-[15px] font-semibold text-slate-950"
        >
          회원가입
        </a>
      </div>
    );
  }

  if (isMember) {
    return (
      <>
        <span className={`${authLinkClass} border-transparent px-2 text-slate-500`}>
          {boot.mbNick || boot.mbId || '회원'}
        </span>
        <a href={logoutHref} className={authLinkClass}>
          로그아웃
        </a>
      </>
    );
  }

  return (
    <>
      <a href={loginHref} className={authLinkClass}>
        로그인
      </a>
      <a href={registerHref} className={authLinkClass}>
        회원가입
      </a>
    </>
  );
}