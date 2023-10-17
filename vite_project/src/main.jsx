import React from 'react'
import ReactDOM from 'react-dom/client'
import Layout from './Layout.jsx';
import Home from './Home.jsx'
import Login from './Login.jsx';
import Footer from './Footer.jsx';
import Search from './Search.jsx';
import './style/index.css'

//imports:
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';


export default function App() {
  return (
    <BrowserRouter> 
      <Routes>
        <Route exact path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='login' element={<Login />} />
          <Route path='search' element={<Search />} />
          {/* TODO: 404 not found page */}
          <Route path='*' element={<Foundnt/>}/>
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

