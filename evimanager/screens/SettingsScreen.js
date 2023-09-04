import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet, ScrollView, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import RNRestart from 'react-native-restart';

import {THEME, FONTS, getStorage} from '../constants';
import appStorage from '../components/appStorage';
import Icon from 'react-native-vector-icons/Ionicons';

import { FächerfarbenBtn } from '../components/fächerfarbenBtn';

async function userLogout(nav) {
  await AsyncStorage.removeItem('localdata.usercredentials').then(
    async () => {
      appStorage.set('crawler_data', '');
      console.log('DEBUG | Logout');
      nav.navigate('Login');
    },
  );
}

async function switchTheme(theme){
    appStorage.set('@localdata:settings/theme', theme)
    getStorage();
    await appStorage.set('?restart', true)
    RNRestart.restart()
}

const SettingsScreen = ({}) => {
  console.info('Site: SETTINGS');
  const nav = useNavigation();

  const possibleSubjects = [
    {subjectShort: "DE",},
    {subjectShort: "EN",},
    {subjectShort: "MA",},
    {subjectShort: "GE",},
    {subjectShort: "PB",},
    {subjectShort: "EK",},
    {subjectShort: "PH",},
    {subjectShort: "BIO",},
    {subjectShort: "KU",},
    {subjectShort: "MU",},
    {subjectShort: "DS",},
    {subjectShort: "IF",},
    {subjectShort: "SP",},
    {subjectShort: "SPA",},
    {subjectShort: "FR",},
    {subjectShort: "LA",},
    {subjectShort: "CH",},
    {subjectShort: "GW",},
    {subjectShort: "NW",},
    {subjectShort: "SK",},
    {subjectShort: "TZ",},
    {subjectShort: "GE-PB",},
    {subjectShort: "MA/INF",},
    {subjectShort: "MDK",},
    {subjectShort: "FU",},
  ]

  return (
    <View
      style={{
        padding: 12,
        backgroundColor: THEME.background,
        height: 1000,
        alignItems: 'center',
      }}>
      

      <Text style={styles.header}>Settings</Text>
      <View>
      
        <TouchableOpacity style={styles.btnLightmode}>
          <Icon name="sunny" size={25} color="#000" onPress={() => switchTheme('SYSTEMLIGHT')}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnDarkmode} onPress={() => switchTheme('SYSTEMDARK')}>
        <Icon name="moon" size={25} color="#fff"/>
        </TouchableOpacity>
      </View>
      <View style={styles.line}></View>
      <Text>Fächerfarben</Text>
      <View>
        <FlatList
          data={possibleSubjects}
          renderItem={({item}) => <FächerfarbenBtn subject={item.subjectShort}/>}
          numColumns={5}
          key={4}
        />
      </View>

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
    fontFamily: FONTS.semiBold,
    color: THEME.fontColor,
    fontSize: 23,
    paddingTop: 140,
  },
  subheader: {
    fontFamily: FONTS.bold,
    color: THEME.fontColor,
    fontSize: 19,
  },
  btnDarkmode: {
    backgroundColor: '#000',
    borderColor: '#fff',
    borderWidth: 1,
    padding: 20,
    borderRadius: 50,
  },
  btnLightmode: {
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    padding: 20,
    borderRadius: 50,
  },
  testButton: {
    marginTop: 70,
    backgroundColor: THEME.red,
    borderRadius: 8,
    width: 100,
    height: 40,
    paddingTop: 8,
    alignItems: 'center',
  },
  testButtonText: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: THEME.fontColor,
  },
  line: {
    marginTop: 12,
    marginBottom: 12,
    height: 1.3,
    width: 3800,
    backgroundColor: THEME.darkGrey
  },
});

export default SettingsScreen;
