import { Layout } from './components/Layout';
import { AccountSummary } from './features/dashboard/components/AccountSummary';

function App() {
  return (
    <Layout>
      <div className="flex gap-6 items-start">
        <AccountSummary />
      </div>
    </Layout>
  )
}

export default App