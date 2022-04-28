import {
  SET_DATA,FETCH_DATA, FETCH_TABLE_DATA, FETCH_TABLE_ROW_DATA
} from "../action-types/action-type";
import {
  getAllQuestionForGrid,
  getQuestionAnswerId,
  getQuestionTabData,
  getDetailsFromParticularId,
  getVideoFileTypeData,
  getSortedQuestionTableData,
  setUpdatedData } from "../../services/DataService"
import { fetchAllQuestions,updateResponseCount,fetchTableQuestion,fetchTableRowData,upateGridData,updateGraphData,setAllUserResponse ,changeApplyButtonStatus } from '../slice/DataSlice'
import ThemeColor from "../../config/ThemeColorConfig"
import appHSLThemeConfig from "../../config/HslThemeColorConfig";
import  {store}  from '../store/index' 
import axios from 'axios'
import zlib from 'zlib'
export const setData = data => {
  return { type: SET_DATA, payload: data };
};

let questionCardListBox=[]
let mainList=[]
let tableData=[]
let flag=0
export const fetchData = () =>  async (dispatch,getState) =>  {
  let projectId=getState().project.projectId
    getAllQuestionForGrid(projectId).then((response) => {
      flag=0
        dispatch(updateResponseCount(response.user_response_count))
        dispatch(fetchAllQuestions({data:response.data,projectId: projectId}))
      }).catch((error)=>{
        console.log('Fetch All Question error==>',error)
    });
};

export const fetchAnswerFromId = (projectId,questionId, questionName, questionNumber,numericQuestionId,questionCardListBox) =>{
  // store.dispatch()
  // setTimeout(()=>{
    // },1);
    getQuestionAnswerId(projectId,questionId,numericQuestionId).then((response) => {
      let dataList=[...questionCardListBox]
    let itemList=[]
    if (response.data) {
      if (response.data._id) {
        for (let i = 0; i < questionCardListBox.length; i++) {
          if (
            dataList[i].numericQuestionId == response.data._id.numeric_question_id
            ) {
            if (response.data.original_question_res) {
              dataList[i].questionText =
                response.data.original_question_res.questionText;
                dataList[i].questionNumber =
                response.data.original_question_res.questionName;
            } else if (questionName) {
              // dataList[i].questionText = questionName;
              dataList[i] = {...dataList[i], questionText: questionName }
            }
            let choiceslist=[]
            for(let j in  response.data.question_choices){
              let newList={
                choiceText:response.data.question_choices[j].choiceText,
                description:response.data.question_choices[j].description,
                percentage: response.data.question_choices[j].percentage,
                total: response.data.question_choices[j].total
              };
              choiceslist.push(newList)
            }
            dataList[i].questionNumber = questionNumber;
            dataList[i].knitVideoResponse =
              response.data.knit_video_response;
              dataList[i].questionChoice =
              choiceslist;
              dataList[i].filterQuestionChoice =
              response.data.question_choices;
              dataList[i].filterQuestion = response.data.user_response_dtls;
              dataList[i].videoResponse =
              response.data.knit_video_response;
              dataList[i].questionData =
              response.data.question_answer;
              dataList[i].questionSelector =
              response.data._id.question_selector;
              dataList[i].isSkeleton = false;
              dataList[i].flag+=1
              flag+=1
            if (response.data.chart_type) {
              if (response.data.chart_type == "stack_bar_chart") {
                dataList[i].graphData = generateGraphData(response.data.data);
                dataList[i].graphType = "stack_bar_chart";
                dataList[i].filterGraphData=response.data.data
                let legendData = [];
                let keys = [];
                keys = Object.keys(response.data.data);
                let count = 0;
                for (let i in keys) {
                  count += 1;
                  legendData = legendData.concat({ title: keys[i], color: ThemeColor(count, 1) });
                }
                dataList[i].legendData = legendData;
              }
              else if (response.data.chart_type === "multi_column_bar_chart") {
                if (response.data.data) {
                  dataList[i].graphData = generateMultiBar(response.data.data);
                  dataList[i].graphType = "multi_column_bar_chart";
                  dataList[i].filterGraphData=response.data.data
                  let legendData = [];
                  let keys = [];
                  let totalCount=Object.keys(response.data.data).length;
                  keys = Object.keys(response.data.data);
                  let count = 0;
                  for (let i in keys) {
                    count += 1;
                    
                    legendData = legendData.concat({ title: keys[i], color:totalCount == 1 ? ThemeColor(3, 1) : ThemeColor(count, 1) });
                  }
                  dataList[i].legendData = legendData;
                }
              }else if(response.data.chart_type == "TE"){
                dataList[i].questionType = "TE";
                dataList[i].questionSelector = "SL";
              }
            }
            itemList=dataList[i]
            if(dataList[i].isSunBurst){
              videoCardData(projectId,dataList[i].questionId,dataList);
            }
          }
        }
      }
    }
      questionCardListBox=dataList
      // state.applyButtonDisabled=false
      //  store.dispatch(changeApplyButtonStatus(false))
      store.dispatch(upateGridData(itemList))
    }).catch((error)=>{
      console.log('Fetch Answer From Id error==>',error)
      })
      return questionCardListBox;
}

