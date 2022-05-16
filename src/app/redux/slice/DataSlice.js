import { SatelliteTwoTone } from "@material-ui/icons";
import { createSlice, current } from "@reduxjs/toolkit";
import { JS } from "aws-amplify";
import {
  videoCardData,
  fetchAnswerFromId,
  generateGraphData,
  generateMultiBar,
} from "../actions/DataAction";
import ThemeColor from "../../config/ThemeColorConfig";

let filterUserList = [];
let jsonUserResponse = [];
let filterUserResponse = [];
let FILTRED_DATA = [];
let FILTRED_DATA_SIZE = 0;
let IS_FILTER_APPLIED = false;
let ORIGINAL_QUESTION_DATA=[]
let TABLE_DATA=[];
export const dataSlice = createSlice({
  name: "dataPage",
  initialState: {
    value: 0,
    questionCardListBox: [],
    originalQuestionData: [],
    tabularData: [],
    tableRowData: [],
    isFetching: false,
    isSuccess: false,
    isError: false,
    errorMessage: "",
    totalCount: 0,
    originalTotalCount:0,
    userResponseData: [],
    filterUserList: [],
    setAllUserResponse: [],
    setAllThemeDetails: [],
    filterUserResponse: [],
    questionData: [],
    dataView: "",
    allSearchDataList:[],
    applyButtonDisabledStatus:false,
    videoQuestionIds:[],
    videoQuestionList:[]
  },
  reducers: {
    resetProjectStoreData: (state,action) => {
      localStorage.removeItem('allListData')
      localStorage.removeItem('tabularData')
      state.value = 0
      state.questionCardListBox= []
      state.originalQuestionData= []
      state.tabularData=[]
      state.tableRowData= []
      state.isFetching= false
      state.isSuccess= false
      state.isError=false
      state.errorMessage= ""
      state.totalCount=0
      state.originalTotalCount=0
      state.userResponseData= []
      state.filterUserList= []
      state.setAllUserResponse= []
      state.setAllThemeDetails= []
      state.filterUserResponse= []
      state.questionData= []
      state.dataView= ""
      state.allSearchDataList=[]
      ORIGINAL_QUESTION_DATA=[]
    },
    setViewData: (state, action) => {
      state.dataView = action.payload;
      state.totalCount=state.originalTotalCount
    },
    setListViewData: (state,action) => {
      state.questionCardListBox=JSON.parse(localStorage.getItem('allListData'))
    },
    changeApplyButtonStatus: (state,action) => {
      state.applyButtonDisabledStatus=action.payload
    },
    fetchAllQuestions: (state, action) => {
      try {
        // dataSlice.caseReducers.changeApplyButtonStatus(state,{payload:true})
        state.applyButtonDisabledStatus=true
        // state.questionCardListBox =[]
        let questionCardListBox = [];
        for (let i in action.payload.data) {
          if (action.payload.data[i].question_type != "Draw") {
            questionCardListBox.push({
              questionId: action.payload.data[i].question_id,
              questionType: action.payload.data[i].question_type,
              questionName: action.payload.data[i].question_text,
              questionNumber: action.payload.data[i].question_name,
              isSunBurst: action.payload.data[i].is_sunburst,
              numericQuestionId: action.payload.data[i].numeric_question_id,
              questionChoice: action.payload.data[i].question_choices,
              genericDataType: action.payload.data[i].generic_data_type,
              questionSelector: action.payload.data[i].question_selector,
              sorting: Math.floor(action.payload.data[i].sorting_key)
            });
          }
        }
        state.originalQuestionData = questionCardListBox;
        ORIGINAL_QUESTION_DATA=questionCardListBox
        state.questionData = questionCardListBox;
        if (state.dataView == "list") {
          questionCardListBox &&
          questionCardListBox.map((item, index) => {
            // state.applyButtonDisabledStatus=true
            questionCardListBox = fetchAnswerFromId(
              action.payload.projectId,
              item.questionId,
              item.questionName,
              item.questionNumber,
              item.numericQuestionId,
              questionCardListBox
            );
          })
        }
      //  state.applyButtonDisabledStatus=false
      } catch (e) {
        console.log("error-->", e);
      }
    },

    getDataFromId: (state,action) => {
      let dataList = state.originalQuestionData.filter(
        (el) => el.questionId == action.payload.questionId && el.numericQuestionId == action.payload.numericId
      );
      for(let i in state.questionCardListBox){
          if(state.questionCardListBox[i].questionId == action.payload.questionId &&
                state.questionCardListBox[i].numericQuestionId == action.payload.numericId){
            state.questionCardListBox[i].questionChoice = dataList[0].questionChoice;
          }
      }
    },

    upateGridData: (state, action) => {
      let newList = state.questionCardListBox.filter(
        (el) => el.numericQuestionId != action.payload.numericQuestionId
      );
      newList.push(action.payload);
      state.questionCardListBox = newList;
      state.questionCardListBox=state.questionCardListBox.sort((a, b) => (a.sorting - b.sorting))
      state.originalQuestionData= state.questionCardListBox
      // dataSlice.caseReducers.changeApplyButtonStatus(state,{payload:false})
      ORIGINAL_QUESTION_DATA=state.questionCardListBox
      // localStorage.removeItem('allListData')
      // localStorage.setItem('allListData', JSON.stringify(state.questionCardListBox))
      // setTimeout(() => {
      //   state.applyButtonDisabledStatus=false
      // }, 30000);
    },

    updateTableData: (state, action) => {
      for(let i in state.tableRowData){
          if(action.payload.id == state.tableRowData[i].id){
            state.tableRowData[i].isFavourite=!state.tableRowData[i].isFavourite
          }
      }
    },

    handleCheckboxChecked: (state,action) => {
      for(let i in state.tableRowData){
        if(action.payload.id == state.tableRowData[i].id){
          state.tableRowData[i].isChecked=!state.tableRowData[i].isChecked
        }
      }
    },

    handleAllSelect: (state,action) => {
      for(let i in state.tableRowData){
          state.tableRowData[i].isChecked=action.payload
      }
    },

    resetGridData: (state,action) => {
        state.questionCardListBox = JSON.parse(localStorage.getItem('allListData')) ? JSON.parse(localStorage.getItem('allListData')) : state.questionCardListBox
        state.totalCount = state.originalTotalCount
        state.tableRowData= JSON.parse(localStorage.getItem('tabularData')) ? JSON.parse(localStorage.getItem('tabularData'))  : state.tableRowData

      state.allSearchDataList=[]
      FILTRED_DATA=[]
      FILTRED_DATA_SIZE=0
      IS_FILTER_APPLIED=false
    },

    deleteResponse: (state,action) => {
      for(let i in action.payload){
        state.tableRowData=state.tableRowData.filter(el => el.id != action.payload[i])
      }
      state.totalCount=state.tableRowData.length
    },

    updateGraphData: (state, action) => {
      for (let i = 0; i < state.questionCardListBox.length; i++) {
        if (state.questionCardListBox[i].numericQuestionId == action.payload.numericQuestionId) {
          state.questionCardListBox[i] = { ...state.questionCardListBox[i],chartData: action.payload.chartData,};
          state.questionCardListBox[i] = {...state.questionCardListBox[i],legendData: action.payload.legendData,};
        }
      }
      state.questionCardListBox = state.questionCardListBox;
      state.originalQuestionData=state.questionCardListBox;
      // ORIGINAL_QUESTION_DATA=state.questionCardListBox
    },

    updateResponseCount: (state, action) => {
      state.totalCount = action.payload;
      state.originalTotalCount = action.payload
    },

    setAllUserResponse: (state, action) => {
      state.setAllUserResponse = action.payload;
      jsonUserResponse = action.payload;
    },

    setJSONThemeDetails: (state, action) => {
      state.setAllThemeDetails = action.payload.data;
    },

    setThemeDetails: (state, action) => {
      state.setThemeDetails = action.payload;
    },

    fetchTableQuestion: (state, action) => {
      let videoQuestionList = [];
      let videoQuestionIds = [];
      let mainQuestionList = [];
      let tableData = [];
      for (let i in action.payload) {
        tableData.push({
          questionId: action.payload[i].question_id,
          questionType: action.payload[i].question_type,
          questionName: action.payload[i].question_text,
          questionNumber: action.payload[i].question_name,
          isSunBurst: action.payload[i].is_sunburst,
          isSkeleton: true,
          numericQuestionId: action.payload[i].numeric_question_id,
          sortingOrder: "asc",
        });
        if (action.payload[i].question_type == "FileUpload" && action.payload[i].is_sunburst == true) {
          videoQuestionList.push({
            questionName: action.payload[i].question_text + "-Transcript",
            questionNumber: action.payload[i].question_name,
          });
          videoQuestionIds.push(action.payload[i].question_id);
        }
        mainQuestionList.push({ [action.payload[i].question_text]: "" });
      }
      state.tabularData = tableData;
      state.videoQuestionIds=videoQuestionIds
      state.videoQuestionList=videoQuestionList
    },

    fetchTableRowData: (state, action) => {
      let rowData = [];
      for (let i = 0; i < action.payload.data.qualtrics_response_data.length; i++) {
        //  rowData.push({});
        rowData.push({
          id: action.payload.data.qualtrics_response_data[i]._id._id.$oid,
          isFavourite:
            action.payload.data.qualtrics_response_data[i]._id.is_favourite,
          userResponse: setAnswerJson(
            action.payload.data.qualtrics_response_data[i].user_response
          ),
        });
        // mainResponse.push(rowData)
      }
      state.tableRowData = rowData;
      TABLE_DATA=rowData
      localStorage.setItem('tabularData',JSON.stringify(rowData))
    },



    filterData: (state, action) => {
      let userIdList = [];
      let data = action.payload;
      FILTRED_DATA=[]
      IS_FILTER_APPLIED  = false;
      localStorage.removeItem("state")
      if(!localStorage.getItem("allListData") && state.dataView === 'list'){
        try {
          localStorage.setItem('allListData',JSON.stringify(state.questionCardListBox))
        } catch (error) {
          console.log('Error in local storage', error);
        }
      }

      state.questionCardListBox=JSON.parse(localStorage.getItem("allListData"))
      state.tableRowData=JSON.parse(localStorage.getItem("tabularData"))
      for (let i in data) {
        let keysList = Object.keys(data[i]);
        if(keysList.length > 0 ){

          if (keysList.includes("is_favourite")) {
            filterbyFavourite(state, { favouriteValue: data[i]["is_favourite"] });

           }
           if (keysList.includes("is_video_themes")) {

             if (data[i].type == "THEMES") {
               filterByTheme(state,{
                 themeId: data[i]["filter_request"],
                 type: "THEMES",
               });
             }
             if (data[i].type == "TAGS") {
               filterByTheme(state,{
                 tagId: data[i]["filter_request"],
                 type: "TAGS",
               });
             }
           }
           if (keysList.includes("is_video_duration")) {
               filterByVideoDuration(state,{
               start_range: data[i].start_range,
               end_range: data[i].end_range,
             });
           }
           if (keysList.includes("is_response_datetime")) {
             filterByDateRange(state,{
               end_date: data[i].end_date,
               is_response_datetime: true,
               start_date: data[i].start_date,
             });
           }
           if (keysList.includes("is_request_to_response")) {
             if (state.dataView == 'grid') {
               filterByResponseToQuestionDataTable(state,data[i]);
             }
             if (state.dataView == 'list') {
               filterByResponseToQuestion(state,data[i]);
             }
           }
           IS_FILTER_APPLIED  = true;
        }

      }
      dataSlice.caseReducers.setAllData(state, FILTRED_DATA);
    },

    filterBySearch: (state, action) => {
      let userIdList = [];
      FILTRED_DATA_SIZE = FILTRED_DATA.length;
      for (let i in state.setAllUserResponse.user_response_dtls) {
        let checkResult = state.setAllUserResponse.user_response_dtls[i].question_answer_list.some((substring) => substring.includes(action.payload));

        if (
          checkResult &&
          !userIdList.includes(
            state.setAllUserResponse.user_response_dtls[i]._id.$oid
          )
        ) {
          userIdList.push(
            state.setAllUserResponse.user_response_dtls[i]._id.$oid
          );
        }
      }
      if(IS_FILTER_APPLIED && FILTRED_DATA_SIZE === 0){
        FILTRED_DATA = FILTRED_DATA
      }else if(FILTRED_DATA_SIZE > 0){
        let result = FILTRED_DATA.filter(el => userIdList.some(ol => ol == el));
        FILTRED_DATA = result;
      }else{
        FILTRED_DATA = userIdList;
      }
      state.totalCount = FILTRED_DATA.length;
    },

    fetchDataTableWithFilter: (state,action)=> {
      let size=10;
      let pageNo=0;
      let skip=0
      let next=0
      pageNo=action.payload
      skip = size * (pageNo - 1)
      next = size * pageNo
      let rowData=[]
      let rowUserData=state.allSearchDataList.slice(skip,next)
      for (let i = 0; i < rowUserData.length; i++) {
        rowData.push({
          id:  rowUserData[i]._id.$oid,
          isFavourite:  rowUserData[i].is_favourite,
          userResponse: setAnswerJson(rowUserData[i].user_response_dtls),
        });
      }
      state.tableRowData = rowData;
    },
    fetchDataTablewithFilterAndSorting: (state,action)=> {
      let sortedList=[]
      let size=10;
      let pageNo=0;
      let skip=0
      let next=0
      pageNo=action.payload.pageNo
      skip = size * (pageNo - 1)
      next = size * pageNo

      for(let i in state.allSearchDataList){
        let filteredList=state.allSearchDataList[i].user_response_dtls.filter(el => el.numeric_question_id == action.payload.numericQuestionId)
        if(filteredList.length > 0){
          sortedList.push({id:state.allSearchDataList[i]._id.$oid,answer:filteredList[0].question_answer})
        }
      }
      if(action.payload.sortOrder == 1){
        // sortedList=sortedList.sort((a, b) => (a.answer - b.answer))
        sortedList=sortedList.sort((a, b) => a.answer?.toString().localeCompare(b.answer))
      }else{
        sortedList=sortedList.sort((a, b) => b.answer?.toString().localeCompare(a.answer))
        // sortedList=sortedList.sort((a, b) => (b.answer - a.answer))
      }
      // let rowUserData=state.allSearchDataList.slice(skip,next)
      let rowData=[]
      for(let i in sortedList){
        let userSortedList=state.allSearchDataList.filter(el => el._id.$oid == sortedList[i].id)
        // rowData.push(userSortedList[0])
        rowData.push({
          id:  userSortedList[0]._id.$oid,
          isFavourite:  userSortedList[0].is_favourite,
          userResponse: setAnswerJson(userSortedList[0].user_response_dtls),
        });
      }
      let rowUserData=rowData.slice(skip,next)
      state.tableRowData=rowUserData
      state.tabularData.forEach(question => {
        if (question.numericQuestionId == action.payload.numericQuestionId) {
          if (action.payload.sortOrder == 1) {
            question.sortingOrder = 'asc'
          } else {
            question.sortingOrder = 'desc'
          }
        }
      })
    },

    setAllData: (state, action) => {
      let userIdList = action;
      if (state.dataView == "list") {
        if(userIdList.length == 0){
          state.questionCardListBox=[]
        }else{
          // let listData=ORIGINAL_QUESTION_DATA
          state.questionCardListBox=JSON.parse(localStorage.getItem("allListData"))
          for (let i in state.questionCardListBox) {
            let questionChoiceList = [];
            if (state.questionCardListBox[i].graphType == "stack_bar_chart") {
              for (const [key, value] of Object.entries(
                state.questionCardListBox[i].filterGraphData
              )) {
                let valueList = Object.values(value.user_response_dtls);
                let newList = [];
                if(valueList.length > 0){
                    newList.push(
                      valueList.filter((el) => userIdList.includes(el))
                    );
                }
                let count = 0;
                for (const [keys, values] of Object.entries(value.count)) {
                  value.count[keys] = Array.isArray(newList[count])
                    ? newList[count].length
                    : 0;
                  count += 1;
                }
                value.user_response_dtls = newList;
              }
              state.questionCardListBox[i].graphData = generateGraphData(
                state.questionCardListBox[i].filterGraphData
              );
            } else if (state.questionCardListBox[i].graphType == "multi_column_bar_chart") {
              for (const [key, value] of Object.entries(state.questionCardListBox[i].filterGraphData)) {
                if (value.categorized_user_response_dtls) {
                  let valueList =
                    value.categorized_user_response_dtls &&
                    Object.values(value.categorized_user_response_dtls);
                  let newList = [];
                  for (let i in valueList) {
                    newList.push(
                      valueList[i].filter((el) => userIdList.includes(el))
                    );
                  }
                  let count = 0;
                  for (const [keys, values] of Object.entries(value.count)) {
                    value.count[keys] = Array.isArray(newList[count])
                      ? newList[count].length
                      : 0;
                    count += 1;
                  }
                  value.user_response_dtls = newList;
                }
              }
              state.questionCardListBox[i].graphData = generateMultiBar(
                state.questionCardListBox[i].filterGraphData
              );
            } else if (state.questionCardListBox[i].questionType == "MC") {
              questionChoiceList = setMultiChoiceAnswer(
                userIdList,
                state.questionCardListBox[i]
              );
              state.questionCardListBox[i].questionChoice = questionChoiceList;
            } else if (
              state.questionCardListBox[i].questionType == "SE" ||
              state.questionCardListBox[i].questionType == "TE" ||
              state.questionCardListBox[i].questionType == "ML" ||
              state.questionCardListBox[i].questionType == "SL"
            ) {
              let query = [];
              query = setTextTypeAnswer(userIdList, state.questionCardListBox[i]);
              state.questionCardListBox[i]['questionData'] = query ? query : [];
            } else if (
              state.questionCardListBox[i].questionType == "FileUpload"
            ) {
              if (state.questionCardListBox[i].isSunBurst) {
                var query =
                state.questionCardListBox[i].knitVideoResponse &&
                state.questionCardListBox[i].knitVideoResponse.filter((c) =>
                    userIdList.includes(c[0].user_response_id.$oid)
                  );
                  state.questionCardListBox[i].knitVideoResponse = query;
                  state.questionCardListBox[i] = setSunbrustChartData(
                  userIdList,
                  state.questionCardListBox[i]
                );
              } else {
                var query =
                state.questionCardListBox[i].questionData &&
                state.questionCardListBox[i].questionData.filter((c) =>
                    userIdList.includes(c.user_response_id.$oid)
                  );
                  state.questionCardListBox[i].questionData = query;
              }
            }
          }
        }
        state.questionCardListBox=state.questionCardListBox
      } else {
        // state.tableRowData=localStorage.getItem("tabularData")
        let newList = [];
        let insertedList = [];
        for (let i in state.setAllUserResponse.user_response_dtls) {
          if (!insertedList.includes(state.setAllUserResponse.user_response_dtls[i]._id.$oid) &&
            userIdList.includes(state.setAllUserResponse.user_response_dtls[i]._id.$oid)) {
            newList.push(state.setAllUserResponse.user_response_dtls[i]);
              insertedList.push(state.setAllUserResponse.user_response_dtls[i]._id.$oid);
          }
        }
        let tableData = [];
        state.allSearchDataList=newList
        dataSlice.caseReducers.fetchDataTableWithFilter(state,{payload: 1})
      }
    },
  },
});


