import * as React from 'react';
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

export default function Heading({expanedState, setTabState}) {

    const [selectedQuestions, setSelectedQuestions] = React.useState([]);
    const switchlabel = {inputProps: {'aria-label': 'Switch demo'}};

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

    React.useEffect(() => {
        // console.log("selectedQuestions:: ", selectedQuestions);
    }, [selectedQuestions])

    const [titleFont, settitleFont] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        settitleFont(event.target.value);
    };

    const toggleSetting = () => {
        if (Height == '0px') setHeight('100%'); else setHeight('0px');
        setShow(!Show)
    }


    /*Sub Title*/
    const [SubHeight, subsetHeight] = React.useState('0px');
    const [SubShow, subsetShow] = React.useState(false);

    const [subalignment, subsetAlignment] = React.useState('center');
    const [subformats, subsetFormats] = React.useState(() => ['']);
    const subhandleFormat = (
        event: React.MouseEvent<HTMLElement>,
        newFormats: string[],
    ) => {
        subsetFormats(newFormats);
    };

    const subhandleAlignment = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string,
    ) => {
        subsetAlignment(newAlignment);
    };

    const subtoggleSetting = () => {
        if (SubHeight == '0px') subsetHeight('100%'); else subsetHeight('0px');
        subsetShow(!SubShow)
    }

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
                        <Switch {...switchlabel} defaultChecked/>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <div className={'customGridTitle'}>
                            <div className={'LeftTitle'}>
                                <FormHelperText id="title-text">Title text</FormHelperText>
                                <OutlinedInput
                                    id="titleText"
                                    aria-describedby="title-text"
                                    inputProps={{
                                        'aria-label': 'title',
                                    }}
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
                                    <SelectComponent menu={fontFamily}/>
                                </div>
                                <div className={'rightGrid'}>
                                    <FormHelperText id="title-text">Title font size</FormHelperText>
                                    <SelectComponent menu={fontsize}/>
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
                                            onChange={handleAlignment}
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
                                    id="subtitleText"
                                    aria-describedby="subtitle-text"
                                    inputProps={{
                                        'aria-label': 'subtitle',
                                    }}
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
                                    <SelectComponent menu={fontFamily}/>
                                </div>
                                <div className={'rightGrid'}>
                                    <FormHelperText id="title-text">Subtitle font size</FormHelperText>
                                    <SelectComponent menu={fontsize}/>
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
                                            border: '1px solid #E8E8E8',
                                            width: 'calc(100% - 30px)'
                                        }}
                                    >
                                        <StyledToggleButtonGroup
                                            size="small"
                                            value={subformats}
                                            onChange={subhandleFormat}
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
                                            value={subalignment}
                                            exclusive
                                            onChange={subhandleAlignment}
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