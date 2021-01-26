import React, { useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, ScrollView  } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';


export default class InfoScreen extends React.Component {

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

      <View style={styles.TopView}>
      <Text style={styles.Title}>FAQ</Text>
      </View>

      <SafeAreaView  style={styles.faqContainer}>
       <ScrollView style={{width: '100%'}}>
        <View style ={styles.faqItem}>
          <Text style ={styles.quest}>Come posso aumentare il mio RepuScore?</Text>
          <Text style ={styles.answer}>
            Puoi ottenere RepuPoint se, uscendo di casa,
            viene scattato una selfie con la mascherina indossata entro 30 minuti.
            Il menu Photo sarò sbloccato solamente quando vi è un effettivo spostamento:
            in tal caso potrai accedervi con un Tap dalla scheramata principale o
            alternativamente pigiando la notifica di avviso appena apparsa.
          </Text>
        </View>
        <View style ={styles.faqItem}>
          <Text style ={styles.quest}>Cosa succede se non scatto la foto entro 30 minuti?</Text>
          <Text style ={styles.answer}>Verrà sottratto un RepuPoint dal tuo RepuScore.</Text>
        </View>
        <View style ={styles.faqItem}>
          <Text style ={styles.quest}>Perché dopo aver scattato la foto, appare "Non riesco a connettermi al Server?"</Text>
          <Text style ={styles.answer}>
            Tipicamente accade se il servizio è in down
            o semplicemente perché la tua connessione internet è scarsa.
          </Text>
        </View>
        <View style ={styles.faqItem}>
          <Text style ={styles.quest}>Perché non ricevo notifiche quando esco?</Text>
          <Text style ={styles.answer}>
            Può accadere ciò nei seguenti scenari:{'\n'}
            - Non hai dato i permessi per la posizione {'\n'}
            - Hai il GPS spento {'\n'}
            - Hai chiuso completamente l' App {'\n'}
            - Non hai una versione di Android 10 o superiore sul tuo smarphone.
          </Text>
        </View>
        <View style ={styles.faqItem}>
          <Text style ={styles.quest}>Come faccio a cambiare posizione di casa?</Text>
          <Text style ={styles.answer}>
            Nel momento in cui si attiva il servizio di Tracking, l' App
            calcola la posizione di casa (con un diametro di 100 metri dal punto ottenuto).
            Per tal motivo, per ripristinare una nuova posizione di checkpoint è necessario
            attivare e disattivare il servizio di Tracking.
          </Text>
        </View>
      </ScrollView>
      </SafeAreaView >

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

    Title: {
      fontSize: 40,
      fontWeight: 'bold',
      color: 'white',
     fontFamily: 'monospace',
      textAlign: "center",
    },

    TopView:{
      paddingTop: '5%',
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
        alignItems: 'center',
      backgroundColor: '#8d6cae',
       borderBottomLeftRadius: 60,
       borderBottomRightRadius: 60,
    },

    faqContainer:{
      width: '90%',
      flexDirection: 'column',
      flex: 9,
      alignItems: 'center',
    },


    faqItem:{
      margin: '3%',
      padding: '5%',
      width: '100%',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, .2)' ,
      borderRadius: 20,
    },

    quest:{
      fontSize: 15,
      fontWeight: 'bold',
      color: 'white',
     fontFamily: 'monospace',
      textAlign: "left",
      padding: 5,
    },

    answer:{
      fontSize: 13,
      color: 'black',
     fontFamily: 'monospace',
      textAlign: "left",
    },


});
