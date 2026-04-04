import { useState } from 'react';
import { X, Wallet, Hash, Activity } from 'lucide-react';
import { bankAccountsService } from '../services/bankAccountsService';
import type { BankAccount, CreateBankAccountDTO } from '../types/bankAccount';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newAccount: BankAccount) => void;
}

export function AddBankAccountModal({ isOpen, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState<CreateBankAccountDTO>({
    name: '',
    type: 'checking',
    bank_identifier: '',
    initial_balance: 0,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const payload: CreateBankAccountDTO = {
        ...formData,
        initial_balance: Number(formData.initial_balance)
      };

      const newAccount = await bankAccountsService.createAccount(payload);
      onSuccess(newAccount);
      onClose();
      
      setFormData({
        name: '', type: 'checking', bank_identifier: '', initial_balance: 0
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Erro ao criar conta. Verifique os dados.');
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
            <Wallet size={20} className="text-[#F2910A]" />
            Nova Conta Bancária
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
            <label className="text-white/70 text-sm font-medium mb-1.5 block">Nome da Instituição (ex: Nubank, Itaú)</label>
            <div className="relative">
              <input 
                required
                type="text"
                placeholder="Minha Conta"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#F2910A]/50 transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-white/70 text-sm font-medium mb-1.5 block">Identificador (Logotipo / Banco)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hash size={14} className="text-white/40" />
              </div>
              <input 
                required
                type="text"
                placeholder="ex: nubank"
                value={formData.bank_identifier}
                onChange={e => setFormData({ ...formData, bank_identifier: e.target.value })}
                className="w-full bg-[#121212] border border-white/10 rounded-xl pl-9 pr-3 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#F2910A]/50 transition-all font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/70 text-sm font-medium mb-1.5 block">Tipo da Conta</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Activity size={14} className="text-white/40" />
                </div>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as CreateBankAccountDTO['type'] })}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl pl-9 pr-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#F2910A]/50 transition-all font-medium appearance-none"
                >
                  <option value="checking">Conta Corrente</option>
                  <option value="savings">Poupança</option>
                  <option value="investment">Investimento</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-white/70 text-sm font-medium mb-1.5 block">Saldo Inicial (R$)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-white/40 font-medium">R$</span>
                </div>
                <input 
                  required
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.initial_balance}
                  onChange={e => setFormData({ ...formData, initial_balance: parseFloat(e.target.value) })}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl pl-9 pr-3 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#F2910A]/50 transition-all font-medium"
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
              {isLoading ? 'Salvando...' : 'Adicionar Conta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
