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
    checkOrganizationExist,checkEmailExist,
  insertTeamNameSignup,
} from "../../services/CommonService";
import Cookies from "universal-cookie";
import Alert from "@material-ui/lab/Alert/Alert";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import AuthLoader from "../../components/authLoader/Loader";
import { roleEnum } from "../../enums";
import { Auth, Hub } from "aws-amplify";
import { Player, Controls } from '@lottiefiles/react-lottie-player';
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
      loading: false,
      SuccessFlag: false,
        nameCheck:false
    };
  }

  componentDidMount() {
    // console.log("in 2nd....",this.props.location.state.email)
    // let isGoogle =  localStorage.getItem('is_google')
    // let isGoogle = cookie.get("is_google");
    // //         console.log("isGoogle.......",isGoogle)
    // if (isGoogle) {
    //   Auth.currentAuthenticatedUser()
    //     .then((user) =>
    //       this.setState({ user }, () => {
    //         console.log("user...on SignIn.......", user);

    //         let email = user.signInUserSession.idToken.payload["email"];
    //         let token = user.signInUserSession.idToken.jwtToken
    //         // this.getUserIdByEmail(email);
    //         // this.getUserDetailByAccessToken(email)
    //       })
    //     )
    //     .catch(() => console.log("Not signed in"));
    // } else {
    //  this.getUserIdByEmail(this.props.location.state.email);
    //  this.getUserDetailByAccessToken(this.props.location.state.email)
    // }
    if(this.props.location.state.email){
        this.setState({email:this.props.location.state.email})
    }
    if(this.props.location.state.userID){
        this.setState({userID:this.props.location.state.userID})
    }
    if(this.props.location.state.verified){
        this.setState({verified:this.props.location.state.verified})
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
                  let email = response.data[0].email;
                  this.setState({ userID: response.data[0]._id.$oid });
                //   if (response.data[0].is_google_user) {

                  if (detail) {
                      cookie.set("user_type", roleEnum.KNIT)
                      cookie.set("user_email", email)

                      window.location.href = "/knit/projects"

                  } else {

                      this.props.history.push({
                          pathname: "/signUpWithTeam",
                          state: {email: email},
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
     
        if (response.data.length > 0) {
          
          this.setState({ userID: response.data[0]._id.$oid });

          //cookie.set("user_Id",response.data[0]._id.$oid)
        } else {
          // console.log("in EMAIL Check...USERID. NA  MDYU....", response.data);
        }
      });
    }
  };

  insertTeamName = () => {
    if (!this.state.checkTandC) {
      this.setState({
        // errorFlag: true,
        buttonDisabled: true,
      });
      window.scrollTo(0, 0);
    } else if (!this.state.teamName) {
      this.setState({ teamNameNullError: true, buttonDisabled: true });
      return false;
    } else {
      this.setState({
        buttonDisabled: false,
      });
    }
    this.setState({ loading: true });
    let data = {
      organization_name: this.state.teamName,
      knit_user_id: this.state.userID,
    };

    insertTeamNameSignup(data).then((response) => {
        if(response.data){
            if (response.data.length > 0) {
                this.setState({ loading: false, buttonDisabled: true });
                //console.log("userIDDDD.....");
                let isGoogle = cookie.get("is_google");
                if(isGoogle){
                    cookie.remove("is_google");
                    this.props.history.push({
                    pathname: "/login",
                    state: { teamName: this.state.teamName },
                });
                }else{
                    if(this.state.verified){
                        window.location.href="/knit/projects"
                    }else{

                        this.setState({ SuccessFlag: true });
                    }
                }
              }
           }
     
    });
  };
  handleOnChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    let text = event.target.value;
    if (text.length === 0) {
      this.setState({ teamNameNullError: true });
      return false;
    } else {
      this.setState({ teamNameNullError: false });
      this.checkOrgName(text);
    }
  };

  handleCheckbox = (event) => {
    this.setState({
      checkTandC: event.target.checked,
    });

    if (event.target.checked) {
      this.setState({
        //errorFlag: false,
        buttonDisabled: false,
      });
    } else {
      this.setState({
        errorFlag: true,
        buttonDisabled: true,
      });
      window.scrollTo(0, 0);
    }
    setTimeout(() => {}, 1000);
  };
  //check organization name
  checkOrgName = (name) => {
        //console.log("in EMAIL Check...");
        if (name !== "") {

            checkOrganizationExist(name).then((response) => {

                 //console.log("length.....",response);
                if (response.data.is_unique) {
                    //console.log("IFFFF.....",);
                    this.setState({ nameCheck: false,buttonDisabled: false,});
                } else {
                    //console.log("False.....",);
                    this.setState({ nameCheck: true ,buttonDisabled: true,});
                }

            });
        }

    };

  handleRedirection = () => {
    const { history } = this.props;
    if (history) history.push("/login");
  };
  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ registerSuccessMessage: false });
    // setOpen(false);
  };
  renderLogo = () => {
    return <img src={knitlogo} className={"knitLogo"}></img>;
  };
  renderForm = () => {
    return (
      <div className={"auth-form"}>
          
        <card className="auth-box">
          <Typography variant={"h6"} component={"h6"} className={"auth-title"}>
            Sign Up
          </Typography>
          <Typography
            variant={"h6"}
            component={"h6"}
            className={"auth-sub-title"}
          >
            You're ready to go! One last thing...
          </Typography>

          <div className={"form-group mt-30"}>
            <Typography variant={"h6"} className={"form-label"}>
              Give your team a name
            </Typography>
            <Input
              type={"text"}
              className={"form-input"}
              name={"teamName"}
              onChange={(event) => {
                this.handleOnChange(event);
              }}
              //onblur={this.checkOrgName()}
            ></Input>
              <Typography variant={"h6"} className={"form-label-error"}>{
                  this.state.teamNameNullError
                      ? "Please Enter Team Name"
                      : this.state.nameCheck
                          ? "This Team name already exists"
                          : false}</Typography>


          </div>

          <div className={"form-group checkbox-label"}>
            <Checkbox
              className={"custom-checkbox"}
              color="primary"
              onChange={this.handleCheckbox}
              inputProps={{ "aria-label": "secondary checkbox" }}
            />
            <Typography variant={"h6"} className={"form-label"}>
              I agree to the{" "}
              <span>
                <a
                  href="https://goknit.com/terms-and-conditions/"
                  target="_blank"
                >
                  {" "}
                  terms and conditions.
                </a>
              </span>
            </Typography>
          </div>

          <ButtonComponent
            className={"signupEmail"}
            iconPosition={"center"}
            margin={"0px"}
            text={"Get Started"}
            width={"150px"}
            disabled={this.state.buttonDisabled}
            onClick={() => {
              this.insertTeamName();
            }}
          ></ButtonComponent>
            {this.state.loading && <AuthLoader/>}
        </card>
      </div>
    );
  };
  renderGradiant = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} md={12} lg={12} sm={12}>
          <Typography
            variant={"h6"}
            component={"h6"}
            className={"login-title-class"}
          >
            Qualitative and quantitative data analysis, simplified.
          </Typography>

          <img src={AuthLogin} className={"loginImage"}></img>

          <Typography
            variant={"h6"}
            component={"h6"}
            className={"login-subtitle-class"}
          >
            <span>Sign up and become a</span> Research Superhero.
          </Typography> 
        </Grid>
      </Grid>
    );
  };

  renderSuccess = ()=>{
      return(
          <>
              <div className={"auth-form"}>
                  <div className={"auth-box"}>
                      <div className={"checkmark"}>
                          <Player
                              autoplay
                              loop
                              src="https://assets9.lottiefiles.com/packages/lf20_uvPY2t.json"
                              className={"checkmark-success"}
                          >
                          </Player>
                          <Typography variant={"h6"} component={"h6"} className={"checkmark-subtitle"}>A verification link has been sent to your email. Please click the
                              link to finish signing up.</Typography>
                      </div>
                  </div>
              </div>

              </>
      )
  }


  render() {
    return (
      <div className={"auth"}>
        {/*<Snackbar*/}
        {/*  open={this.state.registerSuccessMessage}*/}
        {/*  autoHideDuration={9000}*/}
        {/*  onClose={this.handleClose}*/}
        {/*>*/}
        {/*  <Alert onClose={this.handleClose} severity="success">*/}
        {/*    A verification link has been sent to your email. Please click the*/}
        {/*    link to finish signing up.*/}
        {/*  </Alert>*/}
        {/*</Snackbar>*/}
        <div className={"login-box"}>
          <div className={"login-wrap"}>        
            <div className={"auth-logo"}>{this.renderLogo()}</div>
              {this.state.SuccessFlag
                  ? <div className={"successform"}>{this.renderSuccess()}</div>
                  :<div className={"loginform"}>{this.renderForm()}</div>
              }

            {/*<div className={"loginform"}>{this.renderForm()}</div>*/}
            <div className={"loginbg"}>{this.renderGradiant()}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUpWithTeam;
