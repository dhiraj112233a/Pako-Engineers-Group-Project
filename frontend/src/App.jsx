import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Customer from './components/masterpages/customer';
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

            <Route
              path="/customer"
              element={<Customer />}
            />

          </Routes>

        </main>
      </div>

    </BrowserRouter>
  );
}

export default App;