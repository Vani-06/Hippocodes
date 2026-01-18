import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from './firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation }) {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Get Question
      const q = query(collection(db, "questions")); 
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        setQuestion({ id: docSnap.id, ...docSnap.data() });
      }

      // 2. Get Streak
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setStreak(userDocSnap.data().streak || 0);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return (
    <LinearGradient colors={['#2E0249', '#57C5B6']} style={styles.container}>
      <ActivityIndicator size="large" color="#fff" />
    </LinearGradient>
  );

  return (
    <LinearGradient colors={['#2E0249', '#57C5B6']} style={styles.container}>
      
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>Hippo Quest</Text>
        
        {/* ✅ CHANGED: Now a button that goes to Profile */}
        <TouchableOpacity 
          style={styles.streakBadge}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.streakText}>🔥 {streak}</Text>
        </TouchableOpacity>
      </View>
      
      {question ? (
        <TouchableOpacity 
          style={styles.glassCard}
          onPress={() => navigation.navigate('Question', { question })}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeText}>DAILY CHALLENGE</Text>
          </View>
          <Text style={styles.qTitle}>{question.title}</Text>
          <View style={styles.tagRow}>
             <Text style={styles.tag}>{question.difficulty}</Text>
             <Text style={styles.tag}>•</Text>
             <Text style={styles.tag}>{question.topic}</Text>
          </View>
          <Text style={styles.tapText}>Tap to Solve ➔</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.message}>No quests in the swamp today.</Text>
      )}

      <TouchableOpacity style={styles.logoutBtn} onPress={() => auth.signOut()}>
        <Text style={{color: 'rgba(255,255,255,0.7)'}}>Logout</Text>
      </TouchableOpacity>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 },
  header: { fontSize: 32, fontWeight: 'bold', color: '#fff', textShadowColor: 'rgba(0,0,0,0.3)', textShadowRadius: 10 },
  streakBadge: { backgroundColor: 'rgba(248, 6, 204, 0.2)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#F806CC' },
  streakText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderRadius: 30,
    padding: 25,
    minHeight: 200,
    justifyContent: 'center'
  },
  badge: { backgroundColor: '#57C5B6', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginBottom: 15 },
  badgeText: { color: '#000', fontWeight: '900', fontSize: 10, letterSpacing: 1 },
  qTitle: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  tagRow: { flexDirection: 'row', gap: 10 },
  tag: { color: '#ccc', fontSize: 16 },
  tapText: { color: '#F806CC', marginTop: 20, fontWeight: 'bold' },
  
  message: { fontSize: 16, textAlign: 'center', color: '#ccc', marginTop: 20 },
  logoutBtn: { marginTop: 'auto', alignSelf: 'center', padding: 20 }
});