import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { PaperCard, SUBJECT_COLORS } from '@/components/PaperCard';
import { loadPapers } from '@/utils/storage';
import type { Paper } from '@/data/mockData';

const GRADE_SUBJECTS: Record<string, string[]> = {
  '7': ['All', 'Mathematics', 'English', 'Integrated Science', 'Social Studies'],
  '9': ['All', 'Mathematics', 'Biology', 'Chemistry', 'Physics', 'English', 'Civic Education'],
  '12': ['All', 'Mathematics', 'Biology', 'Chemistry', 'Physics', 'English', 'Civic Education', 'History', 'Geography'],
};

const GRADE_COLORS: Record<string, string[]> = {
  '7': ['#2E8B57', '#3DAF6A'],
  '9': ['#1B4F8A', '#2E6DB4'],
  '12': ['#D4770A', '#F5A623'],
};

export default function PapersByGradeScreen() {
  const { grade } = useLocalSearchParams<{ grade: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [allPapers, setAllPapers] = useState<Paper[]>([]);

  useEffect(() => { loadPapers().then(setAllPapers); }, []);

  const subjectOptions = GRADE_SUBJECTS[grade ?? '12'] ?? GRADE_SUBJECTS['12'];
  const gradePapers = allPapers.filter(p => p.grade === grade);
  const years = ['All', ...Array.from(new Set(gradePapers.map(p => p.year.toString()))).sort((a, b) => parseInt(b) - parseInt(a))];

  const filtered = useMemo(() => {
    return gradePapers.filter(p => {
      const subjectMatch = selectedSubject === 'All' || p.subject === selectedSubject;
      const yearMatch = selectedYear === 'All' || p.year.toString() === selectedYear;
      return subjectMatch && yearMatch;
    }).sort((a, b) => b.year - a.year);
  }, [allPapers, grade, selectedSubject, selectedYear]);

  const gradientColors = (GRADE_COLORS[grade ?? '12'] ?? GRADE_COLORS['12']) as [string, string];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient colors={gradientColors} style={[styles.header, { paddingTop: topPad + 4 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Grade {grade} Past Papers</Text>
            <Text style={styles.headerSub}>{gradePapers.length} papers available</Text>
          </View>
        </View>
        {/* Subjects */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {subjectOptions.map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, { backgroundColor: selectedSubject === s ? '#fff' : 'rgba(255,255,255,0.25)' }]}
              onPress={() => setSelectedSubject(s)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, { color: selectedSubject === s ? (SUBJECT_COLORS[s] ?? gradientColors[0]) : '#fff' }]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* Years */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {years.map(y => (
            <TouchableOpacity
              key={y}
              style={[styles.yearChip, { backgroundColor: selectedYear === y ? 'rgba(255,255,255,0.35)' : 'transparent', borderColor: 'rgba(255,255,255,0.5)' }]}
              onPress={() => setSelectedYear(y)}
              activeOpacity={0.7}
            >
              <Text style={[styles.yearChipText, { color: '#fff' }]}>{y === 'All' ? 'All Years' : y}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <PaperCard paper={item} />}
        contentContainerStyle={{ padding: 16, paddingBottom: bottomPad + 20 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Text style={[styles.resultCount, { color: colors.mutedForeground }]}>{filtered.length} paper{filtered.length !== 1 ? 's' : ''}</Text>}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="document-outline" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No papers for this selection</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 14, gap: 10 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#fff' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter_400Regular' },
  chip: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  chipText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  yearChip: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 5 },
  yearChipText: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  resultCount: { fontSize: 13, fontFamily: 'Inter_500Medium', marginBottom: 8 },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 8 },
  emptyText: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
});
