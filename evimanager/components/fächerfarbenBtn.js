import React, {useCallback, useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';

import appStorage from './appStorage';
import {FONTS, THEME} from '../constants';
//import Ionicons
import Icon from 'react-native-vector-icons/Ionicons';

function changeColor(color){
    console.log(color)
}

const Colorpallet = ({color}) => {
    return(
        <TouchableOpacity style={[styles.subjectsBtn, {backgroundColor: color}]} onPress={() => changeColor(color)}/>
    )
}

export const FächerfarbenBtn = ({
    subject,
}) => {
    console.log(subject)
    const jsonObject = appStorage.getString('custom/subjectcolor')
    console.log(jsonObject)
    const subjectColors = JSON.parse(jsonObject)
    console.log(subjectColors[subject])

    return (
        <TouchableOpacity style={[styles.subjectsBtn, {borderColor: subjectColors[subject]}]} onPress={() => openColorModal()}>
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