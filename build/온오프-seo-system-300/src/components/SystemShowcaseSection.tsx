import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Monitor, 
  Globe, 
  ExternalLink, 
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { SYSTEM_LIST, ASSET_CARDS, systemHref } from '../data/landingData';

export const SystemShowcaseSection: React.FC = () => {
  const [selectedSystem, setSelectedSystem] = useState<string>('catchdomain');

  const currentSystem = SYSTEM_LIST.find((s) => s.id === selectedSystem) || SYSTEM_LIST[0];

  return (
    <section id="systems" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs sm:text-sm font-bold tracking-wider mb-2">
            <Monitor className="w-3.5 h-3.5" />
            <span>REAL WORKING SYSTEMS</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight [word-break:keep-all]">
            말로만 설명하지 않습니다. <br />
            <span className="text-sky-600">
              실제로 사용할 시스템이 이미 만들어져 있습니다.
            </span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-3 [word-break:keep-all]">
            직접 개발하여 현업 실무에 운용 중인 시스템을 수강생에게 개방하고 직접 연동해 드립니다.
          </p>
        </div>

        {/* System Selector Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 max-w-4xl mx-auto mb-6">
          {SYSTEM_LIST.map((sys, idx) => {
            const isSelected = selectedSystem === sys.id;
            return (
              <button
                key={sys.id}
                onClick={() => setSelectedSystem(sys.id)}
                className={`p-3.5 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-white border-sky-500 shadow-sm ring-1 ring-sky-500/30'
                    : 'bg-white/80 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold mb-0.5">
                  <span className={isSelected ? 'text-sky-600' : 'text-slate-400'}>
                    0{idx + 1}
                  </span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-sky-500"></span>}
                </div>
                <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                  {sys.title}
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  {sys.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Authentic Browser Frame Mockup with Screenshot Placeholder */}
        <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-16">
          
          {/* Browser Window Header */}
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              </div>
              <div className="ml-2 flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white border border-slate-200 text-xs font-mono text-slate-700 shadow-2xs">
                <Globe className="w-3 h-3 text-sky-600 shrink-0" />
                <span className="truncate max-w-[200px] sm:max-w-none">
                  {currentSystem.serviceUrl ? systemHref(currentSystem.serviceUrl) : '맞춤 SEO 홈페이지 제작'}
                </span>
              </div>
            </div>

            {currentSystem.serviceUrl && (
              <a
                href={systemHref(currentSystem.serviceUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-sky-600 hover:text-sky-700 flex items-center gap-1 font-mono font-bold"
              >
                <span>{currentSystem.serviceUrl}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Browser Body with Screenshot Placeholder & Real Features */}
          <div className="p-5 sm:p-7">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Left Details */}
              <div className="lg:col-span-5 space-y-3">
                <div>
                  <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 text-[11px] font-bold font-mono border border-sky-100">
                    REAL OPERATING SYSTEM
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1 [word-break:keep-all]">
                    {currentSystem.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 [word-break:keep-all]">
                    {currentSystem.subtitle}
                  </p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    주요 기능 및 지원 사항:
                  </span>
                  {currentSystem.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span className="[word-break:keep-all]">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Real Benefit Pills */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {currentSystem.previewStats.map((st, sIdx) => (
                    <div key={sIdx} className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">{st.label}</span>
                      <span className="text-xs font-bold text-slate-900 font-mono">{st.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Authentic Screenshot Placeholder Area */}
              <div className="lg:col-span-7">
                <div className="w-full aspect-[16/10] rounded-xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 flex flex-col items-center justify-center p-6 text-center text-white relative shadow-inner group">
                  <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 text-sky-400 flex items-center justify-center mb-3">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  
                  <span className="px-3 py-1 rounded-full bg-sky-950/80 border border-sky-800 text-sky-300 text-xs font-bold font-mono mb-2">
                    실제 시스템 스크린샷 삽입 영역
                  </span>

                  <p className="text-xs text-slate-300 font-bold [word-break:keep-all]">
                    {currentSystem.title} 실제 운영 대시보드 화면
                  </p>
                  
                  <p className="text-[11px] text-slate-400 mt-1 [word-break:keep-all]">
                    {currentSystem.serviceUrl ? `서비스 주소: ${currentSystem.serviceUrl}` : '1:1 맞춤형 SEO 웹사이트 빌더'}
                  </p>

                  <div className="mt-4 px-3 py-1 rounded bg-slate-800/60 border border-slate-700 text-[10px] text-slate-400 font-mono">
                    ※ 가상의 수치가 아닌 실제 작동하는 전용 시스템 인터페이스
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Lifelong Tangible Assets Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-[11px] font-mono font-bold tracking-widest text-sky-600 uppercase">
              // LIFELONG INFRASTRUCTURE ASSETS
            </span>
            <h3 className="text-xl sm:text-3xl font-black text-slate-900 mt-0.5 [word-break:keep-all]">
              강의가 끝나도 여러분에게 시스템은 남습니다.
            </h3>
            
            <div className="mt-2 text-xs sm:text-sm font-bold text-sky-700 [word-break:keep-all]">
              배우고 끝나는 교육이 아닙니다. 내가 계속 사용할 수 있는 SEO 인프라를 만드는 프로그램입니다.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ASSET_CARDS.map((asset) => (
              <div
                key={asset.num}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-1.5 text-sky-600 font-black text-sm mb-1">
                  <span>{asset.num}</span>
                  <h4 className="text-slate-900 font-bold text-xs sm:text-sm [word-break:keep-all]">{asset.title}</h4>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed [word-break:keep-all]">
                  {asset.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
