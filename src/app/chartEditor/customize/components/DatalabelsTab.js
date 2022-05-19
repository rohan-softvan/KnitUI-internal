import * as React from 'react';
import {Grid, Typography} from "@material-ui/core";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Datalabels from '../../../../assets/images/charteditor/Datalabels.png';
import Switch from "@material-ui/core/Switch";
import FormHelperText from '@material-ui/core/FormHelperText';
import SelectComponent from "../../../components/select/Select";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import Paper from '@material-ui/core/Paper';
import {styled} from '@material-ui/core/styles';
import Divider from "@material-ui/core/Divider";
import FormatAlignLeftIcon from "@material-ui/icons/FormatAlignLeft";
import FormatAlignCenterIcon from "@material-ui/icons/FormatAlignCenter";
import FormatAlignRightIcon from "@material-ui/icons/FormatAlignRight";
import Popover from "@material-ui/core/Popover";
import CustomColorPicker from "./CustomColorPicker";
import {setGraphConfig} from "../../../redux/slice/ChartEditorSlice";
import {useDispatch, useSelector} from "react-redux";
import {setRecentColorsForColorPicker} from "../../../redux/slice/ColorPickerSlice";

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
        title: "Left",
        value: "left",
        key: 1,
    },
    {
        title: "Center",
        value: "center",
        key: 2,
    },
    {
        title: "Right",
        value: "right",
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

export default function DatalabelsTab({expanedState, setTabState, pieConfig, setPieConfig}) {
    const dispatch = useDispatch();
    let graphConfig = useSelector((state) => state.chart.graphConfig);
    let colorPickerColors = useSelector((state) => state.colorPicker);
    const [alignment, setAlignment] = React.useState('center');
    const [formats, setFormats] = React.useState(() => ['bold']);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open, setOpen] = React.useState(false)
    const [currentColor, setCurrentColor] = React.useState('')

    const [dataLabelPosition, setDataLabelPosition] = React.useState("left")
    const [selectedFontFamily, setSelectedFontFamily] = React.useState('roboto')
    const [selectedFontSize, setSelectedFontSize] = React.useState('auto');

    const id = 'data-label-color-picker';

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



    const handleTitleFormatting = (event, newFormats,) => {
        console.log("newFormats", newFormats);
        setFormats(newFormats);
        let newConfig = getGraphConfigs();
        let dataLabelsStyle = newConfig['plotOptions']['series']['dataLabels']['style'];
        dataLabelsStyle["fontWeight"] = newFormats.includes("bold") ? "bold" : "normal";
        dataLabelsStyle["fontStyle"] = newFormats.includes("italic") ? "italic" : "normal";
        newConfig['plotOptions']['series']['dataLabels']['style'] = dataLabelsStyle;
        setGraphConfigs(newConfig);
    };

    const handleTitleAlignment = (event, newAlignment) => {
        console.log("newAlignment", newAlignment);
        setAlignment(newAlignment);
        let newConfig = getGraphConfigs();
        let dataLabels = newConfig['plotOptions']['series']['dataLabels'];
        dataLabels["align"] = newAlignment;
        newConfig['plotOptions']['series']['dataLabels'] = dataLabels;
        setGraphConfigs(newConfig);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen(true)
    };

    const setDataLabelColor = (color) => {
        let newConfig = getGraphConfigs();
        newConfig['plotOptions']['series']['dataLabels']['color'] = color;
        setGraphConfigs(newConfig);
    }

    const handleClose = () => {
        setAnchorEl(null);
        setOpen(false)
        dispatch(setRecentColorsForColorPicker({type: "dataLabelsColor", color: currentColor}));
        setDataLabelColor(currentColor);
    };

    const handleCallback = (childData) => {
        setCurrentColor(childData)
    }

    const handleChartDataLabelVisible = (event) => {
        const {checked} = event.target;
        let newConfig = getGraphConfigs();
        newConfig.plotOptions.series.dataLabels.enabled = checked
        console.log("Checked Console for datalabel", newConfig)
        setGraphConfigs(newConfig);
    }

    const handleDataLabelPositionChange = (event) => {
        const {value} = event.target;
        setDataLabelPosition(value);
        let newConfig = getGraphConfigs();
        // if (!("plotOptions" in newConfig)) {
        //     newConfig['plotOptions'] = {...chartEditorEnum.plotOptionsDefaultProps}
        // }
        newConfig.plotOptions.series.dataLabels.align = value
        setGraphConfigs(newConfig);
    }

    const handleTitleFontFamilyChange = (event) => {
        const {value} = event.target;
        setSelectedFontFamily(value);
        let newConfig = getGraphConfigs();
        let dataLabelsStyle = newConfig['plotOptions']['series']['dataLabels']['style'];
        dataLabelsStyle["fontFamily"] = fontFamily.find(e => e.value === value).title
        newConfig['plotOptions']['series']['dataLabels']['style'] = dataLabelsStyle;
        setGraphConfigs(newConfig);
    }

    const handleTitleFontSizeChange = (event) => {
        const {value} = event.target;
        setSelectedFontSize(value);
        let newConfig = getGraphConfigs();
        let dataLabelsStyle = newConfig['plotOptions']['series']['dataLabels']['style'];
        dataLabelsStyle["fontSize"] = value === "auto" ? "11px" : value + 'px'
        newConfig['plotOptions']['series']['dataLabels']['style'] = dataLabelsStyle;
        setGraphConfigs(newConfig);
    }

    return (
        <Accordion expanded={expanedState} onChange={(event, expandedState) => setTabState('dataLables', expandedState)}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls="panel2a-content"
                id="panel2a-header"
            >
                <Typography className='AccordTitle'><img alt={"Data labels"} src={Datalabels}/>Data labels</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={2} className={'alignCenter'}>
                    <Grid item xs={6}>
                        <Typography>Show labels</Typography>
                    </Grid>
                    <Grid item xs={6} className={'SwitchIcon'}>
                        <Switch
                            checked={getGraphConfigs().plotOptions.series.dataLabels ? getGraphConfigs().plotOptions.series.dataLabels.enabled : false}
                            onChange={handleChartDataLabelVisible}/>
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <div className={'customGridTitle'}>
                            <div className={'seriesValueData'}>
                                <FormHelperText id="title-text">Position</FormHelperText>
                                <SelectComponent
                                    menu={position}
                                    // menuValue={dataLabelPosition}
                                    // handleChange={handleDataLabelPositionChange}
                                />
                            </div>
                        </div>
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <div className={'datalabelGrid'}>
                            <div className={'leftGrid'}>
                                <FormHelperText id="title-text">Title Font</FormHelperText>
                                <SelectComponent
                                    menu={fontFamily}
                                    menuValue={selectedFontFamily}
                                    handleChange={handleTitleFontFamilyChange}
                                />
                            </div>
                            <div className={'leftGrid'}>
                                <FormHelperText id="title-text">Title Font size</FormHelperText>
                                <SelectComponent
                                    menu={fontsize}
                                    menuValue={selectedFontSize}
                                    handleChange={handleTitleFontSizeChange}
                                />
                            </div>

                        </div>
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <div className={'datalabelGrid'}>
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
                            <div className={'leftGrid'}>
                                <FormHelperText id="title-text">Title text color</FormHelperText>
                                <div className={'colorPiker'}
                                     style={{
                                         width: 'calc(100% - 15px)'
                                     }}>
                                    <div className={'fixColors'}>
                                        <div className={'ActiveColor'} style={{
                                            'backgroundColor': graphConfig && graphConfig.plotOptions && graphConfig['plotOptions']['series']['dataLabels']['color']
                                        }}/>
                                        <Divider flexItem orientation="vertical" sx={{mx: 0.5, my: 1}}/>
                                        <div className={'ColorVariation'}
                                             style={{'backgroundColor': '#000000'}}
                                             onClick={() => setDataLabelColor("#000000")}
                                        />
                                        <div className={'ColorVariation'}
                                             style={{'backgroundColor': '#FCD364'}}
                                             onClick={() => setDataLabelColor("#FCD364")}
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
                                                component={"dataLabelsColor"}
                                                parentCallback={handleCallback}
                                                usedColors={colorPickerColors["dataLabelsColor"]}
                                            />
                                        </Popover>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>

            </AccordionDetails>
        </Accordion>
    )
}
