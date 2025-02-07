import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import * as InAppPurchases from 'expo-in-app-purchases';
import AsyncStorage from '@react-native-async-storage/async-storage';

const productId = 'com.vertige.premium.monthly'; // Replace with your App Store product ID

export default function PaymentScreen({ route, navigation }) {
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(route.params?.email || '');

  useEffect(() => {
    async function connectToStore() {
      const { responseCode, results } = await InAppPurchases.connectAsync();
      if (responseCode === InAppPurchases.IAPResponseCode.OK) {
        console.log('Connected to App Store:', results);
      } else {
        Alert.alert('Error', 'Failed to connect to the App Store');
      }
    }
    connectToStore();
  }, []);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      await InAppPurchases.purchaseItemAsync(productId);
    } catch (error) {
      Alert.alert('Error', 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const subscription = InAppPurchases.setPurchaseListener(async ({ responseCode, results }) => {
      if (responseCode === InAppPurchases.IAPResponseCode.OK) {
        results.forEach(async (purchase) => {
          if (!purchase.acknowledged) {
            await InAppPurchases.finishTransactionAsync(purchase, false);
            Alert.alert('Success', 'Subscription activated!');
            updateUserPremiumStatus(userEmail); // Update MongoDB
          }
        });
      } else if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
        Alert.alert('Cancelled', 'Payment was cancelled');
      } else {
        Alert.alert('Error', 'Payment failed');
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const updateUserPremiumStatus = async (email) => {
    try {
      const response = await fetch('http://10.0.0.118:5000/update-premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert('Success', 'Your premium subscription is now active!');
        await AsyncStorage.setItem('isPremium', 'true');
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Failed to update subscription status.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong while updating subscription.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Upgrade to Premium</Text>
      <Text style={styles.description}>Unlock premium features with Apple Pay.</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#00adf5" />
      ) : (
        <Button title="Pay with Apple Pay" onPress={handlePurchase} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
});
