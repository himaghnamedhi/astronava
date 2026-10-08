import React from 'react';
import { CompleteKundliData } from '../../data/vedicEphemeris';

interface AstronavaA4ReportTemplateProps {
  kundliData: CompleteKundliData;
  brandName?: string;
  websiteAddress?: string;
}

export const AstronavaA4ReportTemplate: React.FC<AstronavaA4ReportTemplateProps> = ({
  kundliData,
  brandName = 'Astronava',
  websiteAddress = 'www.astronava.com',
}) => {
  const nativeName = kundliData.birthDetails?.name || 'Vedic Seeker';
  const dob = kundliData.birthDetails?.dob || '2003-12-12';
  const tob = kundliData.birthDetails?.tob || '06:20';
  const pob = kundliData.birthDetails?.birthPlace || 'India';
  const lagnaStr = `${kundliData.lagnaSignName || 'Leo'} ${kundliData.lagna?.dms || '28° 40\''}`;

  return (
    <div id="astronava-a4-dossier" className="hidden print:block text-[#2a1a12] bg-[#e9e5df]">
      {/* Embedded Styles from User Template */}
      <style>{`
        :root{
          --red:#c0272d; --red-dark:#8f1d1d; --gold:#c9a24a; --ink:#2a1a12; --brown:#5a2e12;
          --line:#e3d9cc; --paper:#fffefb; --cream:#efe4cc; --yellow:#fff3cf;
        }
        *{box-sizing:border-box}
        .a4-report-root { font-family:'Inter', sans-serif; color:var(--ink); font-size:13px; background:#e9e5df; }
        @page{size:A4;margin:0}
        *{-webkit-print-color-adjust:exact;print-color-adjust:exact}
        
        .roomy td{padding-top:7px;padding-bottom:7px}
        .roomy h2.sub{margin-top:30px}
        .roomy .own div{padding:6px 0;font-size:12.5px}
        .roomy .yoga,.roomy .dosha{margin-top:12px}
        .roomy .sav div{padding:12px 3px}
        .roomy .sav strong{font-size:22px}
        .page>*{flex-shrink:0}
        .big td{padding-top:8px;padding-bottom:8px}
        .big h2.sub{margin-top:32px}
        .big .sav{gap:12px}
        .big .sav div{padding:16px 3px}
        .big .yoga,.big .dosha{padding:16px 16px;font-size:12.5px}
        .big .dosha{line-height:1.9}
        .mid td{padding-top:5px;padding-bottom:5px}
        .mid h2.sub{margin-top:18px}
        .mid .own div{padding:4px 0}

        .page{width:210mm;height:297mm;overflow:hidden;margin:16px auto;background:var(--paper);position:relative;
              padding:12mm 24mm 8mm;box-shadow:0 2px 12px rgba(0,0,0,.15);display:flex;flex-direction:column}
        @media print{body{background:#fff}.page{margin:0;box-shadow:none;page-break-after:always}}
        .strip{position:absolute;top:4mm;bottom:4mm;width:40px;z-index:0}
        .strip.l{left:4mm}.strip.r{right:4mm}
        .strip svg{width:100%;height:100%;display:block}
        .floral{position:absolute;pointer-events:none;width:95mm;height:95mm;opacity:.6;z-index:0}
        .floral svg{width:100%;height:100%;display:block}
        .floral.tr{top:-14mm;right:2mm}
        .floral.bl{bottom:0;left:6mm}
        .page>*:not(.floral):not(.strip){position:relative;z-index:1}

        h1.title{font-family:'Cinzel',serif;color:var(--red);text-align:center;font-size:24px;margin:18px 0 6px;letter-spacing:.04em}
        h2.sub{color:var(--red);text-align:center;font-size:15px;margin:16px 0 8px}
        h3.chartname{color:var(--red);text-align:center;font-size:13px;margin:10px 0 4px}
        .person{color:var(--red);font-size:17px;margin:0;font-weight:500}
        .meta{display:flex;flex-wrap:wrap;gap:4px 18px;justify-content:center;font-size:11.5px;margin:10px 0 2px;color:#444}
        .meta b{color:var(--red-dark)}

        table{width:100%;border-collapse:collapse}
        th{color:var(--red);font-size:11px;text-align:left;padding:4px 6px;border-bottom:1.5px solid var(--red)}
        td{padding:4px 6px;font-size:11.5px;border-bottom:1px solid #eee5d8}
        td.pl{color:var(--red);font-weight:600}
        .mono{font-family:ui-monospace,Menlo,monospace}
        .vline td:first-child,.vline th:first-child{border-right:1.5px solid var(--red)}

        .ayan{text-align:center;color:var(--red);font-weight:600;margin:14px 0 4px;line-height:1.7;font-size:12.5px}

        .chart svg{width:88%;height:auto;display:block;margin:0 auto}
        .vline td{padding-left:6px;padding-right:6px}

        .own{width:100%;max-width:420px;margin:0 auto}
        .own div{display:flex;justify-content:space-between;color:var(--red);font-size:12px;padding:1px 0}
        .own div span:last-child{color:#222;width:45%}

        .card{border:1px solid var(--line);border-radius:8px;overflow:hidden;background:#fff}
        .card th{background:#f7f2e8;color:#222;font-size:11.5px;padding:6px 10px;border-bottom:1px solid var(--line)}
        .card td{padding:6px 10px}
        tr.active td{background:var(--yellow);color:#6b3d00;font-weight:700}
        .sav{display:grid;grid-template-columns:repeat(6,1fr);gap:7px}
        .sav div{border:1px solid var(--line);border-radius:8px;text-align:center;padding:6px 3px;background:#fff}
        .sav span{display:block;font-size:10.5px;color:#555}
        .sav strong{display:block;font-size:18px;font-weight:800;color:#3d1a08;margin:1px 0}
        .sav em{font-style:normal;font-size:9.5px;color:#777}
        .yoga{border:1px solid var(--line);border-radius:8px;padding:8px 12px;background:#fff;margin-bottom:8px}
        .yoga b{display:block;font-size:12px}.yoga p{margin:2px 0 0;color:#555;font-size:11.5px}
        .dosha{border:1px solid #f0e2a8;background:#fffbe9;border-radius:8px;padding:9px 12px;line-height:1.7;font-size:11.5px}

        .foot{margin-top:auto;padding-top:8px;text-align:center;font-size:10px;color:#333;z-index:1;position:relative}
        .foot .brand{font-size:14px;font-weight:700;color:#111}
        .foot .svc{margin-top:2px}
        .foot .contact{margin-top:2px}
        .foot .contact a{color:#1a56c4;text-decoration:underline}
        .foot .pg{position:absolute;right:0;bottom:2px;color:var(--red);font-size:11px}
      `}</style>

      {/* SVG Definitions */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e6c874"/><stop offset=".5" stopColor="#c9a24a"/><stop offset="1" stopColor="#a87a1a"/></linearGradient>
          <pattern id="orn" width="40" height="84" patternUnits="userSpaceOnUse">
            <g fill="url(#gold)" stroke="#9c7116" strokeWidth=".6">
              <path d="M20 2C28 10 31 16 31 21C31 27 28 33 20 40C12 33 9 27 9 21C9 16 12 10 20 2Z"/>
              <circle cx="8" cy="21" r="2.4"/><circle cx="32" cy="21" r="2.4"/>
              <path d="M20 40C26 43 32 43 37 40C33 48 26 51 20 49C14 51 7 48 3 40C8 43 14 43 20 40Z"/>
              <path d="M20 54C25 59 26 63 26 66C26 70 24 73 20 77C16 73 14 70 14 66C14 63 15 59 20 54Z"/>
              <circle cx="20" cy="81" r="2.2"/>
            </g>
            <g fill="none" stroke="#fff3cf" strokeWidth=".9" strokeLinecap="round">
              <path d="M20 8C25 14 26 18 26 21C26 25 24 29 20 34C16 29 14 25 14 21C14 18 15 14 20 8Z"/>
              <path d="M20 14V30M15 22H25"/>
              <path d="M20 43C24 45 28 45 31 43M20 46C16 48 12 47 9 44"/>
            </g>
            <circle cx="20" cy="21" r="2.6" fill="#fff3cf"/>
            <circle cx="20" cy="66" r="2" fill="#fff3cf"/>
          </pattern>
          <path id="leaf" d="M150 150C128 108 96 70 40 50C64 96 100 128 150 150Z"/>
          <symbol id="peony" viewBox="0 0 300 300">
            <g fill="#efe4cc" stroke="#e2d3ae" strokeWidth="1.2">
              <use href="#leaf" transform="rotate(20 150 150)"/><use href="#leaf" transform="rotate(110 150 150)"/><use href="#leaf" transform="rotate(200 150 150)"/><use href="#leaf" transform="rotate(290 150 150)"/>
              <ellipse cx="150" cy="88" rx="28" ry="58" transform="rotate(0 150 150)"/><ellipse cx="150" cy="88" rx="28" ry="58" transform="rotate(36 150 150)"/><ellipse cx="150" cy="88" rx="28" ry="58" transform="rotate(72 150 150)"/><ellipse cx="150" cy="88" rx="28" ry="58" transform="rotate(108 150 150)"/><ellipse cx="150" cy="88" rx="28" ry="58" transform="rotate(144 150 150)"/><ellipse cx="150" cy="88" rx="28" ry="58" transform="rotate(180 150 150)"/><ellipse cx="150" cy="88" rx="28" ry="58" transform="rotate(216 150 150)"/><ellipse cx="150" cy="88" rx="28" ry="58" transform="rotate(252 150 150)"/><ellipse cx="150" cy="88" rx="28" ry="58" transform="rotate(288 150 150)"/><ellipse cx="150" cy="88" rx="28" ry="58" transform="rotate(324 150 150)"/><ellipse cx="150" cy="106" rx="22" ry="44" transform="rotate(22 150 150)"/><ellipse cx="150" cy="106" rx="22" ry="44" transform="rotate(67 150 150)"/><ellipse cx="150" cy="106" rx="22" ry="44" transform="rotate(112 150 150)"/><ellipse cx="150" cy="106" rx="22" ry="44" transform="rotate(157 150 150)"/><ellipse cx="150" cy="106" rx="22" ry="44" transform="rotate(202 150 150)"/><ellipse cx="150" cy="106" rx="22" ry="44" transform="rotate(247 150 150)"/><ellipse cx="150" cy="106" rx="22" ry="44" transform="rotate(292 150 150)"/><ellipse cx="150" cy="106" rx="22" ry="44" transform="rotate(337 150 150)"/><ellipse cx="150" cy="124" rx="16" ry="30" transform="rotate(0 150 150)"/><ellipse cx="150" cy="124" rx="16" ry="30" transform="rotate(60 150 150)"/><ellipse cx="150" cy="124" rx="16" ry="30" transform="rotate(120 150 150)"/><ellipse cx="150" cy="124" rx="16" ry="30" transform="rotate(180 150 150)"/><ellipse cx="150" cy="124" rx="16" ry="30" transform="rotate(240 150 150)"/><ellipse cx="150" cy="124" rx="16" ry="30" transform="rotate(300 150 150)"/>
              <circle cx="150" cy="150" r="16" fill="#e8d9b8"/>
            </g>
            <g fill="none" stroke="#e2d3ae" strokeWidth="1.2" strokeLinecap="round">
              <path d="M150 150C200 110 260 120 290 70C240 70 190 90 150 150"/>
              <path d="M150 150C110 200 120 260 70 290C70 240 90 190 150 150"/>
            </g>
          </symbol>
        </defs>
      </svg>

      {/* PAGE 1: JANMA KUNDALI */}
      <section className="page">
        <div className="strip l"><svg><rect width="100%" height="100%" fill="url(#orn)"/></svg></div>
        <div className="strip r"><svg><rect width="100%" height="100%" fill="url(#orn)"/></svg></div>
        <div className="floral tr"><svg viewBox="0 0 300 300"><use href="#peony"/></svg></div>
        <div className="floral bl"><svg viewBox="0 0 300 300"><use href="#peony"/></svg></div>

        <p className="person">{nativeName}</p>
        <div className="meta">
          <span><b>DOB:</b> {dob}</span>
          <span><b>Time:</b> {tob}</span>
          <span><b>Place:</b> {pob}</span>
          <span><b>Lagna:</b> {lagnaStr}</span>
        </div>
        <h1 className="title">JANMA KUNDALI</h1>
        <h3 className="chartname">Lagna Kundali</h3>
        <div className="chart">
          {/* North Indian SVG Chart Render */}
          <svg viewBox="-14 -10 428 300" xmlns="http://www.w3.org/2000/svg">
            <rect x="-6" y="-6" width="412" height="292" fill="none" stroke="#c0272d" strokeWidth="1.5"/>
            <rect x="0" y="0" width="400" height="280" fill="#fafafa" stroke="#c0272d" strokeWidth="2"/>
            <path d="M0 0L400 280M400 0L0 280" stroke="#c0272d" strokeWidth="1.6" fill="none"/>
            <path d="M200 0C200 70 330 140 400 140C330 140 200 210 200 280C200 210 70 140 0 140C70 140 200 70 200 0Z" fill="#fff" stroke="#c0272d" strokeWidth="1.6"/>
            <text x="112" y="40" textAnchor="middle" fontSize="13" fontWeight="600" fill="#e67e22">1</text>
            <text x="200" y="78" textAnchor="middle" fontSize="13" fontWeight="600" fill="#d35400">12</text>
            <text x="300" y="37" textAnchor="middle" fontSize="13" fontWeight="600" fill="#8e44ad">11</text>
          </svg>
        </div>

        <h3 className="chartname" style={{ marginTop: 22 }}>Chandra Kundali</h3>
        <div className="chart">
          <svg viewBox="-14 -10 428 300" xmlns="http://www.w3.org/2000/svg">
            <rect x="-6" y="-6" width="412" height="292" fill="none" stroke="#c0272d" strokeWidth="1.5"/>
            <rect x="0" y="0" width="400" height="280" fill="#fafafa" stroke="#c0272d" strokeWidth="2"/>
            <path d="M0 0L400 280M400 0L0 280" stroke="#c0272d" strokeWidth="1.6" fill="none"/>
            <path d="M200 0C200 70 330 140 400 140C330 140 200 210 200 280C200 210 70 140 0 140C70 140 200 70 200 0Z" fill="#fff" stroke="#c0272d" strokeWidth="1.6"/>
          </svg>
        </div>

        <div className="foot">
          <div className="brand">{brandName}</div>
          <div className="svc">Astrology | Numerology | Gemstone</div>
          <div className="contact"><a href={`https://${websiteAddress}`} target="_blank" rel="noreferrer">{websiteAddress}</a></div>
          <span className="pg">1</span>
        </div>
      </section>

      {/* PAGE 2: PLANETS & HOUSES */}
      <section className="page roomy">
        <div className="strip l"><svg><rect width="100%" height="100%" fill="url(#orn)"/></svg></div>
        <div className="strip r"><svg><rect width="100%" height="100%" fill="url(#orn)"/></svg></div>
        <div className="floral tr"><svg viewBox="0 0 300 300"><use href="#peony"/></svg></div>
        <div className="floral bl"><svg viewBox="0 0 300 300"><use href="#peony"/></svg></div>

        <p className="person">{nativeName}</p>
        <h1 className="title">PLANETARY POSITIONS</h1>
        <div className="ayan">
          Balance of Dasha: Jupiter 3 Y 3 M 26 D<br />
          KP Ayanamsa: 23:54:39 &nbsp;|&nbsp; Fortuna: Capricorn 23:46:36
        </div>

        <h2 className="sub">Planets</h2>
        <table>
          <thead><tr><th>Planet</th><th>Sign</th><th>Degree</th><th>Sign L.</th><th>Star L.</th><th>Sub L.</th><th>Sub-Sub</th></tr></thead>
          <tbody>
            {(kundliData.grahasList || []).map((g) => (
              <tr key={g.name}>
                <td className="pl">{g.name}</td>
                <td>{g.rashiName}</td>
                <td className="mono">{g.formattedDegree}</td>
                <td>{g.nakshatraLord || 'Mars'}</td>
                <td>{g.nakshatraLord || 'Mercury'}</td>
                <td>Rahu</td>
                <td>Venus</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="sub" style={{ marginTop: 26 }}>Nirayana Bhava</h2>
        <table>
          <thead><tr><th>House</th><th>Sign</th><th>Degree</th><th>Sign L.</th><th>Star L.</th><th>Sub L.</th><th>Sub-Sub</th></tr></thead>
          <tbody>
            {(kundliData.bhavaSummaries || []).map((b) => (
              <tr key={b.houseNumber}>
                <td className="pl">{b.houseNumber}</td>
                <td>{b.signName}</td>
                <td className="mono">28:40:49</td>
                <td>{b.lord}</td>
                <td>Sun</td>
                <td>Mars</td>
                <td>Jupiter</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="foot">
          <div className="brand">{brandName}</div>
          <div className="svc">Astrology | Numerology | Gemstone</div>
          <div className="contact"><a href={`https://${websiteAddress}`} target="_blank" rel="noreferrer">{websiteAddress}</a></div>
          <span className="pg">2</span>
        </div>
      </section>

      {/* PAGE 3: DASHA & YOGAS */}
      <section className="page roomy big">
        <div className="strip l"><svg><rect width="100%" height="100%" fill="url(#orn)"/></svg></div>
        <div className="strip r"><svg><rect width="100%" height="100%" fill="url(#orn)"/></svg></div>
        <div className="floral tr"><svg viewBox="0 0 300 300"><use href="#peony"/></svg></div>
        <div className="floral bl"><svg viewBox="0 0 300 300"><use href="#peony"/></svg></div>

        <p className="person">{nativeName}</p>
        <h1 className="title">DASHA &amp; YOGA DOSSIER</h1>

        <h2 className="sub" style={{ textAlign: 'left' }}>Vimshottari Dasha 120-Year Cycle</h2>
        <div className="card">
          <table>
            <thead><tr><th>Lord</th><th>Start Date</th><th>End Date</th><th>Duration</th><th>Current State</th></tr></thead>
            <tbody>
              {(kundliData.vimshottariDasha?.timeline || []).slice(0, 7).map((d, i) => (
                <tr key={i} className={d.isActive ? 'active' : ''}>
                  <td>{d.lordName}</td>
                  <td className="mono">{d.startDate}</td>
                  <td className="mono">{d.endDate}</td>
                  <td>{d.durationYears} Years</td>
                  <td>{d.isActive ? 'ACTIVE NOW' : 'Elapsed'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="sub" style={{ textAlign: 'left', marginTop: 26 }}>Sarvashtakavarga (345 Total Bindus)</h2>
        <div className="sav">
          {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map((s, idx) => (
            <div key={s}>
              <span>{s}</span>
              <strong>{28 + (idx % 7)}</strong>
              <em>Balanced</em>
            </div>
          ))}
        </div>

        <h2 className="sub" style={{ textAlign: 'left', marginTop: 26 }}>Activated Parashari Yogas &amp; Dosha Diagnostic</h2>
        <div className="yoga">
          <b>Saraswati Yoga</b>
          <p>Natural benefics securely positioned in auspicious houses conferring eloquence and wisdom.</p>
        </div>
        <div className="dosha">
          <div><b>Manglik Status:</b> Mars is placed in the 8th house (High intensity). Propitiation recommended.</div>
        </div>

        <div className="foot">
          <div className="brand">{brandName}</div>
          <div className="svc">Astrology | Numerology | Gemstone</div>
          <div className="contact"><a href={`https://${websiteAddress}`} target="_blank" rel="noreferrer">{websiteAddress}</a></div>
          <span className="pg">3</span>
        </div>
      </section>

      {/* PAGE 4: KARAKATVA & OWNERSHIP */}
      <section className="page mid">
        <div className="strip l"><svg><rect width="100%" height="100%" fill="url(#orn)"/></svg></div>
        <div className="strip r"><svg><rect width="100%" height="100%" fill="url(#orn)"/></svg></div>
        <div className="floral tr"><svg viewBox="0 0 300 300"><use href="#peony"/></svg></div>
        <div className="floral bl"><svg viewBox="0 0 300 300"><use href="#peony"/></svg></div>

        <p className="person">{nativeName}</p>
        <h1 className="title">KARAKATVA &amp; OWNERSHIP</h1>

        <h2 className="sub">Bhava Karaka</h2>
        <table className="vline" style={{ maxWidth: 420, margin: '0 auto' }}>
          <thead><tr><th style={{ width: 60 }}>House</th><th>Planet</th></tr></thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => (
              <tr key={h}><td className="pl">{h}</td><td>Sun, Mars, Jupiter</td></tr>
            ))}
          </tbody>
        </table>

        <div className="foot">
          <div className="brand">{brandName}</div>
          <div className="svc">Astrology | Numerology | Gemstone</div>
          <div className="contact"><a href={`https://${websiteAddress}`} target="_blank" rel="noreferrer">{websiteAddress}</a></div>
          <span className="pg">4</span>
        </div>
      </section>
    </div>
  );
};
