import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity,
  TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useColors } from '@/hooks/useColors';
import { saveQuiz } from '@/utils/storage';
import { SUBJECTS } from '@/data/mockData';
import type { QuizQuestion } from '@/data/mockData';

const GRADES = ['7', '9', '12'];
const PARTS = Array.from({ length: 11 }, (_, i) => i + 1); // Part 1 – Part 11
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const;
const NUM_QUESTIONS = 10;

interface QuestionDraft {
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

function makeBlankQuestion(): QuestionDraft {
  return { question: '', options: ['', '', '', ''], correctIndex: 0, explanation: '' };
}

export default function CreateQuizScreen() {
  const { user } = useAuth();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  // Step 1 fields
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [grade, setGrade] = useState('12');
  const [title, setTitle] = useState('');
  const [part, setPart] = useState(1);
  const [difficulty, setDifficulty] = useState<typeof DIFFICULTIES[number]>('Medium');

  // Step 2: questions
  const [questions, setQuestions] = useState<QuestionDraft[]>(
    Array.from({ length: NUM_QUESTIONS }, makeBlankQuestion)
  );

  const [step, setStep] = useState<1 | 2>(1);
  const [saving, setSaving] = useState(false);
  const [activeQ, setActiveQ] = useState(0);

  // ── helpers ───────────────────────────────────────────────
  const updateQuestion = (idx: number, field: keyof QuestionDraft, value: any) => {
    setQuestions(prev => {
      const next = [...prev];
      if (field === 'options') {
        next[idx] = { ...next[idx], options: value };
      } else {
        (next[idx] as any)[field] = value;
      }
      return next;
    });
  };

  const updateOption = (qIdx: number, oIdx: number, value: string) => {
    setQuestions(prev => {
      const next = [...prev];
      const opts = [...next[qIdx].options] as [string, string, string, string];
      opts[oIdx] = value;
      next[qIdx] = { ...next[qIdx], options: opts };
      return next;
    });
  };

  const goToStep2 = () => {
    if (!title.trim()) { Alert.alert('Missing Title', 'Please enter a quiz title.'); return; }
    setStep(2);
  };

  const handleSave = async () => {
    // Validate all questions have text and at least 2 options
    for (let i = 0; i < NUM_QUESTIONS; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        Alert.alert('Incomplete', `Question ${i + 1} is missing the question text.`);
        setActiveQ(i);
        return;
      }
      const filledOptions = q.options.filter(o => o.trim()).length;
      if (filledOptions < 2) {
        Alert.alert('Incomplete', `Question ${i + 1} needs at least 2 answer options.`);
        setActiveQ(i);
        return;
      }
    }

    setSaving(true);
    try {
      const quizQuestions: QuizQuestion[] = questions.map((q, i) => ({
        id: `q${Date.now()}_${i}`,
        question: q.question.trim(),
        options: q.options.map(o => o.trim()).filter(Boolean),
        correctIndex: q.correctIndex,
        explanation: q.explanation.trim(),
      }));

      await saveQuiz({
        id: `quiz_${Date.now()}`,
        subject,
        grade,
        title: title.trim(),
        part,
        questionCount: NUM_QUESTIONS,
        durationMinutes: 20,
        difficulty,
        uploadedBy: user?.name ?? 'Teacher',
        school: user?.school ?? '',
        createdAt: new Date().toISOString().split('T')[0],
        questions: quizQuestions,
      });

      Alert.alert('Quiz Created! ✓', `"${title}" (Part ${part}) has been saved and is now visible to students.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to save quiz. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── render step 1 ────────────────────────────────────────
  const renderStep1 = () => (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: bottomPad + 80 }} showsVerticalScrollIndicator={false}>
      <Text style={[styles.stepLabel, { color: colors.mutedForeground }]}>STEP 1 OF 2 — QUIZ INFO</Text>

      <Text style={[styles.label, { color: colors.foreground }]}>Quiz Title *</Text>
      <TextInput
        style={[styles.input, { color: colors.foreground, backgroundColor: colors.muted, borderColor: colors.border }]}
        placeholder="e.g. Algebra & Functions"
        placeholderTextColor={colors.mutedForeground}
        value={title}
        onChangeText={setTitle}
      />

      <Text style={[styles.label, { color: colors.foreground }]}>Subject *</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {SUBJECTS.slice(0, 7).map(s => (
          <TouchableOpacity
            key={s}
            style={[styles.chip, { backgroundColor: subject === s ? '#2E8B57' : colors.muted, borderColor: subject === s ? '#2E8B57' : colors.border }]}
            onPress={() => setSubject(s)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, { color: subject === s ? '#fff' : colors.foreground }]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={[styles.label, { color: colors.foreground }]}>Grade *</Text>
      <View style={styles.gradeRow}>
        {GRADES.map(g => (
          <TouchableOpacity
            key={g}
            style={[styles.gradeBtn, { backgroundColor: grade === g ? '#2E8B57' : colors.muted, borderColor: grade === g ? '#2E8B57' : colors.border }]}
            onPress={() => setGrade(g)}
            activeOpacity={0.7}
          >
            <Text style={[styles.gradeBtnText, { color: grade === g ? '#fff' : colors.foreground }]}>Grade {g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.label, { color: colors.foreground }]}>Part Number</Text>
      <Text style={[styles.hint, { color: colors.mutedForeground }]}>Each part contains 10 questions. You can create up to Part 11.</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {PARTS.map(p => (
          <TouchableOpacity
            key={p}
            style={[styles.partChip, { backgroundColor: part === p ? '#2E8B57' : colors.muted, borderColor: part === p ? '#2E8B57' : colors.border }]}
            onPress={() => setPart(p)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, { color: part === p ? '#fff' : colors.foreground }]}>Part {p}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={[styles.label, { color: colors.foreground }]}>Difficulty</Text>
      <View style={styles.gradeRow}>
        {DIFFICULTIES.map(d => {
          const col = d === 'Easy' ? '#2E8B57' : d === 'Medium' ? '#D4770A' : '#C0392B';
          return (
            <TouchableOpacity
              key={d}
              style={[styles.gradeBtn, { backgroundColor: difficulty === d ? col : colors.muted, borderColor: difficulty === d ? col : colors.border }]}
              onPress={() => setDifficulty(d)}
              activeOpacity={0.7}
            >
              <Text style={[styles.gradeBtnText, { color: difficulty === d ? '#fff' : colors.foreground }]}>{d}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={[styles.nextBtn, { backgroundColor: '#2E8B57' }]} onPress={goToStep2} activeOpacity={0.85}>
        <Text style={styles.nextBtnText}>Next: Add {NUM_QUESTIONS} Questions</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );

  // ── render step 2 ────────────────────────────────────────
  const renderStep2 = () => {
    const q = questions[activeQ];
    return (
      <View style={{ flex: 1 }}>
        {/* Question tabs */}
        <View style={[styles.qTabBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.qTabScroll}>
            {questions.map((qItem, i) => {
              const filled = qItem.question.trim().length > 0;
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.qTab, {
                    backgroundColor: activeQ === i ? '#2E8B57' : filled ? '#2E8B5720' : colors.muted,
                    borderColor: activeQ === i ? '#2E8B57' : filled ? '#2E8B5760' : colors.border,
                  }]}
                  onPress={() => setActiveQ(i)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.qTabText, { color: activeQ === i ? '#fff' : filled ? '#2E8B57' : colors.foreground }]}>
                    Q{i + 1}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: bottomPad + 80 }} showsVerticalScrollIndicator={false}>
          <Text style={[styles.stepLabel, { color: colors.mutedForeground }]}>
            STEP 2 OF 2 — QUESTION {activeQ + 1} OF {NUM_QUESTIONS}
          </Text>
          <Text style={[styles.quizMeta, { color: colors.mutedForeground }]}>
            {subject} · Grade {grade} · Part {part}
          </Text>

          <Text style={[styles.label, { color: colors.foreground }]}>Question Text *</Text>
          <TextInput
            style={[styles.input, styles.multiline, { color: colors.foreground, backgroundColor: colors.muted, borderColor: colors.border }]}
            placeholder="Type the question here..."
            placeholderTextColor={colors.mutedForeground}
            value={q.question}
            onChangeText={v => updateQuestion(activeQ, 'question', v)}
            multiline
            textAlignVertical="top"
          />

          <Text style={[styles.label, { color: colors.foreground }]}>Answer Options *</Text>
          <Text style={[styles.hint, { color: colors.mutedForeground }]}>Tap the circle next to the correct answer.</Text>

          {q.options.map((opt, oIdx) => (
            <View key={oIdx} style={styles.optionRow}>
              <TouchableOpacity
                style={[styles.correctCircle, { borderColor: q.correctIndex === oIdx ? '#2E8B57' : colors.border, backgroundColor: q.correctIndex === oIdx ? '#2E8B57' : 'transparent' }]}
                onPress={() => updateQuestion(activeQ, 'correctIndex', oIdx)}
                activeOpacity={0.7}
              >
                {q.correctIndex === oIdx && <Ionicons name="checkmark" size={14} color="#fff" />}
              </TouchableOpacity>
              <TextInput
                style={[styles.optionInput, { color: colors.foreground, backgroundColor: colors.muted, borderColor: q.correctIndex === oIdx ? '#2E8B57' : colors.border }]}
                placeholder={`Option ${oIdx + 1}`}
                placeholderTextColor={colors.mutedForeground}
                value={opt}
                onChangeText={v => updateOption(activeQ, oIdx, v)}
              />
            </View>
          ))}

          <Text style={[styles.label, { color: colors.foreground }]}>Explanation (optional)</Text>
          <TextInput
            style={[styles.input, { color: colors.foreground, backgroundColor: colors.muted, borderColor: colors.border }]}
            placeholder="Explain why the correct answer is right..."
            placeholderTextColor={colors.mutedForeground}
            value={q.explanation}
            onChangeText={v => updateQuestion(activeQ, 'explanation', v)}
          />

          {/* Prev / Next */}
          <View style={styles.navRow}>
            {activeQ > 0 ? (
              <TouchableOpacity style={[styles.navBtn, { backgroundColor: colors.muted, borderColor: colors.border }]} onPress={() => setActiveQ(activeQ - 1)} activeOpacity={0.7}>
                <Ionicons name="arrow-back" size={18} color={colors.foreground} />
                <Text style={[styles.navBtnText, { color: colors.foreground }]}>Prev</Text>
              </TouchableOpacity>
            ) : <View style={{ flex: 1 }} />}

            {activeQ < NUM_QUESTIONS - 1 ? (
              <TouchableOpacity style={[styles.navBtn, { backgroundColor: '#2E8B57' }]} onPress={() => setActiveQ(activeQ + 1)} activeOpacity={0.7}>
                <Text style={[styles.navBtnText, { color: '#fff' }]}>Next</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.navBtn, { backgroundColor: '#2E8B57', opacity: saving ? 0.7 : 1 }]} onPress={handleSave} disabled={saving} activeOpacity={0.85}>
                {saving ? <ActivityIndicator color="#fff" size="small" /> : <>
                  <Ionicons name="checkmark-done" size={18} color="#fff" />
                  <Text style={[styles.navBtnText, { color: '#fff' }]}>Save Quiz</Text>
                </>}
              </TouchableOpacity>
            )}
          </View>

          {/* Also show a save button at the bottom for convenience */}
          {activeQ === NUM_QUESTIONS - 1 && (
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: '#2E8B57', opacity: saving ? 0.7 : 1 }]}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.85}
            >
              {saving
                ? <ActivityIndicator color="#fff" />
                : <>
                    <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
                    <Text style={styles.saveBtnText}>Save Quiz for Students</Text>
                  </>
              }
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient colors={['#2E8B57', '#3DAF6A']} style={[styles.header, { paddingTop: topPad + 8 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => step === 2 ? setStep(1) : router.back()} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Create Quiz</Text>
            <Text style={styles.headerSub}>{step === 1 ? 'Set quiz info' : `${title} · Part ${part} · ${NUM_QUESTIONS} questions`}</Text>
          </View>
        </View>
        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${step === 1 ? 50 : 100}%` }]} />
        </View>
      </LinearGradient>

