import React from "react"
import BottomTabNavigator from "./bottomTabNavigator"
import StoryScreen from "../screens/storyScreen"
import {createStackNavigator} from "@react-navigation/stack"
import {NavigationContainer} from "@react-navigation/native"

const Stack = createStackNavigator()
export default class StackNavigator extends React.Component{
  render(){
    return(
     
      <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name="Home"  component={BottomTabNavigator}/>
      <Stack.Screen name="StoryScreen" component={StoryScreen}/>
      </Stack.Navigator>
      
    )
  }
}