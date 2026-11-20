# CRM ↔ ONOFF 강의승인 연동 점검 프롬프트

아래 프롬프트를 `crm.icrm.co.kr` 코드베이스(또는 CRM 담당 에이전트)에 그대로 붙여 넣고 점검·수정하세요.

---

## 역할
당신은 `crm.icrm.co.kr` 담당 엔지니어입니다.
ONOFF(`onoff.icrm.co.kr`)에 이미 올라간 **강의 신청 SoT API**와 CRM UI(알림 팝업·고객목록·승인 버튼)가 맞게 연동됐는지 점검하고, 어긋난 지점만 고치세요.

## 절대 원칙
1. **SoT는 ONOFF** `g5_onoff_education_enrollments` 입니다.
2. CRM은 **읽기 + approve(상태 전이)만** 합니다. CRM에서 enrollment 테이블에 직접 INSERT/UPDATE/DELETE 하지 마세요.
3. **`g5_seosys300_*` / 회원·포인트 SoT를 CRM으로 옮기지 마세요.**
4. approve는 **`pending_deposit → pending_contract`만**. `active`로 바로 올리지 마세요. (계약 서명 플로우가 깨집니다.)
5. 카카오/메일 “수강 활성화” 알림은 ONOFF에서 `active` 전이 시에만 나갑니다. CRM approve 단계에서 별도 활성 알림을 보내지 마세요.

## ONOFF API (이미 운영 반영됨)

### Base
- Upstream: `https://onoff.icrm.co.kr/api/crm/education.php`
- CRM BFF 기대 경로: `https://crm.icrm.co.kr/api/education/*` → 위 upstream 프록시
- CORS: Origin `https://crm.icrm.co.kr` 허용 (브라우저 직접 호출 시). **가능하면 BFF 경유** 유지.

### Auth (계약 API와 동일 토큰)
우선순위처럼 동작:
1. `Authorization: Bearer <ONOFF_CRM_CONTRACT_API_TOKEN>`
2. **`X-ONOFF-Contract-Token: <token>`** ← Cafe24가 Authorization을 제거하므로 **권장**
3. `X-Api-Token: <token>`
4. (개발용) GNUBoard super-admin 세션

토큰 미설정 시 ONOFF는 `503 not_configured`.
잘못된 토큰 `401`, 토큰 없음 `401`.

### 엔드포인트

#### 1) 목록
`GET /api/crm/education.php`
Query: `status`, `stx`, `mb_id`, `page`, `per`
Response:
```json
{
  "ok": true,
  "data": {
    "items": [ /* Enrollment */ ],
    "page": 1,
    "per": 50,
    "total": 0,
    "statusCounts": {
      "pending_deposit": 0,
      "pending_contract": 0,
      "active": 0,
      "expired": 0,
      "cancelled": 0
    }
  }
}
```

#### 2) 대기열(알림 폴링)
`GET /api/crm/education.php?action=pending`
Query: `sinceId` (optional, `en_id > sinceId`)
Response:
```json
{
  "ok": true,
  "data": {
    "items": [ /* status=pending_deposit 만 */ ],
    "pendingCount": 0,
    "statusCounts": { "...": 0 }
  }
}
```
- CRM은 **약 45초 폴링**으로 `action=pending` (+ `sinceId`) 호출.
- items = **`pending_deposit`만**.

#### 3) 승인
`POST /api/crm/education.php`
```json
{ "action": "approve", "enId": 123, "adminMemo": "optional" }
```
- 의미: 강의 권한 승인
- 전이: **`pending_deposit → pending_contract`만**
- 그 외 상태에서 approve → ONOFF `409 invalid_status`
- `action=update` 등 임의 상태 쓰기는 **지원하지 않음** (400). CRM에서 active로 올리는 API를 만들지 마세요.

성공 시 enrollment.status 가 `pending_contract` 인지 확인.

### Enrollment 직렬화 필드 (UI 매핑용)
최소 사용 필드:
- `en_id`, `course_id`, `mb_id`, `applicant_name`, `status`
- `phone`, `email`, `admin_memo`
- `deposit_amount`, `depositor_name`
- `created_at`, `updated_at`
- (있으면) `starts_at`, `ends_at`, `activated_at`, contract_* 

