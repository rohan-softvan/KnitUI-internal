import * as React from 'react';
import {useEffect} from 'react';
import {Grid, Typography} from "@material-ui/core";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Checkbox from '@material-ui/core/Checkbox';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {useDispatch, useSelector} from "react-redux";
import {setDataJSONConfig, setSelectedQuestion, setSelectedQuestionsOptionsList,resetGraphConfig} from '../redux/slice/ChartEditorSlice';
import MainChartCheckbox from '../../../src/assets/images/charteditor/MainChartCheckbox.png';
import MainChartUncheckbox from '../../../src/assets/images/charteditor/MainChartUnheckBox.png';

import SubCheckboxSelected from '../../../src/assets/images/charteditor/SubCheckboxSelected.png'
import SubCheckboxUnselectedGray from '../../../src/assets/images/charteditor/SubCheckboxUnselectedGray.png';
import {getChartJSONResponse} from "../redux/actions/ChartAction"

const label = {inputProps: {'aria-label': 'Checkbox demo'}};

export default function QuestionTab() {
  const dispatch = useDispatch()
  const questionData = useSelector(store => store.data.questionCardListBox);
  const projectId = useSelector(store => store.project.projectId);
  const selectedQuestionList = useSelector(store => store.chart.selectedQuestionList);
  const selectedQuestionsOptionsList = useSelector(store => store.chart.selectedQuestionsOptionsList);
  const [selectedQuestions, setSelectedQuestions] = React.useState(selectedQuestionList ? [...selectedQuestionList] : []);
  const [subOptionSelected, setSubOptionSelected] = React.useState([]);
  const [dataJSON, setDataJSON] = React.useState([])
  const [expand, setExpand] = React.useState([]);
  const [requestList, setRequestList] = React.useState([]);
  const toggleAcordion = () => {
    setExpand((prev) => !prev);
  };

  const [Show, setShow] = React.useState(false);



  const handleClickMenu = () => {
    setShow(!Show)
  }

  const fetchJSONResponse = (subOptionList) =>{
    console.log('subOPtion==>',subOptionList)
    let newList = []
    Object.entries(subOptionList).map(([key, value]) => {
      newList.push({
        "question_id": value.questionId,
        "numeric_question_ids": key,
        "option_list": value.optionList
      })
    })
    let user_request = {
      "knit_project_id": projectId,
      "question_dtls": newList
    }
    // getChartJSON
    if (newList.length > 0) {
      dispatch(getChartJSONResponse(user_request))
    }
  
  }

  const setSelectedQuestionsState = (value, isQuestion, subOption, type) => {
    let questionName = value.questionNumber + " " + value.questionName
    let dataJson = JSON.parse(JSON.stringify(dataJSON))
    let optionsList = JSON.parse(JSON.stringify(selectedQuestionsOptionsList));
    let newSelectedQuestionList = selectedQuestions;
    let newSelectedQuestionsOptionsList = {...selectedQuestionsOptionsList};
    if (isQuestion) {
      if (type && type === "remove") {
        let selectedQuestionsUpdated = selectedQuestions.filter(e => e !== value.numericQuestionId);
        setSelectedQuestions([...selectedQuestionsUpdated])
        newSelectedQuestionList = selectedQuestionsUpdated;
        delete newSelectedQuestionsOptionsList[value.numericQuestionId];
        dispatch(setSelectedQuestion({
          questionList: newSelectedQuestionList,
          text: questionName,
          remove:true
        }))
      } else {
        if (!selectedQuestions.includes(value.numericQuestionId)) {
          selectedQuestions.push(value.numericQuestionId);
          setSelectedQuestions([...selectedQuestions])
          newSelectedQuestionList = selectedQuestions
        }
        if (value.questionType === "MC") {
          newSelectedQuestionsOptionsList[value.numericQuestionId] = {
            "questionId": value.questionId,
            "optionList": value.questionChoice.map(q => q.choiceText)
          };
        } else {
          newSelectedQuestionsOptionsList[value.numericQuestionId] = Object.keys(value.filterGraphData);
        }
        dispatch(setSelectedQuestion({
          questionList: newSelectedQuestionList,
          text: questionName,
          remove:false
        }))
      }
      // dispatch(setSelectedQuestion([...selectedQuestions]))
      setSubOptionSelected(newSelectedQuestionsOptionsList)
      dispatch(setSelectedQuestionsOptionsList(newSelectedQuestionsOptionsList))    
      fetchJSONResponse(newSelectedQuestionsOptionsList)
    } else {
      let updatedOptionsList = []
      if (type && type === "remove") {
        //let updatedNewJson = dataJSON.filter(item => item[questionName] !== subOption.description);
         updatedOptionsList = optionsList[value.numericQuestionId].optionList.filter(opt => opt !== subOption.description);
        let newSelectedQuestionsOptionsList = JSON.parse(JSON.stringify(selectedQuestionsOptionsList));
        newSelectedQuestionsOptionsList[value.numericQuestionId].optionList = [...updatedOptionsList];
        if(updatedOptionsList.length === 0){
          delete newSelectedQuestionsOptionsList[value.numericQuestionId]
          let selectedQuestionsUpdated = selectedQuestions.filter(e => e !== value.numericQuestionId);
          setSelectedQuestions([...selectedQuestionsUpdated])
          newSelectedQuestionList = selectedQuestionsUpdated;
          dispatch(setSelectedQuestion({
            questionList: newSelectedQuestionList,
            text: questionName,
            remove:true
          }))
        }

        dispatch(setSelectedQuestionsOptionsList(newSelectedQuestionsOptionsList))
        fetchJSONResponse(newSelectedQuestionsOptionsList)
      } else {
        // let updatedOptionsList = optionsList[value.numericQuestionId]?.optionList ? [...optionsList[value.numericQuestionId].optionList] : [];
         updatedOptionsList = optionsList[value.numericQuestionId] ? [...optionsList[value.numericQuestionId]?.optionList] : [];
        updatedOptionsList.push(subOption.description);
        let newSelectedQuestionsOptionsList = JSON.parse(JSON.stringify(selectedQuestionsOptionsList));
        newSelectedQuestionsOptionsList[value.numericQuestionId] = {}
        newSelectedQuestionsOptionsList[value.numericQuestionId].questionId = value.questionId;
        newSelectedQuestionsOptionsList[value.numericQuestionId].optionList = updatedOptionsList;
        dispatch(setSelectedQuestionsOptionsList(newSelectedQuestionsOptionsList))
        fetchJSONResponse(newSelectedQuestionsOptionsList)

        // if (!selectedQuestions.includes(value.numericQuestionId)) {
        //   selectedQuestions.push(value.numericQuestionId)
        //   setSelectedQuestions([...selectedQuestions])
        // }
        if (!selectedQuestions.includes(value.numericQuestionId)) {

          selectedQuestions.push(value.numericQuestionId);
          setSelectedQuestions([...selectedQuestions])

          newSelectedQuestionList = selectedQuestions
          dispatch(setSelectedQuestion({
            questionList: newSelectedQuestionList,
            text: questionName,
            remove:false
          }))
        }
      }
     }
    if(newSelectedQuestionList && newSelectedQuestionList.length === 0){
      dispatch(resetGraphConfig())
    }
  }

  // const setSelectedQuestionsStateForGraphType = (item, subOption, key, isQuestion, type) => {
  //   let questionName = item.questionNumber + " " + item.questionName
  //   let dataJson = JSON.parse(JSON.stringify(dataJSON))
  //   //let dataJson = [];
  //   if (isQuestion) {
  //     if (type && type === "remove") {
  //       let selectedQuestionsUpdated = selectedQuestions.filter(e => e !== item.questionId);
  //       setSelectedQuestions([...selectedQuestionsUpdated])
  //       let updatedList = dataJSON.filter(function (item) {
  //         console.log("QUestio nRemove", item[questionName] === questionName)
  //         return item[questionName] === questionName;
  //       })
  //       setDataJSON(updatedList);
  //       dispatch(setDataJSONConfig(updatedList))
  //     } else {
  //       selectedQuestions.push(item.questionId);
  //       setSelectedQuestions([...selectedQuestions])
  //     }
  //   } else {
  //     console.log("QuestionAns", selectedQuestions, "type", type)
  //     if (type && type === "remove") {
  //       let updatedNewJson = dataJSON.filter(item => item[questionName] != key)
  //       console.log("subOption", subOption, updatedNewJson)
  //       setDataJSON(updatedNewJson)
  //       dispatch(setDataJSONConfig(updatedNewJson))
  //     } else {
  //       if (dataJSON.length <= 0 || selectedQuestions.includes(item.questionId)) {
  //         for (let i = 0; i < subOption.sum; i++) {
  //           let QuestionAns = key
  //           dataJSON.push({[questionName]: QuestionAns})
  //         }
  //       } else {
  //         let totalLength;
  //         console.log('data.length==>', dataJSON.length, subOption.total, dataJSON.length < subOption.total)
  //         if (dataJSON.length < subOption.sum) {
  //           totalLength = subOption.sum - dataJSON.length
  //         } else {
  //           totalLength = subOption.sum
  //         }
  //         console.log('data.length==> after', totalLength)
  //         let QuestionAns = key
  //         // dataJSON[questionName]=QuestionAns
  //         dataJSON.map(i => i[questionName] = QuestionAns)
  //         // }
  //         for (let i = 0; i < totalLength; i++) {
  //           dataJSON.push({[questionName]: QuestionAns})
  //         }
  //       }
  //       setDataJSON(dataJSON)
  //       dispatch(setDataJSONConfig(dataJSON))
  //       selectedQuestions.push(item.questionId);
  //       setSelectedQuestions([...selectedQuestions])
  //     }
  //     // for (const questionChoice in value.total) {
  //     //     let QuestionAns = value.filterQuestionChoice[questionChoice].description
  //     //     dataJSON.push({[questionName]:QuestionAns})
  //     // }
  //   }
  //   dispatch(setSelectedQuestion(selectedQuestions))

  //   console.log("dataJSON <<< ", dataJSON)
  // }


  const handleAccordionExpandClick = (questionId) => {
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
  }, [expand])


  return (
      questionData && questionData.map((item, index) => item.questionType === 'MC' && (
              <div key={index} className={'accordianChart'}>
                <Accordion
                    //expanded={expand.includes(item.numericQuestionId)}
                    style={selectedQuestions.includes(item.numericQuestionId) ? {backgroundColor: '#12988A'} : {}}
                    disabled={selectedQuestions.length >= 3 && !selectedQuestions.includes(item.numericQuestionId) ? true : false}>
                  <AccordionSummary
                      expandIcon={<ExpandMoreIcon/>}
                      aria-controls="panel2a-content"
                      id="panel2a-header"
                      onClick={(event) => {
                        handleAccordionExpandClick(item.numericQuestionId)
                      }}
                      className={'questionCardBox'}
                  >
                    <Typography style={selectedQuestions.includes(item.numericQuestionId) ? {color: '#fff'} : {}}>
                      <div style={{margin: '0px 10px'}}>
                        {selectedQuestions.includes(item.numericQuestionId) ? (
                            <img
                                src={MainChartCheckbox}
                                height={"18px"}
                                width={"18px"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // e.target.checked ? setSelectedQuestionsState(item, true) : setSelectedQuestionsState(item, true, "remove")
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
                      <div><span
                          style={{
                            paddingRight: '5px'
                          }}>{item.questionNumber ? item.questionNumber : "-"}</span> {item.questionText ? item.questionText : "-"}
                      </div>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography style={selectedQuestions.includes(item.numericQuestionId) ? {color: '#fff'} : {}}>
                      Select variables to compare:
                    </Typography>
                    <div
                        className={`selectValue ${item.filterQuestionChoice.length > 9 ? (Show ? "full-questions" : "questions-hidden") : "default-questions"
                        }`}
                        style={selectedQuestions.includes(item.numericQuestionId) ? {
                          color: '#fff',
                        } : {}}
                    >
                      <ul>
                        {item.filterQuestionChoice && item.filterQuestionChoice.map(el => (
                            <li>
                              {selectedQuestionsOptionsList[Number(item.numericQuestionId)]?.optionList && selectedQuestionsOptionsList[Number(item.numericQuestionId)].optionList.includes(el.choiceText) ? (
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
                        <Grid container spacing={2} style={{alignItems: 'center'}}>
                          <Grid item xs={6}>
                            <Typography onClick={handleClickMenu}
                                        style={selectedQuestions.includes(item.numericQuestionId) ? {
                                          color: '#fff',
                                          cursor: 'pointer'
                                        } : {cursor: 'pointer'}}>
                              {Show ? "View less" : "View more"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            {Show && <div className='selectOption'
                                          style={selectedQuestions.includes(item.numericQuestionId) ? {color: '#fff'} : {}}>

                              {selectedQuestions.includes(item.numericQuestionId) ? (
                                  <img
                                      src={SubCheckboxSelected}
                                      width={"19px"}
                                      height={"16px"}
                                      onClick={(e) => {
                                        setSelectedQuestionsState(item, true, undefined, "remove");
                                      }}
                                  />
                              ) : (
                                  <img
                                      src={SubCheckboxUnselectedGray}
                                      width={"19px"}
                                      height={"16px"}
                                      onClick={(e) => {
                                        setSelectedQuestionsState(item, true, undefined)
                                      }}
                                  />

                              )}
                              Select All
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
