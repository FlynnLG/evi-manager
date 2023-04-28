import React from 'react';
import {Text, View, TouchableOpacity, ScrollView} from 'react-native';

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
        <ScrollView>
          <Text>Message Board</Text>

          <Text>Keine weiteren Nachrichten...</Text>
        </ScrollView>
    </View>
  );
};

export default CreditsScreen;
