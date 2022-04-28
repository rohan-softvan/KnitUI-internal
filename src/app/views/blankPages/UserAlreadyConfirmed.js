import React, {Component} from "react";
import withWidth from "@material-ui/core/withWidth";

class UserAlreadyConfirmed extends Component {
    constructor(props) {
        super(props);
        this.state={}
    }

   
    render() {
        return (
           <div className={"main-class"}>
                {"User UnAuthorized"}
            </div>
        );
    }
}

export default withWidth()(UserAlreadyConfirmed);
