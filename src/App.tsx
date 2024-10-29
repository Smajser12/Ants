import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ConnectPage } from './components/ConnectPage';
import { MultiChainProvider } from './MultiChainProvider/MultiChainProvider';
import { WagmiContext } from './Context/WagmiContext';
import { AntProvider } from './components/context/antContext';
import { LangtonAntMatrix } from './components/langton-ant-matrix';
// import { ProtectedRoute } from './components/ProtectedRoute';
// import { MatrixRain } from './components/matrix-crypto-terminal';

function App() {
  return (
    <Router>
      <WagmiContext>
        <MultiChainProvider>
          <AntProvider>
            <div className="relative w-screen h-screen overflow-hidden">
              <div className="absolute inset-0 z-10">
                <Routes>
                  <Route path="/connect" element={<ConnectPage />} />
                  <Route
                    path="/"
                    element={
                      // <ProtectedRoute>
                        <LangtonAntMatrix />
                      // </ProtectedRoute>
                    }
                  />
                </Routes>
              </div>
            </div>
          </AntProvider>
        </MultiChainProvider>
      </WagmiContext>
    </Router>
  );
}

export default App;
