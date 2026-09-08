import React, { useRef, useEffect } from 'react';
import { ArrowLeft, Shield, FileText, AlertCircle, Mail, ExternalLink, Sparkles } from 'lucide-react';
import {
  LegalDocType,
  DISCLAIMER_CONTENT,
  TERMS_AND_CONDITIONS_CONTENT,
  PRIVACY_POLICY_CONTENT,
  CONTACT_INFO,
} from '../data/legalPolicies';

interface LegalPageProps {
  activeDoc: LegalDocType;
  onSelectDoc: (doc: LegalDocType) => void;
  onBack: () => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({
  activeDoc,
  onSelectDoc,
  onBack,
}) => {
  const tabsRef = useRef<HTMLDivElement>(null);

  // Smoothly center the active tab when clicked or selected
  useEffect(() => {
    const activeBtn = document.getElementById(`page-tab-${activeDoc}`);
    if (activeBtn && tabsRef.current) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeDoc]);

  // Subtle initial glide animation on mount to signal horizontal scrollability to the user
  useEffect(() => {
    if (tabsRef.current) {
      const timer = setTimeout(() => {
        if (tabsRef.current) {
          tabsRef.current.scrollBy({ left: 34, behavior: 'smooth' });
          setTimeout(() => {
            if (tabsRef.current) {
              tabsRef.current.scrollBy({ left: -34, behavior: 'smooth' });
            }
          }, 650);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const getDocContent = (type: LegalDocType): string => {
    switch (type) {
      case 'disclaimer':
        return DISCLAIMER_CONTENT;
      case 'terms':
        return TERMS_AND_CONDITIONS_CONTENT;
      case 'privacy':
        return PRIVACY_POLICY_CONTENT;
      case 'contact':
        return '';
    }
  };

  // Render markdown line-by-line while strictly preserving exact user text
  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: string[] = [];

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="my-3 space-y-1.5 list-disc list-inside text-stone-700 text-sm">
            {currentList.map((item, idx) => (
              <li key={idx} className="leading-relaxed pl-1">
                {renderInlineFormatting(item)}
              </li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('* ')) {
        currentList.push(trimmed.substring(2));
        return;
      }

      flushList();

      if (trimmed === '---') {
        elements.push(<hr key={index} className="my-6 border-stone-200" />);
      } else if (trimmed.startsWith('# ')) {
        elements.push(
          <h2 key={index} className="text-xl sm:text-2xl font-bold font-vedic text-stone-900 mt-6 mb-3 first:mt-0">
            {trimmed.substring(2)}
          </h2>
        );
      } else if (trimmed.startsWith('## ')) {
        elements.push(
          <h3 key={index} className="text-lg sm:text-xl font-bold font-vedic text-stone-900 mt-5 mb-2">
            {trimmed.substring(3)}
          </h3>
        );
      } else if (trimmed === '') {
        // Empty line
      } else {
        elements.push(
          <p key={index} className="text-sm text-stone-700 leading-relaxed mb-3">
            {renderInlineFormatting(line)}
          </p>
        );
      }
    });

    flushList();
    return elements;
  };

  // Helper for inline bold, links, emails
  const renderInlineFormatting = (text: string): React.ReactNode => {
    // Check for markdown link [text](url)
    const linkMatch = text.match(/\[(.*?)\]\((.*?)\)/);
    if (linkMatch) {
      const before = text.substring(0, linkMatch.index);
      const linkText = linkMatch[1];
      const linkUrl = linkMatch[2];
      const after = text.substring((linkMatch.index || 0) + linkMatch[0].length);
      return (
        <>
          {renderInlineFormatting(before)}
          <a
            href={linkUrl}
            target={linkUrl.startsWith('mailto:') ? '_self' : '_blank'}
            rel="noopener noreferrer"
            className="text-amber-700 hover:text-amber-900 font-semibold underline underline-offset-2"
          >
            {linkText}
          </a>
          {renderInlineFormatting(after)}
        </>
      );
    }

    // Check for plain URLs
    const urlMatch = text.match(/(https?:\/\/[^\s]+)/);
    if (urlMatch) {
      const before = text.substring(0, urlMatch.index);
      const url = urlMatch[1];
      const after = text.substring((urlMatch.index || 0) + urlMatch[0].length);
      return (
        <>
          {renderInlineFormatting(before)}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-700 hover:text-amber-900 font-semibold underline underline-offset-2 inline-flex items-center gap-0.5"
          >
            <span>{url}</span>
            <ExternalLink className="w-3 h-3 inline" />
          </a>
          {renderInlineFormatting(after)}
        </>
      );
    }

    // Check for **bold**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    if (parts.length > 1) {
      return (
        <>
          {parts.map((part, idx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={idx} className="font-semibold text-stone-900">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </>
      );
    }

    return text;
  };

  const rawContent = getDocContent(activeDoc);

  return (
    <div id="legal-policies-page" className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Top back banner */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-amber-900 hover:border-amber-300 shadow-2xs text-xs font-semibold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Vedic Astrology Tools</span>
        </button>
      </div>

      {/* Main Content Box */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 border border-amber-200">
              {activeDoc === 'privacy' && <Shield className="w-5 h-5" />}
              {activeDoc === 'terms' && <FileText className="w-5 h-5" />}
              {activeDoc === 'disclaimer' && <AlertCircle className="w-5 h-5" />}
              {activeDoc === 'contact' && <Mail className="w-5 h-5" />}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-vedic text-stone-900">
                {activeDoc === 'privacy' && 'Privacy Policy'}
                {activeDoc === 'terms' && 'Terms & Conditions'}
                {activeDoc === 'disclaimer' && 'Disclaimer'}
                {activeDoc === 'contact' && 'Contact Us'}
              </h1>
              <p className="text-xs text-stone-500">
                Astronava Official Policies &bull; Effective September 2026
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          id="legal-tabs-bar"
          ref={tabsRef}
          className="relative flex items-center border-b border-stone-200 bg-stone-100/60 px-4 pt-2 gap-2 overflow-x-auto no-scrollbar scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-38px),transparent)] sm:[mask-image:none]"
        >
          <button
            id="page-tab-privacy-policy"
            onClick={() => onSelectDoc('privacy')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeDoc === 'privacy'
                ? 'border-amber-600 text-amber-900 bg-white shadow-2xs font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>
          <button
            id="page-tab-terms-conditions"
            onClick={() => onSelectDoc('terms')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeDoc === 'terms'
                ? 'border-amber-600 text-amber-900 bg-white shadow-2xs font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms &amp; Conditions</span>
          </button>
          <button
            id="page-tab-disclaimer"
            onClick={() => onSelectDoc('disclaimer')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeDoc === 'disclaimer'
                ? 'border-amber-600 text-amber-900 bg-white shadow-2xs font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Disclaimer</span>
          </button>
          <button
            id="page-tab-contact"
            onClick={() => onSelectDoc('contact')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeDoc === 'contact'
                ? 'border-amber-600 text-amber-900 bg-white shadow-2xs font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Us</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 bg-white min-h-[400px]">
          {activeDoc === 'contact' ? (
            <div className="space-y-6 max-w-xl mx-auto py-2">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto border border-amber-200">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-vedic text-stone-900">
                  Contact Astronava
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Have questions regarding our Vedic astrology tools, calculation methodologies, or legal policies? Feel free to reach out directly.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Email Card */}
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-2">
                  <div className="flex items-center gap-2 text-amber-800">
                    <Mail className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Direct Email</span>
                  </div>
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="text-stone-900 font-semibold text-sm hover:text-amber-800 transition-colors block break-all"
                  >
                    {CONTACT_INFO.email}
                  </a>
                </div>

                {/* Website Card */}
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-2">
                  <div className="flex items-center gap-2 text-amber-800">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Official Website</span>
                  </div>
                  <a
                    href={CONTACT_INFO.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-900 font-semibold text-sm hover:text-amber-800 transition-colors inline-flex items-center gap-1"
                  >
                    <span>astronava.vercel.app</span>
                    <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                  </a>
                  <p className="text-[11px] text-stone-500">
                    Online Vedic Astro Platform
                  </p>
                </div>

              </div>

              {/* Developer & Community Card */}
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950">
                    Developer &amp; Creator
                  </h4>
                  <p className="text-sm font-semibold text-stone-800">
                    {CONTACT_INFO.developerName}
                  </p>
                </div>
                <a
                  href={CONTACT_INFO.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-amber-900 text-amber-100 hover:bg-amber-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Connect on X</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="text-center text-xs text-stone-400 pt-3 border-t border-stone-100">
                Effective Date: {CONTACT_INFO.effectiveDate} &bull; Astronava
              </div>
            </div>
          ) : (
            <div className="prose prose-stone max-w-none">
              {renderMarkdown(rawContent)}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <span>Astronava &bull; Vedic Astrology Platform</span>
          <button
            onClick={onBack}
            className="px-4 py-1.5 rounded-lg bg-stone-900 text-white hover:bg-stone-800 font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to App</span>
          </button>
        </div>

      </div>
    </div>
  );
};
