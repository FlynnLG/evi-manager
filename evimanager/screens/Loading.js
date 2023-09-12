import React, {useEffect} from 'react';
import {Text, View, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {THEME, FONTS} from '../constants';

import * as axios from 'axios';
import * as cheerio from 'cheerio';
import moment from 'moment';
import * as Keychain from 'react-native-keychain';
import appStorage from '../components/appStorage';

const ytm = async nav => {
  try {
    appStorage.set('crawler_data', '');
    const credentials = await Keychain.getGenericPassword();
    if (!credentials || !credentials.username || !credentials.password) {
      await Keychain.resetGenericPassword().then(async () => {
        console.error('Login-Daten konnten nicht geladen werden');
        nav.navigate('Login');
      });
      return;
    }

    axios.default
      .get(
        `https://gymnasium-neuruppin.de/index.php?startlog=1&user=${credentials.username}&pass=${credentials.password}`,
      )
      .then(
        async response => {
          if (response.status === 200) {
            let dashboard = response.data;
            let $ = cheerio.load(dashboard);

            // Check if login was successful
            if (
              $(
                'body > div:nth-child(1) > div:nth-child(3) > table > tbody > tr > td > a > b',
              ).length
            ) {
              console.log('DEBUG | Login successful');
              await axios.default
                .get('https://gymnasium-neuruppin.de/index.php?oid=18&id=941')
                .then(async response => {
                  if (response.status === 200) {
                    let html = response.data;
                    let $ = cheerio.load(html);

                    // Get current class of user
                    let currentClass = $(
                      'body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table > tbody > tr:nth-child(2) > td:nth-child(1)',
                    )
                      .text()
                      .split('.');
                    currentClass = currentClass[0];

                    await axios.default
                      .get('https://gymnasium-neuruppin.de/index.php?oid=19')
                      .then(async response => {
                        if (response.status === 200) {
                          let html = response.data;
                          let $ = cheerio.load(html);

                          // Get name of user
                          let name = $(
                            'body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table:nth-child(6) > tbody > tr > td:nth-child(2) > b',
                          )
                            .text()
                            .split(', ');
                          name = name[1] + ' ' + name[0];

                          // Get schedule of user
                          let scheduleCycle1 = [
                            [[], [], [], [], []],
                            [[], [], [], [], []],
                            [[], [], [], [], []],
                            [[], [], [], [], []],
                            [[], [], [], [], []],
                          ];
                          let scheduleCycle2 = [
                            [[], [], [], [], []],
                            [[], [], [], [], []],
                            [[], [], [], [], []],
                            [[], [], [], [], []],
                            [[], [], [], [], []],
                          ];

                          $(
                            'body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > center > table > tbody > tr',
                          ).each((index, element) => {
                            if (
                              index === 0 ||
                              index % 2 !== 0 ||
                              index % 4 === 0
                            ) {
                              return true;
                            }
                            const tds = $(element).find('td');
                            for (let i = 1; i < 6; i++) {
                              convertScheduleSubjectInHour(
                                $(tds[i])
                                  .html()
                                  .split(/<br\s*\/?>/i),
                                i + 1,
                                index + 1,
                              );
                            }
                          });

                          function convertScheduleSubjectInHour(
                            scheduleSubjectInHour,
                            column,
                            line,
                          ) {
                            let pushElement = '';
                            let turnusCycle = 0;
                            if (
                              typeof column === 'number' &&
                              typeof line === 'number'
                            ) {
                              let getSSIH = scheduleSubjectInHour;
                              if (!getSSIH[-1]) {
                                getSSIH.pop();
                              }
                              let numberOfSubjectsInLine = getSSIH.length;
                              for (let r = 0; r < numberOfSubjectsInLine; r++) {
                                pushElement = '';
                                turnusCycle = '';
                                if (getSSIH[r].startsWith('[') === true) {
                                  pushElement = getSSIH[r]
                                    .toString()
                                    .split(':');
                                  turnusCycle = parseInt(
                                    pushElement[0].match(/\d+/)[0],
                                  );
                                  pushElement = pushElement[1].split('/');
                                  if (turnusCycle === 1) {
                                    scheduleCycle1[parseInt(column) - 2][
                                      (parseInt(line) - 3) / 4
                                    ].push([
                                      pushElement[0],
                                      pushElement[1],
                                      pushElement[2],
                                    ]);
                                  } else if (turnusCycle === 2) {
                                    scheduleCycle2[parseInt(column) - 2][
                                      (parseInt(line) - 3) / 4
                                    ].push([
                                      pushElement[0],
                                      pushElement[1],
                                      pushElement[2],
                                    ]);
                                  } else {
                                    console.log(
                                      'Error while putting subjects into schedule-1/2. #Error_6384',
                                    );
                                  }
                                } else if (getSSIH[r].startsWith('/')) {
                                  void 0;
                                } else {
                                  pushElement = getSSIH[r].split('/');
                                  scheduleCycle1[parseInt(column) - 2][
                                    (parseInt(line) - 3) / 4
                                  ].push([
                                    pushElement[0],
                                    pushElement[1],
                                    pushElement[2],
                                  ]);
                                  scheduleCycle2[parseInt(column) - 2][
                                    (parseInt(line) - 3) / 4
                                  ].push([
                                    pushElement[0],
                                    pushElement[1],
                                    pushElement[2],
                                  ]);
                                }
                              }
                            } else {
                              console.log(
                                'Error while loading schedule. #Error_9284',
                              );
                            }
                          }

                          // Get subjects of user
                          let subjects = [];
                          for (let e = 0; e <= 4; e++) {
                            for (let i = 0; i <= 4; i++) {
                              for (
                                let u = 0;
                                u < scheduleCycle1[e][i].length;
                                u++
                              ) {
                                if (!scheduleCycle1[e][i][u][0]) {
                                  void 0;
                                } else if (
                                  subjects.includes(
                                    scheduleCycle1[e][i][u][0],
                                  ) === false
                                ) {
                                  subjects.push(scheduleCycle1[e][i][u][0]);
                                }
                              }
                              for (
                                let r = 0;
                                r < scheduleCycle2[e][i].length;
                                r++
                              ) {
                                if (!scheduleCycle2[e][i][r][0]) {
                                  void 0;
                                } else if (
                                  subjects.includes(
                                    scheduleCycle2[e][i][r][0],
                                  ) === false
                                ) {
                                  subjects.push(scheduleCycle2[e][i][r][0]);
                                }
                              }
                            }
                          }

                          await axios.default
                            .get(
                              'https://gymnasium-neuruppin.de/index.php?oid=18',
                            )
                            .then(async response => {
                              if (response.status === 200) {
                                let html = response.data;
                                let $ = cheerio.load(html);

                                console.log('Checking for new messages');
                                // Check if user has new messages
                                let newMessagesCounter = parseInt(
                                  $(
                                    'body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table > tbody > tr > td:nth-child(2) > span:nth-child(5)',
                                  )
                                    .text()
                                    .match(/\d+/)[0],
                                );
                                // When more than 1 message is sent before the script runs again, only the newest sender will be shown in push notification
                                let newMessageSender = $(
                                  'body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table > tbody > tr > td:nth-child(2) > span:nth-child(3) > b:nth-child(3)',
                                ).text();
                                // TODO: If this script runs every 10 minutes in the background: Save newMessagesCounter, check if num is higher than before, when so send push notification to user, when num
                                // smaller set newMessagesCounter to new newMessagesCounter and send no push notification
                                if (appStorage.getString('crawler_data')) {
                                  let newMessages = JSON.parse(
                                    appStorage.getString('crawler_data'),
                                  );
                                  if (
                                    newMessages.userInformation.name.toString() ===
                                    name
                                  ) {
                                    let jsonNewMessages = parseInt(
                                      newMessages.homepageMessages.newMessagesCounter.toString(),
                                    );
                                    // TODO: Send push notification to user with the following => "Du hast (newMessagesCounter-jsonNewMessages) neue Nachricht/en erhalten. Die letzte Nachricht wurde von
                                    // newMessageSender gesendet.
                                    const messageCountDiff =
                                      newMessagesCounter - jsonNewMessages;
                                    const messageText = `Du hast ${
                                      messageCountDiff > 1
                                        ? messageCountDiff
                                        : 1
                                    } neue Nachricht${
                                      messageCountDiff !== 1 ? 'en' : ''
                                    } erhalten. Die letzte Nachricht wurde von ${newMessageSender} gesendet.`;

                                    console.log(messageText);
                                    Alert.alert(
                                      'Neue Nachricht!',
                                      messageText,
                                      [{text: 'OK', style: 'cancel'}],
                                      {cancelable: false},
                                    );
                                    //console.log(cycleNum, cycleStart, cycleEnd)
                                    if (cycleNum && cycleStart && cycleEnd) {
                                      cycle.push([
                                        cycleNum,
                                        cycleStart,
                                        cycleEnd,
                                      ]);
                                    } else {
                                      console.log(
                                        'Error while parsing cycle to string. #Error_2358',
                                      );
                                      break;
                                    }

                                    y += 1;
                                  }
                                }
                                
                                await axios.default
                                  .get(
                                    'https://gymnasium-neuruppin.de/index.php?oid=19&id=95',
                                  )
                                  .then(async response => {
                                    if (response.status === 200) {
                                      let html = response.data;
                                      let $ = cheerio.load(html);

                                      // Get cycle (Turnus) of current year
                                      let cycle = [];

                                      $(
                                        'body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(2) > table > tbody > tr',
                                      ).each((index, element) => {
                                        if (index === 0) {
                                          return true;
                                        }
                                        const tds = $(element).find('td');
                                        cycle.push([
                                          $(tds[0]).text(),
                                          $(tds[1]).text(),
                                          $(tds[2]).text(),
                                        ]);
                                      });

                                      await axios.default
                                        .get(
                                          'https://gymnasium-neuruppin.de/index.php?oid=18&id=81',
                                        )
                                        .then(async response => {
                                          if (response.status === 200) {
                                            let html = response.data;
                                            let $ = cheerio.load(html);

                                            // Get teacher substitution schedules of today and tomorrow
                                            let todaySubstitutionSchedule = [];
                                            let todaySubstitutionScheduleExist = false;
                                            let todaySubstitutionScheduleDate =
                                              '00.00.00';
                                            //
                                            let tomorrowSubstitutionSchedule =
                                              [];
                                            let tomorrowSubstitutionScheduleExist = false;
                                            let tomorrowSubstitutionScheduleDate =
                                              '00.00.00';
                                            //
                                            let checkIfFirstTSSIsTodayOrTomorrow; // If true=today, if false=tomorrow
                                            // Check if TSS is on homepage for today
                                            if (
                                              $(
                                                'body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table:nth-child(5) > tbody > tr > td > span > b',
                                              ).length
                                            ) {
                                              if (
                                                $(
                                                  'body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table:nth-child(5) > tbody > tr > td > span > b',
                                                )
                                                  .text()
                                                  .replace(/^\D+/g, '') ===
                                                moment().format('DD.MM.YY')
                                              ) {
                                                checkIfFirstTSSIsTodayOrTomorrow = true; // If true=today, if false=tomorrow
                                                todaySubstitutionScheduleDate =
                                                  moment()
                                                    .format('DD.MM.YY')
                                                    .toString();
                                                todaySubstitutionScheduleExist = true;
                                              } else if (
                                                $(
                                                  'body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table:nth-child(5) > tbody > tr > td > span > b',
                                                )
                                                  .text()
                                                  .replace(/^\D+/g, '') ===
                                                moment()
                                                  .add(1, 'days')
                                                  .format('DD.MM.YY')
                                              ) {
                                                checkIfFirstTSSIsTodayOrTomorrow = false; // If true=today, if false=tomorrow
                                                tomorrowSubstitutionScheduleDate =
                                                  moment()
                                                    .add(1, 'days')
                                                    .format('DD.MM.YY')
                                                    .toString();
                                                tomorrowSubstitutionScheduleExist = true;
                                              }

                                              $(
                                                'body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table:nth-child(7) > tbody > tr',
                                              ).each((index, element) => {
                                                if (index === 0) {
                                                  return true;
                                                }
                                                const tds =
                                                  $(element).find('td');
                                                if (
                                                  $(tds[1])
                                                    .text()
                                                    .replace(/\s/g, '') ===
                                                    currentClass ||
                                                  $(tds[1])
                                                    .text()
                                                    .replace(/\s/g, '') ===
                                                    parseInt(
                                                      currentClass.match(
                                                        /\d+/,
                                                      )[0],
                                                    ).toString()
                                                ) {
                                                  let checkSubject = $(tds[2])
                                                    .text()
                                                    .replace(/\s+/, '');
                                                  if (
                                                    $(tds[2])
                                                      .text()
                                                      .replace(/\s+/, '')
                                                      .startsWith('[') === true
                                                  ) {
                                                    checkSubject = $(tds[2])
                                                      .text()
                                                      .replace(/\s+/, '')
                                                      .split(':');
                                                    checkSubject =
                                                      checkSubject[1].toString();
                                                  }
                                                  if (
                                                    subjects.includes(
                                                      checkSubject.toString(),
                                                    )
                                                  ) {
                                                    let hour = $(tds[0])
                                                      .text()
                                                      .replace(/\s+/, '');
                                                    let whatClass = $(tds[1])
                                                      .text()
                                                      .replace(/\s+/, '');
                                                    let subject = $(tds[2])
                                                      .text()
                                                      .replace(/\s+/, '');
                                                    let teacher = $(tds[3])
                                                      .text()
                                                      .replace(/\s+/, '');
                                                    let substitution = $(tds[4])
                                                      .text()
                                                      .replace(/\s+/, '')
                                                      .replace(/Neu/g, '');
                                                    let room = $(tds[5])
                                                      .text()
                                                      .replace(/\s+/, '')
                                                      .replace(/---/g, '');
                                                    let note = $(tds[6])
                                                      .text()
                                                      .replace(/\s+/, '');
                                                    if (
                                                      checkIfFirstTSSIsTodayOrTomorrow ===
                                                      true
                                                    ) {
                                                      todaySubstitutionSchedule.push(
                                                        [
                                                          hour,
                                                          whatClass,
                                                          subject,
                                                          teacher,
                                                          substitution,
                                                          room,
                                                          note,
                                                        ],
                                                      );
                                                    } else if (
                                                      checkIfFirstTSSIsTodayOrTomorrow ===
                                                      false
                                                    ) {
                                                      tomorrowSubstitutionSchedule.push(
                                                        [
                                                          hour,
                                                          whatClass,
                                                          subject,
                                                          teacher,
                                                          substitution,
                                                          room,
                                                          note,
                                                        ],
                                                      );
                                                    } else {
                                                      console.log(
                                                        'Error while creating SubstitutionSchedule. #Error_7418',
                                                      );
                                                    }
                                                  }
                                                }
                                              });
                                            }

                                            // Check if second TSS on homepage is for tomorrow
                                            if (
                                              $(
                                                'body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table:nth-child(10) > tbody > tr > td > span > b',
                                              ).length
                                            ) {
                                              if (
                                                $(
                                                  'body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table:nth-child(10) > tbody > tr > td > span > b',
                                                )
                                                  .text()
                                                  .replace(/^\D+/g, '') ===
                                                moment()
                                                  .add(1, 'days')
                                                  .format('DD.MM.YY')
                                              ) {
                                                tomorrowSubstitutionScheduleDate =
                                                  moment()
                                                    .add(1, 'days')
                                                    .format('DD.MM.YY')
                                                    .toString();
                                                tomorrowSubstitutionScheduleExist = true;

                                                $(
                                                  'body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table:nth-child(12) > tbody > tr',
                                                ).each((index, element) => {
                                                  if (index === 0) {
                                                    return true;
                                                  }
                                                  const tds =
                                                    $(element).find('td');
                                                  if (
                                                    $(tds[1])
                                                      .text()
                                                      .replace(/\s/g, '') ===
                                                      currentClass ||
                                                    $(tds[1])
                                                      .text()
                                                      .replace(/\s/g, '') ===
                                                      parseInt(
                                                        currentClass.match(
                                                          /\d+/,
                                                        )[0],
                                                      ).toString()
                                                  ) {
                                                    let checkSubject = $(tds[2])
                                                      .text()
                                                      .replace(/\s+/, '');
                                                    if (
                                                      $(tds[2])
                                                        .text()
                                                        .replace(/\s+/, '')
                                                        .startsWith('[') ===
                                                      true
                                                    ) {
                                                      checkSubject = $(tds[2])
                                                        .text()
                                                        .replace(/\s+/, '')
                                                        .split(':');
                                                      checkSubject =
                                                        checkSubject[1].toString();
                                                    }
                                                    if (
                                                      subjects.includes(
                                                        checkSubject.toString(),
                                                      )
                                                    ) {
                                                      let hour = $(tds[0])
                                                        .text()
                                                        .replace(/\s+/, '');
                                                      let whatClass = $(tds[1])
                                                        .text()
                                                        .replace(/\s+/, '');
                                                      let subject = $(tds[2])
                                                        .text()
                                                        .replace(/\s+/, '');
                                                      let teacher = $(tds[3])
                                                        .text()
                                                        .replace(/\s+/, '');
                                                      let substitution = $(
                                                        tds[4],
                                                      )
                                                        .text()
                                                        .replace(/\s+/, '')
                                                        .replace(/Neu/g, '');
                                                      let room = $(tds[5])
                                                        .text()
                                                        .replace(/\s+/, '')
                                                        .replace(/---/g, '');
                                                      let note = $(tds[6])
                                                        .text()
                                                        .replace(/\s+/, '');
                                                      tomorrowSubstitutionSchedule.push(
                                                        [
                                                          hour,
                                                          whatClass,
                                                          subject,
                                                          teacher,
                                                          substitution,
                                                          room,
                                                          note,
                                                        ],
                                                      );
                                                    }
                                                  }
                                                });
                                              }
                                            }

                                            // Write all scraped data to json file
                                            let jsonData = {
                                              userInformation: {
                                                name: name,
                                                currentClass: currentClass,
                                              },
                                              homepageMessages: {
                                                newMessagesCounter:
                                                  newMessagesCounter,
                                                newMessageSender:
                                                  newMessageSender,
                                              },
                                              schedule: {
                                                cycle: cycle,
                                                scheduleCycle1: scheduleCycle1,
                                                scheduleCycle2: scheduleCycle2,
                                                currentSubjects: subjects,
                                              },
                                              teacherSubstitutionSchedule: {
                                                todaySubstitutionSchedule: {
                                                  date: todaySubstitutionScheduleDate,
                                                  scheduleExist:
                                                    todaySubstitutionScheduleExist,
                                                  schedule:
                                                    todaySubstitutionSchedule,
                                                },
                                                tomorrowSubstitutionSchedule: {
                                                  date: tomorrowSubstitutionScheduleDate,
                                                  scheduleExist:
                                                    tomorrowSubstitutionScheduleExist,
                                                  schedule:
                                                    tomorrowSubstitutionSchedule,
                                                },
                                              },
                                            };

                                            const writeJSON = async value => {
                                              try {
                                                let jsonValue = JSON.stringify(
                                                  value,
                                                  null,
                                                  2,
                                                );
                                                appStorage.set(
                                                  'crawler_data',
                                                  jsonValue,
                                                );
                                              } catch (e) {
                                                console.log(
                                                  'Cannot write JSON file. #Error_5395',
                                                );
                                              }
                                            };
                                            writeJSON(jsonData)
                                              //.then(console.log("When this value is printed, the JSON is created and the user can be redirected to Home.js, but make sure to put everything for the redirect request inside of then()"));
                                              .then(
                                                console.log(
                                                  'DEBUG | Succesfully loaded all data.',
                                                ),
                                                nav.navigate('HomeNav', {
                                                  json: jsonData,
                                                }),
                                              );
                                          }
                                        });
                                    }
                                  });
                              }
                            }); //Closing Bracket for the '.then(async response => {' in line 197
                        }
                      });
                  }
                });
            } else {
              Alert.alert(
                'Login fehlgeschlagen',
                'Dein Benutzername und/oder Passwort sind falsch.',
                [
                  {
                    text: 'OK',
                    onPress: async () => {
                      await Keychain.resetGenericPassword().then(async () => {
                        nav.navigate('Login');
                      });
                    },
                    style: 'cancel',
                  },
                ],
                {cancelable: false},
              );
              console.log('Wrong username or password');
              appStorage.set('crawler_data', '');
            }
          }
        },
        error => console.log(error),
      );
  } catch (e) {
    console.log(e);
  }
};

const Loading = () => {
  console.info('Site: LOADING');
  const navigation = useNavigation();

  useEffect(() => {
    ytm(navigation).catch(console.error);
  });

  return (
    <View
      style={{
        padding: 12,
        alignItems: 'center',
        backgroundColor: THEME.background,
        height: 1000,
      }}>
      <Text
        style={{
          fontFamily: FONTS.bold,
          color: THEME.fontColor,
          fontSize: 32,
          paddingTop: 350,
        }}>
        EVI-Manager
      </Text>
      <Text
        style={{
          fontFamily: FONTS.bold,
          color: THEME.fontColor,
          paddingTop: 370,
        }}>
        Lade Daten... (dies kann ein Moment dauern)
      </Text>
    </View>
  );
};

export default Loading;