const getChildrenUserId = (userIdList, childList) => {
  for (let i in childList) {
    if (
      Array.isArray(childList[i].children) &&
      childList[i].children.length > 0
    ) {
      getChildrenUserId(userIdList, childList[i].children);
    } else {
      var query=[];
      query = childList[i].userResponseId && childList[i].userResponseId.filter((c) => userIdList.includes(c));
      // childList[i] = childList[i].concat({ userResponseId: query});
      // childList[i] = childList[i].concat({ loc: query.length : 0 });

      // childList[i]["userResponseId"]=query ? query :[]
      childList[i].userResponseId = query ? query : [];
      childList[i].loc = Array.isArray(query) ? query.length : 0;
      // return childList;
    }
  }
};

const setSunbrustChartData = (userIdList, filterResponseList) => {
  if (filterResponseList.chartData) {
    let childList = [];
    for (let i in filterResponseList.chartData.children) {
      console.log('childList==>',filterResponseList.chartData.children)
      if (filterResponseList.chartData.children[i].children) {
        getChildrenUserId(
          userIdList,
          filterResponseList.chartData.children[i].children
        );
      }
    }
    return filterResponseList;
  }
};

const setMultiChoiceAnswer = (userIdList, filterResponseList) => {
  let userResponse = {};
  let questionChoiceList = [];
  for (let j in filterResponseList.filterQuestionChoice) {
    let userList =
      filterResponseList.filterQuestionChoice[j].user_response_id_list;
    var query = userList && userList.filter((c) => userIdList.includes(c.$oid));

    let total = Array.isArray(query) ? query.length : 0;
    userResponse = {
      choiceText: filterResponseList.filterQuestionChoice[j].choiceText,
      description: filterResponseList.filterQuestionChoice[j].description,
      percentage: (total * 100) / userIdList.length,
      total: total,
    };
    questionChoiceList.push(userResponse);
  }
  return questionChoiceList;
};

