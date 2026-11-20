import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { FadeIn } from '../components/ui/FadeIn';
import { DisplayHeading, LeadText, SectionKicker } from '../components/ui/Typography';

const QUICK_ROUTES = [
  {
    label: '기본 기능 전체',
    description: '루틴·스텝메일·SNS 마케팅·쉬운 수정·AI 기능 개발',
    to: '/features',
  },
  {
    label: '홈페이지 제작',
    description: '브랜드 맞춤 기획·디자인·반응형 구축',
    to: '/website',
  },
  {
    label: 'SEO · GEO',
    description: '검색엔진 및 AI 검색 대응 구조 정비',
    to: '/services/seo',
  },
  {
    label: '요금안내',
    description: '기본 제공 정책·월 운영·별도 비용 구조 안내',
    to: '/pricing',
  },
];

export function NotFoundPage() {
  return (
    <section className="bg-white py-20 sm:py-28 lg:py-36">
      <Container>
        <FadeIn immediate>
          <div className="max-w-[700px]">
            <SectionKicker>404 · PAGE NOT FOUND</SectionKicker>
            <DisplayHeading className="mt-4 text-[clamp(2rem,4vw,3.125rem)]">
              요청하신 페이지를
              <br />
              찾을 수 없습니다.
            </DisplayHeading>
            <LeadText className="mt-5 max-w-[580px]">
              입력하신 주소가 잘못되었거나 페이지가 이동되었을 수 있습니다. 아래 주요 메뉴를 통해
              ONOFF Builder 서비스를 계속 살펴보실 수 있습니다.
            </LeadText>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button to="/" size="lg">
                <span>홈으로 이동</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button to="/contact" variant="secondary" size="lg">
                상담하기
              </Button>
            </div>
          </div>

          <div className="mt-16 border-t border-slate-200 pt-10">
            <p className="text-[13px] font-semibold text-slate-500">자주 찾는 페이지</p>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {QUICK_ROUTES.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-6 transition-[border-color,box-shadow,background-color] duration-150 hover:border-[#98A2B3] hover:bg-white hover:shadow-[0_4px_16px_rgba(16,24,40,0.05)]"
                >
                  <div>
                    <p className="text-[16px] font-semibold text-slate-950 group-hover:text-blue-600 transition-colors">
                      {item.label}
                    </p>
                    <p className="mt-2 text-[14px] leading-[1.6] text-slate-600">
                      {item.description}
                    </p>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1 text-[13px] font-semibold text-slate-950 group-hover:text-blue-600 transition-colors">
                    <span>바로가기</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
