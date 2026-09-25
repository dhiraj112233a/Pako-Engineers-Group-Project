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

            <Route
              path="/"
              element={
                <section className="hero-section">
                  <h1>Welcome to PAKO ENGINEERS</h1>
                </section>
              }
            />

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

          </Routes>

        </main>
      </div>

    </BrowserRouter>
  );
}

export default App;