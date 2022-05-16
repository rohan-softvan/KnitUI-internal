import {store} from '../redux/store/index'
import {setExpandedStateConfig,setTabValueConfig} from '../redux/slice/ChartEditorSlice'

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

