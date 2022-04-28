import React, { Component } from "react";

import { Grid, Typography, withStyles } from "@material-ui/core";
//import AddIcon from "@material-ui/core/SvgIcon/SvgIcon";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import Popover from "@material-ui/core/Popover";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { List, ListItem } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { Divider } from "@material-ui/core";
import profileIcon from "../../../assets/images/navbar/profile.png";
import Avatar from "@material-ui/core/Avatar";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import TextField from "@material-ui/core/TextField";
import "./AnnotationMenu.scss";
import "./AnnotationMenuCommon.scss";
import SubdirectoryArrowLeftIcon from "@material-ui/icons/SubdirectoryArrowLeft";

class AnnotationMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddTheme: false,
      isCommentCard: false,
      isThemeButton: true,
      tagList: [],
      textfieldValue: "",
      textfieldTagValue: "",
      themeFullName: "",
    };
  }

  componentDidMount() {}

  handleOnChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  renderSubTheme = (data, color) => {
    let level = "";
    let themeLevel = "";
    let isChildren = false;
    let isTagChildren = false;
    return (
      <ul>
        <Card className={"theme-card"}>
          <Typography className={"sub-theme"}>Sub-Themes</Typography>
          {data.children &&
            data.children.length > 0 &&
            data.children.map((item, index) => {
              themeLevel = item.level;
              isChildren = data.children;

              return item.isTextBox ? (
                <li className={"main-div-li"}>
                  <RemoveIcon
                    color="#FF7F4F"
                    className={"remove-icon"}
                    onClick={() => {
                      this.props.removeTheme(item.key, data, item.level, true);
                    }}
                  />
                  <TextField
                    id="outlined-basic"
                    label=""
                    variant="outlined"
                    placeholder={"+ Add Sub Theme"}
                    name={item.key}
                    autoFocus
                    onKeyDown={(event) => {
                      if (event.keyCode == 13 && event.target.value != "") {
                        this.props.handleRandomThemeSubmit(
                          event,
                          data.children,
                          item.key,
                          true,
                          item.level,
                          event.target.value,
                          data.id
                        );
                      }
                    }}
                    className={"theme-inputBox"}
                    autoFocus
                  />
                  <SubdirectoryArrowLeftIcon
                    className={"sub-dir-icon"}
                    onClick={(event) => {
                      if (event.keyCode == 13 && event.target.value != "") {
                        this.props.handleRandomThemeSubmit(
                          event,
                          data.children,
                          item.key,
                          true,
                          item.level,
                          event.target.value
                        );
                        event.target.value="";
                      }
                    }}
                  ></SubdirectoryArrowLeftIcon>
                </li>
              ) : (
                <li style={{ padding: 0 }}>
                  <div className="hoverWhiteBg">
                    <AddIcon
                      color="#FF7F4F"
                      className={"add-icon"}
                      onClick={() => {
                        this.props.addTheme(
                          index,
                          data,
                          item.level,
                          true,
                          item.parentId
                        );
                      }}
                    ></AddIcon>
                    <Button
                      style={{
                        background: item.color,
                      }}
                      className={
                        item.level >= 3
                          ? "root-sub-theme-lable-high-level"
                          : "root-sub-theme-lable"
                      }
                      // onClick={() => {
                      //   this.props.handleSkip(
                      //     item.themeName,
                      //     item.parentId,
                      //     item.level
                      //   );
                      // }}
                    >
                      {item.themeName}
                    </Button>
                    {
                      <ChevronRightIcon
                        className={"right-arrow"}
                      ></ChevronRightIcon>
                    }
                  </div>
                  {this.renderSubTheme(item, color)}
                </li>
              );
            })}
          <li style={{ marginBottom: "20px", padding: "5px" }}>
            <input
              type="text"
              id="outlined-basic"
              label=""
              variant="outlined"
              placeholder={"+ Add Sub-Theme"}
              className={"theme-inputBox addTheme"}
              style={isChildren ? { marginLeft: 40 } : { marginLeft: 20 }}
              onKeyDown={(event) => {
                if (event.keyCode == 13 && event.target.value != "") {
                  this.props.handleLastThemeSubmit(
                    true,
                    data,
                    themeLevel,
                    event.target.value
                  );
                  event.target.value="";
                }
              }}
            />
            <SubdirectoryArrowLeftIcon
              className={"subDir-icon"}
            ></SubdirectoryArrowLeftIcon>
          </li>
          <Divider></Divider>
          <Typography
            style={{
              padding: "20px 20px 15px",
              fontSize: "15px",
              fontWeight: "500",
            }}
          >
            Tags
          </Typography>
          {data.tags &&
            data.tags.map((item, index) => {
              // console.log("Item id==>",item)
              level = item.level;
              isTagChildren = data.tags;
              return item.isTextBox ? (
                <li className={"main-div-li"}>
                  <RemoveIcon
                    color="#FF7F4F"
                    className={"remove-icon"}
                    onClick={() => {
                      this.props.removeTag(item.key, data, item.level, true);
                    }}
                  />
                  <TextField
                    id="outlined-basic"
                    label=""
                    variant="outlined"
                    placeholder={"+ Add Tag"}
                    name={item.key}
                    onKeyDown={(event) => {
                      if (event.keyCode == 13 && event.target.value != "") {
                        this.props.handleTagSubmit(
                          event,
                          data.children,
                          item.key,
                          true,
                          item.level,
                          event.target.value,
                          data.id

                        );
                        event.target.value="";
                      }
                    }}
                    className={"theme-inputBox"}
                    autoFocus
                  />
                  <SubdirectoryArrowLeftIcon
                    className={"sub-dir-icon"}
                    onClick={(event) => {
                      if(event.keyCode == 13 && event.target.value != ""){
                        this.props.handleTagSubmit(
                          event,
                          data.children,
                          item.key,
                          true,
                          item.level,
                          event.target.value,
                          data.id
                        );
                        event.target.value="";
                      }
                    }}
                  ></SubdirectoryArrowLeftIcon>
                </li>
              ) : (
                item.isSkeleton ? 
                    <div style={{marginLeft:"50px",paddingTop:5,paddingBottom:5}}>
                      <div style={{width: "20%"}}></div>
                      <span class="MuiSkeleton-root theme-inputBox addTheme MuiSkeleton-pulse" style={{width:"50%",height: "30px",borderRadius: "20px"}}></span>
                    </div>
                :
                <li style={{ padding: 5 }}>
                  <AddIcon
                    color="#FF7F4F"
                    style={{
                      margin: "10px 10px 10px 20px",
                      width: 15,
                      height: 15,
                      opacity: "0.3",
                    }}
                    onClick={() => {
                      this.props.addDynamicallyTag(data, item.level, index, item.parentId);
                    }}
                  ></AddIcon>
                  <Button
                    style={{
                      background: item.color,
                    }}
                    className={
                      item.level >= 3 ? "tag-card-high-level" : "tag-card"
                    }
                    onClick={() => {
                      this.props.handleSkip(
                        item.themeName,
                        item.parentId,
                        item.level,
                        item.id
                      );
                    }}
                  >
                    {item.themeName}
                  </Button>
                  {/* {this.renderSubTheme(item,color)} */}
                </li>
              );
            })}
          <li style={{ padding: "5px 0px 30px 0px" }}>
            <input
              type="text"
              id="outlined-basic"
              label=""
              variant="outlined"
              placeholder={"+ Add Tag"}
              className={"theme-inputBox addTheme"}
              style={
                isChildren || isTagChildren
                  ? { marginLeft: 48 }
                  : { marginLeft: 25 }
              }
              onKeyDown={(event) => {
                if (event.keyCode == 13 && event.target.value != "") {
                  this.props.createLastTag(data, level, event.target.value);
                  event.target.value="";
                }
              }}
            />
            <SubdirectoryArrowLeftIcon
              className={"subDir-icon"}
            ></SubdirectoryArrowLeftIcon>
          </li>
        </Card>
      </ul>
    );
  };

  render() {
    return (
      <>
        <div className={"main-lable"}>
          <Typography className={"theme-lable"}>Themes</Typography>
          <Typography
            className={"skip-lable"}
            onClick={() => {
              this.props.handleSkip();
            }}
          >
            Skip
          </Typography>
        </div>
        <ul class="main-navigation">
          <ul
            style={{
              padding: "0px 0px 10px",
              left: 30,
              position: "inherit",
              minWidth: 240,
            }}
          >
            {this.props.themeList.map((item, index) => {
              return item.isTextBox ? (
                <li style={{ position: "inherit !important" }}>
                  <div className={"main-div-li"}>
                    <RemoveIcon
                      color="#FF7F4F"
                      className={"remove-icon"}
                      onClick={() => {
                        this.props.removeTheme(item.key);
                      }}
                    />
                    <TextField
                      id="outlined-basic"
                      label=""
                      variant="outlined"
                      autoFocus
                      placeholder={"+ Add Theme"}
                      name={item.key}
                      onKeyDown={(event) => {
                        if (event.keyCode == 13 && event.target.value != "") {
                          this.props.handleRandomThemeSubmit(
                            event,
                            item,
                            item.key,
                            "",
                            "",
                            event.target.value,
                          );
                          event.target.value=""
                        }
                      }}
                      className={"theme-inputBox"}
                    />
                    <SubdirectoryArrowLeftIcon
                      className={"sub-dir-icon"}
                      onClick={(event) => {
                        this.props.handleRandomThemeSubmit(
                          event,
                          item,
                          item.key
                        );
                      }}
                    ></SubdirectoryArrowLeftIcon>
                  </div>
                </li>
              ) : (
                <li style={{ padding: 0 }}>
                  <div className="hoverWhiteBg">
                    <AddIcon
                      color="#FF7F4F"
                      className={"add-icon"}
                      onClick={() => {
                        this.props.addTheme(index);
                      }}
                    ></AddIcon>
                    <Button
                      style={{
                        background: item.color,
                      }}
                      className={"root-theme-lable"}
                      // onClick={()=>{this.props.selectTheme(item.key)}}
                      // onClick={() => {
                      //   this.props.handleSkip(
                      //     item.themeName,
                      //     item.parentId,
                      //     item.level
                      //   );
                      // }}
                    >
                      {item.themeName}
                    </Button>
                    {
                      <ChevronRightIcon
                        className={"right-arrow"}
                      ></ChevronRightIcon>
                    }
                  </div>

                  {this.renderSubTheme(item, item.color)}
                </li>
              );
            })}
            <li className={"main-div-li"} style={{ paddingBottom: "5px" }}>
              <input
                type="text"
                id="outlined-basic"
                label=""
                variant="outlined"
                placeholder={"+ Add Theme"}
                className={"theme-inputBox addTheme"}
                style={{ marginLeft: 45 }}
                onKeyDown={(event) => {
                  if (event.keyCode == 13 && event.target.value != "") {
                    this.props.handleLastThemeSubmit(
                      false,
                      "",
                      "",
                      event.target.value
                    );
                    event.target.value=""
                  }
                }}
              />
              <SubdirectoryArrowLeftIcon
                className={"subDir-icon"}
              ></SubdirectoryArrowLeftIcon>
            </li>
          </ul>
        </ul>
      </>
    );
  }
}

export default withStyles()(AnnotationMenu);
