import * as React from 'react';
import { Grid, Typography } from "@material-ui/core";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Checkbox from '@material-ui/core/Checkbox';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export default function QuestionTab() {

    const [selectedQuestions, setSelectedQuestions] = React.useState([]);
    // const [isReadMore, setIsReadMore] = React.useState(true);
    // const toggleReadMore = () => {
    //     setIsReadMore(!isReadMore);
    // };

    const [Height, setHeight] = React.useState('30px');
    const [Show, setShow] = React.useState(false);

    const handleClickMenu = () => {
        if (Height == '30px') setHeight('100%'); else setHeight('30px');
        setShow(!Show)
    }

    const setSelectedQuestionsState = (value, type) => {
        if (type && type === "remove") {
            console.log("removing", selectedQuestions)
            let selectedQuestionsUpdated = selectedQuestions.filter(e => e !== value);
            setSelectedQuestions([...selectedQuestionsUpdated])
        }
        else {
            selectedQuestions.push(value);
            setSelectedQuestions([...selectedQuestions])
        }
    }

    React.useEffect(() => {
        // console.log("selectedQuestions:: ", selectedQuestions);
    }, [selectedQuestions])

    return (
        <div className={'accordianChart'}>
            <Accordion style={selectedQuestions.includes(0) ? { backgroundColor: '#12988A' } : {}}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <Typography style={selectedQuestions.includes(0) ? { color: '#fff' } : {}}><Checkbox {...label} onClick={(e) => {
                        e.target.checked ? setSelectedQuestionsState(0) : setSelectedQuestionsState(0, "remove")
                    }} /><span>Q.1</span> In which city you grew up?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography style={selectedQuestions.includes(0) ? { color: '#fff' } : {}}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                        malesuada lacus ex, sit amet blandit leo lobortis eget.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion style={selectedQuestions.includes(1) ? { backgroundColor: '#12988A' } : {}}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <Typography style={selectedQuestions.includes(1) ? { color: '#fff' } : {}}><Checkbox {...label} onClick={(e) => {
                        e.target.checked ? setSelectedQuestionsState(1) : setSelectedQuestionsState(1, "remove")
                    }} /><span>Q.2</span> Which city in Texas do you currently live?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography style={selectedQuestions.includes(1) ? { color: '#fff' } : {}}>
                        Select variables to compare:
                    </Typography>
                    <div className='selectValue' style={selectedQuestions.includes(1) ? { color: '#fff', height: Height, overflow: Show ? 'auto' : 'hidden' } : {}}>
                        <ul>
                            <li><Checkbox {...label} /> San Antonio</li>
                            <li><Checkbox {...label} /> Austin</li>
                            <li><Checkbox {...label} /> San Marcos</li>
                            <li><Checkbox {...label} /> Boerne</li>
                            <li><Checkbox {...label} /> Kyle</li>
                            <li><Checkbox {...label} /> Dallas</li>
                            <li><Checkbox {...label} /> Houston</li>
                            <li><Checkbox {...label} /> Pecos</li>
                            <li><Checkbox {...label} /> San Antonio</li>
                            <li><Checkbox {...label} /> Austin</li>
                            <li><Checkbox {...label} /> San Marcos</li>
                            <li><Checkbox {...label} /> Boerne</li>
                            <li><Checkbox {...label} /> Kyle</li>
                            <li><Checkbox {...label} /> Dallas</li>
                            <li><Checkbox {...label} /> Houston</li>
                            <li><Checkbox {...label} /> Pecos</li>
                            <li><Checkbox {...label} /> San Antonio</li>
                            <li><Checkbox {...label} /> Austin</li>
                            <li><Checkbox {...label} /> San Marcos</li>
                            <li><Checkbox {...label} /> Boerne</li>
                            <li><Checkbox {...label} /> Kyle</li>
                            <li><Checkbox {...label} /> Dallas</li>
                            <li><Checkbox {...label} /> Houston</li>
                            <li><Checkbox {...label} /> Pecos</li>
                            <li><Checkbox {...label} /> San Antonio</li>
                            <li><Checkbox {...label} /> Austin</li>
                            <li><Checkbox {...label} /> San Marcos</li>
                            <li><Checkbox {...label} /> Boerne</li>
                            <li><Checkbox {...label} /> Kyle</li>
                            <li><Checkbox {...label} /> Dallas</li>
                            <li><Checkbox {...label} /> Houston</li>
                            <li><Checkbox {...label} /> Pecos</li>
                        </ul>
                    </div>
                    <Grid container spacing={2} style={{ alignItems: 'center' }}>
                        <Grid item xs={6}>
                            <Typography onClick={handleClickMenu} style={selectedQuestions.includes(1) ? { color: '#fff', cursor: 'pointer' } : { cursor: 'pointer' }}>
                                {Show ? "View less" : "View more"}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            {Show && <div className='selectOption' style={selectedQuestions.includes(1) ? { color: '#fff' } : {}}>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                >
                                    <FormControlLabel value="select" control={<Radio />} label="Select all" />
                                    <FormControlLabel value="deselect" control={<Radio />} label="Deselect all" />
                                </RadioGroup>
                            </div>}
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <Accordion style={selectedQuestions.includes(2) ? { backgroundColor: '#12988A' } : {}}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography style={selectedQuestions.includes(2) ? { color: '#fff' } : {}}><Checkbox onClick={(e) => {
                        e.target.checked ? setSelectedQuestionsState(2) : setSelectedQuestionsState(2, "remove")
                    }} {...label} /> <span>Q.3</span> Gender</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography style={selectedQuestions.includes(2) ? { color: '#fff' } : {}}>
                        Select variables to compare:
                    </Typography>
                    <div className='select_value' style={selectedQuestions.includes(2) ? { color: '#fff' } : {}}>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                        >
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                        </RadioGroup>
                    </div>
                </AccordionDetails>
            </Accordion>

            {/* <div className={'noAccordian'}>
                <Typography><span>Q.4</span> Do you follow any sports teams on social media that you are not a fan of?</Typography>
                <div className='withoutAccordian'>
                    <div className='select_one_option' style={selectedQuestions.includes(2) ? { color: '#fff' } : {}}>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                        >
                            <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
                            <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
                            <FormControlLabel value="option3" control={<Radio />} label="Lorem Ipsum is simply dummy text of the" />
                            <FormControlLabel value="option4" control={<Radio />} label="Lorem Ipsum is simply dummy text of the" />
                        </RadioGroup>
                    </div>
                </div>
            </div> */}

            <div className={'noAccordian'}>
                <Typography><span>Q.5</span> Do you follow any sports teams on social media that you are not a fan of?</Typography>
                <div className='withoutAccordian'>
                    <ul>
                        <li><Checkbox {...label} /> Lorem Ipsum</li>
                        <li><Checkbox {...label} /> Lorem Ipsum</li>
                        <li><Checkbox {...label} /> Lorem Ipsum</li>
                        <li><Checkbox {...label} /> Lorem Ipsum</li>
                        <li><Checkbox {...label} /> Lorem Ipsum</li>
                        <li><Checkbox {...label} /> Lorem Ipsum</li>
                        <li><Checkbox {...label} /> Lorem Ipsum</li>
                        <li><Checkbox {...label} /> Lorem Ipsum</li>
                    </ul>
                </div>
            </div>

        </div>
    );
}