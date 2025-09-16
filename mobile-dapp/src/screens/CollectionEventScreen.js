import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import * as Location from 'expo-location';
import { saveEventLocally } from '../services/storage';

export default function CollectionEventScreen({ navigation }) {
  const [species, setSpecies] = useState('Withania somnifera');
  const [moisture, setMoisture] = useState('');
  const [pesticide, setPesticide] = useState(false);
  const [dnaBarcode, setDnaBarcode] = useState(false);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const getLocation = async () => {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location permission is required.');
      setLoading(false);
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!location) {
      Alert.alert('No GPS', 'Please capture GPS location.');
      return;
    }
    const event = {
      id: `COL${Date.now()}`,
      gps: { lat: location.latitude, lng: location.longitude },
      timestamp: new Date().toISOString(),
      species,
      collectorId: 'COL123', // TODO: dynamic user
      quality: {
        moisture: parseFloat(moisture),
        pesticide,
        dnaBarcode
      }
    };
    await saveEventLocally(event);
    Alert.alert('Saved', 'Event saved locally.');
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Species</Text>
      <TextInput value={species} onChangeText={setSpecies} style={{ borderWidth: 1, marginBottom: 10 }} />
      <Text>Moisture (%)</Text>
      <TextInput value={moisture} onChangeText={setMoisture} keyboardType="numeric" style={{ borderWidth: 1, marginBottom: 10 }} />
      <Text>Pesticide Present?</Text>
      <Button title={pesticide ? 'Yes' : 'No'} onPress={() => setPesticide(!pesticide)} />
      <Text>DNA Barcode Verified?</Text>
      <Button title={dnaBarcode ? 'Yes' : 'No'} onPress={() => setDnaBarcode(!dnaBarcode)} />
      <Button title={location ? `GPS: ${location.latitude}, ${location.longitude}` : 'Capture GPS'} onPress={getLocation} disabled={loading} />
      <Button title="Save Event Locally" onPress={handleSave} />
      <Button title="View Unsynced Events" onPress={() => navigation.navigate('UnsyncedEvents')} />
    </View>
  );
}
