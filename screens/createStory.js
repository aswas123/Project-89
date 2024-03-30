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
  TextInput,
  ScrollView,
  Dimensions,
  Button,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import firebase from 'firebase';

SplashScreen.preventAutoHideAsync();

var customFonts = {
  'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};
var stories = require('./temp_stories.json');

export default class CreateStory extends React.Component {
  constructor() {
    super();
    this.state = {
      fontsLoaded: false,
      previewImage: 'image_1',
      dropDownHeight: 40,
      light_theme: true,
    };
  }
  loadFontsAsync = async () => {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  };
  componentDidMount() {
    this.loadFontsAsync();
    this.fetchUser();
  }
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
  addStory = async () => {
    if (
      this.state.title &&
      this.state.description &&
      this.state.story &&
      this.state.moral
    ) {
      var storyData = {
        preview_image: this.state.previewImage,
        title: this.state.title,
        description: this.state.description,
        story: this.state.story,
        moral: this.state.moral,
        author: firebase.auth().currentUser.displayName,
        created_on: new Date(),
        author_uid: firebase.auth().currentUser.uid,
        likes: 0,
      };
      await firebase
        .database()
        .ref('/posts/' + Math.random().toString(36).slice(2))
        .set(storyData)
        .then((snapShot) => {
          this.props.navigation.navigate('Feed');
        });
    } else {
      alert(
        'Error',
        'All fields are required!',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
    }
  };

  render() {
    if (this.state.fontsLoaded) {
      SplashScreen.hideAsync();
      var preview_images = {
        image_1: require('../assets/story_image_1.png'),
        image_2: require('../assets/story_image_2.png'),
        image_3: require('../assets/story_image_3.png'),
        image_4: require('../assets/story_image_4.png'),
        image_5: require('../assets/story_image_5.png'),
      };
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
                New Story
              </Text>
            </View>
          </View>
          <View style={styles.fieldsContainer}>
            <Image
              style={styles.previewImage}
              source={preview_images[this.state.previewImage]}
            />
            <View style={{ height: RFValue(this.state.dropDownHeight) }}>
              <DropDownPicker
                items={[
                  { label: 'image 1', value: 'image_1' },
                  { label: 'image 2', value: 'image_2' },
                  { label: 'image 3', value: 'image_3' },
                  { label: 'image 4', value: 'image_4' },
                  { label: 'image 5', value: 'image_5' },
                ]}
                defaultValue={this.state.previewImage}
                open={this.state.dropDownHeight === 170 ? true : false}
                onOpen={() => {
                  this.setState({ dropDownHeight: 170 });
                }}
                onClose={() => {
                  this.setState({ dropDownHeight: 40 });
                }}
                onSelectItem={(item) => {
                  this.setState({ previewImage: item.value });
                }}
              />
            </View>
            <ScrollView>
              <TextInput
                style={styles.inputFont}
                onChangeText={(title) => {
                  this.setState({ title });
                }}
                placeholder={'Title'}
                placeholderTextColor={'pink'}
              />
              <TextInput
                style={styles.inputFont}
                onChangeText={(description) => {
                  this.setState({ description });
                }}
                placeholder={'Description'}
                multiline={true}
                placeholderTextColor={'pink'}
              />
              <TextInput
                style={styles.inputFont}
                onChangeText={(story) => {
                  this.setState({ story });
                }}
                placeholder={'Story'}
                multiline={true}
                placeholderTextColor={'pink'}
              />
              <TextInput
                style={styles.inputFont}
                onChangeText={(moral) => {
                  this.setState({ moral });
                }}
                placeholder={'Moral'}
                multiline={true}
                placeholderTextColor={'pink'}
              />

              <View>
                <Button
                  title={'Submit'}
                  onPress={() => {
                    this.addStory();
                  }}
                />
              </View>
            </ScrollView>
          </View>
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
    backgroundColor: 'White',
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
  fieldsContainer: {
    flex: 0.85,
  },
  previewImage: {
    width: '93%',
    height: RFValue(250),
    alignSelf: 'center',
    borderRadius: RFValue(10),
    marginVertical: RFValue(10),
    resizeMode: 'contain',
  },
  inputFont: {
    height: RFValue(40),
    borderColor: 'white',
    borderWidth: RFValue(1),
    borderRadius: RFValue(10),
    paddingLeft: RFValue(10),
    color: 'white',
    marginTop: RFValue(10),
    fontFamily: 'Bubblegum-Sans',
  },
  inputFontExtra: {
    marginTop: RFValue(15),
  },
  inputTextBig: {
    textAlignVertical: 'top',
    padding: RFValue(5),
  },
});
