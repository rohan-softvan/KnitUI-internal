import * as React from 'react';
import {Grid, Typography} from "@material-ui/core";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Series from '../../../../assets/images/charteditor/Series.png';
import FormHelperText from '@material-ui/core/FormHelperText';
import SelectComponent from "../../../components/select/Select";
import Divider from "@material-ui/core/Divider";
import Popover from "@material-ui/core/Popover";
import CustomColorPicker from "./CustomColorPicker";
import {useDispatch, useSelector} from "react-redux";
import {setGraphConfig} from "../../../redux/slice/ChartEditorSlice";
import {setRecentColorsForColorPicker} from "../../../redux/slice/ColorPickerSlice";

let legend = [
  {
    title: "On",
    value: "on",
    key: 1,
  },
  {
    title: "Off",
    value: "off",
    key: 2,
  },
];

const renderSeriesMenuItem = (title, color) => (
    <div style={{display: 'flex', alignItems: 'center'}}><span style={{
      backgroundColor: color,
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      marginRight: '15px'
    }}/><span className={"series-menu-item"}>{title}</span></div>)

const getSelectedSeries = (graphConfig) => {
  if (graphConfig && graphConfig.chart) {
    if (graphConfig.chart.type === "pie") {
      return graphConfig.series[0].data[0];
    } else if ((graphConfig.chart.type === "bar" || graphConfig.chart.type === "column") && graphConfig.plotOptions.series.colorByPoint) {
      return {name: graphConfig.xAxis.categories[0], color: graphConfig.colors[0]};
    } else {
      return graphConfig.series[0];
    }
  }
}

const getSeriesData = (config) => {
  if (config && config.chart) {
    if (config.chart.type === "pie") {
      return config.series[0].data;
    } else if ((config.chart.type === "bar" || config.chart.type === "column") && config.plotOptions.series.colorByPoint) {
      const {categories} = config.xAxis;
      let series = [];
      categories.forEach((category, index) => {
        let seriesItem = {};
        seriesItem["name"] = category;
        seriesItem["color"] = config["colors"][index];
        series.push(seriesItem);
      })
      return series;
    } else {
      return config.series
    }
  }
}


