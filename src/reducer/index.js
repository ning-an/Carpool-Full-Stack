import { combineReducers } from "redux";

import login from "./loginReducer";
import user from "./userReducer";
import trip from "./tripReducer";
import tripMng from "./tripMngReducer";

export default combineReducers({ login, user, trip, tripMng });
