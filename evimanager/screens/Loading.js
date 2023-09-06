import React, {useEffect} from 'react';
import {Text, View, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {THEME, FONTS} from '../constants';

import * as axios from 'axios';
import * as cheerio from 'cheerio';
import moment from 'moment';
import AsyncStorage from 'react-native-encrypted-storage';
import appStorage from '../components/appStorage';

const ytm = async nav => {
  try {
    appStorage.set('crawler_data', '');

    const credentials = await AsyncStorage.getItem(
      'localdata.usercredentials',
    );
    if (!credentials || credentials === ';') {
      await AsyncStorage.removeItem('localdata.usercredentials').then(
        async () => {
          console.error('Login-Daten konnten nicht geladen werden');
          nav.navigate('Login');
        },
      );
      return;
    }
    const credentialsSplit = credentials.split(';');
    const name = credentialsSplit[0];
    const pass = credentialsSplit[1];
    if (!name || !pass) {
      await AsyncStorage.removeItem('localdata.usercredentials').then(
        async () => {
          console.error('Login-Daten konnten nicht geladen werden');
          nav.navigate('Login');
        },
      );
      return;
    }

    axios.default
      .get(
        `https://gymnasium-neuruppin.de/index.php?startlog=1&user=${name}&pass=${pass}`,
      )
      .then(
        async response => {
          if (response.status === 200) {
            let dashboard = response.data;
            let $ = cheerio.load(dashboard);

            // Check if login was successful
            if (
              await $(
                'body > div:nth-child(1) > div:nth-child(3) > table > tbody > tr > td > a > b',
              ).length
            ) {
              console.log('DEBUG | Login successful');

              await axios.default
                .get('https://gymnasium-neuruppin.de/index.php?oid=19')
                .then(async response => {
                  if (response.status === 200) {
                    let html = response.data;
                    let $ = cheerio.load(html);

                    // Get name of user
                    let name = (
                      await $(
                        'body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table:nth-child(6) > tbody > tr > td:nth-child(2) > b',
                      ).text()
                    ).split(', ');
                    name = name[1] + ' ' + name[0];

                    // Get current class of user
                    let currentClass = (
                      await $(
                        'body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table:nth-child(18) > tbody > tr > td > span > b',
                      ).text()
                    )
                      .replace(/^\D+/g, '')
                      .split('/');
                    currentClass = currentClass[0];

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
                    const startT = 2;
                    const endT = 6;
                    const stepT = 1;
                    const startH = 3;
                    const endH = 19;
                    const stepH = 4;

                    for (let t = startT; t <= endT; t += stepT) {
                      for (let h = startH; h <= endH; h += stepH) {
                        await getScheduleSubjectInHour(t, h);
                      }
                    }

                    async function getScheduleSubjectInHour(column, line) {
                      if (typeof column !== 'number' || typeof line !== 'number') {
                        console.log('Error while loading schedule. #Error_9284');
                        return;
                      }
                    
                      const selector = `body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > center > table > tbody > tr:nth-child(${line}) > td:nth-child(${column})`;
                      const htmlContent = await $(selector).html();
                    
                      if (!htmlContent) {
                        return;
                      }
                    
                      const subjectLines = htmlContent.split(/<br\s*\/?>/i).filter(line => line.trim() !== '');
                    
                      for (const subjectLine of subjectLines) {
                        let pushElement = '';
                        let turnusCycle = '';
                    
                        if (subjectLine.startsWith('[')) {
                          const [turnus, subjectInfo] = subjectLine.split(':');
                          turnusCycle = parseInt(turnus.match(/\d+/)[0]);
                          pushElement = subjectInfo.split('/');
                    
                          if (turnusCycle === 1 || turnusCycle === 2) {
                            scheduleCycle1[parseInt(column) - 2][(parseInt(line) - 3) / 4].push([
                              pushElement[0],
                              pushElement[1],
                              pushElement[2],
                            ]);
                          } else {
                            console.log('Error while putting subjects into schedule-1/2. #Error_6384');
                          }
                        } else if (!subjectLine.startsWith('/')) {
                          pushElement = subjectLine.split('/');
                          scheduleCycle1[parseInt(column) - 2][(parseInt(line) - 3) / 4].push([
                            pushElement[0],
                            pushElement[1],
                            pushElement[2],
                          ]);
                          scheduleCycle2[parseInt(column) - 2][(parseInt(line) - 3) / 4].push([
                            pushElement[0],
                            pushElement[1],
                            pushElement[2],
                          ]);
                        }
                      }
                    }

                    // Get subjects of user
                    let subjects = new Set();
                    for (let e = 0; e <= 4; e++) {
                      for (let i = 0; i <= 4; i++) {
                        for (let u = 0; u < scheduleCycle1[e][i].length; u++) {
                          const subject = scheduleCycle1[e][i][u][0];
                          if (subject && !subjects.has(subject)) {
                            subjects.add(subject);
                          }
                        }
                        for (let r = 0; r < scheduleCycle2[e][i].length; r++) {
                          const subject = scheduleCycle2[e][i][r][0];
                          if (subject && !subjects.has(subject)) {
                            subjects.add(subject);
                          }
                        }
                      }
                    }
                    subjects = Array.from(subjects); // Convert set back to an array if needed

                    await axios.default
                      .get('https://gymnasium-neuruppin.de/index.php?oid=18')
                      .then(async response => {
                        if (response.status === 200) {
                          let html = response.data;
                          let $ = cheerio.load(html);

                          // Check if user has new messages
                          let newMessagesCounter = parseInt(
                            (
                              await $(
                                'body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table > tbody > tr > td:nth-child(2) > span:nth-child(5)',
                              ).text()
                            ).match(/\d+/)[0],
                          );
                          // When more than 1 message is sent before the script runs again, only the newest sender will be shown in push notification
                          let newMessageSender = await $(
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
                              if (newMessagesCounter > jsonNewMessages) {
                                // TODO: Send push notification to user with the following => "Du hast (newMessagesCounter-jsonNewMessages) neue Nachricht/en erhalten. Die letzte Nachricht wurde von
                                // newMessageSender gesendet.
                                if (newMessagesCounter - jsonNewMessages > 1) {
                                  console.log(
                                    `Du hast ${
                                      newMessagesCounter - jsonNewMessages
                                    } neue Nachrichten erhalten. Die letzte Nachricht wurde von ${newMessageSender} gesendet.`,
                                  );
                                  Alert.alert(
                                    'DEBUG',
                                    `Du hast ${
                                      newMessagesCounter - jsonNewMessages
                                    } neue Nachrichten erhalten. Die letzte Nachricht wurde von ${newMessageSender} gesendet.`,
                                    [
                                      {
                                        text: 'OK',
                                        style: 'cancel',
                                      },
                                    ],
                                    {cancelable: false},
                                  );
                                } else if (
                                  newMessagesCounter - jsonNewMessages ===
                                  1
                                ) {
                                  console.log(
                                    `Du hast 1 neue Nachricht erhalten. Die letzte Nachricht wurde von ${newMessageSender} gesendet.`,
                                  );
                                  Alert.alert(
                                    'DEBUG',
                                    `Du hast 1 neue Nachricht erhalten. Die letzte Nachricht wurde von ${newMessageSender} gesendet.`,
                                    [
                                      {
                                        text: 'OK',
                                        style: 'cancel',
                                      },
                                    ],
                                    {cancelable: false},
                                  );
                                }
                              }
                            } else {
                              appStorage.set('crawler_data', '');
                              if (newMessagesCounter > 1) {
                                console.log(
                                  `Du hast ${newMessagesCounter} neue Nachrichten erhalten. Die letzte Nachricht wurde von ${newMessageSender} gesendet.`,
                                );
                                Alert.alert(
                                  'DEBUG',
                                  `Du hast ${newMessagesCounter} neue Nachrichten erhalten. Die letzte Nachricht wurde von ${newMessageSender} gesendet.`,
                                  [
                                    {
                                      text: 'OK',
                                      style: 'cancel',
                                    },
                                  ],
                                  {cancelable: false},
                                );
                              } else if (newMessagesCounter === 1) {
                                console.log(
                                  `Du hast 1 neue Nachricht erhalten. Die letzte Nachricht wurde von ${newMessageSender} gesendet.`,
                                );
                                Alert.alert(
                                  'DEBUG',
                                  `Du hast 1 neue Nachricht erhalten. Die letzte Nachricht wurde von ${newMessageSender} gesendet.`,
                                  [
                                    {
                                      text: 'OK',
                                      style: 'cancel',
                                    },
                                  ],
                                  {cancelable: false},
                                );
                              }
                            }
                          } else {
                            if (newMessagesCounter > 1) {
                              console.log(
                                `Du hast ${newMessagesCounter} neue Nachrichten erhalten. Die letzte Nachricht wurde von ${newMessageSender} gesendet.`,
                              );
                              Alert.alert(
                                'DEBUG',
                                `Du hast ${newMessagesCounter} neue Nachrichten erhalten. Die letzte Nachricht wurde von ${newMessageSender} gesendet.`,
                                [
                                  {
                                    text: 'OK',
                                    style: 'cancel',
                                  },
                                ],
                                {cancelable: false},
                              );
                            } else if (newMessagesCounter === 1) {
                              console.log(
                                `Du hast 1 neue Nachricht erhalten. Die letzte Nachricht wurde von ${newMessageSender} gesendet.`,
                              );
                              Alert.alert(
                                'DEBUG',
                                `Du hast 1 neue Nachricht erhalten. Die letzte Nachricht wurde von ${newMessageSender} gesendet.`,
                                [
                                  {
                                    text: 'OK',
                                    style: 'cancel',
                                  },
                                ],
                                {cancelable: false},
                              );
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
                                let y = 2;
                                while (
                                  (await $(
                                    `body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(2) > table > tbody > tr:nth-child(${y}) > td:nth-child(1)`,
                                  ).length) &&
                                  (await $(
                                    `body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(2) > table > tbody > tr:nth-child(${y}) > td:nth-child(2)`,
                                  ).length) &&
                                  (await $(
                                    `body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(2) > table > tbody > tr:nth-child(${y}) > td:nth-child(3)`,
                                  ).length)
                                ) {
                                  if (
                                    (await $(
                                      `body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(2) > table > tbody > tr:nth-child(${y}) > td:nth-child(1)`,
                                    ).text()) &&
                                    (await $(
                                      `body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(2) > table > tbody > tr:nth-child(${y}) > td:nth-child(2)`,
                                    ).text()) &&
                                    (await $(
                                      `body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(2) > table > tbody > tr:nth-child(${y}) > td:nth-child(3)`,
                                    ).text())
                                  ) {
                                    let cycleNum = await $(
                                      `body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(2) > table > tbody > tr:nth-child(${y}) > td:nth-child(1)`,
                                    ).text();
                                    let cycleStart = await $(
                                      `body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(2) > table > tbody > tr:nth-child(${y}) > td:nth-child(2)`,
                                    ).text();
                                    let cycleEnd = await $(
                                      `body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(2) > table > tbody > tr:nth-child(${y}) > td:nth-child(3)`,
                                    ).text();
                                    cycle.push([
                                      cycleNum,
                                      cycleStart,
                                      cycleEnd,
                                    ]);
                                  } else {
                                    console.log(
                                      'Error while parsing cycle to string. #Error_2358',
                                    );
                                  }
                                  y += 1;
                                }

                                /*
                                                                // TODO => Translate to cheerio
                                                                // Get cycle (Turnus) of current week
                                                                let currentCycle = await page.locator('//html/body/table[2]/tbody/tr/td[3]/table/tbody/tr[1]/td[1]/table/tbody/tr/td[1]/span[1]').textContent()
                                                                if (currentCycle.startsWith("Nächste") === true) {
                                                                if (parseInt(currentCycle.match(/\d+/)[0]) === 1) {
                                                                currentCycle = 2;
                                                                } else if (parseInt(currentCycle.match(/\d+/)[0]) === 2) {
                                                                currentCycle = 1;
                                                                } else {
                                                                currentCycle = 0;
                                                                console.log("Cannot get cycle of current week. #Error_6395")
                                                                }
                                                                } else if (currentCycle.startsWith("Diese") === true) {
                                                                if (parseInt(currentCycle.match(/\d+/)[0]) === 1) {
                                                                currentCycle = 1;
                                                                } else if (parseInt(currentCycle.match(/\d+/)[0]) === 2) {
                                                                currentCycle = 2;
                                                                } else {
                                                                currentCycle = 0;
                                                                console.log("Cannot get cycle of current week. #Error_6396")
                                                                }
                                                                } else {
                                                                currentCycle = 0;
                                                                console.log("Cannot get cycle of current week. #Error_6397")
                                                                }

                                                                */

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
                                      let tomorrowSubstitutionSchedule = [];
                                      let tomorrowSubstitutionScheduleExist = false;
                                      let tomorrowSubstitutionScheduleDate =
                                        '00.00.00';
                                      //
                                      let checkIfFirstTSSIsTodayOrTomorrow; // If true=today, if false=tomorrow
                                      // Check if TSS is on homepage for today
                                      if (
                                        await $(
                                          'body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table:nth-child(5) > tbody > tr > td > span > b',
                                        ).length
                                      ) {
                                        if (
                                          (
                                            await $(
                                              'body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table:nth-child(5) > tbody > tr > td > span > b',
                                            ).text()
                                          ).replace(/^\D+/g, '') ===
                                          moment().format('DD.MM.YY')
                                        ) {
                                          checkIfFirstTSSIsTodayOrTomorrow = true; // If true=today, if false=tomorrow
                                          todaySubstitutionScheduleDate =
                                            moment()
                                              .format('DD.MM.YY')
                                              .toString();
                                          todaySubstitutionScheduleExist = true;
                                        } else if (
                                          (
                                            await $(
                                              'body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table:nth-child(5) > tbody > tr > td > span > b',
                                            ).text()
                                          ).replace(/^\D+/g, '') ===
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
                                        let i = 2;
                                        while (
                                          await $(
                                            `body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table:nth-child(7) > tbody > tr:nth-child(${i}) > td:nth-child(2)`,
                                          ).length
                                        ) {
                                          if (
                                            (
                                              await $(
                                                `body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table:nth-child(7) > tbody > tr:nth-child(${i}) > td:nth-child(2)`,
                                              ).text()
                                            ).replace(/\s/g, '') ===
                                              currentClass ||
                                            (
                                              await $(
                                                `body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table:nth-child(7) > tbody > tr:nth-child(${i}) > td:nth-child(2)`,
                                              ).text()
                                            ).replace(/\s/g, '') ===
                                              parseInt(
                                                currentClass.match(/\d+/)[0],
                                              ).toString()
                                          ) {
                                            let checkSubject = (
                                              await $(
                                                `body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table:nth-child(7) > tbody > tr:nth-child(${i}) > td:nth-child(3)`,
                                              ).text()
                                            ).replace(/\s+/, '');
                                            if (
                                              (
                                                await $(
                                                  `body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table:nth-child(7) > tbody > tr:nth-child(${i}) > td:nth-child(3)`,
                                                ).text()
                                              )
                                                .replace(/\s+/, '')
                                                .startsWith('[') === true
                                            ) {
                                              checkSubject = (
                                                await $(
                                                  `body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table:nth-child(7) > tbody > tr:nth-child(${i}) > td:nth-child(3)`,
                                                ).text()
                                              )
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
                                              let hour = (
                                                await $(
                                                  `body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table:nth-child(7) > tbody > tr:nth-child(${i}) > td:nth-child(1)`,
                                                ).text()
                                              ).replace(/\s+/, '');
                                              let whatClass = (
                                                await $(
                                                  `body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table:nth-child(7) > tbody > tr:nth-child(${i}) > td:nth-child(2)`,
                                                ).text()
                                              ).replace(/\s+/, '');
                                              let subject = (
                                                await $(
                                                  `body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table:nth-child(7) > tbody > tr:nth-child(${i}) > td:nth-child(3)`,
                                                ).text()
                                              ).replace(/\s+/, '');
                                              let teacher = (
                                                await $(
                                                  `body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table:nth-child(7) > tbody > tr:nth-child(${i}) > td:nth-child(4)`,
                                                ).text()
                                              ).replace(/\s+/, '');
                                              let substitution = (
                                                await $(
                                                  `body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table:nth-child(7) > tbody > tr:nth-child(${i}) > td:nth-child(5)`,
                                                ).text()
                                              )
                                                .replace(/\s+/, '')
                                                .replace(/Neu/g, '');
                                              let room = (
                                                await $(
                                                  `body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table:nth-child(7) > tbody > tr:nth-child(${i}) > td:nth-child(6)`,
                                                ).text()
                                              )
                                                .replace(/\s+/, '')
                                                .replace(/---/g, '');
                                              let note = (
                                                await $(
                                                  `body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table:nth-child(7) > tbody > tr:nth-child(${i}) > td:nth-child(7)`,
                                                ).text()
                                              ).replace(/\s+/, '');
                                              if (
                                                checkIfFirstTSSIsTodayOrTomorrow ===
                                                true
                                              ) {
                                                todaySubstitutionSchedule.push([
                                                  hour,
                                                  whatClass,
                                                  subject,
                                                  teacher,
                                                  substitution,
                                                  room,
                                                  note,
                                                ]);
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
                                          i++;
                                        }
                                      }

                                      // Check if second TSS on homepage is for tomorrow
                                      const selector = 'body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1)';

                                      const $bElements = await $(`${selector} > table:nth-child(10) > tbody > tr > td > span > b`);
                                      const bElementsLength = $bElements.length;

                                      if (bElementsLength) {
                                        const textValue = $bElements.text().replace(/^\D+/g, '');
                                        const expectedDate = moment().add(1, 'days').format('DD.MM.YY');

                                        if (textValue === expectedDate) {
                                          tomorrowSubstitutionScheduleDate = expectedDate;
                                          tomorrowSubstitutionScheduleExist = true;
                                          let i = 2;

                                          const $tdElements = await $(`${selector} > table:nth-child(12) > tbody > tr:nth-child(${i}) > td:nth-child(2)`);
                                          
                                          if ($tdElements.length) {
                                            console.log("Logging")
                                            const textValue = $tdElements.text().replace(/\s/g, '');

                                            if (textValue === currentClass || textValue === parseInt(currentClass.match(/\d+/)[0]).toString()) {
                                              const $subjectElement = await $(`${selector} > table:nth-child(12) > tbody > tr:nth-child(${i}) > td:nth-child(3)`);
                                              const checkSubject = $subjectElement.text().replace(/\s+/, '');

                                              if (checkSubject.startsWith('[') === true && subjects.includes(checkSubject.toString())) {
                                                const hour = $(`${selector} > table:nth-child(12) > tbody > tr:nth-child(${i}) > td:nth-child(1)`).text().replace(/\s+/, '');
                                                const whatClass = textValue;
                                                const subject = checkSubject.split(':')[1].toString();
                                                const teacher = $(`${selector} > table:nth-child(12) > tbody > tr:nth-child(${i}) > td:nth-child(4)`).text().replace(/\s+/, '');
                                                const substitution = $substitutionElement.text().replace(/\s+/, '').replace(/Neu/g, '');
                                                const room = $roomElement.text().replace(/\s+/, '').replace(/---/g, '');
                                                const note = $noteElement.text().replace(/\s+/, '');

                                                tomorrowSubstitutionSchedule.push([hour, whatClass, subject, teacher, substitution, room, note]);
                                              }
                                            }
                                            i++;
                                          }
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
                                          newMessageSender: newMessageSender,
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
                                            schedule: todaySubstitutionSchedule,
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
                                      await writeJSON(jsonData)
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
                      await AsyncStorage.removeItem(
                        'localdata.usercredentials',
                      ).then(async () => {
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
