// File: app/assignment/[id].tsx
import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
// Note: We are no longer using the useApp context for data in this file.

export default function AssignmentDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [assignment, setAssignment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // This function fetches data from your new backend.
        const fetchAssignment = async () => {
            try {
                // In a real app, you would replace this URL with your actual server address.
                const response = await fetch(`http://localhost:3001/api/assignments/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch assignment data.');
                }
                const data = await response.json();
                setAssignment(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssignment();
    }, [id]); // This effect runs whenever the 'id' parameter changes.

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#007aff" />
            </SafeAreaView>
        );
    }

    if (error || !assignment) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>{error || 'Assignment not found.'}</Text>
                 <TouchableOpacity onPress={() => router.back()} style={{ padding: 20 }}>
                    <Text style={styles.backButton}>← Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
         <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={{ padding: 20 }}>
                <Text style={styles.backButton}>← Back to Dashboard</Text>
            </TouchableOpacity>
            <Text style={styles.detailTitle}>{assignment.title}</Text>
            <Text style={styles.courseTitle}>{assignment.course}</Text>
            {/* You would translate your AssignmentDetail component here */}
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f5',
        justifyContent: 'center',
        alignItems: 'center'
    },
    backButton: {
        color: '#007aff',
        fontSize: 16,
        position: 'absolute',
        top: 20,
        left: 20,
    },
    detailTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        paddingHorizontal: 20,
        textAlign: 'center',
    },
    courseTitle: {
        fontSize: 18,
        color: '#6b7280',
        paddingHorizontal: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    }
});

