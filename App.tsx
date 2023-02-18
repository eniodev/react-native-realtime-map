import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { styles } from './styles';
import MapView, {Marker, PROVIDER_GOOGLE}  from 'react-native-maps';
import {LocationObject, requestForegroundPermissionsAsync, getCurrentPositionAsync, watchPositionAsync, LocationAccuracy } from 'expo-location';
import { useEffect, useRef, useState } from 'react';




export default function App() {


  const [location, setLocation] = useState<LocationObject | null>(null);
  const mapRef = useRef<MapView>(null)


  async function requestLocationPermission() {
    
    
    const {granted} = await requestForegroundPermissionsAsync();

    if(granted) {
        const currentPosition = await getCurrentPositionAsync();
        setLocation(currentPosition);

      }
  }

  useEffect(()=> {
    requestLocationPermission();

  }, []);


  useEffect(()=> {
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest, 
      timeInterval: 1000,
      distanceInterval: 1,
    }, (response) => {
        setLocation(response);
        mapRef.current?.animateCamera({
          pitch: 70,
          center: response.coords
        })
    })
  }, [])


  return (
    <View style={styles.container}>
      <MapView 
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location?.coords.latitude,
          longitude: location?.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005

        }}>
          <Marker coordinate={{
             latitude: location?.coords.latitude,
             longitude: location?.coords.longitude,
          }}/>
        </MapView>
    </View>
  );
}

