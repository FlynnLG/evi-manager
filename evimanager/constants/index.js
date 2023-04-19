import assets from './assets';
import {SYSTEMLIGHT, SYSTEMDARK, FONTS} from './theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

var THEME = SYSTEMLIGHT;
if (
  AsyncStorage.getItem('@loacaldata:settings/theme') == 'SYSTEMLIGHT' ||
  AsyncStorage.getItem('@loacaldata:settings/theme') == undefined
) {
  THEME = SYSTEMLIGHT;
} else {
  THEME = SYSTEMDARK;
}

export {assets, THEME, FONTS};
