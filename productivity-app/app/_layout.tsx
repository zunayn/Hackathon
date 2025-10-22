// File: app/_layout.tsx
import React, { useState, useEffect, createContext, useContext, Dispatch, SetStateAction } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { supabase } from '../src/lib/supabase';
import { View, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { User } from '@supabase/supabase-js';

// --- Type Definitions for our Data ---
export interface Task {
  id: number;
  text: string;
  completed: boolean;
  eta: number;
  assignment_id: number;
  user_id: string;
}

export interface Assignment {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  description: string;
  ai_summary?: string;
  tasks?: Task[];
}

export interface GroupProject {
  id: number;
  title: string;
  course: string;
  members: any[];
  dueDate?: string;
  description?: string;
}

// --- Define the shape of our App's Context ---
interface AppContextType {
    user: User | null;
    loading: boolean;
    assignments: Assignment[];
    setAssignments: Dispatch<SetStateAction<Assignment[]>>;
    groupProjects: GroupProject[];
    setGroupProjects: Dispatch<SetStateAction<GroupProject[]>>;
}

// Create the context with a non-null default value that matches the type
const AppContext = createContext<AppContextType>({
    user: null,
    loading: true,
    assignments: [],
    setAssignments: () => {},
    groupProjects: [],
    setGroupProjects: () => {},
});

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
                {/* Explicitly define all screens for the navigator */}
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="assignment/[id]" />
                    <Stack.Screen name="group/[id]" />
                    <Stack.Screen name="auth" />
                </Stack>
            </View>
        </View>
    );
}

export default function RootLayout() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [groupProjects, setGroupProjects] = useState<GroupProject[]>([]);

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                const assignmentsPromise = supabase.from('assignments').select('*, tasks(*)');
                const groupProjectsPromise = supabase.from('group_projects').select('*');
        
                const [assignmentsResult, groupProjectsResult] = await Promise.all([assignmentsPromise, groupProjectsPromise]);

                if (assignmentsResult.error) console.error('Error fetching assignments:', assignmentsResult.error.message);
                else setAssignments(assignmentsResult.data || []);

                if (groupProjectsResult.error) console.error('Error fetching group projects:', groupProjectsResult.error.message);
                else setGroupProjects(groupProjectsResult.data || []);
            }
            setLoading(false);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const value = { user, loading, assignments, setAssignments, groupProjects, setGroupProjects };

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
                maxHeight: '90%',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            }
        })
    }
});

