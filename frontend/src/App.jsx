import React from 'react';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <div className="navbar-wrapper">
        <Navbar />
      </div>

      <main className="main-content">
        <section className="hero-section">
          <h1>Welcome to PAKO ENGINEERS</h1>
        </section>
      </main>
    </div>
  );
}

export default App;