export const loadData=(url) => async (dispatch,getState) =>{
  let projectId=getState().project.projectId

  axios.get(url, 
  {
    transformRequest: (data, headers) => {
    delete headers['Authorization'];
  } 
  }).then ((response) =>  {
    updatedJSON(projectId)
    dispatch(setAllUserResponse(response))
  })
}

export const updatedJSON = (projectId)  => {
  let user_data={
    "knit_project_id": projectId,
    "is_data_updated" : false
  }
  setUpdatedData(user_data).then((response) => {
  })
}

export const generateChartData = (data) => {
  let child = [];
  if (data) {
    for (let i in data) {
      if (data[i].children) {
        child.push({
          name: data[i].name,
          // loc: data[i].loc,
          color: appHSLThemeConfig(data[i].sequence, setOpacity(data[i].level)),
          // "color":"hsl(270, 70%, 50%)",
          children: generateChartData(data[i].children),
        });
      } else {
        child.push({
          name: data[i].name,
          loc: data[i].loc,
          color: appHSLThemeConfig(data[i].sequence, setOpacity(data[i].level)),
          // "color":"hsl(270, 70%, 50%)",
          children: generateChartData(data[i].children),
          userResponseId:data[i].user_response_dtls
        });
      }
    }
  }
  return child;
};
export const videoCardData = (projectId,id,questionCardListBox ) => {
  // let projectId=getState().project.projectId
  try{
    getVideoFileTypeData(projectId, id).then((response) => {
    // let {graphData}=this.state;
    let graphData = [];
    let legendData = [];
    let itemList=[]
    if (response.data && response.status_code == 200) {
      graphData.push({
        name: "nivo",
        color: "hsl(45, 70%, 50%)",
        children: generateChartData(response.data.chart_data),
      });

      for (let i in response.data.chart_data) {
        legendData.push({
          label: response.data.chart_data[i].name,
          color: appHSLThemeConfig(
            response.data.chart_data[i].sequence,
            setOpacity(response.data.chart_data[i].level)
          ),

        });
      }
      let arrayForSort = [...questionCardListBox]


      if(graphData){
        for (let i = 0; i < arrayForSort.length; i++) {
          if (arrayForSort[i].questionId == id) {
            arrayForSort[i] = {...arrayForSort[i], chartData: graphData[0] }
            // questionCardListBox[i]['chartData'] =  questionCardListBox[i]['chartData'] ?  graphData[0] : [];
            arrayForSort[i] = {...arrayForSort[i], legendData: legendData }
            itemList=arrayForSort[i]
            // questionCardListBox[i].legendData = legendData;
            // this.state.questionCardListBox[i].chartData=data;
          }
        }
      }
      
      questionCardListBox=arrayForSort

    }
    store.dispatch(updateGraphData(itemList))
    //  this.setState({graphData:graphData[0]})
  });
  }catch(e){
    console.log('inVideoData-->',e)
  }
  return questionCardListBox;
};



