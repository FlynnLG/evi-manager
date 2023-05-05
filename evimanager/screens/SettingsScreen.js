import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Touchable} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {THEME, FONTS} from '../constants';
import EncryptedStorage from 'react-native-encrypted-storage';
import appStorage from '../components/appStorage';

async function userLogout(nav) {
  await EncryptedStorage.removeItem('localdata.usercredentials').then(async () => {
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
        alignItems: 'center',
      }}>
      <TouchableOpacity
       style={styles.lightModeButton}>
        <Text>LightMode</Text>
       </TouchableOpacity>
       <TouchableOpacity
       style={styles.darkModeButton}>
        <Text>DarkMode</Text>
       </TouchableOpacity>

      <Text style={styles.header}>Settings</Text>
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
  header: {
    fontFamily: FONTS.bold,
    color: THEME.fontColor,
    fontSize: 23,
    paddingTop: 90,
  },
  lightModeButton: {
    position: 'absolute',
    top: 250,
    marginRight: 100,
    borderColor: '#262626',
    border: 20,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    height: 50,
    width: 200,
  },
  darkModeButton: {
    position: 'absolute',
    borderColor: '#FFFFFF',
    border: 20,
    backgroundColor: '#262626',
    borderRadius: 8,
    height: 50,
    width: 200,
  },
  testButton: {
    marginTop: 70,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    width: 100,
    height: 40,
    paddingTop: 8,
    alignItems: 'center',
  },
  testButtonText: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: '#E1E1E1',
  },
});

export default SettingsScreen;
