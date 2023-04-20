import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {THEME, FONTS} from '../constants';
import SecureStorage from 'react-native-secure-storage';
import appStorage from '../components/appStorage';

async function userLogout(nav) {
  await SecureStorage.removeItem('localdata.usercredentials').then(async () => {
    appStorage.set('crawler_data', '');
    console.log('DEBUG | Logout');
    nav.navigate('Login');
  });
}

const SettingsScreen = ({}) => {
  console.info('Site: SETTINGS');
  const nav = useNavigation();

  return (
    <View
      style={{
        padding: 12,
        backgroundColor: THEME.background,
        height: 1000,
      }}>
      <TouchableOpacity
        style={styles.testButton}
        onPress={() => {
          userLogout(nav);
        }}>
        <Text style={styles.testButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  testButton: {
    marginTop: 70,
    backgroundColor: 'white',
    borderRadius: 20,
    width: 100,
    alignItems: 'center',
  },
  testButtonText: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: 'red',
  },
});

export default SettingsScreen;
