import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
  FlatList,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import StoryCard from './storyCard';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import firebase from 'firebase';
SplashScreen.preventAutoHideAsync();

var customFonts = {
  'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};
var stories = require('./temp_stories.json');

export default class Feed extends React.Component {
  constructor() {
    super();
    this.state = {
      fontsLoaded: false,
      light_theme: true,
      stories: [],
    };
  }
  loadFontsAsync = async () => {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  };
  componentDidMount() {
    this.loadFontsAsync();
    this.fetchUser();
    this.fetchStory();
  }
  renderItem = ({ item: story }) => {
    return <StoryCard story={story} navigation={this.props.navigation} />;
  };
  fetchUser = () => {
    let theme;
    firebase
      .database()
      .ref('/users/' + firebase.auth().currentUser.uid)
      .on('value', (snapshot) => {
        theme = snapshot.val().current_theme;
        this.setState({ light_theme: theme === 'light' });
      });
  };
  fetchStory = () => {
    firebase
      .database()
      .ref('/posts/')
      .on(
        'value',
        (snapshot) => {
          let stories = [];
          if (snapshot.val()) {
            Object.keys(snapshot.val()).forEach(function (key) {
              stories.push({
                key: key,
                value: snapshot.val()[key],
              });
            });
          }
          this.setState({ stories: stories });
          this.props.setUpdateToFalse();
        },
        function (errorObject) {
          console.log('The read failed: ' + errorObject.code);
        }
      );
  };
  render() {
    if (this.state.fontsLoaded) {
      SplashScreen.hideAsync();

      return (
        <View
          style={
            this.state.light_theme ? styles.containerLight : styles.container
          }>
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                style={styles.iconImage}
                source={require('../assets/logo.png')}
              />
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.appTitleTextLight
                    : styles.appTitleText
                }>
                Story Telling App
              </Text>
            </View>
          </View>
          {!this.state.stories[0] ? (
            <View>
              <Text> No Stories Available </Text>
            </View>
          ) : (
            <View style={styles.cardContainer}>
              <FlatList
                data={this.state.stories}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
              />
            </View>
          )}
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15193c',
  },
  containerLight: {
    flex: 1,
    backgroundColor: 'white',
  },
  droidSafeArea: {
    marginTop:
      Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(35),
  },
  appTitle: {
    flex: 0.07,
    flexDirection: 'row',
  },
  appIcon: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: 'center',
  },
  appTitleText: {
    color: 'white',
    fontSize: RFValue(28),
    fontFamily: 'Bubblegum-Sans',
  },
  appTitleTextLight: {
    color: 'black',
    fontSize: RFValue(28),
    fontFamily: 'Bubblegum-Sans',
  },
  cardContainer: {
    flex: 0.93,
  },
});
