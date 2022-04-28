import React, {Component} from "react";
import withWidth from "@material-ui/core/withWidth";

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state={}
    }

   
    render() {
        return (
           <div className={"main-class"}>
                {"ChangePassword Page"}
            </div>
        );
    }
}

export default withWidth()(ChangePassword);
