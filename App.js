import React, { Component } from 'react';
import { StyleSheet, Text, View , Image, AsyncStorage} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import AppIntroSlider from 'react-native-app-intro-slider';
import { FontAwesome5, Fontisto, MaterialIcons  } from '@expo/vector-icons';

import initialScreen from './screens/initialScreen';
import photoScreen from './screens/PhotoScreen';
import InfoScreen from './screens/InfoScreen';


const AppNavigator = createStackNavigator({
  Initial: {
    screen: initialScreen,
         navigationOptions: {
       title: 'Schermata iniziale',
       headerShown: false
     },
  },

  Photo: {
      screen: photoScreen,
    navigationOptions: {
      title: 'Take Selfie',
      headerShown: false
    },
  },

  Info: {
      screen: InfoScreen,
    navigationOptions: {
      title: 'Take Selfie',
      headerShown: false
    },
  },

},{
        initialRouteName: "Initial"
});

const AppContainer = createAppContainer(AppNavigator);

const slides = [
  {
    key: 's1',
    title: 'Enjoy Maskplease!',
    text: 'L\'idea nasce al fine di tutelare la nostra salute in'+
    ' periodo di pandemia, invogliando l\'utente a rispettare buone norme '+
    ' come quella di indossare la mascherina fuori casa.\n\n'+
    '',
    image: require('./assets/favicon.png'),
    backgroundColor: '#000',
  },
  {
    key: 's2',
    title: 'Il mio RepuScore',
    text: 'E\' un punteggio che misura il tuo senso civico. Il tuo obiettivo coniste '
    + ' nel mantenerlo il più alto possibile, ma come?\n\n'
    +' Semplicemente scattando un selfie mentre indossi la mascherina appena esci di casa: l\'intelligenza artificiale'
    +' la riconoscerà e ti assegnerà dei RepuPoint.\n\nNon dimenticare di farlo'+
     ' altrimenti il tuo RepuScore inizierà a scendere!',
    image: require('./assets/favicon.png'),
    backgroundColor: '#000',
  },
  {
    key: 's3',
    title: 'Per iniziare',
    text: 'Attiva la localizzazione e il servizio di Tracking dall\'App'
    +' così da poter rilevare lo spostamento. Quando ti allontani ti arriverà '+
    ' una notifica e, da quel momento, hai 15 minuti per scattare un selfie.\n\n'+
    ' Ti consigliamo di scattare una foto con il viso centrato in cui si veda bene la mascherina e leggermente gli elastici.',
    image: require('./assets/favicon.png'),
    backgroundColor: '#000',
  },
];



export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showRealApp: false,
      iSeenTutorial: false,
    };
  }

  async componentDidMount() {
    await this.SeenTutorial();

}


  _renderItem = ({ item }) => {
    return (
      <View  style={styles.container}>
        <View  style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={styles.title} >{item.title}</Text>
        </View>

        <View style={{flex: 5}}>
          <View style={styles.SpiegazioneItem}>
          <FontAwesome5 name="shield-virus" size={50} color="white" />
          <Text style={styles.descr}>{item.text}</Text>
          <FontAwesome5 name="lungs-virus" size={50} color="white" />
          </View>

        </View>
      </View>
    );
  }

  _renderNextButton = () => {
    return(
    <View style={styles.buttonCircle}>
      <Text style={styles.buttonText}>avanti</Text>
        <Fontisto name="injection-syringe" size={25} color="white" />
    </View>)  };

  _renderDoneButton = () => {
    return(
    <View style={styles.buttonCircle}>
      <Text style={styles.buttonText}>ok</Text>
      <FontAwesome5 name="head-side-mask" size={25} color="white" />
    </View>)
  };

  _onDone = () => {
    this.setState({ showRealApp: true });
    try {

      //Inizializzo il RepuScore
      AsyncStorage.setItem("RepuScore", "50");
      //Allora devo salvare il fatto che ho visto il tutorial
      AsyncStorage.setItem("TutorialVisto", "visto");

    } catch (error) {
      console.log("Non riesco a salvare lo stato in modo persistente", error);
    }
  };


  _onSkip = () => {
    this.setState({ showRealApp: true });
  };

  SeenTutorial= async () => {
    try {
      AsyncStorage.getItem("TutorialVisto").then((data) => {
        if( data == "visto")
          this.setState({iSeenTutorial: true});
      });

    } catch (error) {
      console.log("Non riesco a salvare lo stato in modo persistente", error);
    }
  };


  render() {
    if (this.state.showRealApp || this.state.iSeenTutorial) {
      return <AppContainer />;
    } else {
      return (
        <AppIntroSlider
          renderItem={this._renderItem}
          data={slides}
          onDone={this._onDone}
          bottomButton = {false}
          renderDoneButton = {this._renderDoneButton}
          renderNextButton={this._renderNextButton}
         />
      );
    }

  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8d6cae',
    alignItems: 'center',
    justifyContent: 'center',
  },


  title: {
   fontSize: 30,
   padding: 5,
    color: '#e3dfc8',
   fontFamily: 'monospace',
   fontWeight: 'bold',
  },

  SpiegazioneItem:{
    margin: '3%',
    padding: '5%',
    width: '90%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, .2)' ,
    borderRadius: 20,
  },


  descr: {
    padding: '10%',
    margin: '5%',
    fontSize: 17,
   fontFamily: 'monospace',
    textAlign: "center",
  },

  buttonText: {
   fontFamily: 'monospace',
  },

  buttonCircle: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },

});
