import React, {Component} from "react";
import withWidth from "@material-ui/core/withWidth";

class VerificationLinkExpired extends Component {
    constructor(props) {
        super(props);
        this.state={}
    }

   
    render() {
        return (
           <div className={"main-class"}>
                {"Verification Link has been expired"}
            </div>
        );
    }
}

export default withWidth()(VerificationLinkExpired);
