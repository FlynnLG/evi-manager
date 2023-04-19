import React, {useState} from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {THEME, FONTS, assets} from '../constants';
import SecureStorage from 'react-native-secure-storage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

async function handelLogin(navigation, username, password) {
  console.log(username + ';' + password);
  console.log('Navigation to LOADING!');
  await SecureStorage.setItem(
    'localdata.usercredentials',
    username + ';' + password,
  ).then(navigation.navigate('Loading'));
}

const Login = () => {
  console.info('Site: LOGIN');
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');

  return (
    <View
      style={{
        paddingTop: 120,
        padding: 26,
        backgroundColor: THEME.background,
        color: THEME.fontColor,
        height: 1000,
      }}>
      <Image
        source={assets.background}
        style={{
          position: 'absolute',
          height: 310,
          width: windowWidth,
        }}
      />

      <Text
        style={{
          fontFamily: FONTS.bold,
          color: THEME.fontColor,
          fontSize: 20,
          paddingLeft: 5,
          marginTop: 150,
        }}>
        EVI-Login
      </Text>
      <TextInput
        placeholder="Username"
        placeholderTextColor={THEME.fontColor}
        onChangeText={newText => setName(newText)}
        style={{
          marginTop: 30,
          backgroundColor: THEME.darkGrey,
          borderRadius: 11,
          height: 50,
          padding: 10,
          paddingTop: 12,
          fontFamily: FONTS.medium,
          color: THEME.fontColor,
        }}
      />
      <TextInput
        placeholder="Passwort"
        placeholderTextColor={THEME.fontColor}
        secureTextEntry={true}
        onChangeText={newText => setPass(newText)}
        style={{
          marginTop: 35,
          marginBottom: 5,
          backgroundColor: THEME.darkGrey,
          borderRadius: 11,
          height: 50,
          padding: 10,
          paddingTop: 12,
          fontFamily: FONTS.medium,
          color: THEME.fontColor,
        }}
      />
      <Text
        style={{
          fontFamily: FONTS.medium,
          fontSize: 9.99,
          alignItems: 'center',
          padding: 10,
          color: THEME.fontColor,
        }}>
        Mit der Fortführung dieser Anmeldung, stimmen Sie den AGB's zu.
      </Text>

      <TouchableOpacity
        onPress={() => handelLogin(navigation, name, pass)}
        style={{alignItems: 'center', marginTop: 120}}>
        <Image source={assets.loginButton} style={{width: 70, height: 70}} />
      </TouchableOpacity>
    </View>
  );
};

export default Login;
