import React, { Component } from "react";
import { Grid, Typography } from "@material-ui/core";
import "./Auth.scss";
import AuthLogin from "../../../assets/images/authimage.svg";
import knitlogo from "../../../assets/images/Knit_Badge_logo.svg";
import Input from "@material-ui/core/Input";
import { withRouter } from "react-router-dom";
import Checkbox from "@material-ui/core/Checkbox";
import ButtonComponent from "../../components/button/Button";
import {
  checkEmailExist,
  insertTeamNameSignup,
} from "../../services/CommonService";
import Cookies from "universal-cookie";
import Alert from "@material-ui/lab/Alert/Alert";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import AuthLoader from "../../components/authLoader/Loader";
import { roleEnum } from "../../enums";
import { Auth, Hub } from "aws-amplify";

const cookie = new Cookies();

class SignUpWithTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      userId: "",
      teamName: "",
      buttonDisabled: true,
      teamNameNullError: false,
      registerSuccessMessage: false,
      loading: true,
    };
  }

  componentDidMount() {
    // console.log("in 2nd....",this.props.location.state.email)
    // let isGoogle =  localStorage.getItem('is_google')
    let isGoogle = cookie.get("is_google");
    //         console.log("isGoogle.......",isGoogle)
    if (isGoogle) {
      Auth.currentAuthenticatedUser()
        .then((user) =>
          this.setState({ user }, () => {
            // console.log("user...on SignIn.......", user);

            let email = user.signInUserSession.idToken.payload["email"];
            let token = user.signInUserSession.idToken.jwtToken
            this.getUserIdByEmail(email);
            this.getUserDetailByAccessToken(email)
          })
        )
        .catch(() => console.log("Not signed in"));
    } else {
     this.getUserIdByEmail(this.props.location.state.email);
     this.getUserDetailByAccessToken(this.props.location.state.email)
    //  this.getUserDetailByAccessToken(this.props.location.state.email)
    }
  }

  getUserDetailByAccessToken = (token) => {
      // console.log("in Token Check...");
      if (token !== "") {
          let data = {
              email: token
          };
          checkEmailExist(data).then((response) => {

              // console.log("in access_token Check...length.....",response.data);
              if (response.data.length > 0) {

                  // console.log("in EMAIL Check...USERID.....", response.data[0].is_details_acquired);

                  let detail = response.data[0].is_details_acquired;
                  let verified= response.data[0].is_verified;
                  let email = response.data[0].email;
                  let userID=response.data[0]._id.$oid;
                  this.setState({ userID: response.data[0]._id.$oid });
                //   if (response.data[0].is_google_user) {

                  if (detail) {
                      cookie.set("user_type", roleEnum.KNIT)
                      cookie.set("user_email", email)

                      this.setState({loading:false})
                      window.location.href = "/knit/projects"
                  } else {
                    this.setState({loading:false})
                      this.props.history.push({
                          pathname: "/signUpWithTeam",
                          state: {email: email,
                            userID:userID,
                            verified:verified},
                      });
                  }
            //   }

              } else {
                  // console.log("in EMAIL Check...USERID. NA  MDYU....",response.data);
              }

          });
      }

  };

  getUserIdByEmail = (email) => {
    if (email !== "") {
      let data = {
        email: email,
      };
      checkEmailExist(data).then((response) => {
        // console.log("in EMAIL Check...length.....", response.data.length);
        // console.log("in EMAIL Check...length.....", response.data);
        if (response.data.length > 0) {
          this.setState({ userID: response.data[0]._id.$oid });

          //cookie.set("user_Id",response.data[0]._id.$oid)
        } else {
          // console.log("in EMAIL Check...USERID. NA  MDYU....", response.data);
        }
      });
    }
  };




  render() {
    return (
     
             <div className="fullPageLoader">
                {this.state.loading && <AuthLoader />}
             </div>          
          
    );
  }
}

export default SignUpWithTeam;
