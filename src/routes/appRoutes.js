import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from "../pages/HomePage";
import ClientsPage from "../pages/ClientsPage";
import ProductsPage from "../pages/ProductPage";
import SalesPage from "../pages/SalesPage";
import MainLayout from "../componets/UI/MainLayout";
import ProviderPage from "../pages/ProviderPage";
import WeeklySalesPage from "../pages/WeeklySalesPage";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/home" element={<MainLayout><HomePage /></MainLayout>} />
            <Route path="/clients" element={<MainLayout><ClientsPage /></MainLayout>} />
            <Route path="/products" element={<MainLayout><ProductsPage /></MainLayout>} />
            <Route path="/sales" element={<MainLayout><SalesPage /></MainLayout>} />
            <Route path="/provider" element={<MainLayout><ProviderPage /></MainLayout>} />
            <Route path="/report" element={<MainLayout><WeeklySalesPage /></MainLayout>} />



            <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
    );
};

export default AppRoutes;
