import {store} from '../redux/store/index'
import {setExpandedStateConfig, setTabValueConfig} from '../redux/slice/ChartEditorSlice'

export function updateCustomizeTab(tabName) {
  store.dispatch(setTabValueConfig(2))
  let expandedConfig = store.getState().chart.expandedStateConfig
  console.log('expandedConfig==>', expandedConfig, store.getState())
  let updatedExpandedState = {};
  //turning off all the tabs if opened
  Object.keys(expandedConfig).forEach((tabKey) => {
    updatedExpandedState[tabKey] = false
  })
  //updating tab to true state
  updatedExpandedState[tabName] = true;
  console.log("updatedExpandedState::: ", updatedExpandedState)
  store.dispatch(setExpandedStateConfig(updatedExpandedState))
}

