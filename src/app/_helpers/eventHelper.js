import {store} from '../redux/store/index'
import {setExpandedStateConfig,setTabValueConfig} from '../redux/slice/ChartEditorSlice'
import Highcharts from "highcharts";

export function updateCustomizeTab(tabName){
    // const dispatch=useDispatch();
    store.dispatch(setTabValueConfig(2))
    let expandedConfig = store.getState().chart.expandedStateConfig
    // .expandedStateConfig);
    console.log('expandedConfig==>',expandedConfig,store.getState())
    let updatedExpandedState= {...expandedConfig}
    updatedExpandedState[tabName] = true;
    store.dispatch(setExpandedStateConfig(updatedExpandedState))
}

export const plotPieChart=(config)=>{
    Highcharts.chart('highchartsContainer', config)
}
export const removeHTML=(str)=>{
    var tmp = document.createElement("DIV");
    tmp.innerHTML = str;
    return tmp.textContent || tmp.innerText || "";
}
