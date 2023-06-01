import EncryptedStorage from "react-native-encrypted-storage/lib/typescript/EncryptedStorage";

export const SYSTEMDARK = {
  fontColor: '#B8B8B8',
  background: '#262626',
  lightGrey: '#3F3F3F',
  darkGrey: '#171717',
  red: '#FF3B30',
  green: '#2D973D',
};

export const SYSTEMLIGHT = {
  fontColor: '#262626',
  background: THEME.fontColor,
  lightGrey: '#D9D9D9',
  darkGrey: '#D9D9D9',
  red: '#FF3B30',
  green: '#69E77C',
};

export const FONTS = {
  bold: 'Poppins-Bold',
  semiBold: 'Poppins-SemiBold',
  medium: 'Poppins-Medium',
  regular: 'Poppins-Regular',
  light: 'Poppins-Light',
};

export async function getUserLessonTheme(lesson){
  const strorageRes = await EncryptedStorage.getItem(
    `localdata.lessonColors.${lesson}`,
  );
  if(strorageRes == undefined){
    console.error("User didn't specify custom lesson colors using default!")
    const defaultLessonColors = {
      german: "#009933",
      english: "#ff1a1a",
      math: "#1aa3ff",
      history: "#e6e6e6",
      religion: "#b366ff",
      geo: "#99994d",
      physik: "#ff8533",
      sport: "#d9ffb3",
      pb: "#804000",
      art: "#6666ff",
      ds: "#6666ff",
      music: "#6666ff",
      luck: "#00ff80",
      other: "#669999",
    }
    //Safe the default values
    await EncryptedStorage.setItem('localdata.lessonColors.german', defaultLessonColors.german)
    await EncryptedStorage.setItem('localdata.lessonColors.english', defaultLessonColors.english)
    await EncryptedStorage.setItem('localdata.lessonColors.math', defaultLessonColors.math)
    await EncryptedStorage.setItem('localdata.lessonColors.history', defaultLessonColors.history)
    await EncryptedStorage.setItem('localdata.lessonColors.religion', defaultLessonColors.religion)
    await EncryptedStorage.setItem('localdata.lessonColors.geo', defaultLessonColors.geo)
    await EncryptedStorage.setItem('localdata.lessonColors.physik', defaultLessonColors.physik)
    await EncryptedStorage.setItem('localdata.lessonColors.sport', defaultLessonColors.sport)
    await EncryptedStorage.setItem('localdata.lessonColors.pb', defaultLessonColors.pb)
    await EncryptedStorage.setItem('localdata.lessonColors.art', defaultLessonColors.art)
    await EncryptedStorage.setItem('localdata.lessonColors.ds', defaultLessonColors.ds)
    await EncryptedStorage.setItem('localdata.lessonColors.music', defaultLessonColors.music)
    await EncryptedStorage.setItem('localdata.lessonColors.luck', defaultLessonColors.luck)
    await EncryptedStorage.setItem('localdata.lessonColors.other', defaultLessonColors.other)
    //return default value for the first run
    return(defaultLessonColors.other)
  }else{
    //When it isn't "other" than get thing
    return(strorageRes)
  }
}
