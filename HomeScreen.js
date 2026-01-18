import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from './firebaseConfig';

export default function HomeScreen({ navigation }) {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Get Today's Question
      const today = new Date().toISOString().split('T')[0];
      const q = query(collection(db, "questions"));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        setQuestion({ id: docSnap.id, ...docSnap.data() });
      }

      // 2. Get User Streak
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        setStreak(userDocSnap.data().streak || 0);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{marginTop: 50}} />;

  return (
    <View style={styles.container}>
      {/* Header with Streak */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>Daily Quest</Text>
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>🔥 {streak}</Text>
        </View>
      </View>
      
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

      <View style={styles.logoutBtn}>
        <Button title="Logout" onPress={() => auth.signOut()} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#fff' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  header: { fontSize: 28, fontWeight: 'bold' },
  streakBadge: { backgroundColor: '#ffebee', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: '#ffcdd2' },
  streakText: { color: '#d32f2f', fontWeight: 'bold', fontSize: 16 },
  card: { backgroundColor: '#e3f2fd', padding: 20, borderRadius: 15, marginBottom: 20, elevation: 3 },
  cardTitle: { color: '#1565c0', fontWeight: 'bold', marginBottom: 5, textTransform: 'uppercase', fontSize: 12 },
  qTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  tag: { color: '#555', marginTop: 8, fontStyle: 'italic' },
  message: { fontSize: 16, textAlign: 'center', color: 'gray', marginTop: 20 },
  logoutBtn: { marginTop: 'auto' }
});