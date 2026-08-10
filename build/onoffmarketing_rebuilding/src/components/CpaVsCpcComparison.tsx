import { Check, X, ShieldAlert, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CpaVsCpcComparison() {
  const comparisonRows = [
    {
      feature: '광고비 과금 시점',
      cpc: '단순 클릭 시 무조건 차감 (실제 상담/구매 불확실)',
      otherCpa: '접수된 DB 당 과금 (품질 검증 미흡 가능성)',
      onoff: '광고주 직접 검증 후 승인 완료된 DB만 차감',
      onoffHighlight: true,
    },
    {
      feature: '어뷰징 및 불량 DB 통제',
      cpc: '부정 클릭 위험, 매크로 IP 노출 위험성 존재',
      otherCpa: '플랫폼 자체 규정에만 의존하여 승인 통제 불가',
      onoff: '중복 번호, 10자 미달, 어뷰징 IP 자동 거절 + 수동 승인',
      onoffHighlight: true,
    },
    {
      feature: '플랫폼 소유 및 브랜드 독자성',
      cpc: '외부 검색엔진 플랫폼 종속 (자사 브랜드 브랜딩 불가)',
      otherCpa: '타사 플랫폼 내 단순 캠페인 입점',
      onoff: '자유 도메인 기반 자사 브랜드 전용 SaaS 플랫폼 보유',
      onoffHighlight: true,
    },
    {
      feature: '카카오 알림톡 & 실시간 연동',
      cpc: '웹로그 분석 도구 별도 연결 및 지연 발생',
      otherCpa: '엑셀 수동 다운로드 및 이메일 알림 수준',
      onoff: 'DB 수집 즉시 광고주 단톡방 & 카카오 알림톡 실시간 전송',
      onoffHighlight: true,
    },
    {
      feature: '파트너 정산 및 가이드 통제',
      cpc: '지정 매체 외 파트너 직접 모집 불가능',
      otherCpa: '플랫폼이 파트너 보유, 개별 통제 불가능',
      onoff: '자사 전용 제휴 파트너 직접 모집, 승인 및 정산 제어',
      onoffHighlight: true,
    },
    {
      feature: '마케팅 리소스 절감율',
      cpc: '키워드 입찰가 관리 및 잦은 이탈로 고비용 소모',
      otherCpa: '수기 DB 검증에 많은 시간 소요',
      onoff: 'iCRM 자동화 및 백엔드 필터링으로 운영시간 80% 절감',
      onoffHighlight: true,
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-900 border border-blue-200 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4">
            <Zap size={14} className="text-blue-600 fill-blue-600" />
            <span>비교 포인터 리포트</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            기존 CPC 광고 vs 타사 CPA vs <span className="text-blue-900">온오프CPA</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            왜 고관여 업종 및 성과 중심 기업들이 단순 클릭 과금(CPC)을 벗어나 온오프CPA 시스템으로 전환하고 있는지 핵심 차별점을 확인해 보세요.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[768px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-900 text-white">
                  <th className="py-5 px-6 text-sm font-extrabold w-1/4">구분 및 주요 기능</th>
                  <th className="py-5 px-6 text-xs sm:text-sm font-bold text-slate-400 w-1/4">
                    기존 키워드 검색광고 (CPC)
                  </th>
                  <th className="py-5 px-6 text-xs sm:text-sm font-bold text-slate-400 w-1/4">
                    타사 CPA 에이전시 입점
                  </th>
                  <th className="py-5 px-6 text-sm font-black text-yellow-300 bg-blue-950 w-1/4 border-l border-blue-800">
                    <div className="flex items-center space-x-1.5">
                      <Sparkles size={16} className="text-yellow-400" />
                      <span>온오프CPA (자체 플랫폼)</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs sm:text-sm font-medium">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-extrabold text-slate-900 bg-slate-50/50">
                      {row.feature}
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      <div className="flex items-start">
                        <X size={16} className="text-rose-500 mr-2 shrink-0 mt-0.5" />
                        <span>{row.cpc}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      <div className="flex items-start">
                        <ShieldAlert size={16} className="text-amber-500 mr-2 shrink-0 mt-0.5" />
                        <span>{row.otherCpa}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-blue-950 font-bold bg-blue-50/60 border-l border-blue-200">
                      <div className="flex items-start">
                        <Check size={18} className="text-blue-700 mr-2 shrink-0 mt-0.5 stroke-[3]" />
                        <span className="leading-snug">{row.onoff}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Bottom Banner */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-800/80 rounded-2xl border border-blue-700 text-yellow-300">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-white">독립 CPA 플랫폼 구축으로 마케팅 자산을 내 것으로 만드세요.</h4>
                <p className="text-xs text-blue-200">초기 구축비 및 서버 커스텀에 대한 무료 기술 컨설팅을 제공해 드립니다.</p>
              </div>
            </div>

            <Link
              to="/consult"
              className="whitespace-nowrap px-6 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 text-xs sm:text-sm font-black rounded-xl transition-all shadow-md hover:shadow-lg flex items-center"
            >
              <span>플랫폼 도입 문의하기</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
