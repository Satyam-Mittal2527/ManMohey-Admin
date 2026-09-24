import React, { useEffect, useState } from 'react';
import LineChart from '../../charts/LineChart02';
import { getOrders } from '../../api/orders';
import { getCssVariable } from '../../utils/Utils';

function DashboardCard14() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    getOrders()
      .then((result) => {
        if (active) setOrders(Array.isArray(result) ? result : result.data || []);
      })
      .catch(() => {
        if (active) setError('Unable to load revenue analytics');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (5 - index));
    return date;
  });

  const monthlyRevenue = months.map((month) => orders
    .filter((order) => {
      const createdAt = new Date(order.created_at);
      return createdAt.getFullYear() === month.getFullYear()
        && createdAt.getMonth() === month.getMonth()
        && order.status !== 'CANCELLED';
    })
    .reduce((total, order) => total + Number(order.total_amount || 0), 0));

  const totalRevenue = monthlyRevenue.reduce((total, revenue) => total + revenue, 0);
  const chartData = {
    labels: months.map((month) => `${String(month.getMonth() + 1).padStart(2, '0')}-01-${month.getFullYear()}`),
    datasets: [{
      label: 'Revenue',
      data: monthlyRevenue,
      borderColor: getCssVariable('--color-green-500'),
      fill: false,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 3,
      pointBackgroundColor: getCssVariable('--color-green-500'),
      pointHoverBackgroundColor: getCssVariable('--color-green-500'),
      pointBorderWidth: 0,
      pointHoverBorderWidth: 0,
      clip: 20,
      tension: 0.2,
    }],
  };

  return (
    <div className="flex flex-col col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Revenue over time</h2>
      </header>
      {error && <p className="px-5 pt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
      <LineChart
        key={orders.length}
        data={chartData}
        width={595}
        height={248}
        summary={loading ? '...' : `$${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
        change="Last 6 months"
        changeTone="positive"
      />
    </div>
  );
}

export default DashboardCard14;
