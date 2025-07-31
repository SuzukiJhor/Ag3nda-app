
import React from 'react';
import type { FlexAlignType } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  title?: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
};

export const TitleSubtitle = ({ title, subtitle, align = 'left' }: Props) => {
  if (!title && !subtitle) return null;

  return (
    <View style={[styles.container, { alignItems: alignMap[align] }]}>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const alignMap: Record<'left' | 'center' | 'right', FlexAlignType> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'semibold',
    color: '#007AFF',
    marginTop: 6,
  },
});
