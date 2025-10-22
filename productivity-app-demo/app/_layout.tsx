// File: app/_layout.tsx
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { supabase } from '../src/lib/supabase'; // Make sure this path is correct

const AppContext = createContext(null);

export function useApp() {
    return useContext(AppContext);
}

// This hook handles the authentication state and redirects
function useProtectedRoute(user) {
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        const inAuthGroup = segments[0] === '(auth)';

        if (!user && !inAuthGroup) {
            // Redirect to the sign-in page.
            router.replace('/auth');
        } else if (user && inAuthGroup) {
            // Redirect away from the sign-in page.
            router.replace('/');
        }
    }, [user, segments]);
}

function RootLayoutNav() {
    const { user, loading } = useApp();
    useProtectedRoute(user);
    
    // You can return a loading indicator here if needed
    if (loading) return null;

    return (
        <Stack screenOptions={{ headerShown: false }} />
    );
}

export default function RootLayout() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Cleanup the listener on unmount
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const value = {
        user,
        loading,
        // You can add assignments/projects state here if you want to keep it global
    };

    return (
        <AppContext.Provider value={value}>
            <RootLayoutNav />
        </AppContext.Provider>
    );
}