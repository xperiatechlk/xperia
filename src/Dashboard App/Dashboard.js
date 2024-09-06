import React from "react";
import AdminDashboard from "./AdminDashboard";
import StaffDashboard from "./StaffDashboard";

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('staff'))
    return user?.role == 'admin' ? <AdminDashboard /> : <StaffDashboard />
}

export default Dashboard;