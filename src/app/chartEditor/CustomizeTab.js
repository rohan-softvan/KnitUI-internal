import React, { useState } from 'react';
import HeadingTab from './customize/components/HeadingTab';
import AppearanceTab from './customize/components/AppearanceTab';
import LegendTab from './customize/components/LegendTab';
import AxisTab from './customize/components/AxisTab';
import SeriesTab from './customize/components/SeriesTab';
import DatalabelsTab from './customize/components/DatalabelsTab';

export default function CustomizeTab() {
    const [expanedState, setExpandedState] = useState({ heading: false, appearance: false, legend: false, axis: false, series: false, dataLables: false });

    const setTabState = (tab, tabState) => {
        expanedState[tab] = tabState;
        setExpandedState({ ...expanedState })
    }

    return (
        <div className={'accordianChart customizeTab'}>
            <HeadingTab expanedState={expanedState.heading} setTabState={setTabState} />
            <AppearanceTab expanedState={expanedState.appearance} setTabState={setTabState} />
            <LegendTab expanedState={expanedState.legend} setTabState={setTabState} />
            <AxisTab expanedState={expanedState.axis} setTabState={setTabState} />
            <SeriesTab expanedState={expanedState.series} setTabState={setTabState} />
            <DatalabelsTab expanedState={expanedState.dataLables} setTabState={setTabState} />
        </div>
    )
}