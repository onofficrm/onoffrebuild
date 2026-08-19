import React, { useState } from 'react';
import {
  FolderKanban,
  Globe2,
  PlusCircle,
  ExternalLink,
  CheckCircle2,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldCheck
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
  onNavigate: (tab: NavigationTab, subTab?: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onAddNewProject,
  onNavigate
}) => {
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDomain, setNewProjectDomain] = useState('');
  const [newProjectNiche, setNewProjectNiche] = useState('');

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
                  <div className="text-slate-500">니치 카테고리:</div>
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
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button
                  variant={isSelected ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => onSelectProject(proj)}
                >
                  {isSelected ? '현재 관제중' : '이 프로젝트 선택'}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  rightIcon={<ArrowRight className="w-3 h-3" />}
                  onClick={() => {
                    onSelectProject(proj);
                    onNavigate('dashboard');
                  }}
                >
                  대시보드 보기
                </Button>
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
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              타겟 니치 시장
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
    </div>
  );
};
