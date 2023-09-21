import React, {useCallback, useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import { ColorPicker, toHsv } from 'react-native-color-picker';
import {useNavigation} from '@react-navigation/native';

import appStorage from './appStorage';
import {FONTS, THEME} from '../constants';
//import Ionicons
import Icon from 'react-native-vector-icons/Ionicons';

export const FächerfarbenBtn = ({
    subject,
}) => {
    const navigation = useNavigation();

    //console.log(subject)
    const jsonObject = appStorage.getString('custom/subjectcolor')
    //console.log(jsonObject)
    const subjectColors = JSON.parse(jsonObject)
    //console.log(subjectColors[subject])

    const openColorModal = (nav) => {
        appStorage.set('temp/bin/subject', subject)
        nav.navigate('CustomColor')
    }

    return (
        <TouchableOpacity style={[styles.subjectsBtn, {borderColor: subjectColors[subject]}]} onPress={() => openColorModal(navigation)}>
          <Text style={[styles.subjectText]}>{subject}</Text>
        </TouchableOpacity>
    );
};



const styles = StyleSheet.create({
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