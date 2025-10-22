import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { supabase } from '../src/lib/supabase';

export default function AiPlannerModal({ assignments, onSavePlan, onCancel }) {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingAssignmentId, setLoadingAssignmentId] = useState(null);

    const handlePlan = async (assignment) => {
        setIsLoading(true);
        setLoadingAssignmentId(assignment.id);

        console.log(`Invoking Supabase function for: ${assignment.title}`);

        try {
            // This is the call to your deployed Supabase Edge Function
            const { data, error } = await supabase.functions.invoke('generate-milestones', {
                body: { 
                    assignmentTitle: assignment.title, 
                    assignmentDescription: assignment.description,
                    professorName: assignment.professorAnalysis?.name // Added professor name for more context
                },
            });
            
            // --- DETAILED DEBUGGING LOGS ---
            console.log("Response from Supabase function:");
            console.log("Data:", JSON.stringify(data, null, 2));
            console.log("Error:", JSON.stringify(error, null, 2));
            // ---------------------------------

            if (error) {
                // This will now catch function-level errors (e.g., 404, 500)
                throw new Error(`Supabase function failed: ${error.message}`);
            }
            
            // Check if the data returned from the function contains an error from the Gemini API
            if (data && data.error) {
                throw new Error(`Gemini API error inside function: ${data.error}`);
            }

            if (!data || !data.milestones) {
                throw new Error("AI response did not contain valid milestones. Check the Supabase function logs for the full Gemini response.");
            }

            // Create new task objects from the Gemini response
            const newTasks = data.milestones.map(m => ({
                id: Math.random(), // Temporary ID for the key
                text: m.text,
                eta: m.eta || 0,
                completed: false,
            }));

            const totalEta = newTasks.reduce((sum, task) => sum + task.eta, 0);

            // Call the onSavePlan function passed from the dashboard to update the state
            onSavePlan({
                ...assignment,
                tasks: newTasks,
                totalEta: totalEta,
            });

        } catch (error) {
            // This will now display a more informative alert and log the full error
            console.error('handlePlan error:', error);
            Alert.alert(
                'Error Generating Plan', 
                `An error occurred: ${error.message}. Check the terminal console for more details.`
            );
        } finally {
            setIsLoading(false);
            setLoadingAssignmentId(null);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select an Assignment to Plan</Text>
            <Text style={styles.subtitle}>Choose an assignment and the AI will generate a project plan with milestones for you.</Text>
            <ScrollView>
                {assignments.length > 0 ? assignments.map(a => (
                    <TouchableOpacity 
                        key={a.id} 
                        style={styles.item} 
                        onPress={() => handlePlan(a)}
                        disabled={isLoading}
                    >
                        <Text style={styles.itemText}>{a.title}</Text>
                        {isLoading && loadingAssignmentId === a.id && (
                            <ActivityIndicator />
                        )}
                    </TouchableOpacity>
                )) : (
                    <Text style={styles.noAssignmentsText}>No unplanned assignments found. Create one on the dashboard first!</Text>
                )}
            </ScrollView>
             <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        padding: 20, 
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    title: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        marginBottom: 4 
    },
    subtitle: { 
        fontSize: 14, 
        color: '#6b7280', 
        marginBottom: 20 
    },
    item: { 
        paddingVertical: 16, 
        borderBottomWidth: 1, 
        borderBottomColor: '#eee', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
    },
    itemText: { 
        fontSize: 16 
    },
    cancelButton: { 
        marginTop: 20, 
        padding: 12, 
        alignItems: 'center' 
    },
    cancelButtonText: { 
        color: '#007aff', 
        fontWeight: '600' 
    },
    noAssignmentsText: {
        textAlign: 'center',
        color: '#6b7280',
        marginTop: 40,
        paddingHorizontal: 20,
    }
});

