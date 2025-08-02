
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
    <View style={[{ alignItems: alignMap[align] }]}>
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
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#7209b7',
    fontStyle: 'normal',
    letterSpacing: 0.6,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#EB5E28',
    marginBottom: 22,
  },
});

