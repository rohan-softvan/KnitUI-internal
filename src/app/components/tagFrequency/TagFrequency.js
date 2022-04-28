import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Color from "../../config/Color";
import { Switch, withStyles, Typography } from "@material-ui/core";

const styles = {
  mainDiv: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // opacity: 0.2,
  },
  label: {
    fontSize: 12,
    color: "#3D3F3E",
  },
};

class tagFrequency extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes } = this.props;
    return (
      <div
        style={{
          ...(this.props.width != undefined
            ? { width: this.props.width }
            : { width: "100px" }),
          ...(this.props.height != undefined
            ? { height: this.props.height }
            : { height: "100px" }),
        }}
        className={this.props.className || ""}
      >
        <Typography style={{ ...styles.label,
         ...(this.props.fontSize != undefined
            ? { fontSize: this.props.fontSize }
            : { fontSize: "14px" }), }}>
          {this.props.text ? this.props.text : "Tag"}
        </Typography>
      </div>
    );
  }
}

export default withStyles()(tagFrequency);
