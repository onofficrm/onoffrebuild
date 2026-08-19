import React from 'react';
import { HelpCircle, MessageSquare, BookOpen, ExternalLink, Mail, Phone } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export const HelpView: React.FC = () => {
  const faqs = [
    {
      q: '홈페이지 제작 주문 후 배포까지 얼마나 걸리나요?',
      a: '주문서 접수 후 전담 퍼블리셔가 배정되며, 실로 구조 기획부터 코어 웹 바이탈 최적화 및 최종 납품까지 영업일 기준 약 3~5일이 소요됩니다.'
    },
    {
      q: 'CatchDomain에서 만료 도메인을 연결하는 방법은 무엇인가요?',
      a: 'CatchDomain에서 낙찰받은 도메인의 네임서버(NS)를 호스팅 DNS 설정과 연결한 후, SEO SYSTEM 300 내 프로젝트 관리에서 도메인을 등록하시면 됩니다.'
    },
    {
      q: '구글 서치콘솔(GSC)에 색인 요청을 어떻게 하나요?',
      a: 'STEP 4 SEO 기본설정 및 커리큘럼 4강 가이드에 따라 sitemap.xml 제출 후, 신규 발행된 주요 글 URL을 URL 검사 도구에서 "색인 생성 요청"을 진행하시면 됩니다.'
    },
    {
      q: '수정 요청 티켓은 몇 회까지 가능한가요?',
      a: 'SEO SYSTEM 300 정규 수강생은 납품 후 30일간 무제한 레이아웃/디자인/SEO 태그 유지보수 및 수정 지원을 제공받습니다.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-blue-600" />
            <span>도움말 및 수강생 지원</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            자주 묻는 질문(FAQ)과 1:1 수강생 전담 코칭 채널 안내
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">수강생 전용 카카오톡 오픈채팅</h3>
            <p className="text-xs text-slate-600 mb-3">
              300기 동기 수강생들과 실시간 질의응답 및 노하우를 공유하는 비밀 커뮤니티입니다.
            </p>
            <Button variant="primary" size="sm">
              커뮤니티 입장하기
            </Button>
          </div>
        </Card>

        <Card className="p-5 flex items-start gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">1:1 SEO 기술 지원 센터</h3>
            <p className="text-xs text-slate-600 mb-3">
              도메인 네임서버, GSC 오류, 백링크 색인 누락 등 기술 이슈 전담 문의
            </p>
            <Button variant="outline" size="sm">
              기술 문의 티켓 접수
            </Button>
          </div>
        </Card>
      </div>

      <Card header="자주 묻는 질문 (FAQ)">
        <div className="divide-y divide-slate-100">
          {faqs.map((faq, i) => (
            <div key={i} className="py-4 first:pt-0 last:pb-0 space-y-1.5">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="text-blue-600 font-extrabold font-mono">Q.</span>
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-600 pl-5 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
