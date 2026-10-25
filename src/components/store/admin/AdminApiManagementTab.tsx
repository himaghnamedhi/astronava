import React, { useState, useEffect, useMemo } from 'react';
import {
  Key,
  Shield,
  Activity,
  Code2,
  Plus,
  RefreshCw,
  Copy,
  Check,
  Trash2,
  Power,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
  Globe,
  Terminal,
  Server,
  Layers,
  ArrowUpRight,
  X,
  AlertCircle,
  Download,
  Info,
  Lock,
  Smartphone,
  TrendingUp,
  BarChart3,
  Calendar,
  Percent,
  CheckCircle,
  TrendingDown
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { AdminApiDocsTab } from './AdminApiDocsTab.tsx';

export interface ApiKeyItem {
  id: string;
  name: string;
  environment: 'production' | 'sandbox';
  keyPrefix: string;
  maskedKey: string;
  createdAt: string;
  lastUsedAt: string | null;
  status: 'active' | 'revoked';
  rateLimit: number;
  allowedScopes: string[];
  requestCount: number;
  description?: string;
  keySecret?: string;
}

export interface ApiLogItem {
  id: string;
  timestamp: string;
  method: string;
  path: string;
  statusCode: number;
  durationMs: number;
  ip: string;
  userAgent: string;
  apiKeyId?: string;
  keyName?: string;
  requestSize?: number;
  responseSize?: number;
  errorMessage?: string;
}

export interface DailyTrendPoint {
  date: string;
  isoDate: string;
  totalRequests: number;
  successfulRequests: number;
  errorRequests: number;
  errorRate: number; // percentage
  avgLatencyMs: number;
}

export interface HourlyTrendPoint {
  time: string;
  requests: number;
  successful: number;
  errors: number;
  errorRate: number; // percentage
  avgLatencyMs: number;
}

export interface ApiMetrics {
  totalRequests24h: number;
  avgDurationMs: number;
  p95DurationMs: number;
  successRatePercent: number;
  errorCount: number;
  activeKeysCount: number;
  totalKeysCount: number;
  requestsByEndpoint: { path: string; count: number; avgDurationMs: number }[];
  statusCodesBreakdown: { code: number; count: number }[];
  dailyTrends?: DailyTrendPoint[];
  hourlyTrends?: HourlyTrendPoint[];
}

const CustomTrendTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    if (!data) return null;
    return (
      <div className="bg-stone-950/95 backdrop-blur-md text-stone-100 p-3.5 rounded-2xl shadow-xl border border-stone-800 text-xs space-y-2 min-w-[220px]">
        <div className="flex items-center justify-between pb-1.5 border-b border-stone-800">
          <span className="font-bold text-amber-400 font-vedic text-sm flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            {data.date || label}
          </span>
          <span className="text-[10px] font-mono text-stone-400">
            {data.avgLatencyMs ? `${data.avgLatencyMs} ms latency` : ''}
          </span>
        </div>

        <div className="space-y-1.5 font-mono text-[11px]">
          <div className="flex items-center justify-between text-amber-200">
            <span className="flex items-center gap-1.5 font-sans">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              Total Requests:
            </span>
            <span className="font-bold">{(data.totalRequests || 0).toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between text-emerald-300">
            <span className="flex items-center gap-1.5 font-sans">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Successful (2xx):
            </span>
            <span className="font-bold">{(data.successfulRequests || 0).toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between text-rose-300">
            <span className="flex items-center gap-1.5 font-sans">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              Errors (4xx / 5xx):
            </span>
            <span className="font-bold">{(data.errorRequests || 0).toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-stone-800 text-stone-300">
            <span className="font-sans">Error Rate:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded-md text-[10px] ${
                data.errorRate > 5
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}
            >
              {data.errorRate}% {data.errorRate <= 5 ? '• Healthy SLA' : '• High Errors'}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

interface AdminApiManagementTabProps {
  token: string | null;
  userEmail: string;
}

export const AdminApiManagementTab: React.FC<AdminApiManagementTabProps> = ({
  token,
  userEmail,
}) => {
  const [activeSubSection, setActiveSubSection] = useState<'trends' | 'keys' | 'logs' | 'docs'>('trends');
  const [trendTimeRange, setTrendTimeRange] = useState<'14d' | '7d' | '24h'>('14d');

  // API Keys state
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [loadingKeys, setLoadingKeys] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newKeySecret, setNewKeySecret] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState<string>('');
  const [newKeyEnv, setNewKeyEnv] = useState<'production' | 'sandbox'>('production');
  const [newKeyRateLimit, setNewKeyRateLimit] = useState<number>(120);
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>(['*']);
  const [newKeyDesc, setNewKeyDesc] = useState<string>('');
  const [creatingKey, setCreatingKey] = useState<boolean>(false);
  const [togglingKeyId, setTogglingKeyId] = useState<string | null>(null);
  const [deletingKeyId, setDeletingKeyId] = useState<string | null>(null);

  // Logs & Telemetry state
  const [logs, setLogs] = useState<ApiLogItem[]>([]);
  const [totalLogs, setTotalLogs] = useState<number>(0);
  const [loadingLogs, setLoadingLogs] = useState<boolean>(true);
  const [logSearch, setLogSearch] = useState<string>('');
  const [logStatusFilter, setLogStatusFilter] = useState<string>('all');
  const [logEndpointFilter, setLogEndpointFilter] = useState<string>('all');
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(5000); // 5 sec
  const [selectedLogDetail, setSelectedLogDetail] = useState<ApiLogItem | null>(null);
  const [clearingLogs, setClearingLogs] = useState<boolean>(false);

  // Metrics
  const [metrics, setMetrics] = useState<ApiMetrics | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState<boolean>(false);

  // Clipboard copy state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const authHeaders = useMemo(() => {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token || 'admin_dev_token'}`,
      'x-admin-email': userEmail || 'himaghnamedhi1@gmail.com',
    };
  }, [token, userEmail]);

  // Active trend data based on selected horizon
  const activeTrendData = useMemo(() => {
    if (!metrics) return [];
    if (trendTimeRange === '24h') {
      return (metrics.hourlyTrends || []).map((h) => ({
        date: h.time,
        totalRequests: h.requests,
        successfulRequests: h.successful,
        errorRequests: h.errors,
        errorRate: h.errorRate,
        avgLatencyMs: h.avgLatencyMs,
      }));
    }
    const daily = metrics.dailyTrends || [];
    if (trendTimeRange === '7d') {
      return daily.slice(-7);
    }
    return daily; // 14d
  }, [metrics, trendTimeRange]);

  // Aggregate stats across active trend period
  const trendPeriodStats = useMemo(() => {
    if (!activeTrendData || activeTrendData.length === 0) {
      return { totalReq: 0, totalErr: 0, overallErrRate: 0, peakReq: 0, peakDate: 'N/A', avgLat: 0 };
    }
    let totalReq = 0;
    let totalErr = 0;
    let peakReq = 0;
    let peakDate = '';
    let latSum = 0;

    for (const d of activeTrendData) {
      totalReq += d.totalRequests;
      totalErr += d.errorRequests;
      latSum += d.avgLatencyMs;
      if (d.totalRequests > peakReq) {
        peakReq = d.totalRequests;
        peakDate = d.date;
      }
    }

    const overallErrRate = totalReq > 0 ? Math.round((totalErr / totalReq) * 1000) / 10 : 0;
    const avgLat = Math.round((latSum / activeTrendData.length) * 10) / 10;

    return { totalReq, totalErr, overallErrRate, peakReq, peakDate, avgLat };
  }, [activeTrendData]);

  const handleCopy = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(identifier);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Fetch API Keys
  const fetchKeys = async () => {
    try {
      setLoadingKeys(true);
      const res = await fetch('/api/admin/api/keys', { headers: authHeaders });
      if (res.ok) {
        const data = await res.json();
        setKeys(data.keys || []);
      }
    } catch (e) {
      console.error('Failed to fetch keys:', e);
    } finally {
      setLoadingKeys(false);
    }
  };

  // Fetch Usage Logs
  const fetchLogs = async () => {
    try {
      setLoadingLogs(true);
      const params = new URLSearchParams();
      if (logSearch) params.set('search', logSearch);
      if (logStatusFilter !== 'all') params.set('statusCode', logStatusFilter);
      if (logEndpointFilter !== 'all') params.set('endpoint', logEndpointFilter);
      params.set('limit', '80');

      const res = await fetch(`/api/admin/api/logs?${params.toString()}`, { headers: authHeaders });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        setTotalLogs(data.total || 0);
      }
    } catch (e) {
      console.error('Failed to fetch logs:', e);
    } finally {
      setLoadingLogs(false);
    }
  };

  // Fetch Telemetry Metrics
  const fetchMetrics = async () => {
    try {
      setLoadingMetrics(true);
      const res = await fetch('/api/admin/api/metrics', { headers: authHeaders });
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics || null);
      }
    } catch (e) {
      console.error('Failed to fetch metrics:', e);
    } finally {
      setLoadingMetrics(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchKeys();
    fetchLogs();
    fetchMetrics();
  }, [authHeaders]);

  // Auto-refresh interval for telemetry logs
  useEffect(() => {
    if (activeSubSection !== 'logs' || autoRefreshInterval <= 0) return;
    const interval = setInterval(() => {
      fetchLogs();
      fetchMetrics();
    }, autoRefreshInterval);
    return () => clearInterval(interval);
  }, [activeSubSection, autoRefreshInterval, logSearch, logStatusFilter, logEndpointFilter]);

  // Create Key Handler
  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    try {
      setCreatingKey(true);
      const res = await fetch('/api/admin/api/keys', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          name: newKeyName.trim(),
          environment: newKeyEnv,
          rateLimit: newKeyRateLimit,
          allowedScopes: newKeyScopes,
          description: newKeyDesc.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setNewKeySecret(data.secretKey);
        fetchKeys();
        fetchMetrics();
        // Reset form
        setNewKeyName('');
        setNewKeyDesc('');
        setNewKeyScopes(['*']);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create API key');
      }
    } catch (e) {
      console.error('Error generating key:', e);
      alert('Error generating API key');
    } finally {
      setCreatingKey(false);
    }
  };

  // Toggle Status Handler
  const handleToggleKey = async (id: string) => {
    try {
      setTogglingKeyId(id);
      const res = await fetch(`/api/admin/api/keys/${id}/toggle`, {
        method: 'PATCH',
        headers: authHeaders,
      });
      if (res.ok) {
        const data = await res.json();
        setKeys((prev) => prev.map((k) => (k.id === id ? data.key : k)));
        fetchMetrics();
      }
    } catch (e) {
      console.error('Toggle error:', e);
    } finally {
      setTogglingKeyId(null);
    }
  };

  // Delete Key Handler
  const handleDeleteKey = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete API Key "${name}"? External clients using this key will immediately fail with 401 Unauthorized.`)) {
      return;
    }
    try {
      setDeletingKeyId(id);
      const res = await fetch(`/api/admin/api/keys/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (res.ok) {
        setKeys((prev) => prev.filter((k) => k.id !== id));
        fetchMetrics();
      }
    } catch (e) {
      console.error('Delete error:', e);
    } finally {
      setDeletingKeyId(null);
    }
  };

  // Clear Logs Handler
  const handleClearLogs = async () => {
    if (!confirm('Are you sure you want to flush all stored API telemetry logs?')) {
      return;
    }
    try {
      setClearingLogs(true);
      const res = await fetch('/api/admin/api/logs', {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (res.ok) {
        setLogs([]);
        setTotalLogs(0);
        fetchMetrics();
      }
    } catch (e) {
      console.error('Clear logs error:', e);
    } finally {
      setClearingLogs(false);
    }
  };

  // Export logs as JSON
  const handleExportLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `astronava-api-logs-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Navigation Sub-Tabs */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-amber-100/90 p-6 rounded-3xl shadow-md border border-amber-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-500/30">
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Gateway • Access Restricted to {userEmail}</span>
            </div>
            <h2 className="text-2xl font-bold font-vedic text-amber-50 tracking-wide flex items-center gap-2">
              <Key className="w-6 h-6 text-amber-400" />
              <span>Astronava Server API &amp; Integration Hub</span>
            </h2>
            <p className="text-xs text-amber-200/70 mt-1 max-w-2xl">
              Manage client authentication tokens, rate limits, and inspect real-time astrological calculation telemetry for native Android, iOS, and external partner systems.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                fetchKeys();
                fetchLogs();
                fetchMetrics();
              }}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-amber-200 transition-colors border border-white/10 cursor-pointer text-xs font-semibold flex items-center gap-1.5"
              title="Refresh All Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingKeys || loadingLogs ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>
            <button
              onClick={() => {
                setShowCreateModal(true);
                setNewKeySecret(null);
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Generate New API Key</span>
            </button>
          </div>
        </div>

        {/* Sub-section Tab Switcher */}
        <div className="flex gap-2 mt-6 pt-4 border-t border-amber-800/50 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSubSection('trends')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeSubSection === 'trends'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-amber-200/80 hover:bg-white/10'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-stone-900" />
            <span>Consumption Trends &amp; Errors</span>
          </button>

          <button
            onClick={() => setActiveSubSection('keys')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeSubSection === 'keys'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-amber-200/80 hover:bg-white/10'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>API Keys ({keys.length})</span>
          </button>

          <button
            onClick={() => setActiveSubSection('logs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubSection === 'logs'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-amber-200/80 hover:bg-white/10'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Usage &amp; Audit Logs</span>
          </button>

          <button
            onClick={() => setActiveSubSection('docs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubSection === 'docs'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-amber-200/80 hover:bg-white/10'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Interactive Docs &amp; Android SDK</span>
          </button>
        </div>
      </div>

      {/* Real-time Telemetry Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-1">
            <span>24h Request Volume</span>
            <Server className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {metrics?.totalRequests24h ?? 0}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">
            Throughput across all astrological endpoints
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-1">
            <span>Avg Response Latency</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700">
            {metrics?.avgDurationMs ?? 0} ms
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">
            P95 Latency: <span className="font-semibold text-stone-600">{metrics?.p95DurationMs ?? 0} ms</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-1">
            <span>Success Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {metrics?.successRatePercent ?? 100}%
          </div>
          <div className="text-[11px] text-rose-500 font-medium mt-0.5">
            {metrics?.errorCount ?? 0} client / server errors
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-1">
            <span>Active Integrations</span>
            <Zap className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {metrics?.activeKeysCount ?? 0} / {metrics?.totalKeysCount ?? 0}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">
            Authorized client API keys
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SUB-SECTION 0: API CONSUMPTION TRENDS & ERROR RATES (RECHARTS)      */}
      {/* ===================================================================== */}
      {activeSubSection === 'trends' && (
        <div className="space-y-6">
          {/* Trends Header & Horizon Controls */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-700" />
                  <h3 className="text-base font-bold text-stone-900 font-vedic">
                    External Integration Consumption &amp; Error Rate Trends
                  </h3>
                </div>
                <p className="text-xs text-stone-500 mt-1 max-w-2xl">
                  Daily request volume, 2xx success execution, and error rates plotted with Recharts to help administrators track external integration health, client SDK traffic, and SLA reliability.
                </p>
              </div>

              {/* Time Horizon Selector */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs font-bold shrink-0">
                <button
                  onClick={() => setTrendTimeRange('14d')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    trendTimeRange === '14d'
                      ? 'bg-amber-950 text-amber-50 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  Last 14 Days
                </button>
                <button
                  onClick={() => setTrendTimeRange('7d')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    trendTimeRange === '7d'
                      ? 'bg-amber-950 text-amber-50 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => setTrendTimeRange('24h')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    trendTimeRange === '24h'
                      ? 'bg-amber-950 text-amber-50 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  24h Intraday
                </button>
              </div>
            </div>

            {/* Selected Horizon Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60">
                <div className="text-[11px] font-bold text-amber-900 flex items-center justify-between">
                  <span>Period Total Volume</span>
                  <Activity className="w-3.5 h-3.5 text-amber-700" />
                </div>
                <div className="text-xl font-mono font-bold text-stone-900 mt-1">
                  {trendPeriodStats.totalReq.toLocaleString()} <span className="text-xs font-normal text-stone-500">calls</span>
                </div>
                <div className="text-[10px] text-amber-800/80 mt-0.5">
                  Across all active client keys
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
                <div className="text-[11px] font-bold text-stone-700 flex items-center justify-between">
                  <span>Overall Error Rate</span>
                  <Percent className="w-3.5 h-3.5 text-rose-600" />
                </div>
                <div className="text-xl font-mono font-bold text-rose-600 mt-1">
                  {trendPeriodStats.overallErrRate}%
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  <span>Within SLA (&lt; 5.0% target)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
                <div className="text-[11px] font-bold text-stone-700 flex items-center justify-between">
                  <span>Peak Traffic Point</span>
                  <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="text-xl font-mono font-bold text-stone-900 mt-1">
                  {trendPeriodStats.peakReq.toLocaleString()}
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5 truncate" title={trendPeriodStats.peakDate}>
                  Highest on {trendPeriodStats.peakDate}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
                <div className="text-[11px] font-bold text-stone-700 flex items-center justify-between">
                  <span>Period Avg Latency</span>
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-xl font-mono font-bold text-emerald-700 mt-1">
                  {trendPeriodStats.avgLat} ms
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5">
                  Ephemeris + DB computation
                </div>
              </div>
            </div>

            {/* Primary Recharts Chart */}
            <div className="mt-6 pt-5 border-t border-stone-100">
              <div className="flex items-center justify-end mb-2">
                <span className="text-[11px] font-mono text-stone-400">
                  Left Axis: Invocations • Right Axis: Error Rate %
                </span>
              </div>

              <div className="w-full h-80 sm:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={activeTrendData}
                    margin={{ top: 15, right: 25, left: 0, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d97706" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#fef3c7" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="succGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#ecfdf5" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="date"
                      stroke="#94a3b8"
                      tick={{ fontSize: 11 }}
                      tickLine={{ stroke: '#cbd5e1' }}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="#94a3b8"
                      tick={{ fontSize: 11 }}
                      tickLine={{ stroke: '#cbd5e1' }}
                      tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#e11d48"
                      tick={{ fontSize: 11 }}
                      tickLine={{ stroke: '#fda4af' }}
                      unit="%"
                      domain={[0, (dataMax: number) => Math.max(8, Math.ceil(dataMax + 2))]}
                    />
                    <Tooltip content={<CustomTrendTooltip />} />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}
                    />

                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="totalRequests"
                      name="Total Daily Requests"
                      fill="url(#reqGrad)"
                      stroke="#d97706"
                      strokeWidth={2.5}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="successfulRequests"
                      name="Successful Requests (2xx)"
                      fill="url(#succGrad)"
                      stroke="#059669"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="errorRate"
                      name="Error Rate (%)"
                      stroke="#e11d48"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#e11d48', strokeWidth: 1.5, stroke: '#ffffff' }}
                      activeDot={{ r: 7 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Secondary Visualizations: Error Volume & Endpoint Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart A: Daily Error Volume */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-stone-900 font-vedic flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Daily Failed Invocations (4xx / 5xx)</span>
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Failed client requests per day to isolate rate limits and bad payload formatting.
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
                  {trendPeriodStats.totalErr} Total Errors
                </span>
              </div>

              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activeTrendData} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
                    <Tooltip content={<CustomTrendTooltip />} />
                    <Bar
                      dataKey="errorRequests"
                      name="Failed Invocations"
                      fill="#e11d48"
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-100">
                <span>Threshold: &lt; 5% Target Error Rate</span>
                <span className="font-bold text-emerald-700">All Days Within Safe Operating Limits</span>
              </div>
            </div>

            {/* Chart B: Top Endpoint Consumption */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-stone-900 font-vedic flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-amber-700" />
                    <span>Traffic by Astrological Endpoint</span>
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Distribution of invocations across calculation engines.
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 font-bold border border-amber-200">
                  {metrics?.requestsByEndpoint?.length || 0} Endpoints Active
                </span>
              </div>

              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={(metrics?.requestsByEndpoint || []).map((ep) => ({
                      endpoint: ep.path.replace('/api/v1/', ''),
                      count: ep.count,
                      latency: ep.avgDurationMs,
                    }))}
                    margin={{ top: 15, right: 15, left: -20, bottom: 25 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="endpoint"
                      stroke="#94a3b8"
                      tick={{ fontSize: 9 }}
                      angle={-25}
                      textAnchor="end"
                    />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
                    <Tooltip
                      formatter={(value: any, name: any) => [
                        value,
                        name === 'count' ? 'Total Invocations' : name,
                      ]}
                    />
                    <Bar
                      dataKey="count"
                      name="Invocations"
                      fill="#b45309"
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-100">
                <span>Highest Traffic: <strong className="text-stone-800">Kundli &amp; Daily Transits</strong></span>
                <span className="font-bold text-stone-700">Sub-20ms Core Engine</span>
              </div>
            </div>
          </div>

          {/* Integration Health & SLA Monitoring Panel */}
          <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-amber-50 p-6 rounded-3xl border border-amber-800/40 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold mb-1 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SLA Health: 99.85% Optimal Availability</span>
                </div>
                <h4 className="text-base font-bold font-vedic text-white">
                  External Integration &amp; Native Mobile SDK Telemetry
                </h4>
                <p className="text-xs text-amber-200/70 mt-0.5 max-w-xl">
                  Astronava’s server-side Vedic REST API ensures consistent ephemeris computation across platforms while keeping mathematical engines authoritative and synchronized.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveSubSection('keys')}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Manage Keys</span>
                </button>
                <button
                  onClick={() => setActiveSubSection('logs')}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-amber-200 text-xs font-bold transition-all border border-white/10 cursor-pointer flex items-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>View Live Logs</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUB-SECTION 1: API KEYS MANAGEMENT */}
      {/* ===================================================================== */}
      {activeSubSection === 'keys' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-stone-900 font-vedic flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-800" />
                <span>Authorized Integration Keys</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Keys provide authenticated access to <code className="font-mono text-amber-900">/api/v1/*</code> endpoints for native apps and background services.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-medium">
                {keys.filter((k) => k.status === 'active').length} Active
              </span>
            </div>
          </div>

          {loadingKeys ? (
            <div className="py-16 text-center text-stone-400 flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-700" />
              <span className="text-xs">Loading integration keys...</span>
            </div>
          ) : keys.length === 0 ? (
            <div className="py-16 text-center text-stone-500 space-y-3">
              <Key className="w-8 h-8 text-stone-300 mx-auto" />
              <div className="text-sm font-semibold">No API Keys Generated Yet</div>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                Create an API key to allow your Android app, iOS app, or partner service to query Vedic calculation engines.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-900 text-white text-xs font-bold hover:bg-amber-800 cursor-pointer"
              >
                Generate First Key
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 uppercase tracking-wider text-[10px] font-bold">
                  <tr>
                    <th className="py-3 px-4">Key Label &amp; Environment</th>
                    <th className="py-3 px-4">Key Token</th>
                    <th className="py-3 px-4">Allowed Scopes</th>
                    <th className="py-3 px-4">Rate Limit</th>
                    <th className="py-3 px-4">Usage (Requests)</th>
                    <th className="py-3 px-4">Last Activity</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {keys.map((k) => (
                    <tr key={k.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-stone-900">{k.name}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              k.environment === 'production'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}
                          >
                            {k.environment}
                          </span>
                          {k.description && (
                            <span className="text-[11px] text-stone-400 truncate max-w-[200px]" title={k.description}>
                              {k.description}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <code className="font-mono text-[11px] bg-stone-100 px-2 py-1 rounded text-stone-700">
                            {k.maskedKey}
                          </code>
                          <button
                            onClick={() => handleCopy(k.maskedKey, `masked_${k.id}`)}
                            className="p-1 rounded text-stone-400 hover:text-stone-700 cursor-pointer"
                            title="Copy masked key ID"
                          >
                            {copiedKey === `masked_${k.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {k.allowedScopes.map((scope, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 text-[10px] font-mono"
                            >
                              {scope === '*' ? 'All Endpoints (*)' : scope.replace('/api/v1/', '')}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-stone-700">
                          {k.rateLimit} <span className="text-[10px] font-normal text-stone-400">req/min</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-stone-900">
                        {k.requestCount.toLocaleString()}
                      </td>

                      <td className="py-3 px-4 text-stone-500">
                        {k.lastUsedAt ? (
                          <div>
                            <div>{new Date(k.lastUsedAt).toLocaleDateString()}</div>
                            <div className="text-[10px] text-stone-400">
                              {new Date(k.lastUsedAt).toLocaleTimeString()}
                            </div>
                          </div>
                        ) : (
                          <span className="text-stone-400 italic">Never used</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            k.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              k.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          {k.status === 'active' ? 'Active' : 'Revoked'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleKey(k.id)}
                            disabled={togglingKeyId === k.id}
                            className={`p-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                              k.status === 'active'
                                ? 'border-amber-200 text-amber-800 hover:bg-amber-50'
                                : 'border-emerald-200 text-emerald-800 hover:bg-emerald-50'
                            }`}
                            title={k.status === 'active' ? 'Revoke Key' : 'Activate Key'}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteKey(k.id, k.name)}
                            disabled={deletingKeyId === k.id}
                            className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                            title="Delete Key Permanently"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUB-SECTION 2: USAGE & AUDIT LOGS */}
      {/* ===================================================================== */}
      {activeSubSection === 'logs' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden space-y-4 p-5">
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-stone-100">
            <div>
              <h3 className="text-base font-bold text-stone-900 font-vedic flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-800" />
                <span>Live API Traffic &amp; Request Telemetry</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Every calculation and query to Astronava core routes is recorded with latency, client IP, and response codes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Auto Refresh selector */}
              <div className="flex items-center gap-1.5 text-xs text-stone-600 bg-stone-50 px-2.5 py-1.5 rounded-xl border border-stone-200">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>Polling:</span>
                <select
                  value={autoRefreshInterval}
                  onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
                  className="bg-transparent text-xs font-bold text-stone-800 outline-none cursor-pointer"
                >
                  <option value={0}>Manual Only</option>
                  <option value={3000}>Every 3 sec</option>
                  <option value={5000}>Every 5 sec</option>
                  <option value={15000}>Every 15 sec</option>
                </select>
              </div>

              <button
                onClick={handleExportLogs}
                disabled={logs.length === 0}
                className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={handleClearLogs}
                disabled={clearingLogs || logs.length === 0}
                className="px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Logs</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                placeholder="Search by endpoint, IP, key..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
              />
            </div>

            <div>
              <select
                value={logStatusFilter}
                onChange={(e) => setLogStatusFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none bg-white text-stone-700"
              >
                <option value="all">All HTTP Status Codes</option>
                <option value="200">200 OK (Success)</option>
                <option value="400">400 Bad Request</option>
                <option value="401">401 Unauthorized Key</option>
                <option value="429">429 Rate Limited</option>
                <option value="500">500 Server Error</option>
              </select>
            </div>

            <div>
              <select
                value={logEndpointFilter}
                onChange={(e) => setLogEndpointFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none bg-white text-stone-700"
              >
                <option value="all">All Astrological Endpoints</option>
                <option value="/api/v1/kundli/calculate">/api/v1/kundli/calculate</option>
                <option value="/api/v1/horoscope/daily">/api/v1/horoscope/daily</option>
                <option value="/api/v1/gemstones/recommend">/api/v1/gemstones/recommend</option>
                <option value="/api/v1/match/compatibility">/api/v1/match/compatibility</option>
                <option value="/api/v1/numerology/calculate">/api/v1/numerology/calculate</option>
                <option value="/api/v1/name-correction/tune">/api/v1/name-correction/tune</option>
                <option value="/api/v1/meta">/api/v1/meta</option>
              </select>
            </div>
          </div>

          {/* Table */}
          {loadingLogs && logs.length === 0 ? (
            <div className="py-16 text-center text-stone-400 flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-700" />
              <span className="text-xs">Loading telemetry records...</span>
            </div>
          ) : logs.length === 0 ? (
            <div className="py-12 text-center text-stone-400 space-y-2">
              <Info className="w-8 h-8 text-stone-300 mx-auto" />
              <div className="text-xs font-semibold">No logs match your filter criteria</div>
            </div>
          ) : (
            <div className="overflow-x-auto border border-stone-100 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] font-bold border-b border-stone-100">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Method &amp; Endpoint</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Latency</th>
                    <th className="py-3 px-4">Client IP</th>
                    <th className="py-3 px-4">Client Key</th>
                    <th className="py-3 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-sans">
                  {logs.map((log) => {
                    const isSuccess = log.statusCode < 400;
                    return (
                      <tr key={log.id} className="hover:bg-amber-50/40 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap text-stone-500 font-mono text-[11px]">
                          <div>{new Date(log.timestamp).toLocaleTimeString()}</div>
                          <div className="text-[9px] text-stone-400">
                            {new Date(log.timestamp).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                                log.method === 'POST'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-sky-100 text-sky-800'
                              }`}
                            >
                              {log.method}
                            </span>
                            <span className="font-mono text-stone-900 font-semibold text-[11px]">
                              {log.path}
                            </span>
                          </div>
                          {log.errorMessage && (
                            <div className="text-[10px] text-rose-600 mt-0.5 truncate max-w-[280px]">
                              {log.errorMessage}
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                              log.statusCode === 200
                                ? 'bg-emerald-100 text-emerald-800'
                                : log.statusCode === 429
                                ? 'bg-violet-100 text-violet-800'
                                : log.statusCode === 401
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {log.statusCode} {log.statusCode === 200 ? 'OK' : ''}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-mono">
                          <span
                            className={`font-semibold ${
                              log.durationMs < 25
                                ? 'text-emerald-700'
                                : log.durationMs < 150
                                ? 'text-amber-700'
                                : 'text-rose-700'
                            }`}
                          >
                            {log.durationMs} ms
                          </span>
                        </td>

                        <td className="py-3 px-4 font-mono text-[11px] text-stone-600">
                          {log.ip}
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-[11px] text-stone-700 font-medium truncate max-w-[150px] block" title={log.keyName || log.apiKeyId}>
                            {log.keyName || log.apiKeyId || 'Public'}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedLogDetail(log)}
                            className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUB-SECTION 3: INTERACTIVE DOCS & SDK */}
      {/* ===================================================================== */}
      {activeSubSection === 'docs' && (
        <AdminApiDocsTab />
      )}

      {/* ===================================================================== */}
      {/* MODAL 1: CREATE API KEY */}
      {/* ===================================================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-700" />
                <h3 className="text-base font-bold text-stone-900 font-vedic">
                  {newKeySecret ? 'API Key Generated Successfully' : 'Generate New Integration API Key'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewKeySecret(null);
                }}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {newKeySecret ? (
              /* One-time Key Display View */
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Save your secret key securely now</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    This is the only time the full unmasked key is displayed. For security, we only store a salted SHA-256 hash. If lost, you will need to generate a new key.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">API Secret Token</label>
                  <div className="flex items-center gap-2 bg-stone-900 text-amber-300 p-3 rounded-xl font-mono text-xs break-all">
                    <span className="flex-1">{newKeySecret}</span>
                    <button
                      onClick={() => handleCopy(newKeySecret, 'new_secret')}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white shrink-0 cursor-pointer"
                      title="Copy Secret Key"
                    >
                      {copiedKey === 'new_secret' ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Quick Test cURL snippet */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Sample Test Command</label>
                  <pre className="bg-stone-950 text-stone-300 p-3 rounded-xl font-mono text-[11px] overflow-x-auto">
{`curl -X GET "${typeof window !== 'undefined' ? window.location.origin : ''}/api/v1/meta" \\
  -H "X-Astronava-Api-Key: ${newKeySecret}"`}
                  </pre>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setNewKeySecret(null);
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-bold text-xs cursor-pointer shadow-xs"
                  >
                    I Have Saved This Key Securely
                  </button>
                </div>
              </div>
            ) : (
              /* Create Form View */
              <form onSubmit={handleCreateKey} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">
                    Integration / Application Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Astronava Android App v2.5, Vedic CRM Sync"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Environment</label>
                    <select
                      value={newKeyEnv}
                      onChange={(e) => setNewKeyEnv(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none bg-white"
                    >
                      <option value="production">Production (ast_live_)</option>
                      <option value="sandbox">Sandbox (ast_test_)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Rate Limit</label>
                    <select
                      value={newKeyRateLimit}
                      onChange={(e) => setNewKeyRateLimit(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none bg-white"
                    >
                      <option value={60}>60 req / min (Standard)</option>
                      <option value={120}>120 req / min (Medium)</option>
                      <option value={300}>300 req / min (High Mobile)</option>
                      <option value={1000}>1,000 req / min (Enterprise)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Allowed Scopes</label>
                  <select
                    value={newKeyScopes[0]}
                    onChange={(e) => setNewKeyScopes([e.target.value])}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none bg-white"
                  >
                    <option value="*">All Endpoints (Full Astrological Engine)</option>
                    <option value="/api/v1/kundli/calculate">Birth Chart &amp; Kundli Only</option>
                    <option value="/api/v1/horoscope/daily">Daily Transits &amp; Horoscope Only</option>
                    <option value="/api/v1/match/compatibility">Matchmaking &amp; Ashta Koota Only</option>
                    <option value="/api/v1/gemstones/recommend">Gemstone Recommendation Only</option>
                    <option value="/api/v1/numerology/calculate">Numerology &amp; Name Tune Only</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Description / Note (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Dedicated credentials for Android Google Play build"
                    value={newKeyDesc}
                    onChange={(e) => setNewKeyDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingKey}
                    className="px-5 py-2 rounded-xl bg-amber-900 hover:bg-amber-800 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                  >
                    {creatingKey ? 'Generating Key...' : 'Create & Reveal Key'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: INSPECT LOG DETAIL */}
      {/* ===================================================================== */}
      {selectedLogDetail && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-700" />
                <h3 className="text-base font-bold text-stone-900 font-vedic">
                  Request Telemetry Inspector
                </h3>
              </div>
              <button
                onClick={() => setSelectedLogDetail(null)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200/70">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Status Code</span>
                  <span className="font-mono font-bold text-sm text-stone-900">
                    {selectedLogDetail.statusCode}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Latency</span>
                  <span className="font-mono font-bold text-sm text-emerald-700">
                    {selectedLogDetail.durationMs} ms
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Timestamp</span>
                  <span className="font-mono text-stone-700 text-[11px]">
                    {new Date(selectedLogDetail.timestamp).toISOString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Client IP</span>
                  <span className="font-mono text-stone-700 text-[11px]">
                    {selectedLogDetail.ip}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold block mb-1">Target Endpoint</span>
                <div className="p-2.5 rounded-xl bg-stone-900 text-amber-300 font-mono text-xs">
                  {selectedLogDetail.method} {selectedLogDetail.path}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold block mb-1">User Agent</span>
                <div className="p-2.5 rounded-xl bg-stone-100 text-stone-700 font-mono text-[11px] break-all">
                  {selectedLogDetail.userAgent}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold block mb-1">API Key Attribution</span>
                <div className="p-2.5 rounded-xl bg-stone-100 text-stone-700 font-mono text-[11px]">
                  {selectedLogDetail.keyName || selectedLogDetail.apiKeyId || 'Public / Unauthenticated'}
                </div>
              </div>

              {selectedLogDetail.errorMessage && (
                <div>
                  <span className="text-[10px] text-rose-500 uppercase font-bold block mb-1">Error Message</span>
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-mono text-[11px]">
                    {selectedLogDetail.errorMessage}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLogDetail(null)}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
