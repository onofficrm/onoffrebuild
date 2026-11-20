import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { FeaturesOverviewPage } from './pages/FeaturesOverviewPage';
import { RoutineFeaturePage } from './pages/features/RoutineFeaturePage';
import { StepmailFeaturePage } from './pages/features/StepmailFeaturePage';
import { SnsMarketingFeaturePage } from './pages/features/SnsMarketingFeaturePage';
import { AutoCommentFeaturePage } from './pages/features/AutoCommentFeaturePage';
import { EasyEditFeaturePage } from './pages/features/EasyEditFeaturePage';
import { AiDevFeaturePage } from './pages/features/AiDevFeaturePage';
import { WebsiteServicePage } from './pages/WebsiteServicePage';
import { ManagementServicePage } from './pages/ManagementServicePage';
import { SeoServicePage } from './pages/SeoServicePage';
import { GeoServicePage } from './pages/GeoServicePage';
import { BacklinkServicePage } from './pages/BacklinkServicePage';
import { TrafficServicePage } from './pages/TrafficServicePage';
import { DomainServicePage } from './pages/DomainServicePage';
import { ContentServicePage } from './pages/ContentServicePage';
import { UseCasesPage } from './pages/UseCasesPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { PricingPage } from './pages/PricingPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Core Features Routes (기본 기능) */}
          <Route path="/features" element={<FeaturesOverviewPage />} />
          <Route path="/features/routine" element={<RoutineFeaturePage />} />
          <Route path="/features/step-mail" element={<StepmailFeaturePage />} />
          <Route path="/features/stepmail" element={<Navigate to="/features/step-mail" replace />} />
          <Route path="/features/sns-poster" element={<SnsMarketingFeaturePage />} />
          <Route path="/features/sns" element={<Navigate to="/features/sns-poster" replace />} />
          <Route path="/features/auto-comment" element={<AutoCommentFeaturePage />} />
          <Route path="/features/easy-edit" element={<EasyEditFeaturePage />} />
          <Route path="/features/ai-development" element={<AiDevFeaturePage />} />
          <Route path="/features/ai-dev" element={<Navigate to="/features/ai-development" replace />} />

          {/* Existing Website & Separate Service Routes (기존 URL 100% 유지) */}
          <Route path="/website" element={<WebsiteServicePage />} />
          <Route path="/management" element={<ManagementServicePage />} />
          <Route path="/services/seo" element={<SeoServicePage />} />
          <Route path="/seo" element={<Navigate to="/services/seo" replace />} />
          <Route path="/geo" element={<GeoServicePage />} />
          <Route path="/backlink" element={<BacklinkServicePage />} />
          <Route path="/traffic" element={<TrafficServicePage />} />
          <Route path="/domain" element={<DomainServicePage />} />
          <Route path="/content" element={<ContentServicePage />} />

          {/* Platform & Consultation Routes */}
          <Route path="/use-cases" element={<UseCasesPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
