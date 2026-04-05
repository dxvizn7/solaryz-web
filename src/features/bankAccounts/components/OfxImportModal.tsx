import { useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { UploadCloud, AlertTriangle, X, Loader2, FileUp, Check, RefreshCw } from 'lucide-react';
import { useNotification } from '../../../contexts/NotificationContext';
import { api } from '../../../config/api';

export interface TransactionAnalysis {
  fitid: string;
  description: string;
  amount: number;
  date: string;
  type: 'CREDIT' | 'DEBIT';
  is_duplicate: boolean;
  raw_amount?: number;
}

interface AnalyzeResponse {
  message: string;
  transactions_found: number;
  analysis: TransactionAnalysis[];
  balance_warning?: boolean;
  balance_warning_message?: string;
  skipped_message?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  destinationType: 'account' | 'credit_card';
  destinationId: number;
  onSuccess: () => void;
}

export function OfxImportModal({ isOpen, onClose, destinationType, destinationId, onSuccess }: Props) {
  const { addNotification } = useNotification();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResponse | null>(null);
  const [selectedTxIds, setSelectedTxIds] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const handleReset = () => {
    setFile(null);
    setAnalysisResult(null);
    setSelectedTxIds(new Set());
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const analyzeFile = async (fileToUpload: File) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('destination_type', destinationType);
    formData.append('destination_id', String(destinationId));
    try {
      const response = await api.post('/statements/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const data = response.data as AnalyzeResponse;
      setAnalysisResult(data);
      const initialSelection = new Set<string>();
      if (data.analysis) {
        data.analysis.forEach(tx => {
          if (!tx.is_duplicate) initialSelection.add(tx.fitid);
        });
      }
      setSelectedTxIds(initialSelection);
      addNotification({ type: 'success', message: data.message || 'Arquivo analisado com sucesso!' });
    } catch (err: any) {
      addNotification({ type: 'error', message: err?.response?.data?.message || 'Erro ao analisar arquivo.' });
      setFile(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      await analyzeFile(selectedFile);
    }
  };

  const toggleSelection = (fitid: string) => {
    setSelectedTxIds(prev => {
      const next = new Set(prev);
      if (next.has(fitid)) next.delete(fitid); else next.add(fitid);
      return next;
    });
  };

  const toggleAll = () => {
    if (!analysisResult?.analysis) return;
    if (selectedTxIds.size === analysisResult.analysis.length) {
      setSelectedTxIds(new Set());
    } else {
      setSelectedTxIds(new Set(analysisResult.analysis.map(tx => tx.fitid)));
    }
  };

  const handleCommit = async () => {
    if (!analysisResult?.analysis || selectedTxIds.size === 0) return;
    setIsCommitting(true);
    const activeTx = analysisResult.analysis.filter(tx => selectedTxIds.has(tx.fitid));
    try {
      await api.post('/statements/commit', {
        destination_type: destinationType,
        destination_id: destinationId,
        transactions: activeTx
      });
      // Invalidate all relevant caches so Dashboard & TransactionsPage refresh immediately
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['accounts'] }),
        queryClient.invalidateQueries({ queryKey: ['transactionSummary'] }),
        queryClient.invalidateQueries({ queryKey: ['categoryExpenses'] }),
        queryClient.invalidateQueries({ queryKey: ['transactions'] }),
      ]);
      addNotification({ type: 'success', message: `${activeTx.length} transações importadas com sucesso!` });
      onSuccess();
      handleClose();
    } catch (err: any) {
      addNotification({ type: 'error', message: err?.response?.data?.message || 'Erro ao confirmar importação.' });
    } finally {
      setIsCommitting(false);
    }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="bg-[#18181b] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col">

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/[0.02]">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <UploadCloud size={20} className="text-[#F2910A]" />
            Importação OFX
          </h2>
          <button onClick={handleClose} className="text-white/50 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">

          {/* Step 1: File Upload */}
          {!file && !isAnalyzing && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-[#F2910A]/50 hover:bg-[#F2910A]/5 group transition-all"
            >
              <FileUp size={32} className="text-white/40 group-hover:text-[#F2910A] mb-4 transition-colors" />
              <p className="text-lg font-medium text-white mb-2">Clique para selecionar seu Extrato</p>
              <p className="text-sm text-white/40">Suporta arquivos .ofx, .csv, .txt e .xml</p>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".ofx,.csv,.txt,.xml"
                onChange={handleFileSelect}
              />
            </div>
          )}

          {/* Step 2: Analyzing */}
          {isAnalyzing && (
            <div className="py-20 flex flex-col items-center justify-center">
              <RefreshCw size={40} className="text-[#F2910A] animate-spin mb-4" />
              <p className="text-white">Lendo e analisando transações...</p>
            </div>
          )}

          {/* Step 3: Review Table */}
          {analysisResult && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Revisão de Lançamentos</h3>
                <button onClick={handleReset} className="text-sm text-white/40 hover:text-white transition-colors">
                  Carregar Outro
                </button>
              </div>

              {analysisResult.balance_warning && (
                <div className="mb-4 bg-[#F2910A]/10 border border-[#F2910A]/20 rounded-xl p-4 flex gap-3">
                  <AlertTriangle className="text-[#F2910A] shrink-0" size={20} />
                  <p className="text-[#F2910A]/80 text-sm">{analysisResult.balance_warning_message}</p>
                </div>
              )}

              <div className="bg-[#121215] rounded-xl border border-white/5 overflow-hidden">
                <div className="max-h-[400px] overflow-y-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 sticky top-0 backdrop-blur-md">
                      <tr>
                        <th className="p-4 w-12 cursor-pointer text-white/50 hover:text-white transition-colors" onClick={toggleAll}>
                          All
                        </th>
                        <th className="p-4 text-white/50">Status</th>
                        <th className="p-4 text-white/50">Data</th>
                        <th className="p-4 text-white/50 w-full">Descrição</th>
                        <th className="p-4 text-white/50 text-right">Valor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {analysisResult.analysis?.map((tx) => (
                        <tr
                          key={tx.fitid}
                          className={`hover:bg-white/[0.02] transition-opacity ${!selectedTxIds.has(tx.fitid) ? 'opacity-40' : ''}`}
                        >
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={selectedTxIds.has(tx.fitid)}
                              onChange={() => toggleSelection(tx.fitid)}
                              className="cursor-pointer"
                            />
                          </td>
                          <td className="p-4">
                            {tx.is_duplicate ? (
                              <span className="text-red-400 text-xs font-medium">Duplicado</span>
                            ) : (
                              <span className="text-green-400 text-xs font-medium">Novo</span>
                            )}
                          </td>
                          <td className="p-4 text-white/70 whitespace-nowrap">{formatDate(tx.date)}</td>
                          <td className="p-4 text-white">{tx.description}</td>
                          <td className={`p-4 text-right font-medium whitespace-nowrap ${
                            tx.type === 'CREDIT' || (tx.raw_amount && tx.raw_amount > 0)
                              ? 'text-green-400'
                              : 'text-white'
                          }`}>
                            {tx.type === 'DEBIT' ? '-' : '+'}{formatCurrency(tx.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {analysisResult && (
          <div className="p-5 border-t border-white/5 flex items-center justify-between bg-black/20">
            <div className="text-white/50 text-sm">
              <span className="text-white font-semibold">{selectedTxIds.size}</span> selecionadas
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="px-5 py-2 text-white/70 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCommit}
                disabled={isCommitting || selectedTxIds.size === 0}
                className="flex items-center gap-2 px-6 py-2 rounded-xl text-white bg-gradient-to-r from-[#F2910A] to-[#E85D04] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#F2910A]/20 transition-all"
              >
                {isCommitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                Confirmar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
