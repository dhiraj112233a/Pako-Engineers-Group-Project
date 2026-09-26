import React, { useState } from 'react';
import { ChevronDown, Edit2, Trash2 } from 'lucide-react';

const CustomerEnquiry = () => {
  const [enquiries] = useState([
    { id: 1, enquiryNo: 'ENQ-0019', customer: 'LARSON & TOUBRO LIMITED', date: '2026-07-02', days: '0', priority: 'High', status: 'Quoted' },
    { id: 2, enquiryNo: 'ENQ-0018', customer: 'BHAGAT FORGE', date: '2026-01-06', days: '4', priority: 'High', status: 'Quoted' },
    { id: 3, enquiryNo: 'ENQ-0017', customer: 'JPTI LTD', date: '2026-07-03', days: '17', priority: 'High', status: 'Quoted' },
    { id: 4, enquiryNo: 'ENQ-0016', customer: 'NARAYAN ENGINEERING', date: '2026-01-22', days: '1', priority: 'Medium', status: 'Quoted' },
    { id: 5, enquiryNo: 'ENQ-0015', customer: 'IKWAT INDIA LTD', date: '2026-07-03', days: '8', priority: 'High', status: 'Quoted' },
    { id: 6, enquiryNo: 'ENQ-0014', customer: 'JPTI LTD', date: '2026-07-03', days: '3', priority: 'High', status: 'Quoted' },
    { id: 7, enquiryNo: 'ENQ-0013', customer: 'SKF INDIA INDUSTRIAL LTD', date: '2026-05-30', days: '4', priority: 'High', status: 'Quoted' },
    { id: 8, enquiryNo: 'ENQ-0012', customer: 'NARAYAN ENGINEERING', date: '2026-02-29', days: '2', priority: 'Medium', status: 'Quoted' },
    { id: 9, enquiryNo: 'ENQ-0011', customer: 'BHARAT FORGE', date: '2026-07-02', days: '9', priority: 'Medium', status: 'Open' },
    { id: 10, enquiryNo: 'ENQ-0010', customer: 'VALMET THOMAS CIDER PROJECT LTD', date: '2026-07-01', days: '7', priority: 'Medium', status: 'Open' },
    { id: 11, enquiryNo: 'ENQ-0019', customer: 'UNITED CONVEYOR CORPORATION INDIA PVT LTD', date: '2026-05-30', days: '2', priority: 'High', status: 'Quoted' },
    { id: 12, enquiryNo: 'ENQ-0018', customer: 'UNITED CONVEYOR CORPORATION INDIA PVT LTD', date: '2026-07-02', days: '2', priority: 'Medium', status: 'Quoted' },
    { id: 13, enquiryNo: 'ENQ-0017', customer: 'DANELI INDIA LTD', date: '2026-04-11', days: '1', priority: 'Low', status: 'Quoted' },
    { id: 14, enquiryNo: 'ENQ-0016', customer: 'DANELI INDIA LTD', date: '2026-05-25', days: '3', priority: 'Low', status: 'Quoted' },
    { id: 15, enquiryNo: 'ENQ-0015', customer: 'DANELI INDIA LTD', date: '2026-02-23', days: '4', priority: 'Low', status: 'Quoted' },
    { id: 16, enquiryNo: 'ENQ-0014', customer: 'BHARAT FORGE', date: '2026-01-24', days: '3', priority: 'High', status: 'Quoted' },
    { id: 17, enquiryNo: 'ENQ-0013', customer: 'MARUTI VALVES PROJECT LIMITED', date: '2026-05-29', days: '2', priority: 'High', status: 'Quoted' },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
            <span className="text-blue-600 font-bold">E</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Enquiry</h1>
            <p className="text-gray-500 text-sm">Organize your customer enquiries. Find your next customer</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="text-gray-400 text-xl">⋮</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            + New Enquiry
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search enquiry number..."
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All statuses</option>
            <option>Quoted</option>
            <option>Open</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">S.NO</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Enquiry No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Days</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {enquiries.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{item.enquiryNo}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.customer}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.days}</td>
                  <td className="px-4 py-3 text-sm font-medium">
                    <span className={`${
                      item.priority === 'High' ? 'text-red-600' :
                      item.priority === 'Medium' ? 'text-orange-500' :
                      'text-green-600'
                    }`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    <span className={`${
                      item.status === 'Quoted' ? 'text-purple-600' :
                      item.status === 'Open' ? 'text-blue-600' :
                      'text-gray-600'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm flex gap-2">
                    <button className="text-gray-400 hover:text-blue-600 transition-colors p-1">
                      <Edit2 size={16} />
                    </button>
                    <button className="text-gray-400 hover:text-red-600 transition-colors p-1">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerEnquiry;
