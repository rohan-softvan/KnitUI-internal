import React, { Component } from "react";
import withWidth, { isWidthUp, isWidthDown } from "@material-ui/core/withWidth";
import PageWrapper from "../../PageWrapper/PageWrapper";
import { Grid,Typography } from "@material-ui/core";
import Cookies from "universal-cookie";
import "./Members.scss";
import "../../../css/common.scss";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import profileIcon from "../../../../assets/images/navbar/profile.png";
import SwitchButton from "../../../components/SwitchButton/SwitchButton";
import Color from "../../../config/Color";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Popper from '@material-ui/core/Popper';
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import MembersModal from "../../../components/memberModal/AddMembersModal";
const styles={
  moreVertIcon: {
    "&:active": {
      backgroundColor: Color.lightGreyShadow
    },
    borderRadius: 6,
    cursor:'pointer'
  },
}
let id = 0;



let MembersData = [
  // config constant for this sandbox.
  {
    key:1,
    icon: profileIcon,
    name: "Raahish Kalaria",
    email:"raahish@goknit.com",
    isChecked: true,
    isOpen:false
  },
  {
    key:2,
    icon: profileIcon,
    name: "Aneesh Dhawan",
    email:"aneesh@goknit.com",
    isChecked: true,
    isOpen:false
  },
  {
    key:3,
    icon: profileIcon,
    name: "Aditya Bharadwaj",
    email:"bwaj.adi.ux@gmail.com",
    isChecked: false,
    isOpen:false
  }
];

const cookie = new Cookies();


class Members extends Component {
  constructor(props) {
    super(props);
    this.state={
      anchorEl:null,
      membersData:MembersData
    }
  }

  handleChange=(data)=> {
    data.isChecked=!data.isChecked;
    this.setState({ membersData :  this.state.membersData });
  }

  handleClick = (event,data) => {
    data.isOpen = !data.isOpen;
    // MembersData=data;
    // this.setState({ tableData: this.state.tableData });
    
    for(let i in this.state.membersData){
      if(this.state.membersData[i].key != data.key){
        this.state.membersData[i].isOpen=false;
      }
    }
    this.setState({
      anchorEl:event.currentTarget,
      membersData:this.state.membersData
      // open:!open
    })
  };

  renderTitle=()=>{
    return(
        <Grid container spacing={1}>
            <Grid item xs={6} md={7} lg={7} sm={6}>
                <Typography variant={"h6"} component={"h6"} className={"title-class"}>
                    MEMBERS
                </Typography> 
            </Grid>
            <Grid item xs={6} md={5} lg={5} sm={6} className={"buttonDiv"}>
               <MembersModal width={this.props.width}/>
            </Grid>
            <Grid  item xs={12} md={12} lg={12} sm={12}>
                <Typography className={"subTitle"}>
                    Showing 12 of 20 videos
                </Typography> 
            </Grid>
        </Grid>
    )
  }

  renderTable=()=>{
      return(
        // <Paper className={"root"}>
        <Table className={"root table"}>
          <TableHead>
            <TableRow>
            <TableCell className={"table-cell"}></TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.membersData.map(row => (
              <TableRow key={row.id}>
                <TableCell className={"table-image-cell"}>
                <img
                src={profileIcon}
                className={"profileIcon"}></img>
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>
                    <SwitchButton 
                      offText={"Admin"}
                      onText={"Member"}
                      handleChange={()=>{this.handleChange(row)}}
                      checked={row.isChecked}
                      >
                    </SwitchButton>
                </TableCell>
                <TableCell className={"icon-align"}>
                  <MoreVertIcon className={{...styles.moreVertIcon}} onClick={(e)=>{this.handleClick(e,row)}}/>
                  {this.renderPopper(row.isOpen)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      // </Paper>
      )
  }

  renderPopper=(open)=>{
    return(
      <Popper open={open} anchorEl={this.state.anchorEl} placement={"bottom-end"} transition>
      <div className={"popper-main"} >
          <CloseIcon className={"close-icon"} />
          <Typography className={"popper-lable"}>Delete</Typography>
      </div>    
    </Popper>
    )
  }
  render() {
    return (
      <PageWrapper selected={2} >
        <div className={"main-class"}>
            {this.renderTitle()}
            {this.renderTable()}
        </div>
      </PageWrapper>
    );
  }
}

export default withWidth()(Members);
