// File: src/components/ProjectFormModal.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert } from 'react-native';
import { Assignment, GroupProject } from '../app/_layout';

// --- Type Definitions for the component's props ---
interface Props {
    mode: 'individual' | 'group';
    visible: boolean;
    onClose: () => void;
    onSave: (projectData: { title: string; course: string; dueDate: string; description: string; }) => void;
    projectToEdit: Assignment | GroupProject | null;
}

const ProjectFormModal: React.FC<Props> = ({ mode, visible, onClose, onSave, projectToEdit }) => {
    const [title, setTitle] = useState('');
    const [course, setCourse] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        // This effect runs when the modal becomes visible or the project to edit changes.
        // It pre-fills the form with the existing project's data if in "edit" mode.
        if (visible) {
            setTitle(projectToEdit?.title || '');
            setCourse(projectToEdit?.course || '');
            setDueDate(projectToEdit?.dueDate || '');
            // Safely access description, which only exists on Assignments
            setDescription((projectToEdit as Assignment)?.description || '');
        }
    }, [projectToEdit, visible]);

    const handleSave = () => {
        // Validate that all fields are filled
        if (!title || !course || !dueDate || (mode === 'individual' && !description)) {
            Alert.alert('Missing Fields', 'Please fill out all fields.');
            return;
        }
        // Validate the date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dueDate)) {
            Alert.alert('Invalid Date Format', 'Please enter the due date in YYYY-MM-DD format.');
            return;
        }
        onSave({ title, course, dueDate, description });
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <ScrollView contentContainerStyle={styles.modalScrollView}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{projectToEdit ? 'Edit' : 'New'} {mode === 'individual' ? 'Individual Project' : 'Group Project'}</Text>
                        <TextInput style={styles.input} placeholder="Project Title" value={title} onChangeText={setTitle} />
                        <TextInput style={styles.input} placeholder="Course Name (e.g., CS101)" value={course} onChangeText={setCourse} />
                        <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} placeholder="Description" value={description} onChangeText={setDescription} multiline />
                        <TextInput style={styles.input} placeholder="Due Date (YYYY-MM-DD)" value={dueDate} onChangeText={setDueDate} keyboardType="numeric" />
                        
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}><Text style={styles.cancelButtonText}>Cancel</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={handleSave}><Text style={styles.buttonText}>Save Project</Text></TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalScrollView: { flexGrow: 1, justifyContent: 'center', width: '100%' },
    modalContent: { width: '90%', maxWidth: 500, backgroundColor: 'white', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    input: { height: 50, backgroundColor: '#f4f4f5', marginBottom: 12, paddingHorizontal: 15, borderRadius: 10, borderWidth: 1, borderColor: '#e4e4e7' },
    modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    button: { flex: 1, height: 50, backgroundColor: '#007aff', borderRadius: 10, alignItems: 'center', justifyContent: 'center', },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    cancelButton: { backgroundColor: '#e4e4e7', marginRight: 10 },
    cancelButtonText: { color: '#18181b' },
});

export default ProjectFormModal;

