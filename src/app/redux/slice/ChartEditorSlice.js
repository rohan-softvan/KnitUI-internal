import {createSlice,current} from '@reduxjs/toolkit'
import Highcharts from "highcharts";
import {updateCustomizeTab} from "../../_helpers/eventHelper";

const handleTitleClick = event => {
  console.log("event::",event.currentTarget.textContent)
  console.log("handleTitleClick invoked 😁");
  updateCustomizeTab("heading");
};

const handleSubTitleClick = event => {
  console.log("handleSubTitleClick invoked 😄");
  updateCustomizeTab("heading");
};

const handleAxisTitleClick = (event, axisType) => {
  console.log("handleAxisTitleClick invoked 😄", axisType);
  updateCustomizeTab("axis");
};


const setDefaultEventsForGraph = (graphConfig) => {
  console.log('in  default function==>',graphConfig)
  let newConfig = {...graphConfig};
  // newConfig.xAxis.title.text= !newConfig.xAxis.title.text && <span style="cursor:pointer;" id="custom-x-axis-title"> X axis Hai</span>
  // let newConfig = JSON.parse(JSON.stringify(graphConfig));
  //adding event listener for legends
  newConfig.series.forEach((seriesItem => {
    seriesItem.events = {
      legendItemClick: function () {
        console.log("legendItemClick::: ");
        updateCustomizeTab("legend");
      }
    }
  }))
  //adding event listener for background
  newConfig.chart.events = {
    load: function () {
      console.log("loaded chart",newConfig);
      if(newConfig.title.text){
        console.log('document.getElementById("custom-title")=>',document.getElementById("custom-title").value)
        document
            .getElementById("custom-title")
            .addEventListener("click", handleTitleClick);
      }
      if(newConfig.subtitle.text){
        document
            .getElementById("custom-subtitle")
            .addEventListener("click", handleSubTitleClick);
      }
      console.log('yaxis==>',document.getElementById("custom-y-axis-title"))
      if (
          newConfig.chart.type !== "pie"
      ) {
        document
            .getElementById("custom-x-axis-title")
            .addEventListener("click", e => handleAxisTitleClick(e, "x"));
        // document
        //     .getElementById("custom-y-axis-title")
        //     .addEventListener("click", e => handleAxisTitleClick(e, "y"));
      }
      if(document.getElementById("custom-y-axis-title")){
        document
            .getElementById("custom-y-axis-title")
            .addEventListener("click", e => handleAxisTitleClick(e, "y"));
      }
    },
    click: function () {
      updateCustomizeTab("appearance");
    }
  };
  //adding event listener for series
  newConfig.plotOptions.series.point.events = {
    click: function () {
      console.log("seriesClick::: ", this);
      updateCustomizeTab("series");
      // handleChange(3)
    }
  }

  // newConfig.xAxis.labels.events={
  //   click: function () {
  //     console.log("alabel::: ", this);
  //     updateCustomizeTab("axis")
  //   },
  // }
  // newConfig.xAxis.
  console.log("newConfig:: final", newConfig);
  return newConfig;
}

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
    selectedQuestionList:[],
    chartType:'bar'
  },
  reducers: {
    setGraphConfig: (state, action) => {
      console.log('action==>', action.payload)
      // state.graphConfig = action.payload
      state.graphConfig = setDefaultEventsForGraph(action.payload);
      if (action.payload.chart.type !== "pie") {
        console.log("plotting>> ", action.payload.chart.type, " chart")
        Highcharts.chart('highchartsContainer', action.payload)
      }
      // else{
      //   plotPieChart(JSON.parse(JSON.stringify(action.payload)))
      // }
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
    },
    setChartType: (state,action)=>{
      console.log('chart Type==>',action.payload)
      state.chartType = action.payload
    }
  },
})


// Action creators are generated for each case reducer function
export const {setGraphConfig,setPieChartConfig,setGeneralConfig,setDataJSONConfig,setTabValueConfig,setExpandedStateConfig,setSelectedQuestion,setChartType} = chartEditorSlice.actions
export default chartEditorSlice.reducer
