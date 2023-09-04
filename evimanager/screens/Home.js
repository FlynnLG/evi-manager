import React from 'react';
import {Text, View, Dimensions, ScrollView, StatusBar, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {THEME, FONTS} from '../constants';

import {LessonCard} from '../components/lessoncard';
import appStorage from '../components/appStorage';
import moment from 'moment/moment';

import Icon from 'react-native-vector-icons/Ionicons';

async function refresh(navigation) {
  navigation.navigate('Loading')
}

function dateManager() {
  const date = new Date(new Date().getTime());
  const datevalues = [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ];
  if (datevalues[3] >= 0 && datevalues[3] <= 10) {
    return 'Guten Morgen, \n';
  }
  if (datevalues[3] >= 11 && datevalues[3] <= 17) {
    return 'Guten Tag, \n';
  }
  if (datevalues[3] >= 18 && datevalues[3] <= 23) {
    return 'Guten Abend, \n';
  }
}

function getName(json) {
  return json.userInformation.name.toString().split(' ')[0];
}

const windowWidth = Dimensions.get('window').width;

function getCycleOfDate(date) {
  let json = JSON.parse(appStorage.getString('crawler_data'));
  let compareDate = moment(date, 'DD.MM.YYYY');
  let i = 0;
  while (i < json.schedule.cycle.length) {
    if (
      compareDate.isBetween(
        moment(json.schedule.cycle[i][1], 'DD.MM.YYYY').subtract(1, 'day'),
        moment(json.schedule.cycle[i][2], 'DD.MM.YYYY').add(1, 'day'),
      )
    ) {
      return parseInt(json.schedule.cycle[i][0]);
    }
    i += 1;
  }
  return 0;
}

function isDateWeekend(date) {
  return moment(date, 'DD.MM.YYYY').isoWeekday() > 5;
}

function Home() {
  const navigation = useNavigation();

  console.info('Site: HOME');
  let json = JSON.parse(appStorage.getString('crawler_data'));
  let welcomeMessage = dateManager();
  let name = getName(json);

  let lcData = [[], [], [], [], [], [], []];
  for (let i = 0; i < 7; i++) {
    let date = moment().add(i, 'days').format('DD.MM.YYYY');
    let dateIsoWeekDay = moment(date, 'DD.MM.YYYY').isoWeekday();
    lcData[i].push([getCycleOfDate(date)]);
    let scheduleCycle;
    if (parseInt(lcData[i][0]) === 1) {
      scheduleCycle = json.schedule.scheduleCycle1;
    } else if (parseInt(lcData[i][0]) === 2) {
      scheduleCycle = json.schedule.scheduleCycle2;
    } else {
      // Ferien
      lcData[i].push(
        ['1', '1', '1', '1', '1'],
        ['1', '1', '1', '1', '1'],
        ['1', '1', '1', '1', '1'],
        ['1', '1', '1', '1', '1'],
      );
    }
    if (scheduleCycle) {
      if (!isDateWeekend(date)) {
        let blocksArrayLesson = [];
        let blocksArrayRoom = [];
        let blocksArrayTeacher = [];
        for (let j = 0; j < 5; j++) {
          if (scheduleCycle[dateIsoWeekDay - 1][j][0]) {
            blocksArrayLesson.push(
              scheduleCycle[dateIsoWeekDay - 1][j][0][0].replace(/[0-9]/g, ''),
            );
            blocksArrayRoom.push(scheduleCycle[dateIsoWeekDay - 1][j][0][1]);
            blocksArrayTeacher.push(scheduleCycle[dateIsoWeekDay - 1][j][0][2]);
          } else {
            blocksArrayLesson.push('Nichts');
            blocksArrayRoom.push('Nichts');
            blocksArrayTeacher.push('Nichts');
          }
        }
        lcData[i].push(blocksArrayLesson);
        lcData[i].push(blocksArrayRoom);
        lcData[i].push(blocksArrayTeacher);
        // Vertretung........
        let teacherSubstitutionSchedule1 = [];
        let teacherSubstitutionSchedule2 = [];
        let teacherSubstitutionSchedule3 = [];
        let teacherSubstitutionSchedule4 = [];
        let teacherSubstitutionSchedule5 = [];
        if (date === moment().format('DD.MM.YYYY')) {
          for (
            let e = 0;
            e <
            json.teacherSubstitutionSchedule.todaySubstitutionSchedule.schedule
              .length;
            e++
          ) {
            if (
              json.teacherSubstitutionSchedule.todaySubstitutionSchedule
                .schedule[e][0] === '2'
            ) {
              teacherSubstitutionSchedule1 =
                json.teacherSubstitutionSchedule.todaySubstitutionSchedule.schedule[
                  e
                ].slice(3);
            } else if (
              json.teacherSubstitutionSchedule.todaySubstitutionSchedule
                .schedule[e][0] === '4'
            ) {
              teacherSubstitutionSchedule2 =
                json.teacherSubstitutionSchedule.todaySubstitutionSchedule.schedule[
                  e
                ].slice(3);
            } else if (
              json.teacherSubstitutionSchedule.todaySubstitutionSchedule
                .schedule[e][0] === '6'
            ) {
              teacherSubstitutionSchedule3 =
                json.teacherSubstitutionSchedule.todaySubstitutionSchedule.schedule[
                  e
                ].slice(3);
            } else if (
              json.teacherSubstitutionSchedule.todaySubstitutionSchedule
                .schedule[e][0] === '8'
            ) {
              teacherSubstitutionSchedule4 =
                json.teacherSubstitutionSchedule.todaySubstitutionSchedule.schedule[
                  e
                ].slice(3);
            } else if (
              json.teacherSubstitutionSchedule.todaySubstitutionSchedule
                .schedule[e][0] === '10'
            ) {
              teacherSubstitutionSchedule5 =
                json.teacherSubstitutionSchedule.todaySubstitutionSchedule.schedule[
                  e
                ].slice(3);
            }
          }
          if (teacherSubstitutionSchedule1.length === 0) {
            teacherSubstitutionSchedule1 = [
              'Keine Stundeninfos gefunden test1',
            ];
          }
          if (teacherSubstitutionSchedule2.length === 0) {
            teacherSubstitutionSchedule2 = [
              'Keine Stundeninfos gefunden test2',
            ];
          }
          if (teacherSubstitutionSchedule3.length === 0) {
            teacherSubstitutionSchedule3 = [
              'Keine Stundeninfos gefunden test3',
            ];
          }
          if (teacherSubstitutionSchedule4.length === 0) {
            teacherSubstitutionSchedule4 = [
              'Keine Stundeninfos gefunden test4',
            ];
          }
          if (teacherSubstitutionSchedule5.length === 0) {
            teacherSubstitutionSchedule5 = [
              'Keine Stundeninfos gefunden test5',
            ];
          }
          lcData[i].push([
            teacherSubstitutionSchedule1,
            teacherSubstitutionSchedule2,
            teacherSubstitutionSchedule3,
            teacherSubstitutionSchedule4,
            teacherSubstitutionSchedule5,
          ]);
        } else if (date === moment().add(1, 'days').format('DD.MM.YYYY')) {
          for (
            let e = 0;
            e <
            json.teacherSubstitutionSchedule.tomorrowSubstitutionSchedule
              .schedule.length;
            e++
          ) {
            if (
              json.teacherSubstitutionSchedule.tomorrowSubstitutionSchedule
                .schedule[e][0] === '2'
            ) {
              teacherSubstitutionSchedule1 =
                json.teacherSubstitutionSchedule.tomorrowSubstitutionSchedule.schedule[
                  e
                ].slice(3);
            } else if (
              json.teacherSubstitutionSchedule.tomorrowSubstitutionSchedule
                .schedule[e][0] === '4'
            ) {
              teacherSubstitutionSchedule2 =
                json.teacherSubstitutionSchedule.tomorrowSubstitutionSchedule.schedule[
                  e
                ].slice(3);
            } else if (
              json.teacherSubstitutionSchedule.tomorrowSubstitutionSchedule
                .schedule[e][0] === '6'
            ) {
              teacherSubstitutionSchedule3 =
                json.teacherSubstitutionSchedule.tomorrowSubstitutionSchedule.schedule[
                  e
                ].slice(3);
            } else if (
              json.teacherSubstitutionSchedule.tomorrowSubstitutionSchedule
                .schedule[e][0] === '8'
            ) {
              teacherSubstitutionSchedule4 =
                json.teacherSubstitutionSchedule.tomorrowSubstitutionSchedule.schedule[
                  e
                ].slice(3);
            } else if (
              json.teacherSubstitutionSchedule.tomorrowSubstitutionSchedule
                .schedule[e][0] === '10'
            ) {
              teacherSubstitutionSchedule5 =
                json.teacherSubstitutionSchedule.tomorrowSubstitutionSchedule.schedule[
                  e
                ].slice(3);
            }
          }
          if (teacherSubstitutionSchedule1.length === 0) {
            teacherSubstitutionSchedule1 = [
              'Keine Stundeninfos gefunden test1',
            ];
          }
          if (teacherSubstitutionSchedule2.length === 0) {
            teacherSubstitutionSchedule2 = [
              'Keine Stundeninfos gefunden test2',
            ];
          }
          if (teacherSubstitutionSchedule3.length === 0) {
            teacherSubstitutionSchedule3 = [
              'Keine Stundeninfos gefunden test3',
            ];
          }
          if (teacherSubstitutionSchedule4.length === 0) {
            teacherSubstitutionSchedule4 = [
              'Keine Stundeninfos gefunden test4',
            ];
          }
          if (teacherSubstitutionSchedule5.length === 0) {
            teacherSubstitutionSchedule5 = [
              'Keine Stundeninfos gefunden test5',
            ];
          }
          lcData[i].push([
            teacherSubstitutionSchedule1,
            teacherSubstitutionSchedule2,
            teacherSubstitutionSchedule3,
            teacherSubstitutionSchedule4,
            teacherSubstitutionSchedule5,
          ]);
        } else {
          lcData[i].push([
            ['Keine Stundeninfos gefunden test1'],
            ['Keine Stundeninfos gefunden test2'],
            ['Keine Stundeninfos gefunden test3'],
            ['Keine Stundeninfos gefunden test4'],
            ['Keine Stundeninfos gefunden test5'],
          ]);
        }
      } else {
        // Wochenende
        lcData[i].push(
          ['0', '0', '0', '0', '0'],
          ['0', '0', '0', '0', '0'],
          ['0', '0', '0', '0', '0'],
          ['0', '0', '0', '0', '0'],
        );
      }
    }
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: THEME.background,
      }}>
      <View
        style={{
          paddingTop: 100,
          backgroundColor: THEME.background,
          color: THEME.fontColor,
          paddingBottom: 80,
        }}>
        <Text
          style={{
            paddingLeft: 30,
            fontFamily: FONTS.semiBold,
            color: THEME.fontColor,
            fontSize: 24,
            paddingBottom: 20,
          }}>
          {welcomeMessage.toString()}
          {name}!
        </Text>
        <View style={{paddingTop: 48}}>
          <Text
            style={{
              fontFamily: FONTS.semiBold,
              color: THEME.fontColor,
              paddingLeft: windowWidth - 105,
            }}>
            <TouchableOpacity
              onPress={() => refresh(navigation)}>
              <View style={{paddingLeft: 20,}}><Icon name='reload-circle' color="#3d3737" size={30}/></View>
            </TouchableOpacity>
          </Text>
          <LessonCard
            accent
            dayOfWeekShort={moment().format('dddd').substring(0, 2)}
            date={moment().format('DD. MMMM YYYY')}
            blocks={lcData[0][1]}
            dayOfWeek={moment().format('dddd')}
            blockInfos={lcData[0][4]}
            teachers={lcData[0][3]}
            rooms={lcData[0][2]}
          />
          <LessonCard
            dayOfWeekShort={moment()
              .add(1, 'day')
              .format('dddd')
              .substring(0, 2)}
            date={moment().add(1, 'day').format('DD. MMMM YYYY')}
            blocks={lcData[1][1]}
            dayOfWeek={moment().add(1, 'day').format('dddd')}
            blockInfos={lcData[1][4]}
            teachers={lcData[1][3]}
            rooms={lcData[1][2]}
          />
          <LessonCard
            dayOfWeekShort={moment()
              .add(2, 'days')
              .format('dddd')
              .substring(0, 2)}
            date={moment().add(2, 'days').format('DD. MMMM YYYY')}
            blocks={lcData[2][1]}
            dayOfWeek={moment().add(2, 'days').format('dddd')}
            blockInfos={lcData[2][4]}
            teachers={lcData[2][3]}
            rooms={lcData[2][2]}
          />
          <LessonCard
            dayOfWeekShort={moment()
              .add(3, 'days')
              .format('dddd')
              .substring(0, 2)}
            date={moment().add(3, 'days').format('DD. MMMM YYYY')}
            blocks={lcData[3][1]}
            dayOfWeek={moment().add(3, 'days').format('dddd')}
            blockInfos={lcData[3][4]}
            teachers={lcData[3][3]}
            rooms={lcData[3][2]}
          />
          <LessonCard
            dayOfWeekShort={moment()
              .add(4, 'days')
              .format('dddd')
              .substring(0, 2)}
            date={moment().add(4, 'days').format('DD. MMMM YYYY')}
            blocks={lcData[4][1]}
            dayOfWeek={moment().add(4, 'days').format('dddd')}
            blockInfos={lcData[4][4]}
            teachers={lcData[4][3]}
            rooms={lcData[4][2]}
          />
          <LessonCard
            dayOfWeekShort={moment()
              .add(5, 'days')
              .format('dddd')
              .substring(0, 2)}
            date={moment().add(5, 'days').format('DD. MMMM YYYY')}
            blocks={lcData[5][1]}
            dayOfWeek={moment().add(5, 'days').format('dddd')}
            blockInfos={lcData[5][4]}
            teachers={lcData[5][3]}
            rooms={lcData[5][2]}
          />
          <LessonCard
            dayOfWeekShort={moment()
              .add(6, 'days')
              .format('dddd')
              .substring(0, 2)}
            date={moment().add(6, 'days').format('DD. MMMM YYYY')}
            blocks={lcData[6][1]}
            dayOfWeek={moment().add(6, 'days').format('dddd')}
            blockInfos={lcData[6][4]}
            teachers={lcData[6][3]}
            rooms={lcData[6][2]}
          />
        </View>
      </View>
    </ScrollView>
  );
}

export default Home;

/*
 <SlidingUpPanel
 ref={c => (this._panel = c)}>
 <View
 style={{
 width: 370,
 height: 840,
 backgroundColor: 'white',
 top: 0,
 }}>
 <Text>Here is the content inside panel</Text>
 <Button title="Hide" onPress={() => this._panel.hide()} />
 </View>
 </SlidingUpPanel>
 */
