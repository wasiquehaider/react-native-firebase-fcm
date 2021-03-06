import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, AsyncStorage, Alert } from "react-native";
import firebase from "react-native-firebase";
import FlashMessage, {
  showMessage,
  hideMessage
} from "react-native-flash-message";

export default class App extends Component {
  constructor(props){
    super(props)
    
    this.state = {
      descriptionText : 'some default value or empty string',
      token: ''
    }
  
  }
  
  
  
  async componentDidMount() {
    this.checkPermission();
    this.createNotificationListeners();
  }

  
  //1
  async checkPermission() {
    firebase
      .messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          // user has permissions
          console.log("Permission granted");
          this.getToken();
        } else {
          // user doesn't have permission
          console.log("Permission request");
          this.requestPermission();
        }
      });

    // const enabled = await firebase.messaging().hasPermission();
    // if (enabled) {
    //   this.getToken();
    // } else {
    //   this.requestPermission();
    // }
  }

  //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem("fcmToken");
    console.log("before fcmtoken", fcmToken);
    console.warn(fcmToken);
    this.setState({
      token: fcmToken
    })
    
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem("fcmToken", fcmToken);
        console.log("after fcmtoken", fcmToken);
      }
    }
  }

  //2
  async requestPermission() {
    // try {
    //   await firebase.messaging().requestPermission();
    //   // User has authorised
    //   this.getToken();
    // } catch (error) {
    //   // User has rejected permissions
    //   console.log("permission rejected");
    // }

    firebase
      .messaging()
      .requestPermission()
      .then(() => {
        // User has authorised
        console.log("Permission granted in requestPermission");
        this.getToken();
      })
      .catch(error => {
        // User has rejected permissions
        console.log("permission rejected");
      });
  }

  ////////////////////// Add these methods //////////////////////

  //Remove listeners allocated in createNotificationListeners()
  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }

  async createNotificationListeners() {
    /*
     * Triggered when a particular notification has been received in foreground
     * */
    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        const { title, body, sound } = notification;
        this.showAlert(title, body, sound);
       
      });
    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        const { title, body, sound } = notificationOpen.notification;
        this.showAlert(title, body, sound);
        
      });

    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const { title, body, sound } = notificationOpen.notification;
      this.showAlert(title, body, sound);
    
    }
    /*
     * Triggered for data only payload in foreground
     * */
    this.messageListener = firebase.messaging().onMessage(message => {
      //process data message
      console.log(JSON.stringify(message));
    });
    
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text>{this.state.token}</Text>
         <FlashMessage position="top"/>
      </View>
    );
  }

  
  showAlert(title, body) {
    // Alert.alert(
    //   title, body,
    //   [
    //       { text: 'OK', onPress: () => console.log('OK Pressed') },
    //   ],
    //   { cancelable: false },
    // );

    showMessage({
      message: body,
      description:title,
      type: "info",
      floating: true,
      icon: 'info'
    });
 
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});