function setTextTypeAnswer (userIdList, filterResponseList){
  let query = [];
  if (filterResponseList.filterQuestion) {
    Object.entries(filterResponseList.filterQuestion).map(([key, value]) => {
      if (userIdList.includes(key)) {
        query.push(value);
      }
    });
  }
  return query;
};

const setAnswerJson = (data) => {
  let answerList = [];
  for (let j = 0; j < data.length; j++) {
    if (JSON.stringify(data[j]) != "{}") {
      if (data[j].question_answer != "") {
        answerList.push({
          questionId: data[j].question_id,
          questionAnswer: data[j].question_answer,
          questionType: data[j].question_type ? data[j].question_type.type : "",
          questionSelector: data[j].question_type
            ? data[j].question_type.selector
            : "",
          originalVideoDuration: data[j].original_video_duration,
          videoThumbnailUrl: data[j].video_thumbnail_url,
          numericQuestionId: data[j].numeric_question_id
        });
      } else {
        answerList.push({
          questionId: data[j].question_id,
          questionAnswer: "-",
          questionType: data[j].question_type.type,
          originalVideoDuration: data[j].original_video_duration,
          videoThumbnailUrl: data[j].video_thumbnail_url,
          numericQuestionId: data[j].numeric_question_id
        });
      }
    } else {
      answerList.push({
        questionId: "-",
        questionAnswer: "-",
        questionType: "-",
        originalVideoDuration: "-",
        videoThumbnailUrl: "-",
        numericQuestionId: "-"
      });
    }
  }
  return answerList;
};

