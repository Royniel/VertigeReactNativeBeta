import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>This is the vertige demo app</Text>
      <Text>Lets create a payment feature, This text is just for test</Text>
      <StatusBar style="auto" />
    </View>
  );
}   

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: 'aqua',
    alignItems: 'right',
    justifyContent: 'center',
  },
});
