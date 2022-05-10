import * as React from 'react';
import { Grid, Typography } from "@material-ui/core";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Checkbox from '@material-ui/core/Checkbox';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useSelector } from "react-redux";
import {useEffect} from "react";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export default function QuestionTab() {

    const [selectedQuestions, setSelectedQuestions] = React.useState([]);
    const questionData = useSelector(store => store.data.questionCardListBox);

    // const [isReadMore, setIsReadMore] = React.useState(true);
    // const toggleReadMore = () => {
    //     setIsReadMore(!isReadMore);
    // };

    const [Height, setHeight] = React.useState('30px');
    const [Show, setShow] = React.useState(false);

    useEffect(() => {
        console.log('questionData==>',questionData)
    },[questionData])

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
        questionData && questionData.map((item,index)=>  item.questionType === 'MC' ? (
            <div  key={index} className={'accordianChart'}>
                <Accordion style={selectedQuestions.includes(item.numericQuestionId) ? { backgroundColor: '#12988A' } : {}}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                    >
                        <Typography style={selectedQuestions.includes(item.numericQuestionId) ? { color: '#fff' } : {}}><Checkbox {...label} onClick={(e) => {
                            e.target.checked ? setSelectedQuestionsState(item.numericQuestionId) : setSelectedQuestionsState(item.numericQuestionId, "remove")
                        }} /><span>{item.questionNumber ? item.questionNumber : "-"}</span> { item.questionText ? item.questionText : "-"}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography style={selectedQuestions.includes(item.numericQuestionId) ? { color: '#fff' } : {}}>
                            Select variables to compare:
                        </Typography>
                        <div className='selectValue' style={selectedQuestions.includes(item.numericQuestionId) ? { color: '#fff', height: Height, overflow: Show ? 'auto' : 'hidden' } : {}}>
                            <ul>
                                {item.filterQuestionChoice && item.filterQuestionChoice.map(el => (
                                    <li><Checkbox {...el.choiceText} onClick={(e) => {
                                        e.target.checked ? setSelectedQuestionsState(item,false,el) : setSelectedQuestionsState(item,false,el,"remove")}} /> {el.choiceText}</li>
                                ))}
                            </ul>
                        </div>
                        <Grid container spacing={2} style={{ alignItems: 'center' }}>
                            <Grid item xs={6}>
                                <Typography onClick={handleClickMenu} style={selectedQuestions.includes(item.numericQuestionId) ? { color: '#fff', cursor: 'pointer' } : { cursor: 'pointer' }}>
                                    {Show ? "View less" : "View more"}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                {Show && <div className='selectOption' style={selectedQuestions.includes(item.numericQuestionId) ? { color: '#fff' } : {}}>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                    >
                                        <FormControlLabel value="select" control={<Radio />} label="Select all" />
                                        <FormControlLabel value="deselect" control={<Radio />} label="De-select all" />
                                    </RadioGroup>
                                </div>}
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </div>
        ) :
           item.graphType === "stack_bar_chart" || item.graphType === "multi_column_bar_chart" &&
           (
               <div key={index}  className={'accordianChart'}>
               <div className={'noAccordian'}>
                   <Typography style={selectedQuestions.includes(1) ? { color: '#fff' } : {}}><Checkbox {...label} onClick={(e) => {
                       e.target.checked ? setSelectedQuestionsState(1) : setSelectedQuestionsState(1, "remove")
                   }} /><span>{item.questionNumber ? item.questionNumber : "-"}</span> { item.questionText ? item.questionText : "-"}</Typography>
        <div className='withoutAccordian'>
            <ul>
                {Object.entries(item.filterGraphData).map(([key, value]) => {
                  return  <li><Checkbox {...key} onClick={(e) => {
                    e.target.checked ? setSelectedQuestionsState() : setSelectedQuestionsState()}} /> {key}</li>
                })
                }
            </ul>
        </div>
    </div>
               </div>)
        )

    );
}
