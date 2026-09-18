import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PORTAL_FALLBACK_PATH } from '../../config/api';
import { sanitizePortalReturnPath } from '../../utils/loginRedirect';

type Mode = 'login' | 'signup' | 'forgot' | 'callback';

function modeFromPath(pathname: string): Mode {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/signup') return 'signup';
  if (path === '/password/forgot') return 'forgot';
  if (path === '/auth/callback') return 'callback';
  return 'login';
}

export function isEduAuthPath(pathname: string): boolean {
  const path = pathname.replace(/\/+$/, '') || '/';
  return path === '/login' || path === '/signup' || path === '/password/forgot' || path === '/auth/callback';
}

async function postAuth(action: string, body: Record<string, string>): Promise<{ ok: boolean; message: string; returnPath?: string }> {
  const res = await fetch(`/api/auth.php?action=${encodeURIComponent(action)}`, {
    method: 'POST',
    credentials: 'include',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => null)) as
    | { ok?: boolean; message?: string; error?: string; data?: { returnPath?: string; message?: string } }
    | null;
  const message =
    json?.data?.message || json?.message || (res.ok ? '' : '로그인에 실패했습니다. 아이디와 비밀번호를 확인해 주세요.');
  return {
    ok: res.ok && json?.ok !== false,
    message,
    returnPath: json?.data?.returnPath,
  };
}

export const EduAuthScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mode = modeFromPath(location.pathname);
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const returnPath = sanitizePortalReturnPath(params.get('return') || params.get('returnPath') || PORTAL_FALLBACK_PATH);

  const [mbId, setMbId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (mode !== 'callback') return;
    const code = params.get('code') || params.get('authorization_code') || '';
    if (!code) {
      setError('인증 코드가 없습니다. 다시 로그인해 주세요.');
      return;
    }
    let cancelled = false;
    setBusy(true);
    postAuth('sso/exchange', { code, returnPath })
      .then((result) => {
        if (cancelled) return;
        if (!result.ok) {
          setError(result.message || '통합 로그인에 실패했습니다.');
          setBusy(false);
          return;
        }
        window.location.assign(result.returnPath || returnPath);
      })
      .catch(() => {
        if (!cancelled) {
          setError('통합 로그인 처리 중 오류가 발생했습니다.');
          setBusy(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [mode, params, returnPath]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setInfo('');
    setBusy(true);
    try {
      if (mode === 'login') {
        const result = await postAuth('login', { mb_id: mbId.trim(), mb_password: password, returnPath });
        if (!result.ok) {
          setError(result.message || '로그인에 실패했습니다.');
          setBusy(false);
          return;
        }
        window.location.assign(result.returnPath || returnPath);
        return;
      }
      if (mode === 'signup') {
        const result = await postAuth('signup', {
          mb_email: mbId.trim(),
          mb_name: name.trim(),
          mb_password: password,
          mb_hp: phone.trim(),
          returnPath,
        });
        if (!result.ok) {
          setError(result.message || '회원가입에 실패했습니다.');
          setBusy(false);
          return;
        }
        window.location.assign(returnPath);
        return;
      }
      const result = await postAuth('password/forgot', { mb_email: mbId.trim() });
      if (!result.ok) {
        setError(result.message || '비밀번호 재설정 요청에 실패했습니다.');
        setBusy(false);
        return;
      }
      setInfo('재설정 안내를 보냈습니다. 메일함을 확인해 주세요.');
      setBusy(false);
    } catch {
      setError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      setBusy(false);
    }
  };

  const title =
    mode === 'signup' ? '통합 회원가입' : mode === 'forgot' ? '비밀번호 찾기' : mode === 'callback' ? '통합 로그인 확인' : '통합 로그인';

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <p className="text-[10px] font-bold tracking-widest text-sky-600 uppercase">edu.icrm.co.kr</p>
        <h1 className="mt-2 text-xl font-black text-slate-900 [word-break:keep-all]">{title}</h1>
        <p className="mt-2 text-sm text-slate-500 [word-break:keep-all]">
          온오프마케팅·도메인·백링크와 같은 ONOFF 통합계정입니다. 여기서 로그인하면 다른 icrm 서비스에도 로그인 상태가 유지됩니다.
        </p>

        {mode === 'callback' ? (
          <p className="mt-6 text-sm text-slate-600">{error || '통합 세션을 확인하고 있습니다.'}</p>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <label className="block text-xs font-bold text-slate-600">
              {mode === 'login' ? '아이디 또는 이메일' : '이메일'}
              <input
                value={mbId}
                onChange={(e) => setMbId(e.target.value)}
                autoComplete="username"
                required
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-900"
              />
            </label>
            {mode === 'signup' && (
              <>
                <label className="block text-xs font-bold text-slate-600">
                  이름
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-900"
                  />
                </label>
                <label className="block text-xs font-bold text-slate-600">
                  휴대폰
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-900"
                  />
                </label>
              </>
            )}
            {mode !== 'forgot' && (
              <label className="block text-xs font-bold text-slate-600">
                비밀번호
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  required
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-900"
                />
              </label>
            )}
            {error && <p className="text-sm text-rose-600 [word-break:keep-all]">{error}</p>}
            {info && <p className="text-sm text-sky-700 [word-break:keep-all]">{info}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full min-h-[48px] rounded-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-60 text-slate-900 font-bold text-sm"
            >
              {busy ? '처리 중…' : mode === 'signup' ? '가입하고 입장' : mode === 'forgot' ? '재설정 메일 보내기' : '로그인하고 입장'}
            </button>
          </form>
        )}

        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-sky-700">
          {mode !== 'login' && (
            <button type="button" className="hover:underline" onClick={() => navigate(`/login?return=${encodeURIComponent(returnPath)}`)}>
              로그인
            </button>
          )}
          {mode !== 'signup' && (
            <button type="button" className="hover:underline" onClick={() => navigate(`/signup?return=${encodeURIComponent(returnPath)}`)}>
              회원가입
            </button>
          )}
          {mode !== 'forgot' && (
            <button type="button" className="hover:underline" onClick={() => navigate('/password/forgot')}>
              비밀번호 찾기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
