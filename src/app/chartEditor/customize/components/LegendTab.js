import * as React from 'react';
import {Grid, Typography} from "@material-ui/core";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Legend from '../../../../assets/images/charteditor/Legend.png';
import SettingToggle from '../../../../assets/images/charteditor/setting.png'
import SettingNotActive from '../../../../assets/images/charteditor/settingNotActive.png'
import Switch from "@material-ui/core/Switch";
import FormHelperText from '@material-ui/core/FormHelperText';
import SelectComponent from "../../../components/select/Select";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import {styled} from '@material-ui/core/styles';
import Popover from "@material-ui/core/Popover";
import CustomColorPicker from "./CustomColorPicker";
import {setGraphConfig} from "../../../redux/slice/ChartEditorSlice";
import {useDispatch, useSelector} from "react-redux";
import {setRecentColorsForColorPicker} from "../../../redux/slice/ColorPickerSlice";
import {chartEditorEnum} from "../../../enums";

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
    title: "Rubik",
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
export default function LegendTab({expanedState, setTabState}) {
  // const switchlabel = { inputProps: { 'aria-label': 'Switch demo' } };
  const dispatch = useDispatch();
  let graphConfig = useSelector((state) => state.chart.graphConfig);
  let colorPickerColors = useSelector((state) => state.colorPicker);
  const [Height, setHeight] = React.useState('0px');
  const [Show, setShow] = React.useState(false);
  const [legendVisible, setLegendVisible] = React.useState(true);

  const [alignment, setAlignment] = React.useState('center');
  const [formats, setFormats] = React.useState(() => ['bold']);
  const [usedColors, setUsedColor] = React.useState([])
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false)
  const [currentColor, setCurrentColor] = React.useState('')

  const [selectedFontFamily, setSelectedFontFamily] = React.useState('roboto')
  const [legendPosition, setLegendPosition] = React.useState("top")
  const [legendFontSize, setLegendFontSize] = React.useState('auto')

  const handleLegendFormatting = (event, newFormats) => {
    setFormats(newFormats);
    let newConfig = JSON.parse(JSON.stringify(graphConfig));
    let legendStyle = newConfig['legend']['itemStyle'] || {};
    legendStyle["fontWeight"] = newFormats.includes("bold") ? "bold" : "normal";
    legendStyle["fontStyle"] = newFormats.includes("italic") ? "italic" : "normal";
    newConfig['legend']['itemStyle'] = legendStyle;
    dispatch(setGraphConfig(newConfig));
  };

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const toggleSetting = () => {
    if (Height === '0px') setHeight('100%'); else setHeight('0px');
    setShow(!Show)
  }
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true)
  };

  const id = 'legend-color-picker';

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false)
    usedColors.push(currentColor)
    dispatch(setRecentColorsForColorPicker({type: "legend", color: currentColor}));
    setColorLegends(currentColor)
  };

  const handleCallback = (childData) => {
    setCurrentColor(childData)
  }

  const handleChartLegendVisible = (event) => {
    setLegendVisible(event.target.checked);
    let newConfig = JSON.parse(JSON.stringify(graphConfig));
    newConfig['legend'] = {...chartEditorEnum.legendsDefaultProps}
    newConfig.legend.enabled = event.target.checked
    dispatch(setGraphConfig(newConfig));
  }

  const handleLegendFontFamilyChange = (event) => {
    const {value} = event.target;
    setSelectedFontFamily(value);
    let newConfig = JSON.parse(JSON.stringify(graphConfig));
    let legendStyle = newConfig['legend']['itemStyle'] || {};
    legendStyle["fontFamily"] = fontFamily.find(e => e.value === value).title
    newConfig['legend']['itemStyle'] = legendStyle;
    dispatch(setGraphConfig(newConfig));
  }

  const handleLegendPositionChange = (event) => {
    const {value} = event.target;
    setLegendPosition(value);
    let newConfig = JSON.parse(JSON.stringify(graphConfig));
    if (!("legend" in newConfig)) {
      newConfig['legend'] = {...chartEditorEnum.legendsDefaultProps}
    }
    newConfig.legend.verticalAlign = value
    dispatch(setGraphConfig(newConfig));
  }

  const handleLegendFontSizeChange = (event) => {
    const {value} = event.target;
    setLegendFontSize(value);
    let newConfig = JSON.parse(JSON.stringify(graphConfig));
    let legendStyle = newConfig['legend']['itemStyle'] || {};
    legendStyle["fontSize"] = value === "auto" ? "12px" : value + 'px';
    newConfig['legend']['itemStyle'] = legendStyle;
    dispatch(setGraphConfig(newConfig));
  }

  const handleLegendAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
    let newConfig = JSON.parse(JSON.stringify(graphConfig));
    let legend = newConfig['legend'] || {};
    legend["align"] = newAlignment;
    newConfig.legend = legend;
    dispatch(setGraphConfig(newConfig));
  };

  const setColorLegends = (color) => {
    let newConfig = JSON.parse(JSON.stringify(graphConfig));
    let style = newConfig["legend"]['itemStyle'] || {};
    style["color"] = color;
    newConfig['legend']['style'] = style;
    dispatch(setGraphConfig(newConfig));
  }

  return (
      <Accordion expanded={expanedState} onChange={(event, expandedState) => setTabState('legend', expandedState)}>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
            aria-controls="panel2a-content"
            id="panel2a-header"
        >
          <Typography className='AccordTitle'><img src={Legend}/>Legend</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} className={'alignCenter'}>
            <Grid item xs={6}>
              <Typography>Visible</Typography>
            </Grid>
            <Grid item xs={6} className={'SwitchIcon'}>
              <Switch
                  checked={legendVisible}
                  onChange={handleChartLegendVisible}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <div className={'customGridTitle'}>
                <div className={'selectFullDropdown'}>
                  <FormHelperText id="title-text">Position</FormHelperText>
                  <SelectComponent
                      menu={position}
                      menuValue={legendPosition}
                      handleChange={handleLegendPositionChange}/>
                </div>
                <div className={'settingToggle'}>
                  {
                    Show ? <img src={SettingToggle} onClick={toggleSetting}/>
                        : <img src={SettingNotActive} onClick={toggleSetting}/>
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
                    <FormHelperText id="title-text">Legend font</FormHelperText>
                    <SelectComponent
                        menu={fontFamily}
                        menuValue={selectedFontFamily}
                        handleChange={handleLegendFontFamilyChange}
                    />
                  </div>
                  <div className={'rightGrid'}>
                    <FormHelperText id="title-text">Legend font size</FormHelperText>
                    <SelectComponent
                        menu={fontsize}
                        menuValue={legendFontSize}
                        handleChange={handleLegendFontSizeChange}
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
                    <FormHelperText id="title-text">Legend format</FormHelperText>
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
                          onChange={handleLegendFormatting}
                          aria-label="text formatting"
                      >
                        <ToggleButton value="bold" aria-label="bold">
                          <FormatBoldIcon/>
                        </ToggleButton>
                        <ToggleButton value="italic" aria-label="italic">
                          <FormatItalicIcon/>
                        </ToggleButton>

                      </StyledToggleButtonGroup>

                      <Divider flexItem orientation="vertical" sx={{mx: 0.5, my: 1}}/>
                      <StyledToggleButtonGroup
                          size="small"
                          value={alignment}
                          exclusive
                          onChange={handleLegendAlignment}
                          aria-label="text alignment"
                      >
                        <ToggleButton value="left" aria-label="left aligned">
                          <FormatAlignLeftIcon/>
                        </ToggleButton>
                        <ToggleButton value="center" aria-label="centered">
                          <FormatAlignCenterIcon/>
                        </ToggleButton>
                        <ToggleButton value="right" aria-label="right aligned">
                          <FormatAlignRightIcon/>
                        </ToggleButton>
                      </StyledToggleButtonGroup>
                    </Paper>
                  </div>
                  <div className={'rightGrid'}>
                    <FormHelperText id="title-text">Legend text color</FormHelperText>
                    <div className={'colorPiker'}
                         style={{
                           width: 'calc(100% - 15px)'
                         }}>
                      <div className={'fixColors'}>
                        <div className={'ActiveColor'} style={{
                          'backgroundColor': graphConfig.legend.itemStyle.color
                        }}/>
                        <Divider flexItem orientation="vertical" sx={{mx: 0.5, my: 1}}/>
                        <div className={'ColorVariation'}
                             style={{'backgroundColor': '#000000'}}
                             onClick={() => setColorLegends("#000000")}
                        />
                        <div className={'ColorVariation'}
                             style={{'backgroundColor': '#FCD364'}}
                             onClick={() => setColorLegends("#FCD364")}
                        />
                      </div>
                      <div className={'colorDropdown'}>
                        <button aria-describedby={id} type="button"
                                onClick={(e) => handleClick(e)}>
                          Auto
                        </button>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={() => handleClose()}
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
                              component={"legend"}
                              parentCallback={handleCallback}
                              usedColors={colorPickerColors["legend"]}
                          />
                        </Popover>
                      </div>
                    </div>
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