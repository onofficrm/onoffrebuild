import { MessageSquare, Users, MapPin, TrendingUp, Search, Link as LinkIcon, CheckCircle2, ShieldCheck, PenTool, LayoutTemplate, Star, MessageCircle, FileText, HelpCircle, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CafeService() {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="py-24 bg-blue-900 border-b border-blue-800 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-blue-800/60 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 bg-blue-800/50 text-blue-200 border border-blue-700/50 rounded-full text-sm font-bold mb-6 tracking-wide">
            카페포스팅
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            카페 노출은 <span className="text-yellow-400">검색과 커뮤니티 반응</span>을 <br className="hidden md:block" />
            함께 만듭니다.
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 leading-relaxed font-medium max-w-3xl mx-auto">
            온오프마케팅은 업종과 키워드에 맞는 카페포스팅으로 <br className="hidden sm:block" />
            자연스러운 정보 확산과 검색 노출 흐름을 설계합니다.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => document.getElementById('consult-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-yellow-400 text-slate-900 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-500/20"
            >
              카페포스팅 상담하기
            </button>
            <button 
              onClick={() => document.getElementById('process-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-blue-800/50 text-white border border-blue-700 rounded-xl font-bold text-lg hover:bg-blue-800 transition-colors"
            >
              진행 방식 보기
            </button>
          </div>
        </div>
      </section>

      {/* 1. 카페포스팅이 필요한 이유 */}
      <section className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">
              고객은 광고보다 <br className="hidden sm:block" />
              <span className="text-blue-700">커뮤니티의 정보</span>를 더 자세히 살펴봅니다.
            </h2>
            <p className="text-lg text-slate-600">입소문이 가장 강력한 마케팅인 것처럼, 커뮤니티의 생생한 반응이 전환율을 높입니다.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <MapPin size={28} />, title: '지역 기반 노출', desc: '지역 커뮤니티나 맘카페를 통해 타겟이 명확한 로컬 고객에게 효율적으로 접근합니다.', color: 'text-purple-600' },
              { icon: <Users size={28} />, title: '업종 관련 커뮤니티 반응', desc: '특정 관심사를 가진 회원들이 모인 공간에서 자연스럽게 브랜드를 인지시킵니다.', color: 'text-blue-600' },
              { icon: <Star size={28} />, title: '후기형 정보 확산', desc: '사용자의 경험이 녹아든 리뷰 형식으로 구매에 대한 불안감을 해소하고 신뢰를 제공합니다.', color: 'text-orange-600' },
              { icon: <TrendingUp size={28} />, title: '블로그 외 추가 노출 채널 확보', desc: '블로그 탭에만 의존하지 않고 카페/커뮤니티 영역까지 노출 지면을 확장합니다.', color: 'text-emerald-600' },
              { icon: <LinkIcon size={28} />, title: '홈페이지 또는 블로그 연결', desc: '관심을 보인 커뮤니티 유저를 자사 홈페이지나 공식 블로그로 유도합니다.', color: 'text-indigo-600' },
              { icon: <Search size={28} />, title: '검색결과 다양화', desc: '키워드 검색 시 블로그 뿐만 아니라 카페 게시글 영역에서도 가시성을 높입니다.', color: 'text-yellow-600' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                <div className={`w-14 h-14 bg-slate-50 flex items-center justify-center rounded-xl mb-6 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform ${item.color}`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-xl text-slate-800 mb-3">{item.title}</h3>
                <p className="text-slate-600 font-medium text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. 이런 분에게 추천 (모바일: 게시글 느낌 카드) */}
      <section className="py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 rounded-3xl p-8 md:p-12 border border-blue-100">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center tracking-tight">
              이런 분들께 <span className="text-blue-700">카페포스팅</span>을 추천합니다
            </h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              {[
                { title: '네이버 카페 노출이 필요한 분', meta: '노출 영역 확장' },
                { title: '지역 기반 마케팅을 하고 싶은 분', meta: '맘카페, 지역 커뮤니티 타겟' },
                { title: '블로그 외 추가 노출 채널이 필요한 분', meta: '다채널 검색 장악' },
                { title: '후기형 콘텐츠가 필요한 분', meta: '신뢰도 높은 실제 후기' },
                { title: '홈페이지로 유입을 만들고 싶은 분', meta: '관심 고객 트래픽 연결' },
                { title: '병원, 학원, 법률, 지역서비스 업종', meta: '고관여 B2C, 로컬 비즈니스' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                    <Users size={20} />
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                      <span className="text-slate-800 font-bold text-lg">{item.title}</span>
                      <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded inline-block w-max mt-2 md:mt-0">{item.meta}</span>
                    </div>
                    <p className="text-sm text-slate-500 flex items-center">
                      <MessageCircle size={14} className="mr-1" /> 온오프마케팅 제안 <span className="mx-2">·</span> 조희수 1,204
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. 콘텐츠 유형 */}
      <section className="py-24 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              카페 성격에 맞는 콘텐츠를 기획합니다.
            </h2>
            <p className="text-lg text-slate-400">카페 규정과 성향을 파악해 가장 자연스러운 형태로 작성합니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: '정보성 포스팅', icon: <FileText size={24} />, desc: '회원들이 실질적으로 필요로 하는 양질의 정보와 함께 브랜드를 간접적으로 노출합니다.' },
              { title: '후기형 포스팅', icon: <Star size={24} />, desc: '직접 서비스를 경험한 듯한 리뷰 형태로 공감대를 형성하고 신뢰를 부여합니다.' },
              { title: '질문 답변형 포스팅', icon: <HelpCircle size={24} />, desc: '궁금증을 묻고 답변하는 형식(Q&A)으로 커뮤니티의 자연스러운 여론을 주도합니다.' },
              { title: '지역 기반 포스팅', icon: <MapPin size={24} />, desc: '동네 상권, 맘카페 등 지역 특색에 맞춰 로컬 친화적인 언어로 소통합니다.' },
              { title: '비교형 포스팅', icon: <Scale size={24} />, desc: '타 서비스와의 객관적인 비교를 통해 자사 서비스만의 강점과 합리성을 부각합니다.' },
              { title: '홈페이지 연결 포스팅', icon: <LinkIcon size={24} />, desc: '관심을 유발한 뒤 더 자세한 정보를 확인할 수 있도록 홈페이지 링크를 제공합니다.' }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-blue-500 transition-colors group">
                <div className="w-12 h-12 bg-slate-700 text-blue-400 flex items-center justify-center rounded-xl mb-6 shadow-sm">
                  {item.icon}
                </div>
                <h3 className="font-bold text-xl text-slate-200 mb-3">{item.title}</h3>
                <p className="text-slate-400 font-medium text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 진행 방식 */}
      <section id="process-section" className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              카페포스팅 진행 방식
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 relative">
            {/* 연결선 */}
            <div className="hidden md:block absolute top-[52px] left-[10%] right-[10%] h-0.5 bg-slate-100 z-0"></div>
            
            {[
              { title: '업종 확인', desc: '브랜드, 제품 파악' },
              { title: '키워드 확인', desc: '타겟 검색어 추출' },
              { title: '콘텐츠 방향 설정', desc: '게시물 기획' },
              { title: '카페포스팅 진행', desc: '원고 작성 및 배포' },
              { title: '결과 공유', desc: '게시글 URL 취합' },
              { title: '추가 운영 제안', desc: '마케팅 방향 피드백' }
            ].map((step, idx) => (
              <div key={idx} className="text-center relative z-10 bg-white group">
                <div className="w-14 h-14 mx-auto bg-slate-50 border-2 border-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {idx + 1}
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-1">{step.title}</h3>
                <p className="text-slate-500 font-medium text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 함께 사용하면 좋은 서비스 */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              함께 사용하면 좋은 서비스
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: '홈페이지 제작', icon: <LayoutTemplate size={24} /> },
              { title: '블로그포스팅', icon: <PenTool size={24} /> },
              { title: '트래픽 서비스', icon: <TrendingUp size={24} /> },
              { title: 'SEO 콘텐츠 설계', icon: <Search size={24} /> }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 text-center hover:border-blue-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 mx-auto bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-slate-800">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. 주의 안내 */}
      <section className="py-20 bg-blue-50 border-y border-blue-100">
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <ShieldCheck className="w-16 h-16 mx-auto text-blue-600 mb-6" />
           <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 tracking-tight">
             자연스러운 정보성 콘텐츠를 지향합니다.
           </h2>
           <p className="text-lg text-slate-700 leading-relaxed font-medium">
             온오프마케팅은 무리한 홍보성 문구로 도배하기보다, <br className="hidden sm:block" />
             검색 사용자와 커뮤니티 이용자가 자연스럽게 읽고 공감할 수 있는 <br className="hidden sm:block" />
             정보성 단계를 지향합니다. 커뮤니티의 분위기를 해치지 않는 선에서 브랜드를 알립니다.
           </p>
         </div>
      </section>

    </main>
  );
}
