import React, { Component } from "react";
import { Grid, Typography,Tooltip } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import profileIcon from "../../../assets/images/navbar/profile.png";
import "./VideoProductCard.scss";
import "../../css/common.scss";
import MyResponsiveSunburst from "../subBurst/MyResponsiveSunburst";
import { Popover } from "antd";
import DownloadIcon from "../../../assets/images/videos/download.svg";
import { CSVLink } from "react-csv";
const Sorting = ({csvExport,visibleCSV,handlePopperOpen}) =>(
    <>

      <Popover placement="bottomRight" content={
        <div>
          <p className={"mb-0"} style={{cursor:'pointer',}} onClick={()=>{csvExport()}}>Download CSV</p>
          {/*<p>Download Chart</p>*/}
        </div>
      } trigger="click"
      onVisibleChange={()=>{handlePopperOpen()}}
      visible={visibleCSV}>
        <img src={DownloadIcon} onClick={()=>{handlePopperOpen()}} className={"cursor"} />
      </Popover>

    </>
);
class VideoProductCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: false,
      allData: [],
      csvData: [],
      visibleCSV:false
    };
    this.downloadVideoLink = React.createRef();
  }

  componentDidMount = () => {

    this.setState({ allData: this.props.data,visibleCSV:false }, () => {
      this.genrateCSV();
    })
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if(this.props.data !== prevProps.data) {
    this.setState({ allData: this.props.data,visibleCSV:false }, () => {
      this.genrateCSV();
    })
  }
  }

  genrateCSV = () => {
    let csvData = [['Question', 'Video Link', 'Transcript'],];
    for (let i in this.state.allData.knitVideoResponse) {
      let questionTitle = this.state.allData.questionNumber + ". " + this.state.allData.questionText;
      let videoLink =
          JSON.stringify(this.state.allData.questionData[i])  != '{}' && this.state.allData.questionData[i]
              ? this.state.allData.questionData[i].question_file_link ? this.state.allData.questionData[i].question_file_link : "-":
          "-";
      let transcript = Array.isArray(this.state.allData.knitVideoResponse[i]) && this.state.allData.knitVideoResponse[i].length > 0
        ? this.state.allData.knitVideoResponse[i][0].video_transcription :
        "-";
      let arr = []
      arr.push(questionTitle, videoLink, transcript)
      csvData.push(arr)
    }
    this.setState({ csvData: csvData })

  }

  downloadCSV = () => {
    this.setState({visibleCSV:false})
    setTimeout(() => {
      this.downloadVideoLink.link.click();
    }, 1000);

  }

  addZero = (data) => {
    if (data < 10) {
      data = "0" + data
    }
    return data;
  }

  formattedCSVFileDate = () => {
    let dateObj = new Date();
    let month = this.addZero(dateObj.getMonth() + 1);
    let year = dateObj.getFullYear();
    let date = this.addZero(dateObj.getDate());
    let hours = this.addZero(dateObj.getHours());
    let minutes = this.addZero(dateObj.getMinutes());
    return month + date + year;
  }

  handlePoperOpen=()=>{
    this.setState({visibleCSV:!this.state.visibleCSV})
  }

  render() {
    let totalCount = 0;
    let questionTitle = this.props.data.questionNumber + " " + this.props.data.questionName;
    let fileName = questionTitle.substring(0, 30) + "_" + this.formattedCSVFileDate();
    return (

      <Grid container spacing={2} className={"mb-20"}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Card className={"padd-20"}>
           <Grid container>
              <Grid container>
                   <Grid item xs={12} md={11} lg={11} sm={12} className={"videotitle "}>
                   <Tooltip title={questionTitle} placement="bottom-start" style={{cursor:'pointer'}}>
                      <Typography className={"videotitle grid-question-title mb-15"}>
                        {this.props.data.questionNumber
                            ? this.props.data.questionNumber : ""}{" "}
                              {this.props.data.questionText ? this.props.data.questionText : ""}
                      </Typography>
                    </Tooltip>
                    </Grid>
                    <Grid item xs={12} md={1} lg={1} sm={12} style={{textAlign: "right",paddingRight:"25px"}}>
                        <Sorting
                          visibleCSV={this.state.visibleCSV}
                          handlePopperOpen={()=>{this.handlePoperOpen()}}
                          csvExport={() => { this.downloadCSV() }} />
                    </Grid>
                    <CSVLink data={this.state.csvData}
                          filename={fileName + ".csv"}
                          target="_blank"
                          ref={(r) => (this.downloadChartLink = r)}/>
                </Grid>
              <Grid item xs={12} sm={12} md={12} lg={5}>
                <div className={"imagelist"}>
                  {this.props.data.knitVideoResponse &&
                    this.props.data.knitVideoResponse
                      // .slice(0, 27)
                      .map((item, index) => {
                        if (item.length > 0) { totalCount = totalCount + 1 }
                        return (
                          <>
                            {totalCount <= 27 && item.length > 0 && (
                              <div className={"img-thumb"} style={{ cursor: "pointer" }} onClick={() => { this.props.handleChange(2, item[0]._id.$oid) }}>
                                <img
                                  src={
                                    item.length > 0
                                      ? item[0].video_thumbnail_url
                                      : ""
                                  }
                                />

                              </div>
                            )}
                          </>
                        );
                      })}
                  {totalCount > 27 && (
                    <div className={"addMoreThumb"} style={{ cursor: 'pointer' }} onClick={() => { this.props.handleChange(2) }}>
                      <div className={"moreData"} >+{totalCount - 27} more</div>
                    </div>
                  )}
                </div>
                <CSVLink data={this.state.csvData}
                  filename={fileName + ".csv"}
                  target="_blank"
                  ref={(r) => (this.downloadVideoLink = r)} />
              </Grid>
              {this.props.data.chartData && (
                <Grid item xs={12} sm={6} md={6} lg={7} className={"graph"}>
                  <MyResponsiveSunburst
                    data={this.props.data.chartData}
                    legends={this.props.data.legendData}
                  />
                </Grid>
              )}

            </Grid>
          </Card>
        </Grid>
      </Grid>
    );
  }
}
export default VideoProductCard;