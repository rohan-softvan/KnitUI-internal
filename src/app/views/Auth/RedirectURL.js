import React, { Component } from "react";
import { Grid, Typography } from "@material-ui/core";
import "./Auth.scss";
import {
  checkEmailExist,
  insertTeamNameSignup,
} from "../../services/CommonService";
import Cookies from "universal-cookie";
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
    let isGoogle = cookie.get("is_google");
    if (isGoogle) {
      Auth.currentAuthenticatedUser()
        .then((user) =>
          this.setState({ user }, () => {
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
    }
  }

  getUserDetailByAccessToken = (token) => {
      if (token !== "") {
          let data = {
              email: token
          };
          checkEmailExist(data).then((response) => {
              if (JSON.stringify(response.data.user_details) !== '{}') {
                  let detail = response.data.user_details.is_details_acquired;
                  let verified= response.data.user_details.is_verified;
                  let email = response.data.user_details.email;
                  let userID=response.data.user_details._id.$oid;
                  this.setState({ userID: response.data.user_details._id.$oid });
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
          if (JSON.stringify(response.data.user_details) !== "{}") {
          this.setState({ userID: response.data.user_details._id.$oid });
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
