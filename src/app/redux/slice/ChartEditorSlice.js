import {createSlice} from '@reduxjs/toolkit'
import Highcharts from "highcharts";

export const chartEditorSlice = createSlice({
  name: 'chartEditorSlice',
  initialState: {
    graphConfig: {},
    pieChartConfig: {},
    generalConfig:{}
  },
  reducers: {
    setGraphConfig: (state, action) => {
      console.log('action==>', action.payload)
      state.graphConfig = action.payload
      Highcharts.chart('highchartsContainer', action.payload)
    },
    setPieChartConfig: (state,action)=>{
      state.pieChartConfig=action.payload
    },
    setGeneralConfig: (state,action)=>{
      state.generalConfig=action.payload
    }
  },
})


// Action creators are generated for each case reducer function
export const {setGraphConfig,setPieChartConfig,setGeneralConfig} = chartEditorSlice.actions
export default chartEditorSlice.reducer
