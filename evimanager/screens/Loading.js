import React, {useEffect} from 'react';
import {Text, View, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {THEME, FONTS} from '../constants';

import * as axios from 'axios';
import * as cheerio from 'cheerio';
import moment from 'moment';
import * as Keychain from 'react-native-keychain';
import appStorage from '../components/appStorage';

import ytm from '../utility/ytm';

const Loading = () => {
  console.info('Site: LOADING');
  const navigation = useNavigation();

  useEffect(() => {
    ytm(navigation).catch(console.error);
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
        Lade Daten... (dies kann ein Moment dauern)
      </Text>
    </View>
  );
};

export default Loading;
