import actionTypes from "./action.types";

// eslint-disable-next-line import/prefer-default-export
export const themeToggle = () => ({
  type: actionTypes.THEME_TOGGLE,
});

export const drawerToggle = () => ({
  type: actionTypes.DRAWER_TOGGLE,
});

export const setUserInfo = (info) => ({
  type: actionTypes.SET_USER_INFO,
  payload: info,
});

export const setTextPresence = () => ({
  type: actionTypes.SET_TEXT_PRESENCE,
});
