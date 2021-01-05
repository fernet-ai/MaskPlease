import React, { Component } from 'react';
import { StyleSheet, Text, View , Image} from 'react-native';
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
    text: 'Proteggi te e chi ti sta vicino',
    image: require('./assets/favicon.png'),
    backgroundColor: '#000',
  },
  {
    key: 's2',
    title: 'Istruzioni',
    text: 'Descrivi come funziona la cosa',
    image: require('./assets/favicon.png'),
    backgroundColor: '#000',
  },
  {
    key: 's3',
    title: 'Si inizia',
    text: 'Qualcosa di motivazionale per dare la carica',
    image: require('./assets/favicon.png'),
    backgroundColor: '#000',
  },
];



export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showRealApp: false,
    };
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
  };


  _onSkip = () => {
    this.setState({ showRealApp: true });
  };


  render() {
    if (this.state.showRealApp) {
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