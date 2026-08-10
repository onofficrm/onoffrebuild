import { Blocks, Database, MessageSquareWarning, Zap } from 'lucide-react';

const platforms = [
  {
    icon: <Database className="w-6 h-6 text-blue-700" />,
    title: '마케팅자동화 (iCRM)',
    desc: '고객 데이터를 수집, 분류하고 자동화된 메시지 발송으로 재구매율을 높이는 스마트 CRM 구축'
  },
  {
    icon: <MessageSquareWarning className="w-6 h-6 text-blue-700" />,
    title: '채팅자동화',
    desc: '24시간 고객 응대가 가능한 AI 챗봇 및 카카오톡 자동화 시나리오 설계로 CS 리소스 절감'
  },
  {
    icon: <Zap className="w-6 h-6 text-blue-700" />,
    title: '애드센스자동화',
    desc: '구글 애드센스 수익형 블로그 및 웹사이트의 콘텐츠 발행 및 트래픽 유입 자동화 시스템'
  },
  {
    icon: <Blocks className="w-6 h-6 text-blue-700" />,
    title: '플랫폼 제작의뢰',
    desc: '단순 홈페이지를 넘어 결제, 예약, 회원관리 기능이 포함된 맞춤형 웹 플랫폼 및 SaaS 개발'
  }
];

export default function PlatformSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              마케팅 자동화와 플랫폼 제작도 <br className="hidden sm:block" />
              함께 고민합니다.
            </h2>
            <p className="text-lg text-slate-600">
              온오프마케팅은 단순 홈페이지 제작뿐 아니라 CRM, 채팅자동화, <br className="hidden lg:block"/>
              애드센스자동화, 맞춤형 플랫폼 제작까지 비즈니스의 확장에 필요한 기술적 구조를 제안합니다.
            </p>
          </div>
          <div className="hidden lg:block pb-2">
            <button className="px-6 py-2 border-2 border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition-colors text-sm">
              플랫폼 기술력 보기
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((item, idx) => (
            <div key={idx} className="group bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:bg-blue-900 transition-colors duration-300">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6 shadow-sm group-hover:bg-blue-800 transition-colors">
                {/* Need to conditionally change icon color on hover using standard Tailwind, wait the icon inside is colored text-blue-700, let's keep it simple or override */}
                <div className="group-hover:text-white transition-colors [&>svg]:text-blue-700 group-hover:[&>svg]:text-yellow-400">
                  {item.icon}
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-white transition-colors">{item.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed group-hover:text-blue-100 transition-colors">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 lg:hidden flex justify-center">
           <button className="px-6 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition-colors text-sm w-full sm:w-auto">
              플랫폼 기술력 전체보기
            </button>
        </div>

      </div>
    </section>
  );
}
