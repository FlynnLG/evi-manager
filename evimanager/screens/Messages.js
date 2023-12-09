import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

import {THEME, FONTS} from '../constants';

const MessagesScreen = ({}) => {
  console.info('Site: MESSAGES');

  return (
    <View
      style={{
        padding: 12,
        alignItems: 'center',
        backgroundColor: THEME.background,
        height: 1000,
      }}>
      <Text style={styles.header}>Messages</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontFamily: FONTS.semiBold,
    color: THEME.fontColor,
    fontSize: 23,
    paddingTop: 140,
  },
});

export default MessagesScreen;
