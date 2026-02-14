import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';

const ActivityContext = createContext(null);

export const useActivity = () => useContext(ActivityContext);

export const ActivityProvider = ({ children }) => {
    const { token, isAuthenticated, loading: authLoading } = useAuth();
    const [stats, setStats] = useState({
        activeSupplies: 0,
        activeDemands: 0,
        pendingRequests: 0,
        activeDeals: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStats = async () => {
        if (!token || !isAuthenticated) return;

        try {
            setLoading(true);
            const [statsData, activityData] = await Promise.all([
                api.get('/activity-details'),
                api.get('/activity-details/recent-activity')
            ]);
            
            setStats(statsData);
            setRecentActivity(activityData);
            setError(null);
        } catch (err) {
            if (err.status !== 401 && err.status !== 403) {
                console.error('Failed to fetch activity data:', err);
                setError(err);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            if (isAuthenticated) {
                fetchStats();
            } else {
                setStats({
                    activeSupplies: 0,
                    activeDemands: 0,
                    pendingRequests: 0,
                    activeDeals: 0
                });
                setRecentActivity([]);
            }
        }
    }, [isAuthenticated, authLoading]);

    const value = {
        stats,
        recentActivity,
        loading,
        error,
        refreshStats: fetchStats
    };


    return (
        <ActivityContext.Provider value={value}>
            {children}
        </ActivityContext.Provider>
    );
};

