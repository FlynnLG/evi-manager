import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

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
      <Text style={styles.header}>Credits</Text>
      <Text style={styles.names}>
        Programmierer: Lennard Leonard Grefrath, Valentino Idee: Hanna Sophie
        Eisernack
      </Text>
      <Text style={styles.names}>
        Wenn ihr Feedback oder Verbesserungsvorschläge habt, meldet euch im
        Tasca bei Lennard :)
      </Text>
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
  names: {
    fontFamily: FONTS.semiBold,
    color: THEME.fontColor,
    fontSize: 14,
    paddingTop: 140,
  },
});

export default CreditsScreen;
