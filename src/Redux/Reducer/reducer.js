import actionTypes from "../Action/action.types";

const intialState = {
  darkTheme: true,
  drawerOpen: false,
  userInfo: null,
  textPresence: false,
};
const CONFIG = (state = intialState, action) => {
  switch (action.type) {
    case actionTypes.THEME_TOGGLE:
      return { ...state, darkTheme: !state.darkTheme };
    case actionTypes.DRAWER_TOGGLE:
      return { ...state, drawerOpen: !state.drawerOpen };
    case actionTypes.SET_USER_INFO:
      return { ...state, userInfo: action.payload };
    case actionTypes.SET_TEXT_PRESENCE:
      return { ...state, textPresence: !state.textPresence };
    default:
      return state;
  }
};

export default CONFIG;
