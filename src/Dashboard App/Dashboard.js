import React, { useEffect } from "react";
import AdminDashboard from "./AdminDashboard";
import StaffDashboard from "./StaffDashboard";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const user = JSON.stringify(localStorage.getItem('staff'))
    const navigate = useNavigate()
    useEffect(() => {
        if(!user){
            navigate('/login')
        }
    },[user]  )
    return user?.role == 'admin' ? <AdminDashboard /> : <StaffDashboard />
}

export default Dashboard;