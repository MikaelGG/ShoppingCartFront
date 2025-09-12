import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Layout from './components/Layout';
import './theme.css';


import App from './pages/app/App'
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import UserConfig from './pages/UserConfig';
import ShoppingCart from './pages/ShoppingCart';
import ShippingAddresses from './pages/ShippingAddresses';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
document.body.classList.add('dark');
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Index />
    </AuthProvider>
  </React.StrictMode>
);

export default function Index() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/user-conf" element={<UserConfig />} />
            <Route path='/shopping-cart' element={<ShoppingCart/>} />
            <Route path='/shipping-addresses' element={<ShippingAddresses/>} />
          </Routes>
        </Layout>
      </CartProvider>  
    </BrowserRouter>
  );
}

