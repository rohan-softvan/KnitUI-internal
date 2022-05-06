import {createSlice} from '@reduxjs/toolkit'
import {setGraphConfig} from "./ChartEditorSlice";
import Highcharts from "highcharts";


export const webdatarocksSlice = createSlice({
  name: 'webdatarocksSlice',
  initialState: {
    webdatarocksRef: null,
    type: "pie"
  },
  reducers: {
    setWebdatarocksRef: (state, action) => {
      console.log('webdatarocksRef action==>', action.payload)
      if (action.payload.ref) {
        console.log("setting ref")
        state.webdatarocksRef = action.payload.ref
      }
      if (action.payload.type) {
        console.log("setting type", action.payload.type)
        state.type = action.payload.type
      }
      let myRef = action.payload.ref;
      console.log("myRef", myRef)
      myRef.webdatarocks.highcharts.getData(
          {
            type: action.payload.type,
          },
          function (data) {
            console.log('graphConfig==>', data)
            Highcharts.chart("highchartsContainer", data);
            myRef.webdatarocks.refresh();
          },
          function (data) {
            console.log('graphConfig==>', data)
            Highcharts.chart("highchartsContainer", data);
            myRef.webdatarocks.refresh();
          }
      );
    },
  },
})

// Action creators are generated for each case reducer function
export const {setWebdatarocksRef} = webdatarocksSlice.actions
export default webdatarocksSlice.reducer
