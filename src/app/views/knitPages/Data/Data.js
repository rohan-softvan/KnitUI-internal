import React, { Component } from "react";
import { connect } from 'react-redux';
import { CSVLink } from "react-csv/lib";
import { Grid, Typography } from "@material-ui/core";
import Cookies from "universal-cookie";
import "../../../css/common.scss";
import SearchComponent from "../../../components/searchFilter/SearchFilter";
import Color from "../../../config/Color";
import tableIcon from "../../../../assets/images/sidebar/table.svg";
import tableIconActive from "../../../../assets/images/sidebar/table-bold.svg";
import analytics from "../../../../assets/images/sidebar/analytics.svg";
import analyticsActive from "../../../../assets/images/sidebar/analytics-bold.svg";
import ResponseTable from "../../../components/responsesTable/ResponseTable";
import SelectComponent from "../../../components/select/Select";
import { TableData, columns } from "../responseTable.js";
import VideoProductCard from "../../../components/videoProductCard/VideoProductCard";
import PhotoCollegeDorm from "../../../components/photoCollegeDorm/PhotoCollegeDorm";
import AccordianParagraph from "../../../components/accordianParagraph/AccordianParagraph";
import MultichoiceCard from "../../../components/questionResponse/QuestionResponse";
import TagQuestionAnswer from "../../../components/tagQuestionAnswer/TagQuestionAnswer"
import HighchartStackColumn from "../../../components/highchartStackColumn/HighchartStackColumn";
import MultiHighchartHistogram from "../../../components/multiHighchartHistogram/MultiHighchartHistogram";
import { Skeleton } from "@material-ui/lab";
import ThemeColor from "../../../config/ThemeColorConfig"
import SadCharacter from "../../../../assets/images/sad-character.png";
// import ButtonComponent from "../../../components/button/Button";
import {
  dataActionDropdown, getSortedQuestionTableData,
  getSortedFilteredQuestionTableData, getCSVDetailsFromParticularId, getprojectDataUpdated
} from "../../../services/DataService";
import appHSLThemeConfig from "../../../config/HslThemeColorConfig";
import ChipText from "../../../components/common/ChipText";
import AuthLoader from "../../../components/authLoader/Loader";
import PageWrapper from "../../PageWrapper/PageWrapper";
import "../../../css/common.scss";
import DeleteModel from "../../../components/deleteModal/DeleteModel"
import axios from "axios";
import { fetchData, fetDataTableData, getSortedTableData, loadData, fetchDataTableRowsData } from '../../../redux/actions/DataAction'
import { store } from '../../../redux/store/index'
import {
  setJSONThemeDetails, updateTableData, deleteResponse,
  filterBySearch, setViewData, filterData, resetGridData, getDataFromId, handleCheckboxChecked, handleAllSelect, fetchDataTableWithFilter,
  setListViewData,fetchDataTablewithFilterAndSorting
} from '../../../redux/slice/DataSlice'
import { setProjectId } from '../../../redux/slice/ProjectSlice'
import ChartEditor from "../../../chartEditor/ChartEditor"

let menu = [
  {
    title: "Favourite",
    value: "is_favourite",
    key: 1,
  },
  {
    title: "Delete",
    value: "is_deleted",
    key: 2,
  },
  {
    title: "Export as CSV",
    value: "export_csv",
    key: 3,
  },
];

let id = 0;

function epochToDate(epoch) {
  let date;
  if (epoch.toString().length > 10) {
    date = new Date(epoch);
  } else {
    date = new Date(epoch * 1000);
  }
  return date.getUTCFullYear() + "/" + addZero(date.getUTCMonth() + 1) + "/" + addZero(date.getUTCDate())
}

function addZero(data) {
  if (data < 10) {
    data = "0" + data
  }
  return data;
}

const formattedCSVFileDate = () => {
  let dateObj = new Date();
  let month = addZero(dateObj.getMonth() + 1);
  let date = addZero(dateObj.getDate());
  let hours = addZero(dateObj.getHours());
  let minutes = addZero(dateObj.getMinutes());
  return month + "-" + date + "-" + hours + minutes;
}

const getFormattedCSVFileName = (projectTitle) => {
  let formattedProjectTitle = projectTitle ? projectTitle.split(' ').join('_') : "";
  let formattedDate = formattedCSVFileDate();
  return formattedProjectTitle + "_" + formattedDate
}

function getQueryStringValue() {
  return window.location.href.split('/')[5];
}

function getListStringValue() {
  return window.location.href.split('=')[1];
}

