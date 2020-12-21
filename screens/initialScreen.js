import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import * as Notifications from 'expo-notifications';
import { Button } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';


const LOCATION_FETCH_TASK = "upload-job-task-with-location";


/** NOTIFICA QUANDO SI DISATTIVA IL GPS**/

/*** APRIRE NOTIFICA INDIRIZZA PAGINA PER FAR FOTO **/

/** DIMESTICHEZZA HOOKS/ SCREEN / CLASSI **/


TaskManager.defineTask(LOCATION_FETCH_TASK, async () => {
  console.log("qui potrei calcolarci la posizione");

	await Notifications.scheduleNotificationAsync({
	  content: {
		title: "Hai messo la mascherina? 😷",
		body: 'Tocca per fare una foto',
		sound: 'email-sound.wav', 
	  },
	  trigger: {
		seconds: 2,
		channelId: 'tomove', 
	  },
	});

  console.log(LOCATION_FETCH_TASK, "Nuova posizione!");
});


    const initBackgroundFetch = async () => {
      console.log("chiamo initBackgroundFetch()");

      const locationPermission = await Permissions.askAsync(
        Permissions.LOCATION
      );
      const notificationPermission = await Permissions.askAsync(
        Permissions.USER_FACING_NOTIFICATIONS
      );
      if (
        locationPermission.status === "granted" &&
        notificationPermission.status === "granted"
      ) {

        const registered = await TaskManager.isTaskRegisteredAsync(
          LOCATION_FETCH_TASK
        );
        if (registered) {
          console.log("registered");
        }
        
        //AGGiunto
        Notifications.setNotificationChannelAsync('tomove', {
			  name: 'E-mail notifications',
			  importance: Notifications.AndroidImportance.HIGH,
			  sound: 'email-sound.wav', 
			});
        

        const backgroundFetchStatus = await BackgroundFetch.getStatusAsync();
        switch (backgroundFetchStatus) {
          case BackgroundFetch.Status.Restricted:
            console.log("Background fetch execution is restricted");
            return;

          case BackgroundFetch.Status.Denied:
            console.log("Background fetch execution is disabled");
            return;

          default:
            console.log("Background fetch execution allowed");

            let isRegistered = await TaskManager.isTaskRegisteredAsync(
              LOCATION_FETCH_TASK
            );
            if (isRegistered) {
              console.log(`Task ${LOCATION_FETCH_TASK} already registered`);
            } else {
              console.log("Background Fetch Task not found - Registering task");
            }
            
            
            // Set Aggiornamento
            await Location.startLocationUpdatesAsync(LOCATION_FETCH_TASK, {
            
            //Forse significa che semplicemente l'aggiornamneto avviene più frequentemente
            //(abbassare x la batteria)
              accuracy: Location.Accuracy.Highest,         
              deferredUpdatesInterval: 0,
              deferredUpdatesDistance: 10,        
              distanceInterval: 10,
              
              // Notifica fissa di di geolocalizzazione
              foregroundService: {
                notificationBody: "Ricorda di portare sempre la mascherina!",
                notificationTitle: "Servizio di localizzazione attivo"
              }
            });

            break;
        }
      }
    };
    
  
    
 
  /*Disattiva Task*/
  const onDisableTask = async () => {
    const isRegisterd = await TaskManager.isTaskRegisteredAsync(LOCATION_FETCH_TASK );
    if (isRegisterd)
      await Location.stopLocationUpdatesAsync(LOCATION_FETCH_TASK);

  };





export default class initialScreen extends React.Component {

    constructor(props) {
      super(props);

    }



  async componentDidMount(){ //Chiamato quando ha finito di renderizzare i componenti
	  initBackgroundFetch();

   }



  	render(){

	  return (
	    <View style={styles.container}>
          <LinearGradient
            colors={['rgba(21, 108, 174, 0.65)', 'transparent']}
             style = {styles.gradientContainer}
          />
		
		  <Text>MASCHERINA you? E MASCHERINA PUR IO </Text>
		   <Button title="Disattiva servizio" onPress={onDisableTask} />
		   
		   
		   
		</View>
	  );

	 }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#8d6cae',
    alignItems: 'center',
    justifyContent: 'center',
  },

  gradientContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: 800,

    },
});



