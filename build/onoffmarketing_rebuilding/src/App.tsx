/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import RenewalChrome, { RenewalFooter } from './components/RenewalChrome';
import AdminEnrollmentsShortcut from './components/AdminEnrollmentsShortcut';
import { ConsultProvider } from './context/ConsultContext';
import { HashLegacyRedirect } from './components/HashLegacyRedirect';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import { AUTH_ROUTES } from './lib/brandedAuth';

/** Route-level lazy chunks — keep Home in the initial bundle. */
const Geo = lazy(() => import('./pages/Geo'));
const Domain = lazy(() => import('./pages/Domain'));
const Backlink = lazy(() => import('./pages/Backlink'));
const Traffic = lazy(() => import('./pages/Traffic'));
const Content = lazy(() => import('./pages/Content'));
const Education = lazy(() => import('./pages/Education'));
const EducationClassroom = lazy(() => import('./pages/EducationClassroom'));
const EducationContractPage = lazy(() => import('./pages/EducationContractPage'));
const MarketingContractPage = lazy(() =>
  import('./pages/ServiceContractPage').then((m) => ({ default: m.MarketingContractPage }))
);
const CombinedContractPage = lazy(() =>
  import('./pages/ServiceContractPage').then((m) => ({ default: m.CombinedContractPage }))
);
const LessonPreviewPage = lazy(() => import('./education/pages/LessonPreviewPage'));
const LessonStandalonePage = lazy(() => import('./education/pages/LessonStandalonePage'));
const NotFound = lazy(() => import('./pages/NotFound'));

const Company = lazy(() => import('./pages/Company'));
const DiyCourse = lazy(() => import('./pages/DiyCourse'));
const RequestBuild = lazy(() => import('./pages/RequestBuild'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const SeoAeo = lazy(() => import('./pages/SeoAeo'));
const SeoPlatform = lazy(() => import('./pages/SeoPlatform'));
const AITools = lazy(() => import('./pages/AITools'));
const BlogService = lazy(() => import('./pages/BlogService'));
const CafeService = lazy(() => import('./pages/CafeService'));
const Platform = lazy(() => import('./pages/Platform'));
const OnoffCpa = lazy(() => import('./pages/OnoffCpa'));
const FreeCourses = lazy(() => import('./pages/FreeCourses'));
const Community = lazy(() => import('./pages/Community'));
const Consult = lazy(() => import('./pages/Consult'));

const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));
const AuthCallbackPage = lazy(() => import('./pages/auth/AuthCallbackPage'));
const SessionExpiredPage = lazy(() => import('./pages/auth/SessionExpiredPage'));
const PasswordForgotPage = lazy(() => import('./pages/auth/PasswordForgotPage'));
const AccountDashboardPage = lazy(() => import('./pages/account/AccountDashboardPage'));
const AccountPointsPage = lazy(() => import('./pages/account/AccountPointsPage'));
const AccountNotificationsPage = lazy(() => import('./pages/account/AccountNotificationsPage'));
const AccountEnrollmentsPage = lazy(() => import('./pages/account/AccountEnrollmentsPage'));

function RouteFallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center text-slate-500 text-sm" aria-busy="true">
      로딩 중…
    </div>
  );
}

/** Main marketing chrome (header/footer/chat). Auth pages render outside this. */
function RenewalLayout() {
  return (
    <div className="min-h-screen font-sans selection:bg-blue-200 relative flex flex-col">
      <RenewalChrome />
      <div className="flex-1">
        <Outlet />
      </div>
      <RenewalFooter />
      <Chatbot />
    </div>
  );
}

/**
 * Phase 3 — Pretty URL ready
 * - BrowserRouter for /geo, /domain, … (requires server rewrite before production)
 * - HashLegacyRedirect: /#/geo → /geo (and legacy hash bookmarks → path)
 * - Auth SPA pages (/login, /signup, …) stand alone without RenewalChrome
 */
export default function App() {
  return (
    <BrowserRouter>
      <ConsultProvider>
        <HashLegacyRedirect />
        <AdminEnrollmentsShortcut />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* Branded auth — AuthShell only (no RenewalChrome) */}
            <Route path={AUTH_ROUTES.login} element={<LoginPage />} />
            <Route path={AUTH_ROUTES.signup} element={<SignupPage />} />
            <Route path={AUTH_ROUTES.authCallback} element={<AuthCallbackPage />} />
            <Route path={AUTH_ROUTES.passwordForgot} element={<PasswordForgotPage />} />
            <Route path={AUTH_ROUTES.sessionExpired} element={<SessionExpiredPage />} />
            <Route path={AUTH_ROUTES.account} element={<AccountDashboardPage />} />
            <Route path={AUTH_ROUTES.accountPoints} element={<AccountPointsPage />} />
            <Route path={AUTH_ROUTES.accountNotifications} element={<AccountNotificationsPage />} />
            <Route path={AUTH_ROUTES.accountEnrollments} element={<AccountEnrollmentsPage />} />
            <Route path="/education/lesson/:lessonId/present" element={<LessonStandalonePage />} />

            {/* Marketing site with chrome */}
            <Route element={<RenewalLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/geo" element={<Geo />} />
              <Route path="/domain" element={<Domain />} />
              <Route path="/backlink" element={<Backlink />} />
              <Route path="/traffic" element={<Traffic />} />
              <Route path="/content" element={<Content />} />
              <Route path="/education" element={<Education />} />
              <Route path="/education/classroom" element={<EducationClassroom />} />
              <Route path="/education/contract" element={<EducationContractPage />} />
              <Route path="/marketing/contract" element={<MarketingContractPage />} />
              <Route path="/service/contract" element={<CombinedContractPage />} />
              <Route path="/education/lesson/:lessonId" element={<LessonPreviewPage />} />

              <Route path="/company" element={<Company />} />
              <Route path="/diy" element={<DiyCourse />} />
              <Route path="/request" element={<RequestBuild />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/seo-aeo" element={<SeoAeo />} />
              <Route path="/seo-platform" element={<SeoPlatform />} />
              <Route path="/ai-tools" element={<AITools />} />
              <Route path="/blog" element={<BlogService />} />
              <Route path="/cafe" element={<CafeService />} />
              <Route path="/platform" element={<Platform />} />
              <Route path="/onoffcpa" element={<OnoffCpa />} />
              <Route path="/free-courses" element={<FreeCourses />} />
              <Route path="/community" element={<Community />} />
              <Route path="/consult" element={<Consult />} />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </ConsultProvider>
    </BrowserRouter>
  );
}
