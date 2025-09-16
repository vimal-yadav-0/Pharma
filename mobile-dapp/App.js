import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CollectionEventScreen from './src/screens/CollectionEventScreen';
import UnsyncedEventsScreen from './src/screens/UnsyncedEventsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CollectionEvent">
        <Stack.Screen name="CollectionEvent" component={CollectionEventScreen} />
        <Stack.Screen name="UnsyncedEvents" component={UnsyncedEventsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
