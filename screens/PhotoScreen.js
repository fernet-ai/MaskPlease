import React, { useState, useEffect } from 'react';
import {Button, Image, StyleSheet, Text, View, Alert, TouchableOpacity, AsyncStorage } from 'react-native';
import { Camera } from 'expo-camera';
import { FontAwesome ,  MaterialIcons, AntDesign} from '@expo/vector-icons';
import { EAzureBlobStorageImage } from 'react-native-azure-blob-storage';

import logo from '../assets/logo.png';

export default function PhotoScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front)
  const [UriImg, setNewUri] = useState(null);
  const [token, setToken] = useState(null);
  const [isAzureTalk, setCommAzure] = useState(false);

  useEffect(() => {
      EAzureBlobStorageImage.configure(
    "maskpleasestorage", //Account Name
    "asBWW61XzSADiBm+ePs0R92ouRXReni5YoDLjvanrRTn2IZbmbtNvJUsv3BmmJF+9v+W0VHg7EsnKwtpzuy4ag==", //Account Key
    "maskpleasecontainer" //Container Name
  );

  }, []);


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }




snap = async () => {
  let options = { quality: 0.7};
  if (this.camera) {
    let photo = await this.camera.takePictureAsync(options).then(data => {
                    console.log('data uri:' + data.uri);
                    setNewUri(data.uri);
                  });
  }
};



upload = async () => {

  setCommAzure(true);

  var nomeFile = await EAzureBlobStorageImage.uploadFile(UriImg);
  console.log("Nome azure del file caricato: "+nomeFile);
  setToken(nomeFile);

  // Avvia poling ogni 1,5 secondi fino a 15 volte max
  let i = 0
  const intervalId = setInterval(async () => {
    let risp = await polling();
    if (risp == 200 || risp == 201 || i > 15) { //ancora non è pronto
      if(risp == 200){
        Alert.alert('Mascherina non riconosciuta ... + 0 RepuPoint 😅 ');
        console.log("Mascherina non riconosciuta");
        // Disabilita fotocamera
      }
      if(risp == 201){
        Alert.alert('Mascherina rilevata! +3 RepuPoints 🥳');
        console.log("Mascherina rilevata!");
        // Aumenta repuScore
        incrementRepuScore();
        // Disabilita fotocamera
      };
      clearInterval(intervalId);
      return;
    }

    console.log("provo di nuovo a chiedere lo status..");

    if(i == 15){
      Alert.alert('Non riesco a ricevere una risposta dal server :(');
      console.log("Non riesco a connettermi al server ... 😑");
      // Disabilita fotocamera
    }
    i = i + 1;
  }, 1500);

};


polling = async () => {
  let query = 'https://maskpleasefunc.azurewebsites.net/api/getStatus?idreq='+token+'&code=XBOH06FcqSHbJGhHAsDBS6leB3vBv9nLmIrFh8JJCr1UstNIsLkx0Q=='
  const response = await fetch(query, {method: "GET"});
  return response.status;
};


// Incrementa il RepuScore
incrementRepuScore = async () => {
  console.log("incremento punti reputazione ..");
  let OldScore = await AsyncStorage.getItem("RepuScore");
  let newScore = parseInt(OldScore) + 3;
  if(newScore > 100) newScore = 100; // Limite massimo
  console.log("Nuovo score: "+ newScore);
  AsyncStorage.setItem("RepuScore", String(newScore));

};


  return (
    <View style={styles.container}>

    <View style={styles.TopView}>
       <Image source={logo} style={{width: '50%', height: '50%'}} />
    </View >


      <Camera style={styles.camera} type={type}
          ref={ref => {
            this.camera = ref;
          }}>
      </Camera>

      <View style={styles.BottomView}>
        <View style={{width: '80%', height: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around' }}>
          <TouchableOpacity onPress ={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}>
          <MaterialIcons name="flip-camera-android" size={40} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={snap}><FontAwesome name="camera-retro" size={40} color="black" /></TouchableOpacity>
          <TouchableOpacity  disabled={UriImg == null || isAzureTalk ? true : false} onPress={upload}><AntDesign name="cloudupload" size= {40} color={UriImg == null || isAzureTalk? 'rgba(0, 0, 0, .2)' : 'black'} /></TouchableOpacity>
          <TouchableOpacity onPress={incrementRepuScore}><AntDesign name="infocirlce" size={40} color="black" /></TouchableOpacity>
        </View>
      </View >

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 9,
  },

  TopView:{
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8d6cae',
    flex: 1,
  },

  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },


  BottomView:{
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '10%',
    alignItems: 'center',
    backgroundColor: '#8d6cae',
     borderTopLeftRadius: 60,
     borderTopRightRadius: 60,
  },

});
