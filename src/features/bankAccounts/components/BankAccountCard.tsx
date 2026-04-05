import { useState } from 'react';
import { Plus, Lock, Upload, Hash, Wallet, MoreVertical, WalletCards } from 'lucide-react';
import type { BankAccount, PlanInfo, CreditCard } from '../types/bankAccount';
import { AddCreditCardModal } from './AddCreditCardModal';
import { OfxImportModal } from './OfxImportModal';
import { useNotification } from '../../../contexts/NotificationContext';

interface Props {
  account: BankAccount;
  planInfo: PlanInfo;
  onCardAdded: () => void; // Trigger refresh
  onDeleteAccount: (id: number) => void;
}

export function BankAccountCard({ account, planInfo, onCardAdded, onDeleteAccount }: Props) {
  const { addNotification } = useNotification();
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [ofxModalConfig, setOfxModalConfig] = useState<{ isOpen: boolean; type: 'account' | 'credit_card'; id: number }>({ isOpen: false, type: 'credit_card', id: 0 });

  const canAddCard = planInfo?.features?.unlimited_cards || 
                     ((planInfo?.usage?.credit_cards?.used ?? 0) < (planInfo?.usage?.credit_cards?.limit ?? 999));

  const handleImportOFX = (card: CreditCard) => {
    if (!planInfo.features.import_ofx) {
      addNotification({ type: 'warning', message: 'Faça upgrade para importar OFX' });
      return;
    }
    setOfxModalConfig({ isOpen: true, type: 'credit_card', id: card.id });
  };

  const getAccountTypeLabel = (type: string) => {
    switch(type) {
      case 'checking': return 'Conta Corrente';
      case 'savings': return 'Conta Poupança';
      case 'investment': return 'Conta Investimento';
      default: return 'Conta';
    }
  };

  return (
    <div className="bg-[#1C1C21] rounded-2xl border border-white/5 overflow-hidden flex flex-col group relative transition-all hover:border-[#F2910A]/30 w-full mb-6 relative">
      
      {/* Settings Dropdown */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={() => setShowOptions(!showOptions)}
          className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors"
        >
          <MoreVertical size={18} />
        </button>
        
        {showOptions && (
          <div className="absolute right-0 mt-1 w-40 bg-[#2C2D34] border border-white/5 shadow-2xl rounded-xl overflow-hidden py-1 z-20">
            <button 
              onClick={() => {
                setShowOptions(false);
                onDeleteAccount(account.id);
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors"
            >
              Excluir Conta
            </button>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="p-6 bg-gradient-to-br from-white/[0.03] to-transparent flex items-start gap-4 border-b border-white/5">
        <div className="bg-gradient-to-br from-[#F2910A]/20 to-[#E85D04]/10 border border-[#F2910A]/20 w-12 h-12 rounded-xl flex items-center justify-center text-[#F2910A] shrink-0">
          <Wallet size={24} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-white">{account.name}</h3>
            <span className="bg-white/5 rounded px-2 py-0.5 text-[10px] font-medium text-white/50 uppercase tracking-wider">
              {getAccountTypeLabel(account.type)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <Hash size={14} />
             {account.bank_identifier || 'Banco'}
          </div>
        </div>
        <div className="text-right pr-6">
          <div className="text-sm font-medium text-white/40 mb-1">Saldo em Conta</div>
          <div className="text-xl font-bold text-white tracking-tight">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
              Number(account.current_balance ?? account.initial_balance ?? 0)
            )}
          </div>
        </div>
      </div>

      {/* Cards List Body */}
      <div className="p-6">
        <h4 className="text-sm font-semibold text-white/60 mb-4 flex items-center gap-2 uppercase tracking-wider">
          <WalletCards size={16} /> Cartões Vinculados
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {(!account.credit_cards || account.credit_cards.length === 0) ? (
            <div className="col-span-full py-8 text-center bg-white/[0.02] rounded-xl border border-white/5 border-dashed">
              <p className="text-white/40 text-sm">Nenhum cartão vinculado a esta conta.</p>
            </div>
          ) : (
            account.credit_cards.map(card => (
              <div key={card.id} className="relative group/card cursor-pointer isolate overflow-hidden rounded-xl bg-gradient-to-br from-[#121215] to-[#1A1A20] p-[1px] transition-all hover:shadow-xl hover:shadow-[#F2910A]/5">
                <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />
                <div className="relative z-10 flex h-full flex-col justify-between rounded-xl bg-[#1C1C21] p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                       <div 
                         className="w-8 h-5 rounded overflow-hidden relative shadow"
                         style={{ backgroundColor: card.color || '#F2910A' }}
                       >
                         <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/20 mix-blend-overlay"></div>
                       </div>
                       <span className="text-white font-medium">{card.name}</span>
                    </div>
                    {card.account_ending && (
                      <span className="text-xs font-mono text-white/40">•• {card.account_ending}</span>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-xs text-white/40 mb-1">Limite Total</div>
                    <div className="text-white font-semibold">R$ {card.limit}</div>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <div className="text-[10px] text-white/40 uppercase tracking-widest">
                      Venc: {card.due_day}
                    </div>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleImportOFX(card); }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 text-xs font-medium transition-colors ${
                        planInfo.features.import_ofx 
                          ? 'text-[#F2910A] hover:bg-[#F2910A]/10' 
                          : 'text-white/30 hover:bg-white/10'
                      }`}
                      title={planInfo.features.import_ofx ? "Importar fatura .ofx" : "Importação de OFX bloqueada no plano atual"}
                    >
                      {planInfo.features.import_ofx ? <Upload size={14} /> : <Lock size={14} />}
                      OFX
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer Add Card */}
      <div className="p-4 border-t border-white/5 bg-black/20 flex justify-center">
        <button 
          onClick={() => canAddCard ? setIsAddCardModalOpen(true) : addNotification({ type: 'warning', message: 'Limite de cartões do plano atingido. Faça o upgrade!' })}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${
            canAddCard 
              ? 'text-white bg-white/5 hover:bg-[#F2910A] hover:shadow-lg hover:shadow-[#F2910A]/20 hover:-translate-y-0.5' 
              : 'text-white/30 bg-white/5 cursor-not-allowed'
          }`}
        >
          {canAddCard ? <Plus size={18} /> : <Lock size={18} className="text-white/20" />}
          Novo Cartão
        </button>
      </div>

      {/* Add Credit Card Modal Form */}
      <AddCreditCardModal 
        isOpen={isAddCardModalOpen} 
        onClose={() => setIsAddCardModalOpen(false)} 
        onSuccess={() => {
          setIsAddCardModalOpen(false);
          onCardAdded();
        }}
        bankAccountId={account.id}
      />

      {/* OFX Import Modal */}
      <OfxImportModal
        isOpen={ofxModalConfig.isOpen}
        onClose={() => setOfxModalConfig(prev => ({ ...prev, isOpen: false }))}
        destinationType={ofxModalConfig.type}
        destinationId={ofxModalConfig.id}
        onSuccess={() => {
          onCardAdded();
        }}
      />
    </div>
  );
}
