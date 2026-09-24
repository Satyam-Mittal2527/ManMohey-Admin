import React, { useEffect, useState } from 'react';
import DoughnutChart from '../../charts/DoughnutChart';
import { getOrders } from '../../api/orders';
import { getCssVariable } from '../../utils/Utils';

const statuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

function DashboardCard15() {
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
        if (active) setError('Unable to load order status analytics');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const statusCounts = statuses.map((status) => orders.filter((order) => order.status === status).length);
  const chartData = {
    labels: statuses.map((status) => status.charAt(0) + status.slice(1).toLowerCase()),
    datasets: [{
      label: 'Orders',
      data: statusCounts,
      backgroundColor: [
        getCssVariable('--color-amber-500'),
        getCssVariable('--color-sky-500'),
        getCssVariable('--color-violet-500'),
        getCssVariable('--color-green-500'),
        getCssVariable('--color-red-500'),
      ],
      hoverBackgroundColor: [
        getCssVariable('--color-amber-600'),
        getCssVariable('--color-sky-600'),
        getCssVariable('--color-violet-600'),
        getCssVariable('--color-green-600'),
        getCssVariable('--color-red-600'),
      ],
      borderWidth: 0,
    }],
  };

  return (
    <div className="flex flex-col col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Order status mix</h2>
      </header>
      {error && <p className="px-5 pt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
      {loading ? (
        <div className="h-[300px] flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">Loading order statuses...</div>
      ) : (
        <DoughnutChart key={orders.length} data={chartData} width={389} height={230} />
      )}
    </div>
  );
}

export default DashboardCard15;
