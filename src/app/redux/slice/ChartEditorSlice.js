import {createSlice, current} from '@reduxjs/toolkit'
import Highcharts from "highcharts";
import {setDefaultEventsForGraph} from "../../_helpers/eventHelper";

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
    currentTab: 0,
    selectedItems: [{rows: [], columns: [], measures: []}],
    selectedQuestionList: [],
    chartType: 'bar',
    generalChartType: 'bar',
    selectedQuestionsOptionsList: {
      // 13: ["I eat most of my meals at home", "I eat some meals at home, some on campus"]
    }
  },
  reducers: {
    setGraphConfig: (state, action) => {
      // state.graphConfig = action.payload
      state.graphConfig = setDefaultEventsForGraph(action.payload);
      if (action.payload.chart.type !== "pie") {
        console.log('action==>', action.payload)
        Highcharts.chart('highchartsContainer', action.payload)
      }
      // else{
      //   plotPieChart(JSON.parse(JSON.stringify(action.payload)))
      // }
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
    },
    setSelectedQuestion: (state, action) => {
      console.log('action.payloadd==>', current(state.selectedItems), action)
      state.selectedQuestionList = action.payload.questionList;
      const type = action.payload.questionList.length % 2 === 0 ? "rows" : "columns";
      if (state.selectedItems[0].measures.length <= 0) {
        state.selectedItems[0].measures.push({uniqueName: "count", aggregation: "sum"})
      }
      state.selectedItems[0][type].push({uniqueName: action.payload.text, sort: "asc"});
    },
    setChartType: (state, action) => {
      console.log('chart Type==>', action.payload)
      state.chartType = action.payload
    },
    setGeneralChartType: (state, action) => {
      console.log('setGeneralChartType==>', action.payload)
      state.generalChartType = action.payload
    },
    setSelectedQuestionsOptionsList: (state, action) => {
      console.log('setSelectedQuestionsOptionsList==>', action.payload);
      state.selectedQuestionsOptionsList = action.payload;
    }
  }
})


// Action creators are generated for each case reducer function
export const {
  setGraphConfig,
  setPieChartConfig,
  setGeneralConfig,
  setDataJSONConfig,
  setTabValueConfig,
  setExpandedStateConfig,
  setSelectedQuestion,
  setChartType,
  setGeneralChartType,
  setSelectedQuestionsOptionsList
} = chartEditorSlice.actions
export default chartEditorSlice.reducer
