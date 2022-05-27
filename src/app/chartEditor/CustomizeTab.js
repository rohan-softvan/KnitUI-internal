import React from 'react';
import HeadingTab from './customize/components/HeadingTab';
import AppearanceTab from './customize/components/AppearanceTab';
import LegendTab from './customize/components/LegendTab';
import AxisTab from './customize/components/AxisTab';
import SeriesTab from './customize/components/SeriesTab';
import DatalabelsTab from './customize/components/DatalabelsTab';
import {setExpandedStateConfig} from "../redux/slice/ChartEditorSlice";
import {useDispatch, useSelector} from 'react-redux';

export default function CustomizeTab({pieConfig, setPieConfig}) {
  const dispatch = useDispatch();
  let expandedConfig = useSelector((state) => state.chart.expandedStateConfig);

  const setTabState = (tab, tabState) => {
    let updatedExpandedState = JSON.parse(JSON.stringify(expandedConfig));
    updatedExpandedState[tab] = tabState;
    dispatch(setExpandedStateConfig(updatedExpandedState))
  }
  let graphConfig = useSelector((state) => state.chart.graphConfig);
  let generalChartType = useSelector((state) => state.chart.generalChartType);

  function getGraphConfigs() {
    console.log("in getGraphConfigs: ", generalChartType)
    if (generalChartType === "pie") {
      return JSON.parse(JSON.stringify(pieConfig))
    } else {
      return JSON.parse(JSON.stringify(graphConfig));
    }
  }

  return (
      <div className={"accordianChart customizeTab"}>
        <HeadingTab
            expanedState={expandedConfig.heading}
            setTabState={setTabState}
            pieConfig={pieConfig}
            setPieConfig={setPieConfig}
        />
        <AppearanceTab
            expanedState={expandedConfig.appearance}
            setTabState={setTabState}
            pieConfig={pieConfig}
            setPieConfig={setPieConfig}
        />
        {getGraphConfigs() && getGraphConfigs().chart &&  !((getGraphConfigs().chart.type === "bar" || getGraphConfigs().chart.type === "column") && getGraphConfigs().plotOptions.series.colorByPoint) &&
            <LegendTab
                expanedState={expandedConfig.legend}
                setTabState={setTabState}
                pieConfig={pieConfig}
                setPieConfig={setPieConfig}
            />}
        <AxisTab
            expanedState={expandedConfig.axis}
            setTabState={setTabState}
            pieConfig={pieConfig}
            setPieConfig={setPieConfig}
        />
        <SeriesTab
            expanedState={expandedConfig.series}
            setTabState={setTabState}
            pieConfig={pieConfig}
            setPieConfig={setPieConfig}
        />
        <DatalabelsTab
            expanedState={expandedConfig.dataLables}
            setTabState={setTabState}
            pieConfig={pieConfig}
            setPieConfig={setPieConfig}
        />
      </div>
  )
}
