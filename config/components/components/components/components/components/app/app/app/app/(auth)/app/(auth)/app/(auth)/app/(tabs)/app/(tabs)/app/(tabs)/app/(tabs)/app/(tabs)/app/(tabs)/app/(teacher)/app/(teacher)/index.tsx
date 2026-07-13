import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useColors } from '@/hooks/useColors';
import { StatCard } from '@/components/StatCard';
import { STUDENT_RECORDS } from '@/data/mockData';

const WEAK_TOPICS = [
  { subject: 'Mathematics', topic: 'Integration by Parts', failRate: 42 },
  { subject: 'Chemistry', topic: 'Organic Reactions', failRate: 38 },
  { subject: 'Physics', topic: 'Electromagnetic Induction', failRate: 35 },
  { subject: 'Biology', topic: 'Meiosis vs Mitosis', failRate: 29 },
];

type UploadAction = { label: string; icon: React.ComponentProps<typeof Ionicons>['name']; color: string; type?: string; isQuiz?: boolean };
const UPLOAD_ACTIONS: UploadAction[] = [
  { label: 'Upload Past Paper', icon: 'document-attach-outline', color: '#1B4F8A', type: 'paper' },
  { label: 'Upload Study Notes', icon: 'book-outline', color: '#D4770A', type: 'notes' },
  { label: 'Upload Video Lesson', icon: 'videocam-outline', color: '#6B2D99', type: 'video' },
  { label: 'Create Quiz', icon: 'school-outline', color: '#2E8B57', isQuiz: true },
];

export default function TeacherDashboard() {
  const { user } = useAuth();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 84 + 34 : 84 + insets.bottom;

  const avgScore = Math.round(STUDENT_RECORDS.reduce((a, s) => a + s.avgScore, 0) / STUDENT_RECORDS.length);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient colors={['#2E8B57', '#3DAF6A']} style={[styles.header, { paddingTop: topPad + 12 }]}>
        <Text style={styles.greeting}>Welcome back,</Text>
        <Text style={styles.name}>{user?.name ?? 'Teacher'}</Text>
        <Text style={styles.role}>{user?.subject ?? 'Teacher'} · {user?.school ?? ''}</Text>
      </LinearGradient>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatCard label="Students" value={STUDENT_RECORDS.length} icon="people-outline" color="#1B4F8A" trend="+2 this week" trendUp />
        <StatCard label="Avg Score" value={`${avgScore}%`} icon="analytics-outline" color="#2E8B57" trend="+3% vs last" trendUp />
      </View>

      {/* Upload / Create Section */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="cloud-upload-outline" size={20} color="#1B4F8A" />
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Upload &amp; Create</Text>
        </View>
        <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>
          Upload materials from your phone so students can access them.
        </Text>
        <View style={styles.actionGrid}>
          {UPLOAD_ACTIONS.map(action => (
            <TouchableOpacity
              key={action.label}
              style={[styles.actionCard, { backgroundColor: action.color + '12', borderColor: action.color + '30' }]}
              onPress={() => {
                if (action.isQuiz) {
                  router.push('/(teacher)/create-quiz' as any);
                } else {
                  router.push({ pathname: '/(teacher)/upload' as any, params: { type: action.type } });
                }
              }}
              activeOpacity={0.75}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                <Ionicons name={action.icon} size={26} color={action.color} />
              </View>
              <Text style={[styles.actionLabel, { color: action.color }]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Weak Topics */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="alert-circle-outline" size={20} color="#C0392B" />
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Topics Needing Attention</Text>
        </View>
        {WEAK_TOPICS.map(t => (
          <View key={t.topic} style={styles.topicRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.topicName, { color: colors.foreground }]}>{t.topic}</Text>
              <Text style={[styles.topicSubject, { color: colors.mutedForeground }]}>{t.subject}</Text>
            </View>
            <View style={[styles.failBadge, { backgroundColor: t.failRate > 40 ? '#C0392B15' : '#E0870015' }]}>
              <Text style={[styles.failRate, { color: t.failRate > 40 ? '#C0392B' : '#E08700' }]}>{t.failRate}% fail</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Top Students */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Top Students This Week</Text>
        {STUDENT_RECORDS.filter(s => s.avgScore >= 80).slice(0, 3).map((s, i) => (
          <View key={s.id} style={styles.studentRow}>
            <View style={[styles.rank, { backgroundColor: ['#F5A623', '#9EA5AD', '#CD7F32'][i] }]}>
              <Text style={styles.rankText}>{i + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.studentName, { color: colors.foreground }]}>{s.name}</Text>
              <Text style={[styles.studentMeta, { color: colors.mutedForeground }]}>Grade {s.grade} · {s.quizzesCompleted} quizzes</Text>
            </View>
            <Text style={[styles.score, { color: '#2E8B57' }]}>{s.avgScore}%</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 24, gap: 4 },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter_400Regular' },
  name: { fontSize: 26, fontFamily: 'Inter_700Bold', color: '#fff' },
  role: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter_500Medium' },
  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginTop: 12 },
  section: { margin: 16, marginTop: 4, borderRadius: 14, borderWidth: 1, padding: 16, gap: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  sectionSub: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: -4, lineHeight: 18 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  actionCard: {
    width: '47%', borderRadius: 14, borderWidth: 1, padding: 14, alignItems: 'center', gap: 8,
  },
  actionIcon: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: 13, fontFamily: 'Inter_700Bold', textAlign: 'center', lineHeight: 18 },
  topicRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 2 },
  topicName: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  topicSubject: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  failBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  failRate: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  studentRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rank: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  rankText: { color: '#fff', fontSize: 13, fontFamily: 'Inter_700Bold' },
  studentName: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  studentMeta: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  score: { fontSize: 18, fontFamily: 'Inter_700Bold' },
});
