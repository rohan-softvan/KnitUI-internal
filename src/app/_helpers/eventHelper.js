import {store} from '../redux/store/index'
import {setExpandedStateConfig, setTabValueConfig} from '../redux/slice/ChartEditorSlice'

export function updateCustomizeTab(tabName) {
  store.dispatch(setTabValueConfig(2))
  let expandedConfig = store.getState().chart.expandedStateConfig
  console.log('expandedConfig==>', expandedConfig, store.getState())
  let updatedExpandedState = {}
  Object.keys(expandedConfig).forEach(el => updatedExpandedState[el] = false);
  updatedExpandedState[tabName] = true;
  store.dispatch(setExpandedStateConfig(updatedExpandedState))
}

export const removeHTML = (str) => {
  let tmp = document.createElement("DIV");
  tmp.innerHTML = str;
  return tmp.textContent || tmp.innerText || "";
}


const handleTitleClick = event => {
  console.log("event::", event.currentTarget.textContent)
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


export const setDefaultEventsForGraph = (graphConfig) => {
  console.log('in setDefaultEventsForGraph function==>', graphConfig)
  // let newConfig = JSON.parse(JSON.stringify(graphConfig));
  let newConfig = {...graphConfig};
  //adding event listener for legends
  if (graphConfig.chart.type === "pie") {
    newConfig.series[0].data.forEach((seriesItem => {
      seriesItem.events = {
        legendItemClick: function () {
          console.log("legendItemClick::: ");
          updateCustomizeTab("legend");
        }
      }
    }));
  } else {
    newConfig.series.forEach((seriesItem => {
      seriesItem.events = {
        legendItemClick: function () {
          console.log("legendItemClick::: ");
          updateCustomizeTab("legend");
        }
      }
    }));
  }

  //adding event listener for background
  newConfig.chart.events = {
    load: function () {
      console.log("loaded chart", newConfig);
      if (newConfig.title.text && document.getElementById("custom-title")) {
        document
            .getElementById("custom-title")
            .addEventListener("click", handleTitleClick);
      }
      if (newConfig.subtitle.text && document.getElementById("custom-subtitle")) {
        document
            .getElementById("custom-subtitle")
            .addEventListener("click", handleSubTitleClick);
      }
     if(newConfig.chart.type !== "pie"){
       if (document.getElementById("custom-x-axis-title")) {
         document
             .getElementById("custom-x-axis-title")
             .addEventListener("click", e => handleAxisTitleClick(e, "x"));
       }
       if (document.getElementById("custom-y-axis-title")) {
         document
             .getElementById("custom-y-axis-title")
             .addEventListener("click", e => handleAxisTitleClick(e, "y"));
       }
     }
    },
    click: function () {
      updateCustomizeTab("appearance");
    }
  };
  //adding event listener for series
  if (newConfig && newConfig.plotOptions && newConfig.plotOptions.series) {
    newConfig.plotOptions.series.point.events = {
      click: function () {
        updateCustomizeTab("series");
      }
    }
  }
  return newConfig;
}

