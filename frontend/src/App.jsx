import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Customer from './components/masterpages/customer';
import Vendors from './components/masterpages/vendors';
import Items from './components/masterpages/items';
import Materials from './components/masterpages/materials';
import MaterialSpecs from './components/masterpages/materialspecs';
import MaterialGroups from './components/masterpages/materialgroups';
import Processes from './components/masterpages/processes';
import Tools from './components/masterpages/tools';
import Machines from './components/masterpages/machines';
import Instruments from './components/masterpages/instruments';
import Consumables from './components/masterpages/consumables';
import BoughtOutItems from './components/masterpages/boughtoutitems';
import CustomerEnquiry from './components/transactionpages/customerEnquiry';
import SalesInvoices from './components/transactionpages/Salesinvoices';
import Dashboard from './components/dashboard/Dashboard';
import WorkOrders from './components/productionpages/WorkOrders';
import ProductionPlan from './components/productionpages/ProductionPlan';
import ProductionStatus from './components/productionpages/ProductionStatus';
import RawMaterial from './components/stockpages/Rawmaterial';
import FinishedGoods from './components/stockpages/FinishedGoods';
import StockManagement from './components/stockpages/StockManagement';
import './App.css';
function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <div className="navbar-wrapper">
          <Navbar />
        </div>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/items" element={<Items />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/material-specs" element={<MaterialSpecs />} />
            <Route path="/material-groups" element={<MaterialGroups />} />
            <Route path="/processes" element={<Processes />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/machines" element={<Machines />} />
            <Route path="/instruments" element={<Instruments />} />
            <Route path="/consumables" element={<Consumables />} />
            <Route path="/bought-out-items" element={<BoughtOutItems />} />
            <Route path="/customer-enquiry" element={<CustomerEnquiry />} />
            <Route path="/sales-invoices" element={<SalesInvoices />} />
            <Route path="/work-orders" element={<WorkOrders />} />
            <Route path="/production-plan" element={<ProductionPlan />} />
            <Route path="/production-status" element={<ProductionStatus />} />
            <Route path="/raw-material" element={<RawMaterial />} />
            <Route path="/finished-goods" element={<FinishedGoods />} />
            <Route path="/stock-management" element={<StockManagement />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
export default App;