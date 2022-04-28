import React, { Component } from "react";
import { Grid,Typography,Card} from "@material-ui/core";
import "../../../css/common.scss";
import "./ShowreelsDetails.scss"
import { SketchPicker } from 'react-color';
import SelectComponent from "../../../components/select/Select";
import {Checkbox} from "@material-ui/core";
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { makeStyles } from '@material-ui/core/styles';
import LeftAlign from "../../../../assets/images/showreels/leftAlign.svg";
import CenterAlign from "../../../../assets/images/showreels/centerAlign.svg";
import RightAlign from "../../../../assets/images/showreels/rightAlign.svg";
import LeftAlignActive from "../../../../assets/images/showreels/leftAlignActive.svg";
import CenterAlignActive from "../../../../assets/images/showreels/centerAlignActive.svg";
import RightAlignActive from "../../../../assets/images/showreels/rightAlignActive.svg";

import TopAlign from "../../../../assets/images/showreels/topAlign.svg"
import MiddleAlign from "../../../../assets/images/showreels/middleAlign.svg"
import BottomAlign from "../../../../assets/images/showreels/bottomAlign.svg"
import TopAlignActive from "../../../../assets/images/showreels/topAlignActive.svg"
import MiddleAlignActive from "../../../../assets/images/showreels/middleAlignActive.svg"
import BottomAlignActive from "../../../../assets/images/showreels/bottomAlignActive.svg"
import Fonts from "../../../config/FontConfig";
import FontTypeSelectComponent from "../../../components/select/FontTypeSelect"
const fontname = [
  {
      title: "Arial",
      key: 1,
      value:'Arial'
  },
  {
      title: "Rubik",
      key: 2,
      value:'Rubik'
  },
  {
      title: "Roboto",
      key: 3,
      value:'Roboto'
  },
];
const fontstyle = [
  {
      title: "Bold",
      key: 1,
      value:'Bold'
  },
  {
      title: "Italic",
      key: 2,
      value:'Italic'
  },
  {
      title: "Normal",
      key: 3,
      value: 'Normal'
  },
];
const fontsize = [
  {
      title: "20",
      key: 1,
      value:'20'
  },
  {
      title: "40",
      key: 2,
      value:'40'
  },
  {
      title: "50",
      key: 3,
      value:'50'
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

class ReelSetting extends Component {
      constructor(props){
        super(props)
        this.state={
            // background: '#fff',
            // selectedStyle:'regular',
            // selectedSize:10,
            seletedFontNameType:[],           
        }
      }

      componentDidMount(){        
        // console.log("this.prosp.selectedFontName\===>",this.props.selectedFontName)
        if(this.props.selectedFontName != null && this.props.selectedFontName != undefined && this.props.selectedFontName  != ''){
          this.setState({selectedValue:this.props.selectedFontName})          
        }else{
          this.setState({selectedValue:'Helvetica'},()=>{
            let newList=Fonts.FontFamilyName.filter(item => item.title ==  this.state.selectedValue);
            this.setState({seletedFontNameType:newList[0].type})
          })
        }

        // console.log("check the font style", this.props.selectedFontType)
        if(this.props.selectedFontType !=null && this.props.selectedFontType != undefined && this.props.selectedFontType != ''){
          this.setState({selectedStyle:this.props.selectedFontType})
        }else{
          this.setState({selectedStyle:'regular'})
        }


        if(this.props.selectedFontSize !=null && this.props.selectedFontSize != undefined ){
          this.setState({selectedSize:this.props.selectedFontSize})
        }
        else{
          this.setState({selectedSize:10})
        }

        //console.log("Check the alignment value",this.props.align)
        //console.log("Check the position value",this.props.position)

        if(this.props.background !=null && this.props.background != undefined){
          this.setState({background:this.props.background})
        }
        else{
          this.setState({background:'#fff'})
        }
      }


         
      handleFontName=(e)=>{
        //console.log("e.target.value==>",e)
        this.props.onFontSelect(e.target.value);
        this.setState({selectedValue:e.target.value})
        let newList=Fonts.FontFamilyName.filter(item => item.title ==  e.target.value);
        //console.log("newList=>",newList)
        this.setState({seletedFontNameType:newList[0].type})
      }

    render() {
      
      // console.log("value==>",this.props.align)
        return (
            <>
                <div className={"padd-20"}>
                  <video width="100%" height="250px" controls  style={{borderRadius:"10px",background:"#000"}}>
                            <source 
                            src={this.props.videoHighlights}
                            // src={"https://s3.amazonaws.com/com.purpics.dev/public/insights/dev/R_T60MyOaHM6f2Hlf/F_33e8C1yYfPYrwTB/Creux%20De%20Van%20-%2045150.mp4"}
                             type="video/mp4" />
                            Your browser does not support the video tag.
                            </video>
                </div>
                <div>

                </div>
                <div  className={"padd-20"} style={{display:'flex'}}>
                        <FormControlLabel control={<Checkbox onChange={()=>{this.props.handleSubTitleConfig()}}  checked={this.props.subTitleConfig} />} label="Show transcript on video" />
                            {/*<img src={checkedIcon} style={{marginRight: 10}}></img>*/}
                            {/*<Typography className={"checkbox-text-setting"}>Show transcript on video</Typography>*/}
                </div>
                <div  className={"padd-20"} style={{display:'flex',width:"100%"}}>
                    <div  style={{width:"70%"}}>
                        <Typography className={"setting-tab-title"}>Alignment</Typography>
                              <div style={{display:"flex"}}> 
                                <div>
                                    <img src={this.props.align == "West" ? LeftAlignActive : LeftAlign} className={"alignMentButton"}  onClick={()=>{this.props.handleSelectAlign("West")}}/>
                                    <img src={this.props.align == "center" ? CenterAlignActive : CenterAlign} className={"alignMentButton"} onClick={()=>{this.props.handleSelectAlign("center")}}/>
                                    <img src={this.props.align == "East" ? RightAlignActive : RightAlign} className={"alignMentButton"} onClick={()=>{this.props.handleSelectAlign("East")}}/>
                                </div>
                                <div style={{marginLeft:20}}>
                                    <img src={this.props.position == "top" ? TopAlignActive :  TopAlign} className={"alignMentButton"}  onClick={()=>{this.props.handleSelectPosition("top")}}/>
                                    <img src={this.props.position == "center" ? MiddleAlignActive : MiddleAlign} className={"alignMentButton"}  onClick={()=>{this.props.handleSelectPosition("center")}}/>
                                    <img src={this.props.position == "bottom" ? BottomAlignActive : BottomAlign} className={"alignMentButton"}  onClick={()=>{this.props.handleSelectPosition("bottom")}}/>
                                </div>  
                              </div>
                            <Typography className={"setting-tab-title"}>Font</Typography>
                            <div className={"fontProperty"}>
                                <div className={"FontName"}>
                                  <SelectComponent menu={Fonts.FontFamilyName}
                                    placeHolder={"Font Name"} 
                                    handleChange={(e) => {this.handleFontName(e)}}
                                    menuValue={this.state.selectedValue}
                                  ></SelectComponent>
                                </div>

                                <div className={"fontStyle"}>
                                  <FontTypeSelectComponent menu={Fonts.FontFamilyType}
                                    placeHolder={"Font Type"}
                                    handleChange={(e) => {
                                      this.setState({selectedStyle:e.target.value})
                                      this.props.onFontTypeChange(e.target.value);
                                      }}
                                    // selectedFontType={this.state.seletedFontNameType}
                                    menuValue={this.state.selectedStyle}
                                  ></FontTypeSelectComponent>
                                </div>

                                <div className={"fontSize"}>
                                  <SelectComponent menu={Fonts.Fontsize}
                                      placeHolder={"Font Size"}
                                      handleChange={(e) => { 
                                        this.setState({selectedSize:e.target.value});
                                        this.props.onFontSizeChange(e.target.value)}}
                                      menuValue={this.state.selectedSize}
                                  ></SelectComponent>
                                </div>
                            </div>
                    </div>
                     <div  style={{ marginRight:"10px"}}>
                            <Typography className={"setting-tab-title"}>Color</Typography>
                            <SketchPicker color={ this.state.background } width={"200px"} styles={{boxShadow:'none'}}
                                    onChangeComplete={(e)=>{this.setState({background:e.hex});this.props.handleChangeComplete(e)}}></SketchPicker>
                </div>
                </div>
            </>
            );
      }
}

export default ReelSetting;