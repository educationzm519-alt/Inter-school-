import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  trend?: string;
  trendUp?: boolean;
}

export function StatCard({ label, value, icon, color, trend, trendUp }: StatCardProps) {
  const colors = useColors();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.iconBox, { backgroundColor: color + '18' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={[styles.value, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text>
      {trend ? (
        <View style={styles.trendRow}>
          <Ionicons
            name={trendUp ? 'trending-up' : 'trending-down'}
            size={13}
            color={trendUp ? '#2E8B57' : '#C0392B'}
          />
          <Text style={[styles.trendText, { color: trendUp ? '#2E8B57' : '#C0392B' }]}>{trend}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 6,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  iconBox: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  value: { fontSize: 24, fontFamily: 'Inter_700Bold', lineHeight: 28 },
  label: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  trendText: { fontSize: 11, fontFamily: 'Inter_500Medium' },
});
