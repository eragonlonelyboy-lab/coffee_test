import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SalesReportRow, PopularItemReportRow } from '../types';
import { outlets } from '../data/mockData';
import { drinks } from '../data/mockData';

const AdminReportsPage: React.FC = () => {
    const { token } = useAuth();
    
    // State for Sales Report
    const [salesData, setSalesData] = useState<SalesReportRow[]>([]);
    const [salesLoading, setSalesLoading] = useState(true);
    const [salesError, setSalesError] = useState<string | null>(null);

    // State for Popular Items Report
    const [popularData, setPopularData] = useState<PopularItemReportRow[]>([]);
    const [popularLoading, setPopularLoading] = useState(true);
    const [popularError, setPopularError] = useState<string | null>(null);

    // Date range for sales report
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return date.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
    
    const fetchSalesData = useCallback(async () => {
        if (!token) return;
        setSalesLoading(true);
        setSalesError(null);
        try {
            const response = await fetch(`/api/reports/sales?from=${startDate}&to=${endDate}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch sales report');
            const data = await response.json();
            
            // Map storeId to storeName using mock data
            const enrichedData = data.report.map((row: SalesReportRow) => ({
                ...row,
                storeName: outlets.find(o => o.id === row.storeId)?.name || 'Unknown Store'
            }));
            setSalesData(enrichedData);
        } catch (err: any) {
            setSalesError(err.message);
        } finally {
            setSalesLoading(false);
        }
    }, [token, startDate, endDate]);

    const fetchPopularData = useCallback(async () => {
        if (!token) return;
        setPopularLoading(true);
        setPopularError(null);
        try {
            const response = await fetch(`/api/reports/popular-items?limit=10`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch popular items');
            const data = await response.json();
            
            // Map menuItemId to itemName using mock data
            // FIX: The API response key is 'items', not 'data'.
            const enrichedData = data.items.map((row: PopularItemReportRow) => {
                const drink = drinks.find(d => d.id === row.menuItemId);
                return {
                    ...row,
                    itemName: drink?.name || 'Unknown Item',
                    itemImage: drink?.imageUrls[0] || 'https://picsum.photos/seed/unknown/100/100'
                }
            });
            setPopularData(enrichedData);
        } catch (err: any) {
            setPopularError(err.message);
        } finally {
            setPopularLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchSalesData();
        fetchPopularData();
    }, [fetchSalesData, fetchPopularData]);
    
    const handleDateChange = () => {
        fetchSalesData();
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Admin Reports</h1>
                <p className="text-gray-500 dark:text-gray-400">Key business metrics and performance.</p>
            </div>

            {/* Sales Report Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Sales Report</h2>
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                    <div className="w-full sm:w-auto">
                        <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Start Date</label>
                        <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"/>
                    </div>
                     <div className="w-full sm:w-auto">
                        <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 dark:text-gray-200">End Date</label>
                        <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"/>
                    </div>
                    <button onClick={handleDateChange} className="w-full sm:w-auto self-end px-4 py-2 bg-brand-600 text-white font-semibold rounded-md hover:bg-brand-700 transition-colors">
                        Generate Report
                    </button>
                </div>
                {salesLoading ? <p>Loading sales data...</p> : salesError ? <p className="text-red-500">{salesError}</p> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-2 font-semibold">Store</th>
                                    <th className="px-4 py-2 font-semibold text-right">Orders</th>
                                    <th className="px-4 py-2 font-semibold text-right">Total Sales</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                {salesData.map(row => (
                                    <tr key={row.storeId}>
                                        <td className="px-4 py-2 font-medium">{row.storeName}</td>
                                        <td className="px-4 py-2 text-right">{row._count.id}</td>
                                        <td className="px-4 py-2 text-right">${(row._sum.totalAmount ?? 0).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Popular Items Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Top 10 Popular Items</h2>
                {popularLoading ? <p>Loading popular items...</p> : popularError ? <p className="text-red-500">{popularError}</p> : (
                    <ul className="space-y-3">
                        {popularData.map((item, index) => (
                            <li key={item.menuItemId} className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <span className="font-bold text-lg text-gray-400 w-6">{index + 1}</span>
                                <img src={item.itemImage} alt={item.itemName} className="w-12 h-12 rounded-md object-cover"/>
                                <span className="font-medium flex-grow">{item.itemName}</span>
                                <span className="font-semibold text-lg">{item._sum.quantity?.toLocaleString()} <span className="text-sm font-normal text-gray-500">sold</span></span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AdminReportsPage;