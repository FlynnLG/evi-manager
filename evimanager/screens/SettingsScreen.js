import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {THEME, FONTS} from '../constants';
import EncryptedStorage from 'react-native-encrypted-storage';
import appStorage from '../components/appStorage';

async function userLogout(nav) {
  await EncryptedStorage.removeItem('localdata.usercredentials').then(
    async () => {
      appStorage.set('crawler_data', '');
      console.log('DEBUG | Logout');
      nav.navigate('Login');
    },
  );
}

const changeTheme = async(button) => {
  await EncryptedStorage.setItem('localdata:settings/theme', button)
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
      <Text style={styles.header}>Settings</Text>


      <Button onPress={changeTheme("SYSLIGHT")}>SYSLIGHT</Button>
      <Button onPress={changeTheme("SYSDARK")}>SYSDARK</Button>
      <Button onPress={changeTheme("NIGHTLY")}>NIGHTLY</Button>

      
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
    backgroundColor: THEME.fontColor,
    height: 50,
    width: 200,
  },
  darkModeButton: {
    position: 'absolute',
    borderColor: THEME.fontColor,
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
