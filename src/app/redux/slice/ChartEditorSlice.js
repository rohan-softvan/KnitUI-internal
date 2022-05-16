import {createSlice,current} from '@reduxjs/toolkit'
import Highcharts from "highcharts";

export const chartEditorSlice = createSlice({
  name: 'chartEditorSlice',
  initialState: {
    graphConfig: {},
    pieChartConfig: {},
    generalConfig:{},
    dataJSON:[],
    expandedStateConfig:{ heading: false, appearance: false, legend: false, axis: false, series: false, dataLables: false },
    currentTab:0,
    selectedItems:[{rows:[],columns:[],measures:[]}],
    selectedQuestionList:[]
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
    },
    setDataJSONConfig:(state,action)=>{
      state.dataJSON=action.payload
    },
    setTabValueConfig: (state,action)=>{
      state.currentTab=action.payload
    },
    setExpandedStateConfig:(state,action)=>{
      console.log('exdpanded==?',action.payload)
      state.expandedStateConfig = action.payload
    },
    setSelectedQuestion: (state, action)=>{
      console.log('action.payloadd==>',current(state.selectedItems),action)
      state.selectedQuestionList=action.payload.questionList;
      const type = action.payload.questionList.length % 2 === 0 ? "rows" : "columns";
      if(state.selectedItems[0].measures.length <= 0){
          state.selectedItems[0].measures.push({uniqueName:action.payload.text, aggregation: "sum"})
      }
      state.selectedItems[0][type].push({uniqueName:action.payload.text,sort: "asc"});
    }
  },
})


// Action creators are generated for each case reducer function
export const {setGraphConfig,setPieChartConfig,setGeneralConfig,setDataJSONConfig,setTabValueConfig,setExpandedStateConfig,setSelectedQuestion} = chartEditorSlice.actions
export default chartEditorSlice.reducer
