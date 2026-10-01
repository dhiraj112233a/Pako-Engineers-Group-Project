import React from 'react';
import ErpTablePage from '../ErpTablePage';

const rows = [];

const columns = [
  { key: 'actions', label: 'Actions' },
  { key: 'skuNo', label: 'SKU No' },
  { key: 'date', label: 'Date' },
  { key: 'type', label: 'Type' },
  { key: 'stock', label: 'Stock' },
  { key: 'reference', label: 'Reference' },
  { key: 'qty', label: 'Qty', num: true },
  { key: 'rate', label: 'Rate', num: true },
  { key: 'amount', label: 'Amount', num: true },
  { key: 'source', label: 'Source' },
  { key: 'approval', label: 'Approval' },
];

export default function StockManagement() {
  return (
    <ErpTablePage
      title="Stock Management" icon="fa-clipboard-list"
      subtitle="Record stock movements (receipt / issue / adjust / dispatch). Balances update automatically with moving-average cost."
      action="New Movement" columns={columns} rows={rows} empty="No movements yet"
      filters={[
        { key: 'stock', all: 'All stock', options: ['Raw Material', 'Finished Goods'] },
        { key: 'type', all: 'All types', options: ['Receipt', 'Issue', 'Adjust', 'Dispatch'] },
      ]}
    />
  );
}