import React, { useEffect, useState } from 'react';
import {
  Navigate,
  Outlet,
  Routes,
  Route,
  useNavigate,
  useLocation
} from 'react-router-dom';

import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import DeletedProducts from './pages/DeletedProducts';
import FilterGroups from "./pages/FilterGroups";
import FilterOptions from "./pages/FilterOptions";
import CategoryFilters from "./pages/CategoryFilters";
import Categories from "./pages/Categories";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import OrdersPage from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Login from './pages/login.jsx';
import { getSession } from './api/user';

function ProtectedRoutes() {
  const navigate = useNavigate();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getSession()
      .then(() => {
        if (isMounted) {
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          navigate('/login', { replace: true });
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f4ee] text-sm text-[#66736b]">
        Checking your session...
      </main>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route exact path="/" element={<Dashboard />} />
          <Route exact path="/products" element={<Products />} />
          <Route exact path="/add-product" element={<AddProduct />} />
          <Route path="/products/:id/edit" element={<AddProduct />} />
          <Route path="/deleted" element={<DeletedProducts />} />
          <Route path="/filter-groups" element={<FilterGroups />} />
          <Route path="/filter-groups/:groupId" element={<FilterOptions />} />
          <Route path="/categories/:categoryId/filters" element={<CategoryFilters />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerDetails />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
