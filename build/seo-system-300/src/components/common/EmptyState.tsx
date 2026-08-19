import React from 'react';
import {
  FolderPlus,
  LayoutTemplate,
  FileText,
  Link2,
  Sparkles,
  ArrowRight,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { Button } from './Button';

export type EmptyStateType = 'projects' | 'website_order' | 'content' | 'backlinks' | 'custom';

export interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'custom',
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  icon,
  className = ''
}) => {
  // Preset defaults according to system spec
  const presets: Record<
    Exclude<EmptyStateType, 'custom'>,
    {
      title: string;
      description: string;
      actionText: string;
      icon: React.ReactNode;
    }
  > = {
    projects: {
      title: 'SEO 프로젝트를 시작해보세요',
      description: '새로운 도메인과 타겟 니치로 10단계 SEO 로드맵을 가동할 프로젝트를 생성하세요.',
      actionText: '첫 프로젝트 만들기',
      icon: <FolderPlus className="w-8 h-8 text-[#2563EB]" />
    },
    website_order: {
      title: 'SEO용 홈페이지가 필요하신가요?',
      description: '어떤 사이트를 만들지 몰라도 괜찮습니다. 준비된 템플릿과 1:1 기획 지원으로 빠르고 탄탄하게 제작해드립니다.',
      actionText: '홈페이지 기획 시작',
      icon: <LayoutTemplate className="w-8 h-8 text-[#2563EB]" />
    },
    content: {
      title: '첫 SEO 콘텐츠를 만들어보세요',
      description: '검색 엔진이 좋아하는 Silo 구조와 AI 기반 초안 생성으로 고품질 콘텐츠를 신속하게 발행하세요.',
      actionText: '콘텐츠 시작',
      icon: <FileText className="w-8 h-8 text-[#2563EB]" />
    },
    backlinks: {
      title: '아직 백링크 작업을 시작하지 않았습니다',
      description: '콘텐츠가 30개 이상 누적되면, 안전하고 강력한 Referring Domain 백링크 주입으로 도메인 파워를 강화합니다.',
      actionText: '백링크 알아보기',
      icon: <Link2 className="w-8 h-8 text-[#2563EB]" />
    }
  };

  const currentConfig =
    type !== 'custom'
      ? presets[type]
      : {
          title: title || '등록된 데이터가 없습니다',
          description: description || '새로운 항목을 추가하여 작업을 시작하세요.',
          actionText: actionText || '시작하기',
          icon: icon || <Sparkles className="w-8 h-8 text-[#2563EB]" />
        };

  const finalTitle = title || currentConfig.title;
  const finalDescription = description || currentConfig.description;
  const finalActionText = actionText || currentConfig.actionText;
  const finalIcon = icon || currentConfig.icon;

  return (
    <div
      className={`bg-white border border-[#E2E8F0] rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-2xs space-y-4 ${className}`}
    >
      <div className="w-16 h-16 rounded-3xl bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center mx-auto shadow-xs">
        {finalIcon}
      </div>

      <div className="space-y-1.5 max-w-md mx-auto">
        <h3 className="text-base sm:text-lg font-black text-[#0F172A]">{finalTitle}</h3>
        <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">{finalDescription}</p>
      </div>

      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
        {onAction && (
          <Button
            variant="primary"
            size="md"
            onClick={onAction}
            className="font-bold shadow-xs flex items-center gap-2"
          >
            <span>{finalActionText}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}

        {secondaryActionText && onSecondaryAction && (
          <Button
            variant="outline"
            size="md"
            onClick={onSecondaryAction}
            className="font-bold text-[#64748B]"
          >
            {secondaryActionText}
          </Button>
        )}
      </div>
    </div>
  );
};
