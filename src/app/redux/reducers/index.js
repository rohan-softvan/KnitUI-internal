import { combineReducers } from "redux";
import DataSlice from '../slice/DataSlice'
import projectSlice from '../slice/ProjectSlice'

// Root Reducers
export default combineReducers({
  data: DataSlice,
  project : projectSlice
});
