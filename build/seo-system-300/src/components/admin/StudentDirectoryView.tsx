import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  LayoutTemplate,
  Compass,
  ArrowUpDown
} from 'lucide-react';
import { StudentSummary } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { AdminLiveReadonlyPanel } from './AdminLiveReadonlyPanel';

export interface StudentDirectoryViewProps {
  students: StudentSummary[];
  onOpenStudentDetail: (student: StudentSummary) => void;
}

export const StudentDirectoryView: React.FC<StudentDirectoryViewProps> = ({
  students,
  onOpenStudentDetail
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cohortFilter, setCohortFilter] = useState('all');
  const [stepFilter, setStepFilter] = useState('all');
  const [websiteFilter, setWebsiteFilter] = useState('all');
  const [onlyNeedsAttention, setOnlyNeedsAttention] = useState(false);
  const [onlyInactive7Days, setOnlyInactive7Days] = useState(false);

  const filteredStudents = students.filter((std) => {
    const matchesSearch =
      std.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.domain.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCohort = cohortFilter === 'all' || std.cohort === cohortFilter;
    const matchesWebsite = websiteFilter === 'all' || std.websiteStatus === websiteFilter;

    const matchesStep =
      stepFilter === 'all' ||
      (stepFilter === 'early' && std.currentStepNumber <= 3) ||
      (stepFilter === 'mid' && std.currentStepNumber >= 4 && std.currentStepNumber <= 6) ||
      (stepFilter === 'late' && std.currentStepNumber >= 7);

    const matchesAttention = !onlyNeedsAttention || std.needsAdminCheck;
    const matchesInactive = !onlyInactive7Days || std.lastActiveDays >= 7;

    return (
      matchesSearch &&
      matchesCohort &&
      matchesWebsite &&
      matchesStep &&
      matchesAttention &&
      matchesInactive
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <AdminLiveReadonlyPanel />
      {/* Top Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#2563EB]" />
            <h1 className="text-lg sm:text-xl font-black text-[#0F172A]">
              수강생 통합 관리 센터
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            전체 {students.length}명 수강생의 진도율, 홈페이지 제작 상태, SEO 지표를 필터링하여 일괄 관리합니다.
          </p>
        </div>

        {/* Quick Summary Counts */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOnlyNeedsAttention(!onlyNeedsAttention)}
            className={`px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              onlyNeedsAttention
                ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs'
                : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:border-rose-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>확인 필요만 ({students.filter((s) => s.needsAdminCheck).length}명)</span>
          </button>

          <button
            onClick={() => setOnlyInactive7Days(!onlyInactive7Days)}
            className={`px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              onlyInactive7Days
                ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-xs'
                : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:border-amber-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>7일 이상 미접속</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="수강생 이름, 프로젝트명, 도메인 검색..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB]"
          />
        </div>

        {/* Cohort Select */}
        <select
          value={cohortFilter}
          onChange={(e) => setCohortFilter(e.target.value)}
          className="px-3 py-2 text-xs font-bold bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB]"
        >
          <option value="all">기수: 전체</option>
          <option value="300기">300기</option>
          <option value="299기">299기</option>
          <option value="298기">298기</option>
        </select>

        {/* Step Select */}
        <select
          value={stepFilter}
          onChange={(e) => setStepFilter(e.target.value)}
          className="px-3 py-2 text-xs font-bold bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB]"
        >
          <option value="all">진행단계: 전체</option>
          <option value="early">초기 (STEP 1~3 기획/제작)</option>
          <option value="mid">중기 (STEP 4~6 콘텐츠/Silo)</option>
          <option value="late">후기 (STEP 7~10 백링크/스케일)</option>
        </select>

        {/* Website Status Select */}
        <select
          value={websiteFilter}
          onChange={(e) => setWebsiteFilter(e.target.value)}
          className="px-3 py-2 text-xs font-bold bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB]"
        >
          <option value="all">홈페이지 상태: 전체</option>
          <option value="자료대기">자료대기</option>
          <option value="기획중">기획중</option>
          <option value="디자인중">디자인중</option>
          <option value="개발중">개발중</option>
          <option value="검수대기">검수대기</option>
          <option value="완료">완료</option>
        </select>

        {(cohortFilter !== 'all' ||
          stepFilter !== 'all' ||
          websiteFilter !== 'all' ||
          searchQuery ||
          onlyNeedsAttention ||
          onlyInactive7Days) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setCohortFilter('all');
              setStepFilter('all');
              setWebsiteFilter('all');
              setOnlyNeedsAttention(false);
              setOnlyInactive7Days(false);
            }}
            className="text-xs font-bold text-[#2563EB] hover:underline px-2 py-1"
          >
            필터 초기화
          </button>
        )}
      </div>

      {/* Student Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] font-bold">
                <th className="py-3.5 px-4">이름 / 기수</th>
                <th className="py-3.5 px-4">프로젝트 & 도메인</th>
                <th className="py-3.5 px-4">현재 단계</th>
                <th className="py-3.5 px-4 text-center">진행률</th>
                <th className="py-3.5 px-4">마지막 활동</th>
                <th className="py-3.5 px-4">홈페이지</th>
                <th className="py-3.5 px-4">SEO 상태</th>
                <th className="py-3.5 px-4 text-right">관리자 확인</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredStudents.map((std) => (
                <tr
                  key={std.id}
                  onClick={() => onOpenStudentDetail(std)}
                  className="hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                >
                  {/* Name & Cohort */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-[#EFF6FF] text-[#2563EB] font-black flex items-center justify-center text-xs">
                        {std.name[0]}
                      </div>
                      <div>
                        <strong className="text-[#0F172A] block text-xs group-hover:text-[#2563EB] transition-colors">
                          {std.name}
                        </strong>
                        <span className="text-[10px] text-[#64748B]">{std.cohort}</span>
                      </div>
                    </div>
                  </td>

                  {/* Project & Domain */}
                  <td className="py-3.5 px-4">
                    <div>
                      <span className="font-bold text-[#0F172A] block break-words">{std.projectName}</span>
                      <span className="text-[11px] font-mono text-[#2563EB] break-all">{std.domain}</span>
                    </div>
                  </td>

                  {/* Current Step */}
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-[#334155]">{std.currentStepTitle}</span>
                  </td>

                  {/* Progress */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="font-bold font-mono text-[#2563EB]">{std.roadmapProgress}%</span>
                      <div className="w-16 bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className="bg-[#2563EB] h-full rounded-full"
                          style={{ width: `${std.roadmapProgress}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Last Active */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-xs ${
                        std.lastActiveDays >= 7 ? 'text-rose-600 font-bold' : 'text-[#64748B]'
                      }`}
                    >
                      {std.lastActive}
                    </span>
                  </td>

                  {/* Website Status */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        std.websiteStatus === '완료'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : std.websiteStatus === '검수대기'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : std.websiteStatus === '자료대기'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {std.websiteStatus}
                    </span>
                  </td>

                  {/* SEO Health */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold font-mono text-[#0F172A]">{std.seoHealthScore}점</span>
                      {std.seoTrend === 'growth' && <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />}
                      {std.seoTrend === 'drop' && <TrendingDown className="w-3.5 h-3.5 text-rose-600" />}
                    </div>
                  </td>

                  {/* Admin Check Action */}
                  <td className="py-3.5 px-4 text-right">
                    {std.needsAdminCheck ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200">
                        <AlertTriangle className="w-3 h-3" />
                        <span>확인 필요</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>정상</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
