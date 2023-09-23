import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import {THEME, FONTS} from '../constants';
import appStorage from '../components/appStorage';

async function determineRoute(nav) {
  const credentials = await Keychain.getGenericPassword();
  if (credentials) {
    console.log('Key found, redirecting...');
    nav.navigate('Loading');
  } else {
    console.log('No Keys found, login...');
    nav.navigate('Login');
  }
}

function checkStorageVars(){
  if(appStorage.contains('custom/subjectcolor')){
    //do nothing
    console.info("CustomColors exist!")
  }else{
    const defaultColors = {
      'DE': THEME.green,
      'EN': THEME.red,
      'MA': THEME.blue,
      'GE': '#fff',
      'PB': THEME.brown,
      'EK': THEME.brown,
      'PH': THEME.orange,
      'BIO':THEME.mint,
      'KU': THEME.teal,
      'MU': THEME.idingo,
      'DS': THEME.idingo,
      'IF': THEME.yellow,
      'SP': THEME.cyan,
      'SPA': THEME.yellow,
      'FR': THEME.blue,
      'LA': THEME.teal,
      'CH': THEME.yellow,
      'GW': '#fff',
      'NW': THEME.orange,
      'SK': '#1c1c1e',
      'TZ': '#1c1c1e',
      'GE-PB': THEME.brown,
      'MA/INF': THEME.orange,
      "MDK": THEME.brown,
      "FU": "#1c3fe1",
      'RE': THEME.purple,
    }
    appStorage.set('custom/subjectcolor', JSON.stringify(defaultColors))
  }
  //Check if EventDates Array is already existing
  if(appStorage.contains('custom/dates')){
    //do nothing
    console.info("custom/dates exist!")
  }else{
    const dates = {
      example: ['event1', 'event2']
    }
    appStorage.set('custom/dates', JSON.stringify(dates))
  }
  return
}

const AppStart = () => {
  console.info('Site: APPSTART');
  const navigation = useNavigation();

  checkStorageVars();

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
