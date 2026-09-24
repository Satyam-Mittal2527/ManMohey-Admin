import React, { useEffect, useState } from 'react';
import LineChart from '../../charts/LineChart02';
import { getOrders } from '../../api/orders';

// Import utilities
import { getCssVariable } from '../../utils/Utils';

function DashboardCard08() {

  const [orders, setOrders] = useState([]);
  const [range, setRange] = useState(6);
  const [series, setSeries] = useState('received');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    getOrders()
      .then((result) => {
        if (active) setOrders(Array.isArray(result) ? result : result.data || []);
      })
      .catch(() => {
        if (active) setError('Unable to load order analytics');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const months = Array.from({ length: range }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (range - index - 1));
    return date;
  });

  const monthlyCounts = months.map((month) => orders.filter((order) => {
    const createdAt = new Date(order.created_at);
    return createdAt.getFullYear() === month.getFullYear()
      && createdAt.getMonth() === month.getMonth()
      && (series === 'received' || order.status === 'DELIVERED');
  }).length);

  const total = monthlyCounts.reduce((sum, count) => sum + count, 0);
  const previousStart = new Date(months[0]);
  previousStart.setMonth(previousStart.getMonth() - range);
  const previousTotal = orders.filter((order) => {
    const createdAt = new Date(order.created_at);
    return createdAt >= previousStart
      && createdAt < months[0]
      && (series === 'received' || order.status === 'DELIVERED');
  }).length;
  const change = previousTotal === 0 ? (total ? '+100%' : '0%') : `${total >= previousTotal ? '+' : ''}${Math.round(((total - previousTotal) / previousTotal) * 100)}%`;

  const chartData = {
    labels: months.map((month) => `${String(month.getMonth() + 1).padStart(2, '0')}-01-${month.getFullYear()}`),
    datasets: [
      {
        label: series === 'received' ? 'Received orders' : 'Delivered orders',
        data: monthlyCounts,
        borderColor: getCssVariable('--color-violet-500'),
        fill: false,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: getCssVariable('--color-violet-500'),
        pointHoverBackgroundColor: getCssVariable('--color-violet-500'),
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Order activity</h2>
        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">By order creation month</span>
      </header>
      <div className="px-5 pt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700/50" role="tablist" aria-label="Order type">
          {['received', 'delivered'].map((value) => (
            <button key={value} type="button" role="tab" aria-selected={series === value} onClick={() => setSeries(value)} className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize ${series === value ? 'bg-white text-gray-800 shadow-xs dark:bg-gray-600 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
              {value}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1" role="tablist" aria-label="Time range">
          {[6, 12].map((value) => (
            <button key={value} type="button" role="tab" aria-selected={range === value} onClick={() => setRange(value)} className={`px-2.5 py-1 text-xs font-medium rounded-md ${range === value ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300' : 'text-gray-500 dark:text-gray-400'}`}>
              {value}m
            </button>
          ))}
        </div>
      </div>
      {error && <p className="px-5 pt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      <LineChart key={`${series}-${range}-${orders.length}`} data={chartData} width={595} height={248} summary={loading ? '...' : String(total)} change={loading ? '' : change} changeTone={change.startsWith('+') ? 'positive' : 'negative'} />
    </div>
  );
}

export default DashboardCard08;
