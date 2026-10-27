import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
import CustomerPo from './components/transactionpages/customerPo';
import VendorPo from './components/transactionpages/vendorPo';
import ProcessPr from './components/transactionpages/processPr';
import ProcessPo from './components/transactionpages/ProcessPo';
import Dispatch from './components/transactionpages/dispatch';
import Quotation from './components/transactionpages/quotation';
import PurchaseList from './components/transactionpages/purchaseList';
import PendingList from './components/transactionpages/pendingList';
import SalesInvoices from './components/transactionpages/SalesInvoices';
import DocumentVault from './components/documentvault';
import Dashboard from './components/dashboard/Dashboard';
import WorkOrders from './components/productionpages/WorkOrders';
import ProductionPlan from './components/productionpages/ProductionPlan';
import ProductionStatus from './components/productionpages/ProductionStatus';
import RawMaterial from './components/stockpages/RawMaterial';
import FinishedGoods from './components/stockpages/FinishedGoods';
import StockManagement from './components/stockpages/StockManagement';
import GSTSettings from './components/setting/gstsetting';
import VendorTerms from './components/setting/vendorandtc';
import SalesTargets from './components/setting/salestarget';
import GlobalSettings from './components/setting/globalsetting';
import UserManagement from './components/setting/usermanagement';
import Reports from './components/Reports';
import './App.css';
import BackendConnectionTest from './components/BackendConnectionTest';
function AppContent() {
  const { pathname } = useLocation();

  useEffect(() => {
    const reportTitles = {
      '/reports/sales': 'Sales Report',
      '/reports/gst': 'GST Report',
    };
    const page = pathname.split('/').filter(Boolean).at(-1) || 'dashboard';
    const title = reportTitles[pathname] || page.split('-').map((word) => {
      if (['gst', 'po', 'pr'].includes(word)) return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
    document.title = `${title} | PAKO ENGINEERS`;
  }, [pathname]);

  return (
    <div className="app-container">
      <div className="app-navbar">
        <Navbar />
      </div>
      <main className="main-content">
        <Routes>
            <Route
              path="/backend-test"
              element={<BackendConnectionTest />}
            />
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
            <Route path="/customer-po" element={<CustomerPo />} />
            <Route path="/vendor-po" element={<VendorPo />} />
            <Route path="/process-pr" element={<ProcessPr />} />
            <Route path="/process-po" element={<ProcessPo />} />
            <Route path="/dispatch" element={<Dispatch />} />
            <Route path="/quotation" element={<Quotation />} />
            <Route path="/purchase-list" element={<PurchaseList />} />
            <Route path="/pending-list" element={<PendingList />} />
            <Route path="/sales-invoices" element={<SalesInvoices />} />
            <Route path="/document-vault" element={<DocumentVault />} />
            <Route path="/work-orders" element={<WorkOrders />} />
            <Route path="/production-plan" element={<ProductionPlan />} />
            <Route path="/production-status" element={<ProductionStatus />} />
            <Route path="/raw-material" element={<RawMaterial />} />
            <Route path="/finished-goods" element={<FinishedGoods />} />
            <Route path="/stock-management" element={<StockManagement />} />
            <Route path="/reports/sales" element={<Reports type="sales" />} />
            <Route path="/reports/gst" element={<Reports type="gst" />} />
            <Route path="/gst-setting" element={<GSTSettings />} />
            <Route path="/admin/gst-setting" element={<GSTSettings />} />
            <Route path="/admin/vendor-terms" element={<VendorTerms />} />
            <Route path="/vendor-terms" element={<VendorTerms />} />
            <Route path="/admin/sales-targets" element={<SalesTargets />} />
            <Route path="/sales-targets" element={<SalesTargets />} />
            <Route path="/admin/global-setting" element={<GlobalSettings />} />
            <Route path="/global-setting" element={<GlobalSettings />} />
            <Route path="/admin/user-management" element={<UserManagement />} />
            <Route path="/user-management" element={<UserManagement />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;