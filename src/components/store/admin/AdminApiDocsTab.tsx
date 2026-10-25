import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Code2,
  Terminal,
  Smartphone,
  Copy,
  Check,
  Play,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Layers,
  FileJson,
  Cpu,
  BookOpen,
  Send,
  Zap,
  Globe,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  Search,
  Filter,
  Download,
  Shield,
  Lock,
  Server,
  ChevronDown,
  ChevronUp,
  Tag
} from 'lucide-react';
import { InternalEndpointDoc } from '../../../server/apiDocumentationGenerator.ts';

interface AdminApiDocsTabProps {
  token: string | null;
  userEmail: string;
}

export const AdminApiDocsTab: React.FC<AdminApiDocsTabProps> = ({ token, userEmail }) => {
  // Remote documentation data
  const [endpoints, setEndpoints] = useState<InternalEndpointDoc[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState<boolean>(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [selectedEndpointId, setSelectedEndpointId] = useState<string | null>(null);

  // Copy state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sandbox testing state
  const [sandboxPayload, setSandboxPayload] = useState<string>('');
  const [sandboxResponse, setSandboxResponse] = useState<string | null>(null);
  const [sandboxLoading, setSandboxLoading] = useState<boolean>(false);
  const [sandboxStatus, setSandboxStatus] = useState<number | null>(null);
  const [sandboxLatency, setSandboxLatency] = useState<number | null>(null);
  const [sandboxError, setSandboxError] = useState<string | null>(null);
  const [codeLanguage, setCodeLanguage] = useState<'curl' | 'js' | 'kotlin' | 'python'>('curl');

  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.astronava.com';

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Programmatically fetch documentation from backend
  const fetchDocumentation = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    setUnauthorized(false);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || 'admin_dev_token'}`,
        'x-admin-email': userEmail || 'himaghnamedhi1@gmail.com',
      };

      const res = await fetch('/api/admin/api/docs', { headers });

      if (res.status === 401 || res.status === 403) {
        setUnauthorized(true);
        setFetchError('Access to internal API documentation is restricted to authorized administrators only.');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      if (data.success && Array.isArray(data.endpoints)) {
        setEndpoints(data.endpoints);
        setCategories(data.categories || []);
        setLastRefreshedAt(data.timestamp || new Date().toISOString());

        // Default to first endpoint if none selected
        if (!selectedEndpointId && data.endpoints.length > 0) {
          const first = data.endpoints[0];
          setSelectedEndpointId(first.id);
          setSandboxPayload(
            first.requestBody?.example
              ? JSON.stringify(first.requestBody.example, null, 2)
              : ''
          );
        }
      } else {
        throw new Error(data.error || 'Invalid API documentation payload received');
      }
    } catch (err: any) {
      console.error('Error fetching programmatic API documentation:', err);
      setFetchError(err.message || 'Failed to programmatically load API documentation');
    } finally {
      setLoading(false);
    }
  }, [token, userEmail, selectedEndpointId]);

  useEffect(() => {
    fetchDocumentation();
  }, [fetchDocumentation]);

  // Filtered endpoints
  const filteredEndpoints = useMemo(() => {
    return endpoints.filter((ep) => {
      const matchesSearch =
        !searchQuery ||
        ep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ep.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ep.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ep.parameters && ep.parameters.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCat = selectedCategory === 'all' || ep.category === selectedCategory;
      const matchesMethod = selectedMethod === 'all' || ep.method.toUpperCase() === selectedMethod.toUpperCase();

      return matchesSearch && matchesCat && matchesMethod;
    });
  }, [endpoints, searchQuery, selectedCategory, selectedMethod]);

  // Active selected endpoint
  const activeEndpoint = useMemo(() => {
    return endpoints.find((e) => e.id === selectedEndpointId) || endpoints[0] || null;
  }, [endpoints, selectedEndpointId]);

  // When changing active endpoint, initialize sandbox payload
  const handleSelectEndpoint = (ep: InternalEndpointDoc) => {
    setSelectedEndpointId(ep.id);
    setSandboxPayload(
      ep.requestBody?.example ? JSON.stringify(ep.requestBody.example, null, 2) : ''
    );
    setSandboxResponse(null);
    setSandboxStatus(null);
    setSandboxLatency(null);
    setSandboxError(null);
  };

  // Live Sandbox Execution
  const handleExecuteSandbox = async () => {
    if (!activeEndpoint) return;

    setSandboxLoading(true);
    setSandboxResponse(null);
    setSandboxStatus(null);
    setSandboxLatency(null);
    setSandboxError(null);

    const startTime = performance.now();

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add appropriate auth header based on endpoint requirements
      if (activeEndpoint.authType.includes('API Key')) {
        headers['X-Astronava-Api-Key'] = 'ast_live_admin_sandbox_key';
      } else if (activeEndpoint.authType.includes('Admin Token')) {
        headers['Authorization'] = `Bearer ${token || 'admin_dev_token'}`;
        headers['x-admin-email'] = userEmail || 'himaghnamedhi1@gmail.com';
      }

      let url = `${originUrl}${activeEndpoint.path}`;
      let body: string | undefined = undefined;

      if (activeEndpoint.method !== 'GET' && activeEndpoint.method !== 'DELETE') {
        if (sandboxPayload.trim()) {
          try {
            // Verify valid JSON
            JSON.parse(sandboxPayload);
            body = sandboxPayload;
          } catch (jsonErr: any) {
            setSandboxError(`Malformed JSON payload: ${jsonErr.message}`);
            setSandboxLoading(false);
            return;
          }
        }
      }

      const res = await fetch(url, {
        method: activeEndpoint.method,
        headers,
        body,
      });

      const elapsed = Math.round(performance.now() - startTime);
      setSandboxLatency(elapsed);
      setSandboxStatus(res.status);

      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const json = await res.json();
        setSandboxResponse(JSON.stringify(json, null, 2));
      } else {
        const text = await res.text();
        setSandboxResponse(text);
      }
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - startTime);
      setSandboxLatency(elapsed);
      setSandboxError(err.message || 'Network request failed or CORS rejected');
    } finally {
      setSandboxLoading(false);
    }
  };

  // Export OpenAPI specification
  const handleDownloadOpenApi = () => {
    const url = `/api/admin/api/docs?format=openapi`;
    window.open(url, '_blank');
  };

  // If unauthorized
  if (unauthorized) {
    return (
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-rose-200 shadow-md text-center space-y-4 max-w-xl mx-auto my-8">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold font-vedic text-stone-900">
          API Documentation Restricted
        </h3>
        <p className="text-xs text-stone-600 leading-relaxed">
          Access to internal API specifications and execution telemetry is only granted to authenticated administrators (<span className="font-mono font-semibold text-stone-800">himaghnamedhi1@gmail.com</span>).
        </p>
        <button
          onClick={fetchDocumentation}
          className="mt-4 px-5 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Authentication</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Banner with Live Stats & Actions */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                Live Internal Registry
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold">
                {endpoints.length} Endpoints Discovered
              </span>
              <span className="text-[11px] text-stone-400 font-mono hidden sm:inline">
                Base URL: {originUrl}/api
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-vedic text-stone-900 tracking-wide flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-amber-600" />
              <span>Programmatic Internal API Documentation</span>
            </h2>
            <p className="text-xs text-stone-500 max-w-3xl leading-relaxed">
              Programmatically aggregated and documented REST endpoints powering the Astronava Vedic Engine, Store Commerce, Admin Control, and Native Mobile synchronization.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={fetchDocumentation}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              title="Sync and re-generate API documentation from backend"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-stone-500 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Introspecting...' : 'Sync Specs'}</span>
            </button>

            <button
              onClick={handleDownloadOpenApi}
              className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              title="Download OpenAPI 3.0 (Swagger) Specification"
            >
              <Download className="w-3.5 h-3.5" />
              <span>OpenAPI 3.0 (.json)</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-stone-100 text-xs">
          <span className="text-[11px] font-semibold text-stone-400 mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Categories:
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-amber-900 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All ({endpoints.length})
          </button>
          {categories.map((cat) => {
            const count = endpoints.filter((e) => e.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-900 text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Search & Method Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search endpoint name, path (/kundli/calculate), or parameters..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl">
          {['all', 'GET', 'POST', 'PATCH', 'DELETE'].map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMethod(m)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition-all cursor-pointer ${
                selectedMethod === m
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Split View: Left Endpoint List & Right Detail / Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Endpoints Directory */}
        <div className="lg:col-span-5 space-y-2 max-h-[820px] overflow-y-auto pr-1">
          {loading && endpoints.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 space-y-3">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-800 mx-auto" />
              <p className="text-xs text-stone-500">Introspecting internal application endpoints...</p>
            </div>
          ) : filteredEndpoints.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-xs">
              No endpoints match the selected filters.
            </div>
          ) : (
            filteredEndpoints.map((ep) => {
              const isSelected = activeEndpoint?.id === ep.id;
              const methodBg =
                ep.method === 'GET'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : ep.method === 'POST'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : ep.method === 'PATCH'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200';

              return (
                <div
                  key={ep.id}
                  onClick={() => handleSelectEndpoint(ep)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left space-y-1.5 ${
                    isSelected
                      ? 'bg-amber-50/70 border-amber-500/80 shadow-xs ring-1 ring-amber-500/40'
                      : 'bg-white border-stone-200/90 hover:border-amber-300 hover:bg-stone-50/70 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${methodBg}`}
                      >
                        {ep.method}
                      </span>
                      <span className="font-mono text-xs font-semibold text-stone-800 truncate">
                        {ep.path}
                      </span>
                    </div>
                    {ep.authRequired && (
                      <span
                        className="p-1 rounded-md bg-stone-100 text-stone-500 shrink-0"
                        title={ep.authType}
                      >
                        <Lock className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-medium text-stone-900 line-clamp-1">{ep.name}</p>

                  <div className="flex items-center justify-between text-[11px] text-stone-400 pt-0.5">
                    <span className="truncate">{ep.category}</span>
                    <span className="font-mono text-[10px]">{ep.rateLimit}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Comprehensive Detail & Interactive Sandbox */}
        <div className="lg:col-span-7">
          {activeEndpoint ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-6">
              {/* Endpoint Header */}
              <div className="space-y-2 pb-4 border-b border-stone-100">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-extrabold uppercase border ${
                        activeEndpoint.method === 'GET'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : activeEndpoint.method === 'POST'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : activeEndpoint.method === 'PATCH'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {activeEndpoint.method}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-bold">
                      {activeEndpoint.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold">
                      {activeEndpoint.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-stone-500">
                    <Shield className="w-3.5 h-3.5 text-stone-400" />
                    <span>{activeEndpoint.authType}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <h3 className="text-lg font-bold font-vedic text-stone-900">
                    {activeEndpoint.name}
                  </h3>
                  <button
                    onClick={() => handleCopy(`${originUrl}${activeEndpoint.path}`, 'url')}
                    className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer text-xs flex items-center gap-1 shrink-0"
                    title="Copy full endpoint URL"
                  >
                    {copiedKey === 'url' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-stone-500" />
                    )}
                    <span className="font-mono text-[11px] hidden sm:inline">Copy Path</span>
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 font-mono text-xs text-stone-800 break-all select-all flex items-center justify-between">
                  <span>{activeEndpoint.path}</span>
                  <span className="text-[10px] text-stone-400 font-sans">{activeEndpoint.rateLimit}</span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed pt-1">
                  {activeEndpoint.description}
                </p>
              </div>

              {/* Parameters Table (if any) */}
              {activeEndpoint.parameters && activeEndpoint.parameters.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-vedic flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-600" />
                    <span>Request Parameters</span>
                  </h4>
                  <div className="overflow-x-auto rounded-xl border border-stone-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 text-[11px] font-bold">
                        <tr>
                          <th className="py-2 px-3">Field</th>
                          <th className="py-2 px-3">Type</th>
                          <th className="py-2 px-3">Location</th>
                          <th className="py-2 px-3">Required</th>
                          <th className="py-2 px-3">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                        {activeEndpoint.parameters.map((p) => (
                          <tr key={p.name} className="hover:bg-stone-50/60">
                            <td className="py-2 px-3 font-semibold text-stone-900">{p.name}</td>
                            <td className="py-2 px-3 text-stone-600 font-sans">{p.type}</td>
                            <td className="py-2 px-3 text-stone-500 font-sans">{p.in}</td>
                            <td className="py-2 px-3 font-sans">
                              {p.required ? (
                                <span className="text-rose-600 font-bold">Yes</span>
                              ) : (
                                <span className="text-stone-400">Optional</span>
                              )}
                            </td>
                            <td className="py-2 px-3 font-sans text-stone-600">{p.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Interactive Live Sandbox / Tester */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-amber-900/15 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-bold text-stone-900 font-vedic uppercase tracking-wider">
                      Live Endpoint Tester (Sandbox)
                    </span>
                  </div>
                  <button
                    onClick={handleExecuteSandbox}
                    disabled={sandboxLoading}
                    className="px-4 py-1.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 text-xs font-bold shadow-2xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className={`w-3.5 h-3.5 ${sandboxLoading ? 'animate-pulse' : ''}`} />
                    <span>{sandboxLoading ? 'Executing...' : 'Send Request'}</span>
                  </button>
                </div>

                {/* Request Payload Editor */}
                {activeEndpoint.method !== 'GET' && activeEndpoint.method !== 'DELETE' && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                      <span>JSON Request Body:</span>
                      <button
                        onClick={() =>
                          setSandboxPayload(
                            activeEndpoint.requestBody?.example
                              ? JSON.stringify(activeEndpoint.requestBody.example, null, 2)
                              : ''
                          )
                        }
                        className="text-amber-800 hover:underline cursor-pointer"
                      >
                        Reset Default Payload
                      </button>
                    </div>
                    <textarea
                      rows={5}
                      value={sandboxPayload}
                      onChange={(e) => setSandboxPayload(e.target.value)}
                      placeholder='{ "dob": "1995-11-23", "latitude": 28.6139 }'
                      className="w-full p-3 rounded-xl border border-stone-300 bg-white font-mono text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    />
                  </div>
                )}

                {/* Sandbox Response Output */}
                {sandboxError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{sandboxError}</span>
                  </div>
                )}

                {sandboxResponse && (
                  <div className="space-y-1.5 pt-2 border-t border-amber-900/10">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-700">Response:</span>
                        <span
                          className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                            sandboxStatus && sandboxStatus < 300
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          HTTP {sandboxStatus}
                        </span>
                        {sandboxLatency !== null && (
                          <span className="text-stone-400 font-mono text-[10px]">
                            {sandboxLatency} ms
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleCopy(sandboxResponse, 'sandbox-res')}
                        className="text-stone-500 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'sandbox-res' ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>Copy Response</span>
                      </button>
                    </div>
                    <pre className="p-3 rounded-xl bg-stone-900 text-amber-200 font-mono text-xs max-h-56 overflow-y-auto overflow-x-auto whitespace-pre leading-relaxed">
                      {sandboxResponse}
                    </pre>
                  </div>
                )}
              </div>

              {/* Ready-to-use Code Generator */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-vedic flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-amber-600" />
                    <span>Client Code Snippets</span>
                  </h4>
                  <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg text-xs">
                    {(['curl', 'js', 'kotlin', 'python'] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setCodeLanguage(lang)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase transition-all cursor-pointer ${
                          codeLanguage === lang
                            ? 'bg-white text-stone-900 shadow-2xs'
                            : 'text-stone-500 hover:text-stone-900'
                        }`}
                      >
                        {lang === 'js' ? 'Fetch JS' : lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative rounded-2xl bg-stone-900 text-stone-100 p-4 border border-stone-800">
                  <button
                    onClick={() => {
                      const snippet =
                        codeLanguage === 'curl'
                          ? activeEndpoint.curlSnippet
                          : codeLanguage === 'js'
                          ? activeEndpoint.jsSnippet
                          : codeLanguage === 'kotlin'
                          ? activeEndpoint.kotlinSnippet
                          : activeEndpoint.pythonSnippet;
                      handleCopy(snippet, 'code-snippet');
                    }}
                    className="absolute right-3 top-3 p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer text-xs flex items-center gap-1"
                    title="Copy code snippet"
                  >
                    {copiedKey === 'code-snippet' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span className="text-[10px] font-mono">Copy</span>
                  </button>
                  <pre className="font-mono text-xs text-amber-100/90 overflow-x-auto whitespace-pre leading-relaxed pr-16">
                    {codeLanguage === 'curl'
                      ? activeEndpoint.curlSnippet
                      : codeLanguage === 'js'
                      ? activeEndpoint.jsSnippet
                      : codeLanguage === 'kotlin'
                      ? activeEndpoint.kotlinSnippet
                      : activeEndpoint.pythonSnippet}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 text-stone-500 text-xs">
              Select an endpoint to inspect documentation and execute sandbox tests.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
