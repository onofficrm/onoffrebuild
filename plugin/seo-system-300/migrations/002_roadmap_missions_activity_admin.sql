-- SEO SYSTEM 300 roadmap / missions / activity / admin notes
-- REQUIRES 001_projects_and_website.sql first.
-- Prefix assumes G5_TABLE_PREFIX=g5_
-- Do not run this on production from this branch.
-- No FOREIGN KEY (GNUBoard / 001 convention). Engine: InnoDB utf8.

SET NAMES utf8;

CREATE TABLE IF NOT EXISTS `g5_seosys300_roadmap_steps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `step_key` varchar(50) NOT NULL DEFAULT '',
  `title` varchar(191) NOT NULL DEFAULT '',
  `description` text NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `icon_key` varchar(50) NOT NULL DEFAULT '',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `step_key` (`step_key`),
  KEY `sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `g5_seosys300_roadmap_tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `step_id` int(11) NOT NULL DEFAULT 0,
  `task_key` varchar(80) NOT NULL DEFAULT '',
  `title` varchar(191) NOT NULL DEFAULT '',
  `description` text NOT NULL,
  `help_text` varchar(255) NOT NULL DEFAULT '',
  `estimated_minutes` int(11) NOT NULL DEFAULT 0,
  `related_tool` varchar(40) NOT NULL DEFAULT '',
  `lesson_key` varchar(40) NOT NULL DEFAULT '',
  `completion_type` varchar(30) NOT NULL DEFAULT 'check',
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_required` tinyint(1) NOT NULL DEFAULT 1,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `task_key` (`task_key`),
  KEY `step_id` (`step_id`),
  KEY `step_sort` (`step_id`,`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `g5_seosys300_project_roadmap_tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL DEFAULT 0,
  `task_id` int(11) NOT NULL DEFAULT 0,
  `mb_id` varchar(20) NOT NULL DEFAULT '',
  `status` varchar(20) NOT NULL DEFAULT 'not_started',
  `progress` tinyint(4) NOT NULL DEFAULT 0,
  `started_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_task` (`project_id`,`task_id`),
  KEY `project_id` (`project_id`),
  KEY `task_id` (`task_id`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `g5_seosys300_task_results` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL DEFAULT 0,
  `roadmap_task_id` int(11) NOT NULL DEFAULT 0,
  `mb_id` varchar(20) NOT NULL DEFAULT '',
  `result_url` varchar(500) NOT NULL DEFAULT '',
  `keyword` varchar(191) NOT NULL DEFAULT '',
  `result_date` date DEFAULT NULL,
  `memo` text NOT NULL,
  `screenshot_file_id` int(11) NOT NULL DEFAULT 0,
  `related_tool` varchar(40) NOT NULL DEFAULT '',
  `metadata_json` text NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `roadmap_task_id` (`roadmap_task_id`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `g5_seosys300_daily_missions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL DEFAULT 0,
  `roadmap_task_id` int(11) NOT NULL DEFAULT 0,
  `mb_id` varchar(20) NOT NULL DEFAULT '',
  `mission_date` date NOT NULL DEFAULT '0000-00-00',
  `status` varchar(20) NOT NULL DEFAULT 'open',
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `assigned_by` varchar(20) NOT NULL DEFAULT 'system',
  `completed_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_mb_date_task` (`project_id`,`mb_id`,`mission_date`,`roadmap_task_id`),
  KEY `mission_date` (`mission_date`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `g5_seosys300_activities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL DEFAULT 0,
  `mb_id` varchar(20) NOT NULL DEFAULT '',
  `activity_type` varchar(50) NOT NULL DEFAULT '',
  `entity_type` varchar(40) NOT NULL DEFAULT '',
  `entity_id` int(11) NOT NULL DEFAULT 0,
  `title` varchar(191) NOT NULL DEFAULT '',
  `description` varchar(255) NOT NULL DEFAULT '',
  `metadata_json` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `project_created` (`project_id`,`created_at`),
  KEY `activity_type` (`activity_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `g5_seosys300_admin_notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL DEFAULT 0,
  `order_id` int(11) NOT NULL DEFAULT 0,
  `admin_mb_id` varchar(20) NOT NULL DEFAULT '',
  `note` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `order_id` (`order_id`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT IGNORE INTO `g5_seosys300_roadmap_steps`
(`step_key`,`title`,`description`,`sort_order`,`icon_key`,`is_active`,`created_at`,`updated_at`) VALUES
('project_setup','STEP 1 프로젝트 설정','수익형 니치 시장과 타겟 고객 정의',1,'project',1,NOW(),NOW()),
('website','STEP 2 홈페이지 준비','SEO 최적화 전용 웹사이트 주문 및 고속 환경 구축',2,'website',1,NOW(),NOW()),
('domain','STEP 3 도메인','CatchDomain 활용 고품질 만료도메인 또는 브랜드 도메인 연결',3,'domain',1,NOW(),NOW()),
('technical_seo','STEP 4 SEO 기본 설정','GSC, GA4, Robots, Sitemap 등 테크니컬 SEO 기초',4,'seo',1,NOW(),NOW()),
('keywords','STEP 5 키워드 전략','메인/서브/롱테일 키워드 마인드맵 구축',5,'keywords',1,NOW(),NOW()),
('content','STEP 6 콘텐츠','고품질 SEO 아티클 발행',6,'content',1,NOW(),NOW()),
('backlink','STEP 7 백링크','안전하고 강력한 Referring Domain 확대',7,'backlink',1,NOW(),NOW()),
('traffic','STEP 8 트래픽','초기 검색 신호 및 CTR 부스팅',8,'traffic',1,NOW(),NOW()),
('analytics','STEP 9 성과 분석','구글 노출/클릭 및 SERP 모니터링',9,'analytics',1,NOW(),NOW()),
('growth','STEP 10 반복 성장','수익화 파이프라인 완성 및 반복 개선',10,'growth',1,NOW(),NOW());

INSERT IGNORE INTO `g5_seosys300_roadmap_tasks`
(`step_id`,`task_key`,`title`,`description`,`help_text`,`estimated_minutes`,`related_tool`,`lesson_key`,`completion_type`,`sort_order`,`is_required`,`is_active`,`created_at`,`updated_at`)
SELECT s.id, v.task_key, v.title, v.description, v.help_text, v.estimated_minutes, v.related_tool, v.lesson_key, v.completion_type, v.sort_order, v.is_required, 1, NOW(), NOW()
FROM (
  SELECT 'project_setup' sk, 'project_basic_info' task_key, '프로젝트 기본정보' title, '프로젝트 이름, 목적, 사업 유형을 저장합니다.' description, '' help_text, 15 estimated_minutes, '' related_tool, '1' lesson_key, 'auto' completion_type, 1 sort_order, 1 is_required
  UNION ALL SELECT 'project_setup','project_goals','목표 설정','노출/트래픽/콘텐츠/백링크 목표를 입력합니다.','',20,'','1','auto',2,1
  UNION ALL SELECT 'project_setup','project_keywords','목표 키워드 등록','핵심 타겟 키워드를 프로젝트에 등록합니다.','',20,'','1','check',3,1
  UNION ALL SELECT 'project_setup','competitor_benchmark','경쟁 사이트 벤치마킹','상위 경쟁사 트래픽과 키워드를 확인합니다.','',30,'','1','check',4,0
  UNION ALL SELECT 'website','website_need','홈페이지 필요 여부 확인','기존 사이트 유무와 제작 필요성을 확정합니다.','',10,'website','2','check',1,1
  UNION ALL SELECT 'website','website_order','홈페이지 제작 주문','위저드로 제작 주문을 제출합니다.','',40,'website','2','auto',2,1
  UNION ALL SELECT 'website','website_open','홈페이지 오픈 확인','제작 완료 후 사이트 오픈을 확인합니다.','',20,'website','2','auto',3,1
  UNION ALL SELECT 'website','website_mobile_qa','모바일 가독성 검수','헤더/푸터 및 모바일 폰트를 검수합니다.','',20,'website','2','check',4,0
  UNION ALL SELECT 'domain','domain_owned','도메인 보유 확인','보유 도메인 또는 신규/낙장 방향을 확정합니다.','',10,'catchdomain','3','auto',1,1
  UNION ALL SELECT 'domain','catchdomain_candidates','CatchDomain 후보 확인','스팸 이력 없는 후보 도메인을 확인합니다.','',20,'catchdomain','3','check',2,1
  UNION ALL SELECT 'domain','domain_final','최종 도메인 설정','프로젝트에 사용할 도메인을 저장합니다.','',15,'catchdomain','3','auto',3,1
  UNION ALL SELECT 'technical_seo','https_setup','HTTPS 적용','SSL 인증서와 HTTPS 강제 여부를 확인합니다.','',15,'','4','check',1,1
  UNION ALL SELECT 'technical_seo','gsc_connect','Search Console 연결','GSC 소유권 인증을 완료합니다.','',20,'','4','check',2,1
  UNION ALL SELECT 'technical_seo','ga4_connect','GA4 연결','GA4 추적 코드를 삽입합니다.','',20,'','4','check',3,1
  UNION ALL SELECT 'technical_seo','sitemap_submit','Sitemap 제출','sitemap.xml을 제출합니다.','',15,'','4','check',4,1
  UNION ALL SELECT 'technical_seo','robots_setup','robots.txt 확인','크롤러 접근 규칙을 확인합니다.','',10,'','4','check',5,1
  UNION ALL SELECT 'technical_seo','index_check','Index 확인','주요 URL 색인 상태를 확인합니다.','',15,'','4','check',6,1
  UNION ALL SELECT 'keywords','seed_keyword','Seed Keyword 선정','핵심 시드 키워드를 선정합니다.','',25,'','5','check',1,1
  UNION ALL SELECT 'keywords','longtail_keyword','Long-tail Keyword 발굴','검색 의도별 롱테일을 정리합니다.','',30,'','5','check',2,1
  UNION ALL SELECT 'keywords','keyword_group','Keyword Group 구성','토픽 클러스터를 구성합니다.','',25,'','5','check',3,1
  UNION ALL SELECT 'keywords','keyword_priority','우선순위 설정','발행 우선순위를 정합니다.','',15,'','5','check',4,1
  UNION ALL SELECT 'content','content_plan','콘텐츠 계획','발행 일정과 주제를 계획합니다.','',20,'content','6','check',1,1
  UNION ALL SELECT 'content','content_first','첫 콘텐츠 발행','첫 아티클 URL을 기록합니다.','결과 URL이 필요합니다.',30,'content','6','result_required',2,1
  UNION ALL SELECT 'content','content_10','콘텐츠 10개','누적 10개 발행을 확인합니다.','',40,'content','6','check',3,1
  UNION ALL SELECT 'content','content_30','콘텐츠 30개','누적 30개 발행을 확인합니다.','',40,'content','6','check',4,1
  UNION ALL SELECT 'content','content_50','콘텐츠 50개','누적 50개 발행을 확인합니다.','',40,'content','6','check',5,0
  UNION ALL SELECT 'backlink','competitor_backlink','경쟁사 분석','경쟁사 백링크 프로필을 확인합니다.','',30,'backlink','7','check',1,1
  UNION ALL SELECT 'backlink','backlink_plan','백링크 계획','앵커 비율과 출처 계획을 세웁니다.','',20,'backlink','7','check',2,1
  UNION ALL SELECT 'backlink','first_backlink','첫 백링크 작업','첫 백링크 작업 결과를 기록합니다.','결과 URL이 필요합니다.',30,'backlink','7','result_required',3,1
  UNION ALL SELECT 'backlink','referring_domain_check','Referring Domain 확인','확보한 RD를 점검합니다.','',20,'backlink','7','check',4,1
  UNION ALL SELECT 'traffic','traffic_strategy','Traffic 전략','초기 트래픽 전략을 정합니다.','',20,'traffic','8','check',1,1
  UNION ALL SELECT 'traffic','first_traffic','첫 Traffic 작업','첫 트래픽 캠페인 결과를 기록합니다.','결과 URL이 필요합니다.',25,'traffic','8','result_required',2,1
  UNION ALL SELECT 'traffic','traffic_result','결과 확인','체류시간/CTR 신호를 확인합니다.','',20,'traffic','8','check',3,1
  UNION ALL SELECT 'analytics','gsc_review','GSC 확인','주간 GSC 리포트를 확인합니다.','',20,'','9','check',1,1
  UNION ALL SELECT 'analytics','impressions_clicks','노출/클릭 확인','노출과 클릭 변화를 기록합니다.','',15,'','9','check',2,1
  UNION ALL SELECT 'analytics','ranking_keywords','Ranking Keyword 확인','상위권 키워드를 점검합니다.','',20,'','9','check',3,1
  UNION ALL SELECT 'analytics','improve_targets','개선 대상 확인','4~20위 잠재 키워드를 정리합니다.','',20,'','9','check',4,1
  UNION ALL SELECT 'growth','content_improve','콘텐츠 개선','기존 콘텐츠를 개선합니다.','',30,'content','10','check',1,1
  UNION ALL SELECT 'growth','backlink_improve','백링크 개선','백링크 프로필을 보완합니다.','',30,'backlink','10','check',2,1
  UNION ALL SELECT 'growth','traffic_improve','트래픽 개선','트래픽 전략을 재조정합니다.','',30,'traffic','10','check',3,1
  UNION ALL SELECT 'growth','monthly_seo_review','월간 SEO Review','월간 리뷰를 작성합니다.','',40,'','10','result_required',4,1
) v
INNER JOIN `g5_seosys300_roadmap_steps` s ON s.step_key = v.sk;