class Data extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      orderFlag: false,
      TableData: TableData,
      isTableView: false,
      isListView: true,
      isListViewResponse: true,
      getQuestionAnswerId: [],
      selectedList: [],
      totalChecked: 0,
      isQuestionLoad: false,
      isResponseLoad: false,
      totalRecord: 0,
      page: 0,
      filteredData: [],
      subThemeName: [],
      tagListName: [],
      totalAppliedFilter: 0,
      removedDataState: [],
      searchText: '',
      filterResponseList: [],
      csvDetailsData: [],
      multiChartBar: [],
      allChecked: false,
      loading: false,
      deleteModalOpen: false,
      isListViewData: false,
      revoColumns: [],
      source: [],
      status:false,
    };
    this.responseLink = React.createRef();
  }

  componentDidMount() {
    let projectId = getQueryStringValue()
    let viewName = getListStringValue();
    this.props.setViewData(viewName)

    if(localStorage.getItem('allListData')){
      this.props.setListViewData()
    }

    this.getprojectDataUpdated(projectId);
    this.getThemeUpdatedThemeData(projectId)
    // const CancelToken = axios.CancelToken;
    // const source = CancelToken.source();
    // this.setState({
    //   source: source
    // })



    this.setState({ projectId: projectId }, () => {
      if (window.location.href.includes('questionId')) {
        var url = new URL(window.location.href);
        var questionId = url.searchParams.get("questionId");
        var numericId = url.searchParams.get("numericId");
        this.handleRedirectOpenText(questionId, numericId)
      }
    })
    let projectTitle;
    projectTitle = 'projectTitle' in this.props ? this.props.projectTitle : ""
    this.setState({ projectTitle: localStorage.getItem('projectTitle') });
  }

  // componentWillUnmount() {
  //   if (this.state.source) {
  //     this.state.source.cancel("API Cancelled")
  //   }
  // }


  getprojectDataUpdated = (projectId) => {
    let projectData = {
      "knit_project_id": projectId,
      "is_check": true
    }
    getprojectDataUpdated(projectData).then(response => {
      if (response.status_code == 200) {
        if (response.data.is_data_updated || this.props.setAllUserResponse.length <= 0) {
          this.props.loadJsonData(response.data.redux_data_url)
        }
            let viewName = getListStringValue();

        if (viewName == 'list' && projectId) {

          if (response.data.is_data_updated || this.props.questionCardListBox.length <= 0) {
            this.props.setProjectId(projectId);
            const { fetchData } = this.props;
            fetchData(this.state.projectId);
          }
          this.setState({ isListView: true })
          this.setState({ isTableView: false })
        } else {
          if (!this.props.mainList || (Array.isArray(this.props.mainList) && this.props.mainList.length <= 0)) {
            this.props.fetchData(this.state.projectId);
            this.props.fetDataTableData();
          }
          this.setState({ isTableView: true })
          this.setState({ isListView: false })
        }
      }
    });
  }

  getThemeUpdatedThemeData = (projectId) => {
    let projectData = {
      "knit_project_id": projectId,
      "theme_dtls": true
    }
    getprojectDataUpdated(projectData).then(response => {
      this.props.setAllThemeDetails(response)
    });
  }

  countTotalFilter = () => {
    let { totalAppliedFilter, filteredData } = this.state;
    let filterCount = 0;
    for (let i in filteredData) {
      Array.isArray(filteredData[i].filter_request) ?
        filterCount += filteredData[i].filter_request.length
        :
        filterCount += 1
    }
    this.setState({ totalAppliedFilter: filterCount })
  }

  setAnswerJson = (data) => {
    let answerList = [];
    for (let j = 0; j < data.length; j++) {
      if (JSON.stringify(data[j]) != '{}') {
        if (data[j].question_answer != "") {
          answerList.push({
            numericQuestionId: data[j].numeric_question_id,
            questionId: data[j].question_id,
            questionAnswer: data[j].question_answer,
            questionType: data[j].question_type ? data[j].question_type.type : "",
            questionSelector: data[j].question_type ? data[j].question_type.selector : "",
            originalVideoDuration: data[j].original_video_duration,
            videoThumbnailUrl: data[j].video_thumbnail_url
          });
        } else {
          answerList.push({
            numericQuestionId: data[j].numeric_question_id,
            questionId: data[j].question_id,
            questionAnswer: "-",
            questionType: data[j].question_type.type,
            originalVideoDuration: data[j].original_video_duration,
            videoThumbnailUrl: data[j].video_thumbnail_url

          });
        }
      } else {
        answerList.push({
          numericQuestionId: '-',
          questionId: "-",
          questionAnswer: "-",
          questionType: "-",
          originalVideoDuration: "-",
          videoThumbnailUrl: "-",

        });
      }
    }
    return answerList;
  };

  handleFavourite = (data) => {
    let { selectedList } = this.state;
    // data.isFavourite = !data.isFavourite;
    if (data.isFavourite != null) {
      selectedList.push(data.id);
    } else {
      selectedList = selectedList.filter(el => el != data.id);
    }
    this.props.updateTableData(data)
    this.setState({ mainList: this.state.mainList, selectedList }, () => {
      this.handleAction("is_favourite", !data.isFavourite);
    });
  };

  handleChecked = (data) => {
    let { selectedList } = this.state;
    let allChecked = this.state.allChecked;
    // data.isChecked = !data.isChecked;
    if (!data.isChecked) {
      selectedList.push(data.id);
    } else {
      selectedList = selectedList.filter(el => el != data.id);
      allChecked = false;
    }
    this.props.handleCheckboxChecked(data)
    this.setState({ mainList: this.state.mainList, selectedList, allChecked: allChecked }, () => {
      this.setState({ totalChecked: this.state.selectedList.length });
    });
  };


  selectAll = () => {
    let selectedList = []
    let { mainList } = this.props;
    if (!this.state.allChecked) {
      this.props.handleAllSelect(true)
      this.setState({ totalChecked: this.props.mainList.length })
    } else {
      this.props.handleAllSelect(false)
      this.setState({ totalChecked: [] })
    }

    this.setState({ allChecked: !this.state.allChecked })

  };

  getCSVDetails = (pageSize, projectId) => {
    let { questionCardListBox } = this.props;
    let questionsList = questionCardListBox;
    let mainList = this.props.mainList;
    let csvDetailsData = [];
    let questionsData = [];
    let output;
    let videoQuestionList = []
    this.setState({ loading: true })
    getCSVDetailsFromParticularId(pageSize, projectId).then(response => {
      let responseData = {}
      axios.get(response,
        {
          transformRequest: (data, headers) => {
            delete headers['Authorization'];
          }
        }).then((response) => {
          responseData = response;
          responseData.qualtrics_response_data.forEach(qualtricsData => {
            if (this.state.allChecked || this.state.selectedList.includes(qualtricsData._id._id.$oid)) {
              let qualtricsDataArr = [];
              let videoTranscript = [];
              qualtricsData.user_response.forEach(userResponseData => {
                if (Array.isArray(userResponseData.question_answer)) {
                  if (userResponseData.question_answer.length > 0) {
                    output = userResponseData.question_answer.join(',');
                  } else {
                    output = "-";
                  }
                } else if (typeof userResponseData.question_answer === 'object' &&
                  userResponseData.question_answer !== null &&
                  'question_file_link' in userResponseData.question_answer) {
                  output = userResponseData.question_answer.question_file_link;
                  if (this.props.videoQuestionIds.includes(userResponseData.question_id)) {
                    videoTranscript.push({
                      "transcript": userResponseData.video_transcription ? userResponseData.video_transcription : '-',
                      questionName: userResponseData.question_text + "-Transcript",
                      questionNumber: userResponseData.question_name,
                      questionId: userResponseData.question_id
                    });
                  }
                } else if (userResponseData.question_answer !== null && userResponseData.question_answer !== "") {
                  output = userResponseData.question_answer;
                } else {
                  output = "-";
                  if (this.props.videoQuestionIds.includes(userResponseData.question_id)) {
                    videoTranscript.push({
                      "transcript": "-",
                      questionName: userResponseData.question_text + "-Transcript",
                      questionNumber: userResponseData.question_name,
                      questionId: userResponseData.question_id
                    });
                  }
                }
                qualtricsDataArr.push(output);
              })
              if (videoTranscript.length > 0) {
                for (let i in videoTranscript) {
                  qualtricsDataArr.push(videoTranscript[i].transcript)
                }
              }
              csvDetailsData.push(qualtricsDataArr);

            }
          })
          questionsList.forEach(questionDetail => {
            let questionName, questionNumber;
            questionNumber = questionDetail.questionNumber ? questionDetail.questionNumber : ""
            questionName = questionDetail.questionName ? questionDetail.questionName : "";
            questionsData.push(questionNumber + " " + questionName);
          });
          if (Array.isArray(this.props.videoQuestionList) && this.props.videoQuestionList.length > 0) {
            for (let i in this.props.videoQuestionList) {
              let questionNumber = this.props.videoQuestionList[i].questionNumber ? this.props.videoQuestionList[i].questionNumber : ""
              let questionName = this.props.videoQuestionList[i].questionName ? this.props.videoQuestionList[i].questionName : "";
              questionsData.push(questionNumber + " " + questionName);
            }
          }
          mainList = mainList.map(data => {
            // data.isChecked = false;
            // return data;
            this.props.handleCheckboxChecked(data)
          });
          csvDetailsData = [questionsData, ...csvDetailsData];
          let outerThis = this;
          this.setState({ csvDetailsData }, () => {
            setTimeout(() => {
              outerThis.responseLink.link.click();
              outerThis.setState({ loading: false })
            }, 3000);
            this.setState({
              menuValue: 0,
              mainList: mainList, selectedList: [],
              allChecked: false, totalChecked: 0
            });
          })
        })
    })
  }

  handleAction = (e, isFavourite) => {
    if (e) {
      let user_data;
      if (e == "is_favourite") {
        if (isFavourite != null || isFavourite != undefined) {
          user_data = {
            knit_qualtric_resp_id_list: this.state.selectedList,
            is_favourite: isFavourite,
          };
        } else {
          user_data = {
            knit_qualtric_resp_id_list: this.state.selectedList,
            is_favourite: true,
          };
        }
        dataActionDropdown(user_data).then((response) => {
          if (response.status_code == 200 && response.success == true) {
            //  this.props.fetDataTableData()
            this.setState({ menuValue: 0, selectedList: [] });
          }
        });
      } else if (e == "is_deleted") {
        this.setState({ deleteModalOpen: true })
      } else if (e == "export_csv") {
        this.getCSVDetails(this.props.totalCount, this.state.projectId);
      }
      this.setState({ menuValue: e });
    }
  };

  handleAllChecked = () => {
    if (this.state.allChecked) {
      TableData.map((item, inedx) => {
        item.isChecked = false;
      });
    } else {
      TableData.map((item, inedx) => {
        item.isChecked = true;
      });
    }
    this.setState({
      tableData: this.state.tableData,
      allChecked: !this.state.allChecked,
    });
  };

  FetchSearchData = async (data, themeList, tagListName, searchText,subThemeName) => {
    this.setState({ filteredData: data, themeNameList: themeList, tagListName: tagListName, searchText: searchText,subThemeName:subThemeName }, () => {
      this.countTotalFilter()
    })
    data=data.filter(el => Array.isArray(el.filter_request) ? el.filter_request.length > 0 : el)
    if (searchText) {
      this.props.filterBySearch(searchText)
    }
    if(data.length == 0){
      this.props.resetGridData()
    }else{
      this.props.filterData(data)
    }
  }


  chartEditorModal = () => {
    console.log("Checked The Modal open ")
  }

  renderTitle = () => {
    return (
      <Grid container spacing={1} style={{ paddingBottom: 30 }}>
        <Grid item xs={12} md={12} lg={2} sm={2}>
          <Typography variant={"h6"} component={"h6"} className={"title-class"}>
            DATA
          </Typography>
          {this.state.isListView ?
            <Typography className={"subTitle"}>Showing {this.props.totalCount} of {this.props.totalCount}</Typography>
            :
            <Typography className={"subTitle"}>Showing {this.props.totalCount ? this.props.totalCount < 10 ? this.props.totalCount : 10 : 0} of {this.props.totalCount}</Typography>
          }
        </Grid>
        <Grid item xs={12} md={12} lg={10} sm={10} className={"buttonDiv sub-div-header"}>
          {/* <ButtonComponent
              // icon={<AddIcon />}
              iconPosition={"left"}
              fontSize={13}
              width={"120px"}
              margin={"0px 15px 0px 0px"}
              text={"Chart Editor"}
              onClick={this.chartEditorModal}
          ></ButtonComponent> */}

          <ChartEditor />


          {/* <MembersModal width={this.props.width}/> */}
          {this.state.totalChecked > 0 && (
            <SelectComponent
              menu={menu}
              handleChange={(e) => {
                this.handleAction(e.target.value);
              }}
              menuValue={this.state.menuValue}
            ></SelectComponent>
          )}

          {this.state.projectId &&
            <SearchComponent projectId={this.state.projectId}
              onSearch={(data, searchText, subThemeName, tagListName, themeNameList) => {
                this.FetchSearchData(data, themeNameList, tagListName, searchText,subThemeName);
                //  this.handleListAndGrid(data, searchText, subThemeName, tagListName, themeNameList);
              }}
              onClear={(e) => {
                this.setState({ totalAppliedFilter: 0, page: 0, searchText: "" , filteredData:[]});
                if (this.state.isListView) { this.props.resetGridData() } else { this.props.resetGridData() }
              }}
              filteredData={this.state.filteredData}
              removedData={this.state.removedDataState}
              totalCount={this.state.totalAppliedFilter}></SearchComponent>}

          <div style={{ marginLeft: 20, height: 30 }}>
            {this.state.isTableView && (
              <>
                <img
                  src={analytics}
                  className={"icon"}
                  style={{ margin: 5, cursor: "pointer" }}
                  onClick={() => {
                    this.props.history.push({
                      pathname: "/knit/projectsDetails/" + this.state.projectId + "/Data?view=list"
                    })
                  }}
                ></img>
                <img
                  src={tableIconActive}
                  className={"icon"}
                  style={{ margin: 5, cursor: "pointer" }}
                  onClick={() => {
                    this.props.history.push({
                      pathname: "/knit/projectsDetails/" + this.state.projectId + "/Data?view=grid"
                    })
                  }}
                ></img>
              </>
            )}
            {this.state.isListView && (
              <>
                <img
                  src={analyticsActive}
                  className={"icon"}
                  style={{ margin: 5, cursor: "pointer" }}
                  onClick={() => {
                    this.props.history.push({
                      pathname: "/knit/projectsDetails/" + this.state.projectId + "/Data?view=list"

                    })
                  }}
                ></img>
                <img
                  src={tableIcon}
                  className={"icon"}
                  style={{ margin: 5, cursor: "pointer" }}
                  onClick={() => {
                    this.props.history.push({
                      pathname: "/knit/projectsDetails/" + this.state.projectId + "/Data?view=grid"
                    })
                  }}
                ></img>
              </>
            )}

          </div>
        </Grid>
        <Grid item xs={12} md={12} lg={12} sm={12}>
          {this.state.csvDetailsData &&
            Array.isArray(this.state.csvDetailsData) &&
            this.state.csvDetailsData.length > 0 &&
            <CSVLink
              style={{ textDecoration: "none" }}
              data={this.state.csvDetailsData}
              filename={`${getFormattedCSVFileName(this.state.projectTitle)}.csv`}
              target="_blank"
              ref={(r) => (this.responseLink = r)}></CSVLink>}
        </Grid>
      </Grid>
    );
  };

  //set ascending order Number column in  Responses Tab
  sortAscending = (numericQuestionId) => {
    let { page, projectId, filteredData, searchText, orderFlag } = this.state;
    let pageSize = 10;
    let sortOrder = 1;
    let outerThis = this;
    this.setState({ sortOrder, numericQuestionId }, () => {
      if ((Array.isArray(filteredData) && filteredData.length > 0 || searchText) && orderFlag) {
        this.props.fetchDataTablewithFilterAndSorting({numericQuestionId: numericQuestionId,sortOrder:sortOrder,pageNo:this.state.page+1})
      } else {
        this.props.getSortedTableData(numericQuestionId, page + 1, pageSize, sortOrder);
      }
    });

    this.setState({
      TableData: TableData,
      order: "asc",
    });
  };

  //set sortDescending order Number column in  Responses Tab
  sortDescending = (numericQuestionId) => {
    let { page, projectId, filteredData, searchText, orderFlag } = this.state;
    let pageSize = 10;
    let sortOrder = -1;
    let outerThis = this;
    this.setState({ sortOrder, numericQuestionId }, () => {
      if ((Array.isArray(filteredData) && filteredData.length > 0 || searchText) && orderFlag) {
        this.props.fetchDataTablewithFilterAndSorting({numericQuestionId: numericQuestionId,sortOrder:sortOrder,pageNo:this.state.page+1})
      } else {
        this.props.getSortedTableData(numericQuestionId, page + 1, pageSize, sortOrder);
      }
    });

    this.setState({
      TableData: TableData,
      order: "desc",
    });
  };

  //change Ascending/descending on click
  changeOrder = (numericQuestionId) => {
    this.setState({ orderFlag: true, numericQuestionId: numericQuestionId }, () => {
      this.state.order === "desc"
        ? this.sortAscending(numericQuestionId)
        : this.sortDescending(numericQuestionId);
    })

  };

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage }, () => {
      if (this.state.orderFlag) {
        if ((Array.isArray(this.state.filteredData) && this.state.filteredData.length > 0) || this.state.searchText) {
          // this.props.fetchDataTableWithFilter(this.state.page + 1)
          this.props.fetchDataTablewithFilterAndSorting({numericQuestionId: this.state.numericQuestionId,sortOrder:this.state.sortOrder,pageNo:this.state.page+1})
        } else {
          this.props.getSortedTableData(this.state.numericQuestionId, this.state.page + 1, 10, this.state.sortOrder);
        }
      } else {
        if ((Array.isArray(this.state.filteredData) && this.state.filteredData.length > 0) || (this.state.searchText != null && this.state.searchText != "")) {
          this.props.fetchDataTableWithFilter(this.state.page + 1)
        } else {
          this.props.fetchDataTableRowsData(this.state.page)
        }
      }

    });
  };

  deleteModalClose = () => {
    this.setState({
      menuValue: 0,
      deleteModalOpen: false,
    });
  }

  handleDeleteData = () => {
    let user_data;
    user_data = {
      knit_qualtric_resp_id_list: this.state.selectedList,
      is_deleted: true,
    };
    dataActionDropdown(user_data).then((response) => {
      if (response.status_code == 200 && response.success == true) {
        this.props.deleteResponse(this.state.selectedList)
        this.setState({ menuValue: 0, selectedList: [], totalAppliedFilter: 0, totalChecked: [] });
      }
    });
    this.setState({
      deleteModalOpen: false,
    });
  }


  renderMultiChoiceSkeleton = () => {
    return <div className={"multichoice-skeleton"}>
      <Skeleton
        variant="text"
        style={{ marginBottom: 10, width: "50%" }}
      />
      <div className={"processbar-val-show"}>
        <div className={"process-val"}>
          <Skeleton
            variant="text"
            style={{ marginBottom: 10, width: "100%" }}
          />
        </div>
        <div className={"processbar-show"}>
          <Skeleton variant="rect" height={5}></Skeleton>
        </div>
      </div>
      <div className={"like-responce-blank"}>
        <div className={"blank-box"}></div>
        <div className={"like-responce"}>
          <div className={"likebox"}>
            <Skeleton
              variant="text"
              style={{ width: "150px" }}
            />
          </div>
          <div className={"responcebox"}>
            <Skeleton
              variant="text"
              style={{ width: "150px" }}
            />
          </div>
        </div>
      </div>
    </div>
  }

  renderImageSkeleton = () => {
    return <div className={"imagecard-box-skeleton"}>
      <div className={"question-download"}>
        <Skeleton variant="text" style={{ width: "95%" }} />
        <Skeleton
          variant="rect"
          width={14}
          height={14}
          style={{ marginLeft: "25px" }}
        />
      </div>

      <div className={"imagecards-skel-box"}>
        <Skeleton
          variant="rect"
          width={120}
          height={120}
          className={"imagecards-skel"}
        />
        <Skeleton
          variant="rect"
          width={120}
          height={120}
          className={"imagecards-skel"}
        />
        <Skeleton
          variant="rect"
          width={120}
          height={120}
          className={"imagecards-skel"}
        />
        <Skeleton
          variant="rect"
          width={120}
          height={120}
          className={"imagecards-skel"}
        />
        <Skeleton
          variant="rect"
          width={120}
          height={120}
          className={"imagecards-skel"}
        />
        <Skeleton
          variant="rect"
          width={120}
          height={120}
          className={"imagecards-skel"}
        />
        <Skeleton
          variant="rect"
          width={120}
          height={120}
          className={"imagecards-skel"}
        />
        <Skeleton
          variant="rect"
          width={120}
          height={120}
          className={"imagecards-skel"}
        />
        <Skeleton
          variant="rect"
          width={120}
          height={120}
          className={"imagecards-skel"}
        />
        <Skeleton
          variant="rect"
          width={120}
          height={120}
          className={"imagecards-skel"}
        />
        <Skeleton
          variant="rect"
          width={120}
          height={120}
          className={"imagecards-skel"}
        />
        <Skeleton
          variant="rect"
          width={120}
          height={120}
          className={"imagecards-skel"}
        />
        <Skeleton
          variant="rect"
          width={120}
          height={120}
          className={"imagecards-skel"}
        />
        <Skeleton
          variant="rect"
          width={120}
          height={120}
          className={"imagecards-skel"}
        />
      </div>
    </div>
  }


  renderVideoCardSkeleton = () => {
    return <div className={"videocard-box-skeleton"}>
      <div className={"question-download"}>
        <Skeleton variant="text" style={{ width: "95%" }} />
        <Skeleton
          variant="rect"
          width={14}
          height={14}
          style={{ marginLeft: "25px" }}
        />
      </div>
      <div className={"card-graph-legend"}>
        <div className={"video-cards"}>
          <Skeleton
            variant="rect"
            width={60}
            height={60}
            className={"rect-video-thumb"}
          />
          <Skeleton
            variant="rect"
            width={60}
            height={60}
            className={"rect-video-thumb"}
          />
          <Skeleton
            variant="rect"
            width={60}
            height={60}
            className={"rect-video-thumb"}
          />
          <Skeleton
            variant="rect"
            width={60}
            height={60}
            className={"rect-video-thumb"}
          />
          <Skeleton
            variant="rect"
            width={60}
            height={60}
            className={"rect-video-thumb"}
          />
          <Skeleton
            variant="rect"
            width={60}
            height={60}
            className={"rect-video-thumb"}
          />
          <Skeleton
            variant="rect"
            width={60}
            height={60}
            className={"rect-video-thumb"}
          />
          <Skeleton
            variant="rect"
            width={60}
            height={60}
            className={"rect-video-thumb"}
          />
          <Skeleton
            variant="rect"
            width={60}
            height={60}
            className={"rect-video-thumb"}
          />
          <Skeleton
            variant="rect"
            width={60}
            height={60}
            className={"rect-video-thumb"}
          />
          <Skeleton
            variant="rect"
            width={60}
            height={60}
            className={"rect-video-thumb"}
          />
          <Skeleton
            variant="rect"
            width={60}
            height={60}
            className={"rect-video-thumb"}
          />
          <Skeleton
            variant="rect"
            width={60}
            height={60}
            className={"rect-video-thumb"}
          />
          <Skeleton
            variant="rect"
            width={60}
            height={60}
            className={"rect-video-thumb"}
          />
          <Skeleton
            variant="rect"
            width={60}
            height={60}
            className={"rect-video-thumb"}
          />
          <Skeleton
            variant="rect"
            width={60}
            height={60}
            className={"rect-video-thumb"}
          />
          <Skeleton
            variant="rect"
            width={60}
            height={60}
            className={"rect-video-thumb"}
          />
          <Skeleton
            variant="rect"
            width={60}
            height={60}
            className={"rect-video-thumb"}
          />
          <Skeleton
            variant="rect"
            width={60}
            height={60}
            className={"rect-video-thumb"}
          />
          <Skeleton
            variant="rect"
            width={60}
            height={60}
            className={"rect-video-thumb"}
          />
          <Skeleton
            variant="rect"
            width={60}
            height={60}
            className={"rect-video-thumb"}
          />
          <Skeleton
            variant="rect"
            width={60}
            height={60}
            className={"rect-video-thumb"}
          />
          <Skeleton
            variant="rect"
            width={60}
            height={60}
            className={"rect-video-thumb"}
          />
          <Skeleton
            variant="rect"
            width={60}
            height={60}
            className={"rect-video-thumb"}
          />
          <Skeleton
            variant="rect"
            width={60}
            height={60}
            className={"rect-video-thumb"}
          />
          <Skeleton
            variant="rect"
            width={60}
            height={60}
            className={"rect-video-thumb"}
          />
          <Skeleton
            variant="rect"
            width={60}
            height={60}
            className={"rect-video-thumb"}
          />
          <Skeleton
            variant="rect"
            width={60}
            height={60}
            className={"rect-video-thumb"}
          />
        </div>
        <div className={"nivograph"}>
          <Skeleton
            variant="circle"
            width={300}
            height={300}
          />
        </div>
        <div className={"nivolegends"}>
          <Skeleton
            variant="text"
            style={{ width: "95%", marginBottom: "15px" }}
          />
          <div className={"legendValueSkel"}>
            <Skeleton
              variant="circle"
              width={23}
              height={17}
            />
            <Skeleton
              variant="text"
              style={{ width: "100%", marginLeft: "10px" }}
            />
          </div>
          <div className={"legendValueSkel"}>
            <Skeleton
              variant="circle"
              width={23}
              height={17}
            />
            <Skeleton
              variant="text"
              style={{ width: "100%", marginLeft: "10px" }}
            />
          </div>
          <div className={"legendValueSkel"}>
            <Skeleton
              variant="circle"
              width={23}
              height={17}
            />
            <Skeleton
              variant="text"
              style={{ width: "100%", marginLeft: "10px" }}
            />
          </div>
        </div>
      </div>
    </div>
  }

  handleRedirectOpenText = (questionId, numericQuestionId) => {
    let { history } = this.props;
    if (this.state.isListView) {
      history.push({
        pathname: "/knit/projectsDetails/" + this.state.projectId + "/Data?view=list&questionId=" + questionId + "&numericId=" + numericQuestionId,
        state: {
          questionId: questionId,
          numericQuestionId: numericQuestionId,
          projectId: this.state.projectId
        }
      })
    } else {
      history.push({
        pathname: "/knit/projectsDetails/" + this.state.projectId + "/Data?view=grid&questionId=" + questionId + "&numericId=" + numericQuestionId,
        state: {
          questionId: questionId,
          numericQuestionId: numericQuestionId,
          projectId: this.state.projectId
        }
      })
    }

  }

  renderResponseTable = () => {
    let typeArray = [];
    return (
      <Grid container>
        <Grid item xs={12} md={12} sm={12} lg={12} className={"data-grid"}>
          {this.state.isTableView && (
            <ResponseTable
              TableData={this.props.mainList}
              question={this.props.tableData}
              allChecked={this.state.allChecked}
              handleAllChecked={() => { this.selectAll() }}
              handleTableSort={(numericQuestionId) => {
                this.changeOrder(numericQuestionId);
              }}
              checked={(data) => {
                this.handleChecked(data);
              }}
              projectId={this.state.projectId}
              page={this.state.page}
              isQuestionLoad={this.state.isQuestionLoad}
              isResponseLoad={this.state.isResponseLoad}
              order={this.state.order}
              filteredData={this.state.filteredData}
              totalRecord={this.props.totalCount}
              favourite={(data) => this.handleFavourite(data)}
              handleChangePage={this.handleChangePage}
              getTabularFromData={(e, page) => { this.props.fetchDataTableRowsData(e) }}
              handleRedirect={(id, videoId, questionId) => { this.handleChangeVideoDetail(id, videoId, questionId) }}
              handleRedirectOpenText={(questionId, numericQuestionId) => { this.handleRedirectOpenText(questionId, numericQuestionId) }}
            ></ResponseTable>
          )}

          {Array.isArray(this.props.questionCardListBox) && this.props.questionCardListBox.length > 0 ?
            <>
              {this.state.isListView && this.state.isListViewResponse && (
                <>
                  {this.props.questionCardListBox &&
                    this.props.questionCardListBox.map((item, index) => {
                      let fileType = "";
                      if (item.questionType == "FileUpload") {
                        if (item.questionData && item.questionData.length > 0) {
                          for (let i = 0; i < item.questionData.length; i++) {
                            if (
                              item.questionData[i].question_file_type != null &&
                              item.questionData[i].question_file_type != ""
                            ) {
                              fileType = item.questionData[i].question_file_type;
                              break;
                            }
                          }

                          if (fileType != undefined) {
                            typeArray = fileType.split("/");
                          }
                        }
                      }
                      return item.graphType == "stack_bar_chart" ?
                        <>
                          <HighchartStackColumn title={item.questionNumber + " " + item.questionName} index={index} data={item.graphData} legend={item.legendData} export={this.exportHighstockGraph}></HighchartStackColumn>
                        </>
                        : item.graphType == "multi_column_bar_chart" ? (
                          <>
                            <MultiHighchartHistogram title={item.questionNumber + " " + item.questionName} index={index} data={item.graphData} legend={item.legendData}></MultiHighchartHistogram>
                          </>)
                          :
                          item.questionType == "MC" || item.questionType == "DD" ? (
                            item.isSkeleton ? (
                              this.renderMultiChoiceSkeleton()
                            ) : (
                              <>
                                {item.questionChoice &&
                                  <MultichoiceCard data={item} index={index} key={index}
                                    getByQuestionId={(id, text, number, numericQuestionId, isUpdate) => {
                                      this.props.getDataFromId({
                                        questionId: id,
                                        questionText: text,
                                        questionNumber: number,
                                        numericId: numericQuestionId
                                      })
                                    }
                                    } />
                                }
                              </>
                            )
                          ) : item.questionType == "FileUpload" &&
                            typeArray[0] == "image" ? (
                            item.isSkeleton ? (
                              <>
                                {this.renderImageSkeleton()}
                              </>
                            ) : (
                              <PhotoCollegeDorm
                                data={item}
                                isVideo={false}
                                isSkeleton={false}
                              ></PhotoCollegeDorm>
                            )
                          ) : item.questionType == "FileUpload" &&
                            typeArray[0] == "video" ? (
                            item.isSkeleton ? (
                              <>
                                {this.renderVideoCardSkeleton()}
                              </>
                            ) : (
                              <VideoProductCard
                                handleChange={(id, videoId) => { this.handleChangeVideoDetail(id, videoId, item.questionId) }}
                                data={item}
                                sunburstData={this.state.graphData}
                              ></VideoProductCard>
                            )
                          ) : item.questionType == "TE" &&
                            item.questionSelector == "ML" ? (
                            // item.questionAnswer &&
                            <AccordianParagraph data={item}
                              handleRedirectOpenText={() => { this.handleRedirectOpenText(item.questionId, item.numericQuestionId) }}
                            ></AccordianParagraph>
                          ) : item.questionType == "TE" &&
                            item.questionSelector == "SL" || "SE" ? (
                            item.questionData &&

                            <TagQuestionAnswer data={item.questionData} questionId={item.questionId} number={item.questionNumber}
                              numericQuestionId={item.numericQuestionId}
                              text={item.questionName}
                              handleRedirectOpenText={() => { this.handleRedirectOpenText(item.questionId, item.numericQuestionId) }} >
                            </TagQuestionAnswer>
                          ) : (
                            <></>
                          );
                    })}
                </>
              )}
            </>
            :
            Array.isArray(this.props.questionCardListBox) && this.props.questionCardListBox.length == 0 && this.state.isListView &&
              this.state.totalAppliedFilter > 0 ?
              <div className={"nodata-show"} >
                <div className={"nodata-innerdiv"}>
                  <img src={SadCharacter} />
                  <Typography>Sorry, that filter combination has no results. Please try different criteria.</Typography>
                </div>
              </div>
              : this.state.isListView &&
              <>
                {this.renderMultiChoiceSkeleton()}
                {this.renderImageSkeleton()}
                {this.renderVideoCardSkeleton()}
                {this.renderMultiChoiceSkeleton()}
                {this.renderImageSkeleton()}
                {this.renderVideoCardSkeleton()}
              </>}
        </Grid>
      </Grid>
    );
  };


  handleRemoveSearchFilter = () => {
    let searchfilterData = this.state.filteredData;
    document.dispatchEvent(new CustomEvent("remove_filter", {}))
  }

  handleRemove = (data, type) => {
    let removedDataState = this.state.removedDataState || [];
    removedDataState.push(data);
    this.setState({ removedDataState }, () => {
      document.dispatchEvent(new CustomEvent("create_remove_delete", {
        detail: { removedDataState }
      }))
    })
    let newObject = this.state.filteredData
    this.setState({ removedDataState: removedDataState, filteredData: [] })
    if (type) {
      for (let i in this.state.filteredData) {
        if (JSON.stringify(this.state.filteredData[i]) != JSON.stringify(data)) {
          let newList = type.filter_request.filter(el => el != data);
          type.filter_request = newList;
        }
      }
    } else {
      newObject = this.state.filteredData.filter(el => JSON.stringify(el) != JSON.stringify(data));

    }
    let mainFilterList = [];
    for (let i in newObject) {
      if (Array.isArray(newObject[i].filter_request)) {
        if (newObject[i].filter_request.length > 0) {
          mainFilterList.push(newObject[i])
        }
      } else if (newObject[i].filter_request != null) {
        mainFilterList.push(newObject[i])
      } else if (!newObject[i].hasOwnProperty("filter_request")) {
        mainFilterList.push(newObject[i])
      }

    }
    this.setState({ filteredData: mainFilterList, totalAppliedFilter: mainFilterList.length }, () => {
      if (this.state.isTableView) {
        if (this.state.orderFlag) {
          if ((Array.isArray(this.state.filteredData) && this.state.filteredData.length > 0 || this.state.searchText)) {
            this.setState({ page: 0 }, () => {
              this.props.fetchDataTablewithFilterAndSorting({numericQuestionId:this.state.numericQuestionId,sortOrder:this.state.sortOrder,pageNo:this.state.page+1})
            })
          } else {
            this.setState({ page: 0 }, () => {
              this.props.getSortedTableData(this.state.numericQuestionId, 1, 10, this.state.sortOrder);
            })
          }
        } else {
          this.setState({ page: 0 }, () => {
            // this.props.fetchDataTableWithFilter(this.state.page + 1)
            if(this.state.filteredData.length > 0){
              this.props.filterData(this.state.filteredData)
            }else{
              this.props.resetGridData()
            }
          })
        }

      } else {
        if (Array.isArray(this.state.filteredData) && this.state.filteredData.length > 0) {
          // this.getFilteredList(this.state.filteredData)
          this.props.filterData(this.state.filteredData)
        } else {
          this.props.resetGridData()
          // this.getAllQuestionForGrid()
        }

      }
    })

  }

  renderFilterApplied = () => {
    let mainDataList = []
    if (this.state.filteredData) {
      mainDataList = this.state.filteredData
    }
    return (
      <Grid container>
        <Grid item xs={12} md={12} sm={12} lg={12} className={"flex"} style={{ alignItems: 'center', paddingBottom: 30 }}>
          <div>
            {this.state.filteredData && this.state.filteredData.length > 0 && <Typography className={"subTitle"} style={{ paddingRight: 10 }}>Filters applied:</Typography>}
          </div>
          <div style={{ width: "auto", display: "flex", flexWrap: "wrap" }} >
            {this.state.filteredData && this.state.filteredData.map((item, index) => {
              let mainFilterName = "";
              if (item.is_video_duration) {
                if (item.start_range == 0 && item.end_range) {
                  mainFilterName = "Duration : null" + "-" + (item.end_range ? item.end_range + "" : null);
                }
                if (item.start_range && item.end_range == 0) {
                  mainFilterName = "Duration : " + (item.start_range ? item.start_range + " - max" : null);
                }
                if (item.start_range && item.end_range) {
                  mainFilterName = "Duration : " + item.start_range + "-" + item.end_range + ""
                }
              }
              if (item.is_response_datetime) {
                mainFilterName = "Date :" + (item.start_date ? epochToDate(item.start_date) : null) + "-" + (item.end_date ? epochToDate(item.end_date) : null);
              }
              if (item.hasOwnProperty("is_favourite")) {
                item.is_favourite == true ?
                  mainFilterName = "Starred"
                  :
                  mainFilterName = "Not Starred"
              }
              if (item.start_range && item.end_range == 0) {
                mainFilterName = "Duration : " + (item.start_range ? item.start_range + " - max" : null);
              }
              if (item.start_range && item.end_range) {
                mainFilterName = "Duration : " + item.start_range + "-" + item.end_range + ""
              }
              if (item.is_response_datetime) {
                mainFilterName = "Date :" + (item.start_date ? epochToDate(item.start_date) : null) + "-" + (item.end_date ? epochToDate(item.end_date) : null);
              }
              if (item.hasOwnProperty("is_favourite")) {
                item.is_favourite == true ?
                  mainFilterName = "Starred"
                  :
                  mainFilterName = "Not Starred"
              }
              if (typeof item.filter_request == 'string') {
                mainFilterName = item.filter_request
              }
              if (item.type == "THEMES") {
                let newThemeName = [];
                newThemeName = this.state.themeNameList.filter(el => el.id == item.filter_request);
                if (newThemeName.length <= 0) {
                  newThemeName = this.state.subThemeName.filter(el => el.id == item.filter_request);
                }
                mainFilterName = Array.isArray(newThemeName) && newThemeName.length > 0 ? newThemeName[0].name : ''
              }
              if (item.type == "TAGS") {
                let newThemeName = [];
                newThemeName = this.state.tagListName.filter(el => el.id == item.filter_request);
                mainFilterName = Array.isArray(newThemeName) && newThemeName.length > 0 ? newThemeName[0].name : ''
              }
              return (
                <>
                  {
                    Array.isArray(item.filter_request) ?
                      item.filter_request && item.filter_request.map((data, index) => {
                        return (
                          <ChipText text={data} key={index} height={25} onClose={() => { this.handleRemove(data, item) }} >
                          </ChipText>
                        )
                      })
                      : item.generic_data_type == "INTEGER" ?
                        <ChipText text={item.filter_request ? (item.filter_request.start_range ? item.filter_request.start_range : "null") + "-" + (item.filter_request.end_range ? item.filter_request.end_range : "max") : ""} height={25} onClose={() => { this.handleRemove(item) }}>
                        </ChipText>
                        :
                        <ChipText text={mainFilterName ? mainFilterName : "-"} height={25} onClose={() => { this.handleRemove(item) }}>
                        </ChipText>
                  }
                </>
              );
            })
            }
          </div>
          <Typography className="clearAllFilter c-pointer" onClick={() => { this.handleRemoveSearchFilter() }}>Clear all</Typography>
        </Grid>
      </Grid>
    )
  }

  handleRouteChange = (value, id, questionId) => {

    return (
      <div>
        {value === 1 ?
          this.props.history.push({
            pathname: "/knit/projectsDetails/" + this.props.location.state.projectid + "/Data?view=list"
          })
          : value === 1 ?
            this.props.history.push({
              pathname: "/knit/projectsDetails/" + this.props.location.state.projectid + "/Data?view=grid"
            })
            : value === 2 ?
              this.props.history.push({
                pathname: "/knit/projectsDetails/" + this.state.projectId + "/Video?view=grid"
              })
              : value === 2 ?
                this.props.history.push({
                  pathname: "/knit/projectsDetails/" + this.state.projectId + "/Video?view=list"
                })
                : value === 2 ?
                  this.props.history.push({
                    pathname: "/knit/projectsDetails/" + this.state.projectId + "/Video/:id"
                  })
                  : value === 3 ?
                    this.props.history.push({
                      pathname: "/knit/projectsDetails/" + this.state.projectId + "/ShowReels"
                    })
                    : value === 4 ?
                      this.props.history.push({
                        pathname: "/knit/projectsDetails/" + this.state.projectId + "/Themes"
                      })
                      : <></>
        }

      </div>
    )

  }
  handleChangeVideoDetail = (value, id) => {
    return (
      <div>
        {value === 1 ?
          this.props.history.push({
            pathname: "/knit/projectsDetails/" + this.state.projectId + "/Data?view=list"
          })
          : value === 1 ?
            this.props.history.push({
              pathname: "/knit/projectsDetails/" + this.props.location.state.projectid + "/Data?view=grid"
            })
            : value === 2 ?
              id ?
                this.props.history.push({
                  pathname: "/knit/projectsDetails/" + this.state.projectId + "/Video?view=grid/" + id
                })
                :
                this.props.history.push({
                  pathname: "/knit/projectsDetails/" + this.state.projectId + "/Video?view=grid"
                })
              : value === 2 ?
                this.props.history.push({
                  pathname: "/knit/projectsDetails/" + this.state.projectId + "/Video?view=list"
                })
                : value === 3 ?
                  this.props.history.push({
                    pathname: "/knit/projectsDetails/" + this.state.projectId + "/ShowReels"
                  })
                  : value === 4 ?
                    this.props.history.push({
                      pathname: "/knit/projectsDetails/" + this.state.projectId + "/Themes"
                    })
                    : <></>
        }

      </div>
    )

  }

  render() {
    let description = "";
    if (this.state.selectedList.length > 1) {
      description = "Are you sure you want to delete the " + this.state.selectedList.length + " response you selected" +
        "? Once you delete a response, any tags or analysis associated with the response will be deleted too. This action cannot be undone."
    } else {
      description = "Are you sure you want to delete the response you selected" +
        "? Once you delete a response, any tags or analysis associated with the response will be deleted too. This action cannot be undone."
    }
    let { decrement, increment } = this.props
    return (
      <PageWrapper selected={1} selectedId={1} isSidebar={true} projectId={this.state.projectId}>
        <div style={{ width: "100%" }}>
          <div style={{ width: "calc(100% - 180px)", overflow: "overlay", float: "right", background: "#FBFBFB" }}>
            <div className={"main-class"}>
              {this.renderTitle()}
              {this.state.totalAppliedFilter != 0 &&
                this.renderFilterApplied()
              }
              {this.renderResponseTable()}
              <div className={this.state.loading ? 'fullPageLoader blur-background' : ''}>
                {this.state.loading && <AuthLoader />}
              </div>
              {this.state.deleteModalOpen &&
                <DeleteModel open={this.state.deleteModalOpen}
                  onHandleClose={() => { this.deleteModalClose() }}
                  onHandleRemove={() => { this.handleDeleteData() }} description={description}></DeleteModel>
              }
            </div>
          </div>
        </div>
      </PageWrapper>

    );
  }
}

