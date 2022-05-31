import * as React from 'react';
import {Grid, Typography} from "@material-ui/core";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Axis from '../../../../assets/images/charteditor/Axis.png';
import SettingToggle from '../../../../assets/images/charteditor/setting.png'
import SettingNotActive from '../../../../assets/images/charteditor/settingNotActive.png'
import Switch from "@material-ui/core/Switch";
import FormHelperText from '@material-ui/core/FormHelperText';
import SelectComponent from "../../../components/select/Select";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import Paper from '@material-ui/core/Paper';
import {styled} from '@material-ui/core/styles';
import CustomColorPicker from "./CustomColorPicker";
import Divider from "@material-ui/core/Divider";
import Popover from "@material-ui/core/Popover";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import {setGraphConfig} from "../../../redux/slice/ChartEditorSlice";
import {useDispatch, useSelector} from "react-redux";
import {setRecentColorsForColorPicker} from "../../../redux/slice/ColorPickerSlice";
import {removeHTML} from '../../../_helpers/eventHelper'

let fontsize = [
  {
    title: "Auto",
    value: "auto",
    key: 1,
  },
  {
    title: "10",
    value: "10",
    key: 2,
  },
  {
    title: "12",
    value: "12",
    key: 3,
  },
  {
    title: "14",
    value: "14",
    key: 4,
  },
];

let fontFamily = [
  {
    title: "Rubik Default",
    value: "rubik_default",
    key: 1,
  },
  {
    title: "Roboto",
    value: "roboto",
    key: 2,
  },
  {
    title: "Roboto Slab",
    value: "roboto_slab",
    key: 3,
  },
  {
    title: "Script MT",
    value: "script_mt",
    key: 4,
  },
];

let position = [
  {
    title: "Top",
    value: "top",
    key: 1,
  },
  {
    title: "Middle",
    value: "middle",
    key: 2,
  },
  {
    title: "Bottom",
    value: "bottom",
    key: 3,
  },
];