function filterByResponseToQuestionDataTable (state, action) {
  let userIdList = [];
  FILTRED_DATA_SIZE = FILTRED_DATA.length;
    if (action.question_type == "MC" || action.question_type == "Matrix") {
      if (action.generic_data_type == "INTEGER") {
        let newList = [];
        for (let i in state.setAllUserResponse.user_response_dtls) {
          for (let j in state.setAllUserResponse.user_response_dtls[i].user_response_dtls) {
            if (!userIdList.includes(state.setAllUserResponse.user_response_dtls[i]._id.$oid) &&
            state.setAllUserResponse.user_response_dtls[i].user_response_dtls[j].numeric_question_id == action.numeric_question_id &&
            state.setAllUserResponse.user_response_dtls[i].question_answer >= Number(action.start_date) &&
            state.setAllUserResponse.user_response_dtls[i].question_answer <= Number(action.end_date)
            ) {
            userIdList.push(state.setAllUserResponse.user_response_dtls[i]._id.$oid);
            newList.push(state.setAllUserResponse.user_response_dtls[i]);
          }
        }
      }

      if(IS_FILTER_APPLIED && FILTRED_DATA_SIZE === 0){
        FILTRED_DATA = FILTRED_DATA
      }else if(FILTRED_DATA_SIZE > 0){
        let result = FILTRED_DATA.filter(el => userIdList.some(ol => ol == el));
        FILTRED_DATA = result;
      }else{
        FILTRED_DATA = userIdList;
      }
      state.totalCount = FILTRED_DATA.length;
    } else {
      let newlist = [];
      let insertedList = [];
      for (let i in state.setAllUserResponse.user_response_dtls) {
        for (let j in state.setAllUserResponse.user_response_dtls[i].user_response_dtls) {
          for (let k in action.filter_request) {
            if (!userIdList.includes(state.setAllUserResponse.user_response_dtls[i]._id.$oid) &&
                  state.setAllUserResponse.user_response_dtls[i].user_response_dtls[j].numeric_question_id == action.numeric_question_id &&
                  state.setAllUserResponse.user_response_dtls[i].user_response_dtls[j].question_answer.includes(action.filter_request[k])) {
                  userIdList.push(state.setAllUserResponse.user_response_dtls[i]._id.$oid);
                  newlist.push(state.setAllUserResponse.user_response_dtls[i]);
            }
          }
        }
      }

      if(IS_FILTER_APPLIED && FILTRED_DATA_SIZE === 0){
        FILTRED_DATA = FILTRED_DATA
      }
       else if(FILTRED_DATA_SIZE > 0){
        let result = FILTRED_DATA.filter(el => userIdList.some(ol => ol == el));
        FILTRED_DATA = result;
      }else{
        FILTRED_DATA = userIdList;
      }
      state.totalCount = FILTRED_DATA.length;
   }
  } else if (action.question_type == "TE") {
    let newlist = [];
    let insertedList = [];
    for (let i in state.setAllUserResponse.user_response_dtls) {
      // let newList=state.setAllUserResponse.user_response_dtls[i].user_response_dtls.filter(el => el.numeric_question_id == action.payload.numeric_question_id)
      for (let j in state.setAllUserResponse.user_response_dtls[i]
        .user_response_dtls) {
        if (!userIdList.includes(state.setAllUserResponse.user_response_dtls[i]._id.$oid) &&
          state.setAllUserResponse.user_response_dtls[i].user_response_dtls[j].numeric_question_id == action.numeric_question_id &&
          state.setAllUserResponse.user_response_dtls[i].user_response_dtls[j].question_answer.includes(action.filter_request)) {
            userIdList.push(state.setAllUserResponse.user_response_dtls[i]._id.$oid);
            newlist.push(state.setAllUserResponse.user_response_dtls[i]);
        }
      }
    }
    if(IS_FILTER_APPLIED && FILTRED_DATA_SIZE === 0){
      FILTRED_DATA = FILTRED_DATA
    }
     else if(FILTRED_DATA_SIZE > 0){
      let result = FILTRED_DATA.filter(el => userIdList.some(ol => ol == el));
      FILTRED_DATA = result;
    }else{
      FILTRED_DATA = userIdList;
    }
    state.totalCount = FILTRED_DATA.length;
  } else if (action.question_type == "FileUpload") {
    for (let i in state.setAllUserResponse.video_dtls) {
      for (let j in action.filter_request) {
        if (action.is_sentiment) {
          if (!userIdList.includes(state.setAllUserResponse.video_dtls[i]._id.$oid) &&
              state.setAllUserResponse.video_dtls[i].video_feature_id == action.question_id &&
              state.setAllUserResponse.video_dtls[i].sentiment_type == action.filter_request[j]) {
                userIdList.push(state.setAllUserResponse.video_dtls[i]._id.$oid);
          }
        }
        if (action.is_transcript) {
          if (!userIdList.includes(state.setAllUserResponse.video_dtls[i]._id.$oid) &&
            state.setAllUserResponse.video_dtls[i].video_feature_id ==action.question_id &&
            state.setAllUserResponse.video_dtls[i].video_transcription.toLowerCase().includes(action.filter_request[j].toLowerCase())) {
              userIdList.push(state.setAllUserResponse.video_dtls[i]._id.$oid);
          }
        }
      }
    }
    if(IS_FILTER_APPLIED && FILTRED_DATA_SIZE === 0){
      FILTRED_DATA = FILTRED_DATA
    } else if(FILTRED_DATA_SIZE > 0){
      let result = FILTRED_DATA.filter(el => userIdList.some(ol => ol == el));
      FILTRED_DATA = result;
    }else{
      FILTRED_DATA = userIdList;
    }
  }
  state.totalCount = FILTRED_DATA.length;
  dataSlice.caseReducers.setAllData(state, FILTRED_DATA);
}

