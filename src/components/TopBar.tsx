import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export const TopBar: React.FC<{ title: string }> = ({ title }) => (
  <SafeAreaView edges={['top']} style={{ backgroundColor: colors.card }}>
    <View style={styles.bar}>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  bar: {
    minHeight: 56,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  title: { color: colors.text, fontSize: 18, fontWeight: '700' }
});
