import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import type { QuizSet } from '@/data/mockData';

const SUBJECT_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Mathematics: 'calculator-outline',
  Biology: 'leaf-outline',
  Chemistry: 'flask-outline',
  Physics: 'magnet-outline',
  English: 'book-outline',
  'Civic Education': 'globe-outline',
};

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: '#1B4F8A',
  Biology: '#2E8B57',
  Chemistry: '#D4770A',
  Physics: '#6B2D99',
  English: '#C0392B',
  'Civic Education': '#1A8BB8',
};

const DIFFICULTY_COLORS = { Easy: '#2E8B57', Medium: '#E08B00', Hard: '#C0392B' };

interface QuizCardProps {
  quiz: QuizSet;
  onPress: () => void;
  lastScore?: number;
}

export function QuizCard({ quiz, onPress, lastScore }: QuizCardProps) {
  const colors = useColors();
  const subjectColor = SUBJECT_COLORS[quiz.subject] ?? colors.primary;
  const difficultyColor = DIFFICULTY_COLORS[quiz.difficulty];
  const icon = SUBJECT_ICONS[quiz.subject] ?? 'help-circle-outline';

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconBox, { backgroundColor: subjectColor + '18' }]}>
        <Ionicons name={icon} size={28} color={subjectColor} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.subject, { color: colors.foreground }]}>{quiz.title}</Text>
        <Text style={[styles.subjectLabel, { color: subjectColor }]}>{quiz.subject} · Grade {quiz.grade} · Part {(quiz as any).part ?? 1}</Text>
        <View style={styles.meta}>
          <View style={styles.metaChip}>
            <Ionicons name="help-circle-outline" size={12} color={colors.mutedForeground} />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{quiz.questionCount} Questions</Text>
          </View>
          <View style={styles.metaChip}>
            <Ionicons name="time-outline" size={12} color={colors.mutedForeground} />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{quiz.durationMinutes} min</Text>
          </View>
          <View style={[styles.difficultyChip, { backgroundColor: difficultyColor + '18' }]}>
            <Text style={[styles.difficultyText, { color: difficultyColor }]}>{quiz.difficulty}</Text>
          </View>
        </View>
      </View>
      <View style={styles.right}>
        {lastScore !== undefined ? (
          <View style={[styles.scoreBadge, { backgroundColor: lastScore >= 70 ? '#2E8B57' : '#E08B00' }]}>
            <Text style={styles.scoreText}>{lastScore}%</Text>
          </View>
        ) : null}
        <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  iconBox: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, gap: 4 },
  subject: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  subjectLabel: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 2 },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  difficultyChip: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  difficultyText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  right: { alignItems: 'center', gap: 6 },
  scoreBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  scoreText: { color: '#fff', fontSize: 12, fontFamily: 'Inter_700Bold' },
});
