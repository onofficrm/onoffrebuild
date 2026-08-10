import { Settings, MessageCircle, DollarSign, Layout, Layers, Database, BarChart, Users, Cpu, FileText, Share2, Workflow, Bot, CheckCircle2 } from 'lucide-react';
import RealResultsAndCasesSection from '../components/RealResultsAndCasesSection';

export default function Platform() {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="py-24 bg-slate-900 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] pointer-events-none opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600 rounded-full blur-[100px] pointer-events-none opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center px-4 py-1.5 bg-blue-900/50 text-blue-300 border border-blue-800/50 rounded-full text-sm font-bold mb-6 tracking-wide shadow-sm">
            <Cpu size={16} className="mr-2" />
            플랫폼 및 마케팅 자동화
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            홈페이지를 넘어 <br className="hidden md:block" />
            <span className="text-blue-400">자동화와 플랫폼</span>까지 확장합니다.
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed font-medium max-w-3xl mx-auto">
            온오프마케팅은 홈페이지 제작뿐 아니라 <br className="hidden sm:block" />
            CRM, 채팅자동화, 애드센스자동화, 맞춤형 플랫폼 제작까지 확장 가능한 구조를 제안합니다.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => document.getElementById('consult-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
            >
              플랫폼 제작 상담하기
            </button>
            <button 
              onClick={() => document.getElementById('service-cards')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-slate-800 text-slate-200 border border-slate-700 rounded-xl font-bold text-lg hover:bg-slate-700 transition-colors"
            >
              자동화 서비스 보기
            </button>
          </div>
        </div>
      </section>

      {/* 1. 플랫폼 서비스 소개 */}
      <section className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">
              온라인마케팅은 <br className="hidden sm:block" />
              <span className="text-blue-700">홈페이지 하나로 끝나지 않습니다.</span>
            </h2>
            <p className="text-lg text-slate-600">수익을 극대화하고 운영 효율을 높이는 시스템 연결이 필수입니다.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: <Users size={24} />, title: '고객 관리' },
              { icon: <MessageCircle size={24} />, title: '문의 자동화' },
              { icon: <FileText size={24} />, title: '콘텐츠 자동화' },
              { icon: <DollarSign size={24} />, title: '수익형 사이트' },
              { icon: <Layout size={24} />, title: '맞춤형 개발' },
              { icon: <BarChart size={24} />, title: '데이터 운영' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-sm hover:border-blue-300 transition-all">
                <div className="w-12 h-12 mx-auto bg-slate-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 border border-slate-100">
                  {item.icon}
                </div>
                <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. 플랫폼 카드 4개 */}
      <section id="service-cards" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
            {/* 카드 1 */}
            <div className="bg-slate-900 rounded-3xl p-8 lg:p-10 border border-slate-800 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[60px] rounded-full group-hover:bg-blue-600/30 transition-colors"></div>
              <div className="w-14 h-14 bg-slate-800 border border-slate-700 text-blue-400 rounded-xl flex items-center justify-center mb-6 relative z-10 shadow-sm">
                <Settings size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 relative z-10">마케팅자동화(iCRM)</h3>
              <p className="text-slate-400 text-lg leading-relaxed relative z-10 font-medium">
                문의, 고객 관리, 상담 흐름을 효율적으로 관리하기 위한 마케팅 자동화 구조입니다.
              </p>
            </div>

            {/* 카드 2 */}
            <div className="bg-slate-900 rounded-3xl p-8 lg:p-10 border border-slate-800 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-[60px] rounded-full group-hover:bg-indigo-600/30 transition-colors"></div>
              <div className="w-14 h-14 bg-slate-800 border border-slate-700 text-indigo-400 rounded-xl flex items-center justify-center mb-6 relative z-10 shadow-sm">
                <Bot size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 relative z-10">채팅자동화</h3>
              <p className="text-slate-400 text-lg leading-relaxed relative z-10 font-medium">
                상담 문의, 자주 묻는 질문, 고객 응대를 자동화하여 전환율을 높일 수 있습니다.
              </p>
            </div>

            {/* 카드 3 */}
            <div className="bg-slate-900 rounded-3xl p-8 lg:p-10 border border-slate-800 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/20 blur-[60px] rounded-full group-hover:bg-emerald-600/30 transition-colors"></div>
              <div className="w-14 h-14 bg-slate-800 border border-slate-700 text-emerald-400 rounded-xl flex items-center justify-center mb-6 relative z-10 shadow-sm">
                <DollarSign size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 relative z-10">애드센스자동화</h3>
              <p className="text-slate-400 text-lg leading-relaxed relative z-10 font-medium">
                콘텐츠 기반 수익형 사이트 운영을 위한 자동화 구조를 설계합니다.
              </p>
            </div>

            {/* 카드 4 */}
            <div className="bg-slate-900 rounded-3xl p-8 lg:p-10 border border-slate-800 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 blur-[60px] rounded-full group-hover:bg-purple-600/30 transition-colors"></div>
              <div className="w-14 h-14 bg-slate-800 border border-slate-700 text-purple-400 rounded-xl flex items-center justify-center mb-6 relative z-10 shadow-sm">
                <Layout size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 relative z-10">플랫폼 제작의뢰</h3>
              <p className="text-slate-400 text-lg leading-relaxed relative z-10 font-medium">
                예약, 매칭, 커뮤니티, 리드수집 등 사업 목적에 맞는 맞춤형 플랫폼 제작을 상담할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 실제 성과와 사례 섹션 */}
      <RealResultsAndCasesSection />

      {/* 3. 홈페이지와의 연결 */}
      <section className="py-24 bg-slate-50 border-t border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              {/* 대시보드 UI 형상화 */}
              <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-6 relative z-10">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    </div>
                    <span className="text-xs font-bold text-slate-400 ml-2 uppercase">Workflow Dashboard</span>
                  </div>
                  <div><Workflow size={16} className="text-slate-400" /></div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-blue-50 border border-blue-100 rounded-xl">
                    <Database size={18} className="text-blue-500 mr-3 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-slate-800">홈페이지 고객 DB 수집 완료</div>
                      <div className="text-xs text-slate-500 line-clamp-1">신규 리드 42건 동기화 됨</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <MessageCircle size={18} className="text-indigo-500 mr-3 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-slate-800">알림톡/메시지 자동 발송</div>
                      <div className="text-xs text-slate-500 line-clamp-1">신규 가입자 웰컴 메시지</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <BarChart size={18} className="text-emerald-500 mr-3 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-slate-800">SEO 데이터 분석 및 리포팅</div>
                      <div className="text-xs text-slate-500 line-clamp-1">전환율 3.4% 상승</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/40 rounded-full blur-[80px] -z-0 pointer-events-none"></div>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 tracking-tight leading-tight">
                홈페이지 제작 후 <br />
                <span className="text-blue-700">플랫폼으로 확장</span>할 수 있습니다.
              </h2>
              <ul className="space-y-6">
                {[
                  '홈페이지에서 발생한 문의와 고객 DB 자동 수집',
                  '상담용 챗봇 및 자동화 메시지 연결 구조',
                  'SEO 최적화된 콘텐츠의 자동 발행 구조 구축',
                  'iCRM 기반의 체계적인 리드(고객) 관리 도입',
                  '광고 및 검색 성과 데이터에 기반한 사이트 개선'
                ].map((text, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="mt-1 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4 shrink-0 shadow-sm border border-blue-200">
                      <Workflow size={12} className="text-blue-700" />
                    </div>
                    <span className="text-slate-700 font-medium text-lg leading-relaxed">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 이런 사업자에게 적합 */}
      <section className="py-24 bg-slate-900 text-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              이런 사업자에게 적합합니다
            </h2>
          </div>

          <div className="grid gap-4">
            {[
              { icon: <MessageCircle />, text: '고객 문의가 많아 응대 자동화가 필요한 서비스업' },
              { icon: <Users />, text: '단순 DB 수집을 넘어 고객 관리를 체계화하고 싶은 사업자' },
              { icon: <Layers />, text: '대량의 정보를 다루며 콘텐츠 발행 자동화를 원하는 사업자' },
              { icon: <DollarSign />, text: '블로그 형식의 수익형 운영 사이트를 구축하고 싶은 사업자' },
              { icon: <Layout />, text: '단순 회사소개용이 아닌 예약, 매칭 등의 기능형 플랫폼이 필요한 사업자' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-blue-400 mr-5 shrink-0 border border-slate-600">
                  {item.icon}
                </div>
                <span className="text-slate-200 font-medium text-lg">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
