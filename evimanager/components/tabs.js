import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {createStackNavigator} from '@react-navigation/stack';
import AppStart from '../screens/AppStart';
import Login from '../screens/Login';
import Loading from '../screens/Loading';
import Home from '../screens/Home';
import {
  SettingScreen,
  SettingScreenDarkWhiteMode,
  SettingScreenUserInformation,
} from '../screens/SettingsScreen';
import CreditsScreen from '../screens/Credits';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import {THEME} from '../constants';

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
      <HomeNav.Screen name="SettingNav" component={SettingScreen} />
      <HomeNav.Screen name="CreditsNav" component={CreditsScreen} />
    </HomeNav.Navigator>
  );
}

const SettingNav = createStackNavigator();

export function SettingStackScreen() {
  return (
    <SettingNav.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Einstellungen">
      <SettingNav.Screen name="Einstellungen" component={SettingScreen} />
      <SettingNav.Screen
        name="SettingNavUserInformation"
        component={SettingNavPagesUserInformationStackScreen}
      />
      <SettingNav.Screen
        name="SettingNavDarkWhiteMode"
        component={SettingNavPagesDarkWhiteModeStackScreen}
      />
    </SettingNav.Navigator>
  );
}

const SettingNavPagesUserInformation = createStackNavigator();

export function SettingNavPagesUserInformationStackScreen() {
  return (
    <SettingNavPagesUserInformation.Navigator
      screenOptions={{headerShown: true}}>
      <SettingNavPagesUserInformation.Screen
        name="Benutzer"
        component={SettingScreenUserInformation}
      />
    </SettingNavPagesUserInformation.Navigator>
  );
}

const SettingNavPagesDarkWhiteMode = createStackNavigator();

export function SettingNavPagesDarkWhiteModeStackScreen() {
  return (
    <SettingNavPagesDarkWhiteMode.Navigator screenOptions={{headerShown: true}}>
      <SettingNavPagesDarkWhiteMode.Screen
        name="Darstellung"
        component={SettingScreenDarkWhiteMode}
      />
    </SettingNavPagesDarkWhiteMode.Navigator>
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
      <CreditsStack.Screen name="SettingNav" component={SettingScreen} />
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
          tabBarStyle: {position: 'absolute', backgroundColor: THEME.gray6},
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
        <HomeTab.Screen name="Settings" component={SettingStackScreen} />
        <HomeTab.Screen name="Credits" component={CreditsStackScreen} />
      </HomeTab.Navigator>
    </BottomSheetModalProvider>
  );
};

const SettingTab = createBottomTabNavigator();

export const SettingTabs = () => {
  return (
    <SettingTab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: {position: 'absolute', backgroundColor: THEME.gray6},
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
      initialRouteName="Settings">
      <SettingTab.Screen name="Home" component={HomeStackScreen} />
      <SettingTab.Screen name="Settings" component={SettingStackScreen} />
      <SettingTab.Screen name="Credits" component={CreditsStackScreen} />
    </SettingTab.Navigator>
  );
};

const CreditsTab = createBottomTabNavigator();

export const CreditsTabs = () => {
  return (
    <CreditsTab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: {position: 'absolute', backgroundColor: THEME.gray6},
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
      <CreditsTab.Screen name="Settings" component={SettingStackScreen} />
      <CreditsTab.Screen name="Credits" component={CreditsStackScreen} />
    </CreditsTab.Navigator>
  );
};
