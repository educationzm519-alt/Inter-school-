import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useColors } from '@/hooks/useColors';
import { PAPERS, QUIZ_SETS, STUDENT_RECORDS, NEWS } from '@/data/mockData';

const QUICK_ACTIONS = [
  { label: 'Upload Paper', icon: 'document-attach-outline' as const, color: '#1B4F8A' },
  { label: 'Add Quiz', icon: 'add-circle-outline' as const, color: '#2E8B57' },
  { label: 'Post News', icon: 'newspaper-outline' as const, color: '#D4770A' },
  { label: 'Add Video', icon: 'videocam-outline' as const, color: '#6B2D99' },
  { label: 'Add Notes', icon: 'book-outline' as const, color: '#1A8BB8' },
  { label: 'Manage Users', icon: 'people-outline' as const, color: '#C0392B' },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 84 + 34 : 84 + insets.bottom;

  const stats = [
    { label: 'Total Users', value: STUDENT_RECORDS.length + 5, icon: 'people-outline' as const, color: '#1B4F8A' },
    { label: 'Past Papers', value: PAPERS.length, icon: 'documents-outline' as const, color: '#2E8B57' },
    { label: 'Quizzes', value: QUIZ_SETS.length, icon: 'school-outline' as const, color: '#D4770A' },
    { label: 'News Posts', value: NEWS.length, icon: 'newspaper-outline' as const, color: '#6B2D99' },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ paddingBottom: bottomPad }} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#D4770A', '#F5A623']} style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View style={styles.headerRow}>
          <View style={styles.shieldBadge}>
            <Ionicons name="shield-checkmark" size={28} color="#D4770A" />
          </View>
          <View>
            <Text style={styles.adminLabel}>ADMIN PANEL</Text>
            <Text style={styles.adminName}>{user?.name ?? 'Administrator'}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map(s => (
          <View key={s.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.statIcon, { backgroundColor: s.color + '18' }]}>
              <Ionicons name={s.icon} size={22} color={s.color} />
            </View>
            <Text style={[styles.statValue, { color: colors.foreground }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map(a => (
            <TouchableOpacity
              key={a.label}
              style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => Alert.alert(a.label, `This feature allows admins to ${a.label.toLowerCase()}.`)}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: a.color + '18' }]}>
                <Ionicons name={a.icon} size={22} color={a.color} />
              </View>
              <Text style={[styles.actionLabel, { color: colors.foreground }]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent Activity</Text>
        {[
          { action: 'New student registered', detail: 'Mwape Chileshe · Grade 12', time: '2h ago', icon: 'person-add-outline' as const, color: '#1B4F8A' },
          { action: 'Paper uploaded', detail: 'Mathematics 2023 Grade 12', time: '1 day ago', icon: 'document-attach-outline' as const, color: '#2E8B57' },
          { action: 'Quiz published', detail: 'Biology: Cell Biology', time: '2 days ago', icon: 'school-outline' as const, color: '#D4770A' },
          { action: 'Post reported', detail: 'Community · Pending review', time: '3 days ago', icon: 'flag-outline' as const, color: '#C0392B' },
        ].map((item, i) => (
          <View key={i} style={styles.activityRow}>
            <View style={[styles.activityIcon, { backgroundColor: item.color + '18' }]}>
              <Ionicons name={item.icon} size={16} color={item.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.activityAction, { color: colors.foreground }]}>{item.action}</Text>
              <Text style={[styles.activityDetail, { color: colors.mutedForeground }]}>{item.detail}</Text>
            </View>
            <Text style={[styles.activityTime, { color: colors.mutedForeground }]}>{item.time}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 20, paddingTop: 0 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  shieldBadge: { width: 52, height: 52, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' },
  adminLabel: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: 'rgba(255,255,255,0.85)', letterSpacing: 1 },
  adminName: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#fff' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 10 },
  statCard: {
    width: '47%', borderRadius: 14, borderWidth: 1, padding: 14, gap: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  statIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 26, fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  sectionContainer: { paddingHorizontal: 16, marginBottom: 8 },
  sectionTitle: { fontSize: 17, fontFamily: 'Inter_700Bold', marginBottom: 12 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actionBtn: {
    width: '30%', borderRadius: 12, borderWidth: 1, padding: 12, alignItems: 'center', gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  actionIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: 11, fontFamily: 'Inter_600SemiBold', textAlign: 'center' },
  section: { margin: 16, borderRadius: 14, borderWidth: 1, padding: 16, gap: 12 },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  activityIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  activityAction: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  activityDetail: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  activityTime: { fontSize: 11, fontFamily: 'Inter_400Regular' },
});
