import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Globe2,
  PlusCircle,
  ExternalLink,
  CheckCircle2,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Settings2,
  Trash2
} from 'lucide-react';
import { Project, NavigationTab } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { Modal } from '../common/Modal';

export interface ProjectsViewProps {
  projects: Project[];
  activeProject: Project | null;
  onSelectProject: (proj: Project) => void;
  onAddNewProject: (proj: Partial<Project>) => void;
  onSaveKeywords: (project: Project, keywords: string[]) => Promise<void>;
  onSaveSettings: (project: Project, input: Partial<Project>) => Promise<void>;
  onDeleteProject: (project: Project) => Promise<void>;
  onNavigate: (tab: NavigationTab, subTab?: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onAddNewProject,
  onSaveKeywords,
  onSaveSettings,
  onDeleteProject,
  onNavigate
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [keywordProject, setKeywordProject] = useState<Project | null>(null);
  const [keywordText, setKeywordText] = useState('');
  const [keywordSaving, setKeywordSaving] = useState(false);
  const [keywordError, setKeywordError] = useState('');
  const [settingsProject, setSettingsProject] = useState<Project | null>(null);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [settingsForm, setSettingsForm] = useState({
    name: '',
    domain: '',
    niche: '',
    businessType: '',
    primaryRegion: '',
    impressionsGoal: '',
    trafficGoal: '',
    contentGoal: '',
    referringDomainGoal: '',
  });
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDomain, setNewProjectDomain] = useState('');
  const [newProjectNiche, setNewProjectNiche] = useState('');

  const openSettings = (project: Project) => {
    onSelectProject(project);
    setSettingsProject(project);
    setSettingsError('');
    setSettingsForm({
      name: project.name || '',
      domain: project.domain === '도메인 미정' ? '' : project.domain || '',
      niche: project.niche || '',
      businessType: project.businessType || '',
      primaryRegion: project.primaryRegion || '',
      impressionsGoal: String(project.impressionsGoal || ''),
      trafficGoal: String(project.trafficGoal || ''),
      contentGoal: String(project.contentGoal || ''),
      referringDomainGoal: String(project.referringDomainGoal || ''),
    });
  };

  const closeSettings = () => {
    setSettingsProject(null);
    setSettingsError('');
    if (new URLSearchParams(location.search).get('panel') === 'settings') {
      navigate('/projects', { replace: true });
    }
  };

