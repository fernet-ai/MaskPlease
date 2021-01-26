import React, { useEffect } from "react";
import { StyleSheet, Text, View, AsyncStorage } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import { LocationGeofencingEventType } from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Button, Image, TouchableOpacity, Alert, Share  } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Ionicons, Octicons, AntDesign, MaterialIcons, FontAwesome5, FontAwesome, MaterialCommunityIcons} from '@expo/vector-icons';
import logo from '../assets/logo.png';


const REGION_FETCH_TASK = "upload-job-task-with-location";

var DataUscita = undefined;

TaskManager.defineTask(REGION_FETCH_TASK, async ({ data: { eventType, region }, error }) => {

	if (error) {
		console.log("E' capitato qualche errore");
    return;
  }

	if (eventType === LocationGeofencingEventType.Enter) {
		console.log("Sei a casa:", region);
		await Notifications.scheduleNotificationAsync({
			content: {
			title: "Sei a casa 🏠",
			body: 'Ricorda di cambiare mascherina ogni 4 ore',
			sound: 'email-sound.wav',
			},
			trigger: {
			seconds: 2,
			channelId: 'tomove',
			},
		});
		if(DataUscita != null) 	DataUscita = undefined;
	}

	else if (eventType === LocationGeofencingEventType.Exit) {
		console.log("Sei uscito fuori casa:", region);
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
		if(DataUscita == null)	DataUscita = new Date();
}
});



  const initBackgroundFetch = async () => {
      console.log("chiamo initBackgroundFetch()");


      const locationPermission = await Permissions.askAsync(Permissions.LOCATION);
      const notificationPermission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);

      console.log("Stato permessi di locazione "+ locationPermission.status);

      if (locationPermission.status === "granted" && notificationPermission.status === "granted") {

        const registered = await TaskManager.isTaskRegisteredAsync(REGION_FETCH_TASK);
        if (registered) {
          console.log("registered");
        }


        Notifications.setNotificationChannelAsync('tomove', {
			  name: 'E-mail notifications',
			  importance: Notifications.AndroidImportance.HIGH,
			  sound: 'email-sound.wav',
			});


      let isRegistered = await TaskManager.isTaskRegisteredAsync(REGION_FETCH_TASK);
      if (isRegistered) {
        console.log(`Task ${REGION_FETCH_TASK} Attivita registrata`);
      } else {
        console.log("Background Fetch Task not found - Registrazione nuova attivita ...");
      }

			//Calcolo posizione di casa
			let { coords } = await Location.getCurrentPositionAsync({});
      // Set geofencing su casa
			await Location.startGeofencingAsync(REGION_FETCH_TASK, [{
				latitude:  coords.latitude,
				longitude:  coords.longitude,
				radius: 100,
					}]);
      }

    };



  /*Disattiva Task*/
  const onDisableTask = async () => {
    const isRegisterd = await TaskManager.isTaskRegisteredAsync(REGION_FETCH_TASK );
    if (isRegisterd){
      await Location.stopGeofencingAsync(REGION_FETCH_TASK);
      console.log("Stop geofencing ...");
    }
  };



export default class initialScreen extends React.Component {

    constructor(props) {
      super(props);
    }


    state = {
      serviceON: false,
      GPSattivo: false,
      repuScore: 0,
      numMasks: '?',
      photoScreenBlocked: true,
    };


  async componentDidMount(){ //Chiamato quando ha finito di renderizzare i componenti
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("willFocus", () => {
      console.log("Get Numero mascherine!");
      this.getNumMask();
      //Ecco il repuScore
      this.loadRepuscore();
      // Set scemarop di penalità
      this.setPenality();
    });

    // Listener quando apro sulla notifica
     Notifications.addNotificationResponseReceivedListener(response => {
			 this.goPhotoScreen();
    });

    let servicesEnabled = await Location.hasServicesEnabledAsync();
    this.setState({GPSattivo: servicesEnabled});

    let BackgroundServicesEnabled = await TaskManager.isAvailableAsync();
      if (!BackgroundServicesEnabled) {
        Alert.alert('Qui non posso attivare il background');
      }
   }




