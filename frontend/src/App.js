import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {

  const HeaderFooterRoute = () => (
    <>
      <Header />
      <Footer />
    </>
  );

  return (
    <>
      <BrowserRouter>
        
        <Routes>
            <Route path="/" element={<HeaderFooterRoute />}>

            {/* <Route index element={<Home />} /> */}

          </Route>
        
        </Routes>

      </BrowserRouter>
    </>
  );
}

export default App;