      {step === 1 ? renderStep1() : renderStep2()}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#fff' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter_400Regular' },
  progressBar: { height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)' },
  progressFill: { height: 4, borderRadius: 2, backgroundColor: '#fff' },
  stepLabel: { fontSize: 11, fontFamily: 'Inter_700Bold', letterSpacing: 1, marginBottom: 16 },
  quizMeta: { fontSize: 13, fontFamily: 'Inter_500Medium', marginBottom: 16, marginTop: -12 },
  label: { fontSize: 14, fontFamily: 'Inter_600SemiBold', marginBottom: 8, marginTop: 4 },
  hint: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: -4, marginBottom: 8, lineHeight: 17 },
  input: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, fontFamily: 'Inter_400Regular', marginBottom: 12 },
  multiline: { minHeight: 80, textAlignVertical: 'top', paddingTop: 12 },
  chipRow: { marginBottom: 12 },
  chip: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8 },
  partChip: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8 },
  chipText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  gradeRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  gradeBtn: { flex: 1, borderRadius: 10, borderWidth: 1, paddingVertical: 10, alignItems: 'center' },
  gradeBtnText: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  nextBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 56, borderRadius: 14, marginTop: 16 },
  nextBtnText: { color: '#fff', fontSize: 17, fontFamily: 'Inter_700Bold' },
  qTabBar: { borderBottomWidth: 1 },
  qTabScroll: { paddingHorizontal: 12, paddingVertical: 10, gap: 6 },
  qTab: { borderRadius: 8, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6 },
  qTabText: { fontSize: 12, fontFamily: 'Inter_700Bold' },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  correctCircle: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  optionInput: { flex: 1, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, fontFamily: 'Inter_400Regular' },
  navRow: { flexDirection: 'row', gap: 12, marginTop: 8, marginBottom: 8 },
  navBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 48, borderRadius: 12, borderWidth: 1 },
  navBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 56, borderRadius: 14, marginTop: 8 },
  saveBtnText: { color: '#fff', fontSize: 17, fontFamily: 'Inter_700Bold' },
});
