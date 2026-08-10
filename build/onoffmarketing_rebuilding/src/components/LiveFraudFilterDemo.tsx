import { useState, FormEvent } from 'react';
import { Database, ShieldCheck, CheckCircle2, XCircle, AlertTriangle, Send, RefreshCw, Sparkles, Phone, User, Globe, MessageSquare } from 'lucide-react';

interface SimulatedDb {
  id: string;
  name: string;
  phone: string;
  channel: string;
  ip: string;
  time: string;
  status: 'valid' | 'duplicate' | 'abusing_ip' | 'invalid_phone';
  reason: string;
  notificationSent: boolean;
}

export default function LiveFraudFilterDemo() {
  const [testDbList, setTestDbList] = useState<SimulatedDb[]>([
    {
      id: 'DB-9842',
      name: '홍길동',
      phone: '010-1234-5678',
      channel: '네이버 블로그 (파트너 #102)',
      ip: '211.234.12.89',
      time: '방금 전',
      status: 'valid',
      reason: '11자 정상 번호 / 유일 IP / 중복 없음',
      notificationSent: true,
    },
    {
      id: 'DB-9841',
      name: '김철수',
      phone: '010-1234-5678',
      channel: '인스타그램 (파트너 #304)',
      ip: '211.234.12.89',
      time: '1분 전',
      status: 'duplicate',
      reason: '동일 전화번호 24시간 내 재접수 (중복 차단)',
      notificationSent: false,
    },
    {
      id: 'DB-9840',
      name: '익명유저',
      phone: '010-0000-0000',
      channel: '유튜브 커뮤니티 (파트너 #088)',
      ip: '112.186.43.12',
      time: '3분 전',
      status: 'invalid_phone',
      reason: '허위/테스트 번호 패턴 검출',
      notificationSent: false,
    },
    {
      id: 'DB-9839',
      name: '이영희',
      phone: '010-9876-5432',
      channel: '페이스북 타겟광고',
      ip: '59.12.108.99',
      time: '5분 전',
      status: 'valid',
      reason: '정상 DB / 알림톡 즉시 발송 완료',
      notificationSent: true,
    },
  ]);

  const [inputName, setInputName] = useState('강감찬');
  const [inputPhone, setInputPhone] = useState('010-5555-7777');
  const [selectedChannel, setSelectedChannel] = useState('카카오 모먼트 (파트너 #205)');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSimulateSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputPhone || isProcessing) return;

    setIsProcessing(true);

    setTimeout(() => {
      // Determine status based on phone format and existing list
      const cleanPhone = inputPhone.replace(/[^0-9]/g, '');
      const isDuplicate = testDbList.some((item) => item.phone.replace(/[^0-9]/g, '') === cleanPhone);

      let status: 'valid' | 'duplicate' | 'abusing_ip' | 'invalid_phone' = 'valid';
      let reason = '11자 정상 번호 / 유일 IP / 알림톡 전송 완료';
      let notificationSent = true;

      if (cleanPhone === '01000000000' || cleanPhone.length < 10) {
        status = 'invalid_phone';
        reason = '유효하지 않은 번호 자릿수 또는 허위 패턴';
        notificationSent = false;
      } else if (isDuplicate) {
        status = 'duplicate';
        reason = '24시간 내 중복 접수 감지 (자동 거절)';
        notificationSent = false;
      } else if (cleanPhone.endsWith('9999')) {
        status = 'abusing_ip';
        reason = '어뷰징 클릭 IP 블랙리스트 대역 매칭';
        notificationSent = false;
      }

      const newEntry: SimulatedDb = {
        id: `DB-${Math.floor(1000 + Math.random() * 9000)}`,
        name: inputName || '신규고객',
        phone: inputPhone,
        channel: selectedChannel,
        ip: `183.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 200)}.12`,
        time: '방금 전',
        status,
        reason,
        notificationSent,
      };

      setTestDbList([newEntry, ...testDbList.slice(0, 5)]);
      setIsProcessing(false);
    }, 600);
  };

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-4 py-1.5 rounded-full text-xs font-bold mb-4 backdrop-blur-md">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>실시간 AI DB 필터링 엔진</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            어뷰징 및 불량 DB <span className="text-emerald-400">실시간 자동 차단</span> 시뮬레이터
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            허위 번호, 중복 접수, 매크로 IP를 0.1초 만에 자동 거절하고, 정상 유효 DB만 광고주 단톡방 및 알림톡으로 전송되는 프로세스를 직접 테스트해보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Side - Test Input */}
          <div className="lg:col-span-5 bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-700">
              <h3 className="text-base font-bold text-white flex items-center">
                <Database size={18} className="text-emerald-400 mr-2" />
                모의 DB 접수 테스트
              </h3>
              <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
                LIVE FILTER
              </span>
            </div>

            <form onSubmit={handleSimulateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center">
                  <User size={14} className="mr-1 text-slate-400" />
                  신청자 성명
                </label>
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                  placeholder="예: 홍길동"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center">
                  <Phone size={14} className="mr-1 text-slate-400" />
                  연락처 (중복 테스트 가능)
                </label>
                <input
                  type="text"
                  value={inputPhone}
                  onChange={(e) => setInputPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  placeholder="010-0000-0000 입력시 허위 차단 테스트"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  * 팁: <span className="text-amber-400">010-1234-5678</span> 입력시 중복 감지, <span className="text-rose-400">010-0000-0000</span> 입력시 허위 차단
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center">
                  <Globe size={14} className="mr-1 text-slate-400" />
                  유입 경로 / 제휴 파트너 매체
                </label>
                <select
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="네이버 블로그 (파트너 #102)">네이버 블로그 (파트너 #102)</option>
                  <option value="인스타그램 타겟광고 (파트너 #304)">인스타그램 타겟광고 (파트너 #304)</option>
                  <option value="구글 GDN 배너 (파트너 #511)">구글 GDN 배너 (파트너 #511)</option>
                  <option value="유튜브 커뮤니티 (파트너 #088)">유튜브 커뮤니티 (파트너 #088)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 mt-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw size={16} className="animate-spin text-slate-950" />
                    <span>AI 엔진 검증 중...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>모의 DB 접수 & 자동 검증 실행</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Feature Bullet */}
            <div className="mt-6 pt-5 border-t border-slate-700/80 space-y-2 text-xs text-slate-300">
              <div className="flex items-center text-emerald-400 font-bold">
                <CheckCircle2 size={14} className="mr-1.5" />
                정상 DB: 광고주 알림톡 전송 + 정산 승인 대기
              </div>
              <div className="flex items-center text-rose-400 font-bold">
                <XCircle size={14} className="mr-1.5" />
                불량 DB: 광고비 자동 차감 제외 + 파트너 정산 미지급
              </div>
            </div>
          </div>

          {/* Table Side - Live Feed */}
          <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center">
                  <Sparkles size={18} className="text-yellow-400 mr-2" />
                  실시간 DB 검증 및 수집 현황 로그
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  총 {testDbList.length}건 시뮬레이션
                </span>
              </div>

              {/* Feed List */}
              <div className="space-y-3">
                {testDbList.map((item) => {
                  let badgeBg = 'bg-emerald-950 text-emerald-300 border-emerald-800';
                  let statusText = '정상 유효 DB';
                  let icon = <CheckCircle2 size={16} className="text-emerald-400" />;

                  if (item.status === 'duplicate') {
                    badgeBg = 'bg-amber-950 text-amber-300 border-amber-800';
                    statusText = '중복 접수 차단';
                    icon = <AlertTriangle size={16} className="text-amber-400" />;
                  } else if (item.status === 'abusing_ip') {
                    badgeBg = 'bg-rose-950 text-rose-300 border-rose-800';
                    statusText = '어뷰징 IP 차단';
                    icon = <XCircle size={16} className="text-rose-400" />;
                  } else if (item.status === 'invalid_phone') {
                    badgeBg = 'bg-rose-950 text-rose-300 border-rose-800';
                    statusText = '허위 번호 차단';
                    icon = <XCircle size={16} className="text-rose-400" />;
                  }

                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          {icon}
                          <span className="text-xs font-black text-white">{item.name}</span>
                          <span className="text-xs font-mono text-slate-400">({item.phone})</span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${badgeBg}`}>
                            {statusText}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center space-x-2">
                          <span>{item.channel}</span>
                          <span>•</span>
                          <span className="font-mono">{item.ip}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-medium">
                          사유: {item.reason}
                        </p>
                      </div>

                      <div className="sm:text-right shrink-0">
                        {item.notificationSent ? (
                          <span className="inline-flex items-center text-[10px] font-bold text-sky-300 bg-sky-950 px-2.5 py-1 rounded-full border border-sky-800">
                            <MessageSquare size={12} className="mr-1" />
                            알림톡 발송완료
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[10px] font-bold text-slate-500 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                            알림톡 차단
                          </span>
                        )}
                        <div className="text-[10px] text-slate-500 mt-1 font-mono">{item.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
              💡 실제 구축 시 카카오 알림톡, 텔레그램, 구글 스프레드시트, 자사 CRM과 Webhook 연동 가능합니다.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
