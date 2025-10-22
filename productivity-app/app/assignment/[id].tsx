// File: app/assignment/[id].tsx
import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '../_layout';
import { supabase } from '../../src/lib/supabase';
import Card from '../../components/shared/Card';
import ProgressBar from '../../components/shared/ProgressBar';
import { EditIcon, Trash2Icon, FocusIcon, CheckCircleIcon } from '../../components/shared/Icons';
import FocusModeView from '../../components/FocusModeView';

export default function AssignmentDetailScreen() {
    const { id } = useLocalSearchParams();
    const { user, assignments, setAssignments } = useApp();
    const router = useRouter();
    
    // Find the assignment directly from the global context
    const assignment = useMemo(() => (assignments || []).find(a => a.id.toString() === id), [assignments, id]);
    
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [focusTask, setFocusTask] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newTaskText, setNewTaskText] = useState('');
    const [newTaskEta, setNewTaskEta] = useState('');

    useEffect(() => {
        const fetchAndGenerateTasks = async () => {
            if (assignment && user) {
                setLoading(true);

                // 1. Check for existing tasks
                const { data: existingTasks, error: fetchError } = await supabase
                    .from('tasks')
                    .select('*')
                    .eq('assignment_id', assignment.id);
                
                if (fetchError) {
                    Alert.alert('Error', 'Failed to fetch milestones.');
                    setLoading(false);
                    return;
                }

                // 2. If tasks exist, display them
                if (existingTasks && existingTasks.length > 0) {
                    setTasks(existingTasks);
                    setLoading(false);
                } else {
                    // 3. If NO tasks exist, generate them automatically
                    setIsGenerating(true);
                    try {
                        const [milestonesResult, summaryResult] = await Promise.all([
                            supabase.functions.invoke('generate-milestones', {
                                body: { assignmentTitle: assignment.title, assignmentDescription: assignment.description },
                            }),
                            supabase.functions.invoke('summarize-description', {
                                body: { description: assignment.description },
                            })
                        ]);

                        if (milestonesResult.error) throw milestonesResult.error;
                        if (summaryResult.error) throw summaryResult.error;

                        const newTasksPayload = milestonesResult.data.milestones.map(m => ({
                            text: m.text,
                            eta: m.eta || 0,
                            assignment_id: assignment.id,
                            user_id: user.id,
                        }));

                        const { data: savedTasks, error: tasksError } = await supabase.from('tasks').insert(newTasksPayload).select();
                        if (tasksError) throw tasksError;

                        const { data: updatedAssignment, error: summaryError } = await supabase
                            .from('assignments')
                            .update({ ai_summary: summaryResult.data.summary })
                            .eq('id', assignment.id)
                            .select()
                            .single();
                        
                        if (summaryError) throw summaryError;
                        
                        setTasks(savedTasks || []);
                        setAssignments(prev => prev.map(a => a.id === updatedAssignment.id ? { ...updatedAssignment, tasks: savedTasks } : a));

                    } catch (error) {
                        Alert.alert('AI Generation Failed', `Could not generate milestones: ${error.message}`);
                    } finally {
                        setIsGenerating(false);
                        setLoading(false);
                    }
                }
            }
        };
        fetchAndGenerateTasks();
    }, [assignment, user]);
    
    const handleAddTask = async () => {
        if (!newTaskText || !newTaskEta) return;
        const { data, error } = await supabase
            .from('tasks')
            .insert({ text: newTaskText, eta: parseFloat(newTaskEta), assignment_id: assignment.id, user_id: user.id })
            .select();
        
        if (error) Alert.alert('Error', 'Could not add milestone.');
        else if (data) setTasks(prev => [...prev, ...data]);
        
        setNewTaskText('');
        setNewTaskEta('');
        setIsAdding(false);
    };
    
    const handleUpdateTask = async (taskId, newText) => {
        const { error } = await supabase
            .from('tasks')
            .update({ text: newText })
            .eq('id', taskId);
        if (error) Alert.alert('Error', 'Could not update milestone.');
    };
    
    const handleDeleteTask = async (taskId) => {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', taskId);
        
        if (error) Alert.alert('Error', 'Could not delete milestone.');
        else setTasks(prev => prev.filter(t => t.id !== taskId));
    };

    const completedEta = useMemo(() => tasks.filter(t => t.completed).reduce((sum, task) => sum + (task.eta || 0), 0), [tasks]);
    const totalEta = useMemo(() => tasks.reduce((sum, task) => sum + (task.eta || 0), 0), [tasks]);
    const progress = totalEta > 0 ? (completedEta / totalEta) * 100 : 0;

    if (!assignment) {
        return <SafeAreaView style={styles.container}><ActivityIndicator /></SafeAreaView>;
    }

    if (focusTask) {
        return <FocusModeView task={focusTask} onExit={() => setFocusTask(null)} />;
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                 <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.replace('/')}>
                        <Text style={styles.backButton}>← Back to Dashboard</Text>
                    </TouchableOpacity>
                    <Text style={styles.courseTitle}>{assignment.course}</Text>
                    <Text style={styles.detailTitle}>{assignment.title}</Text>
                </View>

                <View style={styles.content}>
                    <Card style={{ padding: 16, marginBottom: 16 }}>
                         <Text style={styles.sectionTitle}>Your Goal</Text>
                         <Text style={styles.descriptionBody}>{assignment.ai_summary || assignment.description}</Text>
                    </Card>

                    <Card style={{ padding: 16 }}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Your Milestones</Text>
                            <View style={{flexDirection: 'row', gap: 16}}>
                                <TouchableOpacity onPress={() => setIsAdding(!isAdding)}><Text style={styles.headerButton}>{isAdding ? 'Cancel' : '+ Add'}</Text></TouchableOpacity>
                                <TouchableOpacity onPress={() => setIsEditing(!isEditing)}><Text style={styles.headerButton}>{isEditing ? 'Save' : 'Edit'}</Text></TouchableOpacity>
                            </View>
                        </View>
                        {loading ? <ActivityIndicator/> : isGenerating ? <Text style={styles.generatingText}>Generating AI milestones...</Text> : (
                            <>
                                <Text style={styles.etaText}>Estimated: {totalEta || 0}h. Completed: {completedEta.toFixed(1)}h.</Text>
                                <ProgressBar value={progress} />
                                <View style={{ marginTop: 24 }}>
                                    {tasks.map((task, index) => {
                                        const tip = assignment.professorAnalysis?.tips?.[index % assignment.professorAnalysis.tips.length];
                                        return (
                                            <View key={task.id || index} style={styles.milestoneItem}>
                                                <View style={styles.milestoneIcon}>
                                                    {task.completed ? <CheckCircleIcon height={24} width={24} stroke="#22c55e" /> : <View style={styles.milestoneDot} />}
                                                </View>
                                                <View style={styles.milestoneContent}>
                                                    {isEditing ? (
                                                        <TextInput 
                                                            style={styles.taskInput}
                                                            defaultValue={task.text}
                                                            onEndEditing={(e) => handleUpdateTask(task.id, e.nativeEvent.text)}
                                                        />
                                                    ) : (
                                                        <Text style={task.completed ? styles.taskTextCompleted : styles.taskText}>{task.text}</Text>
                                                    )}
                                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                        <Text style={styles.etaTextSm}>{task.eta}h</Text>
                                                        <TouchableOpacity onPress={() => handleDeleteTask(task.id)} style={{marginLeft: 8}}><Trash2Icon height={16} width={16} stroke="#ef4444" /></TouchableOpacity>
                                                    </View>
                                                </View>
                                                 {tip && !isEditing && <Text style={styles.tipText}>[Professor's Tip: {tip}]</Text>}
                                            </View>
                                        );
                                    })}
                                </View>
                                {isAdding && (
                                    <View style={styles.addForm}>
                                        <TextInput style={styles.addInput} placeholder="New milestone..." value={newTaskText} onChangeText={setNewTaskText} />
                                        <TextInput style={[styles.addInput, {width: 60}]} placeholder="ETA" value={newTaskEta} onChangeText={setNewTaskEta} keyboardType="numeric" />
                                        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}><Text style={styles.addButtonText}>Add</Text></TouchableOpacity>
                                    </View>
                                )}
                            </>
                        )}
                    </Card>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f4f5' },
    header: { padding: 20, paddingBottom: 10 },
    content: { paddingHorizontal: 20, paddingBottom: 20 },
    backButton: { color: '#007aff', fontSize: 16, marginBottom: 8 },
    detailTitle: { fontSize: 28, fontWeight: 'bold' },
    courseTitle: { fontSize: 16, color: '#007aff', fontWeight: '600', marginTop: 4 },
    descriptionBody: { fontSize: 15, color: '#6b7280', marginTop: 4, lineHeight: 22 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold' },
    headerButton: { color: '#007aff', fontWeight: '600' },
    etaText: { fontSize: 14, color: '#6b7280', marginBottom: 12 },
    etaTextSm: { fontSize: 12, color: '#6b7280' },
    milestoneItem: { paddingLeft: 30, marginBottom: 16, borderLeftWidth: 1, borderLeftColor: '#e5e7eb' },
    milestoneIcon: { position: 'absolute', left: -12, top: 0, backgroundColor: '#f4f4f5' },
    milestoneDot: { height: 12, width: 12, borderRadius: 6, backgroundColor: '#cbd5e1', marginTop: 4 },
    milestoneContent: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    taskText: { fontSize: 16, flex: 1 },
    taskInput: { fontSize: 16, flex: 1, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 6, padding: 4 },
    taskTextCompleted: { fontSize: 16, flex: 1, textDecorationLine: 'line-through', color: '#9ca3af' },
    tipText: { fontSize: 12, color: '#9ca3af', fontStyle: 'italic', marginTop: 4 },
    addForm: { flexDirection: 'row', gap: 8, marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
    addInput: { flex: 1, height: 40, backgroundColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 10 },
    addButton: { backgroundColor: '#007aff', paddingHorizontal: 16, height: 40, borderRadius: 8, justifyContent: 'center' },
    addButtonText: { color: 'white', fontWeight: 'bold' },
    generatingText: { textAlign: 'center', paddingVertical: 40, color: '#6b7280', fontStyle: 'italic' },
});

