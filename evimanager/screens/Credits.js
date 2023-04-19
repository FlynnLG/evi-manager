import React from 'react';
import {Settings, Text, View, TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {THEME, FONTS} from '../constants';


const CreditsScreen = ({}) => {
  console.info('Site: CREDITS');

  return (
    <View
      style={{
        padding: 12,
        alignItems: 'center',
        backgroundColor: THEME.background,
        height: 1000,
      }}>
      <TouchableOpacity>
        <Text>Credits</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreditsScreen;
