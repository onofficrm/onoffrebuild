import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950 pt-20 pb-24 md:pb-12 text-slate-400 text-sm border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2">
            <Link to="/" className="inline-block text-2xl font-bold text-white tracking-tighter mb-4">
              <span className="text-blue-500">ON</span>/OFF
            </Link>
            <p className="mb-6 leading-relaxed bg-clip-text">
              SEO와 AEO 구조 설계가 포함된 홈페이지 제작부터 <br />
              노출을 위한 트래픽, 포스팅 실행까지.<br />
              매출을 만드는 진짜 디지털 마케팅 에이전시.
            </p>
            <a href="tel:0503-6982-1200" className="text-white font-bold text-xl mb-1 hover:text-blue-400 transition-colors inline-block">0503-6982-1200</a>
            <p className="text-xs text-slate-500">평일 09:30 - 18:30 (주말/공휴일 휴무)</p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">주요 메뉴</h4>
            <ul className="space-y-3">
              <li><Link to="/company" className="hover:text-white transition-colors">회사소개</Link></li>
              <li><Link to="/request" className="hover:text-white transition-colors">홈페이지 제작 의뢰</Link></li>
              <li><Link to="/diy" className="hover:text-white transition-colors">자체제작 (온라인강의)</Link></li>
              <li><Link to="/free-courses" className="hover:text-white transition-colors">무료온라인강의</Link></li>
              <li><Link to="/traffic" className="hover:text-white transition-colors">트래픽 서비스</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">블로그포스팅</Link></li>
              <li><Link to="/cafe" className="hover:text-white transition-colors">카페포스팅</Link></li>
              <li><Link to="/platform" className="hover:text-white transition-colors">플랫폼 제작의뢰</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">실행 서비스</h4>
            <ul className="space-y-3">
              <li><Link to="/traffic" className="hover:text-white transition-colors">트래픽 서비스</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">블로그포스팅</Link></li>
              <li><Link to="/cafe" className="hover:text-white transition-colors">카페포스팅</Link></li>
              <li><Link to="/seo-aeo" className="hover:text-white transition-colors">SEO/AEO 컨설팅</Link></li>
              <li><Link to="/platform" className="hover:text-white transition-colors">마케팅 자동화(iCRM)</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="text-white font-bold mb-4">외부 채널</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors font-medium text-blue-400">무료온라인강의 바로가기</a></li>
              <li><a href="#" className="hover:text-white transition-colors">유튜브 채널 바로가기</a></li>
              <li><a href="#" className="hover:text-white transition-colors">자주묻는질문</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-xs text-slate-500 space-y-1.5 leading-relaxed">
            <p className="font-semibold text-slate-400">온오프마케팅</p>
            <p>
              대표자 : 김에리사 | 대표전화 : <a href="tel:0503-6982-1200" className="hover:text-slate-300">0503-6982-1200</a> | 사업자등록번호 : 554-08-02817
            </p>
            <p>
              주소 : 서울특별시 서초구 강남대로 479, 185호 | 개인정보책임자(이메일) : <a href="mailto:jong8040@gmail.com" className="hover:text-slate-300">jong8040@gmail.com</a>
            </p>
            <p className="pt-1 text-slate-600">ⓒ ONOFF MARKETING All Rights Reserved.</p>
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-xs hover:text-white transition-colors">이용약관</a>
            <a href="#" className="text-xs hover:text-white transition-colors font-bold text-slate-300">개인정보처리방침</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
