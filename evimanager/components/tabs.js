import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../screens/Home';
import {
  SettingScreen,
  SettingScreenClassColors,
  SettingScreenDarkWhiteMode,
  SettingScreenUserInformation,
} from '../screens/SettingsScreen';
import MessagesScreen from '../screens/Messages';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import {FONTS, THEME} from '../constants';

const HomeNav = createStackNavigator();

export function HomeStackScreen() {
  return (
    <HomeNav.Navigator screenOptions={{headerShown: false}}>
      <HomeNav.Screen name="HomeNav" component={Home} />
    </HomeNav.Navigator>
  );
}

const SettingNav = createStackNavigator();

export function SettingStackScreen() {
  return (
    <SettingNav.Navigator screenOptions={{headerShown: false}}>
      <SettingNav.Screen name="Settings" component={SettingScreen} />
      <SettingNav.Screen
        name="SettingNavUserInformation"
        component={SettingNavPagesUserInformationStackScreen}
      />
      <SettingNav.Screen
        name="SettingNavDarkWhiteMode"
        component={SettingNavPagesDarkWhiteModeStackScreen}
      />
      <SettingNav.Screen
        name="SettingNavClassColors"
        component={SettingNavPagesClassColorsStackScreen}
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
        options={{
          headerStyle: {
            backgroundColor: THEME.idingo,
            shadowColor: 'transparent',
          },
          headerTintColor: THEME.fontColor,
          headerTitleStyle: {
            fontFamily: FONTS.medium,
          },
        }}
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
        options={{
          headerStyle: {
            backgroundColor: THEME.idingo,
            shadowColor: 'transparent',
          },
          headerTintColor: THEME.fontColor,
          headerTitleStyle: {
            fontFamily: FONTS.medium,
          },
        }}
      />
    </SettingNavPagesDarkWhiteMode.Navigator>
  );
}

const SettingNavPagesClassColors = createStackNavigator();

export function SettingNavPagesClassColorsStackScreen() {
  return (
    <SettingNavPagesClassColors.Navigator screenOptions={{headerShown: true}}>
      <SettingNavPagesClassColors.Screen
        name="Fächerfarben"
        component={SettingScreenClassColors}
        options={{
          headerStyle: {
            backgroundColor: THEME.idingo,
            shadowColor: 'transparent',
          },
          headerTintColor: THEME.fontColor,
          headerTitleStyle: {
            fontFamily: FONTS.medium,
          },
        }}
      />
    </SettingNavPagesClassColors.Navigator>
  );
}

const MessagesStack = createStackNavigator();

export function MessagesStackScreen() {
  return (
    <MessagesStack.Navigator screenOptions={{headerShown: false}}>
      <MessagesStack.Screen name="MessagesNav" component={MessagesScreen} />
    </MessagesStack.Navigator>
  );
}

const HomeTab = createBottomTabNavigator();

export const HomeTabs = () => {
  return (
    <BottomSheetModalProvider>
      <HomeTab.Navigator
        screenOptions={({route}) => ({
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: THEME.navigation,
            borderTopColor: 'transparent',
          },
          tabBarActiveTintColor: THEME.idingo,
          headerShown: false,
          tabBarShowLabel: true,
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'Startseite') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Einstellungen') {
              iconName = focused ? 'cog' : 'cog-outline';
            } else if (route.name === 'Nachrichten') {
              iconName = focused ? 'mail' : 'mail-outline';
            }

            // You can return any component that you like here!
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}>
        <HomeTab.Screen name="Startseite" component={HomeStackScreen} />
        <HomeTab.Screen name="Nachrichten" component={MessagesStackScreen} />
        <HomeTab.Screen name="Einstellungen" component={SettingStackScreen} />
      </HomeTab.Navigator>
    </BottomSheetModalProvider>
  );
};

const SettingTab = createBottomTabNavigator();

export const SettingTabs = () => {
  return (
    <SettingTab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: THEME.navigation,
          borderTopColor: 'transparent',
        },
        tabBarActiveTintColor: THEME.idingo,
        headerShown: false,
        tabBarShowLabel: true,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Startseite') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Einstellungen') {
            iconName = focused ? 'cog' : 'cog-outline';
          } else if (route.name === 'Nachrichten') {
            iconName = focused ? 'mail' : 'mail-outline';
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}>
      <SettingTab.Screen name="Startseite" component={HomeStackScreen} />
      <SettingTab.Screen name="Nachrichten" component={MessagesStackScreen} />
      <SettingTab.Screen name="Einstellungen" component={SettingStackScreen} />
    </SettingTab.Navigator>
  );
};

const MessagesTab = createBottomTabNavigator();

export const MessagesTabs = () => {
  return (
    <MessagesTab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: THEME.navigation,
          borderTopColor: 'transparent',
        },
        tabBarActiveTintColor: THEME.idingo,
        headerShown: false,
        tabBarShowLabel: true,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Startseite') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Einstellungen') {
            iconName = focused ? 'cog' : 'cog-outline';
          } else if (route.name === 'Nachrichten') {
            iconName = focused ? 'mail' : 'mail-outline';
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}>
      <MessagesTab.Screen name="Startseite" component={HomeStackScreen} />
      <MessagesTab.Screen name="Nachrichten" component={MessagesStackScreen} />
      <MessagesTab.Screen name="Einstellungen" component={SettingStackScreen} />
    </MessagesTab.Navigator>
  );
};
