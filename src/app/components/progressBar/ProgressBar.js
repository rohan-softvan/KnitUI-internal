import React, { Component } from "react";
import { Switch, withStyles, Typography,makeStyles } from "@material-ui/core";
import "./ProgressBar.scss";
class ProgressBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount(){
    if(this.props.value){
        var bars = document.getElementsByName(this.props.class);
        for (var i = 0; i < bars.length; i++) {
            // bars[i].setAttribute("id",this.props.class)
          if (this.props.value / (100 / bars.length) > i) {
            bars[i].classList.add('on');
            // bars[i].className += "on";
          } else {
            bars[i].classList.remove('on');
          }
        }
    }
  }

  render() {
    return (
        <div class="audio-progress">
        <div class="first-bar bar" id={this.props.class} name={this.props.class}/>
        <div class="bar" id={this.props.class} name={this.props.class}/>
        <div class="bar" id={this.props.class} name={this.props.class}/>
        <div class="bar" id={this.props.class} name={this.props.class}/>
        <div class="bar" id={this.props.class} name={this.props.class}/>
        <div class="bar" id={this.props.class} name={this.props.class}/>
        <div class="bar" id={this.props.class} name={this.props.class}/>
        <div class="bar" id={this.props.class} name={this.props.class}/>
        <div class="bar" id={this.props.class} name={this.props.class}/>
        <div class=" last-bar bar" id={this.props.class} name={this.props.class}/>
      </div>
    );
  }
}

export default withStyles()(ProgressBar);
