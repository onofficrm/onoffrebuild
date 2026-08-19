import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer id="main-footer" className="bg-slate-100 border-t border-slate-200 text-slate-600 py-12 pb-24 lg:pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Brand & Disclaimer */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center font-black text-white text-xs">
              ON
            </div>
            <div>
              <span className="text-[10px] font-bold text-sky-600 block tracking-wider uppercase">
                ONOFF MARKETING
              </span>
              <span className="font-bold text-slate-900 text-sm">
                SEO SYSTEM 300
              </span>
            </div>
          </div>

          <div className="text-left md:text-right text-[11px] text-slate-500 max-w-xl">
            본 프로그램은 무분별한 100% 1위 보장 등의 허위 과장 광고를 하지 않으며,
            실무자가 검증한 도메인·웹사이트·백링크·콘텐츠·트래픽 실행 환경 및 자체 구축 인프라를 전수하는 실전형 교육 프로그램입니다.
          </div>
        </div>

        {/* Company Info & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} ONOFF MARKETING. ALL RIGHTS RESERVED. (본 프로그램은 상위노출 1위를 보장하는 것이 아닌 실행 환경 구축을 지원합니다)
          </p>

          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <a href="#hero" className="hover:text-slate-900 transition-colors">홈으로</a>
            <a href="#program" className="hover:text-slate-900 transition-colors">프로그램</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">혜택 및 비용</a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">자주 묻는 질문</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
