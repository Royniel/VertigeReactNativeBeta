import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, FlatList, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import Checkbox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';

// Stack Navigator for Authentication
const AuthStack = createStackNavigator();
function AuthStackScreen() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
      <AuthStack.Screen name="MainApp" component={MainApp} options={{ headerShown: false }} />
    </AuthStack.Navigator>
  );
}

// Home Screen
function HomeScreen({ route }) {
  const { email } = route.params || { email: 'Guest' };
  return (
    <View style={styles.screenContainer}>
      <Text style={{ fontSize: 40, color: 'teal' }}>Vertige Beta</Text>
      <Text style={{ fontSize: 16, color: 'white' }}>This version of the application is only for testing purposes.</Text>
      <StatusBar style="auto" />
    </View>
  );
}

// Profile Screen
function ProfileScreen({ route }) {
  const { email } = route.params || { email: 'Guest' };
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.text}>Email: {email}</Text>
    </View>
  );
}

// Calendar Screen (Premium Feature)
function CalendarScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.text}>Calendar Feature</Text>
    </View>
  );
}

// Symptoms Screen (Premium Feature)
function SymptomsScreen({ navigation }) {
  const isPaidUser = false; // Set to true for testing
  const [symptoms, setSymptoms] = useState({
    vertigo: false,
    dizziness: false,
    headache: false,
    offBalance: false,
  });

  return (
    <View style={styles.screenContainer}>
      <Text style={{ fontSize: 25, color: 'white' }}>Select The Symptoms That are applicable : </Text>
      {isPaidUser ? (
        <View>
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={symptoms.vertigo}
              onValueChange={(value) => setSymptoms({ ...symptoms, vertigo: value })}
              color={symptoms.vertigo ? '#00adf5' : undefined}
            />
            <Text style={styles.text}>Vertigo</Text>
          </View>
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={symptoms.dizziness}
              onValueChange={(value) => setSymptoms({ ...symptoms, dizziness: value })}
              color={symptoms.dizziness ? '#00adf5' : undefined}
            />
            <Text style={styles.text}>Dizziness</Text>
          </View>
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={symptoms.headache}
              onValueChange={(value) => setSymptoms({ ...symptoms, headache: value })}
              color={symptoms.headache ? '#00adf5' : undefined}
            />
            <Text style={styles.text}>Headache</Text>
          </View>
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={symptoms.offBalance}
              onValueChange={(value) => setSymptoms({ ...symptoms, offBalance: value })}
              color={symptoms.offBalance ? '#00adf5' : undefined}
            />
            <Text style={styles.text}>Off Balance</Text>
          </View>
        </View>
      ) : (
        <View>
          <Text style={styles.text}>This is a paid feature. Please upgrade to access.</Text>
          <Button title="Upgrade to Premium" onPress={() => navigation.navigate('Payment')} />
        </View>
      )}
    </View>
  );
}
// **Updated Reminder Screen with Functionality**
function ReminderScreen() {
  const isPaidUser = true; // Replace with actual logic to check if the user has paid
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState('');

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const savedReminders = await AsyncStorage.getItem('reminders');
      if (savedReminders) {
        setReminders(JSON.parse(savedReminders));
      }
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };

  const saveReminders = async (updatedReminders) => {
    try {
      await AsyncStorage.setItem('reminders', JSON.stringify(updatedReminders));
    } catch (error) {
      console.error('Error saving reminders:', error);
    }
  };

  const addReminder = async () => {
    if (!newReminder.trim()) {
      Alert.alert('Error', 'Reminder text cannot be empty.');
      return;
    }

    const updatedReminders = [...reminders, { id: Date.now(), text: newReminder }];
    setReminders(updatedReminders);
    setNewReminder('');
    saveReminders(updatedReminders);
    scheduleNotification(newReminder);
  };

  const deleteReminder = (id) => {
    const updatedReminders = reminders.filter((reminder) => reminder.id !== id);
    setReminders(updatedReminders);
    saveReminders(updatedReminders);
  };

  const scheduleNotification = async (reminderText) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Reminder!',
          body: reminderText,
          sound: true,
        },
        trigger: { seconds: 60 }, // Notify after 60 seconds (change as needed)
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  return (
    <View style={styles.screenContainer}>
      {isPaidUser ? (
        <View>
          <Text style={styles.title}>Add Reminder</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter reminder"
            value={newReminder}
            onChangeText={setNewReminder}
          />
          <Button title="Add Reminder" onPress={addReminder} />

          <FlatList
            data={reminders}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.reminderItem}>
                <Text style={styles.text}>{item.text}</Text>
                <Button title="Delete" color="red" onPress={() => deleteReminder(item.id)} />
              </View>
            )}
          />
        </View>
      ) : (
        <View>
          <Text style={styles.text}>This is a paid feature. Please upgrade to access.</Text>
        </View>
      )}
    </View>
  );
}
// Payment Screen (Dummy Screen for Upgrade)
function PaymentScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.text}>Payment Screen</Text>
      <Text style={styles.text}>Complete the payment to unlock premium features.</Text>
    </View>
  );
}

// Create Bottom Tab Navigator
const Tab = createBottomTabNavigator();
function MainApp({ route }) {
  const { email } = route.params || { email: 'Guest' };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Reminder') {
            iconName = focused ? 'alarm' : 'alarm-outline';
          } else if (route.name === 'Calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Symptoms') {
            iconName = focused ? 'medkit' : 'medkit-outline';
          } else if (route.name === 'Payment') {
            iconName = focused ? 'cash' : 'cash-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} initialParams={{ email }} />
      <Tab.Screen name="Reminder" component={ReminderScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Symptoms" component={SymptomsScreen} />
      <Tab.Screen name="Payment" component={PaymentScreen}  />

    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <MainApp route={{ params: { email: userEmail } }} />
      ) : (
        <AuthStackScreen />
      )}
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: 'white',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  reminderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#333',
    borderRadius: 5,
  },
});