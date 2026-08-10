import { useState, useEffect } from 'react';
import { Sparkles, ArrowLeft, Layout, Code2, LineChart, SearchCheck, FileText, CheckCircle2, Info, ListChecks, Cpu, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

type Step = 'selection' | 'form' | 'analyzing' | 'result';
type HasWebsite = 'yes' | 'no' | null;

export default function ContactSection() {
  const [step, setStep] = useState<Step>('selection');
  const [hasWebsite, setHasWebsite] = useState<HasWebsite>(null);

  const startAnalysis = () => {
    setStep('analyzing');
  };

  useEffect(() => {
    if (step === 'analyzing') {
      const timer = setTimeout(() => {
        setStep('result');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const resetForm = () => {
    setStep('selection');
    setHasWebsite(null);
  };

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200 relative overflow-hidden" id="diagnostic-section">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-100 rounded-full blur-[100px] pointer-events-none opacity-50"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-1.5 bg-white text-blue-800 rounded-full text-sm font-bold mb-6 border border-blue-100 shadow-sm">
            <Sparkles size={16} className="mr-2 text-yellow-500" />
            1분만 입력하면 홈페이지 제작 또는 개선 방향을 확인할 수 있습니다.
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
            내 홈페이지, <br className="sm:hidden" /><span className="text-blue-700">AI 검색 시대</span>에 준비되어 있을까요?
          </h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-slate-800 font-semibold mb-3">
              SEO를 넘어 AEO까지, 이제 홈페이지는 검색엔진과 AI가 이해할 수 있는 구조로 만들어야 합니다.
            </p>
            <p className="text-base text-slate-600">
              홈페이지가 없다면 업종과 공략 키워드를 기준으로 제작 방향을 안내하고,<br className="hidden md:block" />
              홈페이지가 있다면 현재 사이트에 필요한 콘텐츠와 노출 전략을 진단합니다.
            </p>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-10 transition-all duration-500 relative min-h-[400px] flex flex-col justify-center">
          
          {step === 'selection' && (
            <div className="space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">AI 홈페이지 노출 전략 진단</h3>
                <p className="text-slate-500 text-lg">현재 홈페이지가 있으신가요?</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <button
                  onClick={() => { setHasWebsite('yes'); setStep('form'); }}
                  className="flex flex-col items-center justify-center p-8 border-2 rounded-2xl transition-all duration-300 border-slate-200 bg-slate-50 hover:border-blue-500 hover:bg-blue-50 group"
                >
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                    <Layout size={32} className="text-blue-600" />
                  </div>
                  <span className="text-xl font-bold text-slate-800">홈페이지가 있어요</span>
                </button>

                <button
                  onClick={() => { setHasWebsite('no'); setStep('form'); }}
                  className="flex flex-col items-center justify-center p-8 border-2 rounded-2xl transition-all duration-300 border-slate-200 bg-slate-50 hover:border-yellow-500 hover:bg-yellow-50 group"
                >
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                    <Code2 size={32} className="text-yellow-600" />
                  </div>
                  <span className="text-xl font-bold text-slate-800">홈페이지가 없어요</span>
                </button>
              </div>
            </div>
          )}

          {/* Form Step for NO Website */}
          {step === 'form' && hasWebsite === 'no' && (
            <div className="animate-in slide-in-from-right duration-500 h-full flex flex-col">
              <button type="button" onClick={() => setStep('selection')} className="self-start flex items-center text-sm font-bold text-slate-500 hover:text-slate-800 mb-6 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                <ArrowLeft size={16} className="mr-1.5" /> 이전으로
              </button>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">새 홈페이지 제작 방향 진단해드립니다.</h3>
                <p className="text-slate-500 text-sm">업종, 지역, 공략 키워드를 입력하면 어떤 구조의 홈페이지를 만들면 좋을지 AI가 안내합니다.</p>
              </div>

              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); startAnalysis(); }}>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">1. 업종</label>
                    <input type="text" required placeholder="예: 피부과, 법률사무소, 유학원, 인테리어, 청소업체" className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">2. 지역</label>
                    <input type="text" placeholder="예: 수원, 강남, 세부, 부산, 전국" className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 shadow-sm" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">3. 대표 서비스</label>
                    <input type="text" required placeholder="예: 여드름 치료, 개인회생 상담, 영어캠프, 입주청소" className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">4. 공략하고 싶은 키워드</label>
                    <input type="text" placeholder="예: 수원 피부과, 개인회생 상담, 세부 영어캠프" className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 shadow-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">5. 홈페이지 제작 목적</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['문의 상담', '예약 신청', '강의 판매', '브랜드 소개', '지역 검색 노출', '플랫폼 구축', '기타'].map((item) => (
                      <label key={item} className="flex items-center space-x-3 cursor-pointer p-3.5 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 bg-white shadow-sm transition-colors group">
                        <input type="checkbox" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-slate-300 group-hover:border-blue-400 cursor-pointer" />
                        <span className="text-sm font-semibold text-slate-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">6. 제작 방식</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {['직접 만들고 싶어요', '제작을 맡기고 싶어요', '아직 모르겠어요'].map((item) => (
                      <label key={item} className="flex items-center space-x-3 cursor-pointer p-3.5 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 bg-white shadow-sm transition-colors group">
                        <input type="radio" name="build_type" className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer" />
                        <span className="text-sm font-semibold text-slate-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-8 flex flex-col items-center">
                  <button type="submit" className="w-full md:w-auto md:min-w-[320px] px-8 py-5 bg-blue-900 text-white rounded-xl font-bold text-lg hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/30 flex items-center justify-center">
                    <Sparkles size={22} className="mr-2 text-yellow-400" /> AI 제작 방향 진단하기
                  </button>
                  <p className="text-slate-500 text-xs mt-4">정확한 정보를 입력할수록 더 구체적인 진단 결과를 받을 수 있습니다.</p>
                </div>
              </form>
            </div>
          )}

          {/* Form Step for HAS Website */}
          {step === 'form' && hasWebsite === 'yes' && (
             <div className="animate-in slide-in-from-right duration-500 h-full flex flex-col">
               <button type="button" onClick={() => setStep('selection')} className="self-start flex items-center text-sm font-bold text-slate-500 hover:text-slate-800 mb-6 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                 <ArrowLeft size={16} className="mr-1.5" /> 이전으로
               </button>
               <div className="mb-8">
                 <h3 className="text-2xl font-bold text-slate-800 mb-2">기존 홈페이지의 SEO/AEO 개선 방향을 진단해드립니다.</h3>
                 <p className="text-slate-500 text-sm">현재 홈페이지 주소와 고민을 입력하면 AI 검색 시대에 필요한 개선 방향을 안내합니다.</p>
               </div>

               <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); startAnalysis(); }}>
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">1. 홈페이지 주소</label>
                   <input type="url" required placeholder="https://example.com" className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 shadow-sm" />
                 </div>

                 <div className="grid sm:grid-cols-2 gap-6">
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">2. 업종</label>
                     <input type="text" required placeholder="예: 피부과, 법률사무소, 유학원, 인테리어, 청소업체" className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 shadow-sm" />
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">3. 지역</label>
                     <input type="text" placeholder="예: 수원, 강남, 세부, 부산, 전국" className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 shadow-sm" />
                   </div>
                 </div>

                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">4. 현재 공략 중인 키워드</label>
                   <input type="text" placeholder="예: 수원 피부과, 강남 변호사, 세부 유학원" className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 shadow-sm" />
                 </div>

                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-3">5. 현재 가장 큰 고민</label>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                     {[
                       '검색 노출이 안 됨', '방문자는 있는데 문의가 없음', 
                       '블로그/카페 콘텐츠가 부족함', '홈페이지 내용이 오래됨', 
                       'AI 검색 시대에 맞는 콘텐츠가 없음', '어떤 문제가 있는지 모르겠음'
                     ].map((item) => (
                       <label key={item} className="flex items-center space-x-3 cursor-pointer p-3.5 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 bg-white shadow-sm transition-colors group">
                         <input type="checkbox" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-slate-300 cursor-pointer" />
                         <span className="text-sm font-semibold text-slate-700">{item}</span>
                       </label>
                     ))}
                   </div>
                 </div>

                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-3">6. 원하는 목표</label>
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                     {[
                       '검색 노출 강화', '문의 증가', '홈페이지 리뉴얼', 
                       '블로그 콘텐츠 강화', '카페포스팅 강화', '트래픽 증가', 'AEO 콘텐츠 구축'
                     ].map((item) => (
                       <label key={item} className="flex items-center space-x-3 cursor-pointer p-3.5 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 bg-white shadow-sm transition-colors group">
                         <input type="checkbox" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-slate-300 cursor-pointer" />
                         <span className="text-sm font-semibold text-slate-700">{item}</span>
                       </label>
                     ))}
                   </div>
                 </div>

                 <div className="pt-8 flex flex-col items-center">
                   <button type="submit" className="w-full md:w-auto md:min-w-[320px] px-8 py-5 bg-blue-900 text-white rounded-xl font-bold text-lg hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/30 flex items-center justify-center">
                     <Sparkles size={22} className="mr-2 text-yellow-400" /> AI 개선 방향 진단하기
                   </button>
                   <p className="text-slate-500 text-xs mt-4">정확한 정보를 입력할수록 더 구체적인 진단 결과를 받을 수 있습니다.</p>
                 </div>
               </form>
             </div>
          )}

          {/* Analyzing Step */}
          {step === 'analyzing' && (
             <div className="py-24 flex flex-col items-center justify-center text-center animate-in fade-in duration-500 max-w-lg mx-auto w-full">
                <div className="relative mb-10 shrink-0">
                  <div className="w-28 h-28 border-4 border-slate-100 rounded-full"></div>
                  <div className="w-28 h-28 border-4 border-blue-600 rounded-full border-t-transparent absolute top-0 left-0 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center bg-white m-2 rounded-full shadow-inner">
                    <Sparkles className="text-yellow-500 animate-pulse w-10 h-10" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-800 mb-4 animate-pulse">
                  AI가 업종, 키워드, 홈페이지 상황을<br className="sm:hidden" /> 분석하고 있습니다.
                </h3>
                <p className="text-slate-500 mb-12">
                  잠시만 기다려주세요. 검색 노출 구조와 콘텐츠 방향을 정리하고 있습니다.
                </p>

                <div className="w-full bg-slate-50 rounded-2xl p-6 border border-slate-100 text-left">
                  <div className="space-y-4">
                    {[
                      '업종 분석 중',
                      '키워드 방향 확인 중',
                      '홈페이지 구조 진단 중',
                      'SEO/AEO 콘텐츠 전략 정리 중',
                      '추천 서비스 매칭 중'
                    ].map((text, i) => (
                      <div key={i} className="flex items-center text-base font-bold text-slate-700 animate-in slide-in-from-bottom-2 fade-in" style={{ animationDelay: `${i * 400}ms`, animationFillMode: 'both' }}>
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mr-3 shrink-0">
                           <CheckCircle2 size={14} className="text-emerald-600" />
                        </div>
                        {text}...
                      </div>
                    ))}
                  </div>
                </div>
             </div>
          )}

          {/* Result Step */}
          {step === 'result' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="text-center mb-12">
                 <div className="inline-flex items-center justify-center px-4 py-1.5 bg-blue-50 border border-blue-200 text-blue-800 rounded-full text-sm font-bold mb-6">
                   <Sparkles size={16} className="mr-1.5 text-blue-600" />
                   진단이 완료되었습니다. 아래 전략을 확인해보세요.
                 </div>
                 <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
                   {hasWebsite === 'no' ? 'AI가 제안하는 홈페이지 제작 방향' : 'AI가 제안하는 기존 홈페이지 개선 전략'}
                 </h3>
               </div>

               {/* Conditional Result UI */}
               {hasWebsite === 'no' ? (
                  <div className="space-y-8">
                    {/* Summary */}
                    <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200 flex flex-col md:flex-row gap-6 items-start">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-slate-200">
                         <LineChart size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-800 mb-3">진단 요약</h4>
                        <p className="text-slate-700 font-medium leading-relaxed text-lg">
                          "입력하신 업종과 키워드를 기준으로 볼 때, 검색 노출을 위해서는 단순한 디자인 중심이 아닌, <mark className="bg-yellow-200 px-1 py-0.5 rounded font-bold">서비스 소개형 홈페이지와 키워드 기반 서브페이지 구성</mark>이 최우선으로 필요합니다."
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm h-full">
                        <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                           <Layout size={20} className="mr-2 text-blue-600" /> 추천 홈페이지 방향
                        </h4>
                        <p className="text-slate-600 leading-relaxed font-medium">
                          단순 회사소개형 홈페이지보다, 대표 서비스와 지역 키워드를 중심으로 한 <strong className="text-slate-800">SEO/AEO형 홈페이지 구조</strong>를 추천합니다. 고객의 검색 의도를 파악하고 질문에 답변하는 형태의 상세 페이지가 필요합니다.
                        </p>
                      </div>

                      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm h-full">
                        <h4 className="text-lg font-bold text-slate-800 mb-5 flex items-center">
                           <SearchCheck size={20} className="mr-2 text-blue-600" /> SEO/AEO 핵심 전략
                        </h4>
                        <ul className="space-y-4">
                           <li className="flex items-start text-sm text-slate-700 font-semibold">
                             <div className="w-6 h-6 rounded bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0 mr-3 mt-0.5">1</div>
                             검색엔진이 이해하기 쉬운 직관적인 메뉴 구조
                           </li>
                           <li className="flex items-start text-sm text-slate-700 font-semibold">
                             <div className="w-6 h-6 rounded bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0 mr-3 mt-0.5">2</div>
                             AI 검색에 대응하는 질문형 콘텐츠 (Q&A)
                           </li>
                           <li className="flex items-start text-sm text-slate-700 font-semibold">
                             <div className="w-6 h-6 rounded bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0 mr-3 mt-0.5">3</div>
                             업종별 핵심 키워드 랜딩 페이지 구성
                           </li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                       <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                          <FileText size={20} className="mr-2 text-blue-600" /> 추천 메뉴 구조 및 먼저 만들어야 할 콘텐츠
                       </h4>
                       <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 mb-6">
                         <div className="text-sm font-bold text-slate-500 mb-3 block">추천 메뉴 구조</div>
                         <div className="flex flex-wrap gap-2">
                           {['메인', '회사소개', '서비스 소개', '지역/키워드 페이지', '사례 또는 후기', '자주 묻는 질문', '상담 신청'].map(menu => (
                              <span key={menu} className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg shadow-sm">
                                {menu}
                              </span>
                           ))}
                         </div>
                       </div>
                       
                       <div className="text-sm font-bold text-slate-500 mb-3 block px-1">기획해야 할 콘텐츠 리스트</div>
                       <ul className="grid sm:grid-cols-2 gap-y-4 gap-x-6 text-sm text-slate-700 font-medium px-1">
                         <li className="flex items-start"><CheckCircle2 size={18} className="text-emerald-500 mr-2 shrink-0" /> 대표 서비스 상세 소개글</li>
                         <li className="flex items-start"><CheckCircle2 size={18} className="text-emerald-500 mr-2 shrink-0" /> 고객이 자주 묻는 질문 (FAQ)</li>
                         <li className="flex items-start"><CheckCircle2 size={18} className="text-emerald-500 mr-2 shrink-0" /> 지역 기반 타겟팅 지역 키워드 콘텐츠</li>
                         <li className="flex items-start"><CheckCircle2 size={18} className="text-emerald-500 mr-2 shrink-0" /> 블로그/카페 확산을 위한 마중물 콘텐츠</li>
                       </ul>
                    </div>
                  </div>
               ) : (
                  <div className="space-y-8">
                    {/* Summary */}
                    <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200 flex flex-col md:flex-row gap-6 items-start">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-slate-200">
                         <LineChart size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-800 mb-3">진단 요약</h4>
                        <p className="text-slate-700 font-medium leading-relaxed text-lg">
                          "현재 홈페이지는 검색 노출과 AI 검색 대응을 위해 <mark className="bg-yellow-200 px-1 py-0.5 rounded font-bold">서비스 페이지 강화, FAQ 구조화, 경험형 콘텐츠 보강, 콘텐츠 외부 확산 구조</mark>를 전면적으로 점검할 필요가 있습니다."
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-800/30 rounded-full blur-[80px]"></div>
                      <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-[80px]"></div>
                      <h4 className="text-xl font-bold text-white mb-4 relative z-10 flex items-center">
                        <Info size={24} className="mr-2 text-yellow-400" /> 제로클릭 시대 안내
                      </h4>
                      <p className="text-slate-300 text-base leading-relaxed relative z-10 font-medium">
                        이제는 검색 결과에서 클릭이 줄어드는 제로클릭 시대입니다. 사용자는 통검과 AI 답변에서 먼저 정보를 얻고 이탈합니다. <br className="hidden md:block" />
                        따라서 홈페이지에는 단순한 설명만이 아니라 <strong>AI가 쉽게 복제하기 어려운 실제 경험, 사례, 확실한 비교 차트, 리얼한 후기, 정리된 FAQ, 대표자의 철학과 관점</strong>이 담긴 밀도 높은 고유의 콘텐츠가 필요합니다.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                        <h4 className="text-lg font-bold text-slate-800 mb-5 flex items-center">
                           <ListChecks size={20} className="mr-2 text-blue-600" /> 우선 점검 항목 체크리스트
                        </h4>
                        <ul className="space-y-4">
                           {['메뉴 구조가 직관적인가?', '서비스 상세 페이지 퀄리티 확인', '키워드별 랜딩 페이지 유무', 'FAQ 콘텐츠 구조화(Schema) 상태', '문의 전환 동선 설계', '블로그/카페 외부 연결 구조 구축 여부'].map((item, idx) => (
                             <li key={idx} className="flex items-start text-sm text-slate-700 font-semibold">
                               <div className="w-5 h-5 rounded bg-slate-100 border border-slate-200 flex items-center justify-center mr-3 shrink-0 mt-0.5">
                                 <div className="w-2 h-2 rounded-sm bg-slate-400"></div>
                               </div>
                               {item}
                             </li>
                           ))}
                        </ul>
                      </div>

                      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                        <h4 className="text-lg font-bold text-slate-800 mb-5 flex items-center">
                           <Cpu size={20} className="mr-2 text-blue-600" /> AI가 대체하기 어려운 콘텐츠 제안
                        </h4>
                        <div className="flex flex-wrap gap-2.5">
                           {['실제 상담 사례 분석', '서비스 비포/애프터 비교', '디테일한 고객 질문/답변', '명확한 업종별 가격 기준표', '지역 기반 생생한 현장 정보', '대표자의 철학과 관점 칼럼', '직접 촬영한 퀄리티 높은 사진', '업무 프로세스 상세 안내', '실패 사례와 주의 안내'].map((item, idx) => (
                              <span key={idx} className="px-3.5 py-2 bg-blue-50/50 text-blue-800 text-sm font-bold rounded-xl border border-blue-100/60 shadow-sm">
                                {item}
                              </span>
                           ))}
                        </div>
                      </div>
                    </div>
                  </div>
               )}

               {/* Final CTA Section */}
               <div className="mt-12 bg-white rounded-3xl p-8 md:p-12 border border-blue-100 shadow-xl shadow-blue-900/5 text-center relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-blue-400 to-yellow-400"></div>
                 
                 <div className="inline-block px-4 py-1.5 bg-yellow-100 text-yellow-800 text-sm font-bold rounded-full mb-6">
                   맞춤형 무료 상담
                 </div>
                 <h4 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                   이 진단 결과로 구체적인 <span className="text-blue-700">해결책 상담</span>을 받아보세요.
                 </h4>
                 <p className="text-slate-600 mb-10 max-w-xl mx-auto text-base">
                   입력하신 업종, 키워드, 홈페이지 상황을 바탕으로 온라인마케팅 전문가가 더욱 밀도있는 전략과 마케팅 방향을 안내해드립니다.
                 </p>
                 
                 <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 w-full">
                   {hasWebsite === 'no' ? (
                     <>
                        <button className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm w-full sm:w-auto">자체제작 강의 보기</button>
                        <button className="px-8 py-4 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20 w-full sm:w-auto">홈페이지 제작 의뢰하기</button>
                     </>
                   ) : (
                     <>
                        <button className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm w-full sm:w-auto">블로그/카페 포스팅 상담</button>
                        <button className="px-8 py-4 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20 w-full sm:w-auto">트래픽 서비스 상담</button>
                     </>
                   )}
                   <Link to="/consult" className="px-8 py-4 bg-yellow-400 text-slate-900 font-extrabold rounded-xl hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-500/30 w-full sm:w-auto text-lg flex items-center justify-center">
                     <Sparkles size={20} className="mr-2" /> 무료 상담 신청하기
                   </Link>
                 </div>
                 
                 <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500 font-medium">
                    <span className="mb-4 sm:mb-0">* AI 진단은 1차 참고용이며, 정확한 적용 전에는 전문가 실전 상담을 권장합니다.</span>
                    <button onClick={resetForm} className="flex items-center text-slate-400 hover:text-slate-800 transition-colors bg-slate-50 px-4 py-2 rounded-lg">
                      <RefreshCw size={16} className="mr-2" /> 다시 진단하기
                    </button>
                 </div>
               </div>

            </div>
          )}
          
        </div>
      </div>
    </section>
  );
}
