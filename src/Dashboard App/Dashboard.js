import React, { useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard";
import StaffDashboard from "./StaffDashboard";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Retrieve user data from localStorage
        const storedUser = localStorage.getItem('staff');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        } else {
            // Redirect to login if no user is found
            navigate('/login');
        }
    }, [navigate]);

    // If user is not available yet, don't render the component
    if (!user) {
        return null; // You could show a loading spinner here if necessary
    }

    // Render AdminDashboard or StaffDashboard based on user's role
    return user.role === 'admin' ? <AdminDashboard /> : <StaffDashboard />;
};

export default Dashboard;