function filterbyFavourite(state, action) {
  let localUserList = [];
  let filterredList = state.setAllUserResponse.meta_data.filter(
    (el) => el.is_favourite == action.favouriteValue
  );
  FILTRED_DATA_SIZE = FILTRED_DATA.length;
  for (let i in filterredList) {
    if(!localUserList.includes(filterredList[i]._id.$oid)){
      localUserList.push(filterredList[i]._id.$oid);
    }
  }

if(IS_FILTER_APPLIED && FILTRED_DATA_SIZE === 0){
  FILTRED_DATA = FILTRED_DATA
}
  else if(FILTRED_DATA_SIZE > 0){
    let result = FILTRED_DATA.filter(el => localUserList.some(ol => ol == el));
    FILTRED_DATA = result;
  }else{
    FILTRED_DATA = localUserList;
  }

  let updatedList = [];
  state.totalCount = FILTRED_DATA.length;
  //return userList;
}

function filterByVideoDuration(state, action) {
  let localUserList = [];
  FILTRED_DATA_SIZE = FILTRED_DATA.length;
  let filterredList = state.setAllUserResponse.video_dtls.filter(
    (el) =>
      el.original_video_duration >= action.start_range &&
      el.original_video_duration <= action.end_range
  );
  for (let i in filterredList) {
    if(!localUserList.includes(filterredList[i]._id.$oid)){
      localUserList.push(filterredList[i]._id.$oid);
    }
  }

  if(IS_FILTER_APPLIED && FILTRED_DATA_SIZE === 0){
    FILTRED_DATA = FILTRED_DATA
  }else if(FILTRED_DATA_SIZE > 0){
    let result = FILTRED_DATA.filter(el => localUserList.some(ol => ol == el));
    FILTRED_DATA = result;
  }else{
    FILTRED_DATA = localUserList;
  }

  let updatedList = [];
  let userList = [];
  updatedList = userList.filter((el) => FILTRED_DATA.includes(el._id.$oid));
  filterUserList = FILTRED_DATA;
  state.totalCount = FILTRED_DATA.length;
  //dataSlice.caseReducers.setAllData(state, filteredData);
  return userList;
}

