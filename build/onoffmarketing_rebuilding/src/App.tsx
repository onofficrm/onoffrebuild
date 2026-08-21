/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileCTA from './components/MobileCTA';
import Home from './pages/Home';
import Company from './pages/Company';
import DiyCourse from './pages/DiyCourse';
import RequestBuild from './pages/RequestBuild';
import Traffic from './pages/Traffic';
import BlogService from './pages/BlogService';
import CafeService from './pages/CafeService';
import Platform from './pages/Platform';
import OnoffCpa from './pages/OnoffCpa';
import FreeCourses from './pages/FreeCourses';
import Community from './pages/Community';
import Consult from './pages/Consult';
import Pricing from './pages/Pricing';
import Portfolio from './pages/Portfolio';
import AITools from './pages/AITools';
import SeoAeo from './pages/SeoAeo';
import SeoPlatform from './pages/SeoPlatform';
import CommonCTA from './components/CommonCTA';
import Chatbot from './components/Chatbot';

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen font-sans selection:bg-blue-200 relative">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/company" element={<Company />} />
          <Route path="/diy" element={<DiyCourse />} />
          <Route path="/request" element={<RequestBuild />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/traffic" element={<Traffic />} />
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
        </Routes>
        <Chatbot />
        <CommonCTA />
        <Footer />
        <MobileCTA />
      </div>
    </HashRouter>
  );
}

