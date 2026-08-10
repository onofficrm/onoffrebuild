import { PenTool, Search, FileText, Link as LinkIcon, MapPin, TrendingUp, CheckCircle2, History, Scale, BookOpen, Layers, Target, MousePointerClick, Star, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BlogService() {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="py-24 bg-blue-900 border-b border-blue-800 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-800 rounded-full blur-[150px] pointer-events-none opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 bg-blue-800/50 text-blue-200 border border-blue-700/50 rounded-full text-sm font-bold mb-6 tracking-wide">
            블로그포스팅
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            검색되는 블로그 콘텐츠가 <br className="hidden md:block" />
            <span className="text-yellow-400">브랜드 신뢰</span>를 만듭니다.
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 leading-relaxed font-medium max-w-3xl mx-auto">
            온오프마케팅은 키워드 기반 블로그포스팅으로 <br className="hidden sm:block" />
            브랜드 노출과 홈페이지 유입을 함께 설계합니다.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => document.getElementById('consult-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-yellow-400 text-slate-900 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-500/20"
            >
              블로그포스팅 상담하기
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

      {/* 1. 블로그포스팅이 필요한 이유 */}
      <section className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">
              고객은 검색하고, 콘텐츠를 보고, <br className="hidden sm:block" />
              <span className="text-blue-700">신뢰한 뒤 문의합니다.</span>
            </h2>
            <p className="text-lg text-slate-600">블로그는 귀사의 전문성을 증명하는 가장 확실한 자산입니다.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Search size={28} />, title: '키워드 검색 노출', desc: '고객이 검색하는 정확한 키워드를 공략하여 브랜드 노출 기회를 만듭니다.', color: 'text-blue-600' },
              { icon: <FileText size={28} />, title: '정보성 콘텐츠 확보', desc: '단순 광고가 아닌 양질의 정보성 글을 통해 가망 고객을 설득합니다.', color: 'text-emerald-600' },
              { icon: <Star size={28} />, title: '브랜드 신뢰도 강화', desc: '꾸준한 콘텐츠는 기업의 전문성과 활동성을 보여주는 신뢰 지표가 됩니다.', color: 'text-yellow-600' },
              { icon: <MousePointerClick size={28} />, title: '홈페이지 연결 유입', desc: '블로그 방문자를 자연스럽게 자사 홈페이지와 문의 페이지로 유도합니다.', color: 'text-orange-600' },
              { icon: <MapPin size={28} />, title: '지역 키워드 공략', desc: '로컬 비즈니스의 경우 지역명과 조합된 세부 키워드를 효과적으로 선점합니다.', color: 'text-purple-600' },
              { icon: <Layers size={28} />, title: '업종별 콘텐츠 자산 축적', desc: '휘발성 광고가 아닌, 검색엔진에 영구히 남는 기업의 정보 자산을 쌓습니다.', color: 'text-indigo-600' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-lg transition-all group">
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

      {/* 2. 이런 분에게 추천 */}
      <section className="py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 rounded-3xl p-8 md:p-12 border border-blue-100">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center tracking-tight">
              이런 분들께 <span className="text-blue-700">블로그포스팅</span>을 추천합니다
            </h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              {[
                '직접 블로그를 운영할 시간이 부족한 대표님',
                '어떤 키워드로 글을 써야 노출되는지 막막하신 분',
                '홈페이지와 블로그를 서로 연결하여 유입을 늘리고 싶은 분',
                '지역 + 서비스명 조합의 타겟 키워드를 장악하고 싶은 분',
                '전문성이 필요한 병원, 법률, 세무, 학원, B2B 서비스 업종',
                '단기적인 성과뿐만 아니라 장기적인 콘텐츠 자산을 구축하고 싶은 분'
              ].map((text, idx) => (
                <div key={idx} className="flex items-center bg-white p-4 md:p-5 rounded-xl border border-blue-100 shadow-sm">
                  <CheckCircle2 className="text-blue-600 mr-4 shrink-0" size={24} />
                  <span className="text-slate-700 font-bold">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. 제공 가능한 콘텐츠 유형 */}
      <section className="py-24 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              목적에 맞는 블로그 콘텐츠를 기획합니다.
            </h2>
            <p className="text-lg text-slate-400">단순 글쓰기가 아닌, 마케팅 효율을 높이는 기획이 필요합니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: '정보성 콘텐츠', icon: <BookOpen size={24} />, desc: '사용자의 궁금증을 해결해주며 자연스럽게 브랜드를 인지시킵니다.' },
              { title: '후기형 콘텐츠', icon: <CheckCircle2 size={24} />, desc: '실제 사례와 성과를 바탕으로 고객의 구매/문의 결정을 돕습니다.' },
              { title: '비교형 콘텐츠', icon: <Scale size={24} />, desc: '서비스나 제품의 장점을 타 사나 일반적인 기준과 비교하여 강조합니다.' },
              { title: '질문형 콘텐츠', icon: <HelpCircle size={24} />, desc: 'AEO(AI답변)에 노출되기 쉽도록 질문과 핵심 답변 형태로 구성합니다.' },
              { title: '지역 키워드 콘텐츠', icon: <MapPin size={24} />, desc: '특정 지역 검색자를 타겟팅하여 로컬 방문 및 문의를 유도합니다.' },
              { title: '홈페이지 연결 콘텐츠', icon: <LinkIcon size={24} />, desc: '해당 글을 읽고 자연스럽게 자사 홈페이지 상세 페이지로 넘어가게 설계합니다.' }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-800 p-8 rounded-2xl border border-slate-700 flex flex-col h-full hover:border-blue-500 hover:bg-slate-800/80 transition-all cursor-default relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full pointer-events-none group-hover:bg-blue-500/10 transition-colors"></div>
                <div className="w-12 h-12 bg-slate-700 text-blue-400 flex items-center justify-center rounded-xl mb-6 border border-slate-600 relative z-10">
                  {item.icon}
                </div>
                <h3 className="font-bold text-xl text-slate-200 mb-3 relative z-10">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium text-sm relative z-10 flex-grow">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 진행 프로세스 */}
      <section id="process-section" className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              블로그포스팅 진행 순서
            </h2>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-4 md:ml-12">
            {[
              { title: '업종 분석', desc: '브랜드와 제공 서비스, 주요 고객층의 특징을 파악합니다.' },
              { title: '키워드 선정', desc: '검색량과 경쟁도를 고려해 선점 가능한 핵심 키워드를 추출합니다.' },
              { title: '콘텐츠 기획', desc: '무조건적인 홍보가 아닌, 정보 전달 중심의 스토리텔링을 기획합니다.' },
              { title: '원고 작성', desc: '전문 작가가 SEO 구조를 반영하여 가독성 높은 원고를 작성합니다.' },
              { title: '발행 또는 납품', desc: '자사 블로그에 직접 배포하거나, 작성된 원고를 제공해 드립니다.' },
              { title: '결과 확인', desc: '발행된 글의 노출 현황과 클릭 반응 등 결과를 점검합니다.' }
            ].map((step, idx) => (
              <div key={idx} className="mb-12 last:mb-0 relative py-2">
                <div className="absolute top-2 -left-[2.15rem] w-8 h-8 rounded-full bg-blue-100 border-4 border-white flex items-center justify-center shadow-sm text-blue-700 font-bold text-sm z-10">
                  {idx + 1}
                </div>
                <div className="pl-6 md:pl-10">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{step.title}</h3>
                  <p className="text-slate-600 font-medium text-lg bg-slate-50 p-4 rounded-xl border border-slate-100">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 홈페이지와 연결하는 전략 */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 tracking-tight leading-tight">
                블로그만 운영하지 않고 <br />
                <span className="text-blue-700">홈페이지와 연결합니다.</span>
              </h2>
              <ul className="space-y-6">
                {[
                  '단순 방문에서 끝나지 않도록 자사 홈페이지로의 이동을 유도합니다.',
                  '포스팅 주제와 연관된 홈페이지 내 구체적인 서비스 페이지로 링크를 배치합니다.',
                  '가격을 확인하거나 상담을 신청할 수 있는 액션 페이지(CTA)로 연결합니다.',
                  '카페포스팅과 트래픽 서비스를 함께 활용해 더 큰 시너지를 만들어냅니다.'
                ].map((text, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mt-1 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4 shrink-0 font-bold border border-blue-200">✓</span>
                    <span className="text-slate-700 font-medium text-lg leading-relaxed">{text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <button 
                  onClick={() => document.getElementById('consult-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-white border border-slate-200 text-slate-800 rounded-xl font-bold text-lg hover:bg-slate-50 transition-colors inline-flex items-center shadow-sm"
                >
                  블로그포스팅 상담하기 <Target className="ml-2" size={20} />
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 relative z-10">
                {/* 상단 블로그 UI 형상화 */}
                <div className="border border-slate-100 rounded-2xl p-5 mb-8 bg-slate-50 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 bg-blue-500 h-full"></div>
                  <div className="pl-4">
                    <div className="text-xs font-bold text-slate-400 mb-1">Naver Blog Search</div>
                    <div className="font-bold text-slate-800 text-lg mb-2">업종별 맞춤 필수 키워드 정보글</div>
                    <div className="w-3/4 h-2 bg-slate-200 rounded-full mb-2"></div>
                    <div className="w-1/2 h-2 bg-slate-200 rounded-full mb-4"></div>
                    <div className="inline-flex items-center text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                      <LinkIcon size={14} className="mr-1" /> 자세히 보기
                    </div>
                  </div>
                </div>

                <div className="flex justify-center -my-6 relative z-20">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100 text-slate-400">
                    <TrendingUp size={24} />
                  </div>
                </div>

                {/* 하단 홈페이지 UI 형상화 */}
                <div className="border border-blue-200 rounded-2xl p-5 bg-blue-50 mt-8 shadow-sm relative overflow-hidden">
                  <div className="text-center pt-2">
                    <div className="text-xs font-bold text-blue-500 mb-1">Company Website</div>
                    <div className="font-bold text-slate-900 text-lg mb-3">전환되는 랜딩페이지 접속 완료</div>
                    <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-md">
                      무료 상담 신청 완료
                    </button>
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-100/50 rounded-full blur-[80px] -z-0"></div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