function  filterByDateRange (state, action){
  let localUserList=[]
  let filterredList = state.setAllUserResponse.meta_data.filter(
    (el) =>
      el.created_on >= action.start_date &&
      el.created_on <= action.end_date
  );
  FILTRED_DATA_SIZE = FILTRED_DATA.length;
  for (let i in filterredList) {
    localUserList.push(filterredList[i]._id.$oid);
  }
  if(IS_FILTER_APPLIED && FILTRED_DATA_SIZE === 0){
    FILTRED_DATA = FILTRED_DATA
  }
   else if(FILTRED_DATA_SIZE > 0){
    let result = FILTRED_DATA.filter(el => localUserList.some(ol => ol == el));
    FILTRED_DATA = result;
  }else{
    FILTRED_DATA = localUserList;
  }

  filterUserList = FILTRED_DATA;
  state.totalCount = FILTRED_DATA.length;
}

function  filterByResponseToQuestion (state, action){
  let userIdList = [];
  let allUserlist = JSON.parse(localStorage.getItem("allListData"));
  filterUserList = allUserlist.filter(
    (el) =>
      el.questionId == action.question_id &&
      el.numericQuestionId.includes(action.numeric_question_id)
  );
  FILTRED_DATA_SIZE = FILTRED_DATA.length;
  if (action.question_type == "MC") {
    if (action.generic_data_type == "INTEGER") {
      let newList = [];
      for (const [key, value] of Object.entries(
        filterUserList[0].filterGraphData
      )) {
        let valueList = Object.values(value.user_response_dtls);
        for (const [key1, value1] of Object.entries(value.user_response_dtls)) {
          if (value1 >= Number(action.filter_request.start_range) && value1 <= Number(action.filter_request.end_range)) {
            newList.push(key1);
          }
        }
      }
      if(IS_FILTER_APPLIED && FILTRED_DATA_SIZE === 0){
        FILTRED_DATA = FILTRED_DATA
      }
       else if(FILTRED_DATA_SIZE > 0){
        let result = FILTRED_DATA.filter(el => newList.some(ol => ol == el));
        FILTRED_DATA = result;
      }else{
        FILTRED_DATA = newList;
      }

    } else {
      let localUserList=[]
      for (let i in filterUserList[0].filterQuestionChoice) {
        for (let j in action.filter_request) {
          if (
            filterUserList[0].filterQuestionChoice[i].choiceText.includes(
              action.filter_request[j]
            )
          ) {
            for (let j in filterUserList[0].filterQuestionChoice[i]
              .user_response_id_list)
              localUserList.push(
                filterUserList[0].filterQuestionChoice[i]
                  .user_response_id_list[j].$oid
              );
          }
        }
      }
      if(IS_FILTER_APPLIED && FILTRED_DATA_SIZE === 0){
        FILTRED_DATA = FILTRED_DATA
      }
       else if(FILTRED_DATA_SIZE > 0){
        let result = FILTRED_DATA.filter(el => localUserList.some(ol => ol == el));
        FILTRED_DATA = result;
      }else{
        FILTRED_DATA = localUserList;
      }
    }
  } else if (action.question_type == "TE") {
    let localUserList=[]
    for (const [key, value] of Object.entries(
      filterUserList[0].filterQuestion
    )) {
      if (value.includes(action.filter_request)) {
        localUserList.push(key);
      }
    }
    if(IS_FILTER_APPLIED && FILTRED_DATA_SIZE === 0){
      FILTRED_DATA = FILTRED_DATA
    }
     else if(FILTRED_DATA_SIZE > 0){
      let result = FILTRED_DATA.filter(el => localUserList.some(ol => ol == el));
      FILTRED_DATA = result;
    }else{
      FILTRED_DATA = localUserList;
    }
  } else if (action.question_type == "FileUpload") {
    let localUserList=[]
    for (let i in state.setAllUserResponse.video_dtls) {
      for (let j in action.filter_request) {
        if (action.is_sentiment) {
          if (
            !localUserList.includes(
              state.setAllUserResponse.video_dtls[i]._id.$oid
            ) &&
            state.setAllUserResponse.video_dtls[i].video_feature_id ==
              action.question_id &&
            state.setAllUserResponse.video_dtls[i].sentiment_type ==
              action.filter_request[j]
          ) {

            localUserList.push(
              state.setAllUserResponse.video_dtls[i]._id.$oid
            );
          }
        }
        if (action.is_transcript) {
          if (
            !localUserList.includes(
              state.setAllUserResponse.video_dtls[i]._id.$oid
            ) &&
            state.setAllUserResponse.video_dtls[i].video_feature_id ==
              action.question_id &&
            state.setAllUserResponse.video_dtls[i].video_transcription
              .toLowerCase()
              .includes(action.filter_request[j].toLowerCase())
          ) {
            localUserList.push(state.setAllUserResponse.video_dtls[i]._id.$oid);
          }
        }
      }
    }
    if(IS_FILTER_APPLIED && FILTRED_DATA_SIZE === 0){
      FILTRED_DATA = FILTRED_DATA
    }
     else if(FILTRED_DATA_SIZE > 0){
      let result = FILTRED_DATA.filter(el => localUserList.some(ol => ol == el));
      FILTRED_DATA = result;
    }else{
      FILTRED_DATA = localUserList;
    }
  }

  state.totalCount = FILTRED_DATA.length;
  dataSlice.caseReducers.setAllData(state, FILTRED_DATA);
}

