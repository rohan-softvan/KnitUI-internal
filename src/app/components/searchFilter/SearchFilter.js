import React, { useState,Component } from "react";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "../../../assets/images/search/search.svg";
import ButtonComponent from "../button/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper/Paper";
import {
  Typography,
  withStyles,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Tooltip
} from "@material-ui/core";
import Popper from "@material-ui/core/Popper/Popper";
import Button from "@material-ui/core/Button";
import NextIcon from "../../../assets/images/search/right.svg";
import PreviousIcon from "../../../assets/images/search/previous-arrow.svg";
import "./SearchFilter.scss";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import ChipText from "../common/ChipText";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import {getResponseQuestions} from './../../services/SearchFilterService';
import {getThemeDetails} from './../../services/VideoService';
import { setThemeDetails} from '../../redux/slice/DataSlice'
import ThemeColor from "../../config/ThemeColorConfig";
import { connect } from 'react-redux';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import { ContactsOutlined } from "@material-ui/icons";
import { CostExplorer } from "aws-sdk";
import subSelected from "../../../assets/images/search/subSelected.png"
import CloseIcon from '@material-ui/icons/Close';
import { navItem } from "@aws-amplify/ui";
import {store} from '../../redux/store/index'

const CustomCheckbox = withStyles({
  root: {
    color: "#1F4271",
    "&$checked": {
      color: "#1F4271",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

let mainSearch = [
  // {
  //   name: "Demographics",
  //   key: 1,
  //   subName: [
  //     {
  //       name: "Gender",
  //       key: 1,
  //       type: "dropdown",
  //       isSubName: true,
  //       subName: [
  //         {
  //           name: "Male",
  //           type: "checkbox",
  //           isChecked: false,
  //         },
  //         {
  //           name: "Female",
  //           type: "checkbox",
  //           isChecked: true,
  //         },
  //         {
  //           name: "Other",
  //           type: "checkbox",
  //           isChecked: false,
  //         },
  //       ],
  //     },
  //     {
  //       name: "Age",
  //       type: "dropdown",
  //       isSubName: true,
  //       key: 2,
  //       subName: [
  //         {
  //           name: "From",
  //           type: "textbox",
  //         },
  //         {
  //           name: "To",
  //           type: "textbox",
  //         },
  //       ],
  //     },
  //     {
  //       name: "Ethnicity",
  //       type: "dropdown",
  //       isSubName: true,
  //       key: 3,
  //       subName: [
  //         {
  //           name: "Mexican",
  //           type: "checkbox",
  //           isChecked: false,
  //         },
  //         {
  //           name: "Asian",
  //           type: "checkbox",
  //           isChecked: true,
  //         },
  //         {
  //           name: "Caucasian",
  //           type: "checkbox",
  //           isChecked: false,
  //         },
  //         {
  //           name: "American Indian",
  //           type: "checkbox",
  //           isChecked: true,
  //         },
  //         {
  //           name: "African American",
  //           type: "checkbox",
  //           isChecked: false,
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    name: "Response to question",
    key: 2,
    subName:[]
    // subName: [
    //   {
    //     name: "Quant question is written here a...",
    //     isSubName: false,
    //     key: 1,
    //     subName: null,
    //   },
    //   {
    //     name: "Quant question is written here a...",
    //     isSubName: false,
    //     key: 2,
    //     subName: [
    //       {
    //         name: "Text in transcript",
    //         key: "Res1",
    //         subName: [
    //           {
    //             name: "Filter by text",
    //             type: "textbox",
    //           },
    //         ],
    //       },
    //       {
    //         name: "Sentiments",
    //         key: "Res2",
    //         subName: [
    //           {
    //             name: "Male",
    //             type: "checkbox",
    //             isChecked: false,
    //           },
    //           {
    //             name: "Female",
    //             type: "checkbox",
    //             isChecked: true,
    //           },
    //           {
    //             name: "Other",
    //             type: "checkbox",
    //             isChecked: false,
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // ],
  },
  {
    name: "Video Themes",
    key: 3,
    subName:[]
    // subName: [
    //   {
    //     name: "Theme 1",
    //     type: "theme",
    //     key: 1,
    //     color: "#13988A",
    //     isSubName: false,
    //   },
    //   {
    //     name: "Theme 2",
    //     type: "theme",
    //     key: 2,
    //     color: "#D14926",
    //     isSubName: false,
    //   },
    //   {
    //     name: "Theme 3",
    //     type: "theme",
    //     key: 3,
    //     color: "#F5C82A",
    //     isSubName: false,
    //   },
    // ],
  },
  {
    name: "Video Duration",
    key: 4,
    subName: [
      {
        lable:"From (seconds)",
        name: "videoDurationFrom",
        type: "textBox",
      },
      {
        lable:"To (seconds)",
        name: "videoDurationTo",
        type: "textBox",
      },
    ],
  },
  {
    name: "Date Range",
    key: 5,
    subName: [
      {
        name: "dateFrom",
        lable: "From",
        type: "date",
      },
      {
        name: "dateTo",
        lable: "To",
        type: "date",
      },
    ],
  },
  {
    name: "Starred",
    key: 6,
    subName: [
      {
        name: "Starred",
        type: "radio",
        key: 1,
        isSelected:true 
      },
      {
        name: "Not Starred",
        type: "radio",
        key: 2,
        isSelected:false 
      },
    ],
  },
];


const QUALITATIVEDATA=[
  {
    name: "Response to question",
    key: 2,
    subName: [
      {
        name: "Quant question is written here a...",
        isSubName: false,
        key: 1,
        subName: [
          {
            name: "Text in transcript",
            key: "Res1",
            subName: [
              {
                name: "Search for text and press enter",
                type: "textbox",
                chipText:[
                  "ABC",
                  "XYZ"
                ]
              },
            ],
          },
          {
            name: "Sentiments",
            key: "Res2",
            subName: [
              {
                name: "Male",
                type: "checkbox",
                isChecked: false,
              },
              {
                name: "Female",
                type: "checkbox",
                isChecked: true,
              },
              {
                name: "Other",
                type: "checkbox",
                isChecked: false,
              },
            ],
          },
        ],
      },
      {
        name: "Quant question is written here a...",
        isSubName: false,
        key: 2,
        subName: [
          {
            name: "Text in transcript",
            key: "Res1",
            subName: [
              {
                name: "Search for text and press enter",
                type: "textbox",
              },
            ],
          },
          {
            name: "Sentiments",
            key: "Res2",
            subName: [
              {
                name: "Male",
                type: "checkbox",
                isChecked: false,
              },
              {
                name: "Female",
                type: "checkbox",
                isChecked: true,
              },
              {
                name: "Other",
                type: "checkbox",
                isChecked: false,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Video Themes",
    key: 3,
    subName:[]
  },
  {
    name: "Video Duration",
    key: 4,
    subName: [
      {
        lable:"From (seconds)",
        name: "videoDurationFrom",
        type: "textBox",
      },
      {
        lable:"To (seconds)",
        name: "videoDurationTo",
        type: "textBox",
      },
    ],
  },
  {
    name: "Date Range",
    key: 5,
    subName: [
      {
        name: "dateFrom",
        lable: "From",
        type: "date",
      },
      {
        name: "dateTo",
        lable: "To",
        type: "date",
      },
    ],
  },
  {
    name: "Starred",
    key: 6,
    subName: [
      {
        name: "Starred",
        type: "radio",
        key: 1,
        isSelected:true
      },
      {
        name: "Not Starred",
        type: "radio",
        key: 2,
        isSelected:false
      },
    ],
  },
];

const QUANTITATIVEDATA=[
  {
    name: "Response to question",
    key: 2,
    subName: [
      {
        name: "Quant question is written here a...",
        isSubName: false,
        key: 1,
        subName: [
          {
            name: "Text in transcript",
            key: "Res1",
            subName: [
              {
                name: "Search for text and press enter",
                type: "textbox",
                chipText:[
                  "ABC",
                  "XYZ"
                ]
              },
            ],
          },
          {
            name: "Sentiments",
            key: "Res2",
            subName: [
              {
                name: "Male",
                type: "checkbox",
                isChecked: false,
              },
              {
                name: "Female",
                type: "checkbox",
                isChecked: true,
              },
              {
                name: "Other",
                type: "checkbox",
                isChecked: false,
              },
            ],
          },
        ],
      },
      {
        name: "Quant question is written here a...",
        isSubName: false,
        key: 2,
        subName: [
          {
            name: "Search for text and press enter",
            key: "Res1",
            subName: [
              {
                name: "Filter by text",
                type: "textbox",
              },
            ],
          },
          {
            name: "Sentiments",
            key: "Res2",
            subName: [
              {
                name: "Male",
                type: "checkbox",
                isChecked: false,
              },
              {
                name: "Female",
                type: "checkbox",
                isChecked: true,
              },
              {
                name: "Other",
                type: "checkbox",
                isChecked: false,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Date Range",
    key: 5,
    subName: [
      {
        name: "dateFrom",
        lable: "From",
        type: "date",
      },
      {
        name: "dateTo",
        lable: "To",
        type: "date",
      },
    ],
  },
  {
    name: "Starred",
    key: 6,
    subName: [
      {
        name: "Starred",
        type: "radio",
        key: 1,
        isSelected:true
      },
      {
        name: "Not Starred",
        type: "radio",
        key: 2,
        isSelected:false
      },
    ],
  },
];

const BOTHDATA=[
  {
    name: "Response to question",
    key: 2,
    subName:[]
    // subName: [
    //   {
    //     name: "Quant question is written here a...",
    //     isSubName: false,
    //     key: 1,
    //     subName: [
    //       {
    //         name: "Text in transcript",
    //         key: "Res1",
    //         subName: [
    //           {
    //             name: "Filter by text",
    //             type: "textbox",
    //             chipText:[
    //               "ABC",
    //               "XYZ"
    //             ]
    //           },
    //         ],
    //       },
    //       {
    //         name: "Sentiments",
    //         key: "Res2",
    //         subName: [
    //           {
    //             name: "Male",
    //             type: "checkbox",
    //             isChecked: false,
    //           },
    //           {
    //             name: "Female",
    //             type: "checkbox",
    //             isChecked: true,
    //           },
    //           {
    //             name: "Other",
    //             type: "checkbox",
    //             isChecked: false,
    //           },
    //         ],
    //       },
    //     ],
    //   },
    //   {
    //     name: "Quant question is written here a...",
    //     isSubName: false,
    //     key: 2,
    //     subName: [
    //       {
    //         name: "Text in transcript",
    //         key: "Res1",
    //         subName: [
    //           {
    //             name: "Filter by text",
    //             type: "textbox",
    //           },
    //         ],
    //       },
    //       {
    //         name: "Sentiments",
    //         key: "Res2",
    //         subName: [
    //           {
    //             name: "Male",
    //             type: "checkbox",
    //             isChecked: false,
    //           },
    //           {
    //             name: "Female",
    //             type: "checkbox",
    //             isChecked: true,
    //           },
    //           {
    //             name: "Other",
    //             type: "checkbox",
    //             isChecked: false,
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // ],
  },
  {
    name: "Video Themes",
    key: 3,
    subName:[]
  },
  {
    name: "Video Duration",
    key: 4,
    subName: [
      {
        lable:"From (seconds)",
        name: "videoDurationFrom",
        type: "textBox",
      },
      {
        lable:"To (seconds)",
        name: "videoDurationTo",
        type: "textBox",
      },
    ],
  },
  {
    name: "Date Range",
    key: 5,
    subName: [
      {
        name: "dateFrom",
        lable: "From",
        type: "date",
      },
      {
        name: "dateTo",
        lable: "To",
        type: "date",
      },
    ],
  },
  {
    name: "Starred",
    key: 6,
    subName: [
      {
        name: "Starred",
        type: "radio",
        key: 1,
        isSelected:true
      },
      {
        name: "Not Starred",
        type: "radio",
        key: 2,
        isSelected:false
      },
    ],
  },
];


function setOpacity(level){
  if(level == 1){
      return "1";
  }else if(level == 2){
    return "0.7";
  }else if(level == 3){
    return "0.4"
  }else{
    return "0.2"
  }
}

let selectedThemeNames="";
let selectedThemeSequence="";
class SearchFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    anchorEl: null,
    isSelectedQuestion: false,
    selectedQuestionAnswer: [],
    selectedRadioValue: '',
    isThemeSelected:false,
    searchFilterData:[],
    allResponseQuestions: null,
      questionChoiceValues: [],
      textTranscript:[],
      selectedMultiChoices: [],
    dateFrom: null,
    dateTo: null,
    videoDurationFrom: null,
    videoDurationTo: null,
    videoDurationToErrorShow: false,
    videoDurationFromErrorShow: false,
    videoDurationFromErrorMsg: null,
    videoDurationToErrorMsg: null,
    selectedSubTheme: [],
    parentTheme: [],
    selectedThemes: [],
    subThemeList:[],
    selectedThemetags:[],
    tagList:[],
    selectedParentTheme:[],
    totalAppliedFilter:0,
      selectedTextTranscript: [],
      mcRadioFilter: [],
      mcMultiSelectFilter: [],
      dbORTESelectFilter: [],
      intOrFloatSelectFilter: [],
      searchText:'',
      showStartRangeError: false,
      showEndRangeError: false,
      startRangeErrorMsg: '',
      endRangeErrorMsg: '',
      selectedSentiments: [],
      intFloatErrorObj: [],
      subThemeListName:[],
      tagListName:[],
      themeListName:[],
      updatedData:[],
      totalFilterCounts: 0,
      totalFilterCountObj: {},
      totalCount:0
    };
  }

  componentDidMount() {
    if(this.props.totalCount){
      this.setState({totalCount:this.props.totalCount})
    }
      
    // if(this.props.projectId){
    //   if(this.props.themeDetails.length <= 0){
    //   }
    // }
    this.getAllThemeDetails()

    // const event = document.addEventListener('create_remove_delete');
    document.addEventListener('remove_filter',e=>this.onClearFilter())
    document.addEventListener('create_remove_delete',
            e => this.setState({updatedData:e.detail.removedDataState,
              typeStateData: e.detail.type},()=>{
                if(this.props.totalCount != null){
                  this.setState({totalCount:this.props.totalCount})
                }
       let updatedData = this.state.updatedData;
      let typeStateData = this.state.typeStateData;
      updatedData.forEach(updatedObj => {
        if (updatedObj.hasOwnProperty("is_video_duration") && updatedObj['is_video_duration']) {
          this.setState({
            videoDurationFrom: null,
            videoDurationTo: null
          },()=>{
            this.checkCounts();
          })
        }
        if (updatedObj.hasOwnProperty("is_response_datetime") && updatedObj['is_response_datetime']) {
          this.setState({
            dateFrom: null,
            dateTo: null
          },()=>{
            this.checkCounts();
          })
        }
        if (updatedObj.hasOwnProperty("is_favourite") ) {
          this.setState({
            selectedRadioValue: '',
          },()=>{
            this.checkCounts();
          })
        }

        if(updatedObj.hasOwnProperty("is_video_themes") && updatedObj.type == "THEMES"){
          let mainParentThemeList=this.state.selectedParentTheme.length
          let newThemeName=this.state.selectedParentTheme.filter(el => el != updatedObj.filter_request);
          this.setState({selectedParentTheme : newThemeName})
          if(mainParentThemeList ==  newThemeName.length){
            let newSubThemeList=this.state.subThemeList.filter(el => el != updatedObj.filter_request);
            this.setState({subThemeList : newSubThemeList},()=>{
              this.checkCounts();
            })
          }
        }

        if(updatedObj.hasOwnProperty("is_video_themes") && updatedObj.type == "TAGS"){
          let tagListName=this.state.tagList.filter(el => el != updatedObj.filter_request);
          this.setState({tagList : tagListName},()=>{
            this.checkCounts();
          })
        }

        if (updatedObj.hasOwnProperty("is_request_to_response")) {
          if(updatedObj.generic_data_type == "INTEGER"){
            let newRange=this.state.intOrFloatSelectFilter.filter(el => el.numeric_question_id != updatedObj.numeric_question_id);
            this.setState({intOrFloatSelectFilter: newRange},()=>{
              this.checkCounts();
            })
          }

          if(updatedObj.question_type == "TE" || updatedObj.question_type == "DB"){
            let newRange=this.state.dbORTESelectFilter.filter(el => el.numeric_question_id != updatedObj.numeric_question_id);
            this.setState({dbORTESelectFilter: newRange},()=>{
              this.checkCounts();
            })
          }

          // if(updatedObj.question_type == "TE" || updatedObj.question_type == "DB"){
          //   let newRange=this.state.dbORTESelectFilter.filter(el => el.numeric_question_id != updatedObj.numeric_question_id);
          //   this.setState({dbORTESelectFilter: newRange})
          // }


          if(updatedObj.question_type == "FileUpload"){
            // let newRange=this.state.dbORTESelectFilter.filter(el => el.numeric_question_id != updatedObj.numeric_question_id);
            // this.setState({dbORTESelectFilter: newRange})
            this.checkCounts();
         
          }

        }
      })
    }));

    let projectType = localStorage.getItem("projectType")
    if(this.props.searchData){
      this.setState({searchFilterData:this.props.searchData})
      mainSearch=this.props.searchData
    }else{
      if(projectType=== "QUALITATIVE"){
        this.setState({searchFilterData:QUALITATIVEDATA})
        mainSearch=QUANTITATIVEDATA
      } else if(projectType=== "QUANTITATIVE"){
        this.setState({searchFilterData:QUANTITATIVEDATA})
        mainSearch=QUANTITATIVEDATA
        }else if(projectType=== "BOTH"){
        this.setState({searchFilterData:BOTHDATA})
        mainSearch=BOTHDATA
        }else {
          this.setState({searchFilterData:mainSearch})
      }
    
    }


  }

  componentDidUpdate(prevProps, prevState) {

    if (prevProps.totalCount !== this.props.totalCount) {
      this.setState({totalCount:this.props.totalCount})
    }
  }

  getAllThemeDetails=()=>{
    getThemeDetails(this.props.projectId).then((response) => {
      this.props.setThemeDetails(response.data)
    if(response.data){
      let themeList=[];
      for(let i in response.data){
        themeList.push({
          id:response.data[i]._id,
          key:response.data[i]._id,
          name:response.data[i].title,
          color:ThemeColor(response.data[i].sequence,response.data[i].level),
          level:response.data[i].level,
          type: "theme",
          isSelected:false,
          parentId:response.data[i].sequence,
          parentTitle:response.data[i].title,
          subName:this.checkAndGenerateChildTag(response.data[i].children,response.data[i].sequence,response.data[i].title,response.data[i]._id),
          tags:this.checkAndGenerateChildTag(response.data[i].tags,response.data[i].sequence,response.data[i].title,response.data[i]._id)
        })
      }
      mainSearch[1].subName=themeList;
     }
    })
  }

  checkAndGenerateChildTag=(childList,parentId,title,parentKey)=>{
    let child=[];
    if(child){
      // title+=title;
      for(let i in childList){
        let newTitle=title+" > "+ childList[i].title
        child.push({
          id: childList[i]._id,
          color: ThemeColor(parentId,setOpacity(childList[i].level)),
          level: childList[i].level,
          parentId: parentId,
          name: childList[i].title,
          parentKey:parentKey,
          isSelected:false,
          parentTitle:newTitle,
          subName:this.checkAndGenerateChildTag(childList[i].children,parentId,newTitle,parentKey),
          tags:this.checkAndGenerateChildTag(childList[i].tags,parentId,newTitle,parentKey)
        })
        // title+=childList[i].title;
      }
    }
    return child;
  }


  handleClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
      open: !this.state.open,
    });
  };

  handleRadioChange = (event) => {
    this.setState({
      selectedRadioValue: event.target.value
    },()=>{this.checkCounts()})
  }

  handleRadioChangeQuestionChoice = (selectedSubSearch, event) => {
    let { value} = event.target;

    let { questionId, questionSelector, genericType, type, numericQuestionId } = selectedSubSearch;
    let mcRadioFilter = this.state.mcRadioFilter || [];
    let pushObj = (type, questionSelector, questionId, value, genericType, numericQuestionId) => {
      let radioObj = {
        "is_request_to_response": true,
        "question_type" : type,
        "question_selector" : questionSelector,
        "question_id": questionId,
        "filter_request": value,
        "generic_data_type": genericType,
        "numeric_question_id": numericQuestionId
      }
      mcRadioFilter.push(radioObj)
    }
    if (mcRadioFilter.length > 0) {
      let foundIndex = mcRadioFilter.findIndex(item => item.numeric_question_id == numericQuestionId);
      if (foundIndex !== -1) {
        mcRadioFilter[foundIndex]['filter_request'] = value;
      } else {
        pushObj(type, questionSelector, questionId, value, genericType, numericQuestionId);
      }
    } else {
      pushObj(type, questionSelector, questionId, value, genericType, numericQuestionId);
    }
    this.setState({mcRadioFilter: mcRadioFilter })
  }


  handleMultiSelectQuestionChoice = (selectedSubSearch, event) => {
    let { checked, name } = event.target;
    let { questionId, questionSelector, genericType, type, numericQuestionId } = selectedSubSearch;
    let mcMultiSelectFilter = this.state.mcMultiSelectFilter || [];
    let pushObj = (type, questionSelector, questionId, value, genericType, numericQuestionId) => {
      let filterObj = {
        "is_request_to_response": true,
        "question_type" : type,
        "question_selector" : questionSelector,
        "question_id": questionId,
        "filter_request": value,
        "generic_data_type": genericType,
        "numeric_question_id": numericQuestionId
      }
      mcMultiSelectFilter.push(filterObj);
    }
    if (mcMultiSelectFilter.length > 0) {
      let foundIndex = mcMultiSelectFilter.findIndex(item => item.numeric_question_id == numericQuestionId);
      if (foundIndex !== -1) {
        if (checked && !mcMultiSelectFilter[foundIndex]['filter_request'].some(item => item == name)) {
          mcMultiSelectFilter[foundIndex]['filter_request'].push(name);
        } else {
          mcMultiSelectFilter[foundIndex]['filter_request'] =
              mcMultiSelectFilter[foundIndex]['filter_request'].filter(item => item !== name);
        }
      } else {
        pushObj(type, questionSelector, questionId, [name], genericType, numericQuestionId);
      }
    } else {
      pushObj(type, questionSelector, questionId, [name], genericType, numericQuestionId);
    }
    this.setState({mcMultiSelectFilter: mcMultiSelectFilter }, () => this.checkCounts())
  }

  handleDateSelect = (event,name) => {
    this.setState({
        [name]: event.target.value
    },()=>{
      this.checkCounts()
    })
  }

   //convert Epoch date to date/ set in the formate
   epochDate = (epochTime) => {
    if(epochTime){
      let newTime=epochTime.toString();
      let epoch = new Date(newTime).getTime()/1000
      return epoch;
    }

  };


  checkCounts = () => {
    let totalFilterCountObj = this.state.totalFilterCountObj;
    let {
      selectedSentiments, selectedTextTranscript,
      videoDurationFrom, videoDurationTo, dateFrom, dateTo, selectedRadioValue,
      mcMultiSelectFilter, dbORTESelectFilter, intOrFloatSelectFilter, subThemeList, tagList, selectedParentTheme
    } = this.state;


    if (videoDurationFrom || videoDurationTo) {
      totalFilterCountObj['videoDurationFrom'] = 1
    } else if (totalFilterCountObj.hasOwnProperty('videoDurationFrom') && !videoDurationFrom && !videoDurationTo) {
      totalFilterCountObj['videoDurationFrom'] = 0
    }

    // if (videoDurationTo) {
    //   totalFilterCountObj['videoDurationTo'] = 1
    // } else if (totalFilterCountObj.hasOwnProperty('videoDurationTo') && !videoDurationTo) {
    //   totalFilterCountObj['videoDurationTo'] = 0
    // }

    if (dateFrom || dateTo) {
      totalFilterCountObj['dateFrom'] = 1
    } else {
      totalFilterCountObj['dateFrom'] = 0
    }

    // if (dateTo) {
    //   totalFilterCountObj['dateTo'] = 1
    // }

    if (selectedRadioValue) {
      totalFilterCountObj['selectedRadioValue'] = 1
    } else {
      totalFilterCountObj['selectedRadioValue'] = 0
    }

    if (Array.isArray(selectedSentiments)) {
      let totalSentimentsCount = 0;
      selectedSentiments.forEach(sentiment => {
        totalSentimentsCount += sentiment.filter_request.length
      })
      totalFilterCountObj['selectedSentiments'] = totalSentimentsCount;
    }

    if (Array.isArray(selectedTextTranscript)) {
      let totalTransCount = 0;
      selectedTextTranscript.forEach(tranScript => {
        totalTransCount += tranScript.filter_request.length
      })
      totalFilterCountObj['textTranscript'] = totalTransCount;
    }

    if (Array.isArray(mcMultiSelectFilter)) {
      let totalMCCount = 0;
      mcMultiSelectFilter.forEach(mcFilter => {
        totalMCCount += mcFilter.filter_request.length
      })
      totalFilterCountObj['mcMultiSelectFilter'] = totalMCCount;
    }

    if (Array.isArray(dbORTESelectFilter)) {
      let totalDBOrTECount = 0;
      dbORTESelectFilter.forEach(dbFilter => {
        if (dbFilter.filter_request) {
          totalDBOrTECount += 1
        }
      })
      totalFilterCountObj['dbORTESelectFilter'] = totalDBOrTECount;
    }

      if (Array.isArray(intOrFloatSelectFilter)) {
        let totalIntOrFloatCount = 0;
        intOrFloatSelectFilter.length > 0 &&  intOrFloatSelectFilter.forEach(dbFilter => {
          if (dbFilter.filter_request) {
            if ((dbFilter.filter_request.hasOwnProperty('start_range') && dbFilter.filter_request['start_range'])
            || dbFilter.filter_request.hasOwnProperty('end_range') && dbFilter.filter_request['end_range']) {
              totalIntOrFloatCount += 1
            }
            // if (dbFilter.filter_request.hasOwnProperty('end_range') && dbFilter.filter_request['end_range']) {
            //   totalIntOrFloatCount += 1
            // }
          }
        })
        totalFilterCountObj['intOrFloatSelectFilter'] = totalIntOrFloatCount;
      }

    if (Array.isArray(subThemeList) &&
        subThemeList.length) {
      totalFilterCountObj['subThemeList'] = subThemeList.length;
    } else {
      totalFilterCountObj['subThemeList'] = 0;
    }

    if (Array.isArray(tagList) &&
        tagList.length) {
      totalFilterCountObj['tagList'] = tagList.length;
    } else {
      totalFilterCountObj['tagList'] = 0;
    }

    if (Array.isArray(selectedParentTheme) &&
        selectedParentTheme.length) {
      totalFilterCountObj['selectedParentTheme'] = selectedParentTheme.length;
    } else {
      totalFilterCountObj['selectedParentTheme'] = 0;
    }
    if(Object.keys(totalFilterCountObj).length > 0){
     this.setState({totalCount:Object.values(totalFilterCountObj).reduce((a, b) => a + b)})
    }    
      this.setState({totalFilterCountObj: totalFilterCountObj})
  }

  onSearch = (event) => {
    let count=0;
    this.setState({open:false})
    // event.preventDefault();
    let { dateFrom, dateTo, videoDurationFrom, videoDurationTo, selectedRadioValue, selectedParentTheme,tagList,subThemeList} = this.state;
    let user_data=[]
    if(tagList.length > 0){
      for(let i in tagList){
        user_data.push({
          "is_video_themes": true,
          "type": "TAGS",
          "filter_request": tagList[i]
          })
        }
      }
      if(subThemeList.length > 0){
        for(let j in subThemeList){
          user_data.push({
            "is_video_themes": true,
            "type": "THEMES",
            "filter_request": subThemeList[j]
          })
        }
      }
      if(selectedParentTheme.length > 0){
        for(let i in selectedParentTheme){
          user_data.push({
            "is_video_themes": true,
            "type": "THEMES",
            "filter_request": selectedParentTheme[i]
          })
        }
      }
      if(videoDurationFrom || videoDurationTo){
        user_data.push({
          "is_video_duration": true,
          "start_range": videoDurationFrom != null && Number(videoDurationFrom) != 0 ? Number(videoDurationFrom): 0,
          "end_range" : videoDurationTo != null &&  Number(videoDurationTo) != 0 ? Number(videoDurationTo): 0
        })
      }
      if(dateFrom || dateTo){
        let epochFrom= dateFrom ? this.epochDate(dateFrom) : 0;
        let epochTo= dateTo ? this.epochDate(dateTo) : 0;

        if(epochFrom != 0 || epochTo != 0){
          user_data.push({
            "is_response_datetime": true,
            "start_date": epochFrom,
            "end_date" :epochTo
          })
        }
      }
   
      if(selectedRadioValue != null && selectedRadioValue != ""){
        // append isStarred value
        if(selectedRadioValue == "Starred"){
          user_data.push({
            "is_favourite":true
          })
        }else{
          user_data.push({
            "is_favourite":false
          })
        }
      }

      if(this.state.dbORTESelectFilter.length > 0){
        // user_data.push(this.state.dbORTESelectFilter);
      for(let i in this.state.dbORTESelectFilter){
        user_data.push(this.state.dbORTESelectFilter[i]);
        }
      }


      if(this.state.selectedTextTranscript.length > 0){
        for(let i in this.state.selectedTextTranscript){
          user_data.push(this.state.selectedTextTranscript[i]);
          }
      }


      if(this.state.mcRadioFilter.length > 0){
        for(let i in this.state.mcRadioFilter){
          user_data.push(this.state.mcRadioFilter[i]);
          }
      }
      
      if(this.state.mcMultiSelectFilter.length > 0){
        for(let i in this.state.mcMultiSelectFilter){
          user_data.push(this.state.mcMultiSelectFilter[i]);
          }
      }
      
      if(this.state.intOrFloatSelectFilter.length > 0){
        for(let i in this.state.intOrFloatSelectFilter){
          user_data.push(this.state.intOrFloatSelectFilter[i]);
          }
      }

       
      if(this.state.selectedSentiments.length > 0){
        for(let i in this.state.selectedSentiments){
          user_data.push(this.state.selectedSentiments[i]);
          }
      }



      let mainFilterList=[]
      for(let i in user_data){
        mainFilterList.push(user_data[i])
      }
      this.props.onSearch(mainFilterList,this.state.searchText,this.state.subThemeListName,this.state.tagListName ,this.state.themeListName)
    }


  onClearFilter = () => {
    // event.preventDefault();
    this.setState({dateFrom: null, dateTo: null, videoDurationFrom: null, videoDurationTo: null, selectedRadioValue: null,selectedSubTheme:[],selectedThemetags:[],
      selectedTextTranscript: [],  selectedSentiments: [], dbORTESelectFilter: [], mcMultiSelectFilter: [], mcRadioFilter: [], searchText: "",
      intOrFloatSelectFilter: [], selectedParentTheme:[],subThemeList:[],tagList:[],totalAppliedFilter:0,isThemeQuestionSelected:false,parentTheme:[],open:false,totalCount:0},()=>{
        this.props.onClear()
        this.checkCounts()
      })
  }

  handleSearch = (data) => {
    let obj;
    if (data == "Res1" || data == "Res2") {
      obj = this.state.selectedSubSearch.subName.find(
        (item) => item.key === data
        );
        this.setState({ selectedQuestionAnswer: obj });
      } else {
        obj = mainSearch.find((item) => item.key === data);
      this.setState({ selectedSearch: obj, selectedSubSearch: [] });

      if(obj.name === "Response to question" && obj.key == 2){
        this.getAllResponseQuestions();
      }
    }
  };

  getAllResponseQuestions= async ()=>{
    let data = {
      "is_filter_option" : true,
      "knit_project_id": this.props.projectId,
      "is_request_to_response": true,
      "is_qualtrics": true
    };
            let questionList = []
        let subName = [
          {
            name: "Text in transcript",
            key: "Res1",
            subName: [
              {
                name: "Search for text and press enter",
                type: "textbox",
              },
            ],
          }, {
        name: "Sentiments",
          key: "Res2",
          subName: [
        {
          name: "Positive",
          type: "checkbox",
          isChecked: false,
        },
        {
          name: "Negative",
          type: "checkbox",
          isChecked: false,
        },
        {
          name: "Neutral",
          type: "checkbox",
          isChecked: false,
        },
      ],
      },
    ]
    this.props.questionData.forEach(async (value, index)  => {
      if((value.questionType === 'FileUpload' && value.isSunBurst) || value.questionType !== 'FileUpload')  {
        let questionObj = {
          'key': index,
          'name': value.questionNumber +" "+ value.questionName,
          'isSubName':false,
          'type': value.questionType,
          'numericQuestionId': value.numericQuestionId,
          'questionChoice': value.questionChoice,
          'genericType': value.genericDataType,
          'questionId': value.questionId,
          'questionSelector': value.questionSelector
        }
        if(value.questionType === 'FileUpload' && value.isSunBurst) {
          questionObj['subName'] = subName
        }

        questionList.push(questionObj)
      }
    });
    this.setState({allResponseQuestions: questionList}, () => { 
      mainSearch[0]['subName'] = questionList
      this.setState({searchFilterData:mainSearch})
    });
    // getResponseQuestions(data).then((response) => {
    //   if(response.data){
    //     let questionList = []
    //     let subName = [
    //       {
    //         name: "Text in transcript",
    //         key: "Res1",
    //         subName: [
    //           {
    //             name: "Search for text and press enter",
    //             type: "textbox",
    //           },
    //         ],
    //       }, {
    //     name: "Sentiments",
    //       key: "Res2",
    //       subName: [
    //     {
    //       name: "Positive",
    //       type: "checkbox",
    //       isChecked: false,
    //     },
    //     {
    //       name: "Negative",
    //       type: "checkbox",
    //       isChecked: false,
    //     },
    //     {
    //       name: "Neutral",
    //       type: "checkbox",
    //       isChecked: false,
    //     },
    //   ],
    //   },
    // ]
    
        
    //     }
       
    // })
  }

  checkBoxHandler = (event) => {
    let { checked, name } = event.target;
    let { questionId, questionSelector, type, numericQuestionId } = this.state.selectedSubSearch;
    let sentimentsDetails = this.state.selectedSentiments || [];
    let pushObj = (type, questionSelector, questionId, value, numericQuestionId) => {
      let filterObj = {
        "is_request_to_response": true,
        "is_sentiment": true,
        "question_type" : type,
        "question_selector" : questionSelector,
        "question_id": questionId,
        "filter_request": value,
        "numeric_question_id": numericQuestionId
      }
      sentimentsDetails.push(filterObj);
    }

    if (sentimentsDetails.length > 0) {
      let foundIndex = sentimentsDetails.findIndex(item => item.numeric_question_id == numericQuestionId);
      if (foundIndex !== -1) {
        if (checked && !sentimentsDetails[foundIndex]['filter_request'].some(item => item == name)) {
          sentimentsDetails[foundIndex]['filter_request'].push(name);
        } else {
          sentimentsDetails[foundIndex]['filter_request'] =
              sentimentsDetails[foundIndex]['filter_request'].filter(item => item !== name);
        }
      } else {
        pushObj(type, questionSelector, questionId, [name], numericQuestionId);
      }
    } else {
      pushObj(type, questionSelector, questionId, [name], numericQuestionId);
    }
    this.setState({selectedSentiments: sentimentsDetails }, () => this.checkCounts())
  }

  handleTextChange = (event, selectedSearch) => {
    if (selectedSearch.key === 4) {
      let outerThis = this;
      this.setState({
        [event.target.name]:event.target.value
      }, () => {
        let {name, value} = event.target;
        let { videoDurationFrom, videoDurationTo} = outerThis.state;
        if(name === 'videoDurationFrom' && videoDurationTo && videoDurationFrom && value * 1 > videoDurationTo * 1) {
          outerThis.setState({ videoDurationFromErrorShow: true, videoDurationFromErrorMsg: 'From Duration should not greater than To Duration.'})
        } else if(name === 'videoDurationFrom') {
          outerThis.setState({ videoDurationFromErrorShow: false, videoDurationFromErrorMsg: null },()=>{
            this.checkCounts();
          })
        }
        if(name === 'videoDurationTo' && videoDurationTo && videoDurationTo !== "" && videoDurationFrom && value * 1 < videoDurationFrom * 1) {
          outerThis.setState({ videoDurationToErrorShow: true, videoDurationToErrorMsg: 'To Duration should not less than From Duration.'})
        } else if (name === 'videoDurationTo') {
          outerThis.setState({ videoDurationToErrorShow: false, videoDurationToErrorMsg: null },()=>{
            this.checkCounts();
          })
        }
      })
    }
  }

  handleKeyDown = (event, isExistsId, selectedTextTrans, selectedSubSearch, selectedSearch) => {
    let { type, questionSelector, questionId, genericType, numericQuestionId} = selectedSubSearch;
    if(event.keyCode == 13 && selectedSearch.key !== 4){
      this.onHandleTextbox(event);
      if ((event.target.value != null || event.target.value != "") &&
          !selectedTextTrans.some(item => item.numeric_question_id == numericQuestionId &&
          item.filter_request.some(filterItem => filterItem === event.target.value.trim()))) {
        selectedTextTrans = selectedTextTrans &&
        Array.isArray(selectedTextTrans) &&
        selectedTextTrans.length > 0 ?
            selectedTextTrans.map(obj => {
              if(obj.numeric_question_id === selectedSubSearch.numericQuestionId) {
                isExistsId = true;
                obj.filter_request = [...obj.filter_request, event.target.value.trim()]
              }
              return obj
            }) : selectedTextTrans
        if (!isExistsId) {
          selectedTextTrans.push({
            "question_id": questionId,
            "filter_request": [event.target.value.trim()],
            "is_request_to_response": true,
            "is_transcript": true,
            "question_type":type,
            "question_selector": questionSelector,
            "generic_data_type": genericType,
            "numeric_question_id": numericQuestionId
          })
        }
      }
      event.target.value="";
      this.setState({selectedTextTranscript: selectedTextTrans},()=>{this.checkCounts()})
    }
  }

  handleDBTEKeyDown = (event, selectedSubSearch) => {
    let dbORTESelectFilter = this.state.dbORTESelectFilter || [];
    let isExistsId = false;
    let { type, questionSelector, questionId, genericType, numericQuestionId} = selectedSubSearch;
    if(event.keyCode == 13 ) {
      if ((event.target.value != null || event.target.value != "")) {
        if (dbORTESelectFilter.some(item => item.numeric_question_id == numericQuestionId &&
            (item.filter_request === event.target.value.trim() ||
                item.filter_request === "")
        )) {
          dbORTESelectFilter = dbORTESelectFilter &&
          Array.isArray(dbORTESelectFilter) &&
          dbORTESelectFilter.length > 0 ?
              dbORTESelectFilter.map(obj => {
                if (obj.numeric_question_id === selectedSubSearch.numericQuestionId) {
                  isExistsId = true;
                  obj.filter_request = event.target.value.trim()
                }
                return obj
              }) : dbORTESelectFilter
        }

        else if (!dbORTESelectFilter.some(item => item.numeric_question_id == numericQuestionId)) {
          dbORTESelectFilter.push({
            "question_id": questionId,
            "filter_request": event.target.value.trim(),
            "is_request_to_response": true,
            "question_type": type,
            "question_selector": questionSelector,
            "generic_data_type": genericType,
            "numeric_question_id": numericQuestionId
          })
        }

      }

      event.target.value = "";
      let outerThis = this;
      this.setState({dbORTESelectFilter: dbORTESelectFilter}, () => this.checkCounts())
    }
  }
  

  handleIntFloatGenType = (event, selectedSubSearch, rangeType) => {
    let intOrFloatSelectFilter = this.state.intOrFloatSelectFilter || [];
    let intFloatErrorObj =  this.state.intFloatErrorObj || [];
    let isExistsId = false;
    let { type, questionSelector, questionId, genericType, numericQuestionId} = selectedSubSearch;

    let checkForValidNum = (rangeType, startRange, endRange) => {
      if (startRange && endRange) {
        if (rangeType === 'start_range' && endRange * 1 < startRange * 1) {
          this.setState({ showStartRangeError: true, startRangeErrorMsg: 'Start range should not greater than end range.'})
        } else if (rangeType === 'end_range' && startRange * 1 > endRange * 1){
          this.setState({ showEndRangeError: true, endRangeErrorMsg: 'End range should not less than start range.'})
        } else {
          this.setState({ showStartRangeError: false, startRangeErrorMsg: '', showEndRangeError: false, endRangeErrorMsg: ''}, () => this.checkCounts())
        }
      }
    }
    if ((event.target.value != null || event.target.value != "")){
      intOrFloatSelectFilter = intOrFloatSelectFilter &&
        Array.isArray(intOrFloatSelectFilter) &&
      intOrFloatSelectFilter.length > 0 ?
          intOrFloatSelectFilter.map(obj => {
              if(obj.numeric_question_id === selectedSubSearch.numericQuestionId) {
                isExistsId = true;
                obj.filter_request[rangeType] = event.target.value
                checkForValidNum(rangeType, obj.filter_request['start_range'], obj.filter_request['end_range'])
              }
              return obj
            }) : intOrFloatSelectFilter
        if (!isExistsId) {
          intOrFloatSelectFilter.push({
            "question_id": questionId,
            "filter_request": {
              [rangeType]: event.target.value
            },
            "is_request_to_response": true,
            "question_type":type,
            "question_selector": questionSelector,
            "generic_data_type": genericType,
            "numeric_question_id": numericQuestionId
          })
        }
      }
      this.setState({intOrFloatSelectFilter: intOrFloatSelectFilter},()=>{
        this.checkCounts()
      })
  }


  handleSubSelected = (data,type) => {
    let obj = this.state.selectedSearch.subName.find(
      (item) => item.key === data
    );
    if(data == obj.key){
      if(type == "theme"){
        obj.isSelected=true;
        this.setState({isThemeQuestionSelected:true,selectedThemeId:obj})
        this.setState({selectedSubTheme:obj.subName,level:2,selectedThemetags:obj.tags},()=>{
          this.checkCounts();
        })
      }
    }

    if (this.state.selectedSearch.key == 2) {
      this.setState({ isSelectedQuestion: true });
    }
    this.setState({ selectedSubSearch: obj, subSelected: true });
    if (obj.type == 'MC' || obj.type == 'DD') {
      let requestData = {
        "is_filter_option" : true,
        "is_choices": true,
        "knit_project_id": this.props.projectId,
        "question_id": obj.questionId,
        "numeric_question_id": obj.numericQuestionId
      }
          obj['questionChoice'] = obj.questionChoice
          this.setState({ selectedSubSearch: obj, subSelected: true }
         );
      // getResponseQuestions(requestData).then((response) => {
      // })
    } else {
      this.setState({ selectedSubSearch: obj, subSelected: true }, () => {
      });
    }
  };

  onHandleTextbox=(event)=>{
    let {textTranscript} = this.state;

    if(event.target.value != null){
      textTranscript.push(event.target.value);
    }
    this.setState({textTranscript:textTranscript})
  }

  changeSubThemeHandler = (event,key,tags,name) => {
    let {parentTheme}= this.state;
    let {subThemeList}=this.state;
    let {tagList}=this.state;
    let {tagListName}=this.state;
    let {themeListName}=this.state;
    let {subThemeListName}=this.state;
    let selectedThemes = this.state.selectedThemes;

    selectedThemes.push(this.state.selectedSubSearch.key);
    if(event.target.checked){
      if(key){
        parentTheme.push(key)
      }
      if(tags == "tags"){
        tagList.push(event.target.value)
        tagListName.push({"id":event.target.value,"name":name})
      }else{
        subThemeList.push(event.target.value)
        subThemeListName.push({"id":event.target.value,"name":name})
      }
      this.setState({subThemeList,parentTheme,tagList,subThemeListName,tagListName},()=>{
        this.checkCounts();
      })
    }else{
      let newParentJson= this.state.parentTheme.filter(el => el != key);
     let newJson= this.state.subThemeList.filter(el => el != event.target.value);
     let newSubThemeJson= this.state.subThemeListName.filter(el => el.id != event.target.value);
     if(tags == "tags"){
      let newTagJson= this.state.tagList.filter(el => el != event.target.value);
      this.setState({tagList:newTagJson})
      let newTagListName= this.state.tagListName.filter(el => el.id != event.target.value);
      this.setState({tagListName:newTagListName})
     }
      this.setState({subThemeList:newJson,parentTheme:newParentJson,subThemeListName:newSubThemeJson},()=>{
        this.checkCounts();
      })
    }

  }


  checkThemeSelect = (event,key,name) => {
    let {selectedParentTheme,themeListName}=this.state;
   

    if(event.target.checked){
        selectedParentTheme.push(key)
        themeListName.push({"id":key,"name":name})
      this.setState({selectedParentTheme},()=>{
        this.checkCounts();
      })
    }else{
      let newParentJson= this.state.selectedParentTheme.filter(el => el != key);
      let newThemeNames= this.state.themeListName.filter(el => el.id != key);
      this.setState({selectedParentTheme:newParentJson,themeListName:newThemeNames},()=>{
        this.checkCounts();
      })
    }
  }

  removeTextTranscript = (numericQuestionId, text) => {
    let { selectedTextTranscript, selectedSubSearch } = this.state;
    let selectedTextTrans = [...selectedTextTranscript]
    selectedTextTrans = selectedTextTrans &&
    Array.isArray(selectedTextTrans) &&
    selectedTextTrans.length > 0 ?
        selectedTextTrans.map((obj, i) => {
          if(obj.numeric_question_id == selectedSubSearch.numericQuestionId) {
            obj.filter_request = obj.filter_request.filter(el => el !== text)
          }
          return obj
        }) : selectedTextTrans
    this.setState({selectedTextTranscript: selectedTextTrans},()=>{
      this.checkCounts();
    })
  }

  removeDBORTESelector = (numericQuestionId, text) => {
    let { dbORTESelectFilter, selectedSubSearch } = this.state;
    let dbORTESelectFilterData = [...dbORTESelectFilter]
    dbORTESelectFilterData = dbORTESelectFilterData &&
    Array.isArray(dbORTESelectFilterData) &&
    dbORTESelectFilterData.length > 0 ?
        dbORTESelectFilterData.map((obj, i) => {
          if(obj.numeric_question_id === selectedSubSearch.numericQuestionId && obj.filter_request === text) {
            obj.filter_request = ""
          }
          return obj
        }) : dbORTESelectFilterData
    this.setState({dbORTESelectFilter: dbORTESelectFilterData},()=>{
      this.checkCounts();
    })
  }

  renderTextBox = (data) => {
    let { selectedTextTranscript, selectedSubSearch } = this.state;
    let selectedTextTrans = [...selectedTextTranscript]
    let isExistsId = false;
    let typeNumber = {}
    let value = '';
    let selectedSearch = this.state.selectedSearch;

    let showErrorStateName = data.name + 'ErrorShow'
    let showErrorMsg = data.name + 'ErrorMsg'
    if (selectedSearch.key === 4) {
      typeNumber['type'] = 'number'
      value = this.state[data.name];
    }
    return (
      <Grid lg={12}>
        <Grid
          item xs={12} md={12} sm={12} lg={12} className={"p-lr-12"}>
           {/*<TextField label={data.name}  onKeyDown={(event)=> {*/}
           {/*  if(event.keyCode == 13){*/}
           {/*    this.onHandleTextbox(event); event.target.value=""*/}
           {/*  }*/}
           {/*}}  type="text" className={"textboxWidth"} />*/}

           <TextField label={selectedSearch.key === 4 ? data.lable : data.name}
                      onKeyDown={(event)=> this.handleKeyDown(event, isExistsId,
                          selectedTextTrans, selectedSubSearch, selectedSearch)} 
                          type="text"
                           className={"textboxWidth"} InputProps={typeNumber}
                           name={data.name}
                           value={selectedSearch.key === 4 ? value: null }
                           onChange={(event) => this.handleTextChange(event, selectedSearch)}/>
          <div
              style={{ display: this.state[showErrorStateName] ? 'block': 'none' }} className={"duration-err"}>
            {this.state[showErrorMsg]}
          </div>
        </Grid>
        <Grid
          item xs={12} md={12} sm={12} lg={12} className={"chiptext-main"}>
          <Grid container spacing={2} >
          {this.state.selectedTextTranscript &&
              this.state.selectedTextTranscript.map(transObj => {
                return (transObj.numeric_question_id === selectedSubSearch.numericQuestionId &&
                  transObj.filter_request.map((textObj, index) => {
                    return (<Grid item xs={12} md={4} sm={4} lg={4}
                                  onClick={() => this.removeTextTranscript(selectedSubSearch.numericQuestionId, textObj)}>
                      <ChipText text={textObj} >
                      </ChipText>
                    </Grid>)
                  })
                )})
              }
          </Grid>
      </Grid>
      </Grid>);
  };


  renderDate = (item) => {
    let { lable, name } = item;
    let rangeCondition = {}
    if(lable === 'To') {
      rangeCondition['min'] = this.state.dateFrom;
    }
    if (lable === 'From') {
      rangeCondition['max'] = this.state.dateTo;
    }
    return (
      <Grid container>
        <Grid item xs={12} md={12} sm={12} lg={12} className={"p-10" }>
          <TextField
            type="date"
            id="date"
            label={lable}
            className={"textboxWidth date-padd"}
            format={"mm/dd/yyyy"}
            variant="standard"
            InputLabelProps={{ shrink: true, }}
            inputProps={rangeCondition}
            name={name}
            onChange= {(event) => this.handleDateSelect(event,name)}
            value={this.state[name]}
          />
        </Grid>
        
      </Grid>
    );
  };

  renderRadio = (lable) => {
    return (
      <RadioGroup aria-label="gender" name="gender1" className={"radio-btn"}>
        <FormControlLabel checked={this.state.selectedRadioValue === lable.name} onChange={(e) => this.handleRadioChange(e)} value={lable.name} control={<Radio color="primary"/>} label={lable.name} name={lable.name}/>
      </RadioGroup>
    );
  };

  renderCheckbox = (data) => {
    let { questionId, numericQuestionId } = this.state.selectedSubSearch;
    let { selectedSentiments } = this.state;
    return (
      <FormControlLabel
        control={<CustomCheckbox
            checked={selectedSentiments.length > 0 &&
            selectedSentiments.some(item => item.numeric_question_id == numericQuestionId &&
                    item['filter_request'].some(multiSelectItem => multiSelectItem === data.name))}
            value={data.name}
            name={data.name}
            onChange={this.checkBoxHandler} />}
        label={
          <span className={"checkbox-label"}>{data.name}</span>
        }
        className={"w-100"}
      />
    );
  };

  renderMultiSelect = (selectedSubSearch, optionObj) => {
    let { questionId, numericQuestionId } = selectedSubSearch;
    let mcMultiSelectFilter = this.state.mcMultiSelectFilter || [];
    let checkSelectedValue = (choiceText) => {
      if (mcMultiSelectFilter.length > 0) {
        return mcMultiSelectFilter.some(item => item.numeric_question_id == numericQuestionId &&
            item.filter_request.some(filterItem => filterItem === choiceText))
      }
      return false
    }

    return (
        <FormControlLabel
            checked = {checkSelectedValue(optionObj['choiceText'])}
            onChange={(e) => this.handleMultiSelectQuestionChoice(selectedSubSearch, e)}
            name = {optionObj['choiceText']}
            control={<CustomCheckbox/>}
            label={<span className={"checkbox-label"}>{optionObj['choiceText']}</span>}
            className={"w-100"}
        />
    );
  };

  renderSingleSelect = (selectedSubSearch, optionObj) => {
    let { questionId, numericQuestionId } = selectedSubSearch;
    let mcRadioFilter = this.state.mcRadioFilter || [];
    let checkSelectedValue = (choiceText) => {
      if (mcRadioFilter.length > 0) {
        return mcRadioFilter.some(item => item.numeric_question_id == numericQuestionId && item.filter_request === choiceText)
      }
      return false
    }
    return (
        <RadioGroup aria-label={numericQuestionId} name={numericQuestionId} className={"radio-btn"}>
          <FormControlLabel color="primary"
                            onChange={(e) => this.handleRadioChangeQuestionChoice(selectedSubSearch, e)}
                            value={optionObj.choiceText}
                            label={optionObj.choiceText}
                            checked={checkSelectedValue(optionObj.choiceText)}
                            control={<Radio color={'primary'} />}
          /></RadioGroup>
    );
  };

  renderSubType = (data, index) => {
    selectedThemeNames="";
    return (
      <>
        {data.isSubName ? (
          <>
            <Grid item xs={12} md={12} sm={12} lg={12}>
              <div
                className={
                  this.state.selectedSubSearch &&
                  this.state.selectedSubSearch.key == data.key
                    ? "active-search"
                    : "inactive-search"
                }
                onClick={() => this.handleSubSelected(data.key)}>
                <Typography key={index} className={"searchText"}>
                  {data.name}
                </Typography>
                <img
                  src={NextIcon}
                  height={12}
                  width={12}
                  className={"icon-margin"}
                ></img>
              </div>
            </Grid>
          </>
        ) : data.type == "theme" ? (
          <Grid item xs={12} md={12} sm={12} lg={12} className={"flex submenu-search"}>
            {(data.subName && data.subName.length > 0 ) || (data.tags && data.tags.length > 0 )  ?
                <div className={this.state.selectedParentTheme.includes(data.id) ? "common-width active-search" :"common-width inactive-search themeName"}>
                    {this.state.parentTheme.includes(data.id)
                      ? <img src={subSelected} style={{paddingLeft: 14,paddingRight: 5}}/>
                      : <Checkbox color="primary" className = {"video-theme-pad"} value={data.key} checked={this.state.selectedParentTheme.includes(data.id) ? true: false}
                      onChange={(event) => this.checkThemeSelect(event,data.key,data.name)}/>
                    }
                      <FiberManualRecordIcon style={{ color: data.color,width: "15px",marginLeft: 2 }} 
                      onClick={() =>{selectedThemeNames+=data.name; selectedThemeSequence=data.parentId; this.handleSubSelected(data.key,"theme")}} ></FiberManualRecordIcon>
                      <Typography key={index} className={"searchText searchText-pad"}
                      onClick={() => {selectedThemeNames+=data.name; selectedThemeSequence=data.parentId; this.handleSubSelected(data.key,"theme")}} >
                        {data.name}
                      </Typography>
                      <img src={NextIcon} height={12} width={12} className={"icon-margin theme-icon"}
                       onClick={() => {selectedThemeNames+=data.name; selectedThemeSequence=data.parentId; this.handleSubSelected(data.key,"theme")}} ></img>
                   </div>
                 :
                  <div className={this.state.selectedParentTheme.includes(data.id) ? "common-width active-search" :"common-width inactive-search themeName"}>
                    {this.state.parentTheme.includes(data.id)
                      ? <img src={subSelected} style={{paddingLeft: 14,paddingRight: 5}}/>
                      : <Checkbox color="primary" className = {"video-theme-pad"} value={data.key} checked={this.state.selectedParentTheme.includes(data.id) ? true: false}
                      onChange={(event) => this.checkThemeSelect(event,data.key,data.name)}/>
                    }
                     <FiberManualRecordIcon style={{ color: data.color,width: "15px",marginLeft: 2 }} ></FiberManualRecordIcon>
                          <Typography key={index} className={"searchText searchText-pad"} >
                            {data.name}
                          </Typography>
                    </div>
              }
          </Grid>
        ) : (
          <Grid item xs={12} md={12} sm={12} lg={12} className={"flex submenu-search"} >
            <div
              className={
                this.state.selectedSubSearch &&
                this.state.selectedSubSearch.key == data.key
                ? "common-width active-search"
                : "common-width inactive-search"
              }
              onClick={() => {this.handleSubSelected(data.key); selectedThemeNames="";}} >
                <Tooltip title={data.name} placement="bottom-start">
                <Typography key={index} className={"searchText  question-names  min-w-question"}>
                  {data.name}
                </Typography>
                </Tooltip>
                <img src={NextIcon} height={12} width={12} className={"icon-margin"}></img>
            </div>
          </Grid>
        )}
      </>
    );
  };
  renderPopper = () => {
    return (
      <Grid container className={"popper-width"}>
        <Grid item xs={12} md={5} sm={5} lg={5} className={"borderStyle cursor padd-5"} style={{borderTopLeftRadius: 5,borderTopRightRadius: 5}}>
          {this.state.searchFilterData.map((item, index) => {
            return (
              <div
                className={
                  this.state.selectedSearch &&
                  this.state.selectedSearch.key == item.key
                  ? "active-search"
                  : "inactive-search"
                }
                onClick={(e) => {
                  this.handleSearch(item.key);
                }}
              >
                <Typography key={index} className={"searchText "}>
                  {item.name}
                </Typography>
                <img src={NextIcon} height={12} width={12} className={"icon-margin"}></img>
              </div>
            );
          })}
        </Grid>
        {this.state.selectedSearch && this.state.selectedSearch.key == 1 ? (
          <>
            <Grid item xs={12} md={3} sm={3} lg={3} className={"borderStyle cursor padd-5"}>
              {this.state.selectedSearch &&
                this.state.selectedSearch.subName &&
                this.state.selectedSearch.subName.map((item, index) => {
                  return item.type == "textBox"
                    ? this.renderTextBox(item)
                    : item.type == "date"
                    ? this.renderDate(item)
                    : this.renderSubType(item, index);
                })}
            </Grid>
            <Grid item xs={12} md={4} sm={4} lg={4} className={"borderStyle cursors padd-5 gender-cat"}>
            <Grid container>
              {this.state.selectedSubSearch &&
                this.state.selectedSubSearch.subName &&
                this.state.selectedSubSearch.subName.map((item, index) => {
                  return item.type == "checkbox" ? (
                    this.renderCheckbox(item)
                  ) : item.type == "textbox" ? (
                    this.renderTextBox(item)
                  ) : (
                    <></>
                  );
                })}
                </Grid>
            </Grid>
          </>
        ) : (
          <Grid
            item
            xs={12}
            md={7}
            sm={7}
            lg={7}
            className={"borderStyle sub-div cursor"}
          >
            {this.state.selectedSearch && this.state.selectedSearch.key == 5 &&  
              <Typography className={"range-label"}>Select a range</Typography>
            }
            {this.state.selectedSearch &&
              this.state.selectedSearch.subName &&
              this.state.selectedSearch.subName.map((item, index) => {
                return item.type == "textBox"
                  ? this.renderTextBox(item)
                  : item.type == "date"
                  ? this.renderDate(item)
                  : item.type == "radio"
                  ? this.renderRadio(item)
                  : this.renderSubType(item, index);
              })}
          </Grid>
        )}
      </Grid>
    );
  };

  renderResponseQuestion = () => {
    let { selectedSubSearch, intOrFloatSelectFilter } = this.state;
    return (
      <Grid container className={"popper-width"}>
        <Grid item xs={12} md={12} sm={12} lg={12} className={"borderStyle flex sub-question"} style={{borderTopLeftRadius: 5,borderTopRightRadius: 5}}>
          <div
            onClick={() => this.setState({ isSelectedQuestion: false, selectedSubSearch: {} })} className={"flex cursor align-center"} >
              <img src={PreviousIcon} height={12} width={12} className={"mr-5"}></img>
              <Typography className={"back-label"}>Back</Typography>
          </div>
          
          <Tooltip title={this.state.selectedSubSearch && this.state.selectedSubSearch.name} placement="bottom-start">
              <Typography className={"searchText question-lable cursor question-names"} style={{fontWeight: 'bold'}}>
                {this.state.selectedSubSearch && this.state.selectedSubSearch.name}
              </Typography>
          </Tooltip>    
          
        </Grid>
        { selectedSubSearch.genericType === 'INTEGER' ||  selectedSubSearch.genericType === 'FLOAT' ?
            ( <div className={"popperHeight"}>
                <Typography className={"subrange-lable"}>Select a range</Typography>
                <Grid lg={12}>
                  <div className={'subragne-div flexDiv'}>
                  <Grid
                      item xs={3} md={3} sm={3} lg={3} className={"p-lr-12"}>
                    <TextField label={'Minimum'} type="number"
                               className={"textboxWidth"}
                               InputProps={{ inputProps: { min: 0 } }}
                               onChange={(event) => this.handleIntFloatGenType(
                               event, selectedSubSearch, 'start_range')}
                               value={intOrFloatSelectFilter &&
                              intOrFloatSelectFilter.findIndex(obj => obj.numeric_question_id == selectedSubSearch.numericQuestionId) !== -1 ?
                                   intOrFloatSelectFilter[intOrFloatSelectFilter.findIndex(obj => obj.numeric_question_id == selectedSubSearch.numericQuestionId)]['filter_request']['start_range'] : null}/>
                    <div
                        style={{ display: this.state.showStartRangeError ? 'block': 'none' }} className={"duration-err"}>
                      {this.state.startRangeErrorMsg}</div>
                  </Grid>
                  <Typography className={"To-lable"}>To</Typography>
                  <Grid item xs={3} md={3} sm={3} lg={3} className={"p-lr-12"}>
                    <TextField label={'Maximum'} type="number"
                               InputProps={{ inputProps: { min: 0 } }}
                               className={"textboxWidth"}
                               onChange={(event) => this.handleIntFloatGenType(
                               event, selectedSubSearch, 'end_range')}
                               value={intOrFloatSelectFilter &&
                               intOrFloatSelectFilter.findIndex(obj => obj.numeric_question_id == selectedSubSearch.numericQuestionId) !== -1 ?
                               intOrFloatSelectFilter[intOrFloatSelectFilter.findIndex(obj => obj.numeric_question_id == selectedSubSearch.numericQuestionId)]['filter_request']['end_range'] : null}/>
                    <div
                        style={{ display: this.state.showEndRangeError ? 'block': 'none' }} className={"duration-err"}>
                      {this.state.endRangeErrorMsg}</div>

                  </Grid>
                  </div>
                </Grid>
                </div>
            ) :  selectedSubSearch.type === 'DB' || selectedSubSearch.type === 'TE'  ?
                ( <div className={"popperHeight"}>
                      <Grid
                          item xs={12} md={12} sm={12} lg={12} className={"p-lr-12"}>
                        <TextField label={'Filter by text'}
                                   type="text"
                                   className={"textboxWidth"}
                                   onKeyDown={(event) => this.handleDBTEKeyDown(
                                       event, selectedSubSearch)}
                                   />
                      </Grid>
                      <Grid
                      item xs={12} md={12} sm={12} lg={12} className={"chiptext-main"}>
                      <Grid container spacing={2} >
                        {this.state.dbORTESelectFilter &&
                        this.state.dbORTESelectFilter.map(transObj => {
                          return (transObj.numeric_question_id === selectedSubSearch.numericQuestionId &&
                              transObj.filter_request &&
                               (<Grid item xs={12} md={4} sm={4} lg={4}
                                              onClick={() => this.removeDBORTESelector(selectedSubSearch.numericQuestionId,
                                                  transObj.filter_request)}>
                                  <ChipText text={transObj.filter_request} >
                                  </ChipText>
                                </Grid>)
                              )
                          })
                        }
                      </Grid>
                      </Grid>
                    </div>
                ) :selectedSubSearch.type === 'MC' || selectedSubSearch.type === 'DD'  ?
                    selectedSubSearch.questionChoice &&
                    Object.keys(selectedSubSearch.questionChoice).length != 0 ?
                      <Grid item xs={12} md={12} sm={12} lg={12} className={"borderStyle sub-div cursor"}>
                             {selectedSubSearch.questionChoice &&  Object.keys(selectedSubSearch.questionChoice).length > 0 && Object.keys(selectedSubSearch.questionChoice).map((item)=> {
                                return(
                                     this.renderMultiSelect(selectedSubSearch,
                                        selectedSubSearch.questionChoice[item]
                                     )
                               )
                              })
                          }
                          </Grid>
                  : <Grid item xs={12} md={12} sm={12} lg={12} className={"borderStyle sub-div cursor"}></Grid>
              :<>
        <Grid item xs={12} md={4} sm={4} lg={4} >
          {this.state.selectedSubSearch &&
          this.state.selectedSubSearch.subName &&
          this.state.selectedSubSearch.subName.map((item, index) => {
            return (
                <div
                    className={
                      this.state.selectedQuestionAnswer &&
                      this.state.selectedQuestionAnswer.key == item.key
                          ? "active-search margin-subtop"
                          : "inactive-search margin-subtop"
                    }
                    onClick={(e) => {this.handleSearch(item.key); }}>
                  <Typography key={index} className={"searchText cursor"}>
                    {item.name}
                  </Typography>
                  <img src={NextIcon} height={12} width={12} className={"icon-margin"}></img>
                </div>
            );
          })}
        </Grid>


        <Grid item xs={12} md={8} sm={8} lg={8} className={"borderStyle sub-div cursor"}>
          {this.state.selectedQuestionAnswer &&
          this.state.selectedQuestionAnswer.subName &&
          this.state.selectedQuestionAnswer.subName.map((item, index) => {
            return item.type == "textbox"
                ? this.renderTextBox(item)
                : item.type == "date"
                    ? this.renderDate(item)
                    : item.type == "checkbox"
                        ? this.renderCheckbox(item)
                        : null;
          })}
        </Grid></>}
      </Grid>
    );
  };

  checkSubValueData=(data)=>{
    for(let i in data){
      if(data[i].isSelected){
          return true;
      }else{
        return false;
      }
    }
  }

   propGreaterThan=(prop) =>{
     if(this.state.selectedThemeId != undefined && prop != undefined ){
       return this.state.selectedThemeId && this.state.selectedThemeId.find(p => p.property == prop);
     }
  }


    checkLevel= (data)=>{
      for(let i in data){
        if(data[i].level == this.state.level-1){
          this.setState({selectedSubTheme:data})
        }else{
          if(data[i].subName){
            this.checkLevel(data[i].subName)
          }
        }
      }
    }
  
    checkTagLevel= (data)=>{
        if(this.state.level-2 == 1){
          this.setState({isThemeQuestionSelected:false,selectedThemeId:data})
        } else{
          for(let i in data.subName){
            if(data.subName[i].level == this.state.level-2){
              this.setState({selectedThemetags:data.subName[i].tags,level:this.state.level-1})
              }else{
                this.checkTagLevel(data.subName[i])
              }
          } 
      }
    }
  handleBackTheme=(data,listFlag)=>{
    let selectedTheme=selectedThemeNames;
    if(this.state.level == 2){
      this.setState({isThemeQuestionSelected:false,selectedThemeId:data})
    }else if(data.level < this.state.level-1){
     this.checkLevel(data.subName)
     this.checkTagLevel(data)
    }
    let listArray=selectedTheme.split(">");
    selectedThemeNames="";
    for(let i=0 ;i<listArray.length-1;i++){
      selectedThemeNames+=listArray[i]+" > "
    }
  } 

  renderThemeOptions = () => {
    return (
      <Grid container className={"popper-width"}>
        <Grid item xs={12} md={12} sm={12} lg={12} className={"borderStyle flex sub-question"} style={{borderTopLeftRadius: 5,borderTopRightRadius: 5}} >
          <div
            onClick={() => this.setState({ isSelectedQuestion: false })} className={"flex cursor align-center"} >
              <img src={PreviousIcon} height={12} width={12} className={"mr-5"}  onClick={()=>{this.handleBackTheme(this.state.selectedThemeId,false)}}></img>
              <Typography className={"back-label"} onClick={()=>{this.handleBackTheme(this.state.selectedThemeId,false)}}>Back</Typography>
          </div>
          <Typography className={"searchText question-lable cursor"}>
            <FiberManualRecordIcon style={{ color: ThemeColor(selectedThemeSequence,1),width: "15px",marginRight: 10,marginTop: "-2px" }} ></FiberManualRecordIcon>
            {selectedThemeNames}
          </Typography>
        </Grid>
        <Grid item xs={12} md={12} sm={12} lg={12} className={"borderStyle sub-div cursor"}>
             { this.state.selectedSubTheme &&
                  this.state.selectedSubTheme.map((item,index)=>{
              return(
                      <Grid item xs={12} md={12} sm={12} lg={12} className={"flex submenu-search"}>
                        {(item.subName && item.subName.length > 0 ) || (item.tags && item.tags.length > 0 )?
                      <div className={this.state.subThemeList.includes(item.id) ? "common-width active-search"  :"common-width inactive-search themeName" }>
                            <Checkbox color="primary" className = {"video-theme-pad"}  checked={this.state.subThemeList.includes(item.id)} onChange={(event) => this.changeSubThemeHandler(event,item.parentKey,"",item.parentTitle)} value={item.id}/>
                             <FiberManualRecordIcon style={{ color: item.color,width: "15px",marginLeft: 2 }} 
                                  onClick={() => { item.isSelected=true; selectedThemeNames+=" > "+item.name; 
                                  this.setState({selectedThemeId:this.state.selectedThemeId})}}>
                              </FiberManualRecordIcon>

                            <Typography key={index} className={"searchText"} 
                              onClick={() => { item.isSelected=true; selectedThemeNames+=" > "+item.name; this.setState({selectedThemeId:this.state.selectedThemeId,selectedSubTheme:item.subName,level:this.state.level+1,selectedThemetags:item.tags},()=>{
                              }); this.renderThemeOptions()}} >
                                {item.name}
                            </Typography>
                            <img src={NextIcon} height={12} width={12} className={"icon-margin"}
                                onClick={() => { item.isSelected=true; selectedThemeNames+=" > "+item.name; this.setState({selectedThemeId:this.state.selectedThemeId,selectedSubTheme:item.subName,level:this.state.level+1,selectedThemetags:item.tags},()=>{
                                }); this.renderThemeOptions()}}></img>
                      </div>
                        :
                        <div className={this.state.subThemeList.includes(item.id) ? "common-width active-search"  :"common-width inactive-search themeName" }>
                              <Checkbox color="primary" className = {"video-theme-pad"}   checked={this.state.subThemeList.includes(item.id)}  onChange={(event) => this.changeSubThemeHandler(event,item.parentKey,"",item.parentTitle)} value={item.id}/>
                             <FiberManualRecordIcon style={{ color: item.color,width: "15px",marginLeft: 2 }} ></FiberManualRecordIcon>
                            <Typography key={index} className={"searchText"}>
                              {item.name}
                            </Typography>                            
                      </div>
                      }
                            
                      </Grid>
              )
            })}
            {this.state.selectedThemetags &&
            this.state.selectedThemetags.map((item,index)=>{
              return(
                <Grid item xs={12} md={12} sm={12} lg={12} className={"flex submenu-search"}>
                {item.subName && item.subName.length > 0 ?
                <div className={this.state.tagList.includes(item.id) ? "common-width active-search"  :"common-width inactive-search themeName" }
                     onClick={() => { item.isSelected=true; this.setState({selectedThemeId:this.state.selectedThemeId})}} 
                    >
                      <Checkbox color="primary" className = {"video-theme-pad"} 
                      checked={this.state.tagList.includes(item.id)} onChange={(event) => this.changeSubThemeHandler(event,item.parentKey,"tags",item.parentTitle)} value={item.id} />
                      <LocalOfferIcon style={{ color: item.color,width: "15px",marginLeft: 2 }} ></LocalOfferIcon>
                      <Typography key={index} className={"searchText"}>
                        {item.name}
                      </Typography>
                        <img src={NextIcon} height={12} width={12} className={"icon-margin"}></img>
                </div>
                :
                <div className={this.state.tagList.includes(item.id) ? "common-width active-search"  :"common-width inactive-search themeName"}>
                        <Checkbox color="primary" className = {"video-theme-pad"}  checked={this.state.tagList.includes(item.id)} onChange={(event) => this.changeSubThemeHandler(event,item.parentKey,"tags",item.parentTitle)} value={item.id}/>
                        <LocalOfferIcon style={{ color: item.color,width: "15px",marginLeft: 2 }} ></LocalOfferIcon>
                    <Typography key={index} className={"searchText"}>
                      {item.name}
                    </Typography>                            
                 </div>
                  }
                </Grid>
              )
            })
              }
        
        </Grid>
      </Grid>
    );
  };

  handleOnSearch=(event)=>{

        if (event.keyCode == 13) {
          this.onSearch();
        }

  }
  // onHandleTextbox=(event)=>{
  // }

  // renderSubSkeleton=()=>{
  //   return(
  //     <Grid container>
  //         <Grid item md={12} sm={12} lg={12} xs={12}>
  //             <skele
  //         </Grid>
  //     </Grid>
  //   )
  // }

  handleOnChange=(event)=>{
    this.setState({searchText:event.target.value})
  }
  render() {
    const { open } = this.props;
    let totalCount=0;
    // if(this.props.totalCount > 0){
    //   totalCount=this.props.totalCount;
    // }else if(Object.keys(this.state.totalFilterCountObj).length > 0){
    //   totalCount=Object.values(this.state.totalFilterCountObj).reduce((a, b) => a + b);
    // }

    return (
      <div>
        <div>
          <TextField className={"popper-width main-height"} size={"small"}
                     variant="outlined" placeholder={"Filter by text"}
                     value={this.state.searchText }
                      onChange={this.handleOnChange}
                      onKeyUp={(event)=>{this.handleOnSearch(event)}}

          style={{background:" white",width:"190px"}}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img src={SearchIcon} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end" onClick={(e) => { this.handleClick(e);}} className={"cursor"}>
                    {this.state.totalCount > 0 && <><div className={'search-filter'}>{'+ '+this.state.totalCount  +' filters'}</div></>}
                 {/* {this.props.totalCount > 0 && <><div className={'search-filter'}>{'+ '+this.props.totalCount+' filters'}</div></>} */}
                 {this.state.open ? <ExpandLessIcon></ExpandLessIcon>:
                 <ExpandMoreIcon></ExpandMoreIcon>}
                  </InputAdornment>
              )
            }}
          />
          <Popper open={this.state.open} anchorEl={this.state.anchorEl} placement={"bottom-end"} transition className={"popper-card"}>
            <div className={"mainCard"}>
              {this.state.isSelectedQuestion
                ? this.renderResponseQuestion()
                : this.state.isThemeQuestionSelected
                ? this.renderThemeOptions()
                // ? this.renderThemeOptions()
                : this.renderPopper()}


              <Grid container>
                <Grid item xs={12} md={12} sm={12} lg={12} className={"borderStyle flex content"} style={{borderBottomLeftRadius: 5,borderBottomRightRadius: 5}}>
                  <Button size="small" onClick={()=>(this.onClearFilter())} className={"reset-filter"}>
                    Clear Filters
                  </Button>
                  <ButtonComponent text={"Apply"} disabled={this.props.applyButtonDisabledStatus} width={90} onClick={this.onSearch} fontWeight={500} className={"search-btn"} />
                </Grid>
              </Grid>
            </div>
          </Popper>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  // console.log('satte==>',state)
  return {
      questionData: store.getState().data.questionData,
      themeDetails: state.data.setThemeDetails,
      applyButtonDisabledStatus: state.data.applyButtonDisabledStatus,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setThemeDetails: (event) => dispatch(setThemeDetails(event)),

});

export default connect(mapStateToProps, mapDispatchToProps)(SearchFilter);
