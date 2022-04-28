import * as React from 'react';
import { Grid, Typography } from "@material-ui/core";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Legend from '../../../../assets/images/charteditor/Legend.png';
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
export default function LegendTab({expanedState, setTabState}) {
    const switchlabel = { inputProps: { 'aria-label': 'Switch demo' } };

    const [Height, setHeight] = React.useState('0px');
    const [Show, setShow] = React.useState(false);

    const [alignment, setAlignment] = React.useState('center');
    const [formats, setFormats] = React.useState(() => ['']);
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

    const toggleSetting = () => {
        if (Height == '0px') setHeight('100%'); else setHeight('0px');
        setShow(!Show)
    }
    return(
        <Accordion expanded={expanedState} onChange={(event, expandedState) => setTabState('legend', expandedState)}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
            >
                <Typography className='AccordTitle'><img src={Legend} />Legend</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={2} className={'alignCenter'}>
                    <Grid item xs={6}>
                        <Typography>Visible</Typography>
                    </Grid>
                    <Grid item xs={6} className={'SwitchIcon'}>
                        <Switch {...switchlabel} defaultChecked />
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <div className={'customGridTitle'}>
                            <div className={'selectFullDropdown'}>
                                <FormHelperText id="title-text">Title text</FormHelperText>                               
                                <SelectComponent menu={position} />
                            </div>
                            <div className={'settingToggle'}>
                                {
                                    Show ? <img src={SettingToggle} onClick={toggleSetting} />
                                        : <img src={SettingNotActive} onClick={toggleSetting} />
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
                                    <FormHelperText id="title-text">Title font</FormHelperText>
                                    <SelectComponent menu={fontFamily} />
                                </div>
                                <div className={'rightGrid'}>
                                    <FormHelperText id="title-text">Title font size</FormHelperText>
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
                                    <FormHelperText id="title-text">Title format</FormHelperText>
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

                                        <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
                                        <StyledToggleButtonGroup
                                            size="small"
                                            value={alignment}
                                            exclusive
                                            onChange={handleAlignment}
                                            aria-label="text alignment"
                                        >
                                            <ToggleButton value="left" aria-label="left aligned">
                                                <FormatAlignLeftIcon />
                                            </ToggleButton>
                                            <ToggleButton value="center" aria-label="centered">
                                                <FormatAlignCenterIcon />
                                            </ToggleButton>
                                            <ToggleButton value="right" aria-label="right aligned">
                                                <FormatAlignRightIcon />
                                            </ToggleButton>
                                        </StyledToggleButtonGroup>
                                    </Paper>
                                </div>
                                <div className={'rightGrid'}>
                                    <FormHelperText id="title-text">Title text color</FormHelperText>
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