function filterByTheme (state, action) {
  let userIdList = [];
  FILTRED_DATA_SIZE = FILTRED_DATA.length;
  if (action.type == "THEMES") {
    for (let i in state.setAllThemeDetails) {
      for (let j in state.setAllThemeDetails[i].theme_details) {
        if (
          !userIdList.includes(state.setAllThemeDetails[i]._id.$oid) &&
              state.setAllThemeDetails[i].theme_details[j]._id.$oid == action.themeId) {
                userIdList.push(state.setAllThemeDetails[i]._id.$oid);
        }
      }
    }
  }

  if (action.type == "TAGS") {
    let newList = [];
    for (let i in state.setAllThemeDetails) {
      for (let j in state.setAllThemeDetails[i].tag_details) {
        if (
          !userIdList.includes(state.setAllThemeDetails[i]._id.$oid) &&
          state.setAllThemeDetails[i].tag_details[j]._id.$oid == action.tagId) {
              userIdList.push(state.setAllThemeDetails[i]._id.$oid);
        }
      }
    }
  }
  if(IS_FILTER_APPLIED && FILTRED_DATA_SIZE === 0){
    FILTRED_DATA = FILTRED_DATA
  }
   else if(FILTRED_DATA_SIZE > 0){
      let result = FILTRED_DATA.filter(el => userIdList.some(ol => ol == el));
      FILTRED_DATA = result;
    }else{
      FILTRED_DATA = userIdList;
    }
  state.totalCount = FILTRED_DATA.length;
  //dataSlice.caseReducers.setAllData(state, userIdList);
}

export const {
  fetchAllQuestions,
  updateResponseCount,
  fetchTableQuestion,
  fetchTableRowData,
  upateGridData,
  updateGraphData,
  setAllUserResponse,
  setJSONThemeDetails,
  resetGridData,
  filterBySearch,
  setViewData,
  setThemeDetails,
  filterData,
  getDataFromId,
  updateTableData,
  handleCheckboxChecked,
  handleAllSelect,
  fetchDataTableWithFilter,
  fetchDataTablewithFilterAndSorting,
  resetProjectStoreData,
  deleteResponse,
  setListViewData,
  changeApplyButtonStatus
} = dataSlice.actions;
export default dataSlice.reducer;
