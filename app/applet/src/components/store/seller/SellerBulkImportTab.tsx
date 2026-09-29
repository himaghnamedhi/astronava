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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
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
        setData([]);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-stone-950">Bulk Import Products</h3>
        <label className="bg-amber-900 text-white px-4 py-2 rounded-xl text-sm font-bold cursor-pointer flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>

      {data.length > 0 && (
        <div className="overflow-hidden border border-stone-200 rounded-lg">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-stone-50 text-stone-600 font-bold uppercase text-xs">
                        <th className="p-3 text-left">Product</th>
                        <th className="p-3 text-left">SKU</th>
                        <th className="p-3 text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, idx) => (
                        <tr key={idx} className="border-t border-stone-100">
                            <td className="p-3 font-medium">{item.row.productName}</td>
                            <td className="p-3 font-mono text-stone-500">{item.row.sku}</td>
                            <td className="p-3">
                                {item.isValid ? <CheckCircle2 className="text-emerald-500 w-5 h-5"/> : <AlertTriangle className="text-rose-500 w-5 h-5"/>}
                                {item.errors.map(e => <div key={e} className="text-xs text-rose-600">{e}</div>)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="p-4 border-t border-stone-100 flex justify-end">
                <button onClick={submitValid} className="bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                    <Send className="w-4 h-4"/> Submit Valid Products
                </button>
            </div>
        </div>
      )}
    </div>
  );
};
