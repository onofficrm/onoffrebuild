import { useEffect, useState } from 'react';
import { ArrowRight, Bell, Calendar, HelpCircle, Youtube } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { FadeIn } from '../components/ui/FadeIn';
import { Section, SectionHeader } from '../components/ui/Section';
import { DisplayHeading, LeadText, SectionKicker } from '../components/ui/Typography';
import { fetchCommunityBoard, type CommunityPost } from '../lib/communityApi';

const BOARD_CARDS = [
  {
    href: '/notice',
    title: '공지사항',
    desc: '서비스 업데이트·운영 안내·이벤트 소식을 확인합니다.',
    icon: Bell,
  },
  {
    href: '/faq',
    title: '자주 묻는 질문',
    desc: '홈페이지 제작·기능·요금에 대해 자주 묻는 질문과 답변입니다.',
    icon: HelpCircle,
  },
  {
    href: '/youtube',
    title: '유튜브 콘텐츠',
    desc: '홈페이지 운영과 마케팅 노하우 영상 아카이브입니다.',
    icon: Youtube,
  },
] as const;

export function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetchCommunityBoard('notice', 12)
      .then((data) => {
        if (!cancelled) setPosts(data.items);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '공지글을 불러오지 못했습니다.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Section surface="white" spacing="hero" bordered={false}>
        <FadeIn immediate>
          <div className="max-w-[680px]">
            <SectionKicker>ONOFF Builder · 커뮤니티</SectionKicker>
            <DisplayHeading className="mt-3">공지·FAQ·영상, 한곳에서.</DisplayHeading>
            <LeadText className="mt-4 max-w-[520px]">
              기존 GNUBoard 게시판(공지·FAQ·유튜브) 데이터를 그대로 연결합니다. 글 본문과 댓글·권한은
              기존과 동일하게 유지됩니다.
            </LeadText>
          </div>
        </FadeIn>
      </Section>

      <Section surface="subtle">
        <FadeIn>
          <SectionHeader
            kicker="게시판 바로가기"
            title="필요한 정보를 빠르게 찾으세요."
            subtitle="공지사항, 자주 묻는 질문, 유튜브 콘텐츠 게시판으로 이동합니다."
          />

          <div className="mt-9 grid grid-cols-1 gap-4 md:grid-cols-3">
            {BOARD_CARDS.map((board) => {
              const Icon = board.icon;
              return (
                <a
                  key={board.href}
                  href={board.href}
                  className="group flex flex-col justify-between rounded-[16px] border border-slate-200 bg-white p-6 shadow-[var(--shadow-subtle)] transition-[border-color,box-shadow] duration-150 hover:border-slate-300 hover:shadow-[var(--shadow-card-hover)]"
                >
                  <div>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] bg-blue-50 text-blue-600">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-[18px] font-bold tracking-[-0.02em] text-slate-950 group-hover:text-blue-600 transition-colors">
                      {board.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-[1.6] text-slate-600">{board.desc}</p>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1 text-[13px] font-semibold text-blue-600">
                    바로가기
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </a>
              );
            })}
          </div>
        </FadeIn>
      </Section>

      <Section surface="white">
        <FadeIn>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              kicker="최근 공지"
              title="공지사항 미리보기"
              subtitle="제목을 누르면 기존 게시판 글 보기 화면으로 이동합니다."
              className="!mb-0"
            />
            <a
              href="/notice"
              className="inline-flex items-center gap-1 text-[14px] font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap shrink-0"
            >
              공지 전체 보기
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="mt-6 overflow-hidden rounded-[16px] border border-slate-200 bg-white">
            {loading && (
              <p className="px-5 py-8 text-[14px] text-slate-500">공지글을 불러오는 중…</p>
            )}
            {!loading && error && (
              <p className="px-5 py-8 text-[14px] text-rose-600" role="alert">
                {error}
              </p>
            )}
            {!loading && !error && posts.length === 0 && (
              <p className="px-5 py-8 text-[14px] text-slate-500">등록된 공지가 없습니다.</p>
            )}
            {!loading && !error && posts.length > 0 && (
              <ul className="divide-y divide-slate-200">
                {posts.map((post) => (
                  <li key={post.wr_id}>
                    <a
                      href={post.href}
                      className="flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="text-[15px] font-semibold text-slate-950">{post.subject}</span>
                      <span className="inline-flex items-center gap-1.5 text-[12.5px] text-slate-500 shrink-0">
                        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                        {post.date || post.datetime}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </FadeIn>
      </Section>

      <section className="bg-slate-950 py-16 sm:py-20 text-white">
        <Container>
          <FadeIn>
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-[520px]">
                <p className="text-[13px] font-semibold text-[#93C5FD]">ONOFF Builder 상담</p>
                <h2 className="mt-2 text-[clamp(1.5rem,2.5vw,2rem)] font-bold tracking-[-0.025em]">
                  홈페이지·기능 문의는 상담으로 연결하세요.
                </h2>
              </div>
              <Button to="/contact" size="lg">
                <span>상담하기</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}