import React, { useEffect } from 'react';
import {
  Routes,
  Route,
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
        <Route exact path="/" element={<Dashboard />} />
        <Route exact path="/products" element={<Products />} />
        <Route exact path="/add-product" element={<AddProduct />} />
        <Route path="/products/:id/edit" element={<AddProduct />} />
        <Route path="/deleted" element={<DeletedProducts />} />
        <Route path="/filter-groups" element={<FilterGroups />} />
        <Route path="/filter-groups/:groupId" element={<FilterOptions />} />
        <Route
          path="/categories/:categoryId/filters"
          element={<CategoryFilters />}
        />
        <Route
          path="/categories"
          element={<Categories />}
        />
        <Route
          path="/customers"
          element={<Customers />}
        />
        <Route
          path="/customers/:id"
          element={<CustomerDetails />}
        />
      </Routes>
    </>
  );
}

export default App;
