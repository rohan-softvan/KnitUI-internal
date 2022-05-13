import {createSlice} from '@reduxjs/toolkit'
import Highcharts from "highcharts";

export const chartEditorSlice = createSlice({
  name: 'chartEditorSlice',
  initialState: {
    graphConfig: {},
    pieChartConfig: {},
    generalConfig: {},
    dataJSON: [],
    expandedStateConfig: {
      heading: false,
      appearance: false,
      legend: false,
      axis: false,
      series: false,
      dataLables: false
    },
    currentTab: 0
  },
  reducers: {
    setGraphConfig: (state, action) => {
      console.log('action==>', action.payload)
      state.graphConfig = action.payload
      Highcharts.chart('highchartsContainer', action.payload)
    },
    setPieChartConfig: (state, action) => {
      state.pieChartConfig = action.payload
    },
    setGeneralConfig: (state, action) => {
      state.generalConfig = action.payload
    },
    setDataJSONConfig: (state, action) => {
      state.dataJSON = action.payload
    },
    setTabValueConfig: (state, action) => {
      state.currentTab = action.payload
    },
    setExpandedStateConfig: (state, action) => {
      console.log('exdpanded==?', action.payload)
      state.expandedStateConfig = action.payload
    }
  },
})


// Action creators are generated for each case reducer function
export const {
  setGraphConfig,
  setPieChartConfig,
  setGeneralConfig,
  setDataJSONConfig,
  setTabValueConfig,
  setExpandedStateConfig
} = chartEditorSlice.actions
export default chartEditorSlice.reducer
