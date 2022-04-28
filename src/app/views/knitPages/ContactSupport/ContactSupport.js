import React, { Component } from "react";
import withWidth, { isWidthUp, isWidthDown } from "@material-ui/core/withWidth";
import PageWrapper from "../../PageWrapper/PageWrapper";
import SearchComponent from "../../../components/searchFilter/SearchFilter";
import ResponseTable from "../../../components/responsesTable/ResponseTable";
import { Grid } from "@material-ui/core";
import "../../../css/common.scss";
import "./ContactSupport.scss";
import Demo from "../../../../assets/images/responses/demo.jpg";

const TableData = [
  {
    icon: Demo,
    name: "The participants response comes here in a multiline paragraph as they talked participants response comes here in a multiline paragraph as they talked",
    isChecked: true,
    isFavourite: true,
    videoTitle: "Video title comes here...",
    videoSize: "12 MB",
    videoDuration: "3 m 57 s",
  },
  {
    icon: Demo,
    name: "The participants response comes here in a multiline paragraph as they talked participants response comes here in a multiline paragraph as they talked",
    isChecked: true,
    isFavourite: true,
    videoTitle: "Video title comes here...",
    videoSize: "12 MB",
    videoDuration: "3 m 57 s",
  },
  {
    icon: Demo,
    name: "The participants response comes here in a multiline paragraph as they talked participants response comes here in a multiline paragraph as they talked",
    isChecked: false,
    isFavourite: false,
    videoTitle: "Video title comes here...",
    videoSize: "12 MB",
    videoDuration: "3 m 57 s",
  },
  {
    icon: Demo,
    name: "The participants response comes here in a multiline paragraph as they talked participants response comes here in a multiline paragraph as they talked",
    isChecked: true,
    isFavourite: true,
    videoTitle: "Video title comes here...",
    videoSize: "12 MB",
    videoDuration: "3 m 57 s",
  },
  {
    icon: Demo,
    name: "The participants response comes here in a multiline paragraph as they talked participants response comes here in a multiline paragraph as they talked",
    isChecked: true,
    isFavourite: false,
    videoTitle: "Video title comes here...",
    videoSize: "12 MB",
    videoDuration: "3 m 57 s",
  },
  {
    icon: Demo,
    name: "The participants response comes here in a multiline paragraph as they talked participants response comes here in a multiline paragraph as they talked",
    isChecked: false,
    isFavourite: true,
    videoTitle: "Video title comes here...",
    videoSize: "12 MB",
    videoDuration: "3 m 57 s",
  },
  {
    icon: Demo,
    name: "The participants response comes here in a multiline paragraph as they talked participants response comes here in a multiline paragraph as they talked",
    isChecked: true,
    isFavourite: true,
    videoTitle: "Video title comes here...",
    videoSize: "12 MB",
    videoDuration: "3 m 57 s",
  },
  {
    icon: Demo,
    name: "The participants response comes here in a multiline paragraph as they talked participants response comes here in a multiline paragraph as they talked",
    isChecked: true,
    isFavourite: true,
    videoTitle: "Video title comes here...",
    videoSize: "12 MB",
    videoDuration: "3 m 57 s",
  },
  {
    icon: Demo,
    name: "The participants response comes here in a multiline paragraph as they talked participants response comes here in a multiline paragraph as they talked",
    isChecked: false,
    isFavourite: false,
    videoTitle: "Video title comes here...",
    videoSize: "12 MB",
    videoDuration: "3 m 57 s",
  },
  {
    icon: Demo,
    name: "The participants response comes here in a multiline paragraph as they talked participants response comes here in a multiline paragraph as they talked",
    isChecked: true,
    isFavourite: true,
    videoTitle: "Video title comes here...",
    videoSize: "12 MB",
    videoDuration: "3 m 57 s",
  },
  {
    icon: Demo,
    name: "The participants response comes here in a multiline paragraph as they talked participants response comes here in a multiline paragraph as they talked",
    isChecked: true,
    isFavourite: false,
    videoTitle: "Video title comes here...",
    videoSize: "12 MB",
    videoDuration: "3 m 57 s",
  },
  {
    icon: Demo,
    name: "The participants response comes here in a multiline paragraph as they talked participants response comes here in a multiline paragraph as they talked",
    isChecked: false,
    isFavourite: true,
    videoTitle: "Video title comes here...",
    videoSize: "12 MB",
    videoDuration: "3 m 57 s",
  },
];

const columns = [
  {
    questionName:
      "Q1. Do you study at the University of Virginia a at the University of Virginia a at the University of Virginia a?",
  },
  { questionName: "Q2. What is your favorite meal for breakfast?" },
  { questionName: "Q3. What are the products in your refrigerator?" },
  { questionName: "Q4. How does your dorm room look like generally?" },
  { questionName: "Q5 Do you study at the University of Virginia a...?" },
];

class ContactSupport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData:TableData,
      allChecked:false,
      open:false,
      anchorEl:null,
      selectedSearch:null
    };
  }

  handleClick = (event) => {
    this.setState({
      anchorEl:event.currentTarget,
      open:!this.state.open
    })
  };


  handleFavourite = (data) => {
    data.isFavourite = !data.isFavourite;
    this.setState({ tableData: this.state.tableData });
  };

  handleChecked = (data) => {
    data.isChecked = !data.isChecked;
    this.setState({ tableData: this.state.tableData });
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



  render() {
    return (
      <PageWrapper selected={3}>
        <div className={"main-class"}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={12} sm={12} lg={12} className={"layout"}>
              <SearchComponent></SearchComponent>
            </Grid>
            <Grid item xs={12} md={12} sm={12} lg={12}>
              <ResponseTable
                TableData={TableData}
                question={columns}
                allChecked={this.state.allChecked}
                handleAllChecked={this.handleAllChecked}
                checked={(data) => {
                  this.handleChecked(data);
                }}
                favourite={(data) => this.handleFavourite(data)}
              ></ResponseTable>
            </Grid>
          </Grid>
        </div>
      </PageWrapper>
    );
  }
}

export default withWidth()(ContactSupport);
