import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { ConfigureBackup } from './pages/ConfigureBackup';
import { PerformBackup } from './pages/PerformBackup';
import { ExecutionHistory } from './pages/ExecutionHistory';

function App() {
  return (
    <Router>
      <div className="container">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/configure" element={<ConfigureBackup />} />
            <Route path="/perform" element={<PerformBackup />} />
            <Route path="/history" element={<ExecutionHistory />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
