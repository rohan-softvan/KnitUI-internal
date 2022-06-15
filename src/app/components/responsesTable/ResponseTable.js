import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Color from "../../config/Color";
import { Switch, withStyles, Typography, Tooltip } from "@material-ui/core";
import "./ResponsesTable.scss";
import FavouriteChecked from "../../../assets/images/responses/favourite-checked.svg";
import FavouriteUnchecked from "../../../assets/images/responses/favourite-unchecked.svg";
import UncheckedBox from "../../../assets/images/responses/uncheckBox.svg";
import CheckedBox from "../../../assets/images/responses/checkedBox.svg";
import profileIcon from "../../../assets/images/navbar/profile.png";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { Skeleton } from "@material-ui/lab";
import SadCharacter from "../../../assets/images/sad-character.png";
const useStyles = (theme) => ({
  selected: {
    backgroundColor: "#F6F3E6 !important",
  },
});

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hour ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " min " : " min ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " sec " : " sec ") : "";
  return hDisplay + mDisplay + sDisplay; 
}


class ResponseTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowsPerPage: 10,
      // page: 0,
    };
  }

  skeletontable = () =>{
    return(
      <>
        {this.renderDataSkeleton()}
        {this.renderDataSkeleton()}
        {this.renderDataSkeleton()}
        {this.renderDataSkeleton()}
        {this.renderDataSkeleton()}
        {this.renderDataSkeleton()}
        {this.renderDataSkeleton()}
        {this.renderDataSkeleton()}
        {this.renderDataSkeleton()}
        {this.renderDataSkeleton()}
      </>
    )
  }
 
  renderDataSkeleton=()=>{
    const { classes } = this.props;
    return(
      <TableRow  classes={{ selected: classes.selected }}>
          <TableCell className={"tableCell"}>
                <Skeleton animation={"wave"} variant={"react"} height={50}></Skeleton>
              </TableCell>
              <TableCell className={"tableCell"}>
                <Skeleton animation={"wave"} variant={"react"} height={50}></Skeleton>
              </TableCell>
              <TableCell className={"tableCell"}>
                <Skeleton animation={"wave"} variant={"react"} height={50}></Skeleton>
              </TableCell>
              <TableCell className={"tableCell"}>
                <Skeleton animation={"wave"} variant={"react"} height={50}></Skeleton>
              </TableCell>
              <TableCell className={"tableCell"}>
                <Skeleton animation={"wave"} variant={"react"} height={50}></Skeleton>
              </TableCell>
              <TableCell className={"tableCell"}>
                <Skeleton animation={"wave"} variant={"react"} height={50}></Skeleton>
              </TableCell>
              <TableCell className={"tableCell"}>
                <Skeleton animation={"wave"} variant={"react"} height={50}></Skeleton>
              </TableCell>
        </TableRow>
    )
  }
  renderTable = () => {
    const { classes } = this.props;
    return (
      <>
        <TableContainer className={"tableContainer"}>
          <Table stickyHeader className={"table"}>
            <TableHead>
              <TableRow>
                {this.props.isQuestionLoad ? (
                  <>
                    <TableCell className={"tableCell"}>
                      <Skeleton animation={"wave"} variant={"text"}></Skeleton>
                    </TableCell>
                    <TableCell className={"tableCell"}>
                      <Skeleton animation={"wave"} variant={"text"}></Skeleton>
                    </TableCell>
                    <TableCell className={"tableCell"}>
                      <Skeleton animation={"wave"} variant={"text"}></Skeleton>
                    </TableCell>
                    <TableCell className={"tableCell"}>
                      <Skeleton animation={"wave"} variant={"text"}></Skeleton>
                    </TableCell>
                    <TableCell className={"tableCell"}>
                      <Skeleton animation={"wave"} variant={"text"}></Skeleton>
                    </TableCell>
                    <TableCell className={"tableCell"}>
                      <Skeleton animation={"wave"} variant={"text"}></Skeleton>
                    </TableCell>
                    <TableCell className={"tableCell"}>
                      <Skeleton animation={"wave"} variant={"text"}></Skeleton>
                    </TableCell>
                  </>
                ):
                <>
                <TableCell className={"cell-width"}>
                  {this.props.allChecked ? (
                    <img
                      src={CheckedBox}
                      height={"17px"}
                      width={"18px"}
                      onClick={() => {
                        this.props.handleAllChecked();
                      }}
                      className={"cursor"}
                    />
                  ) : (
                    <img
                      src={UncheckedBox}
                      height={"17px"}
                      width={"18px"}
                      onClick={() => {
                        this.props.handleAllChecked();
                      }}
                      className={"cursor"}
                    />
                  )}
                </TableCell>
                <TableCell className={"cell-width"}></TableCell>
                {this.props.question &&
                  this.props.question.map((item, index) => {
                    return (
                      <TableCell
                        key={index}
                        className={"tableCell"}
                        onClick={() => {
                          this.props.handleTableSort(item.numericQuestionId);
                        }}
                      >
                        <div className={"d-flex"}>
                          <Tooltip
                            title={item.questionNumber+" "+ item.questionName}
                            placement="bottom-start"
                          >
                            <Typography className={"head"}>
                              {item.questionNumber} {item.questionName}
                            </Typography>
                          </Tooltip>
                          {item.sortingOrder === "asc" ? (
                            <ArrowDropUpIcon
                              onClick={this.changeOrder}
                            ></ArrowDropUpIcon>
                          ) : (
                            <ArrowDropDownIcon
                              onClick={this.changeOrder}
                            ></ArrowDropDownIcon>
                          )}
                        </div>
                      </TableCell>
                    );
                  })}
                </>
                }
                
              </TableRow>
            </TableHead>
            <TableBody>
            {this.props.TableData && this.props.TableData.length > 0 ?   
              <>
                {!this.props.isResponseLoad ? 
                <>
                  {this.skeletontable()}
                </>
                :
                this.props.TableData &&
                  this.props.TableData.map((row) => (
                    <TableRow
                      key={row.id}
                      selected={row.isChecked}
                      classes={{ selected: classes.selected }}
                    >
                      <TableCell
                        align="left"
                        size="small"
                      >
                        {row.isChecked ? (
                          <img
                            src={CheckedBox}
                            height={"17px"}
                            width={"18px"}
                            onClick={(e) => {
                              this.props.checked(row);
                            }}
                            className={"cursor"}
                          />
                        ) : (
                          <img
                            src={UncheckedBox}
                            height={"17px"}
                            width={"18px"}
                            onClick={(e) => {
                              this.props.checked(row);
                            }}
                            className={"cursor"}
                          />
                        )}
                      </TableCell>
                      <TableCell className={"cell-width "}>
                        {row.isFavourite ? (
                          <img
                            src={FavouriteChecked}
                            height={"17px"}
                            width={"18px"}
                            className={"favourite-icon cursor"}
                            onClick={(e) => {
                              this.props.favourite(row);
                            }}
                          />
                        ) : (
                          <img
                            src={FavouriteUnchecked}
                            height={"17px"}
                            width={"18px"}
                            className={"favourite-icon cursor"}
                            onClick={(e) => {
                              this.props.favourite(row);
                            }}
                          />
                        )}
                      </TableCell>
                
                      {row.userResponse.map((item, index) => {
                        let type="";
                        if(item.questionType == "FileUpload" && item.questionAnswer.question_file_type){
                          type=item.questionAnswer.question_file_type.split("/");
                        }
                        let questionAnswer;
                        if(Array.isArray(item.questionAnswer)){
                          questionAnswer=item.questionAnswer.join(", ");
                        }else{
                          questionAnswer=item.questionAnswer;
                        }
                        return (
                          <>
                            {item.questionType != "-" ?
                            item.questionType != "FileUpload" &&
                            item.questionType != "Draw" ? (
                              item.questionType == 'TE' ? 
                              <TableCell key={index} className={"cell-width"} onClick={()=>{this.props.handleRedirectOpenText(item.questionId,item.numericQuestionId)}}>
                              <Typography className={"text-cell c-pointer"}>
                                {questionAnswer}
                              </Typography>
                            </TableCell>
                              :
                              <TableCell key={index} className={"cell-width"}>
                                <Typography className={"text-cell"}>
                                  {questionAnswer}
                                </Typography>
                              </TableCell>
                            ) : item.questionType == "FileUpload" ? (
                              type && type[0] == "video" ?
                              <TableCell className={"cell-width"} style={{cursor:"pointer"}} onClick={()=>{this.props.handleRedirect(2,item.questionAnswer.video_response_id.$oid,item.questionId)}}>
                                <div className={"div-flex"}>
                                  <img
                                    src={item.videoThumbnailUrl}
                                    className={"video-thumbnail"}
                                  />
                                  <div>
                                    <Typography
                                      className={
                                        "video-cell-thumbnail video-title-thumbnail"
                                      }
                                    >
                                      {item.questionAnswer.question_file_name}
                                    </Typography>
                                    <Typography
                                      className={"video-cell-thumbnail"}
                                    >
                                    {item.questionAnswer.question_file_size ? formatBytes(item.questionAnswer.question_file_size) : "-"}
                                    </Typography>
                                    <Typography
                                      className={"video-cell-thumbnail"}
                                      >
                                        {secondsToHms(item.originalVideoDuration)} 
                                    </Typography>
                                  </div>
                                </div>
                                {/* <Typography className={"text-cell"}>{row.name4}</Typography> */}
                              </TableCell>
                              : type && type[0] == "image" ?
                            <TableCell className={"cell-width"}> 
                            <img
                                src={item.questionAnswer.question_file_link}
                                className={"tablecell-image"}
                              ></img>
                            </TableCell>
                              :<TableCell className={"cell-width"}> 
                                -
                              </TableCell>
                            ) : (
                              <TableCell className={"cell-width"}> {"-"}</TableCell>
                            )
                          :
                          <TableCell key={index} className={"cell-width"}>
                                {"-"}
                              </TableCell>
                          }
                          </>
                        );
                      })}
                    </TableRow>
                  ))
                }             
              </>              
              :
              <>
              { Array.isArray(this.props.filteredData) && this.props.filteredData.length > 0 ?
               <TableRow>
               <TableCell colSpan={7} style={{height:560}}>
                 <div className={"nodata-show-table"} >
                   <div className={"nodata-innerdiv"}>
                     <img src={SadCharacter} />
                     <Typography>Sorry, that filter combination has no results. Please try different criteria.</Typography>
                   </div>
                 </div>
               </TableCell>
             </TableRow>
              : !this.props.isResponseLoad &&
              // <></>
              this.skeletontable()
              }
              </>
            }
            </TableBody>
          </Table>
        </TableContainer>          
        {this.props.TableData && 
        <TablePagination
          component="div"
          count={this.props.totalRecord}
          rowsPerPage={this.state.rowsPerPage}
          page={this.props.page}
          onChangePage={this.props.handleChangePage}
          labelRowsPerPage=""
          rowsPerPageOptions={[]}
        />
        }
      </>
    );
  };
  render() {
    return <>{this.renderTable()}</>;
  }
}

export default withStyles(useStyles)(ResponseTable);
