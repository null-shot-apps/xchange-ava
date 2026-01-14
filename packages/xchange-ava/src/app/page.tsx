'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';

const TOKENS = [
  { symbol: 'ETH', name: 'Ethereum', address: null, decimals: 18 },
  { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
  { symbol: 'USDT', name: 'Tether', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 },
  { symbol: 'DAI', name: 'Dai', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18 },
];

export default function TokenExchange() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });

  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[1]);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);

  const handleSwap = async () => {
    if (!fromAmount || !isConnected) return;
    
    setIsSwapping(true);
    // Simulate swap delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSwapping(false);
    
    // Reset form
    setFromAmount('');
    setToAmount('');
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    // Simple 1:1 mock conversion for demo
    if (value) {
      const mockRate = fromToken.symbol === 'ETH' ? 2000 : 1;
      setToAmount((parseFloat(value) * mockRate).toFixed(6));
    } else {
      setToAmount('');
    }
  };

  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">XChange</h1>
          
          {!isConnected ? (
            <button
              onClick={() => connect({ connector: connectors[0] })}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-400">Balance</div>
                <div className="text-white font-medium">
                  {balance ? `${parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4)} ${balance.symbol}` : '0.00'}
                </div>
              </div>
              <button
                onClick={() => disconnect()}
                className="px-4 py-2 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all"
              >
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Swap Tokens</h2>
          
          {/* From Token */}
          <div className="bg-white/5 rounded-xl p-4 mb-2">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-gray-400">From</label>
              {isConnected && (
                <span className="text-sm text-gray-400">Balance: 0.00</span>
              )}
            </div>
            <div className="flex gap-3">
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                placeholder="0.0"
                className="flex-1 bg-transparent text-white text-2xl outline-none"
                disabled={!isConnected}
              />
              <select
                value={fromToken.symbol}
                onChange={(e) => setFromToken(TOKENS.find(t => t.symbol === e.target.value)!)}
                className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-white/20 transition-all outline-none"
              >
                {TOKENS.map(token => (
                  <option key={token.symbol} value={token.symbol} className="bg-slate-800">
                    {token.symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Switch Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              onClick={switchTokens}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* To Token */}
          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-gray-400">To</label>
              {isConnected && (
                <span className="text-sm text-gray-400">Balance: 0.00</span>
              )}
            </div>
            <div className="flex gap-3">
              <input
                type="number"
                value={toAmount}
                readOnly
                placeholder="0.0"
                className="flex-1 bg-transparent text-white text-2xl outline-none"
              />
              <select
                value={toToken.symbol}
                onChange={(e) => setToToken(TOKENS.find(t => t.symbol === e.target.value)!)}
                className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-white/20 transition-all outline-none"
              >
                {TOKENS.map(token => (
                  <option key={token.symbol} value={token.symbol} className="bg-slate-800">
                    {token.symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          {!isConnected ? (
            <button
              onClick={() => connect({ connector: connectors[0] })}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Connect Wallet to Swap
            </button>
          ) : (
            <button
              onClick={handleSwap}
              disabled={!fromAmount || isSwapping}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSwapping ? 'Swapping...' : 'Swap'}
            </button>
          )}

          {/* Info */}
          {fromAmount && toAmount && (
            <div className="mt-4 p-4 bg-white/5 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Rate</span>
                <span className="text-white">1 {fromToken.symbol} = {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(2)} {toToken.symbol}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Network Fee</span>
                <span className="text-white">~$2.50</span>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 text-center">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-white font-medium text-sm">Fast Swaps</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 text-center">
            <div className="text-2xl mb-2">🔒</div>
            <div className="text-white font-medium text-sm">Secure</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 text-center">
            <div className="text-2xl mb-2">💎</div>
            <div className="text-white font-medium text-sm">Best Rates</div>
          </div>
        </div>
      </main>
    </div>
  );
}

