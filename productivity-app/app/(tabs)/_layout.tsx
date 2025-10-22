import React, { useState, useEffect, createContext, useContext } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { View, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { initialMockAssignments, initialMockGroupProjects } from '../../api/constants';

const AppContext = createContext(null);

export function useApp() {
    return useContext(AppContext);
}

function RootLayoutNav() {
    const { user, loading } = useApp();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        const inAuthGroup = segments[0] === 'auth';

        if (!user && !inAuthGroup) {
            router.replace('/auth');
        } else if (user && inAuthGroup) {
            router.replace('/');
        }
    }, [user, loading, segments]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.rootContainer}>
            <View style={styles.appContainer}>
                <Stack screenOptions={{ headerShown: false }} />
            </View>
        </View>
    );
}

export default function RootLayout() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [assignments, setAssignments] = useState(initialMockAssignments);
    const [groupProjects, setGroupProjects] = useState(initialMockGroupProjects);

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const value = {
        user,
        loading,
        assignments,
        setAssignments,
        groupProjects,
        setGroupProjects,
    };

    return (
        <AppContext.Provider value={value}>
            <RootLayoutNav />
        </AppContext.Provider>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        ...Platform.select({
            web: {
                backgroundColor: '#e5e7eb',
                justifyContent: 'center',
                alignItems: 'center',
            }
        })
    },
    appContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: '#f4f4f5',
        ...Platform.select({
            web: {
                maxWidth: 1280,
                maxHeight: '90vh',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            }
        })
    }
});

