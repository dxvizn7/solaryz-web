import { useState } from 'react';
import { X, CreditCard, Calendar, PaintBucket, Hash } from 'lucide-react';
import { bankAccountsService } from '../services/bankAccountsService';
import type { CreditCard as ICreditCard } from '../types/bankAccount';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newCard: ICreditCard) => void;
  bankAccountId: number;
}

export function AddCreditCardModal({ isOpen, onClose, onSuccess, bankAccountId }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    limit: '',
    closing_day: '',
    due_day: '',
    account_ending: '',
    color: '#8A05BE',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        bank_account_id: bankAccountId,
        name: formData.name,
        limit: Number(formData.limit),
        closing_day: Number(formData.closing_day),
        due_day: Number(formData.due_day),
        account_ending: formData.account_ending,
        color: formData.color
      };

      const newCard = await bankAccountsService.createCreditCard(payload);
      onSuccess(newCard);
      onClose();
      
      setFormData({
        name: '', limit: '', closing_day: '', due_day: '', account_ending: '', color: '#8A05BE'
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Erro ao criar cartão. Verifique os dados.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleOverlayClick}
    >
      <div className="bg-[#18181b] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden scale-in-center">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/[0.02]">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CreditCard size={20} className="text-[#F2910A]" />
            Novo Cartão
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg mb-2">
              {error}
            </div>
          )}

          <div>
            <label className="text-white/70 text-sm font-medium mb-1.5 block">Nome do Cartão (ex: Nubank, C6)</label>
            <div className="relative">
              <input 
                required
                type="text"
                placeholder="Meu Cartão Black"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#F2910A]/50 transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-white/70 text-sm font-medium mb-1.5 block">Limite Total (R$)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-white/40 font-medium">R$</span>
              </div>
              <input 
                required
                type="number"
                step="0.01"
                min="0"
                placeholder="5000.00"
                value={formData.limit}
                onChange={e => setFormData({ ...formData, limit: e.target.value })}
                className="w-full bg-[#121212] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#F2910A]/50 transition-all font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/70 text-sm font-medium mb-1.5 block">Fechamento</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={14} className="text-white/40" />
                </div>
                <input 
                  required
                  type="number"
                  min="1" max="31"
                  placeholder="Dia"
                  value={formData.closing_day}
                  onChange={e => setFormData({ ...formData, closing_day: e.target.value })}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl pl-9 pr-3 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#F2910A]/50 transition-all font-medium"
                />
              </div>
            </div>
            <div>
              <label className="text-white/70 text-sm font-medium mb-1.5 block">Vencimento</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={14} className="text-white/40" />
                </div>
                <input 
                  required
                  type="number"
                  min="1" max="31"
                  placeholder="Dia"
                  value={formData.due_day}
                  onChange={e => setFormData({ ...formData, due_day: e.target.value })}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl pl-9 pr-3 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#F2910A]/50 transition-all font-medium"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-white/70 text-sm font-medium mb-1.5 block">Final do Cartão (4 digitos)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash size={14} className="text-white/40" />
                </div>
                <input 
                  required
                  type="text"
                  placeholder="ex: 1234"
                  value={formData.account_ending}
                  onChange={e => setFormData({ ...formData, account_ending: e.target.value })}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl pl-9 pr-3 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#F2910A]/50 transition-all font-medium"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-white/70 text-sm font-medium mb-1.5 block">Cor do Cartão</label>
              <div className="relative flex items-center border border-white/10 rounded-xl bg-[#121212] pr-1 h-[50px] overflow-hidden group hover:border-white/20 transition-all">
                <div className="absolute left-3 pointer-events-none">
                  <PaintBucket size={14} className="text-white/40 group-hover:text-white/60 transition-colors" />
                </div>
                <div className="flex-1 pl-9 font-mono text-sm uppercase text-white tracking-widest pointer-events-none">
                  {formData.color}
                </div>
                <input 
                  type="color"
                  value={formData.color}
                  onChange={e => setFormData({ ...formData, color: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer border-0 p-0 bg-transparent flex-shrink-0 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 mt-4 pt-2 border-t border-white/5">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl font-semibold text-white/70 bg-white/5 hover:bg-white/10 hover:text-white transition-all outline-none"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-solar-orange to-[#E85D04] hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:shadow-solar-orange/20 disabled:opacity-50 disabled:cursor-not-allowed outline-none"
            >
              {isLoading ? 'Salvando...' : 'Adicionar Cartão'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
