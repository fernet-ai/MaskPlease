import React, { useEffect } from "react";
import { StyleSheet, Text, View, Slider } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';


export default class SettingsScreen extends React.Component {

    constructor(props) {
      super(props);
    }



  async componentDidMount(){ //Chiamato quando ha finito di renderizzare i componenti

   }



   setNewValue= (value) => {
      console.log("ecco il nuovo valore: "+ value);
   }



  	render(){

	  return (
	    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(141, 108, 174, 0.90)', 'transparent']}
         style = {styles.gradientContainer}
      />

      <Slider
        minimumValue={1}
        maximumValue={10}
        minimumTrackTintColor="#1EB1FC"
        maximumTractTintColor="#1EB1FC"
        step={1}
        value={5}
        onValueChange={value => this.setNewValue(value)}
        style={styles.slider}
        thumbTintColor="#1EB1FC"
      />

        <Text> Settings </Text>
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

  slider: {
      width: '80%',
      transform: [{ rotateZ: '-90deg' }],
}


});
