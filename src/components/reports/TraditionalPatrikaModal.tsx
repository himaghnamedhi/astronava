import React, { useState, useRef } from 'react';
import { CompleteKundliData } from '../../data/vedicEphemeris';
import { TraditionalPatrikaPage } from './TraditionalPatrikaPage';
import { PatrikaDivisionalChartsPage } from './PatrikaDivisionalChartsPage';
import { PatrikaPlanetMeaningsPage } from './PatrikaPlanetMeaningsPage';
import { PatrikaRemediesPage } from './PatrikaRemediesPage';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import {
  Download,
  Printer,
  X,
  FileText,
  Loader2,
  CheckSquare,
  Layers,
} from 'lucide-react';

interface TraditionalPatrikaModalProps {
  isOpen: boolean;
  onClose: () => void;
  kundliData: CompleteKundliData;
}

export const TraditionalPatrikaModal: React.FC<TraditionalPatrikaModalProps> = ({
  isOpen,
  onClose,
  kundliData,
}) => {
  // Astronava Official Branding - Fixed for authenticity
  const brandName = 'Astronava';
  const websiteAddress = 'www.astronava.vercel.app';
  const servicesLine =
    'Astrology | Numerology | Palmistry | Occult | Courses | Tarot Card | Gemsstone | Vastu';
  const contactLine = 'www.astronava.vercel.app';

  const [selectedPages, setSelectedPages] = useState<{
    page1: boolean;
    page2: boolean;
    page3: boolean;
    page4: boolean;
    page5: boolean;
  }>({
    page1: true,
    page2: true,
    page3: true,
    page4: true,
    page5: true,
  });

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<string>('');

  const printContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const totalSelectedCount = Object.values(selectedPages).filter(Boolean).length;

  const handleSelectPreset = (preset: 'all' | 'standard' | 'single') => {
    if (preset === 'all') {
      setSelectedPages({ page1: true, page2: true, page3: true, page4: true, page5: true });
    } else if (preset === 'standard') {
      setSelectedPages({ page1: true, page2: true, page3: false, page4: false, page5: false });
    } else {
      setSelectedPages({ page1: true, page2: false, page3: false, page4: false, page5: false });
    }
  };

  // Direct High-Resolution A4 PDF Generation
  const handleDownloadPdf = async () => {
    if (!printContainerRef.current) return;
    setIsGenerating(true);
    setGenerationProgress('Preparing high-resolution A4 layout (fit-to-page)...');

    try {
      const pageElements = printContainerRef.current.querySelectorAll<HTMLElement>('.pdf-report-page');
      if (pageElements.length === 0) {
        throw new Error('No printable pages selected');
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      for (let i = 0; i < pageElements.length; i++) {
        setGenerationProgress(`Rendering Page ${i + 1} of ${pageElements.length}...`);
        const el = pageElements[i];

        const canvas = await html2canvas(el, {
          scale: 2.5, // Crisp 240+ DPI equivalent
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: 794,
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        if (i > 0) {
          pdf.addPage('a4', 'portrait');
        }
        // Exact A4 dimensions: 210mm x 297mm (fits page with 0 gap)
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      }

      setGenerationProgress('Finalizing PDF file...');
      const cleanName = (kundliData.birthDetails.name || 'Native').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
      pdf.save(`Vedic_Kundali_${cleanName}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      // Fallback to browser print
      window.print();
    } finally {
      setIsGenerating(false);
      setGenerationProgress('');
    }
  };

  // Chromium / Gotenberg Native High-Definition Print
  const handleNativePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-stone-900 text-stone-100 rounded-2xl shadow-2xl border border-amber-800/40 w-full max-w-5xl my-auto overflow-hidden flex flex-col max-h-[95vh]">
        {/* MODAL HEADER */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-stone-950 via-amber-950 to-stone-950 border-b border-amber-800/40 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-amber-100 font-vedic">
                  Vedic Kundali PDF
                </h2>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {totalSelectedCount} Page{totalSelectedCount > 1 ? 's' : ''} Selected
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Generated for <strong className="text-amber-200">{kundliData.birthDetails.name || 'Native'}</strong> • Astronava
              </p>
            </div>
          </div>

          {/* Quick Page Presets Bar */}
          <div className="flex items-center gap-1.5 text-xs bg-stone-900 p-1 rounded-xl border border-stone-800">
            <button
              onClick={() => handleSelectPreset('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                totalSelectedCount === 5
                  ? 'bg-amber-700 text-white font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Full 5-Page Dossier
            </button>
            <button
              onClick={() => handleSelectPreset('standard')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                totalSelectedCount === 2 && selectedPages.page1 && selectedPages.page2
                  ? 'bg-amber-700 text-white font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              2-Page Classic
            </button>
            <button
              onClick={() => handleSelectPreset('single')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                totalSelectedCount === 1 && selectedPages.page1
                  ? 'bg-amber-700 text-white font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              1-Page Summary
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-stone-800 text-stone-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PAGE CHECKBOXES SELECTOR */}
        <div className="px-5 py-2.5 bg-stone-950/70 border-b border-stone-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] text-stone-400 font-medium whitespace-nowrap mr-1">
            Include in PDF:
          </span>
          {[
            { key: 'page1', label: '1. Janam Patrika (Lagna & Chalit)' },
            { key: 'page2', label: '2. Dasha Cycles & Yogas' },
            { key: 'page3', label: '3. Graha Spashta & All Charts' },
            { key: 'page4', label: '4. Planets in Houses (Meanings)' },
            { key: 'page5', label: '5. Vedic Remedies & Gemstones' },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-white cursor-pointer whitespace-nowrap text-xs"
            >
              <input
                type="checkbox"
                checked={selectedPages[item.key as keyof typeof selectedPages]}
                onChange={(e) =>
                  setSelectedPages((prev) => ({
                    ...prev,
                    [item.key]: e.target.checked,
                  }))
                }
                className="rounded accent-amber-600 cursor-pointer"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>

        {/* LIVE A4 DOCUMENT PREVIEW AREA */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-950 flex flex-col items-center">
          <div className="text-center mb-3">
            <span className="text-[11px] text-stone-400 font-medium">
              Live Scaled Preview (matches exact A4 print specifications • 210mm x 297mm • Astronava)
            </span>
          </div>

          {/* Scaled Preview Wrapper */}
          <div className="overflow-x-auto max-w-full pb-4 flex justify-center">
            <div
              ref={printContainerRef}
              className="origin-top scale-[0.68] sm:scale-[0.8] md:scale-[0.88] lg:scale-[0.95] transition-transform duration-200"
              style={{
                width: '794px',
                marginBottom: '-120px',
              }}
            >
              {/* PAGE 1: Traditional KP Patrika */}
              {selectedPages.page1 && (
                <div className="mb-6">
                  <TraditionalPatrikaPage
                    kundliData={kundliData}
                    brandName={brandName}
                    websiteAddress={websiteAddress}
                    servicesLine={servicesLine}
                    contactLine={contactLine}
                    pageNumber="1"
                  />
                </div>
              )}

              {/* PAGE 2: Full Parashari Planetary Analysis, Dasha Timeline & Yogas */}
              {selectedPages.page2 && (
                <div
                  className="pdf-report-page bg-[#FCFBF9] text-stone-900 mx-auto relative box-border overflow-hidden shadow-xl border border-stone-300 w-[794px] h-[1123px] max-h-[1123px] flex flex-col justify-between p-8 mb-6"
                  style={{ pageBreakAfter: 'always', pageBreakInside: 'avoid' }}
                >
                  {/* Analysis Page Header */}
                  <div className="text-center border-b-2 border-amber-900/40 pb-2">
                    <div className="flex justify-between text-[11px] font-serif text-amber-950 px-2 mb-0.5">
                      <span>॥ ॐ श्री गणेशाय नमः ॥</span>
                      <span className="font-bold uppercase tracking-widest text-[10.5px] font-vedic text-amber-900">
                        विंशोत्तरी महादशा एवं सर्वाष्टकवर्ग चक्र
                      </span>
                      <span>॥ शुभम् भवतु ॥</span>
                    </div>
                    <h2 className="text-xl font-black font-vedic text-amber-950 tracking-tight">
                      PLANETARY ANALYSIS &amp; VIMSHOTTARI TIMELINE
                    </h2>
                    <div className="flex items-center justify-center gap-3 text-[10px] text-stone-600 mt-0.5">
                      <span>Native: <strong className="text-amber-950">{kundliData?.birthDetails?.name || 'Native'}</strong></span>
                      <span>•</span>
                      <span>Lagna: <strong>{kundliData?.lagna?.signName || kundliData?.lagnaSignName || 'Aries'}</strong></span>
                      <span>•</span>
                      <span>Moon Sign: <strong>{kundliData?.moonSignName || kundliData?.grahas?.moon?.rashiName || 'Moon Sign'}</strong></span>
                    </div>
                  </div>

                  {/* Section 1: Vimshottari Timeline */}
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-amber-950 font-vedic uppercase tracking-wider">
                      Vimshottari Dasha 120-Year Life Cycle (Current: {kundliData.vimshottariDasha.currentMahadasha.lordName} Mahadasha)
                    </h3>
                    <div className="border border-stone-300 rounded-lg overflow-hidden bg-white text-[10px]">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-stone-100 text-stone-900 font-bold border-b border-stone-200 text-[9.5px]">
                          <tr>
                            <th className="p-1 border-r border-stone-200">Lord</th>
                            <th className="p-1 border-r border-stone-200">Start Date</th>
                            <th className="p-1 border-r border-stone-200">End Date</th>
                            <th className="p-1 border-r border-stone-200">Duration</th>
                            <th className="p-1">Current State</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200 text-[9.5px]">
                          {kundliData.vimshottariDasha.fullTimeline.map((d, idx) => (
                            <tr key={idx} className={d.isActive ? 'bg-amber-100/80 font-bold text-amber-950' : ''}>
                              <td className="p-1 font-semibold border-r border-stone-200">{d.lordName} ({d.sanskritName})</td>
                              <td className="p-1 font-mono border-r border-stone-200">{d.startDate}</td>
                              <td className="p-1 font-mono border-r border-stone-200">{d.endDate}</td>
                              <td className="p-1 border-r border-stone-200">{d.durationYears} Years</td>
                              <td className="p-1">{d.isActive ? 'ACTIVE NOW' : new Date(d.endDate) < new Date() ? 'Elapsed' : 'Upcoming'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Section 2: Sarvashtakavarga Matrix */}
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-amber-950 font-vedic uppercase tracking-wider">
                      Sarvashtakavarga Strength Distribution (337 Total Bindus)
                    </h3>
                    <div className="grid grid-cols-6 gap-1.5 text-center text-[10px]">
                      {kundliData.sarvashtakavarga.signs.map((s) => (
                        <div key={s.signNumber} className="p-1.5 bg-white border border-stone-300 rounded">
                          <span className="text-[9px] text-stone-600 block">{s.signName.split(' ')[0]}</span>
                          <strong className="text-sm font-black text-amber-950 block">{s.bindus}</strong>
                          <span className="text-[8px] text-stone-500 block">{s.status.split(' ')[0]}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 3: Classical Yogas & Doshas */}
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-amber-950 font-vedic uppercase tracking-wider">
                      Activated Parashari Yogas &amp; Diagnostic
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      {kundliData.yogas.slice(0, 4).map((y, idx) => (
                        <div key={idx} className="p-2 bg-white border border-amber-900/20 rounded-lg space-y-0.5">
                          <strong className="text-amber-950 font-bold block">{y.name}</strong>
                          <p className="text-stone-600 leading-snug line-clamp-2 text-[9.5px]">{y.description}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2 p-2 bg-amber-50/80 rounded-lg border border-amber-200 text-[10px] space-y-0.5">
                      <div><strong>Manglik Status:</strong> {kundliData.doshas.mangalDosha.details}</div>
                      <div><strong>Kaal Sarp:</strong> {kundliData.doshas.kaalSarpDosha.details}</div>
                      <div><strong>Sade Sati:</strong> {kundliData.doshas.sadeSati.details}</div>
                    </div>
                  </div>

                  {/* Analysis Page Footer */}
                  <div className="pt-2 border-t border-stone-300 text-center space-y-1">
                    <div className="text-[11px] font-bold text-stone-900 font-serif">{brandName}</div>
                    <div className="flex items-center justify-between text-[9px] text-stone-500">
                      <span>{contactLine}</span>
                      <span className="font-semibold text-amber-900 underline">{websiteAddress}</span>
                      <span className="font-bold text-[#c0262d] text-xs font-mono">Page 2</span>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 3: Graha Spashta & Divisional Charts */}
              {selectedPages.page3 && (
                <div className="mb-6">
                  <PatrikaDivisionalChartsPage
                    kundliData={kundliData}
                    brandName={brandName}
                    websiteAddress={websiteAddress}
                    servicesLine={servicesLine}
                    contactLine={contactLine}
                    pageNumber="3"
                  />
                </div>
              )}

              {/* PAGE 4: Planets in Houses & Meanings */}
              {selectedPages.page4 && (
                <div className="mb-6">
                  <PatrikaPlanetMeaningsPage
                    kundliData={kundliData}
                    brandName={brandName}
                    websiteAddress={websiteAddress}
                    servicesLine={servicesLine}
                    contactLine={contactLine}
                    pageNumber="4"
                  />
                </div>
              )}

              {/* PAGE 5: Certified Vedic Remedies & Gemstones */}
              {selectedPages.page5 && (
                <div className="mb-6">
                  <PatrikaRemediesPage
                    kundliData={kundliData}
                    brandName={brandName}
                    websiteAddress={websiteAddress}
                    servicesLine={servicesLine}
                    contactLine={contactLine}
                    pageNumber="5"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MODAL FOOTER & ACTION BUTTONS */}
        <div className="px-5 py-3.5 bg-stone-900 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Exact A4 Dimensions (210mm x 297mm) • Zero Margin • Astronava</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Chromium Native Print */}
            <button
              onClick={handleNativePrint}
              disabled={isGenerating || totalSelectedCount === 0}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              title="Print Vedic Kundali directly or save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print Vedic Kundali</span>
            </button>

            {/* Instant High-Res Download PDF */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating || totalSelectedCount === 0}
              className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{generationProgress || 'Exporting PDF...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-amber-200" />
                  <span>Download Vedic Kundali PDF ({totalSelectedCount} Pgs)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
