import * as React from 'react';
import {Grid, Typography} from "@material-ui/core";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Appearance from '../../../../assets/images/charteditor/Appearance.png';
import Transparent from '../../../../assets/images/charteditor/Transparent.png';
import FormHelperText from '@material-ui/core/FormHelperText';
import Divider from '@material-ui/core/Divider';
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import Button from "@material-ui/core/Button";
import CustomColorPicker from "./CustomColorPicker";
import Popover from "@material-ui/core/Popover";
import {setRecentColorsForColorPicker} from "../../../redux/slice/ColorPickerSlice";
import {useDispatch, useSelector} from "react-redux";
import {setGraphConfig} from "../../../redux/slice/ChartEditorSlice";
import IconButton from "@material-ui/core/IconButton";
import ToggleButton from "@material-ui/lab/ToggleButton";
import FormatBoldIcon from "@material-ui/icons/FormatBold";
import FormatItalicIcon from "@material-ui/icons/FormatItalic";
import {styled} from "@material-ui/core/styles";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

function ValueLabelComponent(props) {
    const {children, open, value} = props;

    return (
        <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
            {children}
        </Tooltip>
    );
}


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

export default function AppearanceTab({expanedState, setTabState}) {
    const dispatch = useDispatch();
    let graphConfig = useSelector((state) => state.chart.graphConfig);
    let colorPickerColors = useSelector((state) => state.colorPicker);

    const [chartWidth, setChartWidth] = React.useState(500);
    const [chartHeight, setChartHeight] = React.useState(500);

    const [currentColor, setCurrentColor] = React.useState('')
    const [backgroundColorAnchorEl, setBackgroundColorAnchorEl] = React.useState(null);
    const [borderColorAnchorEl, setBorderColorAnchorEl] = React.useState(null);
    const [backgroundColorColorPickerOpen, setBackgroundColorColorPickerOpen] = React.useState(false)
    const [borderColorColorPickerOpen, setBorderColorColorPickerOpen] = React.useState(false)
    // const [borderWidth, setBorderWidth] = React.useState(graphConfig.chart.borderWidth.toString() + "px");

    const handleChangeWidth = (event, newValue) => {
        setChartWidth(newValue);
    };
    const handleChangeHeight = (event, newValue) => {
        setChartHeight(newValue);
    };
    const handleAutoClick = (type) => {
        if (type === 'width') {
            setChartWidth(500);
        }
        if (type === 'height') {
            setChartHeight(500);
        }
    }

    const handlePopoverClick = (event, component) => {
        if (component === "backgroundColor") {
            setBackgroundColorAnchorEl(event.currentTarget);
            setBackgroundColorColorPickerOpen(true)
        }
        if (component === "borderColor") {
            setBorderColorAnchorEl(event.currentTarget);
            setBorderColorColorPickerOpen(true)
        }
    };

    const backgroundColorColorPickerId = 'background-color-color-picker';
    const borderColorColorPickerId = 'border-color-color-picker';


    const handleClose = (component) => {
        if (component === "backgroundColor") {
            setBackgroundColorAnchorEl(null);
            setBackgroundColorColorPickerOpen(false)
        }
        if (component === "borderColor") {
            setBorderColorAnchorEl(null);
            setBorderColorColorPickerOpen(false)
        }
        handleColorChange(component, currentColor);
        dispatch(setRecentColorsForColorPicker({type: component, color: currentColor}));

    };

    const handleCallback = (childData) => {
        setCurrentColor(childData)
        console.log("childData: ", childData)
    }

    const handleColorChange = (component, color) => {
        console.log(component, color)
        let newConfig = JSON.parse(JSON.stringify(graphConfig));
        let chart = newConfig["chart"];
        if (color === "transparent") {
            chart[component] = "rgba(0,0,0,0)";
        } else {
            chart[component] = color;
        }
        newConfig.chart = chart;
        dispatch(setGraphConfig(newConfig));
    }

    const handleBorderWidthChange = (event, newBorderWidth) => {
        console.log("newBorderWidth:: ", newBorderWidth)
        let newConfig = JSON.parse(JSON.stringify(graphConfig));
        newConfig["chart"]["borderWidth"] = Number(newBorderWidth[0])
        dispatch(setGraphConfig(newConfig));
    }

    return (
        <Accordion expanded={expanedState}
                   onChange={(event, expandedState) => setTabState('appearance', expandedState)}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls="panel2a-content"
                id="panel2a-header"
            >
                <Typography className='AccordTitle'><img src={Appearance}/>Appearance</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <div className={'seriesValueData'}>
                            <FormHelperText id="title-text">Background Color</FormHelperText>
                            <div className={'appereanceBox'}>
                                <img src={Transparent} alt={"transparent-icon"} className={'defaultColor'}
                                     onClick={() => handleColorChange("backgroundColor", "transparent")}/>
                                <Divider orientation="vertical" variant="middle" flexItem className={'bgDivider'}/>
                                <div className={'colorSelect'}>
                                    <div className={'colors'} style={{'backgroundColor': '#FFFFFF'}}
                                         onClick={() => handleColorChange("backgroundColor", "#FFFFFF")}/>

                                    <div className={'colors'} style={{'backgroundColor': '#FBFBE5'}}
                                         onClick={() => handleColorChange("backgroundColor", "#FBFBE5")}/>

                                    <div className={'colors'} style={{'backgroundColor': '#F1E5FB'}}
                                         onClick={() => handleColorChange("backgroundColor", "#F1E5FB")}/>

                                    <div className={'colors'} style={{'backgroundColor': '#E5EFFB'}}
                                         onClick={() => handleColorChange("backgroundColor", "#E5EFFB")}/>

                                    <div className={'colors'} style={{'backgroundColor': '#E5E8FB'}}
                                         onClick={() => handleColorChange("backgroundColor", "#E5E8FB")}/>

                                    <div className={'colors'} style={{'backgroundColor': '#E5FBF2'}}
                                         onClick={() => handleColorChange("backgroundColor", "#E5FBF2")}/>

                                </div>
                                <button type="button" className={'colorSelectMenu'}
                                        onClick={(e) => handlePopoverClick(e, "backgroundColor")}>
                                    Auto
                                </button>
                                <Popover
                                    id={backgroundColorColorPickerId}
                                    open={backgroundColorColorPickerOpen}
                                    anchorEl={backgroundColorAnchorEl}
                                    onClose={() => handleClose("backgroundColor")}
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
                                        component={"backgroundColor"}
                                        parentCallback={handleCallback}
                                        usedColors={colorPickerColors["backgroundColor"]}
                                    />
                                </Popover>
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <div className={'customGridTitle'}>
                            <div className={'seriesValueData'}>
                                <FormHelperText id="title-text">Border color</FormHelperText>
                                <div className={'appereanceBox'}>
                                    <img src={Transparent} alt={"transparent-icon"} className={'defaultColor'}
                                         onClick={() => handleColorChange("borderColor", "transparent")}/>
                                    <Divider orientation="vertical" variant="middle" flexItem className={'bgDivider'}/>
                                    <div className={'colorSelect'}>
                                        <div className={'colors'} style={{'backgroundColor': '#FFFFFF'}}
                                             onClick={() => handleColorChange("borderColor", "#FFFFFF")}/>

                                        <div className={'colors'} style={{'backgroundColor': '#FBFBE5'}}
                                             onClick={() => handleColorChange("borderColor", "#FBFBE5")}/>

                                        <div className={'colors'} style={{'backgroundColor': '#F1E5FB'}}
                                             onClick={() => handleColorChange("borderColor", "#F1E5FB")}/>

                                        <div className={'colors'} style={{'backgroundColor': '#E5EFFB'}}
                                             onClick={() => handleColorChange("borderColor", "#E5EFFB")}/>

                                        <div className={'colors'} style={{'backgroundColor': '#E5E8FB'}}
                                             onClick={() => handleColorChange("borderColor", "#E5E8FB")}/>

                                        <div className={'colors'} style={{'backgroundColor': '#E5FBF2'}}
                                             onClick={() => handleColorChange("borderColor", "#E5FBF2")}/>


                                    </div>

                                    <button type="button" className={'colorSelectMenu'}
                                            onClick={(e) => handlePopoverClick(e, "borderColor")}>
                                        Auto
                                    </button>
                                    <Popover
                                        id={borderColorColorPickerId}
                                        open={borderColorColorPickerOpen}
                                        anchorEl={borderColorAnchorEl}
                                        onClose={() => handleClose("borderColor")}
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
                                            component={"borderColor"}
                                            parentCallback={handleCallback}
                                            usedColors={colorPickerColors["borderColor"]}
                                        />
                                    </Popover>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <div className={'customGridTitle'}>
                            <div className={'seriesValueData'}>
                                <FormHelperText id="title-text">Border width</FormHelperText>
                                <StyledToggleButtonGroup
                                    size="small"
                                    value={`${graphConfig.chart.borderWidth.toString()}px`}
                                    onChange={handleBorderWidthChange}
                                    aria-label="border width"
                                    exclusive
                                    className={'chartBorderLine'}
                                >
                                    <ToggleButton value={"1px"} aria-label="1px">
                                        1px
                                    </ToggleButton>
                                    <ToggleButton value={"2px"} aria-label="2px">
                                        2px
                                    </ToggleButton>
                                    <ToggleButton value={"3px"} aria-label="3px">
                                        3px
                                    </ToggleButton>
                                </StyledToggleButtonGroup>
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <div className={'customGridTitle'}>
                            <div className={'seriesValueData'}>
                                <FormHelperText>Rounded corners</FormHelperText>
                                <StyledToggleButtonGroup
                                    size="small"
                                    value={`${graphConfig.chart.borderWidth.toString()}px`}
                                    onChange={handleBorderWidthChange}
                                    aria-label="text formatting"
                                    exclusive
                                    className={'chartBorderLine'}
                                >
                                    <ToggleButton value={"1px"} aria-label="1px">
                                        1px
                                    </ToggleButton>
                                    <ToggleButton value={"2px"} aria-label="2px">
                                        2px
                                    </ToggleButton>
                                    <ToggleButton value={"3px"} aria-label="3px">
                                        3px
                                    </ToggleButton>
                                </StyledToggleButtonGroup>
                            </div>
                        </div>
                    </Grid>
                </Grid>

                <Grid container spacing={0}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <FormHelperText>Chart size</FormHelperText>
                    </Grid>
                </Grid>

                <Grid container spacing={0}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <div className={'chartSlider'}>
                            <FormHelperText>Chart Width</FormHelperText>
                            <div className={'sliderBox'}>
                                <div className={'sliderValue'}>
                                    <Typography>{chartWidth}</Typography>
                                </div>
                                <div className={'sliderDefaultValue'}>
                                    <Button onClick={() => handleAutoClick('width')}>Auto</Button>
                                </div>
                            </div>
                            <Slider
                                ValueLabelComponent={ValueLabelComponent}
                                aria-label="custom thumb label"
                                value={chartWidth}
                                min={50}
                                max={5000}
                                onChange={handleChangeWidth}
                            />
                        </div>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <div className={'chartSlider'}>
                            <FormHelperText>Chart Height</FormHelperText>
                            <div className={'sliderBox'}>
                                <div className={'sliderValue'}>
                                    <Typography>{chartHeight}</Typography>
                                </div>
                                <div className={'sliderDefaultValue'}>
                                    <Button onClick={() => handleAutoClick('height')}>Auto</Button>
                                </div>
                            </div>
                            <Slider
                                ValueLabelComponent={ValueLabelComponent}
                                aria-label="custom thumb label"
                                value={chartHeight}
                                min={50}
                                max={5000}
                                onChange={handleChangeHeight}
                            />
                        </div>
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
    )
}