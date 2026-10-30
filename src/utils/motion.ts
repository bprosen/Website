import {
  MOTION_PAUSED_ATTRIBUTE,
  MOTION_PAUSED_VALUE,
  MOTION_STORAGE_KEY,
} from '~/constants';

export const motionInitScript = () =>
  `try{if(localStorage.getItem(${JSON.stringify(MOTION_STORAGE_KEY)})===${JSON.stringify(MOTION_PAUSED_VALUE)})document.documentElement.setAttribute(${JSON.stringify(MOTION_PAUSED_ATTRIBUTE)},'')}catch(e){}`;
