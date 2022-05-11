import * as React from 'react';
import { Grid, Typography } from "@material-ui/core";
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
import Paper from '@material-ui/core/Paper';
import { styled } from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux";
import {setGraphConfig} from "../../../redux/slice/ChartEditorSlice";

let seriesMenu = [
    {
        title: <div style={{ display: 'flex' }}><span style={{ backgroundColor: '#AB0C0C', width: '20px', height: '20px', borderRadius: '50%', marginRight: '15px' }}></span><span>Doctor Strange</span></div>,
        value: "doctorStrange",
        key: 1,
    },
    {
        title: <div style={{ display: 'flex' }}><span style={{ backgroundColor: '#387D32', width: '20px', height: '20px', borderRadius: '50%', marginRight: '15px' }}></span><span>Loki</span></div>,
        value: "loki",
        key: 2,
    },
    {
        title: <div style={{ display: 'flex' }}><span style={{ backgroundColor: '#730619', width: '20px', height: '20px', borderRadius: '50%', marginRight: '15px' }}></span><span>Thor</span></div>,
        value: "thor",
        key: 3,
    },
];

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

export default function SeriesTab({ expanedState, setTabState }) {
    const dispatch = useDispatch();
    let graphConfig = useSelector((state) => state.chart.graphConfig);
    const [usedColors,setUsedColor] = React.useState([])
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open,setOpen] = React.useState(false)
    const [currentColor, setCurrentColor]= React.useState('')
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen(true)
    };

    // console.log("Check Series Data:: ", graphConfig.series)
    const seriesData = [graphConfig.series]
    // const listSeriesData = seriesData.map()
    seriesData.map((item, index) => {
        console.log("Check Series Data:: ", item)
    })


    const id = 'transitions-popper';

    const handleClose = () => {
        setAnchorEl(null);
        setOpen(false)
        usedColors.push(currentColor)
    };

    const handleCallback = (childData) =>{
        setCurrentColor(childData)
    }

    const handleShowInLegend = (event) => {
        const {value} = event.target;
        let newConfig = JSON.parse(JSON.stringify(graphConfig));
        newConfig["series"][0]["showInLegend"] = value === "on"
        dispatch(setGraphConfig(newConfig));
    }

    return (
        <Accordion expanded={expanedState} onChange={(event, expandedState) => setTabState('series', expandedState)}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
            >
                <Typography className='AccordTitle'><img src={Series} />Series</Typography>
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
                            <div className={'leftGrid'}>
                                <FormHelperText id="title-text">Show in legend</FormHelperText>
                                <SelectComponent
                                    menu={legend}
                                    menuValue={graphConfig["series"][0]["showInLegend"] ? "on" : "off"}
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