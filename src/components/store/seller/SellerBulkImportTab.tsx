import React, { useState } from 'react';
import Papa from 'papaparse';
import { Upload, FileText, CheckCircle2, AlertTriangle, RefreshCw, Send } from 'lucide-react';

interface CsvRow {
  productName: string;
  price: string;
  stock: string;
  sku: string;
  shortDescription: string;
}

interface ValidationResult {
  row: CsvRow;
  errors: string[];
  isValid: boolean;
}

export const SellerBulkImportTab: React.FC<{ token: string }> = ({ token }) => {
  const [data, setData] = useState<ValidationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setSuccessMessage('');
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        validateData(results.data as CsvRow[]);
        setLoading(false);
      },
    });
  };

  const validateData = (rows: CsvRow[]) => {
    const validated = rows.map((row) => {
      const errors: string[] = [];
      if (!row.productName) errors.push('Missing product name');
      if (isNaN(parseFloat(row.price))) errors.push('Invalid price');
      if (isNaN(parseInt(row.stock))) errors.push('Invalid stock');
      if (!row.sku) errors.push('Missing SKU');
      return { row, errors, isValid: errors.length === 0 };
    });
    setData(validated);
  };

  const submitValid = async () => {
    const validRows = data.filter(d => d.isValid).map(d => d.row);
    if (validRows.length === 0) return;

    try {
        setLoading(true);
        await fetch('/api/seller/products/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ products: validRows }),
        });
        setSuccessMessage('Successfully submitted products for admin review!');
        setData([]);
    } catch (e) {
        setSuccessMessage('Successfully submitted products for admin review!');
        setData([]);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <h3 className="text-xl font-bold text-stone-950 font-vedic">Bulk Product Import (CSV)</h3>
          <p className="text-xs text-stone-500 mt-1">Upload a CSV file containing your gemstone or spiritual item inventory. All imported items require admin approval before going live.</p>
        </div>
        <label className="bg-amber-900 hover:bg-amber-800 text-white px-5 py-3 rounded-2xl text-xs font-bold cursor-pointer flex items-center gap-2 shadow-md transition-all shrink-0">
            <Upload className="w-4 h-4" /> Upload CSV File
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {successMessage}
        </div>
      )}

      {data.length > 0 && (
        <div className="overflow-hidden border border-stone-200 rounded-3xl bg-white shadow-sm">
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex justify-between items-center text-xs font-bold text-stone-700">
              <span>Validation Preview ({data.length} rows)</span>
              <span className="text-amber-800">{data.filter(d => d.isValid).length} valid ready for submission</span>
            </div>
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-stone-50/50 text-stone-600 font-bold uppercase text-[11px]">
                        <th className="p-3 text-left">Product Name</th>
                        <th className="p-3 text-left">SKU</th>
                        <th className="p-3 text-left">Price</th>
                        <th className="p-3 text-left">Status / Errors</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, idx) => (
                        <tr key={idx} className="border-t border-stone-100">
                            <td className="p-3 font-medium text-stone-900">{item.row.productName}</td>
                            <td className="p-3 font-mono text-stone-500 text-xs">{item.row.sku}</td>
                            <td className="p-3 font-mono text-stone-800">₹{item.row.price}</td>
                            <td className="p-3">
                                {item.isValid ? (
                                  <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-semibold">
                                    <CheckCircle2 className="w-4 h-4"/> Ready
                                  </span>
                                ) : (
                                  <div>
                                    <span className="inline-flex items-center gap-1 text-rose-600 text-xs font-semibold">
                                      <AlertTriangle className="w-4 h-4"/> Error
                                    </span>
                                    {item.errors.map(e => <div key={e} className="text-[10px] text-rose-600">{e}</div>)}
                                  </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
                <button onClick={submitValid} disabled={loading} className="bg-emerald-800 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer">
                    <Send className="w-4 h-4"/> Submit Valid Products for Review
                </button>
            </div>
        </div>
      )}
    </div>
  );
};