  const handleSaveSettings = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!settingsProject || !settingsForm.name.trim() || settingsSaving) return;
    setSettingsSaving(true);
    setSettingsError('');
    try {
      await onSaveSettings(settingsProject, {
        name: settingsForm.name.trim(),
        domain: settingsForm.domain.trim(),
        niche: settingsForm.niche.trim(),
        businessType: settingsForm.businessType.trim(),
        primaryRegion: settingsForm.primaryRegion.trim(),
        impressionsGoal: Number(settingsForm.impressionsGoal) || 0,
        trafficGoal: Number(settingsForm.trafficGoal) || 0,
        contentGoal: Number(settingsForm.contentGoal) || 0,
        referringDomainGoal: Number(settingsForm.referringDomainGoal) || 0,
      });
      closeSettings();
    } catch (error) {
      setSettingsError(error instanceof Error ? error.message : '프로젝트 설정을 저장하지 못했습니다.');
    } finally {
      setSettingsSaving(false);
    }
  };

  const openKeywordEditor = (project: Project) => {
    onSelectProject(project);
    setKeywordProject(project);
    setKeywordText((project.targetKeywords || []).join('\n'));
    setKeywordError('');
  };

  const closeKeywordEditor = () => {
    setKeywordProject(null);
    setKeywordError('');
    if (new URLSearchParams(location.search).get('panel') === 'keywords') {
      navigate('/projects', { replace: true });
    }
  };

  useEffect(() => {
    const panel = new URLSearchParams(location.search).get('panel');
    if (!activeProject) return;
    if (panel === 'keywords') openKeywordEditor(activeProject);
    if (panel === 'settings') openSettings(activeProject);
  }, [location.search, activeProject?.id]);

  const parsedKeywords = Array.from(
    new Set(
      keywordText
        .split(/[\n,]/)
        .map((value) => value.trim())
        .filter(Boolean)
    )
  ).slice(0, 100);

  const handleSaveKeywords = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!keywordProject || keywordSaving) return;
    if (parsedKeywords.length === 0) {
      setKeywordError('목표 키워드를 1개 이상 입력해주세요.');
      return;
    }
    setKeywordSaving(true);
    setKeywordError('');
    try {
      await onSaveKeywords(keywordProject, parsedKeywords);
      closeKeywordEditor();
    } catch (error) {
      setKeywordError(error instanceof Error ? error.message : '키워드를 저장하지 못했습니다.');
    } finally {
      setKeywordSaving(false);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || !newProjectDomain.trim()) return;

    onAddNewProject({
      name: newProjectName,
      domain: newProjectDomain,
      niche: newProjectNiche || '신규 니치 마켓'
    });

    setNewProjectName('');
    setNewProjectDomain('');
    setNewProjectNiche('');
    setIsNewProjectModalOpen(false);
  };

  const closeDeleteModal = () => {
    if (deleteSaving) return;
    setDeleteProject(null);
    setDeleteConfirmText('');
    setDeleteError('');
  };

  const handleDeleteProject = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!deleteProject || deleteConfirmText !== deleteProject.name || deleteSaving) return;
    setDeleteSaving(true);
    setDeleteError('');
    try {
      await onDeleteProject(deleteProject);
      setDeleteSaving(false);
      setDeleteProject(null);
      setDeleteConfirmText('');
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : '프로젝트를 삭제하지 못했습니다.');
      setDeleteSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-blue-600" />
            <span>내 프로젝트 관리</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            등록된 모든 SEO 웹사이트 자산의 구축 진행률과 트래픽 성과를 통합 관리합니다.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<PlusCircle className="w-4 h-4" />}
          onClick={() => setIsNewProjectModalOpen(true)}
        >
          새 SEO 프로젝트 등록
        </Button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Card className="p-10 text-center space-y-4">
          <h2 className="text-lg font-black text-slate-900">첫 SEO 프로젝트를 시작해보세요.</h2>
          <p className="text-sm text-slate-500">등록된 프로젝트가 없습니다. 새 프로젝트를 만들면 이 목록에 표시됩니다.</p>
          <Button variant="primary" leftIcon={<PlusCircle className="w-4 h-4" />} onClick={() => setIsNewProjectModalOpen(true)}>
            새 프로젝트 만들기
          </Button>
        </Card>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((proj) => {
          const isSelected = Boolean(activeProject && proj.id === activeProject.id);

          return (
            <Card
              key={proj.id}
              className={`p-5 flex flex-col justify-between transition-all relative ${
                isSelected
                  ? 'border-blue-400 ring-2 ring-blue-100 shadow-md'
                  : 'hover:border-slate-300 hover:shadow-2xs'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-slate-900 truncate">{proj.name}</h3>
                      {isSelected && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                          선택됨
                        </span>
                      )}
                    </div>
                    <a
                      href={`https://${proj.domain}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {proj.domain}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <Badge status={proj.status} size="sm">
                    {proj.status === 'in_progress' ? '운영중' : '세팅대기'}
                  </Badge>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                  <div className="text-slate-500">업종:</div>
                  <div className="font-semibold text-slate-800 truncate">{proj.niche}</div>
                </div>

                {/* Progress */}
                <div className="space-y-1.5">
                  <ProgressBar
                    label="전체 진행률"
                    value={proj.overallProgress}
                    variant={proj.overallProgress > 50 ? 'emerald' : 'blue'}
                    size="sm"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{proj.currentStep}</span>
                    <span>{proj.metrics.registeredKeywords}개 키워드</span>
                  </div>
                </div>

                {/* Metrics Highlights */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">구글 노출</span>
                    <span className="font-bold text-slate-900">{proj.metrics.googleImpressions.toLocaleString()}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">구글 클릭</span>
                    <span className="font-bold text-emerald-600">{proj.metrics.googleClicks.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button
                  variant={isSelected ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => onSelectProject(proj)}
                >
                  {isSelected ? '현재 관제중' : '이 프로젝트 선택'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<KeyRound className="w-3.5 h-3.5" />}
                  onClick={() => openKeywordEditor(proj)}
                >
                  목표 키워드 관리
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Settings2 className="w-3.5 h-3.5" />}
                  className="sm:col-span-2"
                  onClick={() => openSettings(proj)}
                >
                  기본정보·목표·도메인 설정
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  rightIcon={<ArrowRight className="w-3 h-3" />}
                  className="sm:col-span-2"
                  onClick={() => {
                    onSelectProject(proj);
                    onNavigate('dashboard');
                  }}
                >
                  프로젝트 열기
                </Button>
                <button
                  type="button"
                  className="sm:col-span-2 mx-auto inline-flex items-center gap-1 py-1 text-[11px] font-bold text-slate-400 transition-colors hover:text-rose-600"
                  onClick={() => {
                    setDeleteProject(proj);
                    setDeleteConfirmText('');
                    setDeleteError('');
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  프로젝트 삭제
                </button>
              </div>
            </Card>
          );
        })}
      </div>
      )}

      {/* New Project Modal */}
      <Modal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        title="새 SEO 프로젝트 등록"
        subtitle="새로운 수익형 니치 웹사이트 프로젝트를 등록하여 단계별 로드맵을 시작합니다."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              프로젝트 명칭 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="예: 발리 한달살기 숙소/비자 정보 허브"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              도메인 주소 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={newProjectDomain}
              onChange={(e) => setNewProjectDomain(e.target.value)}
              placeholder="balilife365.com"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              업종
            </label>
            <input
              type="text"
              value={newProjectNiche}
              onChange={(e) => setNewProjectNiche(e.target.value)}
              placeholder="해외 장기체류 / 발리 풀빌라 / 디지털 노마드 비자"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsNewProjectModalOpen(false)}>
              취소
            </Button>
            <Button type="submit" variant="primary" size="sm">
              프로젝트 생성
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={Boolean(deleteProject)}
        onClose={closeDeleteModal}
        title="프로젝트 삭제"
        subtitle="프로젝트 목록에서 제외합니다."
        maxWidth="md"
      >
        <form onSubmit={handleDeleteProject} className="space-y-4">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs leading-relaxed text-rose-800">
            <strong>{deleteProject?.name}</strong> 프로젝트를 삭제하시겠습니까?
            홈페이지 제작·수정요청 등 연결된 기록은 보호를 위해 즉시 영구 삭제되지 않습니다.
          </div>
          <label className="block text-xs font-bold text-slate-700">
            확인을 위해 프로젝트명 입력
            <input
              value={deleteConfirmText}
              onChange={(event) => setDeleteConfirmText(event.target.value)}
              placeholder={deleteProject?.name || ''}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-500"
              autoFocus
            />
          </label>
          {deleteError ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700">{deleteError}</p>
          ) : null}
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <Button type="button" variant="outline" size="sm" onClick={closeDeleteModal} disabled={deleteSaving}>
              취소
            </Button>
            <Button
              type="submit"
              variant="danger"
              size="sm"
              isLoading={deleteSaving}
              disabled={deleteConfirmText !== deleteProject?.name}
            >
              프로젝트 삭제
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={Boolean(keywordProject)}
        onClose={closeKeywordEditor}
        title="목표 키워드 관리"
        subtitle={`${keywordProject?.name || '선택한 프로젝트'}에서 검색 노출을 목표로 할 키워드를 등록합니다.`}
        maxWidth="xl"
      >
        <form onSubmit={handleSaveKeywords} className="space-y-4">
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-xs leading-relaxed text-blue-900">
            고객이 실제로 검색할 표현을 한 줄에 하나씩 입력하세요. 쉼표로 구분해도 됩니다.
            예: <strong>세부 가족여행 코스</strong>, <strong>막탄 리조트 추천</strong>
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <label htmlFor="project-target-keywords" className="text-xs font-bold text-slate-700">
                목표 키워드 <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] font-bold text-blue-600">{parsedKeywords.length}개</span>
            </div>
            <textarea
              id="project-target-keywords"
              value={keywordText}
              onChange={(event) => setKeywordText(event.target.value)}
              rows={9}
              placeholder={'세부 가족여행 코스\n막탄 리조트 추천\n세부 호핑투어 가격'}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm leading-7 focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <p className="mt-1.5 text-[11px] text-slate-500">
              중복 키워드는 자동 제거되며 최대 100개까지 저장됩니다.
            </p>
          </div>
          {parsedKeywords.length > 0 ? (
            <div className="flex max-h-28 flex-wrap gap-1.5 overflow-y-auto rounded-xl bg-slate-50 p-3">
              {parsedKeywords.map((keyword) => (
                <span key={keyword} className="rounded-full border border-blue-100 bg-white px-2.5 py-1 text-[11px] font-bold text-blue-700">
                  {keyword}
                </span>
              ))}
            </div>
          ) : null}
          {keywordError ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700">
              {keywordError}
            </p>
          ) : null}
          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
            <Button type="button" variant="outline" size="sm" onClick={closeKeywordEditor} disabled={keywordSaving}>
              취소
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={keywordSaving || parsedKeywords.length === 0}>
              {keywordSaving ? '저장 중' : `키워드 ${parsedKeywords.length}개 저장`}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={Boolean(settingsProject)}
        onClose={closeSettings}
        title="프로젝트 설정"
        subtitle="로드맵의 프로젝트 기본정보, 목표 설정, 최종 도메인 작업과 연결됩니다."
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveSettings} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-bold text-slate-700">
              프로젝트명 <span className="text-rose-500">*</span>
              <input
                value={settingsForm.name}
                onChange={(event) => setSettingsForm((prev) => ({ ...prev, name: event.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                required
              />
            </label>
            <label className="text-xs font-bold text-slate-700">
              최종 도메인
              <input
                value={settingsForm.domain}
                onChange={(event) => setSettingsForm((prev) => ({ ...prev, domain: event.target.value }))}
                placeholder="example.com"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
              />
            </label>
            <label className="text-xs font-bold text-slate-700">
              업종
              <input
                value={settingsForm.businessType}
                onChange={(event) => setSettingsForm((prev) => ({ ...prev, businessType: event.target.value }))}
                placeholder="예: 여행, 법률, 병원"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
              />
            </label>
            <label className="text-xs font-bold text-slate-700">
              주요 지역
              <input
                value={settingsForm.primaryRegion}
                onChange={(event) => setSettingsForm((prev) => ({ ...prev, primaryRegion: event.target.value }))}
                placeholder="예: 서울, 전국, 세부"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
              />
            </label>
          </div>
          <label className="block text-xs font-bold text-slate-700">
            사업 설명·목적
            <textarea
              value={settingsForm.niche}
              onChange={(event) => setSettingsForm((prev) => ({ ...prev, niche: event.target.value }))}
              rows={3}
              placeholder="누구에게 어떤 정보·상품·서비스를 제공하는 프로젝트인지 적어주세요."
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
            />
          </label>
          <div>
            <h3 className="text-sm font-black text-slate-900">목표 설정</h3>
            <p className="mt-0.5 text-[11px] text-slate-500">0이 아닌 목표를 하나 이상 저장하면 로드맵의 목표 설정이 완료됩니다.</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                ['impressionsGoal', '월 노출 목표'],
                ['trafficGoal', '월 트래픽 목표'],
                ['contentGoal', '콘텐츠 발행 목표'],
                ['referringDomainGoal', 'Referring Domain 목표'],
              ].map(([key, label]) => (
                <label key={key} className="text-xs font-bold text-slate-700">
                  {label}
                  <input
                    type="number"
                    min="0"
                    value={settingsForm[key as keyof typeof settingsForm]}
                    onChange={(event) => setSettingsForm((prev) => ({ ...prev, [key]: event.target.value }))}
                    placeholder="0"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                  />
                </label>
              ))}
            </div>
          </div>
          {settingsError ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700">{settingsError}</p>
          ) : null}
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <Button type="button" variant="outline" size="sm" onClick={closeSettings} disabled={settingsSaving}>
              취소
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={settingsSaving || !settingsForm.name.trim()}>
              {settingsSaving ? '저장 중' : '프로젝트 설정 저장'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
