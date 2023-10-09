import React from 'react'
import ReactDOM from 'react-dom/client'
import Header from './Header.jsx';
import Home from './Home.jsx'
import Login from './Login.jsx';
import Footer from './Footer.jsx';
import './index.css'

//imports:
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';


export default function App() {
  return (
    <BrowserRouter> 
      <Routes>
        <Route exact path='/' element={<Header />}>
          <Route index element={<Home />} />
          <Route path='login' element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <Footer />
  </React.StrictMode>
);

