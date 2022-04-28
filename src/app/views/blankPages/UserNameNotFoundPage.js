import React, {Component} from "react";
import withWidth from "@material-ui/core/withWidth";

class UserNameNotFound extends Component {
    constructor(props) {
        super(props);
        this.state={}
    }

   
    render() {
        return (
           <div className={"main-class"}>
                {"User Name Not Found"}
            </div>
        );
    }
}

export default withWidth()(UserNameNotFound);
