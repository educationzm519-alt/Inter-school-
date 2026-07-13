import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import type { Paper } from '@/data/mockData';

export const SUBJECT_COLORS: Record<string, string> = {
  'Mathematics': '#1B4F8A',
  'Biology': '#2E8B57',
  'Chemistry': '#D4770A',
  'Physics': '#6B2D99',
  'English': '#C0392B',
  'Civic Education': '#1A8BB8',
  'History': '#8B4513',
  'Geography': '#1A7A3E',
  'Integrated Science': '#0E7A6A',
  'Social Studies': '#E67E22',
};

interface PaperCardProps {
  paper: Paper;
}

export function PaperCard({ paper }: PaperCardProps) {
  const colors = useColors();
  const subjectColor = SUBJECT_COLORS[paper.subject] ?? colors.primary;

  const handleDownload = () => {
    Alert.alert('Download', `Downloading ${paper.subject} ${paper.year} Paper ${paper.paperNumber}...`, [{ text: 'OK' }]);
  };

  const handleView = () => {
    Alert.alert('View Paper', `Opening ${paper.subject} ${paper.year} Paper ${paper.paperNumber}`, [{ text: 'OK' }]);
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.colorBar, { backgroundColor: subjectColor }]} />
      <View style={styles.body}>
        <View style={styles.top}>
          <View>
            <Text style={[styles.subject, { color: subjectColor }]}>{paper.subject}</Text>
            <Text style={[styles.info, { color: colors.foreground }]}>
              {paper.year} · Paper {paper.paperNumber}
            </Text>
          </View>
          <View style={[styles.gradeChip, { backgroundColor: subjectColor + '18', borderColor: subjectColor + '40' }]}>
            <Text style={[styles.gradeChipText, { color: subjectColor }]}>Gr {paper.grade}</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.metaRow}>
            <Ionicons name="document-outline" size={13} color={colors.mutedForeground} />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{paper.fileSize}</Text>
            <Ionicons name="arrow-down-circle-outline" size={13} color={colors.mutedForeground} />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{paper.downloads.toLocaleString()} downloads</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.viewBtn, { borderColor: subjectColor }]} onPress={handleView} activeOpacity={0.7}>
              <Ionicons name="eye-outline" size={16} color={subjectColor} />
              <Text style={[styles.viewBtnText, { color: subjectColor }]}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.downloadBtn, { backgroundColor: subjectColor }]} onPress={handleDownload} activeOpacity={0.7}>
              <Ionicons name="download-outline" size={16} color="#fff" />
              <Text style={styles.downloadBtnText}>Download</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  colorBar: { width: 5 },
  body: { flex: 1, padding: 14, gap: 10 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  subject: { fontSize: 15, fontFamily: 'Inter_700Bold', marginBottom: 2 },
  info: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  gradeChip: { borderRadius: 8, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3 },
  gradeChipText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  footer: { gap: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  actions: { flexDirection: 'row', gap: 8 },
  viewBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7,
  },
  viewBtnText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  downloadBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7,
  },
  downloadBtnText: { color: '#fff', fontSize: 13, fontFamily: 'Inter_600SemiBold' },
});
