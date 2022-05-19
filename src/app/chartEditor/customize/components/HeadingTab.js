import * as React from 'react';
import {useState} from 'react';
import {Grid, Typography} from "@material-ui/core";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import HeadingIcon from '../../../../assets/images/charteditor/Heading.png';
import SettingToggle from '../../../../assets/images/charteditor/setting.png'
import SettingNotActive from '../../../../assets/images/charteditor/settingNotActive.png'
import Switch from "@material-ui/core/Switch";
import FormHelperText from '@material-ui/core/FormHelperText';
import OutlinedInput from '@material-ui/core/OutlinedInput';
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
import CustomColorPicker from "./CustomColorPicker";
import Popover from '@material-ui/core/Popover';
import {useDispatch, useSelector} from "react-redux";
import {setGraphConfig} from "../../../redux/slice/ChartEditorSlice";
import {setRecentColorsForColorPicker} from "../../../redux/slice/ColorPickerSlice";
import {removeHTML, updateCustomizeTab} from "../../../_helpers/eventHelper";

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


export default function Heading({expanedState, setTabState, pieConfig, setPieConfig}) {

  const dispatch = useDispatch();
  let graphConfig = useSelector((state) => state.chart.graphConfig);
  let generalChartType = useSelector((state) => state.chart.generalChartType);
  let colorPickerColors = useSelector((state) => state.colorPicker);
  const [selectedQuestions, setSelectedQuestions] = React.useState([]);

  const [Height, setHeight] = React.useState('0px');
  const [Show, setShow] = React.useState(false);
  const [headingVisible, setHeadingVisible] = React.useState(false);
  const [headingText, setHeadingText] = useState(removeHTML(graphConfig && graphConfig.title && graphConfig.title.text))
  const [alignment, setAlignment] = React.useState('center');
  const [formats, setFormats] = React.useState(() => ['']);
  const [currentColor, setCurrentColor] = React.useState('')
  const [selectedFontSize, setSelectedFontSize] = React.useState('auto')
  const [selectedFontFamily, setSelectedFontFamily] = React.useState('roboto')
  const [titleColorPickerAnchorEl, setTitleColorPickerAnchorEl] = React.useState(null);
  const [subTitleColorPickerAnchorEl, setSubTitleColorPickerAnchorEl] = React.useState(null);
  const [titleColorPickerOpen, setTitleColorPickerOpen] = React.useState(false)
  const [subTitleColorPickerOpen, setSubTitleColorPickerOpen] = React.useState(false)
  const [selectedSubFontFamily, setSelectedSubFontFamily] = React.useState('roboto')
  const [subTitleSelectedFontSize, setsubTitleSelectedFontSize] = React.useState('auto')

  const [titleFont, settitleFont] = React.useState('');

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

  const handleChange = (event) => {
    settitleFont(event.target.value);
  };

  const toggleSetting = () => {
    if (Height == '0px') setHeight('100%'); else setHeight('0px');
    setShow(!Show)
  }


  /*Sub Title*/
  const [SubHeight, subsetHeight] = React.useState('0px');
  const [SubShow, subsetShow] = React.useState(false);

  const [subAlignment, subSetAlignment] = React.useState('center');
  const [subformats, subsetFormats] = React.useState(() => ['']);
  const [subHeadingText, setSubHeadingText] = useState(removeHTML(graphConfig && graphConfig.subtitle && graphConfig.subtitle.text))
  const subhandleFormat = (
      event,
      newSubFormats,
  ) => {
    subsetFormats(newSubFormats);
  };

  const subhandleAlignment = (
      event,
      newSubAlignment,
  ) => {
    subSetAlignment(newSubAlignment);
  };

  const subtoggleSetting = () => {
    if (SubHeight == '0px') subsetHeight('100%'); else subsetHeight('0px');
    subsetShow(!SubShow)
  }

  const handlePopoverClick = (event, component) => {
    if (component === "title") {
      setTitleColorPickerAnchorEl(event.currentTarget);
      setTitleColorPickerOpen(true)
    }
    if (component === "subtitle") {
      setSubTitleColorPickerAnchorEl(event.currentTarget);
      setSubTitleColorPickerOpen(true)
    }
  };

  const titleColorPickerId = 'title-color-picker';
  const subTitleColorPickerId = 'subtitle-color-picker';


  const setColorForGraph = (component, color) => {
    let newConfig = getGraphConfigs();
    let style = newConfig[component]['style'] || {};
    style["color"] = color;
    newConfig[component]['style'] = style;
    setGraphConfigs(newConfig);
  }

  const handleClose = (component) => {
    if (component === "title") {
      setTitleColorPickerAnchorEl(null);
      setTitleColorPickerOpen(false)
    }
    if (component === "subtitle") {
      setSubTitleColorPickerAnchorEl(null);
      setSubTitleColorPickerOpen(false)
    }
    dispatch(setRecentColorsForColorPicker({type: component, color: currentColor}));
    setColorForGraph(component, currentColor)
  };

  const handleCallback = (childData) => {
    setCurrentColor(childData)
  }

  const handleTitleSave = (event) => {
    setHeadingText(event.target.value);
    let newConfig = getGraphConfigs();
    newConfig['title']['useHTML'] = true
    newConfig['title']["text"] = `<span style="cursor:pointer;" id="custom-title" onClick="` + updateCustomizeTab('heading') + `"> ` + event.target.value + ` </span>`;
    setGraphConfigs(newConfig)
  };

  const handleTitleChange = (event) => {
    setHeadingText(event.target.value);
    let newConfig = getGraphConfigs();
    newConfig['title']['useHTML'] = true
    newConfig['title']["text"] = `<span style="cursor:pointer;" id="custom-title" onClick="` + updateCustomizeTab('heading') + `"> ` + event.target.value + ` </span>`;
    setGraphConfigs(newConfig)
  };

  const handleTitleFontSizeChange = (event) => {
    setSelectedFontSize(event.target.value);
    let newConfig = getGraphConfigs();
    let titleStyle = newConfig['title']['style'] || {};
    titleStyle["fontSize"] = event.target.value === "auto" ? "18px" : event.target.value + 'px'
    newConfig['title']['style'] = titleStyle;
    setGraphConfigs(newConfig);
  }

  const handleTitleFontFamilyChange = (event) => {
    setSelectedFontFamily(event.target.value);
    let newConfig = getGraphConfigs();
    let titleStyle = newConfig['title']['style'] || {};
    let finalFontFamily = fontFamily.find(e => e.value === event.target.value).title;
    titleStyle["fontFamily"] = finalFontFamily
    newConfig['title']["style"] = titleStyle;
    setGraphConfigs(newConfig);
  }

  const handleChartHeadingVisible = (event) => {
    setHeadingVisible(event.target.checked);
    let newConfig = getGraphConfigs();
    if (event.target.checked) {
      setHeadingText("Chart Title");
      setSubHeadingText("Chart Subtitle")
      newConfig['title']['text'] = headingText ? headingText : '<span style="cursor:pointer;" id="custom-title">Chart Title</span>';
      newConfig['subtitle']['text'] = headingText ? headingText : '<span style="cursor:pointer;" id="custom-subtitle">Chart Subtitle</span>';
    } else {
      setHeadingText("");
      setSubHeadingText("")
      newConfig['title']['text'] = "";
      newConfig['subtitle']['text'] = "";
    }
    setGraphConfigs(newConfig);
  }

  const handleTitleFormatting = (event, newFormats,) => {
    setFormats(newFormats);
    let newConfig = getGraphConfigs();
    let titleStyle = newConfig['title']['style'] || {};
    titleStyle["fontWeight"] = newFormats.includes("bold") ? "bold" : "normal";
    titleStyle["fontStyle"] = newFormats.includes("italic") ? "italic" : "normal";
    newConfig['title']["style"] = titleStyle;
    setGraphConfigs(newConfig);
  };

  const handleTitleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
    let newConfig = getGraphConfigs();
    let title = newConfig['title'];
    title["align"] = newAlignment;
    newConfig.title = title;
    setGraphConfigs(newConfig);
  };

  /*For New Subtitle Start*/
  const subHandleTitleSave = (event) => {
    setSubHeadingText(event.target.value);
    let newConfig = getGraphConfigs();
    newConfig['subtitle']["text"] = `<span style="cursor:pointer;" id="custom-subtitle"> ` + event.target.value + ` </span>`;
    setGraphConfigs(newConfig)
  }
  /*For New Subtitle End*/

  const subHandleTitleChange = (event) => {
    setSubHeadingText(event.target.value);
    let newConfig = getGraphConfigs();
    newConfig['subtitle']["text"] = `<span style="cursor:pointer;" id="custom-subtitle"> ` + event.target.value + ` </span>`;
    setGraphConfigs(newConfig)
  }

  /*For Subtitle Font Family Start*/
  const handleSubTitleFontFamilyChange = (event) => {
    setSelectedSubFontFamily(event.target.value);
    let newConfig = getGraphConfigs();
    let subTitleStyle = newConfig['subtitle']['style'] || {};
    let finalSubFontFamily = fontFamily.find(e => e.value === event.target.value).title;
    subTitleStyle["fontFamily"] = finalSubFontFamily
    newConfig['subtitle']["style"] = subTitleStyle;
    setGraphConfigs(newConfig);
  }
  /*For Subtitle Font Family End*/

  /*For Subtitle Font Size Start*/
  const handleSubTitleFontSizeChange = (event) => {
    setsubTitleSelectedFontSize(event.target.value);
    let newConfig = getGraphConfigs();
    let subTitleStyle = newConfig['subtitle']['style'] || {};
    subTitleStyle["fontSize"] = event.target.value === "auto" ? "18px" : event.target.value + 'px'
    newConfig['subtitle']['style'] = subTitleStyle;
    setGraphConfigs(newConfig);
  }
  /*For Subtitle Font Size End*/

  /*For Subtitle Style Like Bold, Italic Start*/
  const handleSubTitleFormatting = (event, newSubFormats,) => {
    subsetFormats(newSubFormats);
    let newConfig = getGraphConfigs();
    let titleStyle = newConfig['subtitle']['style'] || {};
    titleStyle["fontWeight"] = newSubFormats.includes("bold") ? "bold" : "normal";
    titleStyle["fontStyle"] = newSubFormats.includes("italic") ? "italic" : "normal";
    newConfig['subtitle']["style"] = titleStyle;
    setGraphConfigs(newConfig);
  };
  /*For Subtitle Style Like Bold, Italic End*/

  const handleSubTitleAlignment = (event, newSubAlignment) => {
    subSetAlignment(newSubAlignment);
    let newConfig = getGraphConfigs();
    let subTitle = newConfig['subtitle'];
    subTitle["align"] = newSubAlignment;
    newConfig.subtitle = subTitle;
    setGraphConfigs(newConfig);
  };

  return (
      <Accordion expanded={expanedState} onChange={(event, expandedState) => setTabState('heading', expandedState)}>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
            aria-controls="panel2a-content"
            id="panel2a-header"
        >
          <Typography className='AccordTitle'><img src={HeadingIcon}/>Heading</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} className={'alignCenter'}>
            <Grid item xs={6}>
              <Typography>Visible</Typography>
            </Grid>
            <Grid item xs={6} className={'SwitchIcon'}>
              <Switch
                  checked={headingVisible}
                  onChange={handleChartHeadingVisible}/>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <div className={'customGridTitle'}>
                <div className={'LeftTitle'}>
                  <FormHelperText id="title-text">Title text</FormHelperText>
                  <OutlinedInput
                      placeholder="Enter your title text..."
                      id="titleText"
                      aria-describedby="title-text"
                      inputProps={{
                        'aria-label': 'title',
                      }}
                      value={headingText}
                      // onBlur={handleTitleSave}
                      onChange={handleTitleChange}
                  />
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
                    <FormHelperText id="title-text">Title font</FormHelperText>
                    <SelectComponent
                        menu={fontFamily}
                        menuValue={selectedFontFamily}
                        handleChange={handleTitleFontFamilyChange}/>
                  </div>
                  <div className={'rightGrid'}>
                    <FormHelperText id="title-text">Title font size</FormHelperText>
                    <SelectComponent
                        menu={fontsize}
                        menuValue={selectedFontSize}
                        handleChange={handleTitleFontSizeChange}
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
                    <FormHelperText id="title-text">Title format</FormHelperText>
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
                          onChange={handleTitleFormatting}
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
                          onChange={handleTitleAlignment}
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
                    <FormHelperText id="title-text">Title text color</FormHelperText>
                    <div className={'colorPiker'}
                         style={{
                           width: 'calc(100% - 15px)'
                         }}>
                      <div className={'fixColors'}>
                        <div className={'ActiveColor'} style={{
                          'backgroundColor': graphConfig.title && graphConfig.title.style.color
                        }}/>
                        <Divider flexItem orientation="vertical" sx={{mx: 0.5, my: 1}}/>
                        <div className={'ColorVariation'}
                             style={{'backgroundColor': '#000000'}}
                             onClick={() => setColorForGraph("title", "#000000")}
                        />
                        <div className={'ColorVariation'}
                             style={{'backgroundColor': '#FCD364'}}
                             onClick={() => setColorForGraph("title", "#FCD364")}
                        />
                      </div>
                      <div className={'colorDropdown'}>
                        <button aria-describedby={titleColorPickerId} type="button"
                                onClick={(e) => handlePopoverClick(e, "title")}>
                          Auto
                        </button>
                        <Popover
                            id={titleColorPickerId}
                            open={titleColorPickerOpen}
                            anchorEl={titleColorPickerAnchorEl}
                            onClose={() => handleClose("title")}
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
                              component={"title"}
                              parentCallback={handleCallback}
                              usedColors={colorPickerColors["title"]}
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

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <div className={'customGridTitle'}>
                <div className={'LeftTitle'}>
                  <FormHelperText id="title-text">Subtitle text</FormHelperText>
                  <OutlinedInput
                      placeholder="Enter your subtitle text..."
                      id="subtitleText"
                      aria-describedby="subtitle-text"
                      inputProps={{
                        'aria-label': 'subtitle',
                      }}
                      value={subHeadingText}
                      // onBlur={subHandleTitleSave}
                      onChange={subHandleTitleChange}
                  />
                </div>
                <div className={'settingToggle'}>
                  {
                    SubShow ? <img src={SettingToggle} onClick={subtoggleSetting}/>
                        : <img src={SettingNotActive} onClick={subtoggleSetting}/>
                  }
                </div>
              </div>
            </Grid>
          </Grid>

          <div style={{height: SubHeight, overflow: SubShow ? 'visible' : 'hidden'}}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div className={'customGridhalf'}>
                  <div className={'leftGrid'}>
                    <FormHelperText id="title-text">Subtitle font</FormHelperText>
                    <SelectComponent
                        menu={fontFamily}
                        menuValue={selectedSubFontFamily}
                        handleChange={handleSubTitleFontFamilyChange}
                    />
                  </div>
                  <div className={'rightGrid'}>
                    <FormHelperText id="title-text">Subtitle font size</FormHelperText>
                    <SelectComponent
                        menu={fontsize}
                        menuValue={subTitleSelectedFontSize}
                        handleChange={handleSubTitleFontSizeChange}
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
                    <FormHelperText id="title-text">Subtitle format</FormHelperText>
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
                          value={subformats}
                          onChange={handleSubTitleFormatting}
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
                          value={subAlignment}
                          exclusive
                          onChange={handleSubTitleAlignment}
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
                    <FormHelperText id="title-text">Subtitle text color</FormHelperText>
                    <div className={'colorPiker'}
                         style={{
                           width: 'calc(100% - 15px)'
                         }}>
                      <div className={'fixColors'}>
                        <div className={'ActiveColor'} style={{
                          'backgroundColor': graphConfig.subtitle && graphConfig.subtitle.style.color
                        }}></div>
                        <Divider flexItem orientation="vertical" sx={{mx: 0.5, my: 1}}/>
                        <div className={'ColorVariation'}
                             style={{'backgroundColor': '#000000'}}
                             onClick={() => setColorForGraph("subtitle", "#000000")}
                        />
                        <div className={'ColorVariation'}
                             style={{'backgroundColor': '#FCD364'}}
                             onClick={() => setColorForGraph("subtitle", "#FCD364")}
                        />
                      </div>
                      <div className={'colorDropdown'}>
                        <button aria-describedby={subTitleColorPickerId} type="button"
                                onClick={(e) => handlePopoverClick(e, "subtitle")}>
                          Auto
                        </button>
                        <Popover
                            id={subTitleColorPickerId}
                            open={subTitleColorPickerOpen}
                            anchorEl={subTitleColorPickerAnchorEl}
                            onClose={() => handleClose("subtitle")}
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
                              component={"subtitle"}
                              parentCallback={handleCallback}
                              usedColors={colorPickerColors["subtitle"]}/>
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