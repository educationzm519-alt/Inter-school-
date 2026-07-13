import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useColors } from '@/hooks/useColors';
import { QuickCard } from '@/components/QuickCard';

const QUICK_CARDS = [
  { title: 'ECZ Past Papers', icon: 'document-text-outline' as const, color: '#1B4F8A', route: '/(tabs)/papers' },
  { title: 'Quizzes', icon: 'school-outline' as const, color: '#2E8B57', route: '/(tabs)/quiz' },
  { title: 'Study Notes', icon: 'book-outline' as const, color: '#D4770A', route: '/notes' },
  { title: 'Video Lessons', icon: 'play-circle-outline' as const, color: '#6B2D99', route: '/videos' },
  { title: 'AI Assistant', icon: 'sparkles-outline' as const, color: '#C0392B', route: '/ai-assistant', badge: 'AI' },
  { title: 'Community', icon: 'people-outline' as const, color: '#1A8BB8', route: '/(tabs)/community' },
  { title: 'Formula Bank', icon: 'calculator-outline' as const, color: '#2E8B57', route: '/formula-bank' },
  { title: 'School News', icon: 'newspaper-outline' as const, color: '#D4770A', route: '/school-news' },
];

const SUBJECTS = [
  { name: 'Mathematics', icon: 'calculator-outline' as const, color: '#1B4F8A' },
  { name: 'Biology', icon: 'leaf-outline' as const, color: '#2E8B57' },
  { name: 'Chemistry', icon: 'flask-outline' as const, color: '#D4770A' },
  { name: 'Physics', icon: 'magnet-outline' as const, color: '#6B2D99' },
  { name: 'English', icon: 'book-outline' as const, color: '#C0392B' },
  { name: 'Civic Ed', icon: 'globe-outline' as const, color: '#1A8BB8' },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 84 + 34 : 84 + insets.bottom;

  const firstName = user?.name?.split(' ')[0] ?? 'Student';
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <LinearGradient colors={['#1B4F8A', '#2E6DB4']} style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Hello, {firstName}!</Text>
            <Text style={styles.date}>{today}</Text>
          </View>
          <View style={styles.gradeChip}>
            <Ionicons name="school" size={14} color="#fff" />
            <Text style={styles.gradeChipText}>Grade {user?.grade ?? '12'}</Text>
          </View>
        </View>
        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Quizzes Done', value: '12', icon: 'checkmark-circle-outline' as const },
            { label: 'Avg Score', value: '76%', icon: 'trending-up-outline' as const },
            { label: 'Papers', value: '8', icon: 'document-outline' as const },
            { label: 'Day Streak', value: '5', icon: 'flame-outline' as const },
          ].map(stat => (
            <View key={stat.label} style={styles.statItem}>
              <Ionicons name={stat.icon} size={18} color="rgba(255,255,255,0.9)" />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* Progress Banner */}
      <View style={[styles.progressBanner, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.progressLeft}>
          <Text style={[styles.progressTitle, { color: colors.foreground }]}>Keep going! You are on track</Text>
          <Text style={[styles.progressSub, { color: colors.mutedForeground }]}>Complete 3 more quizzes this week</Text>
        </View>
        <View style={[styles.progressCircle, { borderColor: colors.primary }]}>
          <Text style={[styles.progressPct, { color: colors.primary }]}>76%</Text>
        </View>
      </View>

      {/* Quick Access */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick Access</Text>
        <View style={styles.cardGrid}>
          {QUICK_CARDS.map(card => (
            <View key={card.title} style={styles.cardCell}>
              <QuickCard
                title={card.title}
                icon={card.icon}
                color={card.color}
                onPress={() => router.push(card.route as any)}
                badge={card.badge}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Subjects */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>My Subjects</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/quiz')} activeOpacity={0.7}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectsScroll}>
          {SUBJECTS.map(sub => (
            <TouchableOpacity
              key={sub.name}
              style={[styles.subjectPill, { backgroundColor: sub.color + '15', borderColor: sub.color + '40' }]}
              onPress={() => router.push('/(tabs)/quiz')}
              activeOpacity={0.7}
            >
              <Ionicons name={sub.icon} size={18} color={sub.color} />
              <Text style={[styles.subjectPillText, { color: sub.color }]}>{sub.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent Activity</Text>
        {[
          { action: 'Completed Mathematics Quiz', detail: 'Score: 85% · 2 hours ago', icon: 'checkmark-circle' as const, color: '#2E8B57' },
          { action: 'Downloaded Chemistry 2023', detail: 'Grade 12 · Past Paper · Yesterday', icon: 'download' as const, color: '#1B4F8A' },
          { action: 'Posted in Community', detail: 'Asked about integration · 2 days ago', icon: 'chatbubble' as const, color: '#D4770A' },
        ].map((item, i) => (
          <View key={i} style={[styles.activityItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.activityIcon, { backgroundColor: item.color + '18' }]}>
              <Ionicons name={item.icon} size={18} color={item.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.activityAction, { color: colors.foreground }]}>{item.action}</Text>
              <Text style={[styles.activityDetail, { color: colors.mutedForeground }]}>{item.detail}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 20, gap: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { fontSize: 24, fontFamily: 'Inter_700Bold', color: '#fff' },
  date: { fontSize: 13, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.8)' },
  gradeChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5,
  },
  gradeChipText: { color: '#fff', fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { alignItems: 'center', gap: 3 },
  statValue: { color: '#fff', fontSize: 18, fontFamily: 'Inter_700Bold' },
  statLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 10, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  progressBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    margin: 16, marginTop: -1, borderRadius: 14, borderWidth: 1, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  progressLeft: { flex: 1, gap: 3 },
  progressTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  progressSub: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  progressCircle: {
    width: 52, height: 52, borderRadius: 26, borderWidth: 3,
    alignItems: 'center', justifyContent: 'center',
  },
  progressPct: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  section: { paddingHorizontal: 16, marginBottom: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontFamily: 'Inter_700Bold', marginBottom: 12 },
  seeAll: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  cardGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cardCell: { width: '23%' },
  subjectsScroll: { marginBottom: 8 },
  subjectPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 20, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 9, marginRight: 8,
  },
  subjectPillText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  activityItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 12, borderWidth: 1, padding: 12, marginBottom: 8,
  },
  activityIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  activityAction: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  activityDetail: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
});
