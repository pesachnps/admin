import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import ThemeSettings from "./ThemeSettings";

import DisplaySettings from "./DisplaySettings";

import UserManagement from "./UserManagement";

import SystemSettings from "./SystemSettings";

import ActivityLog from "./ActivityLog";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    ThemeSettings: ThemeSettings,
    
    DisplaySettings: DisplaySettings,
    
    UserManagement: UserManagement,
    
    SystemSettings: SystemSettings,
    
    ActivityLog: ActivityLog,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/ThemeSettings" element={<ThemeSettings />} />
                
                <Route path="/DisplaySettings" element={<DisplaySettings />} />
                
                <Route path="/UserManagement" element={<UserManagement />} />
                
                <Route path="/SystemSettings" element={<SystemSettings />} />
                
                <Route path="/ActivityLog" element={<ActivityLog />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}