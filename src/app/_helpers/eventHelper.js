import {store} from '../redux/store/index'
import {setExpandedStateConfig, setGraphConfig, setTabValueConfig} from '../redux/slice/ChartEditorSlice'
import Highcharts from "highcharts";

export function updateCustomizeTab(tabName) {
  // const dispatch=useDispatch();
  store.dispatch(setTabValueConfig(2))
  let expandedConfig = store.getState().chart.expandedStateConfig
  // .expandedStateConfig);
  console.log('expandedConfig==>', expandedConfig, store.getState())
  let updatedExpandedState = {...expandedConfig}
  updatedExpandedState[tabName] = true;
  store.dispatch(setExpandedStateConfig(updatedExpandedState))
}

export const plotGraph = (config) => {
  console.log("in plotGraph==> ", config)
  // store.dispatch(setGraphConfig(config));
  if (config.chart.type === "pie") {
    Highcharts.chart('highchartsContainer', config);
  } else {
    // store.dispatch(setGraphConfig(config));
  }
}

export const removeHTML = (str) => {
  var tmp = document.createElement("DIV");
  tmp.innerHTML = str;
  return tmp.textContent || tmp.innerText || "";
}
