import { ActivityIndicator, View } from 'react-native';

export default function Loading() {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.8)'
    }}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}
