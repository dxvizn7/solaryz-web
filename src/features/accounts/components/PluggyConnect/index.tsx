import { useState } from 'react';
import { PluggyConnect } from 'react-pluggy-connect';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/contexts/AuthContext';
import { useNotification } from '../../../../contexts/NotificationContext';

export const PluggyConnectButton = () => {
    const { addNotification } = useNotification();
    const [token, setToken] = useState<string | null>(null);
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    const handleGenerateToken = async () => {
        try {
            const response = await fetch('http://localhost:8000/solaryz/pluggy/connect-token', {
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('@SolaryZ:token')}`,
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();
            
            if (data.token) {
                setToken(data.token);
            } else {
                addNotification({ type: 'error', message: 'Token não recebido.' });
            }
        } catch (e) {
            addNotification({ type: 'error', message: 'Erro ao buscar connect token.' });
        }
    };

    const handleSuccess = async (itemData: { item: { id: string } }) => {
        try {
            const response = await fetch('http://localhost:8000/solaryz/bank-accounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('@SolaryZ:token')}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ pluggy_item_id: itemData.item.id })
            });

            if (response.ok) {
                const currentUser = user || JSON.parse(localStorage.getItem('@SolaryZ:user') || '{}');
                const updatedUser = { ...currentUser, has_connected_account: true };

                // Atualiza o contexto E o localStorage antes de navegar
                updateUser(updatedUser);

                // Navega via React Router (sem hard reload)
                navigate('/dashboard');
            }
        } catch (e) {
            addNotification({ type: 'error', message: 'Erro ao salvar conta no backend.' });
        } finally {
            setToken(null);
        }
    };

    return (
        <>
            <button 
                onClick={handleGenerateToken}
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-solar-orange to-[#E85D04] text-white font-bold rounded-xl px-10 py-4 hover:opacity-90 transition-opacity shadow-lg shadow-[#F2910A]/30 w-full max-w-sm text-lg"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                
                Conectar minha conta bancária
                
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>

            {token && (
                <PluggyConnect
                    connectToken={token}
                    onSuccess={handleSuccess}
                    onError={() => addNotification({ type: 'error', message: 'Erro no Widget da Pluggy.' })}
                    onClose={() => setToken(null)}
                />
            )}
        </>
    );
};