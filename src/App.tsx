import { Header, Notification } from './components';
import { Main } from './Main';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Notification />
      <Header />
      <main className="p-4">
        <div className="container max-w-full">
          <Main />
        </div>
      </main>
    </div>
  );
}

export default App;
