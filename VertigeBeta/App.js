import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import Checkbox from 'expo-checkbox';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';

// Stack Navigator for Authentication
const AuthStack = createStackNavigator();
function AuthStackScreen({ setIsLoggedIn, setUserEmail }) {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login">
        {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} setUserEmail={setUserEmail} />}
      </AuthStack.Screen>
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
}

// Home Screen
function HomeScreen({ route }) {
  const { email } = route.params || { email: 'Guest' };
  return (
    <View style={styles.screenContainer}>
      <Text style={{ fontSize: 40, color: 'Teal' }}>Vertige Beta</Text>
      <Text style={{ fontSize: 16, color: 'white' }}>This version of the application is only for testing purposes.</Text>
      <StatusBar style="auto" />
    </View>
  );
}

// Profile Screen
function ProfileScreen({ route }) {
  const { email } = route.params || { email: 'Guest' }; // Get email from navigation params

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.text}>Email: {email}</Text>
    </View>
  );
}

// Calendar Screen (Premium Feature)
function CalendarScreen({ navigation }) {
  const isPaidUser = true; // Replace with actual logic to check if the user has paid
  const currentDate = new Date().toLocaleDateString(); // Get current date

  return (
    <View style={styles.screenContainer}>
      {isPaidUser ? (
        <View style={styles.calendarContainer}>
          <Text style={styles.text}>Today's Date: {currentDate}</Text>
          <Calendar
            current={new Date().toISOString().split('T')[0]}
            minDate={'2020-01-01'}
            maxDate={'2030-12-31'}
            onDayPress={(day) => {
              console.log('Selected day:', day);
            }}
          />
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

// Reminder Screen (Paid Feature)
function ReminderScreen({ navigation }) {
  const isPaidUser = false; // Replace with actual logic to check if the user has paid

  return (
    <View style={styles.screenContainer}>
      {isPaidUser ? (
        <Text style={styles.text}>Adding Reminder</Text>
      ) : (
        <View>
          <Text style={styles.text}>This is a paid feature. Please upgrade to access.</Text>
          <Button title="Upgrade to Premium" onPress={() => navigation.navigate('Payment')} />
        </View>
      )}
    </View>
  );
}

// Symptoms Screen (Premium Feature)
function SymptomsScreen({ navigation }) {
  const isPaidUser = true; // Set to true for testing
  const [symptoms, setSymptoms] = useState({
    vertigo: false,
    dizziness: false,
    headache: false,
    offBalance: false,
  });

  return (
    <View style={styles.screenContainer}>
      <Text style={{ fontSize: 25, color: 'white' }}>Select The Symptoms That Are Applicable:</Text>
      {isPaidUser ? (
        <View>
          {Object.keys(symptoms).map((key) => (
            <View key={key} style={styles.checkboxContainer}>
              <Checkbox
                value={symptoms[key]}
                onValueChange={(value) => setSymptoms({ ...symptoms, [key]: value })}
                color={symptoms[key] ? '#00adf5' : undefined}
              />
              <Text style={styles.text}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
            </View>
          ))}
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
  const { email } = route.params || { email: 'Guest' }; // Get email from navigation params

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
      <Tab.Screen name="Payment" component={PaymentScreen} options={{ tabBarButton: () => null }} />
    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const RootStack = createStackNavigator();


  return (
    <NavigationContainer>
      <RootStack.Navigator>
  {isLoggedIn ? (
    <RootStack.Screen 
      name="MainApp" 
      options={{ headerShown: false }}
    >
      {(props) => <MainApp {...props} email={userEmail} />}
    </RootStack.Screen>
  ) : (
    <RootStack.Screen 
      name="Auth" 
      options={{ headerShown: false }}
    >
      {(props) => (
        <AuthStackScreen
          {...props}
          setIsLoggedIn={setIsLoggedIn}
          setUserEmail={setUserEmail}
        />
      )}
    </RootStack.Screen>
  )}
</RootStack.Navigator>

    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: 'white',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'left',
    marginVertical: 10,
  },
  calendarContainer: {
    width: '100%',
    padding: 20,
  },
});
