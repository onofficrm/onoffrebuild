import type { ExpiredDomainTips } from './types';
import { DOMAIN_WHERE_TO_CHECK } from './domainMetricMap';

export const EXPIRED_DOMAIN_TIPS: ExpiredDomainTips = {
  title: '낙장도메인 구별법 TIP',
  disclaimer:
    '별점은 Naver·Google의 공식 랭킹 점수가 아니라 온오프 교육에서 분석 순서를 정하기 위한 확인 우선순위입니다.',
  targets: [
    {
      target: 'naver',
      label: 'NAVER 중심',
      headline: '숫자보다 브랜드·주제·사이트 품질부터 확인',
      summary: [
        '도메인 이름이 사업·브랜드와 자연스럽게 연결되는지 먼저 봅니다.',
        '과거 운영 기록(pastSiteTitle / Archive)과 Spam Score를 CatchDomain에서 확인합니다.',
        '네이버는 특정 백링크 점수를 공식 랭킹 공식으로 제공하지 않습니다.',
      ],
      priorities: [
        { label: 'History / 과거 사이트 주제', stars: 5, whereToCheck: 'CatchDomain · Archive / pastSiteTitle / Topic Consistency', availability: 'available' },
        { label: 'Spam / Risk history', stars: 5, whereToCheck: 'CatchDomain · Spam Score', availability: 'available' },
        { label: 'Domain name / Brand fit', stars: 5, whereToCheck: 'CatchDomain · 도메인명/TLD + 교육 플랫폼 selectedDomain', availability: 'available' },
        { label: 'Language / Korea relevance', stars: 4, whereToCheck: 'CatchDomain · Naver 검색 흔적 + Country Distribution (전용 Language 필드 없음)', availability: 'manual' },
        { label: 'Backlink / Referring Domains', stars: 3, whereToCheck: 'CatchDomain · Ref Domains', availability: 'available' },
        { label: 'Authority Score', stars: 2, whereToCheck: 'CatchDomain · Authority Score (Moz DA 아님 · 공식 점수 아님)', availability: 'available' },
      ],
      checklist: [
        '사업과 도메인 이름이 잘 맞는가?',
        '과거 주제가 현재 사업과 비슷한가?',
        '한국어·국내 운영 흔적이 있는가?',
        'Spam Score / 위험 이력이 낮은가?',
        '기억하기 쉽고 브랜드화하기 좋은가?',
        '.co.kr / .kr / .com 등 익숙한 TLD인가?',
      ],
    },
    {
      target: 'google',
      label: 'GOOGLE 중심',
      headline: '숫자 하나보다 링크의 맥락과 과거 이력을 함께 확인',
      summary: [
        '과거 주제와 현재 사업의 관련성을 가장 먼저 확인합니다.',
        'Backlink 총수보다 Ref Domains와 Anchor Quality를 확인합니다.',
        'Authority Score는 공급자 참고값이며 안전이나 상위노출을 보장하지 않습니다. Moz DA/Ahrefs DR은 프로덕션 카드의 주 지표가 아닙니다.',
      ],
      priorities: [
        { label: 'History', stars: 5, whereToCheck: 'CatchDomain · Archive / historyQuality / Topic Consistency', availability: 'available' },
        { label: 'Topic Relevance', stars: 5, whereToCheck: 'CatchDomain · pastSiteTitle + Topic Consistency', availability: 'available' },
        { label: 'Referring Domain Quality', stars: 5, whereToCheck: 'CatchDomain · Ref Domains + Link Quality', availability: 'available' },
        { label: 'Anchor Profile', stars: 5, whereToCheck: 'CatchDomain · Anchor Quality', availability: 'available' },
        { label: 'Spam / Risk Signal', stars: 5, whereToCheck: 'CatchDomain · Spam Score', availability: 'available' },
        { label: 'Backlink Count', stars: 3, whereToCheck: 'CatchDomain · Backlinks', availability: 'available' },
        { label: 'Authority Score', stars: 2, whereToCheck: 'CatchDomain · Authority Score (DA/DR은 API에만 남을 수 있음)', availability: 'available' },
        { label: 'TF / CF', stars: 0, whereToCheck: '현재 CatchDomain에서 직접 제공 확인 안 됨', availability: 'not-provided' },
      ],
      checklist: [
        '과거 주제가 현재 사업과 관련 있는가?',
        'Ref Domains가 자연스럽게 분산되어 있는가?',
        '관련 있는 실제 출처 링크가 남아 있는가?',
        'Anchor Quality가 자연스러운가?',
        'Spam Score 위험 신호가 낮은가?',
        'History에서 반복적인 주제 변조가 없는가?',
      ],
    },
    {
      target: 'both',
      label: 'NAVER + GOOGLE',
      headline: '높은 숫자보다 깨끗하고 관련성 높은 도메인',
      summary: [
        '브랜드 적합성, 주제 관련성, 깨끗한 이력과 자연스러운 링크 구조를 함께 확인합니다.',
        '두 검색 환경 모두를 목표로 할 때 가장 권장하는 보수적 판단 방식입니다.',
      ],
      priorities: [
        { label: 'Brand Fit', stars: 5, whereToCheck: 'CatchDomain · 도메인명/TLD', availability: 'available' },
        { label: 'Topic Relevance', stars: 5, whereToCheck: 'CatchDomain · pastSiteTitle / Topic Consistency', availability: 'available' },
        { label: 'Clean History', stars: 5, whereToCheck: 'CatchDomain · Archive / historyQuality', availability: 'available' },
        { label: 'Natural Referring Domains', stars: 5, whereToCheck: 'CatchDomain · Ref Domains + Link Quality', availability: 'available' },
        { label: 'Natural Anchor Profile', stars: 5, whereToCheck: 'CatchDomain · Anchor Quality', availability: 'available' },
        { label: 'Risk Signals', stars: 5, whereToCheck: 'CatchDomain · Spam Score', availability: 'available' },
      ],
      checklist: [
        '브랜드 적합성이 좋은가?',
        '과거와 현재의 주제가 관련 있는가?',
        '도박·성인·해킹·불법·대출·PBN 이력이 없는가?',
        '관련 맥락의 자연스러운 Ref Domains가 있는가?',
        'Anchor Quality가 브랜드·URL·관련 주제로 혼합되어 있는가?',
        'Spam Score 위험 신호가 없거나 설명 가능한가?',
      ],
    },
  ],
  whereToCheck: DOMAIN_WHERE_TO_CHECK,
  exceptions: [
    '검색결과에 안 나온다는 이유만으로 나쁜 도메인이라고 단정하지 않습니다.',
    'Backlink가 많다는 이유만으로 좋은 도메인이라고 판단하지 않습니다. Ref Domains와 출처를 봅니다.',
    'Authority Score가 높다는 이유만으로 구매하지 않습니다. History와 Anchor Quality를 확인합니다.',
    '도메인 이름이 좋아도 과거 주제가 현재 사업과 무관하면 보수적으로 판단합니다.',
    '좋은 후보가 없으면 구매하지 않는 것이 가장 좋은 판단일 수 있습니다.',
  ],
  statuses: [
    {
      status: 'GOOD CANDIDATE',
      label: '검토 가치 높음',
      description: '핵심 기준이 자연스럽고 치명적 위험 신호가 보이지 않는 후보',
    },
    {
      status: 'REVIEW',
      label: '추가 확인 필요',
      description: '정보가 부족하거나 서로 충돌하는 신호가 있어 추가 검증이 필요한 후보',
    },
    {
      status: 'RISK',
      label: '위험 신호 있음',
      description: '스팸·주제 변조·부자연스러운 링크 등 위험 근거가 확인된 후보',
    },
  ],
};