export const fetDataTableData = () => async (dispatch,getState) => {  
  let projectId=getState().project.projectId
  getQuestionTabData(projectId).then((response) => {
    dispatch(fetchTableQuestion(response.data))
    dispatch(fetchDataTableRowsData(0))
  })
}


export const fetchDataTableRowsData=(page)=>async (dispatch,getState) => {
  let projectId=getState().project.projectId
  getDetailsFromParticularId(page + 1,projectId).then((response) => {
  if (response.status_code == 200 && response.success) {
    dispatch(updateResponseCount(response.data.total_count))
    dispatch(fetchTableRowData({data: response.data,page: page}))
  }
})
}


export const  getSortedTableData = (numericQuestionId, pageNo, pageSize, sortOrder) => async (dispatch,getState)  => {
  let projectId=getState().project.projectId
  getSortedQuestionTableData(projectId, numericQuestionId, pageNo, pageSize, sortOrder).then(response => {
      dispatch(updateResponseCount(response.data.total_count))

      dispatch(fetchTableRowData({data: response.data,page: pageNo}))
      
  }).catch((error)=>{
   console.log('error==>',error)
  })
}



const  setAnswerJson = (data) => {
  let answerList = [];
  for (let j = 0; j < data.length; j++) {
    if (JSON.stringify(data[j]) != '{}') {
      if (data[j].question_answer != "") {
        answerList.push({
          questionId: data[j].question_id,
          questionAnswer: data[j].question_answer,
          questionType: data[j].question_type ? data[j].question_type.type : "",
          questionSelector:data[j].question_type ? data[j].question_type.selector : "",
          originalVideoDuration:data[j].original_video_duration,
          videoThumbnailUrl:data[j].video_thumbnail_url
        });
      } else {
        answerList.push({
          questionId: data[j].question_id,
          questionAnswer: "-",
          questionType: data[j].question_type.type,
          originalVideoDuration: data[j].original_video_duration,
          videoThumbnailUrl: data[j].video_thumbnail_url

        });
      }
    } else {
      answerList.push({
        questionId: "-",
        questionAnswer: "-",
        questionType: "-",
        originalVideoDuration: "-",
        videoThumbnailUrl: "-",

      });
    }

    // break;
  }
  return answerList;
};

export const  generateMultiBar = (data) => {
 try{ let Xkey = [];
  let xLabel = [{
    alignTicks: false,
  }];
  let xSeriesData = []
  let multiChartBar = [];
  let count = 0;
  let left = 100;
  let top = 10;
  let xValues = [];
  let yValues=[  {
    title: { text: "" },
    // height: '100%',
    top: '0%',
    offset: 0,
    labels: {
      enabled: false
    }
  },
  {
    title: { text: 'Number of responses' },
  },];
  if (data) {
    var totalCount = Object.keys(data).length;

    Object.entries(data).map(([key, value]) => {
      // if(count <3){
      if (value.count) {
        count += 1;
        Xkey.push(Object.keys(value.count));
        xValues.push(Object.values(value.count))
        // if(xSeriesData.length < 6 && xLabel.length < 6){
        xLabel.push({
          minorGridLineWidth: 0,
          min: 0,
          max: Xkey[0].length-1,
          title: { text: key },
          categories: Xkey[0],
          // alignTicks: false,
          // opposite: false,
          reversed: false,
          // reversedStacks: false,
          minPadding: 0,
          maxPadding: 0,
          offset: 0,
          width: '310px',
          // height: '100%',
          left: left + "px",
          // top:"0px"
          //top: this.getTopCount(count) + "px"
        })

        left += 350;
        top += 25;

        xSeriesData.push({
          stack: count,
          name: key,
          type: "histogram",
          data: xValues[count - 1],
          xAxis: count,
          yAxis: count,
          zIndex: -1,
          borderRadius: 4,
          color: totalCount == 1 ? ThemeColor(3, 1) : ThemeColor(count, 1)
        })
      }

      yValues.push({
        title: { text: "" },
        // height: '100%',
        top: '0%',
        offset: 0,
        labels: {
          enabled: false
        },
        gridLineWidth: 0,
        minorGridLineWidth: 0
      })
    
    })
  }

  multiChartBar.push({
    chart: {
      style: {
        fontFamily: 'Rubik'                    
      }, 
      reflow: true,
      backgroundColor: 'transparent',
      scrollablePlotArea: {
        minWidth: 325 * xLabel.length,
        scrollPositionX: 1,
      }
    },
    title: {
      text: ""
    },
    xAxis: xLabel,
    yAxis:yValues,
    legend: {
      enabled: false,
      align: 'right',
      verticalAlign: 'top',
      layout: 'vertical',
      itemStyle: {
        'color': '#001839',
        'font-weight': 'normal'
      },
      title: {
        text: 'Legend',
        style: {
          fontSize: '14px',
          color: '#001839',
          fontWeight: 'normal'
        }
      },
    },
    tooltip: {
      formatter: function () {
        return '<b>' + this.x + '</b><br/>' +
          this.series.name + ': ' + this.y ;
      }
    },
    exporting: {
      enabled:false,
      sourceWidth: 325 * xLabel.length,
      buttons: {
        contextButton: {
          //symbol: null,
          menuItems: null,
          //text: 'Download',
          onclick: function() {
            this.exportChart({
              type: 'image/png'
            });
          }
        }
      }
    },
    credits: {
      enabled: false
    },
    series: xSeriesData,
  
  })

  return multiChartBar[0];

}catch(e){
    console.log('Multi Bar Chart==>',e)
  }

}

