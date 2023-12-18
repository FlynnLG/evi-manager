import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Switch,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Linking,
  Alert,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import RNRestart from 'react-native-restart';
import Icon from 'react-native-vector-icons/Ionicons';

import {THEME} from '../constants';
import * as Keychain from 'react-native-keychain';
import appStorage from '../components/appStorage';
import {widthPixel, heightPixel, fontPixel} from '../components/lessoncard';
import {RadioButton} from 'react-native-paper';

// TODO: Remove all Non-ASCII characters. Don't know why OctoDino added them.
import {FächerfarbenBtn} from '../components/fächerfarbenBtn';

const windowWidth = Dimensions.get('window').width;
const windowsHeight = Dimensions.get('window').height;

// TODO: Check function functionality because RNRestart is used instead of navigating to Login screen
async function userLogout(nav) {
  await Keychain.resetGenericPassword().then(async () => {
    appStorage.set('crawler_data', '');
    console.log('DEBUG | Logout');
    //nav.navigate('Login');
    RNRestart.restart();
  });
}

async function switchTheme(theme) {
  if (theme !== appStorage.getString('@localdata:settings/theme')) {
    appStorage.set('@localdata:settings/theme', theme);
    RNRestart.restart();
  }
}

function checkTheme() {
  const value = appStorage.getString('@localdata:settings/theme');
  return value === 'SYSTEMDARK' ? 'dark' : 'light';
}

