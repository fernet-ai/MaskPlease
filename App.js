import React, { Component } from 'react';
import { StyleSheet, Text, View , Image, AsyncStorage} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import AppIntroSlider from 'react-native-app-intro-slider';
import { FontAwesome5, Fontisto, MaterialIcons  } from '@expo/vector-icons';

import initialScreen from './screens/initialScreen';
import photoScreen from './screens/PhotoScreen';
import SettingsScreen from './screens/SettingsScreen';


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

  Settings: {
      screen: SettingsScreen,
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
    title: 'Benvenuto!',
    text: 'obbbiettivi(scopo)',
    image: require('./assets/favicon.png'),
    backgroundColor: '#000',
  },
  {
    key: 's2',
    title: 'Istruzioni',
    text: 'RepuPoint/foto/esci fuori casi',
    image: require('./assets/favicon.png'),
    backgroundColor: '#000',
  },
  {
    key: 's3',
    title: 'Si inizia',
    text: 'Attiva gps/ come fare photo',
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
        <Text style={styles.title} >{item.title}</Text>
        <MaterialIcons name="coronavirus" size={70} color="white" />
        <Text style={styles.descr}>{item.text}</Text>
        <FontAwesome5 name="shield-virus" size={70} color="white" />
        <Text style={styles.descr}>{item.text}</Text>
        <FontAwesome5 name="lungs-virus" size={70} color="white" />
        <Text style={styles.descr}>{item.text}</Text>
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
   fontSize: 40,
   padding: 5,
    color: '#e3dfc8',
   fontFamily: 'monospace',
   fontWeight: 'bold',
  },

  descr: {
    padding: 10,
    fontSize: 20,
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
