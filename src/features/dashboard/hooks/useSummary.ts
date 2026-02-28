import { useAccounts } from '../../accounts/hooks/useAccounts';

export function useSummary() {
  const { accounts, isLoading } = useAccounts();

  const totalBalance = accounts.reduce((acc, account) => {
    return acc + Number(account.balance);
  }, 0);

  return {
    totalBalance,
    isLoading
  };
}