const industries = [
  { name: '병원 홈페이지', desc: '의료법을 준수하며 지역 키워드를 선점하는 신뢰감 있는 신환 유치 구조 설계' },
  { name: '법률 상담 홈페이지', desc: '전문성을 강조하는 사례 중심(AEO) 콘텐츠와 즉각적인 상담 연결 동선 구축' },
  { name: '학원/교육 홈페이지', desc: '학부모의 검색 의도에 맞춘 커리큘럼 노출 및 지역망 검색 최적화(SEO)' },
  { name: '유학원 홈페이지', desc: '국가별, 프로그램별 세부 키워드 페이지 구성으로 세분화된 유기적 트래픽 확보' },
  { name: '청소/인테리어 홈페이지', desc: '비포/애프터 시각 자료와 지역+서비스 키워드 결합을 통한 견적 문의 상승' },
  { name: '지역 서비스 홈페이지', desc: '로컬 SEO 최적화로 지역 내 서비스 검색 시 지도 및 웹사이트 동시 노출 강화' },
  { name: '강의 판매 홈페이지', desc: '커리큘럼 상세 정보의 구조화(Schema)로 검색 결과 접점 극대화 및 결제율 상승' },
  { name: '플랫폼형 홈페이지', desc: '초기 유저 확보를 위한 대량의 롱테일 키워드 페이지 자동 생성 구조 및 마케팅 연동' }
];

export default function IndustriesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
            다양한 업종에 적용 가능한 <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500">SEO / AEO 홈페이지 구조</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors group">
              <h3 className="text-base font-bold text-slate-800 mb-3 group-hover:text-blue-900 transition-colors flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                {item.name}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
