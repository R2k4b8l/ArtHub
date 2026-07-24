'use client'

import React, { useState, useEffect } from 'react';
import { getTransactions } from '@/lib/data';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';


const AdminDashboardTransaction = () => {
  const [filter, setFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 11;
  const [transactions, setTransactions] = useState([]);
const [loading, setLoading] = useState(true);


  const filteredData = filter === 'All' ? transactions : transactions.filter(t => t.type === filter);
  
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleFilterChange = (type) => {
    setFilter(type);
    setCurrentPage(1);
  };
  useEffect(() => {
  const loadTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error("Failed to load transactions", error);
    } finally {
      setLoading(false);
    }
  };

  loadTransactions();
}, []);

if (loading) {
  return (
    <div className="w-full flex justify-center items-center p-10 text-gray-500">
      Loading transactions...
    </div>
  );
}

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 bg-white shadow-sm rounded-xl border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-500 text-sm">Monitor and manage all marketplace financial activities.</p>
        </div>
        
        <div className="flex gap-2">
          {['All', 'Subscription', 'Purchase'].map((item) => (
            <button
              key={item}
              onClick={() => handleFilterChange(item)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === item ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
              <th className="pb-4 font-semibold">Transaction ID</th>
              <th className="pb-4 font-semibold">Type</th>
              <th className="pb-4 font-semibold">Email</th>
              <th className="pb-4 font-semibold">Amount</th>
              <th className="pb-4 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {currentData?.map((tx) => (
              <tr key={tx.transactionId} className="hover:bg-gray-50 transition-colors">
                <td className="py-5 font-medium text-gray-900">{tx.transactionId}</td>
                <td className="py-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    tx.type === 'Purchase' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>● {tx.type}</span>
                </td>
                <td className="py-5 text-gray-600 truncate max-w-[200px]">{tx.email}</td>
                <td className="py-5 font-bold text-gray-900">{tx.amount}</td>
                <td className="py-5 text-gray-500">{tx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50"
          >
            <FiChevronLeft />
          </button>
          <span className="text-sm font-medium text-gray-600">Page {currentPage} of {totalPages}</span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50"
          >
            <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardTransaction;