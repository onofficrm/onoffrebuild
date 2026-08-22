# iwinv 공개 접속 안정화 (onoff.icrm.co.kr)

반복되는 `ERR_CONNECTION_TIMED_OUT` / 해외 `403` 은 **앱 배포로 고치지 않습니다.**
원인 대부분은 iwinv **방화벽·해외접속차단·웹방화벽** 입니다.

## 패널에서 영구적으로 유지할 설정

계정: `rebuildonoff` · IP: `115.68.168.240`

1. **해외 접속 차단 / 국가 차단: OFF** (공개 마케팅 사이트는 반드시 개방)
2. **웹방화벽**: 과도한 “전체 차단” 모드 사용 금지. 공격 IP만 개별 차단
3. **방화벽**: 80 / 443 인바운드 허용
4. 운영자 IP만 막을 경우 → **화이트리스트에 운영 IP 추가**하되, 일반 방문자는 열어 둘 것
5. **계정 초기화** 버튼은 사용하지 말 것

## 그누보드 환경설정 (앱)

- **접근가능 IP (`cf_possible_ip`)**: 반드시 비움  
  (값이 있으면 허용 목록 외 전 세계 접속이 막힘)
- **접근차단 IP**: 악성 IP만 선별 입력

코드 가드: `_site.config.php` 의 `public_access_forbid_possible_ip=true`  
→ 관리자가 접근가능 IP를 저장하려 하면 거부합니다.

## 자동 감시

- GitHub Actions: `Production Access Uptime` (30분마다)
- 로컬/수동: `./scripts/check-production-access.sh`
- 헬스 URL: `https://onoff.icrm.co.kr/access-health.php`

실패 시 조치: **iwinv 문의 / 패널 방화벽 수정** (재배포 금지)

문의 템플릿:

```
계정: rebuildonoff
서버 IP: 115.68.168.240
증상: 외부 HTTPS 타임아웃 또는 403
요청: 공개 웹 80/443 개방, 해외접속차단 OFF, 방화벽에서 일반 방문자 허용
운영 IP(참고): (curl -s https://api.ipify.org)
```
