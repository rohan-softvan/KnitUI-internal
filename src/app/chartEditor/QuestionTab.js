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
import { useDispatch,useSelector } from "react-redux";
import {useEffect} from "react";
import { setDataJSONConfig } from '../redux/slice/ChartEditorSlice';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export default function QuestionTab() {

    const [selectedQuestions, setSelectedQuestions] = React.useState([]);
    const dispatch= useDispatch()
    const questionData = useSelector(store => store.data.questionCardListBox);
    const [dataJSON,setDataJSON] = React.useState([])

    const [expand, setExpand] = React.useState(false);
    const toggleAcordion = () => {
        setExpand((prev) => !prev);
    };

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

   const setSelectedQuestionsState = (value,isQuestion,subOption, type) => {
        console.log('value=>',value)
        let questionName = value.questionNumber + " " +value.questionName
         let dataJson=JSON.parse(JSON.stringify(dataJSON))
        //let dataJson = [];
        if(isQuestion){
            console.log("removing ",isQuestion, value)
            if (type && type === "remove") {
                let selectedQuestionsUpdated = selectedQuestions.filter(e => e !== value.questionId);
                setSelectedQuestions([...selectedQuestionsUpdated])
                let updatedNewJson=dataJSON.filter(function(item){
                    console.log("QUestio nRemove",item[questionName] == questionName)
                    return item[questionName] == questionName;
                })
                setDataJSON(updatedNewJson);
                dispatch(setDataJSONConfig(updatedNewJson))
            }
            else {
                selectedQuestions.push(value.questionId);
                setSelectedQuestions([...selectedQuestions])
            }
        }else{
            console.log("QuestionAns",value,selectedQuestions,"type",type)
            if (type && type === "remove") {
                let updatedNewJson=dataJSON.filter(item => item[questionName] != subOption.description)
                console.log("subOption",subOption,updatedNewJson)
                setDataJSON(updatedNewJson)
                dispatch(setDataJSONConfig(updatedNewJson))
            }else{
                if(dataJSON.length <= 0 || selectedQuestions.includes(value.questionId)){
                    for(let i=0;i<subOption.total;i++){
                        let QuestionAns = subOption.description
                        dataJSON.push({[questionName]:QuestionAns})
                    }
                }else{
                    let totalLength;
                    console.log('data.length==>',dataJSON.length,subOption.total,dataJSON.length < subOption.total)
                    if(dataJSON.length < subOption.total){
                        totalLength=subOption.total-dataJSON.length
                    }else{
                        totalLength=subOption.total
                    }
                    console.log('data.length==> after',totalLength)
                    let QuestionAns = subOption.description
                    // dataJSON[questionName]=QuestionAns
                    dataJSON.map(i=>i[questionName]=QuestionAns)
                    // }
                    for(let i=0;i<totalLength;i++){
                        dataJSON.push({[questionName]:QuestionAns})
                    }
                }
                setDataJSON(dataJSON)
                dispatch(setDataJSONConfig(dataJson))
                selectedQuestions.push(value.questionId);
                setSelectedQuestions([...selectedQuestions])
            }
            // for (const questionChoice in value.total) {
            //     let QuestionAns = value.filterQuestionChoice[questionChoice].description
            //     dataJSON.push({[questionName]:QuestionAns})
            // }
        }

        console.log("dataJSON <<< ",dataJSON)
    }

    const setSelectedQuestionsStateForGraphType = (item,subOption,key,isQuestion, type) => {
        console.log('value=>',item,key)
        let questionName = item.questionNumber + " " +item.questionName
         let dataJson=JSON.parse(JSON.stringify(dataJSON))
        //let dataJson = [];
        if(isQuestion){
            console.log("removing ",isQuestion)
            if (type && type === "remove") {
                let selectedQuestionsUpdated = selectedQuestions.filter(e => e !== item.questionId);
                setSelectedQuestions([...selectedQuestionsUpdated])
                let updatedList=dataJSON.filter(function(item){
                    console.log("QUestio nRemove",item[questionName] == questionName)
                    return item[questionName] == questionName;
                })
                setDataJSON(updatedList);
                dispatch(setDataJSONConfig(updatedList))
            }
            else {
                selectedQuestions.push(item.questionId);
                setSelectedQuestions([...selectedQuestions])
            }
        }else{
            console.log("QuestionAns",selectedQuestions,"type",type)
            if (type && type === "remove") {
                let updatedNewJson=dataJSON.filter(item => item[questionName] != key)
                console.log("subOption",subOption,updatedNewJson)
                setDataJSON(updatedNewJson)
                dispatch(setDataJSONConfig(updatedNewJson))
            }else{
                if(dataJSON.length <= 0 || selectedQuestions.includes(item.questionId)){
                    for(let i=0;i<subOption.sum;i++){
                        let QuestionAns = key
                        dataJSON.push({[questionName]:QuestionAns})
                    }
                }else{
                    let totalLength;
                    console.log('data.length==>',dataJSON.length,subOption.total,dataJSON.length < subOption.total)
                    if(dataJSON.length < subOption.sum){
                        totalLength=subOption.sum-dataJSON.length
                    }else{
                        totalLength=subOption.sum
                    }
                    console.log('data.length==> after',totalLength)
                    let QuestionAns = key
                    // dataJSON[questionName]=QuestionAns
                    dataJSON.map(i=>i[questionName]=QuestionAns)
                    // }
                    for(let i=0;i<totalLength;i++){
                        dataJSON.push({[questionName]:QuestionAns})
                    }
                }
                setDataJSON(dataJSON)
                dispatch(setDataJSONConfig(dataJSON))
                selectedQuestions.push(item.questionId);
                setSelectedQuestions([...selectedQuestions])
            }
            // for (const questionChoice in value.total) {
            //     let QuestionAns = value.filterQuestionChoice[questionChoice].description
            //     dataJSON.push({[questionName]:QuestionAns})
            // }
        }
        console.log("dataJSON <<< ",dataJSON)
    }

    React.useEffect(() => {
        // console.log("selectedQuestions:: ", selectedQuestions);
    }, [selectedQuestions])

    return (
        questionData && questionData.map((item,index)=>  item.questionType === 'MC' ? (
            <div  key={index} className={'accordianChart'}>
                <Accordion style={selectedQuestions.includes(item.questionId) ? { backgroundColor: '#12988A' } : {}}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                        IconButtonProps={{
                            onClick: toggleAcordion
                        }}
                        className={'questionCardBox'}
                    >
                        <Typography style={selectedQuestions.includes(item.questionId) ? { color: '#fff' } : {}}><div><Checkbox {...label} onClick={(e) => {
                            e.target.checked ? setSelectedQuestionsState(item.questionId,true) : setSelectedQuestionsState(item.questionId,true, "remove")
                        }} /></div><div style={{display:'flex'}}><span style={{paddingRight:'5px'}}>{item.questionNumber ? item.questionNumber : "-"}</span> { item.questionText ? item.questionText : "-"}</div></Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography style={selectedQuestions.includes(item.questionId) ? { color: '#fff' } : {}}>
                            Select variables to compare:
                        </Typography>
                        <div className='selectValue' style={selectedQuestions.includes(item.questionId) ? { color: '#fff', height: Height, overflow: Show ? 'auto' : 'hidden' } : {}}>
                            <ul>
                                {/*{console.log("Checked List Length",item.filterQuestionChoice.length >= 9)}*/}
                                {item.filterQuestionChoice && item.filterQuestionChoice.map(el => (
                                    <li><Checkbox {...el.choiceText} onClick={(e) => {
                                        e.target.checked ? setSelectedQuestionsState(item,false,el) : setSelectedQuestionsState(item,false,el,"remove")}} /> {el.choiceText}</li>
                                ))}
                            </ul>
                        </div>
                        <Grid container spacing={2} style={{ alignItems: 'center' }}>
                            <Grid item xs={6}>
                                <Typography onClick={handleClickMenu} style={selectedQuestions.includes(item.questionId) ? { color: '#fff', cursor: 'pointer' } : { cursor: 'pointer' }}>
                                    {Show ? "View less" : "View more"}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                {Show && <div className='selectOption' style={selectedQuestions.includes(item.questionId) ? { color: '#fff' } : {}}>
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
                    e.target.checked ? setSelectedQuestionsStateForGraphType(item,value,key,false) : setSelectedQuestionsStateForGraphType(item,value,key,false,"remove")}} /> {key}</li>
                })
                }
            </ul>
        </div>
    </div>
               </div>)
        )

    );
}
