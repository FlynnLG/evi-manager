import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {createStackNavigator} from '@react-navigation/stack';
import AppStart from '../screens/AppStart';
import Login from '../screens/Login';
import Loading from '../screens/Loading';
import Home from '../screens/Home';
import SettingsScreen from '../screens/SettingsScreen';
import CreditsScreen from '../screens/Credits';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import { THEME } from '../constants';

const HomeNav = createStackNavigator();

export function HomeStackScreen() {
  return (
    <HomeNav.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="HomeNav">
      <HomeNav.Screen name="AppStart" component={AppStart} />
      <HomeNav.Screen name="Login" component={Login} />
      <HomeNav.Screen name="Loading" component={Loading} />
      <HomeNav.Screen name="HomeNav" component={Home} />
      <HomeNav.Screen name="SettingsNav" component={SettingsScreen} />
      <HomeNav.Screen name="CreditsNav" component={CreditsScreen} />
    </HomeNav.Navigator>
  );
}

const SettingsNav = createStackNavigator();

export function SettingsStackScreen() {
  return (
    <SettingsNav.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="SettingsNav">
      <SettingsNav.Screen name="AppStart" component={AppStart} />
      <SettingsNav.Screen name="Login" component={Login} />
      <SettingsNav.Screen name="Loading" component={Loading} />
      <SettingsNav.Screen name="HomeNav" component={Home} />
      <SettingsNav.Screen name="SettingsNav" component={SettingsScreen} />
      <SettingsNav.Screen name="CreditsNav" component={CreditsScreen} />
    </SettingsNav.Navigator>
  );
}

const CreditsStack = createStackNavigator();

export function CreditsStackScreen() {
  return (
    <CreditsStack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="CreditsNav">
      <CreditsStack.Screen name="AppStart" component={AppStart} />
      <CreditsStack.Screen name="Login" component={Login} />
      <CreditsStack.Screen name="Loading" component={Loading} />
      <CreditsStack.Screen name="HomeNav" component={Home} />
      <CreditsStack.Screen name="SettingsNav" component={SettingsScreen} />
      <CreditsStack.Screen name="CreditsNav" component={CreditsScreen} />
    </CreditsStack.Navigator>
  );
}

const HomeTab = createBottomTabNavigator();

export const HomeTabs = () => {
  return (
    <BottomSheetModalProvider>
      <HomeTab.Navigator
        screenOptions={({route}) => ({
          tabBarStyle: {position: 'absolute', backgroundColor: THEME.secondary},
          tabBarActiveTintColor: '#007aff',
          headerShown: false,
          tabBarShowLabel: true,
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'cog' : 'cog-outline';
            } else if (route.name === 'Credits') {
              iconName = focused
                ? 'information-circle'
                : 'information-circle-outline';
            }

            // You can return any component that you like here!
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
        initialRouteName="Home">
        <HomeTab.Screen name="Home" component={HomeStackScreen} />
        <HomeTab.Screen name="Settings" component={SettingsStackScreen} />
        <HomeTab.Screen name="Credits" component={CreditsStackScreen} />
      </HomeTab.Navigator>
    </BottomSheetModalProvider>
  );
};

const SettingsTab = createBottomTabNavigator();

export const SettingsTabs = () => {
  return (
    <SettingsTab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: {position: 'absolute', backgroundColor: THEME.secondary},
        tabBarActiveTintColor: '#007aff',
        headerShown: false,
        tabBarShowLabel: true,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'cog' : 'cog-outline';
          } else if (route.name === 'Credits') {
            iconName = focused
              ? 'battery-outline'
              : 'information-circle-outline';
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      initialRouteName="Settings">
      <SettingsTab.Screen name="Home" component={HomeStackScreen} />
      <SettingsTab.Screen name="Settings" component={SettingsStackScreen} />
      <SettingsTab.Screen name="Credits" component={CreditsStackScreen} />
    </SettingsTab.Navigator>
  );
};

const CreditsTab = createBottomTabNavigator();

export const CreditsTabs = () => {
  return (
    <CreditsTab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: {position: 'absolute', backgroundColor: THEME.secondary},
        tabBarActiveTintColor: '#007aff',
        headerShown: false,
        tabBarShowLabel: true,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'cog' : 'cog-outline';
          } else if (route.name === 'Credits') {
            iconName = focused
              ? 'information-circle'
              : 'information-circle-outline';
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      initialRouteName="Credits">
      <CreditsTab.Screen name="Home" component={HomeStackScreen} />
      <CreditsTab.Screen name="Settings" component={SettingsStackScreen} />
      <CreditsTab.Screen name="Credits" component={CreditsStackScreen} />
    </CreditsTab.Navigator>
  );
};
