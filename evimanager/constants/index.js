import assets from './assets';
import {SYSTEMLIGHT, SYSTEMDARK, FONTS} from './theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

let THEME;
if (
  AsyncStorage.getItem('@localdata:settings/theme').toString() ===
    'SYSTEMLIGHT' ||
  AsyncStorage.getItem('@localdata:settings/theme') === undefined
) {
  THEME = SYSTEMLIGHT;
} else {
  THEME = SYSTEMDARK;
}

export {assets, THEME, FONTS};
