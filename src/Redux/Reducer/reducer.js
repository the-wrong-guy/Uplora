import actionTypes from "../Action/action.types";

const intialState = {
  drawerOpen: false,
  userInfo: null,
  GlobalTheme: "light",
};
const CONFIG = (state = intialState, action) => {
  switch (action.type) {
    case actionTypes.SET_GLOBAL_THEME:
      return { ...state, GlobalTheme: action.payload };
    case actionTypes.DRAWER_TOGGLE:
      return { ...state, drawerOpen: !state.drawerOpen };
    case actionTypes.SET_USER_INFO:
      return { ...state, userInfo: action.payload };
    default:
      return state;
  }
};

export default CONFIG;