   async componentDidUpdate(){
     //Rileva costantemente se il GPS è attivo
     let servicesEnabled = await Location.hasServicesEnabledAsync();
     this.setState({GPSattivo: servicesEnabled}, () => {
       if(!servicesEnabled) this.turnOFFtracking();
        else if (this.state.serviceON) this.turnONtracking();
     });
   }


   componentWillUnmount() {
     // Remove listener del numero di mascherine
     this.focusListener.remove();
   }



   // Decremrnta il RepuScore
   decrementRepuScore = async (punti) => {
     console.log("decremento "+punti+" reputazione ..");
     let OldScore = await AsyncStorage.getItem("RepuScore");
     let newScore = parseInt(OldScore) - punti;
     if(newScore < 0) newScore = 0; // Limite minimo
     console.log("Nuovo score: "+ newScore);
     AsyncStorage.setItem("RepuScore", String(newScore));
     this.loadRepuscore();
   };


   setPenality = async () =>{
     console.log("Calcolo penalità ...");

		 // Sei a casa, non puoi farti la foto
		 if(DataUscita == null) {
				this.setState({photoScreenBlocked: true});
				return -999;
	 		}

		 let  now = new Date();
		 let tempoTrascorso = (now - DataUscita) / 1000;
		 console.log("Son trascorsi "+tempoTrascorso+" da quando sei uscito");

    if(tempoTrascorso <= 60){ // Sei ancora in tempo x fare la foto
        this.setState({photoScreenBlocked: false}); //Sblocca per fare la foto da home
        return 0; // Penalità 0
    }
    else if(tempoTrascorso > 60 ){ this.setState({photoScreenBlocked: true}); DataUscita = undefined;   this.decrementRepuScore(1); return -1;}
    else if(tempoTrascorso > 120 ){ this.setState({photoScreenBlocked: true}); DataUscita = undefined;  this.decrementRepuScore(2); return -2;} //NON VA
    else if(tempoTrascorso > 200 ){ this.setState({photoScreenBlocked: true}); DataUscita = undefined;  this.decrementRepuScore(3); return -3;} // NON VA
    return -999;
   }



   loadRepuscore = async () => {
       AsyncStorage.getItem("RepuScore").then((score) => {
         console.log("Nuovo RepuScore aggiornato: "+ score);
         this.setState({repuScore: score});
    });
   }


   getNumMask = async () => {
		 let url = 'https://maskpleasefunc.azurewebsites.net/api/getNumMask?code=1k6XbH8kKv17KTjjc79P350qo1w1Y99okTvuKQy8K9qJcW6wFY4qqQ=='
     const response = await fetch(url)
     .then((response) => response.text())
      .then((numMascherine) => {
        //Se il server e' spento può dare problemi
        console.log("Numero mascherine "+ numMascherine );
        this.setState({
            numMasks: numMascherine
          });
      })
   };


   nonPuoiAprire = () => {
 		 Alert.alert("Hey, non puoi 😅", 'Puoi fare una sola foto entro 15 minuti dal momento in cui esci fuori di casa (sei avvisato con una notifica) 🚗');
 	}

  goPhotoScreen = () => {
		this.setPenality().then((penality) => {
			if(penality == 0) // se non hai ricevuto penalità e sei ancora in tempo ...
				this.props.navigation.navigate('Photo', {updateData: this.esitoMask});
			else Alert.alert("Mi spiace, sei in ritardo ... 😪👎");
 });
	}

  goInfosScreen = () => {
		this.props.navigation.navigate('Info', {msg: "un messaggio"});
	}

	esitoMask = data => {
	  console.log("Esito del riconoscimento: "+data);
		if(data == "OK MASK" || data == "NO MASK" ||  data == "Error" ) DataUscita = undefined;
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
}

getDevelopProject = async () => {
	Alert.alert(
  'DEVELOPERS 🛠️',
  'Pierluigi Liguori - Fabiano Priore\nProgetto Cloud Computing 20/21'
)
}


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
             <Text style={{fontSize: 20, fontWeight: 'bold',  fontFamily: 'monospace', padding: 5}}>{this.state.numMasks}</Text>
             <MaterialIcons  style={{padding:5}} name="masks" size={30} color="white" />
           </View>
        </View >


