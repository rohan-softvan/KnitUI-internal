import React, { useState } from 'react';
import HeadingTab from './customize/components/HeadingTab';
import AppearanceTab from './customize/components/AppearanceTab';
import LegendTab from './customize/components/LegendTab';
import AxisTab from './customize/components/AxisTab';
import SeriesTab from './customize/components/SeriesTab';
import DatalabelsTab from './customize/components/DatalabelsTab';
import {setExpandedStateConfig} from "../redux/slice/ChartEditorSlice";
import { useDispatch, useSelector } from 'react-redux';
export default function CustomizeTab() {
    const dispatch=useDispatch();
    // const expandedConfig=useSelector(useSelector)
    let expandedConfig = useSelector((state) => state.chart.expandedStateConfig);
    console.log('expanded COnfig==>',expandedConfig)
    const [expanedState, setExpandedState] = useState(expandedConfig);
    
    const setTabState = (tab, tabState) => {
        let updatedExpandedState= {...expanedState}
        updatedExpandedState[tab] = tabState;
        dispatch(setExpandedStateConfig(updatedExpandedState))
        // setExpandedState({ ...expanedState })
    }

    return (
        <div className={'accordianChart customizeTab'}>
            <HeadingTab expanedState={expandedConfig.heading} setTabState={setTabState} />
            <AppearanceTab expanedState={expandedConfig.appearance} setTabState={setTabState} />
            <LegendTab expanedState={expandedConfig.legend} setTabState={setTabState} />
            <AxisTab expanedState={expandedConfig.axis} setTabState={setTabState} />
            <SeriesTab expanedState={expandedConfig.series} setTabState={setTabState} />
            <DatalabelsTab expanedState={expandedConfig.dataLables} setTabState={setTabState} />
        </div>
    )
}