// File: app/index.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from './_layout'; // We still use this for the user object
import { supabase } from '../src/lib/supabase'; // Import the Supabase client

// --- Reusable Native Components ---
const Card = ({ children, style }) => <View style={[styles.card, style]}>{children}</View>;
const ProgressBar = ({ value }) => (
    <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${value}%` }]} />
    </View>
);

export default function DashboardScreen() {
    const { user } = useApp();
    const [activeMode, setActiveMode] = useState('individual');
    const [assignments, setAssignments] = useState([]);
    const [groupProjects, setGroupProjects] = useState([]); // State for group projects
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Fetch both assignments and group projects from Supabase
        const fetchData = async () => {
            setLoading(true);
            
            const fetchAssignments = supabase.from('assignments').select('*');
            const fetchGroupProjects = supabase.from('group_projects').select('*'); // Fetch from group_projects table

            const [assignmentsResult, groupProjectsResult] = await Promise.all([
                fetchAssignments,
                fetchGroupProjects
            ]);

            if (assignmentsResult.error) {
                console.error('Error fetching assignments:', assignmentsResult.error);
            } else {
                setAssignments(assignmentsResult.data);
            }

            if (groupProjectsResult.error) {
                console.error('Error fetching group projects:', groupProjectsResult.error);
            } else {
                setGroupProjects(groupProjectsResult.data);
            }

            setLoading(false);
        };

        fetchData();
    }, []); // The empty array means this effect runs once on mount

    const inProgressAssignments = useMemo(() => assignments.filter(a => (a.tasks || []).length > 1), [assignments]);
    
    if (!user) {
        return <SafeAreaView style={styles.container}><Text>Login Screen</Text></SafeAreaView>;
    }
    
    const handleSelectAssignment = (assignment) => {
        router.push(`/assignment/${assignment.id}`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView style={styles.scrollView}>
                <View style={styles.header}>
                    <Text style={styles.title}>Welcome, {user.name.split(' ')[0]}!</Text>
                    <Text style={styles.subtitle}>Here's your dashboard for today.</Text>
                </View>

                {/* --- Mode Switcher --- */}
                <View style={styles.modeSwitcher}>
                    <TouchableOpacity onPress={() => setActiveMode('individual')} style={[styles.modeButton, activeMode === 'individual' && styles.activeModeButton]}>
                        <Text style={[styles.modeButtonText, activeMode === 'individual' && styles.activeModeButtonText]}>Individual</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveMode('group')} style={[styles.modeButton, activeMode === 'group' && styles.activeModeButton]}>
                        <Text style={[styles.modeButtonText, activeMode === 'group' && styles.activeModeButtonText]}>Group</Text>
                    </TouchableOpacity>
                </View>

                {/* --- Loading Indicator --- */}
                {loading && (
                    <View style={styles.section}>
                        <ActivityIndicator size="large" color="#007aff" />
                    </View>
                )}

                {/* --- Main List Section --- */}
                {!loading && (
                    <View style={styles.section}>
                         <Text style={styles.sectionTitle}>{activeMode === 'individual' ? 'All Individual Projects' : 'All Group Projects'}</Text>
                         {activeMode === 'individual' ? assignments.map(a => (
                             <TouchableOpacity key={a.id} onPress={() => handleSelectAssignment(a)}>
                                 <Card>
                                     <Text style={styles.cardTitle}>{a.title}</Text>
                                     <Text style={styles.cardSubtitle}>{a.course} • Due: {a.dueDate}</Text>
                                 </Card>
                             </TouchableOpacity>
                         )) : (
                            groupProjects.map(p => (
                                <TouchableOpacity key={p.id} onPress={() => {/* Navigate to group detail */}}>
                                   <Card>
                                       <Text style={styles.cardTitle}>{p.title}</Text>
                                       <Text style={styles.cardSubtitle}>{p.course}</Text>
                                   </Card>
                                </TouchableOpacity>
                            ))
                         )}
                         {activeMode === 'group' && groupProjects.length === 0 && (
                            <Text style={styles.placeholderText}>No group projects found.</Text>
                         )}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

// --- Styles ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f4f5' },
    scrollView: { paddingHorizontal: 16 },
    header: { paddingVertical: 24 },
    title: { fontSize: 32, fontWeight: 'bold' },
    subtitle: { fontSize: 16, color: '#6b7280', marginTop: 4 },
    modeSwitcher: { flexDirection: 'row', backgroundColor: '#e4e4e7', borderRadius: 999, padding: 4 },
    modeButton: { flex: 1, paddingVertical: 8, borderRadius: 999, alignItems: 'center' },
    activeModeButton: { backgroundColor: '#ffffff' },
    modeButtonText: { fontSize: 14, fontWeight: '600', color: '#3f3f46' },
    activeModeButtonText: { color: '#18181b' },
    section: { marginTop: 32 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
    card: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12 },
    cardTitle: { fontSize: 16, fontWeight: '600' },
    cardSubtitle: { fontSize: 14, color: '#6b7280', marginTop: 4 },
    placeholderText: { textAlign: 'center', color: '#6b7280', marginTop: 20 },
});