				{/*View posizione casa*/}
				<View style={{
						width: '90%',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						flex: 2,
						backgroundColor:'rgba(0, 0, 0, .2)' ,
						borderRadius: 20,
						marginBottom: '5%',
					}}>
					<View style={{
						width: '100%',
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-around',
						}}>
						<Text>Posizione di casa</Text>
							<TouchableOpacity>
								<LinearGradient style={styles.roundButton} colors={["#8d6cae", "#9b46ae"]}>
									<AntDesign name="home" size={18} color="black" />
								</LinearGradient>
							</TouchableOpacity>
					</View>
				</View >



				{/* VIEW GPS */}
        <View style={{
            width: '90%',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 7,
            backgroundColor: this.state.GPSattivo? 'rgba(0, 0, 0, .2)' : 'rgba(255, 0, 0, .2)' ,
            borderRadius: 20,
          }}>
          <Text style={styles.descr}>{this.state.GPSattivo? "Servizio di\ntracking" : "ATTIVARE IL GPS"}</Text>
          <View  style={{opacity: this.state.GPSattivo? 1 : .3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderColor: 'red' }}>

            <TouchableOpacity style={{width:'40%'}} disabled ={!this.state.GPSattivo} onPress={this.turnOFFtracking}>
             <LinearGradient style={{opacity: this.state.serviceON ? 1 : 0.2, flexDirection: 'row', borderColor: '#156CAE', borderRightWidth: 1, borderBottomLeftRadius: 10, borderTopLeftRadius: 40, height:'60%', alignItems: 'center',  justifyContent: 'center'}}
               colors={["#8d6cae", "#9b46ae"]}>
                 <MaterialIcons name="location-off" size={60} color="'rgba(0,0,0,0.5)'" />
                 <FontAwesome5 name="virus" size={30} color="black" />
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

          <View style= {styles.itemFunctionView} >
            <Text style={styles.descr}>RepuScore</Text>
            <View style={styles.buttonCircle}>
              <Text style={styles.RepuScore}>{this.state.repuScore}%</Text>
              {this.renderEmoji()}
            </View>
          </View>

          <TouchableOpacity onPress={this.state.photoScreenBlocked? this.nonPuoiAprire : this.goPhotoScreen}  style={styles.itemFunctionView}>
            <View style={{flexDirection: 'row'}}>
              <FontAwesome5 style={{padding: 5}} name="head-side-mask" size={50} color="white" />
              <FontAwesome style={{padding: 5}} name="arrow-up" size={50} color={this.state.photoScreenBlocked? 'rgba(0, 0, 0, .2)': "green"} />
            </View>
            <MaterialCommunityIcons  name="camera-front-variant" size={130} color="black" />
        </TouchableOpacity>

        </View >


        <View style={styles.BottomView}>
          <View style={{width: '80%', height: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around' }}>
						<MaterialIcons onPress={this.getDevelopProject} name="developer-mode" size={40} color="black" />
						<TouchableOpacity onPress={this.onShare}><AntDesign name="sharealt" size={40} color="black" /></TouchableOpacity>
						<TouchableOpacity onPress={this.goInfosScreen}><AntDesign name="infocirlceo" size={40} color="black" /></TouchableOpacity>
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
		paddingTop: '5%',
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flex: 3,
      //backgroundColor: 'yellow',
    },


    FunctionView:{
      width:'90%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flex: 7,
			margin: '5%',
    },

		itemFunctionView:{
			height: '100%',
			width: '48%',
			backgroundColor: 'rgba(0, 0, 0, .2)',
			borderRadius: 20,
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'space-around',

		},

    BottomView:{
      width:'100%',
      alignItems: 'center',
      flex: 2,
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

		roundButton: {
			justifyContent: 'center',
			alignItems: 'center',
			padding: 10,
			borderRadius: 100,
			backgroundColor: '#8d6cae',
		},

});
