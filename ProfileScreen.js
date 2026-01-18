import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db, auth } from './firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const [stats, setStats] = useState({ streak: 0, totalSolved: 0 });
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchStats = async () => {
      // 1. Get User Streak
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const streak = userDoc.exists() ? (userDoc.data().streak || 0) : 0;

      // 2. Get Total Solved (Count documents in 'submissions')
      const submissionsSnap = await getDocs(collection(db, "users", user.uid, "submissions"));
      const totalSolved = submissionsSnap.size;

      setStats({ streak, totalSolved });
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) return (
    <LinearGradient colors={['#2E0249', '#57C5B6']} style={styles.container}>
      <ActivityIndicator size="large" color="#fff" />
    </LinearGradient>
  );

  return (
    <LinearGradient colors={['#2E0249', '#57C5B6']} style={styles.container}>
      <Text style={styles.header}>Hippo Stats 📊</Text>
      <Text style={styles.subHeader}>{user.email}</Text>

      <View style={styles.grid}>
        {/* Streak Card */}
        <View style={styles.glassCard}>
          <Text style={styles.emoji}>🔥</Text>
          <Text style={styles.number}>{stats.streak}</Text>
          <Text style={styles.label}>Current Streak</Text>
        </View>

        {/* Total Solved Card */}
        <View style={styles.glassCard}>
          <Text style={styles.emoji}>✅</Text>
          <Text style={styles.number}>{stats.totalSolved}</Text>
          <Text style={styles.label}>Problems Solved</Text>
        </View>
      </View>

      {/* Consistency Message */}
      <View style={[styles.glassCard, { marginTop: 20, width: '100%' }]}>
        <Text style={styles.label}>Attempt Consistency</Text>
        <Text style={styles.consistencyText}>
          {stats.totalSolved > 0 
            ? "You are doing great! Keep feeding the hippo!" 
            : "Start solving problems to build your stats!"}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, alignItems: 'center' },
  header: { fontSize: 30, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  subHeader: { fontSize: 14, color: '#ccc', marginBottom: 30 },
  grid: { flexDirection: 'row', gap: 15 },
  glassCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emoji: { fontSize: 30, marginBottom: 10 },
  number: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  label: { fontSize: 12, color: '#ddd', marginTop: 5, textTransform: 'uppercase' },
  consistencyText: { color: '#fff', fontSize: 16, marginTop: 10, fontStyle: 'italic', textAlign: 'center' }
});