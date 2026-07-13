import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { loadQuizzes } from '@/utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import type { QuizSet } from '@/data/mockData';

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: '#1B4F8A', Biology: '#2E8B57', Chemistry: '#D4770A',
  Physics: '#6B2D99', English: '#C0392B', 'Civic Education': '#1A8BB8',
};

export default function QuizTakeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const [quiz, setQuiz] = useState<QuizSet | null>(null);
  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [submitted, setSubmitted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    (async () => {
      const quizzes = await loadQuizzes();
      const found = quizzes.find(q => q.id === id) ?? null;
      setQuiz(found);
      if (found) {
        setAnswers(new Array(found.questions.length).fill(null));
        setTimeLeft(found.durationMinutes * 60);
      }
      setLoadingQuiz(false);
    })();
  }, [id]);

  useEffect(() => {
    if (!quiz) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          doSubmitRef.current(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [quiz]);

  // Keep a stable ref to doSubmit so the timer can call it
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const doSubmitRef = useRef((timeUp = false) => {});

  if (loadingQuiz) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!quiz) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, padding: 32 }}>
        <Ionicons name="school-outline" size={64} color={colors.mutedForeground} />
        <Text style={{ color: colors.foreground, fontSize: 18, fontFamily: 'Inter_700Bold', marginTop: 16 }}>Quiz Not Found</Text>
        <Text style={{ color: colors.mutedForeground, fontSize: 15, fontFamily: 'Inter_400Regular', textAlign: 'center', marginTop: 8 }}>
          This quiz may have been removed by the teacher.
        </Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 24 }}>
          <Text style={{ color: colors.primary, fontSize: 15, fontFamily: 'Inter_600SemiBold' }}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const question = quiz.questions[currentQ];
  const subjectColor = SUBJECT_COLORS[quiz.subject] ?? colors.primary;
  const progress = (currentQ + 1) / quiz.questions.length;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeWarning = timeLeft < 60;

  const handleSelect = (index: number) => {
    setSelected(index);
    try { Haptics.selectionAsync(); } catch {}
    const newAnswers = [...answersRef.current];
    newAnswers[currentQ] = index;
    setAnswers(newAnswers);
    answersRef.current = newAnswers;
  };

  const handleNext = () => {
    if (currentQ < quiz.questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(answersRef.current[currentQ + 1] ?? null);
    }
  };

  const handlePrev = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
      setSelected(answersRef.current[currentQ - 1] ?? null);
    }
  };

  const doSubmit = async (timeUp = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const ans = answersRef.current;
    const correct = ans.filter((a, i) => a === quiz.questions[i].correctIndex).length;
    const score = Math.round((correct / quiz.questions.length) * 100);
    const results = {
      quizId: id, subject: quiz.subject, title: quiz.title, part: quiz.part,
      score, correct, total: quiz.questions.length, answers: ans,
      timeTaken: quiz.durationMinutes * 60 - timeLeft,
    };
    await AsyncStorage.setItem('@ecz_quiz_results', JSON.stringify(results));
    try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
    router.replace('/quiz/results');
  };
  doSubmitRef.current = doSubmit;

  const handleSubmit = (timeUp = false) => {
    const ans = answersRef.current;
    if (!timeUp && ans.filter(a => a !== null).length < quiz.questions.length) {
      Alert.alert(
        'Unanswered Questions',
        `You have ${quiz.questions.length - ans.filter(a => a !== null).length} unanswered question(s). Submit anyway?`,
        [
          { text: 'Continue Quiz', style: 'cancel' },
          { text: 'Submit', onPress: () => doSubmit() },
        ]
      );
      return;
    }
    doSubmit();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => Alert.alert('Exit Quiz', 'Are you sure? Your progress will be lost.', [
              { text: 'Stay', style: 'cancel' },
              { text: 'Exit', onPress: () => router.back() },
            ])}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={[styles.quizTitle, { color: colors.foreground }]}>{quiz.subject} — Part {quiz.part}</Text>
            <Text style={[styles.quizSub, { color: colors.mutedForeground }]}>Q {currentQ + 1} of {quiz.questions.length}</Text>
          </View>
          <View style={[styles.timer, { backgroundColor: timeWarning ? '#C0392B15' : colors.muted, borderColor: timeWarning ? '#C0392B40' : colors.border }]}>
            <Ionicons name="time-outline" size={14} color={timeWarning ? '#C0392B' : colors.mutedForeground} />
            <Text style={[styles.timerText, { color: timeWarning ? '#C0392B' : colors.foreground }]}>{mins}:{secs.toString().padStart(2, '0')}</Text>
          </View>
        </View>
        <View style={[styles.progressBar, { backgroundColor: colors.muted }]}>
          <View style={[styles.progressFill, { backgroundColor: subjectColor, width: `${progress * 100}%` as any }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: bottomPad + 100 }} showsVerticalScrollIndicator={false}>
        {/* Question */}
        <View style={[styles.questionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.qNumber, { backgroundColor: subjectColor }]}>
            <Text style={styles.qNumberText}>Q{currentQ + 1}</Text>
          </View>
          <Text style={[styles.questionText, { color: colors.foreground }]}>{question.question}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsList}>
          {question.options.map((option, i) => {
            const isSelected = selected === i;
            return (
              <TouchableOpacity
                key={i}
                style={[styles.optionBtn, {
                  backgroundColor: isSelected ? subjectColor : colors.card,
                  borderColor: isSelected ? subjectColor : colors.border,
                  borderWidth: isSelected ? 2 : 1,
                }]}
                onPress={() => handleSelect(i)}
                activeOpacity={0.8}
              >
                <View style={[styles.optionLetter, { backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : colors.muted }]}>
                  <Text style={[styles.optionLetterText, { color: isSelected ? '#fff' : colors.foreground }]}>{['A', 'B', 'C', 'D'][i]}</Text>
                </View>
                <Text style={[styles.optionText, { color: isSelected ? '#fff' : colors.foreground }]}>{option}</Text>
                {isSelected && <Ionicons name="checkmark-circle" size={20} color="rgba(255,255,255,0.9)" />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Question dots */}
        <View style={styles.dotRow}>
          {quiz.questions.map((_, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.dot, {
                backgroundColor: answers[i] !== null ? subjectColor : i === currentQ ? colors.foreground : colors.muted,
                borderColor: i === currentQ ? colors.foreground : 'transparent',
              }]}
              onPress={() => { setCurrentQ(i); setSelected(answers[i] ?? null); }}
            />
          ))}
        </View>
      </ScrollView>

      {/* Navigation Footer */}
      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: bottomPad + 8 }]}>
        <TouchableOpacity
          style={[styles.navBtn, { borderColor: colors.border, opacity: currentQ === 0 ? 0.4 : 1 }]}
          onPress={handlePrev}
          disabled={currentQ === 0}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={18} color={colors.foreground} />
          <Text style={[styles.navBtnText, { color: colors.foreground }]}>Previous</Text>
        </TouchableOpacity>

        {currentQ < quiz.questions.length - 1 ? (
          <TouchableOpacity style={[styles.primaryNavBtn, { backgroundColor: subjectColor }]} onPress={handleNext} activeOpacity={0.8}>
            <Text style={styles.primaryNavBtnText}>Next</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.primaryNavBtn, { backgroundColor: '#2E8B57' }]} onPress={() => handleSubmit(false)} activeOpacity={0.8}>
            <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
            <Text style={styles.primaryNavBtnText}>Submit Quiz</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 10, borderBottomWidth: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  quizTitle: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  quizSub: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  timer: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 10, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 5 },
  timerText: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  progressBar: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  questionCard: {
    borderRadius: 16, borderWidth: 1, padding: 20, gap: 12, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  qNumber: { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  qNumberText: { color: '#fff', fontSize: 12, fontFamily: 'Inter_700Bold' },
  questionText: { fontSize: 17, fontFamily: 'Inter_600SemiBold', lineHeight: 25 },
  optionsList: { gap: 10, marginBottom: 20 },
  optionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  optionLetter: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  optionLetterText: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  optionText: { flex: 1, fontSize: 15, fontFamily: 'Inter_500Medium', lineHeight: 21 },
  dotRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, borderWidth: 2 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', paddingHorizontal: 16, paddingTop: 12, gap: 10, borderTopWidth: 1,
  },
  navBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 12, borderWidth: 1.5, height: 52 },
  navBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  primaryNavBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 12, height: 52 },
  primaryNavBtnText: { color: '#fff', fontSize: 15, fontFamily: 'Inter_600SemiBold' },
});
