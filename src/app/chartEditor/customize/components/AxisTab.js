import * as React from 'react';
import { Grid, Typography } from "@material-ui/core";
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
import { styled } from '@material-ui/core/styles';
import CustomColorPicker from "./CustomColorPicker";
import Divider from "@material-ui/core/Divider";
import Popover from "@material-ui/core/Popover";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import {chartEditorEnum} from "../../../enums";
import {setGraphConfig} from "../../../redux/slice/ChartEditorSlice";
import {useDispatch, useSelector} from "react-redux";


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

let angleofLabel = [
    {
        title: "Horizontal",
        value: "horizontal",
        key: 1,
    },
    {
        title: "Left diagonal",
        value: "left_diagonal",
        key: 2,
    },
    {
        title: "Right vertical",
        value: "right_vertical",
        key: 3,
    },
    {
        title: "Right diagonal",
        value: "right_diagonal",
        key: 4,
    },
    {
        title: "Left vertical",
        value: "left_vertical",
        key: 5,
    },
];

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
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
    const dispatch = useDispatch();
    let graphConfig = useSelector((state) => state.chart.graphConfig);
    const [selectedQuestions, setSelectedQuestions] = React.useState([]);
    const switchlabel = { inputProps: { 'aria-label': 'Switch demo' } };

    const [Height, setHeight] = React.useState('0px');
    const [Show, setShow] = React.useState(false);

    const [alignment, setAlignment] = React.useState('center');
    const [formats, setFormats] = React.useState(() => ['']);
    const [usedColors,setUsedColor] = React.useState([])
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open,setOpen] = React.useState(false)
    const [currentColor, setCurrentColor]= React.useState('')

    const [invertAxis, setInvertAxis] = React.useState(graphConfig.chart.inverted);
    const [xAxisTitle, setXAxisTitle] = React.useState(graphConfig.chart.inverted);

    const handleFormat = (
        event: React.MouseEvent<HTMLElement>,
        newFormats: string[],
    ) => {
        setFormats(newFormats);
    };

    const handleAlignment = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string,
    ) => {
        setAlignment(newAlignment);
    };

    const toggleXSetting = () => {
        if (Height == '0px') setHeight('100%'); else setHeight('0px');
        setShow(!Show)
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen(true)
    };

    const id = 'transitions-popper';

    const handleClose = () => {
        setAnchorEl(null);
        setOpen(false)
        usedColors.push(currentColor)
    };

    const handleCallback = (childData) =>{
        setCurrentColor(childData)
    }

    const handleChartInvertAxis = (event) => {
        setInvertAxis(event.target.checked);
        let newConfig = JSON.parse(JSON.stringify(graphConfig));
        newConfig['chart']['inverted'] = event.target.checked
        console.log("Checked Event",newConfig)
        dispatch(setGraphConfig(newConfig));
    }

    /*Y Axis*/
    const [YHeight, setYHeight] = React.useState('0px');
    const [YShow, setYShow] = React.useState(false);

    const toggleYSetting = () => {
        if (YHeight == '0px') setYHeight('100%'); else setYHeight('0px');
        setYShow(!YShow)
    }

    return(
        <Accordion expanded={expanedState} onChange={(event, expandedState) => setTabState('axis', expandedState)}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
            >
                <Typography className='AccordTitle'><img src={Axis} />Axis</Typography>
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
                                    id="titleText"
                                    aria-describedby="axisx-title-text"
                                    inputProps={{
                                        'aria-label': 'title',
                                    }}
                                    // value={headingText}
                                    // onBlur={handleTitleSave}
                                    // onChange={handleTitleChange}
                                />
                            </div>
                            <div className={'settingToggle'}>
                                {
                                    Show ? <img src={SettingToggle} onClick={toggleXSetting} />
                                        : <img src={SettingNotActive} onClick={toggleXSetting} />
                                }
                            </div>
                        </div>
                    </Grid>
                </Grid>

                <div style={{ height: Height, overflow: Show ? 'visible' : 'hidden' }} >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <div className={'customGridhalf'}>
                                <div className={'leftGrid'}>
                                    <FormHelperText id="title-text">Axis X Font</FormHelperText>
                                    <SelectComponent menu={fontFamily} />
                                </div>
                                <div className={'rightGrid'}>
                                    <FormHelperText id="title-text">Axis X Font size</FormHelperText>
                                    <SelectComponent menu={fontsize} />
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
                                            border: '1px solid #E8E8E8',
                                            width: 'calc(100% - 30px)'
                                        }}
                                    >
                                        <StyledToggleButtonGroup
                                            size="small"
                                            value={formats}
                                            onChange={handleFormat}
                                            aria-label="text formatting"
                                        >
                                            <ToggleButton value="bold" aria-label="bold">
                                                <FormatBoldIcon />
                                            </ToggleButton>
                                            <ToggleButton value="italic" aria-label="italic">
                                                <FormatItalicIcon />
                                            </ToggleButton>

                                        </StyledToggleButtonGroup>                                        
                                    </Paper>
                                </div>
                                <div className={'rightGrid'}>
                                    <FormHelperText id="title-text">Axis X text color</FormHelperText>
                                    <div className={'colorPiker'}
                                         style={{
                                             width: 'calc(100% - 30px)'
                                         }}>
                                        <div className={'fixColors'}>
                                            <div className={'ActiveColor'} style={{'backgroundColor':'#28B5A6'}}></div>
                                            <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
                                            <div className={'ColorVariation'} style={{'backgroundColor':'#000000'}}></div>
                                            <div className={'ColorVariation'} style={{'backgroundColor':'#FCD364'}}></div>
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
                                                style={{height:'auto'}}
                                            >
                                                <CustomColorPicker parentCallback = {handleCallback} usedColors={usedColors}></CustomColorPicker>
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
                                    <SelectComponent menu={axisValue} />
                                </div>
                                <div className={'rightGrid'}>
                                    <FormHelperText id="title-text">Angle of label</FormHelperText>
                                    <SelectComponent menu={angleofLabel} />
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
                                    <SelectComponent menu={axisValue} />
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
                                             width: 'calc(100% - 30px)'
                                         }}>
                                        <div className={'fixColors'}>
                                            <div className={'ActiveColor'} style={{'backgroundColor':'#28B5A6'}}></div>
                                            <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
                                            <div className={'ColorVariation'} style={{'backgroundColor':'#000000'}}></div>
                                            <div className={'ColorVariation'} style={{'backgroundColor':'#FCD364'}}></div>
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
                                                style={{height:'auto'}}
                                            >
                                                <CustomColorPicker parentCallback = {handleCallback} usedColors={usedColors}></CustomColorPicker>
                                            </Popover>
                                        </div>
                                    </div>
                                </div>
                                <div className={'rightGrid'}>
                                    <FormHelperText id="title-text">Gridline width</FormHelperText>
                                    <div className={'axisbox'}>
                                        <Typography style={{'color': '#28B5A6','cursor':'pointer'}}>1px</Typography>
                                        <Divider orientation="vertical" variant="middle" flexItem className={'bgDivider'}/>
                                        <div className={'widthValue'}>
                                            <Typography className={'widthDecimal'}>2px</Typography>
                                            <Typography className={'widthDecimal'}>3px</Typography>
                                            <Typography className={'widthDecimal'}>4px</Typography>
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
                                <FormHelperText id="title-text">Axis Y</FormHelperText>
                                <OutlinedInput
                                    id="titleText"
                                    aria-describedby="axisx-title-text"
                                    inputProps={{
                                        'aria-label': 'title',
                                    }}
                                    // value={headingText}
                                    // onBlur={handleTitleSave}
                                    // onChange={handleTitleChange}
                                />
                            </div>
                            <div className={'settingToggle'}>
                                {
                                    YShow ? <img src={SettingToggle} onClick={toggleYSetting} />
                                        : <img src={SettingNotActive} onClick={toggleYSetting} />
                                }
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <div style={{ height: YHeight, overflow: YShow ? 'visible' : 'hidden' }} >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <div className={'customGridhalf'}>
                                <div className={'leftGrid'}>
                                    <FormHelperText id="title-text">Axis Y Font</FormHelperText>
                                    <SelectComponent menu={fontFamily} />
                                </div>
                                <div className={'rightGrid'}>
                                    <FormHelperText id="title-text">Axis Y Font size</FormHelperText>
                                    <SelectComponent menu={fontsize} />
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
                                            border: '1px solid #E8E8E8',
                                            width: 'calc(100% - 30px)'
                                        }}
                                    >
                                        <StyledToggleButtonGroup
                                            size="small"
                                            value={formats}
                                            onChange={handleFormat}
                                            aria-label="text formatting"
                                        >
                                            <ToggleButton value="bold" aria-label="bold">
                                                <FormatBoldIcon />
                                            </ToggleButton>
                                            <ToggleButton value="italic" aria-label="italic">
                                                <FormatItalicIcon />
                                            </ToggleButton>

                                        </StyledToggleButtonGroup>                                        
                                    </Paper>
                                </div>
                                <div className={'rightGrid'}>
                                    <FormHelperText id="title-text">Axis Y text color</FormHelperText>
                                    <div className={'colorPiker'}
                                         style={{
                                             width: 'calc(100% - 30px)'
                                         }}>
                                        <div className={'fixColors'}>
                                            <div className={'ActiveColor'} style={{'backgroundColor':'#28B5A6'}}></div>
                                            <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
                                            <div className={'ColorVariation'} style={{'backgroundColor':'#000000'}}></div>
                                            <div className={'ColorVariation'} style={{'backgroundColor':'#FCD364'}}></div>
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
                                                style={{height:'auto'}}
                                            >
                                                <CustomColorPicker parentCallback = {handleCallback} usedColors={usedColors}></CustomColorPicker>
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
                                    <SelectComponent menu={axisValue} />
                                </div>
                                <div className={'rightGrid'}>
                                    <FormHelperText id="title-text">Angle of label</FormHelperText>
                                    <SelectComponent menu={angleofLabel} />
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
                                    <SelectComponent menu={axisValue} />
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
                                             width: 'calc(100% - 30px)'
                                         }}>
                                        <div className={'fixColors'}>
                                            <div className={'ActiveColor'} style={{'backgroundColor':'#28B5A6'}}></div>
                                            <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
                                            <div className={'ColorVariation'} style={{'backgroundColor':'#000000'}}></div>
                                            <div className={'ColorVariation'} style={{'backgroundColor':'#FCD364'}}></div>
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
                                                style={{height:'auto'}}
                                            >
                                                <CustomColorPicker parentCallback = {handleCallback} usedColors={usedColors}></CustomColorPicker>
                                            </Popover>
                                        </div>
                                    </div>
                                </div>
                                <div className={'rightGrid'}>
                                    <FormHelperText id="title-text">Gridline width</FormHelperText>
                                    <div className={'axisbox'}>
                                        <Typography style={{'color': '#28B5A6','cursor':'pointer'}}>1px</Typography>
                                        <Divider orientation="vertical" variant="middle" flexItem className={'bgDivider'}/>
                                        <div className={'widthValue'}>
                                            <Typography className={'widthDecimal'}>2px</Typography>
                                            <Typography className={'widthDecimal'}>3px</Typography>
                                            <Typography className={'widthDecimal'}>4px</Typography>
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