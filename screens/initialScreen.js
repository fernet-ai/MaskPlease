import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import * as Notifications from 'expo-notifications';
import { Button, Image, TouchableOpacity, Alert, Share  } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Ionicons, Octicons, AntDesign, MaterialIcons, FontAwesome5, FontAwesome, MaterialCommunityIcons} from '@expo/vector-icons';
import logo from '../assets/logo.png';

const LOCATION_FETCH_TASK = "upload-job-task-with-location";


TaskManager.defineTask(LOCATION_FETCH_TASK, async () => {
  console.log("qui potrei calcolarci la posizione");

	await Notifications.scheduleNotificationAsync({
	  content: {
		title: "Hai messo la mascherina? 😷",
		body: 'Fai una foto ed aumenta il tuo RepuScore!',
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


      const locationPermission = await Permissions.askAsync(Permissions.LOCATION);
      const notificationPermission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);

      console.log("Stato permessi di locazione "+ locationPermission.status);

      if (locationPermission.status === "granted" && notificationPermission.status === "granted") {

        const registered = await TaskManager.isTaskRegisteredAsync(LOCATION_FETCH_TASK);
        if (registered) {
          console.log("registered");
        }

        // SO SE SERVE
        Notifications.setNotificationChannelAsync('tomove', {
			  name: 'E-mail notifications',
			  importance: Notifications.AndroidImportance.HIGH,
			  sound: 'email-sound.wav',
			});


      let isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_FETCH_TASK);
      if (isRegistered) {
        console.log(`Task ${LOCATION_FETCH_TASK} Attivita registrata`);
      } else {
        console.log("Background Fetch Task not found - Registrazione nuova attivita ...");
      }

      // Set Aggiornamento
      await Location.startLocationUpdatesAsync(LOCATION_FETCH_TASK, {
      //Forse significa che semplicemente l'aggiornamneto avviene più frequentemente
      //(abbassare x la batteria)
        accuracy: Location.Accuracy.Highest,
        deferredUpdatesInterval: 0,
        deferredUpdatesDistance: 1000, // era 10
        distanceInterval: 100, // era 10

        // Notifica fissa di di geolocalizzazione
        foregroundService: {
          notificationBody: "Controlla che sia attiva la localizzazione",
          notificationTitle: "Porta sempre la mascherina con te"
        }
      });

      }

    };



  /*Disattiva Task*/
  const onDisableTask = async () => {
    const isRegisterd = await TaskManager.isTaskRegisteredAsync(LOCATION_FETCH_TASK );
    if (isRegisterd){
      await Location.stopLocationUpdatesAsync(LOCATION_FETCH_TASK);
      console.log("Disattivazione task di registrazione locazione ..");
    }
  };



export default class initialScreen extends React.Component {

    constructor(props) {
      super(props);
    }


    state = {
      serviceON: false,
      GPSattivo: false,
      repuScore: 80,
    };


  async componentDidMount(){ //Chiamato quando ha finito di renderizzare i componenti

    // Listener quando apro sulla notifica
     Notifications.addNotificationResponseReceivedListener(response => {
      this.goPhotoScreen(); // Vai alla schermata della foto
    });

    let servicesEnabled = await Location.hasServicesEnabledAsync();
    this.setState({GPSattivo: servicesEnabled});

    let BackgroundServicesEnabled = await TaskManager.isAvailableAsync();
      if (!BackgroundServicesEnabled) {
        Alert.alert('Qui non posso attivare il background');
      }
   }


   async componentDidUpdate(){
     let servicesEnabled = await Location.hasServicesEnabledAsync();
     this.setState({GPSattivo: servicesEnabled}, () => {
       if(!servicesEnabled) this.turnOFFtracking();
        else if (this.state.serviceON) this.turnONtracking();
     });
   }


  goPhotoScreen = () => {
		this.props.navigation.navigate('Photo', {msg: "un messaggio"});
	}

  goSettingsScreen = () => {
		this.props.navigation.navigate('Settings', {msg: "un messaggio"});
	}



  turnOFFtracking= () => {
    if(this.state.serviceON){
      this.setState({
            serviceON: false}, () => {onDisableTask();});
    }
  }

  turnONtracking= () => {
    if(!this.state.serviceON){
      this.setState({
            serviceON: true}, () => {initBackgroundFetch();});
    }
  }


  onShare = async () => {
  try {
    const result = await Share.share({
     title: 'Condividi',
    message: "Hey, questo è il mio RepuScore: "+ this.state.repuScore +"\nUnisciti alla community di MaskPlease 😷",
    });

  } catch (error) {
    alert(error.message);
  }
};

  renderEmoji(){
     if(this.state.repuScore < 20) return <Ionicons name="sad" size={60} color="yellow" />
     else if(this.state.repuScore >= 20 && this.state.repuScore < 40) return <MaterialCommunityIcons name="emoticon-sad" size={60} color="yellow" />
     else if(this.state.repuScore >= 40 && this.state.repuScore < 60) return <MaterialCommunityIcons name="emoticon-neutral" size={60} color="yellow" />
     else if(this.state.repuScore >= 60 && this.state.repuScore < 80) return <AntDesign name="smile-circle" size={60} color="yellow" />
     else if(this.state.repuScore >= 80 && this.state.repuScore <= 99) return <MaterialIcons name="emoji-emotions" size={60} color="yellow" />
     else if(this.state.repuScore >= 100) return <MaterialIcons name="emoji-events" size={60} color="yellow" />
     else return <Text>?</Text>
  }



  	render(){

	  return (
	    <View style={styles.container}>
          <LinearGradient
            colors={['rgba(141, 108, 174, 0.90)', 'transparent']}
             style = {styles.gradientContainer}
          />

        <View style={styles.TopView}>
           <Image source={logo} style={{ width: '65%', height: '45%' }} />
           <View style={{
               flexDirection: 'row',
               backgroundColor: 'rgba(0, 0, 0, .2)',
               borderRadius: 80,
               justifyContent: 'center',
               alignItems: 'center'
             }}>
             <Text style={{fontSize: 20, fontWeight: 'bold',  fontFamily: 'monospace', padding: 5}}>12</Text>
             <MaterialIcons  style={{padding:5}} name="masks" size={30} color="white" />
           </View>
        </View >

        {/* VIEW GPS */}
        <View style={{
            width: '90%',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 3,
            backgroundColor: this.state.GPSattivo? 'rgba(0, 0, 0, .2)' : 'rgba(255, 0, 0, .2)' ,
            borderRadius: 20,
          }}>
          <Text style={styles.descr}>{this.state.GPSattivo? "Servizio di\ntracking" : "ATTIVARE IL GPS"}</Text>
          <View  style={{opacity: this.state.GPSattivo? 1 : .3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderColor: 'red' }}>

            <TouchableOpacity style={{width:'40%'}} disabled ={!this.state.GPSattivo} onPress={this.turnOFFtracking}>
             <LinearGradient style={{opacity: this.state.serviceON ? 1 : 0.2, flexDirection: 'row', borderColor: '#156CAE', borderRightWidth: 1, borderBottomLeftRadius: 10, borderTopLeftRadius: 40, height:'60%', alignItems: 'center',  justifyContent: 'center'}}
               colors={["#8d6cae", "#9b46ae"]}>
                 <MaterialIcons name="location-off" size={30} color="'rgba(0,0,0,0.5)'" />
                 <FontAwesome5 name="virus" size={60} color="black" />
               </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={{width:'40%'}} disabled ={!this.state.GPSattivo} onPress={this.turnONtracking}>
             <LinearGradient style={{ opacity: this.state.serviceON ? 0.2 : 1, flexDirection: 'row', borderColor: '#156CAE', borderLeftWidth: 1, borderTopRightRadius: 10, borderBottomRightRadius: 40, height:'60%', alignItems: 'center',  justifyContent: 'center'}}
               colors={["#8d6cae", "#9b46ae"]}>
                 <MaterialIcons name="location-on" size={60} color="black" />
                 <FontAwesome5 name="virus-slash" size={30} color="'rgba(0,0,0,0.5)'" />
               </LinearGradient>
            </TouchableOpacity>
          </View >
          <Text style={styles.descr}>{this.state.serviceON && this.state.GPSattivo? "Attivo" : "Disattivo"}</Text>

        </View >


        <View style={styles.FunctionView}>

          <View style={{
            height: '80%',
            width: '48%',
            backgroundColor: 'rgba(0, 0, 0, .2)',
            borderRadius: 20,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-around',
            }}>

            <Text style={styles.descr}>RepuScore</Text>
            <View style={styles.buttonCircle}>
              <Text style={styles.RepuScore}>{this.state.repuScore}%</Text>
              {this.renderEmoji()}
            </View>
          </View>

          <TouchableOpacity onPress={this.goPhotoScreen}  style={{
            height: '80%',
            width: '48%',
            backgroundColor: 'rgba(0, 0, 0, .2)',
            borderRadius: 20,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-around',
            }}>
            <View style={{flexDirection: 'row'}}>
              <FontAwesome5 style={{padding: 5}} name="head-side-mask" size={50} color="white" />
              <FontAwesome style={{padding: 5}} name="arrow-up" size={50} color="green" />
            </View>
            <MaterialCommunityIcons  name="camera-front-variant" size={130} color="black" />
        </TouchableOpacity>

        </View >


        <View style={styles.BottomView}>
          <View style={{width: '80%', height: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around' }}>
            <TouchableOpacity onPress={this.onShare}><AntDesign name="sharealt" size={40} color="black" /></TouchableOpacity>
            <TouchableOpacity><AntDesign name="infocirlce" size={40} color="black" /></TouchableOpacity>
            <TouchableOpacity onPress={this.goSettingsScreen}><Octicons name="settings" size={40} color="black" /></TouchableOpacity>
          </View>
        </View >

		</View>
	  );

	 }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#156CAE',
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

    TopView:{
      width: '90%',
      marginTop: '5%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flex: 2,
      //backgroundColor: 'yellow',
    },


    FunctionView:{
      width:'90%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flex: 4,
    },


    BottomView:{
      width:'100%',
      alignItems: 'center',
      flex: 1,
      backgroundColor: '#8d6cae',
       borderTopLeftRadius: 60,
       borderTopRightRadius: 60,
    },

    descr: {
      fontSize: 18,
      color: 'white',
     fontFamily: 'monospace',
      textAlign: "center",
    },

    RepuScore: {
      fontSize: 40,
      fontWeight: 'bold',
      color: 'white',
     fontFamily: 'monospace',
      textAlign: "center",
    },

    buttonCircle: {
      width: '80%',
      height: '60%',
      backgroundColor: '#8d6cae',
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 5,
    },

});
