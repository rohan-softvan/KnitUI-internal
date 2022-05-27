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
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setDataJSONConfig, setSelectedQuestion, setSelectedQuestionsOptionsList } from '../redux/slice/ChartEditorSlice';
import MainChartCheckbox from '../../../src/assets/images/charteditor/MainChartCheckbox.png';
import MainChartUncheckbox from '../../../src/assets/images/charteditor/MainChartUnheckBox.png';

import SubCheckboxSelected from '../../../src/assets/images/charteditor/SubCheckboxSelected.png'
import SubCheckboxUnselected from '../../../src/assets/images/charteditor/SubCheckboxUnselected.png';
import SubCheckboxUnselectedGray from '../../../src/assets/images/charteditor/SubCheckboxUnselectedGray.png';
import {getChartJSONResponse} from "../redux/actions/ChartAction"
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export default function QuestionTab() {
  const dispatch = useDispatch()
  const questionData = useSelector(store => store.data.questionCardListBox);
  const projectId = useSelector(store => store.project.projectId);
  const selectedQuestionList = useSelector(store => store.chart.selectedQuestionList);
  const selectedQuestionsOptionsList = useSelector(store => store.chart.selectedQuestionsOptionsList);
  const [selectedQuestions, setSelectedQuestions] = React.useState([...selectedQuestionList]);
  const [subOptionSelected, setSubOptionSelected] = React.useState([]);
  const [dataJSON, setDataJSON] = React.useState([])
  const [expand, setExpand] = React.useState([]);
  const [requestList, setRequestList] = React.useState([]);
  const toggleAcordion = () => {
    setExpand((prev) => !prev);
  };

  // useEffect(()=>{
  //     setSelectedQuestionsState(selectedQuestionList)
  // })
  // const [isReadMore, setIsReadMore] = React.useState(true);
  // const toggleReadMore = () => {
  //     setIsReadMore(!isReadMore);
  // };

  const [Show, setShow] = React.useState(false);

  useEffect(() => {
    console.log('questionData==>', questionData)
  }, [questionData])

  const handleClickMenu = () => {
    // if (Height == '30px') setHeight('100%'); else setHeight('30px');
    setShow(!Show)
  }

  useEffect(() => {
    let newList=[]
    Object.entries(subOptionSelected).map(([key, value]) => {
      newList.push({
        "question_id":value.questionId,
        "numeric_question_ids":key,
        "option_list": value.optionList
      })
      })
      let user_request={
        "knit_project_id":projectId,
        "question_dtls":newList
      }
      // getChartJSON
      if(newList.length > 0){
        dispatch(getChartJSONResponse(user_request))
      }
      console.log('selectedQuestions==>',newList)
  }, [selectedQuestions])
  
  const setSelectedQuestionsState = (value, isQuestion, subOption, type) => {
    console.log('value=>', value)
    console.log('subOption=>', subOption,selectedQuestionsOptionsList,selectedQuestionList)
    let questionName = value.questionNumber + " " + value.questionName
    let dataJson = JSON.parse(JSON.stringify(dataJSON))
    let optionsList = JSON.parse(JSON.stringify(selectedQuestionsOptionsList))
    let newSelectedQuestionList = selectedQuestions;
    let newSelectedQuestionsOptionsList = { ...selectedQuestionsOptionsList };    
    if (isQuestion) {
      console.log("removing ", isQuestion, type,value)
      if (type && type === "remove") {
        let selectedQuestionsUpdated = selectedQuestions.filter(e => e !== value.numericQuestionId);
        setSelectedQuestions([...selectedQuestionsUpdated])
        // let updatedNewJson = dataJSON.filter(function (item) {
        //   console.log("QUestio nRemove", item[questionName] === questionName)
        //   return item[questionName] === questionName;
        // })
        // setDataJSON(updatedNewJson);
        newSelectedQuestionList = selectedQuestionsUpdated;
        // dispatch(setDataJSONConfig(updatedNewJson));
        delete newSelectedQuestionsOptionsList[value.numericQuestionId];
      } else {
        if (!selectedQuestions.includes(value.numericQuestionId)) {
          selectedQuestions.push(value.numericQuestionId);
          setSelectedQuestions([...selectedQuestions])
          newSelectedQuestionList = selectedQuestions
          console.log('selectedQuestions=>',selectedQuestions)
        }
        if (value.questionType === "MC") {
          newSelectedQuestionsOptionsList[value.numericQuestionId] = {"questionId":value.questionId,"optionList":value.questionChoice.map(q => q.choiceText)};
        } else {
          newSelectedQuestionsOptionsList[value.numericQuestionId] = Object.keys(value.filterGraphData);
        }
      }
      // dispatch(setSelectedQuestion([...selectedQuestions]))
      setSubOptionSelected(newSelectedQuestionsOptionsList)
      console.log('setSelectedQuestion==>', newSelectedQuestionList)
      dispatch(setSelectedQuestionsOptionsList(newSelectedQuestionsOptionsList))
      dispatch(setSelectedQuestion({
        questionList: newSelectedQuestionList,
        text: questionName
      }))

    } else {
      console.log("QuestionAns", value, selectedQuestions, "type", type)
      if (type && type === "remove") {
        //let updatedNewJson = dataJSON.filter(item => item[questionName] !== subOption.description);
        let updatedOptionsList = optionsList[value.numericQuestionId].filter(opt => opt !== subOption.description);
        let newSelectedQuestionsOptionsList = { ...selectedQuestionsOptionsList };
        newSelectedQuestionsOptionsList[value.numericQuestionId] = [...updatedOptionsList];
        dispatch(setSelectedQuestionsOptionsList(newSelectedQuestionsOptionsList))
        //setDataJSON(updatedNewJson)
        //dispatch(setDataJSONConfig(updatedNewJson))
      } else {
        let updatedOptionsList = optionsList[value.numericQuestionId] ? [...optionsList[value.numericQuestionId]] : [];
        updatedOptionsList.push(subOption.description);
        let newSelectedQuestionsOptionsList = { ...selectedQuestionsOptionsList };
        newSelectedQuestionsOptionsList[value.numericQuestionId] = [...updatedOptionsList];
        dispatch(setSelectedQuestionsOptionsList(newSelectedQuestionsOptionsList))
   
        
        console.log('subOptionSelected==>', subOptionSelected)
        if (!subOptionSelected.includes(value.numericQuestionId)) {
          subOptionSelected.push(value.numericQuestionId)
          setSubOptionSelected([...subOptionSelected])
        }
        if (!selectedQuestions.includes(value.numericQuestionId)) {

          selectedQuestions.push(value.numericQuestionId);
          setSelectedQuestions([...selectedQuestions])

          newSelectedQuestionList = selectedQuestions
          dispatch(setSelectedQuestion({
            questionList: newSelectedQuestionList,
            text: questionName,
          }))
        }
      }
    }
    console.log("dataJSON <<< ", dataJSON, selectedQuestions)
  }
  const setSelectedQuestionsStateForGraphType = (item, subOption, key, isQuestion, type) => {
    console.log('value=>', item, key)
    let questionName = item.questionNumber + " " + item.questionName
    let dataJson = JSON.parse(JSON.stringify(dataJSON))
    //let dataJson = [];
    if (isQuestion) {
      console.log("removing ", isQuestion)
      if (type && type === "remove") {
        let selectedQuestionsUpdated = selectedQuestions.filter(e => e !== item.questionId);
        setSelectedQuestions([...selectedQuestionsUpdated])
        let updatedList = dataJSON.filter(function (item) {
          console.log("QUestio nRemove", item[questionName] === questionName)
          return item[questionName] === questionName;
        })
        setDataJSON(updatedList);
        dispatch(setDataJSONConfig(updatedList))
      } else {
        selectedQuestions.push(item.questionId);
        setSelectedQuestions([...selectedQuestions])
      }
    } else {
      console.log("QuestionAns", selectedQuestions, "type", type)
      if (type && type === "remove") {
        let updatedNewJson = dataJSON.filter(item => item[questionName] != key)
        console.log("subOption", subOption, updatedNewJson)
        setDataJSON(updatedNewJson)
        dispatch(setDataJSONConfig(updatedNewJson))
      } else {
        if (dataJSON.length <= 0 || selectedQuestions.includes(item.questionId)) {
          for (let i = 0; i < subOption.sum; i++) {
            let QuestionAns = key
            dataJSON.push({ [questionName]: QuestionAns })
          }
        } else {
          let totalLength;
          console.log('data.length==>', dataJSON.length, subOption.total, dataJSON.length < subOption.total)
          if (dataJSON.length < subOption.sum) {
            totalLength = subOption.sum - dataJSON.length
          } else {
            totalLength = subOption.sum
          }
          console.log('data.length==> after', totalLength)
          let QuestionAns = key
          // dataJSON[questionName]=QuestionAns
          dataJSON.map(i => i[questionName] = QuestionAns)
          // }
          for (let i = 0; i < totalLength; i++) {
            dataJSON.push({ [questionName]: QuestionAns })
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
    dispatch(setSelectedQuestion(selectedQuestions))

    console.log("dataJSON <<< ", dataJSON)
  }

  React.useEffect(() => {
    // console.log("selectedQuestions:: ", selectedQuestions);
  }, [selectedQuestions])

  const handleAccordionExpandClick = (questionId) => {
    console.log("questionId:: ", questionId)
    if (expand.includes(questionId)) {
      let index = expand.indexOf(questionId);
      if (index !== -1) {
        expand.splice(index, 1);
      }
    } else {
      expand.push(questionId);
    }
    setExpand([...expand]);    
  };
  useEffect(() => {
    console.log("Expand: ", expand)
  }, [expand])
  return (
    questionData && questionData.map((item, index) => item.questionType === 'MC' &&  (
      <div key={index} className={'accordianChart'}>
        <Accordion
          //expanded={expand.includes(item.numericQuestionId)}
          style={selectedQuestions.includes(item.numericQuestionId) ? { backgroundColor: '#12988A' } : {}}
          disabled={selectedQuestions.length >= 3 && !selectedQuestions.includes(item.numericQuestionId)? true : false}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
            onClick={(event) => {
              handleAccordionExpandClick(item.numericQuestionId)
            }}
            className={'questionCardBox'}
          >
            <Typography style={selectedQuestions.includes(item.numericQuestionId) ? { color: '#fff' } : {}}>
              <div style={{ margin: '0px 10px' }}>
                {selectedQuestions.includes(item.numericQuestionId) ? (
                  <img
                    src={MainChartCheckbox}
                    height={"18px"}
                    width={"18px"}
                    onClick={(e) => {
                      e.stopPropagation();
                      // e.target.checked ? setSelectedQuestionsState(item, true) : setSelectedQuestionsState(item, true, "remove")
                      console.log("removing ")
                      setSelectedQuestionsState(item, true, undefined, "remove");
                    }}
                  />
                ) : (
                  <img
                    src={MainChartUncheckbox}
                    height={"18px"}
                    width={"18px"}
                    onClick={(e) => {
                      e.stopPropagation();
                      // e.target.checked ? setSelectedQuestionsState(item, true) : setSelectedQuestionsState(item, true, "remove")
                      setSelectedQuestionsState(item, true, undefined);
                    }}
                  />
                )}
              </div>
              <div style={{ display: 'flex' }}><span
                style={{
                  paddingRight: '5px',
                  minWidth: '40px'
                }}>{item.questionNumber ? item.questionNumber : "-"}</span> {item.questionText ? item.questionText : "-"}
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography style={selectedQuestions.includes(item.numericQuestionId) ? { color: '#fff' } : {}}>
              Select variables to compare:
            </Typography>
            <div
              className={`selectValue ${item.filterQuestionChoice.length > 9 ? (Show ? "full-questions" : "questions-hidden") : "default-questions"
                }`}
              style={selectedQuestions.includes(item.numericQuestionId) ? {
                color: '#fff',
              } : {}}
            >
              {console.log('selectedQuestionsOptionsList[Number(item.numericQuestionId)]==>',selectedQuestionsOptionsList[Number(item.numericQuestionId)])}
              <ul>
                {item.filterQuestionChoice && item.filterQuestionChoice.map(el => (
                  <li>
                    {selectedQuestionsOptionsList[Number(item.numericQuestionId)] && selectedQuestionsOptionsList[Number(item.numericQuestionId)].optionList.includes(el.choiceText) ? (
                      <img
                        src={SubCheckboxSelected}
                        width={"19px"}
                        height={"16px"}
                        onClick={(e) => {
                          setSelectedQuestionsState(item, false, el, "remove")
                        }}
                      />
                    ) : (
                      <img
                        src={SubCheckboxUnselectedGray}
                        width={"19px"}
                        height={"16px"}
                        onClick={(e) => {
                          setSelectedQuestionsState(item, false, el)
                        }}
                      />

                    )}
                    {el.choiceText}
                  </li>
                ))}
              </ul>
            </div>
            {item.filterQuestionChoice.length > 9 &&
              <Grid container spacing={2} style={{ alignItems: 'center' }}>
                <Grid item xs={6}>
                  <Typography onClick={handleClickMenu}
                    style={selectedQuestions.includes(item.numericQuestionId) ? {
                      color: '#fff',
                      cursor: 'pointer'
                    } : { cursor: 'pointer' }}>
                    {Show ? "View less" : "View more"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  {Show && <div className='selectOption'
                    style={selectedQuestions.includes(item.numericQuestionId) ? { color: '#fff' } : {}}>
                    {/*<RadioGroup*/}
                    {/*    row*/}
                    {/*    aria-labelledby="demo-row-radio-buttons-group-label"*/}
                    {/*    name="row-radio-buttons-group"*/}
                    {/*>*/}
                    {/*    <FormControlLabel value="select" control={<Radio />} label="Select all" />*/}
                    {/*    <FormControlLabel value="deselect" control={<Radio />} label="De-select all" />*/}
                    {/*</RadioGroup>*/}
                    <Checkbox /> Select All
                  </div>}
                </Grid>
              </Grid>
            }
          </AccordionDetails>
        </Accordion>
      </div>
    )
    //  :
    //   item.graphType === "stack_bar_chart" || item.graphType === "multi_column_bar_chart" &&
    //   (
    //     <div key={index} className={'accordianChart'}
    //       style={selectedQuestions.includes(item.numericQuestionId) ? {
    //         color: '#fff',
    //         background: '#12988A'
    //       } : {}}>
    //       <div className={'noAccordian'}>
    //         <Typography style={selectedQuestions.includes(item.numericQuestionId) ? {
    //           color: '#fff',
    //         } : {}}>
    //           {selectedQuestions.includes(item.numericQuestionId) ? (
    //             <img
    //               src={MainChartCheckbox}
    //               height={"18px"}
    //               width={"18px"}
    //               onClick={() => {
    //                 setSelectedQuestionsState(item, true, undefined, "remove");
    //               }}
    //             />
    //           ) : (
    //             <img
    //               src={MainChartUncheckbox}
    //               height={"18px"}
    //               width={"18px"}
    //               onClick={() => {
    //                 setSelectedQuestionsState(item, true, undefined);
    //               }}
    //             />
    //           )}


    //           <span>{item.questionNumber ? item.questionNumber : "-"}</span> {item.questionText ? item.questionText : "-"}
    //         </Typography>
    //         <div className='withoutAccordian'>
    //           <ul>
    //             {Object.entries(item.filterGraphData).map(([key, value]) => {
    //               return <li>
    //                 {selectedQuestionsOptionsList[item.numericQuestionId]?.includes(key) ? (
    //                   <img
    //                     src={SubCheckboxSelected}
    //                     width={"19px"}
    //                     height={"16px"}
    //                     onClick={(e) => {
    //                       setSelectedQuestionsState(item, false, {
    //                         description: key,
    //                         choiceText: key
    //                       }, "remove")
    //                     }}
    //                   />
    //                 ) : (
    //                   <img
    //                     src={SubCheckboxUnselectedGray}
    //                     width={"19px"}
    //                     height={"16px"}
    //                     onClick={(e) => {
    //                       setSelectedQuestionsState(item, false, {
    //                         description: key,
    //                         choiceText: key
    //                       })
    //                     }}
    //                   />

    //                 )}
    //                 {key}
    //               </li>
    //             })
    //             }
    //           </ul>
    //         </div>
    //       </div>
    //     </div>)
    )

  );
}
