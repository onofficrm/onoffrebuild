const steps = [
  { n: '01', text: '사이트를 준비하고' },
  { n: '02', text: '검색될 콘텐츠를 만들고' },
  { n: '03', text: '백링크로 사이트 신뢰도를 높이고' },
  { n: '04', text: '방문자를 유입시키고' },
  { n: '05', text: '결과를 확인합니다' },
];

export default function HomeSeoProcessSection() {
  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80" aria-labelledby="home-seo-process-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="home-seo-process-heading"
          className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center tracking-tight mb-10 sm:mb-12"
        >
          SEO는 이렇게 진행됩니다.
        </h2>
        <ol className="max-w-3xl mx-auto space-y-3">
          {steps.map((step, i) => (
            <li
              key={step.n}
              className="flex items-center gap-4 bg-white rounded-2xl border border-slate-200 px-5 py-4 shadow-sm"
            >
              <span className="font-mono text-sm font-black text-blue-700 shrink-0 w-8">{step.n}</span>
              <span className="text-base sm:text-lg font-extrabold text-slate-900">{step.text}</span>
              {i < steps.length - 1 ? (
                <span className="ml-auto text-slate-300 text-lg hidden sm:inline" aria-hidden>
                  ↓
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
