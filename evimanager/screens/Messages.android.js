import React, {Suspense, useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {assets, FONTS, THEME} from '../constants';
import Keychain from 'react-native-keychain';
import axios from 'axios';
import * as cheerio from 'cheerio';
import Dropdown from 'react-native-input-select';
import {heightPixel} from '../components/lessoncard';
import Icon from 'react-native-vector-icons/Ionicons';
import {RadioButton} from 'react-native-paper';

const windowsHeight = Dimensions.get('window').height;
// TEMPORARY BACKEND FOR SENDING MESSAGES

async function getNamesFlatlist(type) {
  try {
    let final;
    const credentials = await Keychain.getGenericPassword();
    if (!credentials || !credentials.username || !credentials.password) {
      await Keychain.resetGenericPassword().then(async () => {
        console.error('Login-Daten konnten nicht geladen werden');
        Alert.alert(
          'Fehler',
          'Die Empfänger konnten nicht geladen werden, da deine Nutzer-Daten nicht gelesen werden konnten. Bitte versuche es erneut.',
          [{text: 'OK', style: 'cancel'}],
          {cancelable: false},
        );
      });
      return;
    }
    await axios
      .get(
        `https://gymnasium-neuruppin.de/index.php?startlog=1&user=${credentials.username}&pass=${credentials.password}`,
      )
      .then(async response => {
        if (response.status === 200) {
          const sites = ['a', 'd', 'g', 'k', 'n', 'q', 't', 'w'];
          for (const site of sites) {
            await axios
              .get(
                `https://gymnasium-neuruppin.de/index.php?action=${type}&oid=22&id=118&alpos=${site}`,
              )
              .then(async response => {
                if (response.status === 200) {
                  let html = response.data;
                  let $ = cheerio.load(html);

                  // Get current class of user
                  const filtered = $(
                    'body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > form > table > tbody > tr:nth-child(1) > td:nth-child(2) > select',
                  )
                    .html()
                    .split('</option>')
                    .join(',')
                    .split('value="')
                    .join(',')
                    .split(',<option ,');

                  filtered[filtered.length - 1] = filtered[filtered.length - 1]
                    .toString()
                    .replace(/,\s*$/, '');
                  filtered.shift();
                  if (!final) {
                    final = filtered;
                  } else {
                    final = final.concat(filtered);
                  }
                }
              });
          }
        }
      });
    return final.map(name => ({
      name: name.split('">')[0],
      value: name.split('">')[1],
    })); //TODO: maybe save this in localStorage, with timeStamp, when timeStamp is older than 24h than crawl new data
  } catch (error) {
    console.error(error);
  }
}

// END TEMPORARY BACKEND FOR SENDING MESSAGES

const MessagesScreen = ({}) => {
  console.info('Site: MESSAGES');
  const [dropdownitem, setDropdownitem] = React.useState();
  let [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  const [selectedValue, setSelectedValue] = React.useState();
  const [message, setMessage] = React.useState('');

  async function sendMessageToUser(user, content) {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (!credentials || !credentials.username || !credentials.password) {
        await Keychain.resetGenericPassword().then(async () => {
          console.error('Login-Daten konnten nicht geladen werden');
          Alert.alert(
            'Fehler',
            'Deine Nachricht konnte nicht gesendet werden, da deine Nutzer-Daten nicht gelesen werden konnten. Bitte versuche es erneut.',
            [{text: 'OK', style: 'cancel'}],
            {cancelable: false},
          );
        });
        return false;
      }
      await axios
        .get(
          `https://gymnasium-neuruppin.de/index.php?startlog=1&user=${credentials.username}&pass=${credentials.password}`,
        )
        .then(async response => {
          if (response.status === 200) {
            await axios({
              url: 'https://gymnasium-neuruppin.de/index.php?id=118&oid=22&action=ausgang',
              method: 'POST',
              credentials: 'include',
              headers: {
                'Accept-Language': 'de,en-US;q=0.7,en;q=0.3',
                'Content-Type':
                  'multipart/form-data; boundary=---------------------------316648145626523606082784631850', // 316648145626523606082784631850 represents custom and unique boundary which is used that the receiver (server) knows how to split the multipart HTTP request correctly
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-User': '?1',
              },
              referrer:
                'https://gymnasium-neuruppin.de/index.php?action=einzelsch&oid=22&id=118&alpos=g',
              data: `-----------------------------316648145626523606082784631850\r\nContent-Disposition: form-data; name="ziel"\r\n\r\n${user}\r\n-----------------------------316648145626523606082784631850\r\nContent-Disposition: form-data; name="eintrag"\r\n\r\n${content}\r\n-----------------------------316648145626523606082784631850\r\nContent-Disposition: form-data; name="send1"\r\n\r\nAbsenden\r\n-----------------------------316648145626523606082784631850--\r\n`,
              mode: 'cors',
            }).then(() => {
              Alert.alert(
                'Nachricht gesendet',
                'Deine Nachricht wurde erfolgreich gesendet.',
                [{text: 'OK', style: 'cancel'}],
                {cancelable: false},
              );
              setMessage();
              setDropdownitem();
              setSelectedValue();
              setData();
            });
          }
        });
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchData(type) {
    try {
      setLoading(true);
      const result = await getNamesFlatlist(type);
      setData(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  function activityIndicatorWhenLoading() {
    if (!selectedValue) {
      return null;
    } else {
      return (
        <ActivityIndicator
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      );
    }
  }

  // return a Spinner when loading is true rrrrrrr
  if (loading || (!loading && !selectedValue)) {
    return (
      <SafeAreaView
        onTouchStart={() => Keyboard.dismiss()}
        style={{backgroundColor: THEME.background, height: windowsHeight}}>
        {activityIndicatorWhenLoading()}
        <KeyboardAvoidingView>
          <View
            contentContainerStyle={[
              styles.container,
              {marginTop: heightPixel(-50)},
            ]}
            style={{marginLeft: 20, marginRight: 20}}>
            <Text style={styles.sectionHeaderText}>
              An wen soll die Nachricht gehen?
            </Text>
            <View style={styles.section}>
              <RadioButton.Group
                onValueChange={value => {
                  if (value === 'students') {
                    setDropdownitem();
                    fetchData('einzelsch');
                    setSelectedValue('students');
                    console.log('SELECTED STUDENTS');
                  } else if (value === 'teachers') {
                    setDropdownitem();
                    fetchData('einzelleh');
                    setSelectedValue('teachers');
                    console.log('SELECTED TEACHERS');
                  } else if (value === 'graduates') {
                    setDropdownitem();
                    fetchData('einzelehe');
                    setSelectedValue('graduates');
                    console.log('SELECTED GRADUATES');
                  }
                }}
                value={selectedValue}>
                <View
                  style={[
                    styles.rowWrapperRatioButton,
                    {borderTopRightRadius: 10, borderTopLeftRadius: 10},
                  ]}>
                  <RadioButton.Item
                    label="Schüler"
                    value="students"
                    color={THEME.fontColor}
                    labelStyle={styles.rowLabel}
                  />
                </View>
                <View style={styles.rowWrapperRatioButton}>
                  <RadioButton.Item
                    label="Lehrer"
                    value="teachers"
                    color={THEME.fontColor}
                    labelStyle={styles.rowLabel}
                  />
                </View>
                <View
                  style={[
                    styles.rowWrapperRatioButton,
                    {
                      borderBottomWidth: 1,
                      borderBottomRightRadius: 10,
                      borderBottomLeftRadius: 10,
                    },
                  ]}>
                  <RadioButton.Item
                    label="Absolventen"
                    value="graduates"
                    color={THEME.fontColor}
                    labelStyle={styles.rowLabel}
                  />
                </View>
              </RadioButton.Group>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // when data is available, return
  return (
    <SafeAreaView
      onTouchStart={() => Keyboard.dismiss()}
      style={{backgroundColor: THEME.background, height: windowsHeight}}>
      <KeyboardAvoidingView>
        <View
          contentContainerStyle={[
            styles.container,
            {marginTop: heightPixel(-50)},
          ]}
          style={{marginLeft: 20, marginRight: 20}}>
          <Text style={styles.sectionHeaderText}>
            An wen soll die Nachricht gehen?
          </Text>
          <View style={styles.section}>
            <RadioButton.Group
              onValueChange={value => {
                if (value === 'students') {
                  setDropdownitem();
                  fetchData('einzelsch');
                  setSelectedValue('students');
                  console.log('SELECTED STUDENTS');
                } else if (value === 'teachers') {
                  setDropdownitem();
                  fetchData('einzelleh');
                  setSelectedValue('teachers');
                  console.log('SELECTED TEACHERS');
                } else if (value === 'graduates') {
                  setDropdownitem();
                  fetchData('einzelehe');
                  setSelectedValue('graduates');
                  console.log('SELECTED GRADUATES');
                }
              }}
              value={selectedValue}>
              <View
                style={[
                  styles.rowWrapperRatioButton,
                  {borderTopRightRadius: 16, borderTopLeftRadius: 16, borderWidth: 2, borderBottomWidth: 1,},
                ]}>
                <RadioButton.Item
                  label="Schüler"
                  value="students"
                  color={THEME.fontColor}
                  labelStyle={styles.rowLabel}
                />
              </View>
              <View style={styles.rowWrapperRatioButton}>
                <RadioButton.Item
                  label="Lehrer"
                  value="teachers"
                  color={THEME.fontColor}
                  labelStyle={styles.rowLabel}
                />
              </View>
              <View
                style={[
                  styles.rowWrapperRatioButton,
                  {
                    borderBottomWidth: 2,
                    borderBottomRightRadius: 16,
                    borderBottomLeftRadius: 16,
                  },
                ]}>
                <RadioButton.Item
                  label="Absolventen"
                  value="graduates"
                  color={THEME.fontColor}
                  labelStyle={styles.rowLabel}
                />
              </View>
            </RadioButton.Group>
          </View>
          <Dropdown
            label="Wähle den Empfänger:"
            labelStyle={styles.sectionHeaderText}
            placeholder="Wähle..."
            placeholderStyle={styles.rowLabel}
            options={data}
            optionLabel={'value'}
            optionValue={'name'}
            selectedValue={dropdownitem}
            onValueChange={value => {
              setDropdownitem(value);
            }}
            isSearchable
            primaryColor={'orange'}
            selectedItemStyle={styles.rowLabel}
            dropdownStyle={{
              borderWidth: 0, // To remove border, set borderWidth to 0
              backgroundColor: THEME.gray5,
            }}
            dropdownIcon={
              <Icon
                style={styles.tinyLogo}
                color={THEME.fontColor}
                name="chevron-down-outline"
                size={22}
              />
            }
            dropdownIconStyle={{top: 20, right: 20}}
            listFooterComponent={
              <View style={styles.customComponentContainer}>
                <Text
                  style={{color: THEME.fontColor, fontFamily: FONTS.regular}}>
                  Es fehlen Namen? Dann erstelle ein Bug-Report in den
                  Einstellungen unter Hilfe.
                </Text>
              </View>
            }
            modalOptionsContainerStyle={{
              padding: 10,
              backgroundColor: THEME.gray6,
            }}
            listComponentStyles={{
              listEmptyComponentStyle: {
                color: THEME.red,
                fontFamily: FONTS.regular,
              },
              itemSeparatorStyle: {
                opacity: 0,
                borderColor: THEME.fontColor,
                borderWidth: 2,
              },
            }}
            listControls={{
              emptyListMessage: 'Nutzer nicht gefunden',
            }}
            checkboxComponentStyles={{
              checkboxStyle: {
                backgroundColor: THEME.idingo,
              },
              checkboxLabelStyle: {
                color: THEME.fontColor,
                fontFamily: FONTS.regular,
              },
            }}
            searchControls={{
              textInputProps: {
                placeholder: 'Nutzer-Suche...',
                placeholderTextColor: THEME.fontColor,
                fontFamily: FONTS.regular,
                color: THEME.fontColor,
              },
              textInputStyle: {
                backgroundColor: THEME.gray5,
                borderColor: THEME.gray2,
                //fontFamily: FONTS.bold,
                fontSize: 15,
              },
            }}
          />
          <View style={{height: heightPixel(1000), paddingTop: 10}}>
            <TextInput
              editable
              multiline
              numberOfLines={4}
              placeholder="Deine Nachricht"
              placeholderTextColor={THEME.fontColor}
              onChangeText={text => setMessage(text)}
              value={message}
              style={{
                flex: 1,
                padding: 10,
                backgroundColor: THEME.gray6,
                color: THEME.fontColor,
                fontFamily: FONTS.medium,
                fontSize: 15,
                borderRadius: 16,
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              sendMessageToUser(dropdownitem, message);
            }}
            style={{
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: THEME.idingo,
              borderRadius: 10,
              flexDirection: 'row',
              width: 120,
              height: 50,
              marginTop: 30,
            }}>
            <Text style={[styles.rowLabel, {marginRight: 8, fontSize: 16, marginLeft: 10}]}>
              Senden 
            </Text>
            <Icon
              color= {THEME.fontColor}
              name="arrow-forward-circle"
              size={25}
              style={{marginTop: 5, marginBottom: 5, fontWeight: 600,}}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  customComponentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  text: {
    marginBottom: 20,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tinyLogo: {
    width: 20,
    height: 20,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    borderWidth: 3,
    borderColor: 'white',
  },

  container: {
    paddingVertical: 24,
  },
  section: {
    paddingTop: 12,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.fontColor,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginTop: 20,
  },
  sectionBody: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: THEME.gray,
  },
  header: {
    paddingLeft: 24,
    paddingRight: 24,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: THEME.fontColor,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: THEME.fontColor,
  },
  profile: {
    padding: 16,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: THEME.gray6,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: THEME.gray,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 9999,
  },
  profileName: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '600',
    color: THEME.fontColor,
  },
  profileEmail: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '400',
    color: THEME.fontColor,
  },
  profileAction: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.blue,
    borderRadius: 12,
  },
  profileActionText: {
    marginRight: 8,
    fontSize: 15,
    fontWeight: '600',
    color: THEME.fontColor,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 24,
    height: 50,
  },
  rowWrapper: {
    paddingLeft: 24,
    backgroundColor: THEME.gray6,
    borderTopWidth: 1,
    borderColor: THEME.gray,
  },
  rowWrapperRatioButton: {
    backgroundColor: THEME.gray6,
    borderTopWidth: 2,
    borderColor: THEME.gray,
    borderLeftWidth: 2,
    borderRightWidth: 2,
  },
  rowIcon: {
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '500',
    color: THEME.fontColor,
  },
  rowValue: {
    fontSize: 17,
    color: THEME.gray,
    marginRight: 4,
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
});

export default MessagesScreen;

/*
await fetch("https://gymnasium-neuruppin.de/index.php?id=118&oid=22&action=ausgang", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/119.0",
        "Accept-Language": "de,en-US;q=0.7,en;q=0.3",
        "Content-Type": "multipart/form-data; boundary=---------------------------316648145626523606082784631850",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1"
    },
    "referrer": "https://gymnasium-neuruppin.de/index.php?action=einzelsch&oid=22&id=118&alpos=g",
    "body": "-----------------------------316648145626523606082784631850\r\nContent-Disposition: form-data; name=\"ziel\"\r\n\r\n18Grefrath\r\n-----------------------------316648145626523606082784631850\r\nContent-Disposition: form-data; name=\"eintrag\"\r\n\r\nTest1 <br>Test2<br> Test3\r\n-----------------------------316648145626523606082784631850\r\nContent-Disposition: form-data; name=\"send1\"\r\n\r\nAbsenden\r\n-----------------------------316648145626523606082784631850--\r\n",
    "method": "POST",
    "mode": "cors"
});
*/
