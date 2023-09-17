import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import {Table, Row, Rows} from 'react-native-reanimated-table';

import {FONTS, THEME} from '../constants';
//import Ionicons
import Icon from 'react-native-vector-icons/Ionicons';
import appStorage from './appStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LessonCard = ({
  accent,
  dayOfWeekShort,
  date,
  blocks,
  dayOfWeek,
  blockInfos,
  teachers,
  rooms,
}) => {
  // ref
  const bottomSheetModalRef = useRef(null);
  // variables
  const snapPoints = useMemo(() => ['50%'], []);

  const [modalDayOfWeek, setModalDayOfWeek] = useState('');
  const [modalBlock, setModalBlock] = useState('');
  // const [modalBlockInfo, setModalBlockInfo] = useState('');
  const [modalLesson, setModalLesson] = useState('');
  const [modalTeacher, setModalTeacher] = useState('');
  const [modalRoom, setModalRoom] = useState('');
  const [modalTime, setModalTime] = useState('');

  const [tableHead, setTableHead] = useState([
    'Lehrer',
    'Vert.-Lehrer',
    'Raum',
    'Info',
  ]);
  const [tableData, setTableData] = useState([
    ['undefined', 'undefined', 'undefined', 'undefined'],
  ]);

  // TODO: Define course number (e.g. EN12) in Modal!
  // TODO: Define course number (e.g. EN12) in Modal

  let accentBorderColor = '#636366';
  let accentWidth = 360;
  let accentHeight = 140;
  let accentShadowColor = '#ffffff';
  let accentElevation = 0;
  let accentPaddingTop = 11.4;
  let dayAccent = THEME.background;
  let shadowOffsetWidth = 0;
  let shadowOffsetHeight = 0;
  let shadowOpacity = 0;
  let shadowRadius = 0;
  if (accent === true) {
    //accentBorderColor = THEME.green
    accentWidth = 385;
    accentHeight = 155;
    shadowOffsetWidth = -2;
    shadowOffsetHeight = 4;
    shadowOpacity = 0.075;
    shadowRadius = 3;
    if (THEME.scheme === 'dark') {
      accentShadowColor = '#636366';
    } else {
      accentShadowColor = '#000000';
    }
    accentElevation = 10;
    accentPaddingTop = 6;
    dayAccent = THEME.green;
  }

  function getBackgroundColor(subject) {
    console.log(subject)
    /**const bodyy = {
      'DE':'#34c759',
      'MA':'#32ade6',
      'BIO':'#ff3b30',
    }
    console.log(bodyy, JSON.stringify(bodyy))
    appStorage.set('custom/subjectcolor', JSON.stringify(bodyy))*/
    const jsonObject = appStorage.getString('custom/subjectcolor')
    console.log(jsonObject)
    const subjectColors = JSON.parse(jsonObject)
    console.log(subjectColors)
    if(!subjectColors === "undefined"){
      return subjectColors[subject]
    }else{
      return THEME.background
    }
  }

  function weekendCard() {
    return (
      <View style={styles.smallLessonCard}>
        <View style={styles.dateContainer}>
          <View
            style={[styles.dayOfTheWeekCircle, {backgroundColor: dayAccent}]}>
            <Text style={styles.dayOfTheWeekText}>{dayOfWeekShort}</Text>
          </View>
          <Text style={styles.date}>{date}</Text>
        </View>
        <View style={styles.weekendHolidayContainer}>
          <View style={styles.weekendHolidayContentInfoContainer}>
            <Icon name="cafe" size={20} color={THEME.fontColor} />
            <Text style={styles.weekendHolidayContentInfoText}>Wochenende</Text>
          </View>
        </View>
      </View>
    );
  }

  function holidayCard() {
    return (
      <View style={styles.smallLessonCard}>
        <View style={styles.dateContainer}>
          <View
            style={[styles.dayOfTheWeekCircle, {backgroundColor: dayAccent}]}>
            <Text style={styles.dayOfTheWeekText}>{dayOfWeekShort}</Text>
          </View>
          <Text style={styles.date}>{date}</Text>
        </View>
        <View style={styles.weekendHolidayContainer}>
          <View style={styles.weekendHolidayContentInfoContainer}>
            <Icon name="calendar" size={20} color={THEME.fontColor} />
            <Text style={styles.weekendHolidayContentInfoText}>Ferien</Text>
          </View>
        </View>
      </View>
    );
  }

  function isVisible(rawTableData) {
    if (typeof rawTableData[0][1] === 'undefined') {
      return '#ffffff00';
    } else {
      return THEME.red;
    }
  }

  function lessonCard() {
    for (let i = 0; i < rooms.length; i++) {
      if (!rooms[i]) {
        rooms[i] = 'Kein Raum angegeben';
      }
    }
    let block1;
    let block2;
    let block3;
    let block4;
    let block5;
    if (blocks[0] !== 'Nichts') {
      block1 = getBlockForLessonCard(1);
    }
    if (blocks[1] !== 'Nichts') {
      block2 = getBlockForLessonCard(2);
    }
    if (blocks[2] !== 'Nichts') {
      block3 = getBlockForLessonCard(3);
    }
    if (blocks[3] !== 'Nichts') {
      block4 = getBlockForLessonCard(4);
    }
    if (blocks[4] !== 'Nichts') {
      block5 = getBlockForLessonCard(5);
    }

    return (
      <View
        style={[
          styles.lessonCard,
          {
            borderColor: accentBorderColor,
            width: accentWidth,
            height: accentHeight,
            shadowColor: accentShadowColor,
            elevation: accentElevation,
            marginBottom: accentPaddingTop,
            shadowOffset: {
              width: shadowOffsetWidth,
              height: shadowOffsetHeight,
            },
            shadowOpacity: shadowOpacity,
            shadowRadius: shadowRadius,
          },
        ]}>
        <View style={styles.dateContainer}>
          <View
            style={[styles.dayOfTheWeekCircle, {backgroundColor: dayAccent}]}>
            <Text style={styles.dayOfTheWeekText}>{dayOfWeekShort}</Text>
          </View>
          <Text style={styles.date}>{date}</Text>
        </View>
        <View style={styles.rowContainer}>
          {block1}
          {block2}
          {block3}
          {block4}
          {block5}
        </View>
      </View>
    );
  }

  function getBlockForLessonCard(number) {
    if (number === 1) {
      return (
        <TouchableOpacity
          style={[
            styles.frame,
            //{borderColor: () => getBackgroundColor(blocks[0])},
          ]}
          onPress={() => {
            openSettingsModal(
              dayOfWeek,
              '1. Block',
              blockInfos[0],
              blocks[0],
              teachers[0],
              rooms[0],
              '8:00-9:20',
            );
            bottomSheetModalRef.current?.present();
          }}>
          <Icon
            name="alert-circle"
            size={15}
            color={isVisible([blockInfos[0]])}
          />
          <Text style={styles.block}>1</Text>
          <View style={styles.circle}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={[
                styles.circleText,
                {backgroundColor: () => getBackgroundColor(blocks[0])},
              ]}>
              {blocks[0]}
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else if (number === 2) {
      return (
        <TouchableOpacity
          style={[
            styles.frame,
            //{borderColor: () => getBackgroundColor(blocks[1])},
          ]}
          onPress={() => {
            openSettingsModal(
              dayOfWeek,
              '2. Block',
              blockInfos[1],
              blocks[1],
              teachers[1],
              rooms[1],
              '9:40-11:00',
            );
            bottomSheetModalRef.current?.present();
          }}>
          <Icon
            name="alert-circle"
            size={15}
            color={isVisible([blockInfos[1]])}
          />
          <Text style={styles.block}>2</Text>
          <View style={styles.circle}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={[
                styles.circleText,
                {backgroundColor: () => getBackgroundColor(blocks[1])},
              ]}>
              {blocks[1]}
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else if (number === 3) {
      return (
        <TouchableOpacity
          style={[
            styles.frame,
            //{borderColor: () => getBackgroundColor(blocks[2])},
          ]}
          onPress={() => {
            openSettingsModal(
              dayOfWeek,
              '3. Block',
              blockInfos[2],
              blocks[2],
              teachers[2],
              rooms[2],
              '11:30-12:50',
            );
            bottomSheetModalRef.current?.present();
          }}>
          <Icon
            name="alert-circle"
            size={15}
            color={isVisible([blockInfos[2]])}
          />
          <Text style={styles.block}>3</Text>
          <View style={styles.circle}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={[
                styles.circleText,
                {backgroundColor: () => getBackgroundColor(blocks[2])},
              ]}>
              {blocks[2]}
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else if (number === 4) {
      return (
        <TouchableOpacity
          style={[
            styles.frame,
            //{borderColor: () => getBackgroundColor(blocks[3])},
          ]}
          onPress={() => {
            openSettingsModal(
              dayOfWeek,
              '4. Block',
              blockInfos[3],
              blocks[3],
              teachers[3],
              rooms[3],
              '13:10-14:30',
            );
            bottomSheetModalRef.current?.present();
          }}>
          <Icon
            name="alert-circle"
            size={15}
            color={isVisible([blockInfos[3]])}
          />
          <Text style={styles.block}>4</Text>
          <View style={styles.circle}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={[
                styles.circleText,
                {backgroundColor: () => getBackgroundColor(blocks[3])},
              ]}>
              {blocks[3]}
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else if (number === 5) {
      return (
        <TouchableOpacity
          style={[
            styles.frame,
            //{borderColor: () => getBackgroundColor(blocks[4])},
          ]}
          onPress={() => {
            openSettingsModal(
              dayOfWeek,
              '5. Block',
              blockInfos[4],
              blocks[4],
              teachers[4],
              rooms[4],
              '14:35-15:55',
            );
            bottomSheetModalRef.current?.present();
          }}>
          <Icon
            name="alert-circle"
            size={15}
            color={isVisible([blockInfos[4]])}
          />
          <Text style={styles.block}>5</Text>
          <View
            style={[
              styles.circle,
              {backgroundColor: () => getBackgroundColor(blocks[4])},
            ]}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={[styles.circleText]}>
              {blocks[4]}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
  }

  function getModalBlockInfo(tableDataCheck) {
    if (typeof tableDataCheck[0][1] === 'undefined') {
      return (
        <View style={styles.modalContentBlockInfoBoxEmpty}>
          <Text style={styles.modalContentBlockInfoBoxText}>
            Keine Stundeninfos gefunden!
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.modalContentBlockInfoBox}>
          <ScrollView>
            <View style={styles.container}>
              <Table borderStyle={{borderWidth: 2, borderColor: 'darkgray'}}>
                <Row
                  data={tableHead}
                  style={styles.head}
                  textStyle={styles.headText}
                />
                <Rows data={tableDataCheck} textStyle={styles.text} />
              </Table>
            </View>
          </ScrollView>
        </View>
      );
    }
  }

  const openSettingsModal = (
    day,
    block,
    blockInfo,
    lesson,
    teacher,
    room,
    time,
  ) => {
    setModalDayOfWeek(day);
    setModalBlock(block);
    setTableData([blockInfo]);
    setModalLesson(lesson);
    setModalTeacher(teacher);
    setModalRoom(room);
    setModalTime(time);
  };

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );
  let content;
  if (blocks[0] === '0') {
    // Wochenende
    content = weekendCard();
  } else if (blocks[0] === '1') {
    // Ferien
    content = holidayCard();
  } else {
    // Normal
    content = lessonCard();
  }
  return (
    <View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        enablePanDownToClose={true}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: THEME.background,
        }}>
        <View style={styles.modalContentContainer}>
          <Text style={styles.modalContentText}>
            {modalDayOfWeek}, {modalBlock}
          </Text>
          {getModalBlockInfo(tableData)}
          <View style={styles.modalContentInfoContainer}>
            <Icon name="school-outline" size={20} color={THEME.fontColor} />
            <Text style={styles.modalContentInfoText}>{modalLesson}</Text>
          </View>
          <View style={styles.modalContentInfoContainer}>
            <Icon name="person-outline" size={20} color={THEME.fontColor} />
            <Text style={styles.modalContentInfoText}>{modalTeacher}</Text>
          </View>
          <View style={styles.modalContentInfoContainer}>
            <Icon name="location-outline" size={20} color={THEME.fontColor} />
            <Text style={styles.modalContentInfoText}>{modalRoom}</Text>
          </View>
          <View style={styles.modalContentInfoContainer}>
            <Icon name="time-outline" size={20} color={THEME.fontColor} />
            <Text style={styles.modalContentInfoText}>{modalTime}</Text>
          </View>
        </View>
      </BottomSheetModal>
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  lessonCard: {
    //width: 370,  EDIT THESE WITH THE VARIABELS "accentWidth" and "accentHeight"
    //height: 140,
    margin: 10.4,
    alignSelf: 'center',
    backgroundColor: THEME.primary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#737475', //EDIT THIS VARIABLE WITH "accentBorderColor"
  },
  smallLessonCard: {
    width: 360,
    height: 90,
    margin: 10.4,
    alignSelf: 'center',
    backgroundColor: THEME.primary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#636366',
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginEnd: -15,
  },
  frame: {
    marginTop: 3,
    width: 45,
    height: 80,
    borderStyle: 'solid',
    borderColor: '#8e8e93',
    borderWidth: 2,
    borderRadius: 50,
    marginEnd: 15,
  },
  circle: {
    width: 38,
    height: 38,
    borderRadius: 50,
    marginTop: -5,
    backgroundColor: THEME.background, //TODO
    alignSelf: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  circleText: {
    fontFamily: FONTS.medium,
    color: THEME.fontColor,
    fontSize: 16,
  },
  block: {
    fontFamily: FONTS.semiBold,
    color: THEME.fontColor,
    fontSize: 18,
    textAlign: 'center',
    alignItems: 'center',
    marginTop: -7,
  },
  date: {
    fontFamily: FONTS.regular,
    color: THEME.fontColor,
    fontSize: 15,
    marginLeft: 10,
    marginTop: 6,
  },
  dayOfTheWeekCircle: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginTop: 5,
    marginLeft: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayOfTheWeekText: {
    fontFamily: FONTS.semiBold,
    color: THEME.fontColor,
    fontSize: 13,
  },
  dateContainer: {
    width: 200,
    height: 40,
    marginTop: 5,
    marginLeft: 5,
    flexDirection: 'row',
  },
  modalContentContainer: {
    flex: 1,
  },
  modalContentText: {
    fontSize: 20,
    color: THEME.fontColor,
    fontFamily: FONTS.regular,
    alignSelf: 'center',
  },
  modalContentBlockInfoBox: {
    backgroundColor: THEME.primary,
    borderRadius: 10,
    marginTop: 10,
    width: 385,
    height: 150,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  modalContentBlockInfoBoxEmpty: {
    backgroundColor: THEME.primary,
    borderRadius: 3,
    marginTop: 10,
    width: 385,
    height: 35,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  modalContentBlockInfoBoxText: {
    color: THEME.fontColor,
    fontSize: 17,
    fontFamily: FONTS.regular,
    marginLeft: 10,
  },
  modalContentInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 360,
    marginTop: 20,
    marginLeft: 25,
  },
  modalContentInfoText: {
    color: THEME.fontColor,
    fontSize: 17,
    fontFamily: FONTS.regular,
    marginLeft: 20,
  },
  weekendHolidayContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 360,
    height: 45,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#636366',
    alignSelf: 'center',
    backgroundColor: THEME.primary,
  },
  weekendHolidayContentInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 360,
    marginTop: 10,
    marginLeft: 15,
  },
  weekendHolidayContentInfoText: {
    color: THEME.fontColor,
    fontSize: 15,
    fontFamily: FONTS.regular,
    marginLeft: 20,
  },
  container: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    backgroundColor: THEME.primary,
    borderRadius: 12,
  },
  head: {
    height: 44,
    backgroundColor: THEME.secondary,
  },
  headText: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    textAlign: 'center',
    color: THEME.fontColor,
  },
  text: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    color: THEME.fontColor,
  },
});

/*
 <View style={styles.rowContainer}>
 <TouchableOpacity
 style={[styles.frame, borderColor=getUserLessonTheme(blocks)]}
 onPress={() => {
 openSettingsModal(
 dayOfWeek,
 '1. Block',
 blockInfo1,
 block1,
 teacher1,
 room1,
 '8:00-9:20',
 );
 bottomSheetModalRef.current?.present();
 }}>
 <Text style={styles.block}>1</Text>
 <View style={styles.circle}>
 <Text
 numberOfLines={1}
 adjustsFontSizeToFit
 style={[styles.circleText, backgroundColor=getUserLessonTheme(blocks)]}>
 {block1}
 </Text>
 </View>
 </TouchableOpacity>

 <TouchableOpacity
 style={[styles.frame, borderColor=getUserLessonTheme(blocks)]}
 onPress={() => {
 openSettingsModal(
 dayOfWeek,
 '2. Block',
 blockInfo2,
 block2,
 teacher2,
 room2,
 '9:40-11:00',
 );
 bottomSheetModalRef.current?.present();
 }}>
 <Text style={styles.block}>2</Text>
 <View style={styles.circle}>
 <Text
 numberOfLines={1}
 adjustsFontSizeToFit
 style={[styles.circleText, backgroundColor=getUserLessonTheme(blocks)]}>
 {block2}
 </Text>
 </View>
 </TouchableOpacity>
 <TouchableOpacity
 style={[styles.frame, borderColor=getUserLessonTheme(blocks)]}
 onPress={() => {
 openSettingsModal(
 dayOfWeek,
 '3. Block',
 blockInfo3,
 block3,
 teacher3,
 room3,
 '11:30-12:50',
 );
 bottomSheetModalRef.current?.present();
 }}>
 <Text style={styles.block}>3</Text>
 <View style={styles.circle}>
 <Text
 numberOfLines={1}
 adjustsFontSizeToFit
 style={[styles.circleText, backgroundColor=getUserLessonTheme(blocks)]}>
 {block3}
 </Text>
 </View>
 </TouchableOpacity>
 <TouchableOpacity
 style={[styles.frame, borderColor=getUserLessonTheme(blocks)]}
 onPress={() => {
 openSettingsModal(
 dayOfWeek,
 '4. Block',
 blockInfo4,
 block4,
 teacher4,
 room4,
 '13:10-14:30',
 );
 bottomSheetModalRef.current?.present();
 }}>
 <Text style={styles.block}>4</Text>
 <View style={styles.circle}>
 <Text
 numberOfLines={1}
 adjustsFontSizeToFit
 style={[styles.circleText, backgroundColor=getUserLessonTheme(blocks)]}>
 {block4}
 </Text>
 </View>
 </TouchableOpacity>
 <TouchableOpacity
 style={[styles.frame, borderColor=getUserLessonTheme(blocks)]}
 onPress={() => {
 openSettingsModal(
 dayOfWeek,
 '5. Block',
 blockInfo5,
 block5,
 teacher5,
 room5,
 '14:35-15:55',
 );
 bottomSheetModalRef.current?.present();
 }}>
 <Text style={styles.block}>5</Text>
 <View style={styles.circle}>
 <Text
 numberOfLines={1}
 adjustsFontSizeToFit
 style={[styles.circleText, backgroundColor=getUserLessonTheme(blocks)]}>
 {block5}
 </Text>
 </View>
 </TouchableOpacity>
 </View>
 */

/*
 <View style={styles.weekendHolidayContainer}>
 <View style={styles.weekendHolidayContentInfoContainer}>
 <Icon name="cafe" size={20} color={THEME.fontColor} />
 <Text style={styles.weekendHolidayContentInfoText}>Wochenende</Text>
 </View>
 </View>
 */

/*
 <View style={styles.weekendHolidayContainer}>
 <View style={styles.weekendHolidayContentInfoContainer}>
 <Icon name="calendar" size={20} color={THEME.fontColor} />
 <Text style={styles.weekendHolidayContentInfoText}>Ferien</Text>
 </View>
 </View>
 */
