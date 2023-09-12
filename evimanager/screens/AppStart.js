import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import {THEME, FONTS} from '../constants';

async function determineRoute(nav) {
  const credentials = await Keychain.getGenericPassword();
  if (credentials) {
    console.log('Key found, redirecting...');
    nav.navigate('Loading');
  } else {
    console.log('No Keys found, login...');
    nav.navigate('Login');
  }


const AppStart = () => {
  console.info('Site: APPSTART');
  const navigation = useNavigation();

  useEffect(() => {
    determineRoute(navigation).catch(console.error);
  });

  return (
    <View
      style={{
        padding: 12,
        alignItems: 'center',
        backgroundColor: THEME.background,
        height: 1000,
      }}>
      <Text
        style={{
          fontFamily: FONTS.bold,
          color: THEME.fontColor,
          fontSize: 32,
          paddingTop: 350,
        }}>
        EVI-Manager
      </Text>
      <Text
        style={{
          fontFamily: FONTS.bold,
          color: THEME.fontColor,
          paddingTop: 370,
        }}>
        App startet...
      </Text>
    </View>
  );
};

export default AppStart;
