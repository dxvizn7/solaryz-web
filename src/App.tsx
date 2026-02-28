import { Layout } from './components/Layout';
import { AccountSummary } from './features/dashboard/components/AccountSummary';
import { AccountList } from './features/accounts/components/AccountList';

function App() {
  return (
    <Layout>
      <div className="flex gap-6 items-start">
        <AccountSummary />
      </div>
      <AccountList />
    </Layout>
  )
}

export default App