import React, {Component} from "react";
import withWidth from "@material-ui/core/withWidth";

class InvalidPage extends Component {
    constructor(props) {
        super(props);
        this.state={}
    }

   
    render() {
        return (
           <div className={"main-class"}>
                {"Something Went Wrong...!!"}
            </div>
        );
    }
}

export default withWidth()(InvalidPage);
