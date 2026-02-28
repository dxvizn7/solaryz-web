import { useState, useEffect } from 'react';
import { getAccounts, type Account } from '../services/accountsService';

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAccounts()
      .then((data) => {
        console.log("DADOS QUE CHEGARAM DA API:", data); 
        setAccounts(data);
      })
      .catch((error) => console.error("Erro ao buscar contas:", error))
      .finally(() => setIsLoading(false));
  }, []);

  console.log("contas no react:", accounts);

  const totalBalance = accounts.reduce((acc, account) => acc + Number(account.balance), 0);

  return { accounts, totalBalance, isLoading };
}