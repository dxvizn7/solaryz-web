import { useState } from 'react';
import { PluggyConnect } from 'react-pluggy-connect';

export const PluggyConnectButton = () => {
    const [token, setToken] = useState<string | null>(null);

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
                console.error("Token não recebido:", data);
            }
        } catch (e) {
            console.error("Erro ao buscar connect token", e);
        }
    };

    // 2. Função chamada quando o usuário termina de conectar no Widget
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
                alert("Conta conectada e salva no SolariZ!");
            }
        } catch (e) {
            console.error("Erro ao salvar conta no backend", e);
        } finally {
            setToken(null); // Fecha o widget
        }
    };

    return (
        <>
            <button 
                onClick={handleGenerateToken}
                className="bg-gradient-to-r from-solar-orange to-solar-yellow text-white font-bold rounded-xl w-40 hover:opacity-90 transition-opacity shadow-lg shadow-[#F2910A]/30"
            >
                Conectar Banco
            </button>

            {token && (
                <PluggyConnect
                    connectToken={token}
                    onSuccess={handleSuccess}
                    onError={(error) => console.error("Erro no Widget:", error)}
                    onClose={() => setToken(null)}
                />
            )}
        </>
    );
};