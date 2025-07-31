import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type DangerButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export default function DangerButton({ title, onPress, disabled = false }: DangerButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF3B30',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ffb3ad',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
