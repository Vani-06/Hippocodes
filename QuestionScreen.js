import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebaseConfig';

export default function QuestionScreen({ route }) {
  const { question } = route.params;
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');

  const userId = auth.currentUser.uid;

  useEffect(() => {
    checkSubmission();
  }, []);

  const checkSubmission = async () => {
    const docRef = doc(db, "users", userId, "submissions", question.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setSubmitted(true);
      setUserAnswer(docSnap.data().answer);
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    
    await setDoc(doc(db, "users", userId, "submissions", question.id), {
      answer: answer,
      timestamp: serverTimestamp()
    });

    setSubmitted(true);
    setUserAnswer(answer);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{question.title}</Text>
      <Text style={styles.body}>{question.body}</Text>
      
      <View style={styles.divider} />

      {submitted ? (
        <View>
          <Text style={styles.label}>✅ Your Answer:</Text>
          <Text style={styles.codeBlock}>{userAnswer}</Text>
          
          <Text style={[styles.label, {marginTop: 20}]}>🔓 Official Solution:</Text>
          <Text style={[styles.codeBlock, {backgroundColor: '#e8f5e9'}]}>
            {question.solution}
          </Text>
        </View>
      ) : (
        <View>
          <Text style={styles.label}>Submit your logic to reveal solution:</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={6}
            placeholder="Type your code here..."
            value={answer}
            onChangeText={setAnswer}
          />
          <Button title="Submit & Reveal" onPress={handleSubmit} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  body: { fontSize: 16, lineHeight: 24 },
  divider: { height: 1, backgroundColor: '#ccc', marginVertical: 20 },
  label: { fontWeight: 'bold', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 10, height: 100, textAlignVertical: 'top' },
  codeBlock: { fontFamily: 'monospace', backgroundColor: '#f5f5f5', padding: 10, borderRadius: 5 }
});