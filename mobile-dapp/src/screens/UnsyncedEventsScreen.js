import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert } from 'react-native';
import { getLocalEvents, removeEventLocally } from '../services/storage';
import { syncEventToApi } from '../services/api';

export default function UnsyncedEventsScreen() {
  const [events, setEvents] = useState([]);

  const loadEvents = async () => {
    const evts = await getLocalEvents();
    setEvents(evts);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleSync = async (event) => {
    try {
      await syncEventToApi(event);
      await removeEventLocally(event.id);
      Alert.alert('Synced', 'Event synced to blockchain.');
      loadEvents();
    } catch (err) {
      Alert.alert('Sync failed', err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Unsynced Events</Text>
      <FlatList
        data={events}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10, borderWidth: 1, padding: 10 }}>
            <Text>ID: {item.id}</Text>
            <Text>Species: {item.species}</Text>
            <Text>Timestamp: {item.timestamp}</Text>
            <Button title="Sync to Blockchain" onPress={() => handleSync(item)} />
          </View>
        )}
        ListEmptyComponent={<Text>No unsynced events.</Text>}
      />
    </View>
  );
}