let axisValue = [
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

let angleOfLabel = [
  {
    title: "Horizontal",
    value: "0",
    key: 1,
  },
  {
    title: "Left diagonal",
    value: "-45",
    key: 2,
  },
  {
    title: "Right vertical",
    value: "90",
    key: 3,
  },
  {
    title: "Right diagonal",
    value: "45",
    key: 4,
  },
  {
    title: "Left vertical",
    value: "-90",
    key: 5,
  },
];

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({theme}) => ({
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    '&.Mui-disabled': {
      border: 0,
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

export default function LegendTab({expanedState, setTabState, pieConfig, setPieConfig}) {
  const dispatch = useDispatch();
  let graphConfig = useSelector((state) => state.chart.graphConfig);
  let colorPickerColors = useSelector((state) => state.colorPicker);
  const [selectedQuestions, setSelectedQuestions] = React.useState([]);
  const switchlabel = {inputProps: {'aria-label': 'Switch demo'}};

  const [Height, setHeight] = React.useState('0px');
  const [Show, setShow] = React.useState(false);

  const [alignment, setAlignment] = React.useState('center');
  const [formats, setFormats] = React.useState(() => ['']);
  const [colorPickerAnchorEl, setColorPickerAnchorEl] = React.useState({
    xAxisText: null,
    xAxisGridLine: null,
    yAxisText: null,
    yAxisGridLine: null,
  });
  const [colorPickerOpen, setColorPickerOpen] = React.useState({
    xAxisText: false,
    xAxisGridLine: false,
    yAxisText: false,
    yAxisGridLine: false,
  })
  const [currentColor, setCurrentColor] = React.useState('')

  const [invertAxis, setInvertAxis] = React.useState(graphConfig.chart && graphConfig.chart.inverted);
  const [xAxisTitle, setXAxisTitle] = React.useState(removeHTML(graphConfig && graphConfig.xAxis && graphConfig.xAxis.title.text));
  const [selectedFontFamily, setSelectedFontFamily] = React.useState('roboto')
  const [xAxisFontSize, setxAxisFontSize] = React.useState('auto')
  const [xAxisTitleName, setXAxisTitleName] = React.useState('on')
  const [selectedAngleOfLabel, setSelectedAngleOfLabel] = React.useState('0')
  let generalChartType = useSelector((state) => state.chart.generalChartType);

  function getGraphConfigs() {
    console.log("in getGraphConfigs: ", generalChartType)
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

  const handleFormat = (event, newFormats) => {
    setFormats(newFormats);
  };

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const toggleXSetting = () => {
    if (Height == '0px') setHeight('100%'); else setHeight('0px');
    setShow(!Show)
  }

  const handleColorPickerOpen = (event, component) => {
    colorPickerAnchorEl[component] = event.currentTarget;
    colorPickerOpen[component] = true
    setColorPickerAnchorEl({...colorPickerAnchorEl});
    setColorPickerOpen({...colorPickerOpen})
  };

  const xAxisTextColorId = 'x-axis-text-color';
  const xAxisGridLineColorId = 'x-axis-grid-line-color';
  const yAxisTextColorId = 'y-axis-text-color';
  const yAxisGridLineColorId = 'y-axis-grid-line-color';

  const handleColorPickerClose = (component) => {
    colorPickerAnchorEl[component] = null;
    colorPickerOpen[component] = false
    setColorPickerAnchorEl({...colorPickerAnchorEl});
    setColorPickerOpen({...colorPickerOpen})
    dispatch(setRecentColorsForColorPicker({type: component + "Color", color: currentColor}));
    component === "xAxisText" && setXAxisColor(currentColor);
    component === "xAxisGridLine" && setGridLineColor("x", currentColor);

    component === "yAxisText" && setYAxisColor(currentColor);
    component === "yAxisGridLine" && setGridLineColor("y", currentColor);
  };

  const handleCallback = (childData) => {
    setCurrentColor(childData)
  }

  const handleChartInvertAxis = (event) => {
    setInvertAxis(event.target.checked);
    let newConfig = getGraphConfigs();
    newConfig['chart']['inverted'] = event.target.checked
    setGraphConfigs(newConfig);
  }

  // const handleXAxisTitleSave = (event) => {
  //   setXAxisTitle(event.target.value);
  //   let newConfig = getGraphConfigs();
  //   newConfig['xAxis']['title']["text"] = '<p style="cursor:pointer;" id="custom-x-axis-title">' + event.target.value + '</p>'
  //   setGraphConfigs(newConfig)
  // };

  const handleXAxisTitleChange = (event) => {
    setXAxisTitle(event.target.value);
    let newConfig = getGraphConfigs();
    newConfig['xAxis']['title']["text"] = '<p style="cursor:pointer;" id="custom-x-axis-title">' + event.target.value + '</p>'
    setGraphConfigs(newConfig)
  };

  const handleXAxisTitleFontFamilyChange = (event) => {
    const {value} = event.target;
    setSelectedFontFamily(value);
    let newConfig = getGraphConfigs();
    let legendStyle = newConfig['xAxis']['title']['style'] || {};
    legendStyle["fontFamily"] = fontFamily.find(e => e.value === value).title
    newConfig['xAxis']['title']['style'] = legendStyle;
    setGraphConfigs(newConfig);
  }

  const handlexAxisFontSizeChange = (event) => {
    const {value} = event.target;
    setxAxisFontSize(value);
    let newConfig = getGraphConfigs();
    let xAxisStyle = newConfig['xAxis']['title']['style'] || {};
    xAxisStyle["fontSize"] = value === "auto" ? "12px" : value + 'px';
    newConfig['xAxis']['title']['style'] = xAxisStyle;
    setGraphConfigs(newConfig);
  }

  const handleXAxisFormat = (event, newFormats) => {
    setFormats(newFormats);
    let newConfig = getGraphConfigs();
    let xAxisStyle = newConfig['xAxis']['title']['style'] || {};
    xAxisStyle["fontWeight"] = newFormats.includes("bold") ? "bold" : "normal";
    xAxisStyle["fontStyle"] = newFormats.includes("italic") ? "italic" : "normal";
    newConfig['xAxis']['title']['style'] = xAxisStyle;
    setGraphConfigs(newConfig);
  }

  const setXAxisColor = (color) => {
    let newConfig = getGraphConfigs();
    let style = newConfig['xAxis']['title']['style'] || {};
    style["color"] = color;
    newConfig['xAxis']['title']['style'] = style;
    setGraphConfigs(newConfig);
  }

  const setYAxisColor = (color) => {
    let newConfig = getGraphConfigs();
    let style = newConfig['yAxis']['title']['style'] || {};
    style["color"] = color;
    newConfig['yAxis']['title']['style'] = style;
    setGraphConfigs(newConfig);
  }

  const setGridLineColor = (axis, color) => {
    let newConfig = getGraphConfigs();
    newConfig[`${axis}Axis`]['gridLineColor'] = color;
    setGraphConfigs(newConfig);
  }

  const handleXAxisTitleName = (event) => {
    const {value} = event.target;
    // setXAxisTitleName(value);
    let newConfig = getGraphConfigs();
    newConfig["xAxis"]["title"]["enabled"] = value === "on"
    setGraphConfigs(newConfig);
  }

  const handleXAxisGridLine = (event) => {
    const {value} = event.target;
    let newConfig = getGraphConfigs();
    newConfig["xAxis"]["gridLineWidth"] = value === "on" ? 1 : 0
    setGraphConfigs(newConfig);
  }

  const handleXAxisAngleOfLabel = (event) => {
    const {value} = event.target;
    setSelectedAngleOfLabel(value);
    let newConfig = getGraphConfigs();
    let xAxisAngel = newConfig['xAxis']['labels']['rotation'] || {};
    xAxisAngel = value === "horizontal" ? Number("0") : Number(value);
    newConfig['xAxis']['labels']['rotation'] = xAxisAngel;
    setGraphConfigs(newConfig);
  }

  /*Y Axis*/
  const [YHeight, setYHeight] = React.useState('0px');
  const [YShow, setYShow] = React.useState(false);
  // const [yAxisTitle, setYAxisTitle] = React.useState(removeHTML(graphConfig && graphConfig.yAxis && graphConfig.yAxis[0].title.text));
  const [yAxisTitle, setYAxisTitle] = React.useState(removeHTML(graphConfig && graphConfig.yAxis && graphConfig.yAxis.title.text));

  // const [selectedAngleOfLabel, setSelectedAngleOfLabel] = React.useState('horizontal')
  const [selectedYAxisFontFamily, setSelectedYAxisFontFamily] = React.useState('roboto')
  const [yAxisFontSize, setYAxisFontSize] = React.useState('auto')
  const [yAxisFormats, setYAxisFormats] = React.useState(() => ['']);
  const [selectedYAngleOfLabel, setSelectedYAngleOfLabel] = React.useState('0')

  const toggleYSetting = () => {
    if (YHeight == '0px') setYHeight('100%'); else setYHeight('0px');
    setYShow(!YShow)
  }

  // const handleYAxisTitleSave = (event) => {
  //   setYAxisTitle(event.target.value);
  //   let newConfig = getGraphConfigs();
  //   newConfig['yAxis'][0]['title']["text"] = `<span style="cursor:pointer;" id="custom-y-axis-title"> ${event.target.value} </span>`
  //   setGraphConfigs(newConfig)
  // };

  const handleYAxisTitleChange = (event) => {
    setYAxisTitle(event.target.value);
    let newConfig = getGraphConfigs();
    newConfig['yAxis']['title']["text"] = `<span style="cursor:pointer;" id="custom-y-axis-title"> ${event.target.value} </span>`
    setGraphConfigs(newConfig)
  };

  const handleYAxisTitleFontFamilyChange = (event) => {
    const {value} = event.target;
    setSelectedYAxisFontFamily(value);
    let newConfig = getGraphConfigs();
    let legendStyle = newConfig['yAxis']['title']['style'] || {};
    legendStyle["fontFamily"] = fontFamily.find(e => e.value === value).title
    newConfig['yAxis']['title']['style'] = legendStyle;
    setGraphConfigs(newConfig);
  }

  const handleYAxisFontSizeChange = (event) => {
    const {value} = event.target;
    setYAxisFontSize(value);
    let newConfig = getGraphConfigs();
    let yAxisStyle = newConfig['yAxis']['title']['style'] || {};
    yAxisStyle["fontSize"] = value === "auto" ? "12px" : value + 'px';
    newConfig['yAxis']['title']['style'] = yAxisStyle;
    setGraphConfigs(newConfig);
  }

  const handleYAxisFormat = (event, newFormats) => {
    setYAxisFormats(newFormats);
    let newConfig = getGraphConfigs();
    let yAxisStyle = newConfig['yAxis']['title']['style'] || {};
    yAxisStyle["fontWeight"] = newFormats.includes("bold") ? "bold" : "normal";
    yAxisStyle["fontStyle"] = newFormats.includes("italic") ? "italic" : "normal";
    newConfig['yAxis']['title']['style'] = yAxisStyle;
    setGraphConfigs(newConfig);
  }

  const handleYAxisTitleName = (event) => {
    const {value} = event.target;
    // setXAxisTitleName(value);
    let newConfig = getGraphConfigs();
    newConfig["yAxis"]["title"]["enabled"] = value === "on"
    setGraphConfigs(newConfig);
  }

  const handleGridLineWidthForXAxis = (event, newGridLineWidth) => {
    let newConfig = getGraphConfigs();
    newConfig["xAxis"]["gridLineWidth"] = Number(newGridLineWidth[0])
    setGraphConfigs(newConfig);
  }

  const handleYAxisGridLine = (event) => {
    const {value} = event.target;
    let newConfig = getGraphConfigs();
    newConfig["yAxis"]["gridLineWidth"] = value === "on" ? 1 : 0
    setGraphConfigs(newConfig);
  }

  const handleGridLineWidthForYAxis = (event, newGridLineWidth) => {
    let newConfig = getGraphConfigs();
    newConfig["yAxis"]["gridLineWidth"] = Number(newGridLineWidth[0])
    setGraphConfigs(newConfig);
  }

  const handleYAxisAngleOfLabel = (event) => {
    const {value} = event.target;
    setSelectedYAngleOfLabel(value);
    let newConfig = getGraphConfigs();
    let yAxisAngel = newConfig['yAxis']['labels']['rotation'] || {};
    yAxisAngel = value === "horizontal" ? Number("0") : Number(value);
    newConfig['yAxis']['labels']['rotation'] = yAxisAngel;
    setGraphConfigs(newConfig);
  }
  return (
      <Accordion expanded={expanedState} onChange={(event, expandedState) => setTabState('axis', expandedState)}>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
            aria-controls="panel2a-content"
            id="panel2a-header"
        >
          <Typography className='AccordTitle'><img src={Axis}/>Axis</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} className={'alignCenter'}>
            <Grid item xs={6}>
              <Typography>Inverted Axis</Typography>
            </Grid>
            <Grid item xs={6} className={'SwitchIcon'}>
              <Switch
                  checked={invertAxis}
                  onChange={handleChartInvertAxis}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <div className={'customGridTitle'}>
                <div className={'LeftTitle'}>
                  <FormHelperText id="title-text">Axis X</FormHelperText>
                  {/*<SelectComponent menu={position} />*/}
                  <OutlinedInput
                      placeholder="Enter your Axis X..."
                      id="titleText"
                      aria-describedby="axisx-title-text"
                      inputProps={{
                        'aria-label': 'title',
                      }}
                      value={xAxisTitle}
                      // onBlur={handleXAxisTitleSave}
                      onChange={handleXAxisTitleChange}
                  />
                </div>
                <div className={'settingToggle'}>
                  {
                    Show ? <img src={SettingToggle} onClick={toggleXSetting}/>
                        : <img src={SettingNotActive} onClick={toggleXSetting}/>
                  }
                </div>
              </div>
            </Grid>
          </Grid>

          <div style={{height: Height, overflow: Show ? 'visible' : 'hidden'}}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div className={'customGridhalf'}>
                  <div className={'leftGrid'}>
                    <FormHelperText id="title-text">Axis X Font</FormHelperText>
                    <SelectComponent
                        menu={fontFamily}
                        menuValue={selectedFontFamily}
                        handleChange={handleXAxisTitleFontFamilyChange}
                    />
                  </div>
                  <div className={'rightGrid'}>
                    <FormHelperText id="title-text">Axis X Font size</FormHelperText>
                    <SelectComponent
                        menu={fontsize}
                        menuValue={xAxisFontSize}
                        handleChange={handlexAxisFontSizeChange}
                    />
                  </div>
                  <div className={'blankSpace'}></div>
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div className={'customGridhalf'}>
                  <div className={'leftGrid'}>
                    <FormHelperText id="title-text">Axis format</FormHelperText>
                    <Paper
                        elevation={0}
                        style={{
                          display: 'flex',
                          border: '1px solid #dedede',
                          width: 'calc(100% - 15px)'
                        }}
                    >
                      <StyledToggleButtonGroup
                          size="small"
                          value={formats}
                          onChange={handleXAxisFormat}
                          aria-label="text formatting"
                      >
                        <ToggleButton value="bold" aria-label="bold">
                          <FormatBoldIcon/>
                        </ToggleButton>
                        <ToggleButton value="italic" aria-label="italic">
                          <FormatItalicIcon/>
                        </ToggleButton>

                      </StyledToggleButtonGroup>
                    </Paper>
                  </div>
                  <div className={'rightGrid'}>
                    <FormHelperText id="title-text">Axis X text color</FormHelperText>
                    <div className={'colorPiker'}
                         style={{
                           width: 'calc(100% - 15px)'
                         }}>
                      <div className={'fixColors'}>
                        <div className={'ActiveColor'} style={{
                          'backgroundColor': graphConfig && graphConfig.xAxis && graphConfig.xAxis.title.style.color
                        }}/>
                        <Divider flexItem orientation="vertical" sx={{mx: 0.5, my: 1}}/>
                        <div className={'ColorVariation'}
                             style={{'backgroundColor': '#000000'}}
                             onClick={() => setXAxisColor("#000000")}
                        />
                        <div className={'ColorVariation'}
                             style={{'backgroundColor': '#FCD364'}}
                             onClick={() => setXAxisColor("#FCD364")}
                        />
                      </div>
                      <div className={'colorDropdown'}>
                        <button aria-describedby={xAxisTextColorId} type="button"
                                onClick={(e) => handleColorPickerOpen(e, "xAxisText")}>
                          Auto
                        </button>
                        <Popover
                            id={xAxisTextColorId}
                            open={colorPickerOpen["xAxisText"]}
                            anchorEl={colorPickerAnchorEl["xAxisText"]}
                            onClose={() => handleColorPickerClose("xAxisText")}
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
                              component={"xAxisTextColor"}
                              parentCallback={handleCallback}
                              usedColors={colorPickerColors["xAxisTextColor"]}
                          />
                        </Popover>
                      </div>
                    </div>
                  </div>
                  <div className={'blankSpace'}></div>
                </div>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div className={'customGridhalf'}>
                  <div className={'leftGrid'}>
                    <FormHelperText id="title-text">Axis name</FormHelperText>
                    <SelectComponent
                        menu={axisValue}
                        menuValue={graphConfig["xAxis"] && graphConfig["xAxis"]["title"]["enabled"] ? "on" : "off"}
                        handleChange={handleXAxisTitleName}
                    />
                  </div>
                  <div className={'rightGrid'}>
                    <FormHelperText id="title-text">Angle of label</FormHelperText>
                    <SelectComponent
                        menu={angleOfLabel}
                        menuValue={selectedAngleOfLabel}
                        handleChange={handleXAxisAngleOfLabel}
                    />
                  </div>
                  <div className={'blankSpace'}></div>
                </div>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div className={'customGridTitle'}>
                  <div className={'selectFullDropdown'}>
                    <FormHelperText id="title-text">Gridline</FormHelperText>
                    {console.log("graphConfig[xAxis]==>", graphConfig["xAxis"])}
                    <SelectComponent
                        menu={axisValue}
                        menuValue={graphConfig["xAxis"] && graphConfig["xAxis"]["gridLineWidth"] ? "on" : "off"}
                        handleChange={handleXAxisGridLine}
                    />
                  </div>
                </div>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div className={'customGridhalf'}>
                  <div className={'leftGrid'}>
                    <FormHelperText id="title-text">Gridline color</FormHelperText>
                    <div className={'colorPiker'}
                         style={{
                           width: 'calc(100% - 15px)',
                           pointerEvents: graphConfig["xAxis"] && graphConfig["xAxis"]["gridLineWidth"] ? "auto" : "none"
                         }}>
                      <div className={'fixColors'}>
                        <div
                            className={'ActiveColor'}
                            style={{'backgroundColor': graphConfig && graphConfig.xAxis && graphConfig.xAxis.gridLineColor}}

                        />
                        <Divider flexItem orientation="vertical" sx={{mx: 0.5, my: 1}}/>
                        <div
                            className={'ActiveColor'} style={{'backgroundColor': '#000000', 'marginRight': '5px'}}
                            onClick={() => setGridLineColor("x", "#000000")}
                        />
                        <div
                            className={'ActiveColor'} style={{'backgroundColor': '#FCD364'}}
                            onClick={() => setGridLineColor("x", "#FCD364")}
                        />
                      </div>
                      <div className={'colorDropdown'}>
                        <button aria-describedby={xAxisTextColorId} type="button"
                                onClick={(e) => handleColorPickerOpen(e, "xAxisGridLine")}>
                          Auto
                        </button>
                        <Popover
                            id={xAxisGridLineColorId}
                            open={colorPickerOpen["xAxisGridLine"]}
                            anchorEl={colorPickerAnchorEl["xAxisGridLine"]}
                            onClose={() => handleColorPickerClose("xAxisGridLine")}
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
                              component={"xAxisGridLineColor"}
                              parentCallback={handleCallback}
                              usedColors={colorPickerColors["xAxisGridLineColor"]}
                          />
                        </Popover>
                      </div>
                    </div>
                  </div>
                  <div className={'rightGrid'}>
                    <FormHelperText id="title-text">Gridline width</FormHelperText>
                    <StyledToggleButtonGroup
                        size="small"
                        value={`${graphConfig && graphConfig.xAxis && graphConfig.xAxis.gridLineWidth}px`}
                        onChange={handleGridLineWidthForXAxis}
                        aria-label="gridLine width"
                        exclusive
                        className={'chartBorderLine'}
                    >
                      <ToggleButton value={"1px"} aria-label="1px"
                                    disabled={!(graphConfig["xAxis"] && graphConfig["xAxis"]["gridLineWidth"])}>
                        1px
                      </ToggleButton>
                      <ToggleButton value={"2px"} aria-label="2px"
                                    disabled={!(graphConfig["xAxis"] && graphConfig["xAxis"]["gridLineWidth"])}>
                        2px
                      </ToggleButton>
                      <ToggleButton value={"3px"} aria-label="3px"
                                    disabled={!(graphConfig["xAxis"] && graphConfig["xAxis"]["gridLineWidth"])}>
                        3px
                      </ToggleButton>
                      <ToggleButton value={"4px"} aria-label="4px"
                                    disabled={!(graphConfig["xAxis"] && graphConfig["xAxis"]["gridLineWidth"])}>
                        4px
                      </ToggleButton>
                    </StyledToggleButtonGroup>
                  </div>
                  <div className={'blankSpace'}></div>
                </div>
              </Grid>
            </Grid>
          </div>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <div className={'customGridTitle'}>
                <div className={'LeftTitle'}>
                  <FormHelperText id="title-text">Axis Y</FormHelperText>
                  <OutlinedInput
                      placeholder="Enter your Axis Y..."
                      id="titleText"
                      aria-describedby="axisy-title-text"
                      inputProps={{
                        'aria-label': 'title',
                      }}
                      value={yAxisTitle}
                      // onBlur={handleYAxisTitleSave}
                      onChange={handleYAxisTitleChange}
                  />
                </div>
                <div className={'settingToggle'}>
                  {
                    YShow ? <img src={SettingToggle} onClick={toggleYSetting}/>
                        : <img src={SettingNotActive} onClick={toggleYSetting}/>
                  }
                </div>
              </div>
            </Grid>
          </Grid>
          <div style={{height: YHeight, overflow: YShow ? 'visible' : 'hidden'}}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div className={'customGridhalf'}>
                  <div className={'leftGrid'}>
                    <FormHelperText id="title-text">Axis Y Font</FormHelperText>
                    <SelectComponent
                        menu={fontFamily}
                        menuValue={selectedYAxisFontFamily}
                        handleChange={handleYAxisTitleFontFamilyChange}
                    />
                  </div>
                  <div className={'rightGrid'}>
                    <FormHelperText id="title-text">Axis Y Font size</FormHelperText>
                    <SelectComponent
                        menu={fontsize}
                        menuValue={yAxisFontSize}
                        handleChange={handleYAxisFontSizeChange}
                    />
                  </div>
                  <div className={'blankSpace'}></div>
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div className={'customGridhalf'}>
                  <div className={'leftGrid'}>
                    <FormHelperText id="title-text">Axis format</FormHelperText>
                    <Paper
                        elevation={0}
                        style={{
                          display: 'flex',
                          border: '1px solid #dedede',
                          width: 'calc(100% - 15px)'
                        }}
                    >
                      <StyledToggleButtonGroup
                          size="small"
                          value={yAxisFormats}
                          onChange={handleYAxisFormat}
                          aria-label="text formatting"
                      >
                        <ToggleButton value="bold" aria-label="bold">
                          <FormatBoldIcon/>
                        </ToggleButton>
                        <ToggleButton value="italic" aria-label="italic">
                          <FormatItalicIcon/>
                        </ToggleButton>

                      </StyledToggleButtonGroup>
                    </Paper>
                  </div>
                  <div className={'rightGrid'}>
                    <FormHelperText id="title-text">Axis Y text color</FormHelperText>
                    <div className={'colorPiker'}
                         style={{
                           width: 'calc(100% - 15px)'
                         }}>
                      <div className={'fixColors'}>
                        <div className={'ActiveColor'} style={{
                          'backgroundColor': graphConfig && graphConfig.yAxis && graphConfig.yAxis.title.style.color
                        }}/>
                        <Divider flexItem orientation="vertical" sx={{mx: 0.5, my: 1}}/>
                        <div className={'ColorVariation'}
                             style={{'backgroundColor': '#000000'}}
                             onClick={() => setYAxisColor("#000000")}
                        />
                        <div className={'ColorVariation'}
                             style={{'backgroundColor': '#FCD364'}}
                             onClick={() => setYAxisColor("#FCD364")}
                        />
                      </div>
                      <div className={'colorDropdown'}>
                        <button aria-describedby={xAxisTextColorId} type="button"
                                onClick={(e) => handleColorPickerOpen(e, "yAxisText")}>
                          Auto
                        </button>
                        <Popover
                            id={xAxisTextColorId}
                            open={colorPickerOpen["yAxisText"]}
                            anchorEl={colorPickerAnchorEl["yAxisText"]}
                            onClose={() => handleColorPickerClose("yAxisText")}
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
                              component={"yAxisTextColor"}
                              parentCallback={handleCallback}
                              usedColors={colorPickerColors["yAxisTextColor"]}
                          />
                        </Popover>
                      </div>
                    </div>
                  </div>
                  <div className={'blankSpace'}></div>
                </div>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div className={'customGridhalf'}>
                  <div className={'leftGrid'}>
                    <FormHelperText id="title-text">Axis name</FormHelperText>
                    <SelectComponent
                        menu={axisValue}
                        menuValue={graphConfig && graphConfig["yAxis"] && graphConfig["yAxis"]["title"]["enabled"] ? "on" : "off"}
                        handleChange={handleYAxisTitleName}
                    />
                  </div>
                  <div className={'rightGrid'}>
                    <FormHelperText id="title-text">Angle of label</FormHelperText>
                    <SelectComponent
                        menu={angleOfLabel}
                        menuValue={selectedYAngleOfLabel}
                        handleChange={handleYAxisAngleOfLabel}
                    />
                  </div>
                  <div className={'blankSpace'}></div>
                </div>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div className={'customGridTitle'}>
                  <div className={'selectFullDropdown'}>
                    <FormHelperText id="title-text">Major Gridline</FormHelperText>
                    <SelectComponent
                        menu={axisValue}
                        menuValue={graphConfig && graphConfig["yAxis"] && graphConfig["yAxis"]["gridLineWidth"] ? "on" : "off"}
                        handleChange={handleYAxisGridLine}
                    />
                  </div>
                </div>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div className={'customGridhalf'}>
                  <div className={'leftGrid'}>
                    <FormHelperText id="title-text">Gridline color</FormHelperText>
                    <div className={'colorPiker'}
                         style={{
                           width: 'calc(100% - 15px)',
                           pointerEvents: graphConfig["yAxis"] && graphConfig["yAxis"]["gridLineWidth"] ? "auto" : "none"
                         }}>
                      <div className={'fixColors'}>
                        <div
                            className={'ActiveColor'}
                            style={{'backgroundColor': graphConfig && graphConfig.yAxis && graphConfig.yAxis.gridLineColor}}

                        />
                        <Divider flexItem orientation="vertical" sx={{mx: 0.5, my: 1}}/>
                        <div
                            className={'ActiveColor'} style={{'backgroundColor': '#000000', 'marginRight': '5px'}}
                            onClick={() => setGridLineColor("y", "#000000")}
                        />
                        <div
                            className={'ActiveColor'} style={{'backgroundColor': '#FCD364'}}
                            onClick={() => setGridLineColor("y", "#FCD364")}
                        />
                      </div>
                      <div className={'colorDropdown'}>
                        <button aria-describedby={yAxisTextColorId} type="button"
                                onClick={(e) => handleColorPickerOpen(e, "yAxisGridLine")}>
                          Auto
                        </button>
                        <Popover
                            id={yAxisGridLineColorId}
                            open={colorPickerOpen["yAxisGridLine"]}
                            anchorEl={colorPickerAnchorEl["yAxisGridLine"]}
                            onClose={() => handleColorPickerClose("yAxisGridLine")}
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
                              component={"yAxisGridLineColor"}
                              parentCallback={handleCallback}
                              usedColors={colorPickerColors["yAxisGridLineColor"]}
                          />
                        </Popover>
                      </div>
                    </div>
                  </div>
                  <div className={'rightGrid'}>
                    <FormHelperText id="title-text">Gridline width</FormHelperText>
                    <StyledToggleButtonGroup
                        size="small"
                        value={`${graphConfig && graphConfig.yAxis && graphConfig.yAxis.gridLineWidth}px`}
                        onChange={handleGridLineWidthForYAxis}
                        aria-label="gridLine width"
                        exclusive
                        className={'chartBorderLine'}
                    >
                      <ToggleButton value={"1px"} aria-label="1px"
                                    disabled={!(graphConfig["yAxis"] && graphConfig["yAxis"]["gridLineWidth"])}>
                        1px
                      </ToggleButton>
                      <ToggleButton value={"2px"} aria-label="2px"
                                    disabled={!(graphConfig["yAxis"] && graphConfig["yAxis"]["gridLineWidth"])}>
                        2px
                      </ToggleButton>
                      <ToggleButton value={"3px"} aria-label="3px"
                                    disabled={!(graphConfig["yAxis"] && graphConfig["yAxis"]["gridLineWidth"])}>
                        3px
                      </ToggleButton>
                      <ToggleButton value={"4px"} aria-label="4px"
                                    disabled={!(graphConfig["yAxis"] && graphConfig["yAxis"]["gridLineWidth"])}>
                        4px
                      </ToggleButton>
                    </StyledToggleButtonGroup>
                  </div>
                  <div className={'blankSpace'}></div>
                </div>
              </Grid>
            </Grid>
          </div>


        </AccordionDetails>
      </Accordion>
  )
}
