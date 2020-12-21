import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import initialScreen from './screens/initialScreen';


export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

const AppNavigator = createStackNavigator({
  Initial: {
    screen: initialScreen,
         navigationOptions: {
       title: 'Schermata iniziale',
       headerShown: false
     },
  },

},{
        initialRouteName: "Initial"
});

const AppContainer = createAppContainer(AppNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
