import { createSlice, current } from "@reduxjs/toolkit";
import Highcharts from "highcharts";
import {
  setDefaultEventsForGraph,
  setPercentForDataLabels,
} from "../../_helpers/eventHelper";

export const chartEditorSlice = createSlice({
  name: "chartEditorSlice",
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
      dataLables: false,
    },
    currentTab: 0,
    selectedItems: [{ rows: [], columns: [], measures: [] }],
    selectedQuestionList: [],
    chartType: "column",
    generalChartType: "column",
    selectedQuestionsOptionsList: {
      // 13: ["I eat most of my meals at home", "I eat some meals at home, some on campus"]
    },
  },
  reducers: {
    resetGraphConfig: (state, action) => {
      state.dataJSON = {};
      state.graphConfig = {};
      state.selectedItems = [{ rows: [], columns: [], measures: [] }];
      Highcharts.chart("highchartsContainer", {});
    },
    setGraphConfig: (state, action) => {
      state.graphConfig = setDefaultEventsForGraph(
        action.payload,
        state.selectedItems[0]?.measures[0]?.aggregation
      );
      if (action.payload?.chart?.type !== "pie") {
        Highcharts.chart("highchartsContainer", state.graphConfig);
      }
    },
    setPieChartConfig: (state, action) => {
      state.pieChartConfig = action.payload;
    },
    setGeneralConfig: (state, action) => {
      state.generalConfig = action.payload;
    },
    setDataJSONConfig: (state, action) => {
      state.dataJSON = action.payload;
    },
    setTabValueConfig: (state, action) => {
      state.currentTab = action.payload;
    },
    setExpandedStateConfig: (state, action) => {
      state.expandedStateConfig = action.payload;
    },
    setSelectedQuestion: (state, action) => {
      state.selectedQuestionList = action.payload.questionList;
      if (action.payload.questionList?.length > 0) {
        const type =
          action.payload?.questionList?.length % 2 === 0 ? "rows" : "columns";
        if (state.selectedItems[0].measures.length <= 0) {
          state.selectedItems[0].measures.push({
            uniqueName: "count",
            aggregation: "sum",
          });
        }
        if (action.payload.remove) {
          //state.selectedItems[0].columns
          // row
          if (state.selectedItems[0].columns.length > 0) {
            for (let i in state.selectedItems[0].columns) {
              if (
                state.selectedItems[0].columns[i] &&
                action.payload.text ==
                  state.selectedItems[0].columns[i].uniqueName
              ) {
                state.selectedItems[0].columns =
                  state.selectedItems[0].columns.filter(
                    (el) => el.uniqueName !== action.payload.text
                  );
              }
            }
          }
          if (state.selectedItems[0].rows.length > 0) {
            for (let i in state.selectedItems[0].rows) {
              if (
                state.selectedItems[0].rows[i] &&
                action.payload.text == state.selectedItems[0].rows[i].uniqueName
              ) {
                state.selectedItems[0].rows =
                  state.selectedItems[0].rows.filter(
                    (el) => el.uniqueName !== action.payload.text
                  );
              }
            }
          }
          // }
          // if(action.payload.text == state.selectedItems[0].rows){
          //   state.selectedItems[0].rows=state.selectedItems[0].rows.filter(el => el.uniqueName !== ation.payload.text)
          // }
        } else {
          state.selectedItems[0][type].push({
            uniqueName: action.payload.text,
            sort: "asc",
          });
        }
      }
    },
    setChartType: (state, action) => {
      state.chartType = action.payload;
    },
    setGeneralChartType: (state, action) => {
      state.generalChartType = action.payload;
    },
    setSelectedQuestionsOptionsList: (state, action) => {
      state.selectedQuestionsOptionsList = action.payload;
    },
    resetAllGraphConfigs: (state, action) => {
      state.graphConfig = {};
      state.pieChartConfig = {};
      state.generalConfig = {};
      state.dataJSON = [];
      state.expandedStateConfig = {
        heading: false,
        appearance: false,
        legend: false,
        axis: false,
        series: false,
        dataLables: false,
      };
      state.currentTab = 0;
      state.selectedItems = [{ rows: [], columns: [], measures: [] }];
      state.selectedQuestionList = [];
      state.chartType = "column";
      state.generalChartType = "column";
      state.selectedQuestionsOptionsList = {};
    },
    setSelectedItems: (state, action) => {
      state.selectedItems = action.payload;
      const { measures } = action.payload?.[0];
      let config = setPercentForDataLabels(
        measures[0]?.aggregation,
        JSON.parse(JSON.stringify(current(state.graphConfig)))
      );
      console.log("state::1",state.generalChartType)
      console.log("config::1",config)
      if (state.generalChartType !== "pie") {
        Highcharts.chart("highchartsContainer", config);
      }
    },
    setPivotTableDisplayFlag: (state, action) => {
      state.pivotTableDisplayFlag = false;
      setTimeout(() => {
        state.pivotTableDisplayFlag = true;
      }, 50);
    },
  },
});

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
  setSelectedQuestionsOptionsList,
  resetAllGraphConfigs,
  resetGraphConfig,
  setSelectedItems,
} = chartEditorSlice.actions;
export default chartEditorSlice.reducer;
