import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { loadQuizzes } from '@/utils/storage';
import type { QuizSet } from '@/data/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface QuizResult {
  quizId: string;
  subject: string;
  title: string;
  score: number;
  correct: number;
  total: number;
  answers: (number | null)[];
  timeTaken: number;
}

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: '#1B4F8A', Biology: '#2E8B57', Chemistry: '#D4770A',
  Physics: '#6B2D99', English: '#C0392B', 'Civic Education': '#1A8BB8',
};

export default function QuizResultsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const [result, setResult] = useState<QuizResult | null>(null);
  const [quiz, setQuiz] = useState<QuizSet | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('@ecz_quiz_results').then(async raw => {
      if (raw) {
        const parsed: QuizResult = JSON.parse(raw);
        setResult(parsed);
        const quizzes = await loadQuizzes();
        const found = quizzes.find(q => q.id === parsed.quizId) ?? null;
        setQuiz(found);
      }
    });
  }, []);

  if (!result) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.mutedForeground, fontSize: 15, fontFamily: 'Inter_500Medium' }}>Loading results...</Text>
      </View>
    );
  }

  const subjectColor = SUBJECT_COLORS[result.subject] ?? colors.primary;
  const passed = result.score >= 50;
  const excellent = result.score >= 80;
  const mins = Math.floor(result.timeTaken / 60);
  const secs = result.timeTaken % 60;

  const getMessage = () => {
    if (excellent) return 'Excellent work! You are well prepared for ECZ!';
    if (passed) return 'Good effort! Keep practicing to improve your score.';
    return 'Keep studying! Review the topics you missed and try again.';
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={excellent ? ['#2E8B57', '#3DAF6A'] : passed ? [subjectColor, subjectColor + 'AA'] : ['#C0392B', '#E74C3C']}
        style={[styles.header, { paddingTop: topPad + 16 }]}
      >
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreValue}>{result.score}%</Text>
          <Text style={styles.scoreLabel}>{result.correct}/{result.total} correct</Text>
        </View>
        <Text style={styles.grade}>{excellent ? 'A' : passed ? 'B' : 'D'}</Text>
        <Text style={styles.message}>{getMessage()}</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: bottomPad + 80 }} showsVerticalScrollIndicator={false}>
        {/* Summary Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Score', value: `${result.score}%`, color: excellent ? '#2E8B57' : passed ? subjectColor : '#C0392B' },
            { label: 'Correct', value: `${result.correct}`, color: '#2E8B57' },
            { label: 'Wrong', value: `${result.total - result.correct}`, color: '#C0392B' },
            { label: 'Time', value: `${mins}m${secs}s`, color: colors.foreground },
          ].map(s => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Question Review */}
        {quiz && (
          <>
            <Text style={[styles.reviewTitle, { color: colors.foreground }]}>Question Review</Text>
            {quiz.questions.map((q, i) => {
              const userAnswer = result.answers[i];
              const isCorrect = userAnswer === q.correctIndex;
              return (
                <View key={q.id} style={[styles.reviewCard, { backgroundColor: colors.card, borderColor: isCorrect ? '#2E8B5740' : '#C0392B40', borderLeftColor: isCorrect ? '#2E8B57' : '#C0392B' }]}>
                  <View style={styles.reviewHeader}>
                    <Ionicons name={isCorrect ? 'checkmark-circle' : 'close-circle'} size={20} color={isCorrect ? '#2E8B57' : '#C0392B'} />
                    <Text style={[styles.qNum, { color: colors.mutedForeground }]}>Q{i + 1}</Text>
                  </View>
                  <Text style={[styles.qText, { color: colors.foreground }]}>{q.question}</Text>
                  {!isCorrect && userAnswer !== null && (
                    <View style={styles.answerRow}>
                      <Ionicons name="close-circle-outline" size={14} color="#C0392B" />
                      <Text style={[styles.yourAnswer, { color: '#C0392B' }]}>Your answer: {q.options[userAnswer]}</Text>
                    </View>
                  )}
                  <View style={styles.answerRow}>
                    <Ionicons name="checkmark-circle-outline" size={14} color="#2E8B57" />
                    <Text style={[styles.correctAnswer, { color: '#2E8B57' }]}>Correct: {q.options[q.correctIndex]}</Text>
                  </View>
                  <Text style={[styles.explanation, { color: colors.mutedForeground }]}>{q.explanation}</Text>
                </View>
              );
            })}
          </>
        )}
      </ScrollView>

      {/* Actions */}
      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: bottomPad + 8 }]}>
        <TouchableOpacity style={[styles.secondaryBtn, { borderColor: colors.border }]} onPress={() => router.replace('/(tabs)/quiz')} activeOpacity={0.8}>
          <Ionicons name="list-outline" size={18} color={colors.foreground} />
          <Text style={[styles.secondaryBtnText, { color: colors.foreground }]}>All Quizzes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: subjectColor }]}
          onPress={() => router.replace({ pathname: '/quiz/[id]', params: { id: result.quizId } })}
          activeOpacity={0.8}
        >
          <Ionicons name="refresh-outline" size={18} color="#fff" />
          <Text style={styles.primaryBtnText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', paddingHorizontal: 20, paddingBottom: 28, gap: 8 },
  scoreCircle: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)',
    gap: 2,
  },
  scoreValue: { fontSize: 32, fontFamily: 'Inter_700Bold', color: '#fff' },
  scoreLabel: { fontSize: 13, fontFamily: 'Inter_500Medium', color: 'rgba(255,255,255,0.85)' },
  grade: { fontSize: 48, fontFamily: 'Inter_700Bold', color: 'rgba(255,255,255,0.9)' },
  message: { fontSize: 14, fontFamily: 'Inter_500Medium', color: 'rgba(255,255,255,0.9)', textAlign: 'center', paddingHorizontal: 20 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  statCard: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 10, alignItems: 'center', gap: 3 },
  statValue: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  reviewTitle: { fontSize: 17, fontFamily: 'Inter_700Bold', marginBottom: 12 },
  reviewCard: {
    borderRadius: 12, borderWidth: 1, borderLeftWidth: 4, padding: 14, marginBottom: 10, gap: 6,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  qNum: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  qText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', lineHeight: 20 },
  answerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  yourAnswer: { fontSize: 13, fontFamily: 'Inter_500Medium', flex: 1 },
  correctAnswer: { fontSize: 13, fontFamily: 'Inter_600SemiBold', flex: 1 },
  explanation: { fontSize: 12, fontFamily: 'Inter_400Regular', lineHeight: 18, marginTop: 2, fontStyle: 'italic' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', paddingHorizontal: 16, paddingTop: 12, gap: 10, borderTopWidth: 1 },
  secondaryBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 12, borderWidth: 1.5, height: 52 },
  secondaryBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  primaryBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 12, height: 52 },
  primaryBtnText: { color: '#fff', fontSize: 15, fontFamily: 'Inter_600SemiBold' },
});
