import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  PieChart,
  Plus,
  Activity
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

import { Transaction, Stock, TransactionType, FinancialSummary } from './types';
import { getFinancialAdvice } from './services/geminiService';
import { StatCard } from './components/StatCard';
import { AIAdvisor } from './components/AIAdvisor';

// Mock Data
const INITIAL_STOCKS: Stock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 1.25, holdings: 10 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 240.50, change: -0.85, holdings: 5 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 460.10, change: 2.15, holdings: 8 },
  { symbol: 'MSFT', name: 'Microsoft', price: 330.20, change: 0.45, holdings: 12 },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2023-10-01', description: 'Salario Mensual', amount: 3500, type: TransactionType.INCOME, category: 'Salario' },
  { id: '2', date: '2023-10-03', description: 'Alquiler', amount: 1200, type: TransactionType.EXPENSE, category: 'Vivienda' },
  { id: '3', date: '2023-10-05', description: 'Supermercado', amount: 150, type: TransactionType.EXPENSE, category: 'Alimentación' },
  { id: '4', date: '2023-10-10', description: 'Dividendo AAPL', amount: 45, type: TransactionType.INCOME, category: 'Inversiones' },
  { id: '5', date: '2023-10-12', description: 'Gimnasio', amount: 40, type: TransactionType.EXPENSE, category: 'Salud' },
];

const CHART_DATA = [
  { name: 'Ene', portfolio: 4000, sp500: 4100 },
  { name: 'Feb', portfolio: 4200, sp500: 4150 },
  { name: 'Mar', portfolio: 4100, sp500: 4200 },
  { name: 'Abr', portfolio: 4400, sp500: 4250 },
  { name: 'May', portfolio: 4600, sp500: 4300 },
  { name: 'Jun', portfolio: 4800, sp500: 4400 },
  { name: 'Jul', portfolio: 5100, sp500: 4450 },
];

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Calculate Summary Logic
  const summary = useMemo((): FinancialSummary => {
    const totalIncome = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    const stockValue = stocks.reduce((acc, curr) => acc + (curr.price * curr.holdings), 0);
    
    const cashBalance = totalIncome - totalExpenses;

    return {
      totalBalance: cashBalance + stockValue,
      monthlyIncome: totalIncome, // Simplified for demo
      monthlyExpenses: totalExpenses, // Simplified for demo
      portfolioValue: stockValue
    };
  }, [transactions, stocks]);

  const handleGetAdvice = async () => {
    setIsAiLoading(true);
    const advice = await getFinancialAdvice(transactions, stocks, summary);
    setAiAdvice(advice);
    setIsAiLoading(false);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(val);
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">FinanzasFlow</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex text-sm text-gray-500">
                <span>Última actualización: Hoy, 10:30 AM</span>
              </div>
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full"></span>
                <Activity className="h-5 w-5 text-gray-600" />
              </button>
              <img 
                src="https://picsum.photos/40/40" 
                alt="User" 
                className="h-9 w-9 rounded-full border-2 border-white shadow-sm"
              />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Summary Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Balance Total" 
            value={formatCurrency(summary.totalBalance)} 
            icon={<Wallet className="h-5 w-5" />}
            trend="+12.5%"
            trendUp={true}
          />
          <StatCard 
            title="Ingresos (Mes)" 
            value={formatCurrency(summary.monthlyIncome)} 
            icon={<ArrowUpRight className="h-5 w-5 text-emerald-600" />}
            trend="+5.2%"
            trendUp={true}
          />
          <StatCard 
            title="Gastos (Mes)" 
            value={formatCurrency(summary.monthlyExpenses)} 
            icon={<ArrowDownRight className="h-5 w-5 text-rose-600" />}
            trend="-2.4%"
            trendUp={false} // false means "bad" usually, but here spending down is good. Logic depends on preference.
          />
          <StatCard 
            title="Valor Portafolio" 
            value={formatCurrency(summary.portfolioValue)} 
            icon={<TrendingUp className="h-5 w-5 text-indigo-600" />}
            trend="+8.1%"
            trendUp={true}
            colorClass="bg-indigo-50 border-indigo-100"
          />
        </div>

        {/* AI & Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Left Column: AI + Charts */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* AI Advisor Component */}
            <AIAdvisor 
              loading={isAiLoading}
              advice={aiAdvice}
              onGenerate={handleGetAdvice}
            />

            {/* Stock Evolution Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Evolución de Inversiones</h2>
                  <p className="text-sm text-gray-500">Comparativa Portafolio vs Mercado</p>
                </div>
                <div className="flex gap-2">
                  <span className="flex items-center text-xs text-gray-500">
                    <span className="w-3 h-3 rounded-full bg-indigo-500 mr-1"></span> Tu Portafolio
                  </span>
                  <span className="flex items-center text-xs text-gray-500">
                    <span className="w-3 h-3 rounded-full bg-gray-300 mr-1"></span> Mercado
                  </span>
                </div>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CHART_DATA}>
                    <defs>
                      <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="portfolio" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorPortfolio)" />
                    <Area type="monotone" dataKey="sp500" stroke="#cbd5e1" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Column: Investments List */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Mis Acciones</h2>
                <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">Ver Todo</button>
              </div>
              <div className="space-y-4">
                {stocks.map((stock) => (
                  <div key={stock.symbol} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                        {stock.symbol[0]}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{stock.symbol}</h4>
                        <p className="text-xs text-gray-500">{stock.holdings} acciones</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900 text-sm">{formatCurrency(stock.price)}</div>
                      <div className={`text-xs font-medium ${stock.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                 <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Distribución</h3>
                 <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 bg-indigo-500 rounded-full w-[45%]"></div>
                    <div className="h-2 bg-purple-500 rounded-full w-[30%]"></div>
                    <div className="h-2 bg-emerald-500 rounded-full w-[25%]"></div>
                 </div>
                 <div className="flex justify-between text-xs text-gray-400">
                    <span>Tecnología</span>
                    <span>Automotriz</span>
                    <span>Energía</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Movimientos Recientes</h2>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
              <Plus className="h-4 w-4" />
              Nueva Transacción
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${t.type === TransactionType.INCOME ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                          <DollarSign className="h-4 w-4" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{t.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {t.category}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-gray-900'}`}>
                      {t.type === TransactionType.INCOME ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-xs text-gray-400">Completado</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
