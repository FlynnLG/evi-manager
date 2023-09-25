import React, {useCallback, useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import appStorage from '../components/appStorage';
import {FONTS, THEME} from '../constants';
//import Ionicons
import Icon from 'react-native-vector-icons/Ionicons';

import ColorPicker from 'react-native-wheel-color-picker'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



function goBack(nav){
    nav.navigate('Settings')
}

const CustomColor = () => {
    const navigation = useNavigation();
    const subject = appStorage.getString('temp/bin/subject')

    const jsonObject = appStorage.getString('custom/subjectcolor')
    let subjectColors = JSON.parse(jsonObject)

    function saveColor(nav){
        subjectColors[subject] = color
        appStorage.set('custom/subjectcolor', JSON.stringify(subjectColors))
        console.info('Saved new color')
        appStorage.set('temp/bin/subject', '')
        goBack(nav)
    }

    const [color, setColor] = useState(subjectColors[subject]);
    return (
        <View style={styles.background}>
        <Text>Vorschau:</Text>
            <View
            style={[
                styles.frame,
                {borderColor: color}, 
            ]}>
            <Text style={styles.block}>1</Text>
            <View style={[styles.circle, {backgroundColor: color}]}>
                <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={[
                    styles.circleText,
                ]}>
                {subject}
                </Text>
            </View>
            </View>
            <ColorPicker
					ref={r => { this.picker = r }}
					color={color}
					swatchesOnly={false}
                    onColorChange={(color) => setColor(color)}
					thumbSize={20}
					sliderSize={25}
					noSnap={true}
					row={false}
					swatches={false}
					discrete={true}
				/>

            <TouchableOpacity
            onPress={() => saveColor(navigation)}
            style={styles.saveBtn}
            >
                <Text>Save</Text>
            </TouchableOpacity>
        </View>
    );
};



const styles = StyleSheet.create({
    background: {
        backgroundColor: THEME.background,
        height: windowHeight,
        textAlign: "center",
        padding: 30,
    },
    saveBtn: {
        textAlign: "center",
        backgroundColor: THEME.blue,
        color: THEME.fontColor,
        margin: 100,
        height: 40,
        width: 80,
    },
    frame: {
        marginTop: 100,
        width: 45* 5/4,
        height: 80 * 5/4,
        borderStyle: 'solid',
        borderColor: '#8e8e93',
        borderWidth: 2,
        borderRadius: 50,
        marginBottom: -200,
      },
      circle: {
        width: 38* 5/4,
        height: 38* 5/4,
        borderRadius: 50,
        marginTop: -4.5,
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
        fontSize: 16* 5/4,
      },
      block: {
        fontFamily: FONTS.semiBold,
        color: THEME.fontColor,
        fontSize: 18* 5/4,
        textAlign: 'center',
        alignItems: 'center',
        marginTop: 11,
      },
})

export default CustomColor