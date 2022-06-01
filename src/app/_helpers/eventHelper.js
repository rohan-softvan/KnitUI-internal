import {store} from '../redux/store/index'
import {setExpandedStateConfig, setTabValueConfig} from '../redux/slice/ChartEditorSlice'
import Highcharts from "highcharts";

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
      // seriesItem.dataSorting = {
      //   enabled: true
      // }
      seriesItem.events = {
        legendItemClick: function () {
          console.log("legendItemClick::: ");
          updateCustomizeTab("legend");
        }
      }
    }));
  } else {
    newConfig.series.forEach((seriesItem => {
      // seriesItem.dataSorting = {
      //   enabled: true
      // }
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
      if (newConfig.chart.type !== "pie") {
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

      var points = this.series[0].points,
          chart = this,
          newPoints = [];

      console.log("points::", points)
      console.log("chart::", chart)
      Highcharts.each(points, function (point, i) {
        point.update({
          name: chart.xAxis[0].categories[i]
        }, false);
        newPoints.push({
          x: point.x,
          y: point.y,
          name: point.name
        });
      });
      chart.redraw();
      newPoints.sort(function (a, b) {
        return b.y - a.y
      });
      Highcharts.each(newPoints, function (el, i) {
        el.x = i;
      });
      console.log("newPoints::::", newPoints)
      chart.series[0].setData(newPoints, true, false, false);
      chart.xAxis[0].setCategories(newPoints.map(e=>e.name), true);

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

