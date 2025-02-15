import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader } from '../components';

const PrivateRoute = ({ children }) => {
    const token = useSelector((state) => state.auth.token);
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);

    useEffect(() => {
        // Check Supabase session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return <Loader />;
    }

    // Check either Redux token or Supabase session
    return (token || session) ? children : <Navigate to="/login" state={{ from: location }} replace />;
}

export default PrivateRoute;