const mapStateToProps = (state) => {
  return {
    questionCardListBox: state.data.questionCardListBox,
    questionData: store.getState().data.questionData,
    mainList: state.data.tableRowData,
    tableData: state.data.tabularData,
    count: store.getState().data.value,
    totalCount: store.getState().data.totalCount,
    setAllUserResponse: state.data.setAllUserResponse,
    videoQuestionIds:state.data.videoQuestionIds,
    videoQuestionList:state.data.videoQuestionList
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchData: (event) => dispatch(fetchData(event)),
  loadJsonData: (event) => dispatch(loadData(event)),
  setProjectId: (event) => dispatch(setProjectId(event)),
  setAllThemeDetails: (event) => dispatch(setJSONThemeDetails(event)),
  fetDataTableData: (event) => dispatch(fetDataTableData(event)),
  getSortedTableData: (numericQuestionId, pageNo, pageSize, sortOrder) => dispatch(getSortedTableData(numericQuestionId, pageNo, pageSize, sortOrder)),
  setViewData: (event) => dispatch(setViewData(event)),
  filterData: (event) => dispatch(filterData(event)),
  fetchDataTableRowsData: (event) => dispatch(fetchDataTableRowsData(event)),
  resetGridData: (event) => dispatch(resetGridData(event)),
  getDataFromId: (event) => dispatch(getDataFromId(event)),
  updateTableData: (event) => dispatch(updateTableData(event)),
  handleCheckboxChecked: (event) => dispatch(handleCheckboxChecked(event)),
  handleAllSelect: (event) => dispatch(handleAllSelect(event)),
  filterBySearch: (event) => dispatch(filterBySearch(event)),
  fetchDataTableWithFilter: (event) => dispatch(fetchDataTableWithFilter(event)),
  deleteResponse: (event) => dispatch(deleteResponse(event)),
  setListViewData: (event) => dispatch(setListViewData(event)),
  fetchDataTablewithFilterAndSorting: (event) => dispatch(fetchDataTablewithFilterAndSorting(event))
});
export default connect(mapStateToProps, mapDispatchToProps)(Data);