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

function ValueLabelComponent(props) {
    const {children, open, value} = props;

    return (
        <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
            {children}
        </Tooltip>
    );
}

export default function AppearanceTab({expanedState, setTabState}) {
    const [chartWidth, setChartWidth] = React.useState(500);
    const [chartHeight, setChartHeight] = React.useState(500);

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
                                <img src={Transparent} className={'defaultColor'}/>
                                <Divider orientation="vertical" variant="middle" flexItem className={'bgDivider'}/>
                                <div className={'colorSelect'}>
                                    <div className={'colors'} style={{'backgroundColor': '#FFFFFF'}}></div>
                                    <div className={'colors'} style={{'backgroundColor': '#FBFBE5'}}></div>
                                    <div className={'colors'} style={{'backgroundColor': '#F1E5FB'}}></div>
                                    <div className={'colors'} style={{'backgroundColor': '#E5EFFB'}}></div>
                                    <div className={'colors'} style={{'backgroundColor': '#E5E8FB'}}></div>
                                    <div className={'colors'} style={{'backgroundColor': '#E5FBF2'}}></div>
                                </div>
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
                                    <img src={Transparent} className={'defaultColor'}/>
                                    <Divider orientation="vertical" variant="middle" flexItem className={'bgDivider'}/>
                                    <div className={'colorSelect'}>
                                        <div className={'colors'} style={{'backgroundColor': '#FFFFFF'}}></div>
                                        <div className={'colors'} style={{'backgroundColor': '#FBFBE5'}}></div>
                                        <div className={'colors'} style={{'backgroundColor': '#F1E5FB'}}></div>
                                        <div className={'colors'} style={{'backgroundColor': '#E5EFFB'}}></div>
                                        <div className={'colors'} style={{'backgroundColor': '#E5E8FB'}}></div>
                                        <div className={'colors'} style={{'backgroundColor': '#E5FBF2'}}></div>
                                    </div>
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
                                <div className={'appereanceBox'}>
                                    <Typography style={{'color': '#28B5A6'}}>1px</Typography>
                                    <Divider orientation="vertical" variant="middle" flexItem className={'bgDivider'}/>
                                    <div className={'widthValue'}>
                                        <Typography className={'widthDecimal'}>2px</Typography>
                                        <Typography className={'widthDecimal'}>3px</Typography>
                                        <Typography className={'widthDecimal'}>4px</Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <div className={'customGridTitle'}>
                            <div className={'seriesValueData'}>
                                <FormHelperText>Rounded cornors</FormHelperText>
                                <div className={'appereanceBox'}>
                                    <Typography style={{'color': '#28B5A6'}}>1px</Typography>
                                    <Divider orientation="vertical" variant="middle" flexItem className={'bgDivider'}/>
                                    <div className={'widthValue'}>
                                        <Typography className={'widthDecimal'}>2px</Typography>
                                        <Typography className={'widthDecimal'}>3px</Typography>
                                        <Typography className={'widthDecimal'}>4px</Typography>
                                    </div>
                                </div>
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