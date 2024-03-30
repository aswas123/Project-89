import React from "react"
import DrawerNavigator from "./navigation/drawerNavigator"
import LoginScreen from "./screens/loginScreen"
import RegisterScreen from './screens/register'
import {createStackNavigator} from "@react-navigation/stack"
import {NavigationContainer} from "@react-navigation/native"
import firebase from "firebase"
import {firebaseConfig} from "./config"
import CustomSideBarMenu from "./screens/customSideBarMenu"

if(!firebase.apps.length){ firebase.initializeApp(firebaseConfig) } else{ firebase.app() }

const Stack = createStackNavigator()

const StackNav=()=>{
   return(
     <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name="Login"  component={LoginScreen}/>
      <Stack.Screen name="RegisterScreen" component={RegisterScreen}/>
      <Stack.Screen name="Dashboard" component={DrawerNavigator}/>
      </Stack.Navigator>
      </NavigationContainer>
    )
}


export default class App extends React.Component{
  render(){
    return(
      <StackNav/>
    )
  }
}