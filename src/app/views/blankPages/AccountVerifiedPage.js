import React, {Component} from "react";
import withWidth from "@material-ui/core/withWidth";

class AccountVerifiedPage extends Component {
    constructor(props) {
        super(props);
        this.state={}
    }

   
    render() {
        return (
           <div className={"main-class"}>
                {"Account Verified Page"}
            </div>
        );
    }
}

export default withWidth()(AccountVerifiedPage);
