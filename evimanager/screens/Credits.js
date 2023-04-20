import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';

import {THEME} from '../constants';

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
