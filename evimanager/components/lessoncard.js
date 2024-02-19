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
import Icon from 'react-native-vector-icons/Ionicons';
import appStorage from './appStorage';
import {PixelRatio, Dimensions} from 'react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const widthBaseScale = SCREEN_WIDTH / 1290;
const heightBaseScale = SCREEN_HEIGHT / 2796;

function normalize(size, based = 'width') {
  const newSize =
    based === 'height' ? size * heightBaseScale : size * widthBaseScale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}
//for width  pixel
export const widthPixel = size => {
  return normalize(size, 'width');
};
//for height  pixel
export const heightPixel = size => {
  return normalize(size, 'height');
};
//for font  pixel
export const fontPixel = size => {
  return heightPixel(size);
};
//for Margin and Padding vertical pixel
export const pixelSizeVertical = size => {
  return heightPixel(size);
};
//for Margin and Padding horizontal pixel
export const pixelSizeHorizontal = size => {
  return widthPixel(size);
};

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

  let accentBorderColor = THEME.gray2;
  let accentWidth = widthPixel(1100);
  let accentShadowColor;
  let accentElevation = 0;
  let accentPaddingTop = pixelSizeVertical(0);
  let dayAccent = THEME.background;
  let shadowOffsetWidth = 0;
  let shadowOffsetHeight = 0;
  let shadowOpacity = 0;
  let shadowRadius = 0;
  if (accent === true) {
    accentBorderColor = THEME.green;
    accentWidth = widthPixel(1200);
    shadowOffsetWidth = widthPixel(-5);
    shadowOffsetHeight = heightPixel(20);
    shadowOpacity = 0.085;
    shadowRadius = widthPixel(10);
    if (THEME.scheme === 'dark') {
      accentShadowColor = THEME.gray2;
    } else {
      accentShadowColor = THEME.background;
    }
    accentElevation = widthPixel(15);
    accentPaddingTop = pixelSizeVertical(0);
    dayAccent = THEME.green;
  }
  /**const bodyy = {
      'DE':'#34c759',
      'MA':'#32ade6',
      'BIO':'#ff3b30',
    }
    console.log(bodyy, JSON.stringify(bodyy))
    appStorage.set('custom/subjectcolor', JSON.stringify(bodyy))*/
  const jsonObject = appStorage.getString('custom/subjectcolor');
  const subjectColors = JSON.parse(jsonObject);

  //Getting Events
  const events = JSON.parse(appStorage.getString('custom/dates'));
  //console.log(events["24. September 2023"])

  function EventBar() {
    if (!events[date]) {
      return <></>;
    }
    if (events[date].length >= 1) {
      return (
        <View
          style={{
            backgroundColor: THEME.background,
            padding: 8,
            margin: 8,
            borderRadius: 12,
            height: 45,
          }}>
          <View style={{flex: 1, flexWrap: 'wrap', flexDirection: 'row'}}>
            <Text
              style={{
                color: THEME.fontColor,
                fontFamily: FONTS.semiBold,
                paddingLeft: 5,
                flexBasis: '93%',
              }}>
              {events[date][0][0]}
            </Text>
            <TouchableOpacity
              style={{flexBasis: '7%'}}
              onPress={() => removeEvent(0)}>
              <Icon name="remove-circle" size={25} color={THEME.red} />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  function removeEvent(i) {
    appStorage.set(
      'custom/dates',
      JSON.stringify(events[0][date].splice(i, 1)),
    );
    forceUpdate();
  }

  function weekendCard() {
    return (
      <View
        style={[
          styles.smallLessonCard,
          {
            borderColor: accentBorderColor,
            width: accentWidth,
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
        <View
          style={[
            styles.weekendHolidayContainer,
            {borderColor: accentBorderColor, width: accentWidth},
          ]}>
          <View style={styles.weekendHolidayContentInfoContainer}>
            <Icon name="cafe" size={20} color={THEME.fontColor} />
            <Text style={styles.weekendHolidayContentInfoText}>Wochenende</Text>
          </View>
          <View>
            <EventBar />
          </View>
        </View>
      </View>
    );
  }

  function holidayCard() {
    return (
      <View
        style={[
          styles.smallLessonCard,
          {
            borderColor: accentBorderColor,
            width: accentWidth,
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
        <View style={styles.weekendHolidayContainer}>
          <View style={styles.weekendHolidayContentInfoContainer}>
            <Icon name="calendar" size={20} color={THEME.fontColor} />
            <Text style={styles.weekendHolidayContentInfoText}>Ferien</Text>
          </View>
          <View>
            <EventBar />
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
        <View>
          <EventBar />
        </View>
      </View>
    );
  }

  function getBlockForLessonCard(number) {
    if (number === 1) {
      return (
        <View>
          <Icon
            name="alert-circle"
            size={23}
            color={isVisible([blockInfos[0]])}
            style={{marginLeft: widthPixel(120)}}
          />
          <TouchableOpacity
            style={[
              styles.frame,
              {borderColor: subjectColors[blocks[0]]}, //@FlyynLG soll das so rein oder nur der Circle in farben
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
            <Text style={styles.block}>1</Text>
            <View
              style={[
                styles.circle,
                {backgroundColor: subjectColors[blocks[0]]},
              ]}>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={[styles.circleText]}>
                {blocks[0]}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    } else if (number === 2) {
      return (
        <View>
          <Icon
            name="alert-circle"
            size={23}
            color={isVisible([blockInfos[1]])}
            style={{marginLeft: widthPixel(120)}}
          />
          <TouchableOpacity
            style={[styles.frame, {borderColor: subjectColors[blocks[1]]}]}
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
            <Text style={styles.block}>2</Text>
            <View
              style={[
                styles.circle,
                {backgroundColor: subjectColors[blocks[1]]},
              ]}>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={[styles.circleText]}>
                {blocks[1]}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    } else if (number === 3) {
      return (
        <View>
          <Icon
            name="alert-circle"
            size={23}
            color={isVisible([blockInfos[2]])}
            style={{marginLeft: widthPixel(120)}}
          />
          <TouchableOpacity
            style={[styles.frame, {borderColor: subjectColors[blocks[2]]}]}
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
            <Text style={styles.block}>3</Text>
            <View
              style={[
                styles.circle,
                {backgroundColor: subjectColors[blocks[2]]},
              ]}>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={[styles.circleText]}>
                {blocks[2]}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    } else if (number === 4) {
      return (
        <View>
          <Icon
            name="alert-circle"
            size={23}
            color={isVisible([blockInfos[3]])}
            style={{marginLeft: widthPixel(120)}}
          />
          <TouchableOpacity
            style={[styles.frame, {borderColor: subjectColors[blocks[3]]}]}
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
            <Text style={styles.block}>4</Text>
            <View
              style={[
                styles.circle,
                {backgroundColor: subjectColors[blocks[3]]},
              ]}>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={[styles.circleText]}>
                {blocks[3]}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    } else if (number === 5) {
      return (
        <View>
          <Icon
            name="alert-circle"
            size={23}
            color={isVisible([blockInfos[4]])}
            style={{marginLeft: widthPixel(120)}}
          />
          <TouchableOpacity
            style={[styles.frame, {borderColor: subjectColors[blocks[4]]}]}
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
            <Text style={styles.block}>5</Text>
            <View
              style={[
                styles.circle,
                {backgroundColor: subjectColors[blocks[4]]},
              ]}>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={[styles.circleText]}>
                {blocks[4]}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
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
          backgroundColor: THEME.gray6,
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
    margin: heightPixel(40),
    alignSelf: 'center',
    backgroundColor: THEME.gray6,
    borderRadius: widthPixel(40),
    borderWidth: widthPixel(2),
  },
  smallLessonCard: {
    width: widthPixel(1100),
    margin: pixelSizeVertical(40),
    alignSelf: 'center',
    backgroundColor: THEME.gray6,
    borderRadius: widthPixel(40),
    borderWidth: widthPixel(2),
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginEnd: pixelSizeHorizontal(-50),
    marginBottom: heightPixel(40),
  },
  frame: {
    marginTop: widthPixel(-30),
    width: widthPixel(150),
    borderStyle: 'solid',
    borderColor: THEME.fontColor,
    borderWidth: widthPixel(5),
    borderRadius: widthPixel(100),
    marginEnd: widthPixel(60),
  },
  circle: {
    width: widthPixel(125),
    height: widthPixel(125),
    borderRadius: widthPixel(100),
    backgroundColor: THEME.background, //TODO
    marginBottom: heightPixel(7),
    marginTop: heightPixel(30),
    alignSelf: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  circleText: {
    fontFamily: FONTS.medium,
    color: THEME.fontColor,
    fontSize: fontPixel(50),
  },
  block: {
    fontFamily: FONTS.semiBold,
    color: THEME.fontColor,
    fontSize: fontPixel(60),
    marginBottom: heightPixel(0),
    marginTop: heightPixel(30),
    textAlign: 'center',
    alignItems: 'center',
  },
  date: {
    fontFamily: FONTS.regular,
    color: THEME.fontColor,
    fontSize: fontPixel(50),
    marginLeft: pixelSizeHorizontal(40),
    marginTop: pixelSizeVertical(40),
  },
  dayOfTheWeekCircle: {
    width: widthPixel(90),
    height: widthPixel(90),
    borderRadius: widthPixel(100),
    marginTop: widthPixel(25),
    marginLeft: widthPixel(25),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayOfTheWeekText: {
    fontFamily: FONTS.semiBold,
    color: THEME.fontColor,
    fontSize: fontPixel(50),
  },
  dateContainer: {
    width: widthPixel(800),
    height: heightPixel(120),
    marginTop: heightPixel(10),
    marginLeft: heightPixel(10),
    flexDirection: 'row',
  },
  modalContentContainer: {
    flex: 1,
  },
  modalContentText: {
    fontSize: fontPixel(70),
    color: THEME.fontColor,
    fontFamily: FONTS.regular,
    alignSelf: 'center',
  },
  modalContentBlockInfoBox: {
    backgroundColor: THEME.gray5,
    borderRadius: widthPixel(30),
    marginTop: heightPixel(30),
    width: widthPixel(1200),
    height: heightPixel(510),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  modalContentBlockInfoBoxEmpty: {
    backgroundColor: THEME.gray5,
    borderRadius: widthPixel(30),
    marginTop: heightPixel(30),
    width: widthPixel(1200),
    height: heightPixel(120),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  modalContentBlockInfoBoxText: {
    color: THEME.fontColor,
    fontSize: fontPixel(60),
    fontFamily: FONTS.regular,
    marginLeft: widthPixel(35),
  },
  modalContentInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: widthPixel(1100),
    marginTop: heightPixel(60),
    marginLeft: widthPixel(80),
  },
  modalContentInfoText: {
    color: THEME.fontColor,
    fontSize: fontPixel(60),
    fontFamily: FONTS.regular,
    marginLeft: widthPixel(60),
  },
  weekendHolidayContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: widthPixel(1100),
    height: heightPixel(130),
    borderRadius: widthPixel(40),
    borderWidth: widthPixel(2),
    marginTop: heightPixel(20),
    marginBottom: heightPixel(-2),
    borderColor: THEME.fontColor,
    alignSelf: 'center',
    backgroundColor: THEME.gray6,
  },
  weekendHolidayContentInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: widthPixel(1000),
    height: heightPixel(70),
    marginTop: widthPixel(26),
    marginLeft: widthPixel(47),
  },
  weekendHolidayContentInfoText: {
    color: THEME.fontColor,
    fontSize: fontPixel(50),
    fontFamily: FONTS.regular,
    marginLeft: widthPixel(57),
  },
  container: {
    flex: 1,
    padding: 12, // TODO: Convert to widthPixel/heightPixel
    justifyContent: 'center',
    backgroundColor: THEME.gray5,
    borderRadius: 12, // TODO: Convert to widthPixel/heightPixel
  },
  head: {
    height: 44, // TODO: Convert to widthPixel/heightPixel
    backgroundColor: THEME.gray6,
  },
  headText: {
    fontSize: 12, // TODO: Convert to widthPixel/heightPixel
    fontFamily: FONTS.semiBold,
    textAlign: 'center',
    color: THEME.fontColor,
  },
  text: {
    fontSize: 14, // TODO: Convert to widthPixel/heightPixel
    fontFamily: FONTS.regular,
    textAlign: 'center',
    color: THEME.fontColor,
  },
});