export default function SeriesTab({expanedState, setTabState, pieConfig, setPieConfig}) {
  const dispatch = useDispatch();
  let graphConfig = useSelector((state) => state.chart.graphConfig);
  let colorPickerColors = useSelector((state) => state.colorPicker);
  let generalChartType = useSelector((state) => state.chart.generalChartType);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false)
  const [currentColor, setCurrentColor] = React.useState('')
  const [selectedSeries, setSelectedSeries] = React.useState(getSelectedSeries(generalChartType === "pie" ? pieConfig : graphConfig))

  function getGraphConfigs() {
    if (generalChartType === "pie") {
      return JSON.parse(JSON.stringify(pieConfig))
    } else {
      return JSON.parse(JSON.stringify(graphConfig));
    }
  }

  function setGraphConfigs(config) {
    if (generalChartType === "pie") {
      setPieConfig(config);
    } else {
      dispatch(setGraphConfig(config));
    }
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true)
  };

  let seriesMenu = [];

  const seriesData = getSeriesData(getGraphConfigs());

  if (Array.isArray(seriesData) && seriesData.length > 0) {
    for (let i = 0; i < seriesData.length; i++) {
      let obj = {};
      obj.title = renderSeriesMenuItem(seriesData[i].name, seriesData[i].color);
      obj.value = seriesData[i].name;
      obj.key = i;
      seriesMenu.push(obj);
    }
  }


  const id = 'series-color-picker';

  const setSeriesColor = (color) => {
    let newConfig = getGraphConfigs();
    if ((newConfig.chart.type === "bar" || newConfig.chart.type === "column") && newConfig.plotOptions.series.colorByPoint) {
      let selectedSeriesConfig = graphConfig.xAxis.categories.findIndex(e => e === selectedSeries.name);
      newConfig.colors[selectedSeriesConfig] = color;
    } else if (newConfig.chart.type === "pie") {
      let selectedSeriesConfig = newConfig.series[0].data.find(e => e.name === selectedSeries.name);
      selectedSeriesConfig["color"] = color;
    } else {
      let selectedSeriesConfig = newConfig.series.find(e => e.name === selectedSeries.name);
      selectedSeriesConfig["color"] = color;
    }
    let selectedSeriesClone = JSON.parse(JSON.stringify(selectedSeries));
    selectedSeriesClone.color = color;
    setSelectedSeries(selectedSeriesClone);
    setGraphConfigs(newConfig);
  }

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false)
    dispatch(setRecentColorsForColorPicker({type: "series", color: currentColor}));
    setSeriesColor(currentColor)
  };

  const handleCallback = (childData) => {
    setCurrentColor(childData)
  }

  const handleShowInLegend = (event) => {
    const {value} = event.target;
    let newConfig = getGraphConfigs();
    let selectedSeriesConfig = newConfig.series.find(e => e.name === selectedSeries.name);
    selectedSeriesConfig["showInLegend"] = value === "on"
    let selectedSeriesClone = JSON.parse(JSON.stringify(selectedSeries));
    selectedSeriesClone["showInLegend"] = value === "on"
    setSelectedSeries(selectedSeriesClone);
    setGraphConfigs(newConfig);
  }

  const handleSeriesChange = (event) => {
    const {value} = event.target;
    let selectedSeriesConfig = "";
    let newConfig = getGraphConfigs();
    if (newConfig.chart.type === "pie") {
      selectedSeriesConfig = newConfig.series[0].data.find(e => e.name === value);
    } else if ((newConfig.chart.type === "bar" || newConfig.chart.type === "column") && newConfig.plotOptions.series.colorByPoint) {
      selectedSeriesConfig = {
        name: newConfig.xAxis.categories.find(e => e === value),
        color: newConfig.colors[newConfig.xAxis.categories.findIndex(e => e === value)]
      };
    } else {
      selectedSeriesConfig = newConfig.series.find(e => e.name === value);
    }
    setSelectedSeries(selectedSeriesConfig);
  }


  return (
      <Accordion expanded={expanedState} onChange={(event, expandedState) => setTabState('series', expandedState)}>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
            aria-controls="panel2a-content"
            id="panel2a-header"
        >
          <Typography className='AccordTitle'><img src={Series} alt={"series-icon"}/>Series</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <div className={'customGridTitle'}>
                <div className={'seriesValueData'}>
                  <FormHelperText id="title-text">Series Selector</FormHelperText>
                  <SelectComponent
                      menu={seriesMenu}
                      width={"full"}
                      handleChange={handleSeriesChange}
                      menuValue={selectedSeries && selectedSeries.name}
                  />
                </div>
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <div className={'datalabelGrid'}>
                <div className={'leftGrid'}>
                  <FormHelperText id="title-text">Series color</FormHelperText>
                  <div className={'colorPiker'}
                       style={{
                         width: 'calc(100% - 15px)'
                       }}>
                    <div className={'fixColors'}>
                      <div className={'ActiveColor'}
                           style={{'backgroundColor': selectedSeries && selectedSeries.color}}></div>
                      <Divider flexItem orientation="vertical" sx={{mx: 0.5, my: 1}}/>
                      <div className={'ColorVariation'}
                           style={{'backgroundColor': '#000000'}}
                           onClick={() => setSeriesColor("#000000")}
                      />
                      <div className={'ColorVariation'}
                           style={{'backgroundColor': '#FCD364'}}
                           onClick={() => setSeriesColor("#FCD364")}
                      />
                    </div>
                    <div className={'colorDropdown'}>
                      <button aria-describedby={id} type="button" onClick={handleClick}>
                        Auto
                      </button>
                      <Popover
                          id={id}
                          open={open}
                          anchorEl={anchorEl}
                          onClose={handleClose}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                          }}
                          style={{height: 'auto'}}
                      >
                        <CustomColorPicker
                            component={"series"}
                            parentCallback={handleCallback}
                            usedColors={colorPickerColors["series"]}
                            selectedColor={selectedSeries && selectedSeries.color}
                        />
                      </Popover>
                    </div>
                  </div>
                </div>
                <div className={'leftGrid'}>
                  <FormHelperText id="title-text">Show in legend</FormHelperText>
                  <SelectComponent
                      menu={legend}
                      menuValue={selectedSeries && selectedSeries.showInLegend ? "on" : "off"}
                      handleChange={handleShowInLegend}
                  />
                </div>
                <div className={'blankSpace'}></div>
              </div>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
  )
}