const SettingScreenDarkWhiteMode = ({}) => {
  console.info('Site: SETTINGS->DarkWhiteMode');
  const nav = useNavigation();

  const [value, setValue] = React.useState(checkTheme());

  return (
    <SafeAreaView
      style={{backgroundColor: THEME.background, height: windowsHeight}}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {marginTop: heightPixel(-50)},
        ]}>
        <View style={styles.section}>
          <RadioButton.Group
            onValueChange={value =>
              value === 'dark'
                ? switchTheme('SYSTEMDARK')
                : switchTheme('SYSTEMLIGHT')
            }
            value={value}>
            <View style={styles.rowWrapperRatioButton}>
              <RadioButton.Item
                label="Dunkel"
                value="dark"
                color={THEME.fontColor}
                labelStyle={styles.rowLabel}
              />
            </View>
            <View
              style={[styles.rowWrapperRatioButton, {borderBottomWidth: 1}]}>
              <RadioButton.Item
                label="Hell"
                value="light"
                color={THEME.fontColor}
                labelStyle={styles.rowLabel}
              />
            </View>
          </RadioButton.Group>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const SettingScreenUserInformation = ({}) => {
  console.info('Site: SETTINGS->UserInformation');
  const nav = useNavigation();

  const UserInformationSections = [
    {
      header: '',
      items: [
        {
          id: 'user',
          icon: 'person-outline',
          label: 'Benutzer',
          type: 'text',
        },
        {
          id: 'name',
          icon: 'moon-outline',
          label: 'Name',
          type: 'text',
        },
        {
          id: 'class',
          icon: 'color-palette-outline',
          label: 'Klasse',
          type: 'text',
        },
      ],
    },
    {
      header: ' ',
      items: [
        {id: 'logout', icon: 'log-out-outline', label: 'Logout', type: 'null'},
      ],
    },
  ];

  let json = JSON.parse(appStorage.getString('crawler_data'));

  const [form, setForm] = useState({
    user: json.userInformation.username.toString(),
    name: json.userInformation.name.toString(),
    class: json.userInformation.currentClass.toString(),
  });

  return (
    <SafeAreaView
      style={{backgroundColor: THEME.background, height: windowsHeight}}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {marginTop: heightPixel(-120)},
        ]}>
        {UserInformationSections.map(({header, items}) => (
          <View style={styles.section} key={header}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{header}</Text>
            </View>
            <View style={styles.sectionBody}>
              {items.map(({id, label, icon, type, value}, index) => {
                return (
                  <View
                    key={id}
                    style={[
                      styles.rowWrapper,
                      index === 0 && {borderTopWidth: 0},
                    ]}>
                    <TouchableOpacity
                      onPress={() => {
                        if (id === 'logout') {
                          userLogout(nav);
                        }
                      }}>
                      <View style={styles.row}>
                        <Icon
                          color={id === 'logout' ? 'red' : '#616161'}
                          name={icon}
                          style={styles.rowIcon}
                          size={22}
                        />
                        <Text
                          style={[
                            styles.rowLabel,
                            {
                              color:
                                id === 'logout' ? THEME.red : THEME.fontColor,
                            },
                          ]}>
                          {label}
                        </Text>

                        <View style={styles.rowSpacer} />

                        {type === 'select' ||
                          ('text' && (
                            <Text style={styles.rowValue}>{form[id]}</Text>
                          ))}

                        {type === 'toggle' && (
                          <Switch
                            onChange={val => setForm({...form, [id]: val})}
                            value={form[id]}
                          />
                        )}

                        {(type === 'select' || type === 'link') && (
                          <Icon
                            color="#ababab"
                            name="arrow-forward"
                            size={22}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const SettingScreenClassColors = ({}) => {
  console.info('Site: SETTINGS->ClassColors');
  const nav = useNavigation();

  const possibleSubjects = [
    {subjectShort: 'DE'},
    {subjectShort: 'EN'},
    {subjectShort: 'MA'},
    {subjectShort: 'GE'},
    {subjectShort: 'PB'},
    {subjectShort: 'EK'},
    {subjectShort: 'PH'},
    {subjectShort: 'BIO'},
    {subjectShort: 'KU'},
    {subjectShort: 'MU'},
    {subjectShort: 'DS'},
    {subjectShort: 'IF'},
    {subjectShort: 'SP'},
    {subjectShort: 'SPA'},
    {subjectShort: 'FR'},
    {subjectShort: 'LA'},
    {subjectShort: 'CH'},
    {subjectShort: 'GW'},
    {subjectShort: 'NW'},
    {subjectShort: 'SK'},
    {subjectShort: 'TZ'},
    {subjectShort: 'GE-PB'},
    {subjectShort: 'MA/INF'},
    {subjectShort: 'MDK'},
    {subjectShort: 'FU'},
  ];

  return (
    <SafeAreaView
      style={{backgroundColor: THEME.background, height: windowsHeight}}>
      <Text style={[styles.sectionHeaderText, {marginTop: 50}]}>
        Fächerfarben
      </Text>
      <View style={{marginTop: 10}}>
        <FlatList
          data={possibleSubjects}
          renderItem={({item}) => (
            <FächerfarbenBtn subject={item.subjectShort} />
          )}
          numColumns={5}
          key={3}
        />
      </View>
    </SafeAreaView>
  );
};

const SettingScreen = ({}) => {
  console.info('Site: SETTINGS');
  const nav = useNavigation();

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  React.useEffect(() => {
    // TODO: Check what unsubscribe does. Because IDEA says it's redundant.
    const unsubscribe = nav.addListener('focus', () => {
      forceUpdate();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
    // TODO: Temporary added forceUpdate to the line below. Check if it's needed and if it works correctly.
  }, [forceUpdate, nav]);

  const DefaultSections = [
    {
      header: 'App-Einstellungen',
      items: [
        {
          id: 'user',
          icon: 'person-outline',
          label: 'Benutzer',
          type: 'select',
        },
        {
          id: 'darkWhiteMode',
          icon: 'moon-outline',
          label: 'Darstellung',
          type: 'select',
        },
        {
          id: 'classColors',
          icon: 'color-palette-outline',
          label: 'Fächerfarben',
          type: 'select',
        },
      ],
    },
    {
      header: 'Hilfe',
      items: [
        {id: 'bug', icon: 'flag-outline', label: 'Bug melden', type: 'link'},
        {id: 'contact', icon: 'mail-outline', label: 'Kontakt', type: 'link'},
      ],
    },
    {
      header: 'Credits',
      items: [
        {
          id: 'save',
          icon: 'information-circle-outline',
          label: 'Nutzende Pakete',
          type: 'link',
        },
      ],
    },
    {
      header: '',
      items: [
        {id: 'logout', icon: 'log-out-outline', label: 'Logout', type: 'null'},
      ],
    },
  ];

  let json = JSON.parse(appStorage.getString('crawler_data'));

  const [form, setForm] = useState({
    user: json.userInformation.username.toString(),
  });

  return (
    <SafeAreaView
      style={{backgroundColor: THEME.background, height: windowsHeight}}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Einstellungen</Text>

          <Text style={styles.subtitle}>
            Hier können individuelle Einstellungen vorgenommen werden, Kontakt
            aufgenommen werden und die Credits eingesehen werden.
          </Text>
        </View>

        {DefaultSections.map(({header, items}) => (
          <View style={styles.section} key={header}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{header}</Text>
            </View>
            <View style={styles.sectionBody}>
              {items.map(({id, label, icon, type, value}, index) => {
                return (
                  <View
                    key={id}
                    style={[
                      styles.rowWrapper,
                      index === 0 && {borderTopWidth: 0},
                    ]}>
                    <TouchableOpacity
                      onPress={() => {
                        if (id === 'user') {
                          nav.navigate('SettingNavUserInformation');
                        } else if (id === 'darkWhiteMode') {
                          nav.navigate('SettingNavDarkWhiteMode');
                        } else if (id === 'classColors') {
                          nav.navigate('SettingNavClassColors');
                        } else if (id === 'bug') {
                          Linking.canOpenURL(
                            'https://github.com/FlynnLG/evi-manager/issues/new',
                          ).then(supported => {
                            if (supported) {
                              Linking.openURL(
                                'https://github.com/FlynnLG/evi-manager/issues/new',
                              );
                            } else {
                              Alert.alert(
                                'Fehler',
                                'Die Seite konnte nicht geöffnet werden, da die Berechtigung dazu fehlt.',
                                [{text: 'OK', style: 'cancel'}],
                                {cancelable: false},
                              );
                            }
                          });
                        } else if (id === 'contact') {
                          Linking.canOpenURL(
                            'https://github.com/FlynnLG/evi-manager/discussions',
                          ).then(supported => {
                            if (supported) {
                              Linking.openURL(
                                'https://github.com/FlynnLG/evi-manager/discussions',
                              );
                            } else {
                              Alert.alert(
                                'Fehler',
                                'Die Seite konnte nicht geöffnet werden, da die Berechtigung dazu fehlt.',
                                [{text: 'OK', style: 'cancel'}],
                                {cancelable: false},
                              );
                            }
                          });
                        } else if (id === 'logout') {
                          userLogout(nav);
                        }
                      }}>
                      <View style={styles.row}>
                        <Icon
                          color={id === 'logout' ? 'red' : '#616161'}
                          name={icon}
                          style={styles.rowIcon}
                          size={22}
                        />
                        <Text
                          style={[
                            styles.rowLabel,
                            {
                              color:
                                id === 'logout' ? THEME.red : THEME.fontColor,
                            },
                          ]}>
                          {label}
                        </Text>

                        <View style={styles.rowSpacer} />

                        {type === 'select' && (
                          <Text style={styles.rowValue}>{form[id]}</Text>
                        )}

                        {type === 'toggle' && (
                          <Switch
                            onChange={val => setForm({...form, [id]: val})}
                            value={form[id]}
                          />
                        )}

                        {(type === 'select' || type === 'link') && (
                          <Icon
                            color="#ababab"
                            name="arrow-forward"
                            size={22}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
    /*
    <View
      style={{
        padding: 12,
        backgroundColor: THEME.background,
        height: 1000,
        alignItems: 'center',
      }}>
      <Text style={styles.header}>Settings</Text>
      <View style={{flex: 1, flexWrap: 'wrap', flexDirection: 'row'}}>
        <TouchableOpacity style={styles.btnLightmode}>
          <Icon
            name="sunny"
            size={25}
            color="#121414"
            onPress={() => switchTheme('SYSTEMLIGHT')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnDarkmode}
          onPress={() => switchTheme('SYSTEMDARK')}>
          <Icon name="moon" size={25} color="#e9e8ed" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.testButton}
        onPress={() => {
          userLogout(nav);
        }}>
        <Text style={styles.testButtonText}>Logout</Text>
      </TouchableOpacity>

      <Text style={[styles.subheader, {marginTop: 50}]}>Fächerfarben</Text>
      <View style={{marginTop: 10}}>
        <FlatList
          data={possibleSubjects}
          renderItem={({item}) => (
            <FächerfarbenBtn subject={item.subjectShort} />
          )}
          numColumns={5}
          key={3}
        />
      </View>
    </View>
    */
  );
};

const styles = StyleSheet.create({
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
    paddingLeft: 24,
    backgroundColor: THEME.gray6,
    borderTopWidth: 1,
    borderColor: THEME.gray,
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

  /*
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
    backgroundColor: '#121414',
    borderColor: '#e9e8ed',
    borderWidth: 1,
    padding: 20,
    borderRadius: 50,
  },
  btnLightmode: {
    backgroundColor: '#e9e8ed',
    borderColor: '#121414',
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
    backgroundColor: THEME.gray6,
  },
  */
});

export {
  SettingScreen,
  SettingScreenUserInformation,
  SettingScreenDarkWhiteMode,
  SettingScreenClassColors,
};
