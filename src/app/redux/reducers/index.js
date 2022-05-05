import { combineReducers } from "redux";
import DataSlice from '../slice/DataSlice'
import projectSlice from '../slice/ProjectSlice'
import chartEditorSlice from "../slice/ChartEditorSlice";
import ColorPickerSlice from "../slice/ColorPickerSlice";

// Root Reducers
export default combineReducers({
  data: DataSlice,
  project : projectSlice,
  chart: chartEditorSlice,
  colorPicker: ColorPickerSlice
});
