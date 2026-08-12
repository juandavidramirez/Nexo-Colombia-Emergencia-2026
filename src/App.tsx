import React, { useState, useMemo } from 'react';
import { CategoryType, ViewPage, EmergencyRecord } from './types';
import { dataService } from './services/dataService';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DashboardMetrics } from './components/DashboardMetrics';
import { CategoryTabs } from './components/CategoryTabs';
import { CategoryContent } from './components/CategoryContent';
import { DetailModal } from './components/DetailModal';
import { ShareModal } from './components/ShareModal';
import { ContactModal } from './components/ContactModal';
import { ReportFormModal } from './components/ReportFormModal';
import { QuienesSomosView } from './components/QuienesSomosView';

export default function App() {
  const [currentPage, setCurrentPage] = useState<ViewPage>('home');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('donar');
  const [selectedCity, setSelectedCity] = useState<string>('Todas');
  const [categorySubFilter, setCategorySubFilter] = useState<string>('Todas');
  const [verifiedFilter, setVerifiedFilter] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dataVersion, setDataVersion] = useState<number>(0);

  // Subscribe to live data updates from Supabase
  React.useEffect(() => {
    const unsubscribe = dataService.subscribe(() => {
      setDataVersion((v) => v + 1);
    });
    // Trigger fetch on mount to get latest Supabase records
    dataService.tryFetchSupabase();
    return unsubscribe;
  }, []);

  // Modals
  const [selectedRecord, setSelectedRecord] = useState<EmergencyRecord | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Filtered records (Inclusive multi-condition AND filtering)
  const currentRecords = useMemo(() => {
    return dataService.getRecords(activeCategory, selectedCity, searchQuery, categorySubFilter, verifiedFilter);
  }, [activeCategory, selectedCity, searchQuery, categorySubFilter, verifiedFilter, dataVersion]);

  // Metrics & Hubs
  const siteMetrics = useMemo(() => dataService.getSiteMetrics(), [dataVersion]);
  const emergencyBalance = useMemo(() => dataService.getEmergencyBalance(), [dataVersion]);
  const hubsList = useMemo(() => dataService.getHubs(), [dataVersion]);

  // Handlers
  const handleScrollToTabs = () => {
    const el = document.getElementById('tabsAnchor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (category: CategoryType) => {
    setActiveCategory(category);
    setCategorySubFilter('Todas');
    setVerifiedFilter('Todos');
  };

  const handleClearFilters = () => {
    setSelectedCity('Todas');
    setCategorySubFilter('Todas');
    setVerifiedFilter('Todos');
    setSearchQuery('');
  };

  const handleNavigateHomeWithCategory = (category: CategoryType) => {
    handleSelectCategory(category);
    setCurrentPage('home');
    setTimeout(() => {
      handleScrollToTabs();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F1] text-[#1E1B16] flex flex-col font-sans antialiased selection:bg-[#FFB81C]/30 overflow-x-clip w-full">
      {/* Navigation Header */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenContactModal={() => setIsContactModalOpen(true)}
        onOpenShareModal={() => setIsReportModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Page Routing */}
      {currentPage === 'home' ? (
        <div className="flex-1">
          {/* Main Headline Hero */}
          <Hero
            onScrollToTabs={handleScrollToTabs}
            onOpenShareModal={() => setIsReportModalOpen(true)}
          />

          {/* Level 2 Dashboard: Balance oficial de la emergencia & Movilización activa en Nexo */}
          <DashboardMetrics
            siteMetrics={siteMetrics}
            balance={emergencyBalance}
            onSelectCategory={handleNavigateHomeWithCategory}
          />

          {/* Sticky Architectural Filters: Category Tabs + Search Bar & Dual Dropdown Selectors */}
          <CategoryTabs
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            categorySubFilter={categorySubFilter}
            onSelectCategorySubFilter={setCategorySubFilter}
            verifiedFilter={verifiedFilter}
            onSelectVerifiedFilter={setVerifiedFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearFilters={handleClearFilters}
            resultsCount={currentRecords.length}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />

          {/* Active Category Content List / Cards */}
          <section className="py-6 px-4 sm:px-6 max-w-7xl mx-auto min-h-[400px]">
            <CategoryContent
              category={activeCategory}
              records={currentRecords}
              onOpenDetail={(record) => setSelectedRecord(record)}
              onClearFilters={handleClearFilters}
            />
          </section>

          {/* Footer Banner */}
          <footer className="mt-16 bg-white border-t border-[#E9E1D2] py-12 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF1FB] text-[#1D5DBF] font-extrabold text-xs mb-3">
                <span>Nexo Colombia</span>
              </div>
              <h3 className="text-xl font-black text-[#0B2A4A] mb-2">
                ¿Tienes información para compartir o quieres colaborar?
              </h3>
              <p className="text-xs sm:text-sm text-[#7A7264] max-w-xl mx-auto mb-6">
                Todos los aportes pasan por una cola de verificación. Ninguna información se publica sin un curador responsable con nombre y hub asignado.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#C1443B] text-white font-extrabold text-xs sm:text-sm hover:bg-[#A83830] transition-colors shadow-xs cursor-pointer"
                >
                  Comparte información
                </button>
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#FAF7F1] border border-[#E9E1D2] text-[#0B2A4A] font-bold text-xs sm:text-sm hover:bg-[#EAF1FB] transition-colors"
                >
                  Contacto con el equipo
                </button>
              </div>
              <div className="mt-8 pt-6 border-t border-[#E9E1D2]/60 text-xs text-[#7A7264] flex flex-col items-center justify-center gap-1 text-center">
                <div>
                  Iniciativa impulsada por <strong className="text-[#0B2A4A]">Global Shapers Colombia y Venezuela</strong>
                </div>
                <div className="text-[11px] text-[#7A7264]">
                  Nexo fue creado por <strong className="text-[#0B2A4A]">Juan David Ramírez</strong>
                </div>
              </div>
            </div>
          </footer>
        </div>
      ) : (
        <QuienesSomosView
          hubs={hubsList}
          onNavigateHomeWithCategory={handleNavigateHomeWithCategory}
          onNavigateHome={() => {
            setCurrentPage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Detail Modal */}
      <DetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />

      {/* Share Info Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      {/* Report / Interactive Form Modal */}
      <ReportFormModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        initialCategory={activeCategory}
        onRecordCreated={() => setDataVersion((v) => v + 1)}
      />
    </div>
  );
}
