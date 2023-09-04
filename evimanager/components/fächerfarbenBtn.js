import React, {useCallback, useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';

import AsyncStorage from '@react-native-async-storage/async-storage';
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
    // ref
  const bottomSheetModalRef = useRef(null);
  // variables
  const snapPoints = useMemo(() => ['50%'], []);

    return (
        <TouchableOpacity style={styles.subjectsBtn}>
          <Text style={styles.subjectText}>{subject}</Text>
        </TouchableOpacity>
    );
};

const openColorModal = () => {
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
    return(
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
                    Wähle eine Farbe aus
                </Text>
                <View style={styles.modalColorPalett}>
                    <Colorpallet color="#ff3b30"/>
                    <Colorpallet color="#ff9500"/>
                    <Colorpallet color="#ffcc00"/>
                    <Colorpallet color="#34c759"/>
                    
                    <Colorpallet color="#00c7be"/>
                    <Colorpallet color="#30b0c7"/>
                    <Colorpallet color="#32ade6"/>
                    <Colorpallet color="#007aff"/>

                    <Colorpallet color="#5856d6"/>
                    <Colorpallet color="#af52de"/>
                    <Colorpallet color="#ff2d55"/>
                    <Colorpallet color="#a2845e"/>
                </View>
                </View>
            </BottomSheetModal>
        </View>
    )
}

const styles = StyleSheet.create({
    subjectsBtn: {
        backgroundColor: THEME.lightGrey,
        //borderColor: '#B8B8B8',
        borderWidth: 1,
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