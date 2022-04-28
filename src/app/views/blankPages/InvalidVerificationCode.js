import React, {Component} from "react";
import withWidth from "@material-ui/core/withWidth";

class InvalidVerificationCode extends Component {
    constructor(props) {
        super(props);
        this.state={}
    }

   
    render() {
        return (
           <div className={"main-class"}>
                {"Invalid Verification Code"}
            </div>
        );
    }
}

export default withWidth()(InvalidVerificationCode);
