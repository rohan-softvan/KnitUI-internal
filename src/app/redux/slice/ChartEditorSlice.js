import {createSlice} from '@reduxjs/toolkit'
import Highcharts from "highcharts";

export const chartEditorSlice = createSlice({
  name: 'chartEditorSlice',
  initialState: {
    graphConfig: {},
  },
  reducers: {
    setGraphConfig: (state, action) => {
      console.log('action==>', action.payload)
      state.graphConfig = action.payload
      Highcharts.chart('highchartsContainer', action.payload)
    },
  },
})


// Action creators are generated for each case reducer function
export const {setGraphConfig} = chartEditorSlice.actions
export default chartEditorSlice.reducer
