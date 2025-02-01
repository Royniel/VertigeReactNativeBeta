import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import CheckBox from '@react-native-community/checkbox'; // Correct import

// Home Screen
function HomeScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={{ fontSize: 40, color: 'white' }}>Vertige Beta</Text>
      <Text style={{ fontSize: 16, color: 'white' }}>Let's create a payment feature. This is test text. </Text>
      <StatusBar style="auto" />
    </View>
  );
}

// Profile Screen
function ProfileScreen() {
  const randomName = "John Doe";
  const randomEmail = "johndoe@example.com";
  const randomAge = Math.floor(Math.random() * 50) + 18; // Random age between 18 and 67

  return (
    <View style={styles.screenContainer}>
      <Text>Name: {randomName}</Text>
      <Text>Email: {randomEmail}</Text>
      <Text>Age: {randomAge}</Text>
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
        <View>
          <Text>Today's Date: {currentDate}</Text>
          <Calendar
            current={new Date().toISOString().split('T')[0]}
            minDate={'2020-01-01'}
            maxDate={'2030-12-31'}
            onDayPress={(day) => {
              console.log('Selected day:', day);
            }}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#b6c1cd',
              selectedDayBackgroundColor: '#00adf5',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#00adf5',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: '#00adf5',
              selectedDotColor: '#ffffff',
              arrowColor: '#00adf5',
              monthTextColor: '#00adf5',
              indicatorColor: '#00adf5',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 16,
            }}
          />
        </View>
      ) : (
        <View>
          <Text>This is a paid feature. Please upgrade to access.</Text>
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
        <Text>Adding Reminder</Text>
      ) : (
        <View>
          <Text>This is a paid feature. Please upgrade to access.</Text>
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
      {isPaidUser ? (
        <View>
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={symptoms.vertigo}
              onValueChange={(value) => setSymptoms({ ...symptoms, vertigo: value })}
            />
            <Text>Vertigo</Text>
          </View>
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={symptoms.dizziness}
              onValueChange={(value) => setSymptoms({ ...symptoms, dizziness: value })}
            />
            <Text>Dizziness</Text>
          </View>
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={symptoms.headache}
              onValueChange={(value) => setSymptoms({ ...symptoms, headache: value })}
            />
            <Text>Headache</Text>
          </View>
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={symptoms.offBalance}
              onValueChange={(value) => setSymptoms({ ...symptoms, offBalance: value })}
            />
            <Text>Off Balance</Text>
          </View>
        </View>
      ) : (
        <View>
          <Text>This is a paid feature. Please upgrade to access.</Text>
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
      <Text>Payment Screen</Text>
      <Text>Complete the payment to unlock premium features.</Text>
    </View>
  );
}

// Create Bottom Tab Navigator
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
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
        tabBarOptions={{
          activeTintColor: 'blue',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Reminder" component={ReminderScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Symptoms" component={SymptomsScreen} />
        <Tab.Screen name="Payment" component={PaymentScreen} options={{ tabBarButton: () => null }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: 'grey',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
});
