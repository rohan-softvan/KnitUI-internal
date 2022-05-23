import * as React from 'react';
import {useEffect} from 'react';
import {Grid, Typography} from "@material-ui/core";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Checkbox from '@material-ui/core/Checkbox';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {useDispatch, useSelector} from "react-redux";
import {setDataJSONConfig, setSelectedQuestion, setSelectedQuestionsOptionsList} from '../redux/slice/ChartEditorSlice';
import MainChartCheckbox from '../../../src/assets/images/charteditor/MainChartCheckbox.png';
import MainChartUncheckbox from '../../../src/assets/images/charteditor/MainChartUnheckBox.png';
import SubCheckboxSelected from '../../../src/assets/images/charteditor/SubCheckboxSelected.png';
import SubCheckboxUnselected from '../../../src/assets/images/charteditor/SubCheckboxUnselected.png';

const label = {inputProps: {'aria-label': 'Checkbox demo'}};

export default function QuestionTab() {
  const dispatch = useDispatch()
  const questionData = useSelector(store => store.data.questionCardListBox);
  const selectedQuestionList = useSelector(store => store.chart.selectedQuestionList);
  const selectedQuestionsOptionsList = useSelector(store => store.chart.selectedQuestionsOptionsList);

  const [selectedQuestions, setSelectedQuestions] = React.useState([...selectedQuestionList]);
  const [subOptionSelected, setSubOptionSelected] = React.useState([]);
  const [dataJSON, setDataJSON] = React.useState([])
  const [expand, setExpand] = React.useState([]);
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

  const setSelectedQuestionsState = (value, isQuestion, subOption, type) => {
    console.log('value=>', value)
    console.log('subOption=>', subOption)
    let questionName = value.questionNumber + " " + value.questionName
    let dataJson = JSON.parse(JSON.stringify(dataJSON))
    let optionsList = JSON.parse(JSON.stringify(selectedQuestionsOptionsList))
    let newSelectedQuestionList = selectedQuestions;
    if (isQuestion) {
      console.log("removing ", isQuestion, type)
      if (type && type === "remove") {
        let selectedQuestionsUpdated = selectedQuestions.filter(e => e !== value.numericQuestionId);
        setSelectedQuestions([...selectedQuestionsUpdated])
        let updatedNewJson = dataJSON.filter(function (item) {
          console.log("QUestio nRemove", item[questionName] == questionName)
          return item[questionName] === questionName;
        })
        setDataJSON(updatedNewJson);
        newSelectedQuestionList = selectedQuestionsUpdated
        dispatch(setDataJSONConfig(updatedNewJson))
      } else {
        if (!selectedQuestions.includes(value.numericQuestionId)) {
          selectedQuestions.push(value.numericQuestionId);
          setSelectedQuestions([...selectedQuestions])
          newSelectedQuestionList = selectedQuestions
        }
      }
      // dispatch(setSelectedQuestion([...selectedQuestions]))
      console.log('setSelectedQuestion==>', newSelectedQuestionList)
      dispatch(setSelectedQuestion({
        questionList: newSelectedQuestionList,
        text: questionName,
        questionChoice: value.questionChoice.map(q => q.choiceText)
      }))
    } else {
      console.log("QuestionAns", value, selectedQuestions, "type", type)
      if (type && type === "remove") {
        let updatedNewJson = dataJSON.filter(item => item[questionName] !== subOption.description);
        let updatedOptionsList = optionsList[value.numericQuestionId].filter(opt => opt !== subOption.description);
        let obj = {};
        obj[value.numericQuestionId] = [...updatedOptionsList];
        dispatch(setSelectedQuestionsOptionsList(obj))
        setDataJSON(updatedNewJson)
        dispatch(setDataJSONConfig(updatedNewJson))
      } else {
        let updatedOptionsList = [...optionsList[value.numericQuestionId]];
        updatedOptionsList.push(subOption.description);
        let obj = {};
        obj[value.numericQuestionId] = [...updatedOptionsList];
        console.log("obj:", obj)
        dispatch(setSelectedQuestionsOptionsList(obj))
        if (dataJSON.length <= 0 || selectedQuestions.includes(value.numericQuestionId)) {
          for (let i = 0; i < subOption.total; i++) {
            let QuestionAns = subOption.description
            dataJSON.push({[questionName]: QuestionAns})
          }
        } else {
          let totalLength;
          console.log('data.length==>', dataJSON.length, subOption.total, dataJSON.length < subOption.total)
          if (dataJSON.length < subOption.total) {
            totalLength = subOption.total - dataJSON.length
          } else {
            totalLength = subOption.total
          }
          console.log('data.length==> after', totalLength, subOptionSelected)
          let QuestionAns = subOption.description
          // dataJSON[questionName]=QuestionAns
          // dataJSON.map(i=>i[questionName]=QuestionAns)
          // }
          for (let i = 0; i < totalLength; i++) {
            dataJSON.push({[questionName]: QuestionAns})
          }
        }
        setDataJSON(dataJSON)
        dispatch(setDataJSONConfig(dataJson))
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
            questionChoice: value.questionChoice.map(q => q.choiceText)
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
          console.log("QUestio nRemove", item[questionName] == questionName)
          return item[questionName] == questionName;
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
            dataJSON.push({[questionName]: QuestionAns})
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
            dataJSON.push({[questionName]: QuestionAns})
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
      questionData && questionData.map((item, index) => item.questionType === 'MC' ? (
                  <div key={index} className={'accordianChart'}>
                    <Accordion
                        //expanded={expand.includes(item.numericQuestionId)}
                        style={selectedQuestionList.includes(item.numericQuestionId) ? {backgroundColor: '#12988A'} : {}}>
                      <AccordionSummary
                          expandIcon={<ExpandMoreIcon/>}
                          aria-controls="panel2a-content"
                          id="panel2a-header"
                          onClick={() => {
                            handleAccordionExpandClick(item.numericQuestionId)
                          }}
                          className={'questionCardBox'}
                      >
                        <Typography style={selectedQuestionList.includes(item.numericQuestionId) ? {color: '#fff'} : {}}>
                          <div style={{margin: '0px 10px'}}>
                            {selectedQuestionList.includes(item.numericQuestionId) ? (
                                <img
                                    src={MainChartCheckbox}
                                    height={"20px"}
                                    width={"20px"}
                                    onClick={(e) => {
                                      // e.stopPropagation();
                                      console.log("removing ")
                                      setSelectedQuestionsState(item, true, undefined, "remove");
                                    }}
                                />
                            ) : (
                                <img
                                    src={MainChartUncheckbox}
                                    height={"20px"}
                                    width={"20px"}
                                    onClick={(e) => {
                                      // e.stopPropagation();
                                      setSelectedQuestionsState(item, true, undefined);
                                    }}
                                />
                            )}
                            {/*<Checkbox {...label} />*/}
                          </div>
                          <div style={{display: 'flex'}}><span
                              style={{
                                paddingRight: '5px',
                                minWidth: '40px'
                              }}>{item.questionNumber ? item.questionNumber : "-"}</span> {item.questionText ? item.questionText : "-"}
                          </div>
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography style={selectedQuestions.includes(item.numericQuestionId) ? {color: '#fff'} : {}}>
                          Select variables to compare:
                        </Typography>
                        <div
                            className={`selectValue ${
                                item.filterQuestionChoice.length > 9 ? (Show ? "full-questions" : "questions-hidden") : "default-questions"
                            }`}
                            style={selectedQuestions.includes(item.numericQuestionId) ? {
                              color: '#fff',
                            } : {}}
                        >
                          <ul>
                            {/*{console.log("Checked List Length",item.filterQuestionChoice.length >= 9)}*/}
                            {item.filterQuestionChoice && item.filterQuestionChoice.map(el => (
                                <li>
                                  {/*{console.log("filterQuestionChoice1: ", item.numericQuestionId)}*/}
                                  {/*{console.log("filterQuestionChoice11: ", selectedQuestionsOptionsList)}*/}
                                  {/*{console.log("filterQuestionChoice2: ", selectedQuestionsOptionsList[item.numericQuestionId])}*/}
                                  {/*{console.log("filterQuestionChoice3: ", selectedQuestionsOptionsList[item.numericQuestionId]?.includes(el.choiceText))}*/}
                                  {selectedQuestionsOptionsList[Number(item.numericQuestionId)]?.includes(el.choiceText) ? (
                                      <img
                                          src={SubCheckboxSelected}
                                          width={"23px"}
                                          height={"20px"}
                                          {...el.choiceText}
                                          onClick={(e) => {
                                            setSelectedQuestionsState(item, false, el, "remove")
                                          }}
                                      />
                                  ) : (
                                      <img
                                          src={SubCheckboxUnselected}
                                          width={"23px"}
                                          height={"20px"}
                                          {...el.choiceText}
                                          onClick={(e) => {
                                            setSelectedQuestionsState(item, false, el)
                                          }}
                                      />

                                  )}

                                  {/*<Checkbox checked={selectedQuestionsOptionsList[Number(item.numericQuestionId)]?.includes(el.choiceText)} {...el.choiceText} onClick={(e) => {*/}
                                  {/*  e.target.checked ? setSelectedQuestionsState(item, false, el) : setSelectedQuestionsState(item, false, el, "remove")*/}
                                  {/*}}/>*/}
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
                                  {/*<RadioGroup*/}
                                  {/*    row*/}
                                  {/*    aria-labelledby="demo-row-radio-buttons-group-label"*/}
                                  {/*    name="row-radio-buttons-group"*/}
                                  {/*>*/}
                                  {/*    <FormControlLabel value="select" control={<Radio />} label="Select all" />*/}
                                  {/*    <FormControlLabel value="deselect" control={<Radio />} label="De-select all" />*/}
                                  {/*</RadioGroup>*/}
                                  <Checkbox/> Select All
                                </div>}
                              </Grid>
                            </Grid>
                        }
                      </AccordionDetails>
                    </Accordion>
                  </div>
              ) :
              item.graphType === "stack_bar_chart" || item.graphType === "multi_column_bar_chart" &&
              (
                  <div key={index} className={'accordianChart'}>
                    <div className={'noAccordian'}>
                      <Typography style={selectedQuestions.includes(1) ? {color: '#fff'} : {}}>
                        <Checkbox
                            {...label}
                            onClick={(e) => {
                              e.target.checked ? setSelectedQuestionsState(1) : setSelectedQuestionsState(1, false, undefined, "remove")
                            }}/>
                        <span>{item.questionNumber ? item.questionNumber : "-"}</span> {item.questionText ? item.questionText : "-"}
                      </Typography>
                      <div className='withoutAccordian'>
                        <ul>
                          {Object.entries(item.filterGraphData).map(([key, value]) => {
                            return <li><Checkbox {...key} onClick={(e) => {
                              e.target.checked ? setSelectedQuestionsStateForGraphType(item, value, key, false) : setSelectedQuestionsStateForGraphType(item, value, key, false, "remove")
                            }}/> {key}</li>
                          })
                          }
                        </ul>
                      </div>
                    </div>
                  </div>)
      )

  );
}
