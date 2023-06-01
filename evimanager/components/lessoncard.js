import React, {useCallback, useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';

import {FONTS, THEME, getUserLessonTheme} from '../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
//import Icon from 'react-native-vector-icons/Ionicons'; not used

export const LessonCard = ({
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
  const [modalBlockInfo, setModalBlockInfo] = useState('');
  const [modalLesson, setModalLesson] = useState('');
  const [modalTeacher, setModalTeacher] = useState('');
  const [modalRoom, setModalRoom] = useState('');
  const [modalTime, setModalTime] = useState('');
  // TODO: Define course number (e.g. EN12) in Modal

  function weekendCard() {
    return (
      <View style={styles.smallLessonCard}>
        <View style={styles.dateContainer}>
          <View style={styles.dayOfTheWeekCircle}>
            <Text style={styles.dayOfTheWeekText}>{dayOfWeekShort}</Text>
          </View>
          <Text style={styles.date}>{date}</Text>
        </View>
        <View style={styles.weekendHolidayContainer}>
          <View style={styles.weekendHolidayContentInfoContainer}>
            <Ionicons name="cafe" size={20} color={THEME.fontColor} />
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
          <View style={styles.dayOfTheWeekCircle}>
            <Text style={styles.dayOfTheWeekText}>{dayOfWeekShort}</Text>
          </View>
          <Text style={styles.date}>{date}</Text>
        </View>
        <View style={styles.weekendHolidayContainer}>
          <View style={styles.weekendHolidayContentInfoContainer}>
            <Ionicons name="calendar" size={20} color={THEME.fontColor} />
            <Text style={styles.weekendHolidayContentInfoText}>Ferien</Text>
          </View>
        </View>
      </View>
    );
  }

  function lessonCard() {
    for (let i = 0; i < rooms.length; i++) {
      if (!rooms[i]) {
        rooms[i] = 'Kein Raum angegeben';
      }
    }
    function isVisible(i){
      //Look if there are any block informations?
      if(!blockInfos[i]){
        blockInfos[i] = 'Keine weiteren Informationen zu dem Block'
        return('#ffffff00')
      }else{
        return(THEME.red)
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
      <View style={styles.lessonCard}>
        <View style={styles.dateContainer}>
          <View style={styles.dayOfTheWeekCircle}>
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
          style={[styles.frame, borderColor=getUserLessonTheme(blocks)]}
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
          <Ionicons name='exclamationcircle' size={15} color={isVisible(0)}/>
          <Text style={styles.block}>1</Text>
          <View style={styles.circle}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={[styles.circleText, backgroundColor=getUserLessonTheme(blocks)]}>
              {blocks[0]}
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else if (number === 2) {
      return (
        <TouchableOpacity
          style={[styles.frame, borderColor=getUserLessonTheme(blocks)]}
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
          <Ionicons name='exclamationcircle' size={15} color={isVisible(1)}/>
          <Text style={styles.block}>2</Text>
          <View style={styles.circle}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={[styles.circleText, backgroundColor=getUserLessonTheme(blocks)]}>
              {blocks[1]}
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else if (number === 3) {
      return (
        <TouchableOpacity
          style={[styles.frame, borderColor=getUserLessonTheme(blocks)]}
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
          <Ionicons name='exclamationcircle' size={15} color={isVisible(2)}/>
          <Text style={styles.block}>3</Text>
          <View style={styles.circle}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={[styles.circleText, backgroundColor=getUserLessonTheme(blocks)]}>
              {blocks[2]}
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else if (number === 4) {
      return (
        <TouchableOpacity
          style={[styles.frame, borderColor=getUserLessonTheme(blocks)]}
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
          <Ionicons name='exclamationcircle' size={15} color={isVisible(3)}/>
          <Text style={styles.block}>4</Text>
          <View style={styles.circle}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={[styles.circleText, backgroundColor=getUserLessonTheme(blocks)]}>
              {blocks[3]}
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else if (number === 5) {
      return (
        <TouchableOpacity
          style={[styles.frame, borderColor=getUserLessonTheme(blocks)]}
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
          <Ionicons name='exclamationcircle' size={15} color={isVisible(4)}/>
          <Text style={styles.block}>5</Text>
          <View style={styles.circle}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={[styles.circleText, backgroundColor=getUserLessonTheme(blocks)]}>
              {blocks[4]}
            </Text>
          </View>
        </TouchableOpacity>
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
    setModalBlockInfo(blockInfo);
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
          <View style={styles.modalContentBlockInfoBox}>
            <Text style={styles.modalContentBlockInfoBoxText}>
              {modalBlockInfo}
            </Text>
          </View>
          <View style={styles.modalContentInfoContainer}>
            <Ionicons name="school-outline" size={20} color={THEME.fontColor} />
            <Text style={styles.modalContentInfoText}>{modalLesson}</Text>
          </View>
          <View style={styles.modalContentInfoContainer}>
            <Ionicons name="person-outline" size={20} color={THEME.fontColor} />
            <Text style={styles.modalContentInfoText}>{modalTeacher}</Text>
          </View>
          <View style={styles.modalContentInfoContainer}>
            <Ionicons name="location-outline" size={20} color={THEME.fontColor} />
            <Text style={styles.modalContentInfoText}>{modalRoom}</Text>
          </View>
          <View style={styles.modalContentInfoContainer}>
            <Ionicons name="time-outline" size={20} color={THEME.fontColor} />
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
    width: 370,
    height: 140,
    margin: 10.4,
    alignSelf: 'center',
    backgroundColor: THEME.lightGrey,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#737475',
  },
  smallLessonCard: {
    width: 370,
    height: 90,
    margin: 10.4,
    alignSelf: 'center',
    backgroundColor: THEME.lightGrey,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#737475',
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
    /*borderColor: '#636363',*/
    borderWidth: 2,
    borderRadius: 8,
    marginEnd: 15,
  },
  circle: {
    width: 37,
    height: 37,
    borderRadius: 50,
    marginTop: -3,
    /*backgroundColor: '#636363',*/
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
    marginTop: 7,
  },
  date: {
    fontFamily: FONTS.regular,
    color: THEME.fontColor,
    fontSize: 15,
    marginLeft: 10,
    marginTop: 7,
  },
  dayOfTheWeekCircle: {
    width: 25,
    height: 25,
    borderRadius: 50,
    marginTop: 5,
    marginLeft: 5,
    backgroundColor: '#636363',
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
    backgroundColor: THEME.lightGrey,
    borderRadius: 3,
    marginTop: 10,
    width: 385,
    height: 40,
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
    marginLeft: 15,
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
    width: 370,
    height: 45,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#737475',
    alignSelf: 'center',
    backgroundColor: THEME.lightGrey,
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
 <Ionicons name="cafe" size={20} color={THEME.fontColor} />
 <Text style={styles.weekendHolidayContentInfoText}>Wochenende</Text>
 </View>
 </View>
 */

/*
 <View style={styles.weekendHolidayContainer}>
 <View style={styles.weekendHolidayContentInfoContainer}>
 <Ionicons name="calendar" size={20} color={THEME.fontColor} />
 <Text style={styles.weekendHolidayContentInfoText}>Ferien</Text>
 </View>
 </View>
 */
