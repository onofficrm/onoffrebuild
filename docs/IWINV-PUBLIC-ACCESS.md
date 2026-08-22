# 공개 접속 장애 구분 (onoff.icrm.co.kr)

## 앱 코드 vs 엣지 차단

| 증상 | 의미 | 앱 코드로 해결? |
|------|------|----------------|
| `ERR_CONNECTION_TIMED_OUT` / curl 000 | TCP가 `115.68.168.240:443`에 도달 전 드롭 | **불가** |
| HTTP `403 Forbidden`(영문) + `/access-health.php`도 403 | 호스팅 WAF/방화벽 응답 | **불가** |
| 한글 `접근이 가능하지 않습니다` | 그누보드 `접근가능 IP` | 가능 (환경설정에서 비움) |

`/access-health.php`는 GNUBoard/`common.php`를 **로드하지 않습니다**.
이 URL까지 영문 403이면 **PHP·React 로직 문제가 아닙니다.**

배포(FTP) 직후 잠깐 열리다가 다시 막히는 패턴은
보안 규칙이 다시 적용된 경우와 겹쳐 보일 수 있습니다.
홈 카피/SPA 수정이 TCP 연결을 끊지는 않습니다.

## iwinv 패널 영구 설정

계정 `rebuildonoff` · IP `115.68.168.240`

1. 해외 접속 차단 / 국가 차단: **OFF (영구)**
2. 웹방화벽 전체 차단 모드: 사용 금지
3. 80 / 443 허용
4. 규칙이 배포·시간 후 자동 재활성화되는지 iwinv에 확인 요청

## 그누보드

- `접근가능 IP`: 비움 (저장 거부 가드 있음)
- 악성 IP만 `접근차단 IP`에 입력

## 점검

```bash
./scripts/check-production-access.sh
curl -I https://onoff.icrm.co.kr/access-health.php
```

업타임 GitHub Action은 **수동 실행만** (자동 프로브 비활성).
