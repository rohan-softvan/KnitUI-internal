import * as React from 'react';
import { Grid, Typography } from "@material-ui/core";
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
import { styled } from '@material-ui/core/styles';

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

export default function DatalabelsTab({expanedState, setTabState}) {

    const [selectedQuestions, setSelectedQuestions] = React.useState([]);
    const switchlabel = { inputProps: { 'aria-label': 'Switch demo' } };
    
    return(
        <Accordion expanded={expanedState} onChange={(event, expandedState) => setTabState('dataLables', expandedState)}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
            >
                <Typography className='AccordTitle'><img src={Datalabels} />Data labels</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={2} className={'alignCenter'}>
                    <Grid item xs={6}>
                        <Typography>Show labels</Typography>
                    </Grid>
                    <Grid item xs={6} className={'SwitchIcon'}>
                        <Switch {...switchlabel} defaultChecked />
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <div className={'customGridTitle'}>
                            <div className={'seriesValueData'}>
                                <FormHelperText id="title-text">Position</FormHelperText>                               
                                <SelectComponent menu={position} />
                            </div>
                        </div>
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <div className={'datalabelGrid'}>
                            <div className={'leftGrid'}>
                                <FormHelperText id="title-text">Title Font</FormHelperText>
                                <SelectComponent menu={fontFamily} />
                            </div>
                            <div className={'leftGrid'}>
                                <FormHelperText id="title-text">Title Font size</FormHelperText>
                                <SelectComponent menu={fontsize} />
                            </div>
                            
                        </div>
                    </Grid>
                </Grid>

            </AccordionDetails>
        </Accordion>
    )
}