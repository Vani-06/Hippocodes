import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from './firebaseConfig';

export default function HomeScreen({ navigation }) {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodayQuestion = async () => {
      // Get today's date as YYYY-MM-DD
      const today = new Date().toISOString().split('T')[0];
      
      const q = query(collection(db, "questions"), where("date", "==", today));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setQuestion({ id: doc.id, ...doc.data() });
      }
      setLoading(false);
    };

    fetchTodayQuestion();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{marginTop: 50}} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Daily Quest</Text>
      
      {question ? (
        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('Question', { question })}
        >
          <Text style={styles.cardTitle}>Today's Challenge</Text>
          <Text style={styles.qTitle}>{question.title}</Text>
          <Text style={styles.tag}>{question.difficulty} • {question.topic}</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.message}>No question for today. Check back tomorrow!</Text>
      )}

      <Button title="Logout" onPress={() => auth.signOut()} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 30 },
  card: { backgroundColor: '#e3f2fd', padding: 20, borderRadius: 10, marginBottom: 20 },
  cardTitle: { color: '#1565c0', fontWeight: 'bold', marginBottom: 5 },
  qTitle: { fontSize: 20, fontWeight: 'bold' },
  tag: { color: '#666', marginTop: 5 },
  message: { fontSize: 16, textAlign: 'center', color: 'gray' }
});