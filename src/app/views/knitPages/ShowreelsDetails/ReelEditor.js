import React, { Component } from "react";
import { Grid,Typography,Card} from "@material-ui/core";
import "../../../css/common.scss";
import BackArrow from "../../../../assets/images/project-details/BackArrow.svg";
import ShowReelPlaylist from "../../../components/showreelPlaylist/ShowreelPlaylist"
import ShowReelSnippets from "../../../components/ShowReelSnippets/ShowReelSnippets";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import "./ShowreelsDetails.scss"
import Color from "../../../config/Color";
import { Popover } from "@material-ui/core";
import ButtonComponent from "../../../components/button/Button";
import filmRoll from "../../../../assets/images/sidebar/film-roll.svg";
import { InteractiveHighlighter } from 'react-interactive-highlighter';
import { Skeleton } from "@material-ui/lab";
import CloseIcon from '@material-ui/icons/Close';

class ReelEditor extends Component {
      constructor(props){
        super(props)
        this.state={
          isShowReelButton:false,
          anchorEl:null,
          open:false,
          isRemoveButton:false,
          selectedTag:'',
            videoId:''
        }
      }

      componentDidMount(){
        window.addEventListener('scroll', this.handleScroll);
        this.setState({videoId:this.props.selectedvideoId})
    }


      getCompareString=(tag)=>{
        let newJson=[];
        newJson= this.props.highlights.filter(el => el.selectedTagName.includes(tag.toString().trim()))
        this.setState({selectedTag:tag})
        if(newJson.length > 0){
          this.setState({isRemoveButton:true,isShowReelButton:false})
        }else{
          this.setState({isRemoveButton:false,isShowReelButton:true})
        }
        
      }
  
      onMouseSelect = (e) => {
          localStorage.setItem("highlightsConcatenationFlag",false);
        this.setState({
          isShowReelButton:false,
          isRemoveButton:false
        })
        this.getCompareString(e.target.innerText)

          this.setState({ x: e.pageX, y: e.pageY ,selectedText:e.target.innerHTML
          }, () => {
            this.handleClick(e)
          });
      };
      handleClick = (event) => {
          // if(this.props.selectedText != " " && this.props.selectedText != null && this.props.selectedText != ""){
              let myArray = this.props.selectedText.split(" ");
              let newArr=myArray.filter(el=> el != "")
           
              if(this.props.highlights.length <= 0){
                    if(Array.isArray(newArr) && newArr.length>=3){
                      this.setState({ anchorEl: event.currentTarget, open: true });      
                    }
              }else{
                this.setState({ anchorEl: event.currentTarget, open: true });
              }
          // }          
        };

        handleClose = () => {
          this.setState({ anchorEl: null, open: false, isShowReelButton: false ,selectedText:""});
        };
        
        handleScroll=()=>{
          this.setState({x:this.state.x,y:this.state.y})
        }
  
    render() {
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
                <div  className={"padd-20"}>
                    <Typography style={{fontSize:15,fontWeight:300,color:Color.primary,letterSpacing:0}}  onMouseUp={(e)=>{this.onMouseSelect(e);}}>
                    {/* Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labor et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sitamet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labor et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo et ea
                     */}
                     {this.props.data && this.props.highlights && 
                      <InteractiveHighlighter
                      text={this.props.data}  
                      highlights={this.props.highlights}
                      customClass={"highlighted-color"}
                      selectionHandler={this.props.selectionHandler}
                  />
                     }
                     {/* {this.props.data ? this.props.data : ""} */}
                    </Typography>
                    {this.state.x != 0 && this.state.y != 0 && (
                    <Popover
                open={this.state.open}
                anchorEl={this.state.anchorEl}
                onClose={this.handleClose}
                anchorOrigin={{
                  vertical: this.state.y,
                  horizontal: this.state.x,
                }}  
                disableScrollLock={true} 
             >
               {this.state.isShowReelButton &&
              <ButtonComponent
              iconPosition={"left"}
              icon={<img src={filmRoll} width={20} />}
              text={"Add To ShowReel"}
              width={"auto"}
              fontWeight={500}
              margin={"0px 0px 0px 0px"}
              bgColor={"white"}
              color={Color.primary}
              boxShadow={"0px 0px 6px #00000029"}
              onClick={()=>{this.props.selectionHandler("", "", "",true,this.state.videoId); this.setState({open:false})}}
          />}
            {this.state.isRemoveButton &&
              <ButtonComponent
              iconPosition={"left"}
              icon={<CloseIcon></CloseIcon>}
              text={"Remove"}
              width={"auto"}
              fontWeight={500}
              margin={"0px 0px 0px 0px"}
              bgColor={"white"}
              color={Color.primary}
              boxShadow={"0px 0px 6px #00000029"}
              onClick={()=>{this.props.handleRemoveSnippet(this.state.selectedTag,this.state.videoId); this.setState({open:false})}}
          />}
              </Popover>)}
             
                </div>
           </>
            );
      }
}

export default ReelEditor;
