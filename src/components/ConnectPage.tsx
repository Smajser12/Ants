import { useEffect } from 'react';
import { MatrixRain } from './matrix-crypto-terminal';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';

export function ConnectPage() {
  const { isConnected } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (isConnected) {
      navigate('/');
    }
  }, [isConnected, navigate]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <MatrixRain />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black bg-opacity-50 p-8 rounded-lg border border-green-500">
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <button
                onClick={openConnectModal}
                className="px-6 py-3 bg-green-500 text-black font-bold rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-lg"
              >
                Connect to the Matrix
              </button>
            )}
          </ConnectButton.Custom>
        </div>
      </div>
    </div>
  );
}
