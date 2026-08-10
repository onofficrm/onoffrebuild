import { useState } from 'react';
import { PenTool, Target, Wand2, ArrowRight, Loader2, Copy, Check } from 'lucide-react';

export default function AITools() {
  const [activeTab, setActiveTab] = useState<'planner' | 'copywriter'>('planner');
  
  // Planner State
  const [industry, setIndustry] = useState('');
  const [audience, setAudience] = useState('');
  const [keywords, setKeywords] = useState('');
  const [plannerResult, setPlannerResult] = useState('');
  const [isPlannerLoading, setIsPlannerLoading] = useState(false);
  
  // Copywriter State
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('프로페셔널하고 신뢰감 있는');
  const [copyResult, setCopyResult] = useState('');
  const [isCopyLoading, setIsCopyLoading] = useState(false);

  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatePlanner = async () => {
    if (!industry || isPlannerLoading) return;
    setIsPlannerLoading(true);
    setPlannerResult('');
    
    try {
      const res = await fetch('/api/ai/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry, targetAudience: audience, keywords })
      });
      const data = await res.json();
      if(data.result) setPlannerResult(data.result);
      else if(data.error) setPlannerResult(data.error);
    } catch (error) {
      console.error(error);
      setPlannerResult('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsPlannerLoading(false);
    }
  };

  const generateCopy = async () => {
    if (!topic || isCopyLoading) return;
    setIsCopyLoading(true);
    setCopyResult('');
    
    try {
      const res = await fetch('/api/ai/copywriter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, tone })
      });
      const data = await res.json();
      if(data.result) setCopyResult(data.result);
      else if(data.error) setCopyResult(data.error);
    } catch (error) {
      console.error(error);
      setCopyResult('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsCopyLoading(false);
    }
  };

  return (
    <main className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 text-blue-700 rounded-full mb-4">
            <Wand2 size={32} />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">AI 마케팅 도구 모음</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            온오프마케팅이 제공하는 강력한 AI 도구를 활용해 홈페이지 아이디어를 얻으세요.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-slate-200 p-1 rounded-xl flex gap-1">
            <button
              onClick={() => setActiveTab('planner')}
              className={`px-6 py-3 rounded-lg font-bold text-sm transition-all ${activeTab === 'planner' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-300'}`}
            >
              AI 홈페이지 기획기
            </button>
            <button
              onClick={() => setActiveTab('copywriter')}
              className={`px-6 py-3 rounded-lg font-bold text-sm transition-all ${activeTab === 'copywriter' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-300'}`}
            >
              AI 카피라이터
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Side */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 h-fit">
            
            {activeTab === 'planner' ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold flex items-center text-slate-800 mb-2">
                    <Target size={20} className="mr-2 text-blue-500" />
                    홈페이지 구조를 기획해드릴게요.
                  </h2>
                  <p className="text-sm text-slate-500 mb-6">업종과 타겟 고객을 입력하시면 전환율이 높은 구조를 제안합니다.</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">어떤 업종인가요? <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={industry}
                      onChange={e => setIndustry(e.target.value)}
                      placeholder="예: 헬스장, 개인회생 법률사무소, 영어학원" 
                      className="w-full bg-slate-50 border border-slate-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">주요 타겟 고객은 누구인가요?</label>
                    <input 
                      type="text" 
                      value={audience}
                      onChange={e => setAudience(e.target.value)}
                      placeholder="예: 30대 직장인 여성, 빚이 많은 자영업자" 
                      className="w-full bg-slate-50 border border-slate-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">강조하고 싶은 키워드가 있나요?</label>
                    <input 
                      type="text" 
                      value={keywords}
                      onChange={e => setKeywords(e.target.value)}
                      placeholder="예: 저렴한 가격, 역세권, 1:1 맞춤형" 
                      className="w-full bg-slate-50 border border-slate-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button 
                  onClick={generatePlanner}
                  disabled={isPlannerLoading || !industry}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 mt-8 shadow-md shadow-blue-500/20"
                >
                  {isPlannerLoading ? <><Loader2 size={20} className="animate-spin mr-2" /> AI가 기획서 작성중...</> : <><Wand2 size={20} className="mr-2" /> AI 기획 시작하기</>}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                 <div>
                  <h2 className="text-xl font-bold flex items-center text-slate-800 mb-2">
                    <PenTool size={20} className="mr-2 text-blue-500" />
                    매력적인 카피를 작성해드릴게요.
                  </h2>
                  <p className="text-sm text-slate-500 mb-6">주제와 톤앤매너를 설정하면 센스있는 문구를 제안합니다.</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">어떤 내용을 쓸까요? <span className="text-red-500">*</span></label>
                    <textarea 
                      rows={3}
                      value={topic}
                      onChange={e => setTopic(e.target.value)}
                      placeholder="예: AI로 홈페이지를 5분만에 만드는 서비스 소개" 
                      className="w-full bg-slate-50 border border-slate-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">원하는 톤앤매너</label>
                    <select
                      value={tone}
                      onChange={e => setTone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="프로페셔널하고 신뢰감 있는">프로페셔널하고 신뢰감 있는</option>
                      <option value="위트있고 트렌디한">위트있고 트렌디한</option>
                      <option value="친근하고 따뜻한 역지사지">친근하고 따뜻한</option>
                      <option value="강력하고 후킹하는 (광고성)">강력하고 훅이 있는</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={generateCopy}
                  disabled={isCopyLoading || !topic}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 mt-8 shadow-md shadow-blue-500/20"
                >
                  {isCopyLoading ? <><Loader2 size={20} className="animate-spin mr-2" /> AI 고민중...</> : <><Wand2 size={20} className="mr-2" /> AI 카피 생성하기</>}
                </button>
              </div>
            )}
          </div>

          {/* Result Side */}
          <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-8 flex flex-col relative overflow-hidden h-full min-h-[500px]">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-900/40 rounded-full blur-[80px] pointer-events-none"></div>
             
             <div className="flex justify-between items-center mb-6 relative z-10 border-b border-slate-800 pb-4">
                <h3 className="text-white font-bold text-lg flex items-center">
                  <Wand2 size={18} className="mr-2 text-yellow-400" /> 
                  AI 결과물
                </h3>
                {((activeTab === 'planner' && plannerResult) || (activeTab === 'copywriter' && copyResult)) && (
                   <button 
                     onClick={() => handleCopy(activeTab === 'planner' ? plannerResult : copyResult)}
                     className="text-slate-400 hover:text-white flex items-center text-sm transition-colors"
                   >
                     {copied ? <Check size={16} className="text-emerald-400 mr-1"/> : <Copy size={16} className="mr-1"/>}
                     {copied ? '복사됨' : '복사하기'}
                   </button>
                )}
             </div>

             <div className="flex-1 overflow-y-auto relative z-10 scrollbar-hide">
               {activeTab === 'planner' ? (
                 plannerResult ? (
                   <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                     <pre className="whitespace-pre-wrap font-sans bg-transparent underline-offset-4 decoration-slate-700 leading-relaxed font-medium">
                       {plannerResult}
                     </pre>
                   </div>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center opacity-50">
                     <Target size={48} className="mb-4" />
                     <p>좌측에서 정보를 입력하고<br/>AI 기획을 시작해보세요.</p>
                   </div>
                 )
               ) : (
                 copyResult ? (
                   <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                      <pre className="whitespace-pre-wrap font-sans bg-transparent leading-relaxed font-medium text-lg">
                       {copyResult}
                     </pre>
                   </div>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center opacity-50">
                     <PenTool size={48} className="mb-4" />
                     <p>어떤 카피가 필요하신가요?<br/>주제를 입력해주세요.</p>
                   </div>
                 )
               )}
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}