### 상태 의미 (CRM UI 카피 가이드)
| status | CRM 표시 권장 | 다음 액션 |
|---|---|---|
| `pending_deposit` | 입금/강의권한 대기 | **승인** 버튼 |
| `pending_contract` | 계약 서명 대기 | 승인 버튼 비활성. 고객이 ONOFF에서 계약 서명 |
| `active` | 수강중 | 읽기 전용 |
| `expired` / `cancelled` | 종료/취소 | 읽기 전용 |

## CRM에서 점검할 연동 지점 (체크리스트)

### A. BFF / 프록시
- [ ] `crm.icrm.co.kr/api/education/*` → `onoff.icrm.co.kr/api/crm/education.php` 매핑
- [ ] 서버→서버 호출 시 **`X-ONOFF-Contract-Token`** 전달 (Bearer만 쓰지 말 것)
- [ ] 토큰은 CRM 서버 env/secret에만. 프론트에 노출 금지
- [ ] upstream 4xx/5xx를 CRM API 에러로 그대로 전달(또는 표준 래핑)하고 UI에 표시

### B. 알림 벨 / 팝업 (~45초)
- [ ] `GET ...?action=pending&sinceId=` 폴링
- [ ] 신규 `pending_deposit` 건 팝업/벨 노출
- [ ] `en_id` 기준으로 중복 알림 방지
- [ ] 폴링 실패 시 조용히 재시도 (토큰 만료/503은 운영 알림)

### C. 고객목록 “강의권한” 컬럼
- [ ] 고객(`mb_id`/연락처)과 enrollment 매칭
- [ ] status 배지: 대기 / 계약대기 / 수강중 …
- [ ] `pending_deposit`일 때만 **승인** CTA
- [ ] 승인 후 컬럼이 `pending_contract`로 갱신되는지

### D. 승인 버튼
- [ ] `POST { action: "approve", enId }`만 호출
- [ ] 성공 후 목록/팝업/고객카드 리프레시
- [ ] 이미 `pending_contract`면 버튼 숨김 + 409 처리
- [ ] **active로 올리는 코드 경로 없음** 확인 (검색: `status.*active`, `approve.*active`)

### E. E2E 시나리오 (필수)
1. ONOFF에서 강의 신청 1건 생성 → status=`pending_deposit`
2. 최대 ~45초 내 CRM 벨/팝업에 노출
3. CRM에서 승인 → ONOFF status=`pending_contract`
4. 고객은 ONOFF `/education/contract` 서명 후 `active` (CRM이 active로 만들지 않음)
5. CRM 고객목록 강의권한 컬럼이 단계별로 맞음

### F. 하지 말 것
- ONOFF DB 직접 쓰기
- approve → active 숏컷
- CRM 로컬에 enrollment SoT 복제 후 양방향 싱크
- seosys300 권한 테이블 조작

## 스모크 curl (CRM 서버 또는 시크릿 있는 환경에서)

```bash
BASE=https://onoff.icrm.co.kr/api/crm/education.php
# TOKEN 은 출력/로그에 남기지 말 것
H="X-ONOFF-Contract-Token: $TOKEN"

# 401
curl -sS -o /dev/null -w "%{http_code}\n" "$BASE?action=pending"

# pending
curl -sS -H "$H" "$BASE?action=pending" | jq '.ok, .data.pendingCount, (.data.items|length)'

# list
curl -sS -H "$H" "$BASE?status=pending_deposit&per=10" | jq '.ok, .data.total'

# approve (실제 pending enId만)
curl -sS -X POST -H "$H" -H 'Content-Type: application/json' \
  -d '{"action":"approve","enId":123,"adminMemo":"CRM QA"}' \
  "$BASE" | jq '.ok, .data.enrollment.status'
# 기대: pending_contract
```

BFF가 있다면 동일 시나리오를 `https://crm.icrm.co.kr/api/education/...` 로도 반복.

## 산출물
1. 위 체크리스트 A~F 결과 (PASS/FAIL + 파일 경로)
2. FAIL이면 최소 패치 (BFF 헤더, 폴링, 승인 payload, active 숏컷 제거)
3. E2E 1건 증거: pending 노출 → approve → `pending_contract` (스크린샷 또는 API 응답 요약, 토큰 값 제외)

## 참고 (ONOFF 쪽)
- API: `api/crm/education.php`
- 신청 생성: `proc/inquiry-submit.php` → `onoff_education_create_pending_enrollment()` (`pending_deposit`)
- 라이브러리: `lib/onoff-education.lib.php`
- 계약 CRM 패턴 복제: `api/crm/contracts.php`
- 고객 UX: `pending_contract` → `/education/contract` 서명 → `active`
