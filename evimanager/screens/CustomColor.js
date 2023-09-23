import React, {useCallback, useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import { ColorPicker, toHsv, fromHsv } from 'react-native-color-picker';
import {useNavigation} from '@react-navigation/native';
import Slider from '@react-native-community/slider';

import appStorage from '../components/appStorage';
import {FONTS, THEME} from '../constants';
//import Ionicons
import Icon from 'react-native-vector-icons/Ionicons';



function goBack(nav){
    nav.navigate('Settings')
}

const CustomColor = () => {
    const navigation = useNavigation();
    const subject = appStorage.getString('temp/bin/subject')

    const jsonObject = appStorage.getString('custom/subjectcolor')
    let subjectColors = JSON.parse(jsonObject)

    function saveColor(nav){
        subjectColors[subject] = fromHsv(color)
        appStorage.set('custom/subjectcolor', JSON.stringify(subjectColors))
        console.info('Saved new color')
        appStorage.set('temp/bin/subject', '')
        goBack(nav)
    }

    
   
    const [color, setColor] = useState(subjectColors[subject]);


    const oldColor = subjectColors[subject]
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

            <View>
                <ColorPicker
                    oldColor={oldColor}
                    onColorSelected={(color) => {alert(`Color selected: ${color}`); setColor(color)}}
                    style={{flex: 1}}
                    hideSliders={true}
                />
            </View>

            <TouchableOpacity
            onPress={() => saveColor(navigation)}
            >
                <Text>Save</Text>
            </TouchableOpacity>
        </View>
    );
};



const styles = StyleSheet.create({
    background: {
        backgroundColor: THEME.background,
    },
    subjectsBtn: {
        backgroundColor: THEME.primary,
        //borderColor: '#B8B8B8',
        borderWidth: 2,
        paddingTop: 22,
        borderRadius: 50,
        width: 66,
        height: 66,
        margin: 5,
    },
    subjectText: {
        fontFamily: FONTS.bold,
        color: THEME.fontColor,
        fontSize: 14,
        textAlign: 'center',
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
    modalColorPalett: { //TODO: Make a 4x3 Grid
        width: 385,
    },
})

export default CustomColor