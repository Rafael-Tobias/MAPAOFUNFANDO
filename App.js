import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import {css} from './assets/css/Css';
import MapView from "react-native-maps";
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
import config from "./config"
import MapViewDirections from 'react-native-maps-directions';

export default function App() {
  const mapEl=useRef(null);
  const [origin,setOrigin]=useState(null);
  const [destination,setDestination]=useState(null);
  const [distance,setDistance]=useState(null);

  useEffect(()=>{
    (async function(){
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
        if (status === 'granted') {
            let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
            setOrigin({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.000922,
                longitudeDelta: 0.000421
            })
        } else {
            throw new Error('Location permission not granted');
        }
    })();
  },[]);
  return (
    <View style={css.container}>
      <MapView
        style={css.map}Ref
        initialRegion={origin}
        showsUserLocation={true}
        zoomEnabled={true}
        loadingEnabled={true}
        ref={mapEl}
      >
        {destination &&
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={config.googleApi}
            strokeWidth={3}
            onReady={result=>{
              console.log(result)
              setDistance(result.distance);
              mapEl.current.fitToCoordinates(
                result.coordinates,{
                    edgePadding:{
                        top:50,
                        bottom:50,
                        left:50,
                        right:50
                    }
                }
            );
          }} 
        />
      }
      </MapView>
      <View style={css.search}>
        <GooglePlacesAutocomplete
            placeholder='Para onde vamos?'
            onPress={(data, details = null) => {
            setDestination({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: 0.000922,
                longitudeDelta: 0.000421
            });

        }}
        query={{
            key: config.googleApi,
            language: 'pt-br',
        }}
        enablePoweredByContainer={false}
        fetchDetails={true}
        styles={{listView:{height:100}}}
      />
      </View>
    </View>
  );
}