export const  generateGraphData = (data) => {
  let xLabel = [];
  let xData = [];
  let xCategories = []
  let xValues = [];
  let Xdata = [];
  let userResponseId = []
  let xDataMainList = []
  Object.entries(data).map(([key, value]) => {
    xLabel.push(key)
    xData.push(value.count)
    // userResponseId.push(value.user_response_dtls)
    xValues = [];
    Xdata = [];

  })
  let Xkey = [];
  let XValue = [];
  for (let i in xData) {
    Xkey.push(Object.keys(xData[i]))
    XValue.push(Object.values(xData[i]))
  }

  //series
  xLabel.map((item, index) => {
    xCategories.push({
      name: item,
      data: XValue[index],
      color: ThemeColor(index + 1, 1),
      borderWidth: 0,
    })
  })
  let stackColumnData = {};
  stackColumnData = {
    chart: {
      type: 'column',
      width: 575,
      height: 300,
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Rubik'                    
      }
    },
    title: {
      text: ""
    },
    xAxis: {
      categories: Xkey[0]
    },
    yAxis: {
      allowDecimals: false,
      min: 0,
      title: {
        text: 'Number of responses'
      }
    },
    legend: {
      enabled: false,
      align: 'right',
      verticalAlign: 'top',
      layout: 'vertical',
      itemStyle: {
        'color': '#001839',
        'font-weight': 'normal'
      },
      title: {
        text: 'Legend',
        style: {
          fontSize: '14px',
          color: '#001839',
          fontWeight: 'normal'
        }
      },
    },
    tooltip: {
      formatter: function () {
        return '<b>' + this.x + '</b><br/>' +
          this.series.name + ': ' + this.y + '<br/>' +
          'Total: ' + this.point.stackTotal;
      }
    },
    exporting: {
      enabled:false,
      buttons: {
        contextButton: {
          //symbol: null,
          menuItems: null,
          //text: 'Download',
          onclick: function() {
            this.exportChart({
              type: 'image/png'
            });
          }
        }
      }
    },
    plotOptions: {
      series: {
        stacking: "normal"
      }
    },
    credits: {
      enabled: false
    },
  
    series: xCategories

  };
  // this.setState({ stackColumnData: this.state.stackColumnData })
  return stackColumnData;
}

const setOpacity=(level)=> {
  if (level == 1) {
    return "100%";
  } else if (level == 2) {
    return "70%";
  } else if (level == 3) {
    return "40%";
  } else {
    return "20%";
  }
}