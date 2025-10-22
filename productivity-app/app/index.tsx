// File: app/index.tsx
import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Alert, Modal, TextInput, Platform, StyleProp, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp, Assignment, GroupProject, Task } from './_layout'; // Import types
import { supabase } from '../src/lib/supabase';
import { CalendarIcon } from '../components/shared/Icons';
import ProjectFormModal from '../components/ProjectFormModal';

// --- Reusable Native Components ---
const Card = ({ children, style }: { children: React.ReactNode, style?: StyleProp<ViewStyle> }) => <View style={[styles.card, style]}>{children}</View>;
const ProgressBar = ({ value }: { value: number }) => (
    <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${value}%` }]} />
    </View>
);

const CanvasIcon = () => (
    <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#f97316', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>C</Text>
    </View>
);

export default function DashboardScreen() {
    const { user, assignments, groupProjects, setAssignments, setGroupProjects, loading } = useApp();
    const router = useRouter();
    
    const [activeMode, setActiveMode] = useState<'individual' | 'group'>('individual');
    const [isModalVisible, setModalVisible] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState<Assignment | GroupProject | null>(null);

    const handleOpenModal = (project: Assignment | GroupProject | null = null) => {
        setProjectToEdit(project);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setProjectToEdit(null);
    };

    const handleSaveProject = async (projectData: Partial<Assignment & GroupProject>) => {
        if (!user) return;
        
        if (projectToEdit) { // UPDATE logic
            const tableName = activeMode === 'individual' ? 'assignments' : 'group_projects';
            const { data, error } = await supabase
                .from(tableName)
                .update(projectData)
                .eq('id', projectToEdit.id)
                .select()
                .single();
            
            if (error) Alert.alert('Database Error', `Failed to update: ${error.message}`);
            else if (data) {
                if (activeMode === 'individual') {
                    setAssignments(prev => prev.map(p => p.id === projectToEdit.id ? data : p));
                } else {
                    setGroupProjects(prev => prev.map(p => p.id === projectToEdit.id ? data : p));
                }
            }
        } else { // CREATE logic
            if (activeMode === 'individual') {
                const { data, error } = await supabase.from('assignments').insert({ ...projectData, user_id: user.id }).select().single();
                if (error) Alert.alert('Database Error', `Failed to save: ${error.message}`);
                else if (data) setAssignments(prev => [...prev, data]);
            } else {
                const { data, error } = await supabase.from('group_projects').insert({ ...projectData, created_by: user.id }).select().single();
                if (error) Alert.alert('Database Error', `Failed to save: ${error.message}`);
                else if (data) setGroupProjects(prev => [...prev, data]);
            }
        }
        handleCloseModal();
    };
    
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const inProgressAssignments = useMemo(() => (assignments || []).filter(a => a.tasks && a.tasks.length > 0), [assignments]);
    
    if (loading || !user) {
        return <View style={styles.container}><ActivityIndicator /></View>;
    }
    
    const handleSelectAssignment = (assignment: Assignment) => router.push(`/assignment/${assignment.id}`);
    const handleSelectGroupProject = (project: GroupProject) => router.push(`/group/${project.id}`);

    const userName = user.email ? user.email.split('@')[0] : 'User';

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <ProjectFormModal mode={activeMode} projectToEdit={projectToEdit} visible={isModalVisible} onClose={handleCloseModal} onSave={handleSaveProject} />

            <View style={styles.dashboardContainer}>
                <ScrollView style={styles.mainContent}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>Welcome, {userName}!</Text>
                            <Text style={styles.subtitle}>Here's your dashboard for today.</Text>
                        </View>
                        <TouchableOpacity onPress={handleLogout}><Text style={styles.logoutButton}>Logout</Text></TouchableOpacity>
                    </View>
                    <View style={styles.modeSwitcher}>
                        <TouchableOpacity onPress={() => setActiveMode('individual')} style={[styles.modeButton, activeMode === 'individual' && styles.activeModeButton]}><Text style={[styles.modeButtonText, activeMode === 'individual' && styles.activeModeButtonText]}>Individual</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => setActiveMode('group')} style={[styles.modeButton, activeMode === 'group' && styles.activeModeButton]}><Text style={[styles.modeButtonText, activeMode === 'group' && styles.activeModeButtonText]}>Group</Text></TouchableOpacity>
                    </View>
                        <>
                            {activeMode === 'individual' && inProgressAssignments.length > 0 && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Continue Your Work</Text>
                                     <View style={styles.inProgressContainer}>
                                        {inProgressAssignments.map(a => {
                                            const completedTasks = (a.tasks || []).filter((t: Task) => t.completed).length;
                                            const totalTasks = (a.tasks || []).length;
                                            const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
                                            return (
                                                <TouchableOpacity key={a.id} onPress={() => handleSelectAssignment(a)} style={styles.inProgressTouchable}>
                                                    <Card style={styles.inProgressCard}>
                                                        <View style={styles.cardHeader}><Text style={styles.cardTitle} numberOfLines={1}>{a.title}</Text><Text style={styles.cardCourse}>{a.course}</Text></View>
                                                        <ProgressBar value={progress} />
                                                    </Card>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
                                </View>
                            )}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>{activeMode === 'individual' ? 'All Individual Projects' : 'All Group Projects'}</Text>
                                    <TouchableOpacity onPress={() => handleOpenModal()}><Text style={styles.addNewButton}>+ Add New</Text></TouchableOpacity>
                                </View>
                                {activeMode === 'individual' ? (assignments || []).map((a: Assignment) => (
                                    <TouchableOpacity key={a.id} onPress={() => handleSelectAssignment(a)} onLongPress={() => handleOpenModal(a)}>
                                        <Card><Text style={styles.cardTitle}>{a.title}</Text><Text style={styles.cardSubtitle}>{a.course} • Due: {a.dueDate}</Text></Card>
                                    </TouchableOpacity>
                                )) : (groupProjects || []).map((p: GroupProject) => (
                                    <TouchableOpacity key={p.id} onPress={() => handleSelectGroupProject(p)} onLongPress={() => handleOpenModal(p)}>
                                        <Card><Text style={styles.cardTitle}>{p.title}</Text><Text style={styles.cardSubtitle}>{p.course} • {p.members ? p.members.length : 0} members</Text></Card>
                                    </TouchableOpacity>
                                ))}
                                {activeMode === 'group' && (!groupProjects || groupProjects.length === 0) && <Text style={styles.placeholderText}>No group projects found.</Text>}
                            </View>
                        </>
                </ScrollView>
                <View style={styles.sidebar}>
                    <Card style={styles.sidebarCard}>
                        <TouchableOpacity style={styles.sidebarButton}>
                             <CanvasIcon />
                            <View><Text style={styles.sidebarButtonTitle}>Connect to Canvas</Text><Text style={styles.sidebarButtonSubtitle}>Import your assignments.</Text></View>
                        </TouchableOpacity>
                        <View style={styles.separator} />
                        <TouchableOpacity style={styles.sidebarButton}>
                            <CalendarIcon style={{ width: 24, height: 24, color: '#5b21b6' }} />
                            <View><Text style={styles.sidebarButtonTitle}>Connect to Calendar</Text><Text style={styles.sidebarButtonSubtitle}>Import your events.</Text></View>
                        </TouchableOpacity>
                    </Card>
                </View>
            </View>
        </SafeAreaView>
    );
}

// --- Styles (condensed for brevity) ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f4f5' },
    dashboardContainer: { flex: 1, flexDirection: 'row' },
    mainContent: { flex: 2, paddingHorizontal: 24 },
    sidebar: { flex: 1, padding: 24, borderLeftWidth: 1, borderLeftColor: '#e5e7eb', backgroundColor: '#f9fafb' },
    header: { paddingVertical: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: 32, fontWeight: 'bold' },
    subtitle: { fontSize: 16, color: '#6b7280', marginTop: 4 },
    logoutButton: { color: '#ef4444', fontWeight: '600' },
    modeSwitcher: { flexDirection: 'row', backgroundColor: '#e4e4e7', borderRadius: 999, padding: 4, marginBottom: 16 },
    modeButton: { flex: 1, paddingVertical: 8, borderRadius: 999, alignItems: 'center' },
    activeModeButton: { backgroundColor: '#ffffff' },
    modeButtonText: { fontSize: 14, fontWeight: '600', color: '#3f3f46' },
    activeModeButtonText: { color: '#18181b' },
    section: { marginTop: 32 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold' },
    addNewButton: { fontSize: 14, fontWeight: '600', color: '#007aff' },
    card: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12 },
    inProgressContainer: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
    inProgressTouchable: { width: '50%', paddingHorizontal: 6 },
    inProgressCard: { paddingVertical: 20, width: '100%' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    cardTitle: { fontSize: 16, fontWeight: '600', flexShrink: 1 },
    cardCourse: { fontSize: 12, fontWeight: '500', color: '#007aff', marginLeft: 8 },
    cardSubtitle: { fontSize: 14, color: '#6b7280', marginTop: 4 },
    progressBarBackground: { height: 6, backgroundColor: '#e4e4e7', borderRadius: 3 },
    progressBarFill: { height: 6, backgroundColor: '#007aff', borderRadius: 3 },
    placeholderText: { textAlign: 'center', color: '#6b7280', marginTop: 20 },
    sidebarCard: { padding: 12, gap: 12 },
    sidebarButton: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 8, borderRadius: 8, },
    sidebarButtonTitle: { fontWeight: '600' },
    sidebarButtonSubtitle: { fontSize: 12, color: '#6b7280' },
    separator: { height: 1, backgroundColor: '#e5e7eb' },
});

