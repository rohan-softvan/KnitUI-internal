import React, { Component } from "react";
import {Grid, Typography} from "@material-ui/core";
import './Auth.scss';
import AuthLogin from '../../../assets/images/authimage.svg';
import knitlogo from '../../../assets/images/Knit_Badge_logo.svg';
import ButtonComponent from "../../components/button/Button";
import Input from '@material-ui/core/Input';
import '../../css/common.scss';
import { checkEmailExist,forgotPassword } from "../../services/CommonService";
import { withRouter } from 'react-router-dom';
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import Alert from "@material-ui/lab/Alert/Alert";
import AuthLoader from "../../components/authLoader/Loader";
import { Player, Controls } from "@lottiefiles/react-lottie-player";

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
class ForgotPassword extends Component{
    constructor(props) {
        super(props);
        this.state = {
            emailError: false,
            emailNullError: false,
            email: "",
            loading: false,
            buttonDisabled:true,
            emailSendSuccessMessage:false,
            SuccessFlag: false,

        };
    }

    handleRedirectionRP=()=>{
        const { history } = this.props;
        if(history) history.push('/resetPassword');
    }


    //For EMAIL VALIDATION
    emailValidation = (textData) => {
        let text =  textData.target.value
        if (text.length === 0) {
            this.setState({ emailNullError: true ,buttonDisabled: true});
            return false;
        } else {
            this.setState({ emailNullError: false,buttonDisabled: false});
        }
        if (emailRegex.test(text.toLowerCase())) {
            this.checkUserMail(text);
            this.setState({ emailError: false,buttonDisabled: false, email: text });
            return false;
        } else {
            this.setState({ emailError: true,buttonDisabled: true, email: text });
        }

    };
//email validation
    checkUserMail  = async (email) => {
        //console.log("in EMAIL Check...");
        if (email !== "") {
            let data = {
                email: email
            };
            checkEmailExist(data).then((response) => {

                // console.log("length.....",response.data.length);
                if (response.data.length > 0) {
                    this.setState({ emailCheck: false,buttonDisabled: false });
                } else {
                    this.setState({ emailCheck: true,buttonDisabled: true });
                }

            });
        }

    };

    insertEmail = async ()=> {

        this.setState({ loading: true });
        let data = {
            "is_sent_forgot_password_mail": true,
            "email": this.state.email
        };

        forgotPassword(data).then((response) => {
            // console.log("response........",response);
            if (response.success) {
                this.setState({ loading: false,buttonDisabled: true });
                // console.log("IN IFFF........");
                this.setState({ emailSendSuccessMessage:true,SuccessFlag:true});
                // this.props.history.push({
                //     pathname: "/login",
                //     state: { teamName: this.state.teamName },
                // });
            }else {
                // console.log("IN ELSE........");
                this.setState({ loading: false });
            }

        });
    }

    renderLogo=()=>{
        return(
            <img src={knitlogo} className={"knitLogo"}></img>
        )
    }
    renderForm=()=>{
        return(
            <div className={"auth-form"}>
                <card className="auth-box">
                    <Typography variant={"h6"} component={"h6"} className={"auth-title"}>
                        Forgot your password?
                    </Typography>
                    <Typography variant={"h6"} component={"h6"} className={"auth-sub-title mb-30"}>
                        Don't worry, it happens to the best of us.
                    </Typography>
                    
                    <div className={"form-group"}>
                        <Typography variant={"h6"} className={"form-label"}>What was your email?</Typography>
                        <Input className={"form-input"} onChange={(text) => {this.emailValidation(text);}}></Input>
                        <Typography variant={"h6"} className={"form-label-error"}>{
                            this.state.emailNullError
                                ? "Please enter an email"
                                : this.state.emailError
                                ? "Please enter a valid email"
                                : this.state.emailCheck
                                ? "An account with this email doesn’t exist"
                                : false}</Typography>
                    </div> 
                    
                    <ButtonComponent
                    className={"signupEmail"}
                    iconPosition={"center"}
                    margin={"0px"}
                    text={"Reset Password"}
                    width={"150px"}
                    disabled={this.state.buttonDisabled}
                    onClick={()=>{this.insertEmail()}}></ButtonComponent>
                    {this.state.loading && <AuthLoader/>}
                </card>
            </div>
        )
    }
    renderGradiant=()=>{
        return(
            <Grid container spacing={1}>
                <Grid item xs={12} md={12} lg={12} sm={12}>
                    <Typography variant={"h6"} component={"h6"} className={"login-title-class"}>
                        Qualitative and quantitative data analysis, simplified.
                    </Typography>

                    <img src={AuthLogin} className={"loginImage"}></img>

                    <Typography variant={"h6"} component={"h6"} className={"login-subtitle-class"}>
                        <span>Sign up and become a</span> Research Superhero.
                    </Typography>
                </Grid>
            </Grid>
        )
    }



    renderSuccess = () => {
        return (
          <>
            <div className={"auth-form"}>
              <div className={"auth-box"}>
                <div className={"checkmark"}>
                  <Player
                    autoplay
                    loop
                    src="https://assets9.lottiefiles.com/packages/lf20_uvPY2t.json"
                    className={"checkmark-success"}
                  ></Player>
                  <Typography
                    variant={"h6"}
                    component={"h6"}
                    className={"checkmark-subtitle"}
                  >
                    The Reset password link has been sent to your Email Address. Click the link in the email to create a new password!
                  </Typography>
                </div>
              </div>
            </div>
          </>
        );
      };
      

    render() {
        return (
            <div className={"auth"}>
                <div className={"login-box"}>
                    <div className={"login-wrap"}>
                        <div className={"auth-logo"}>
                            {this.renderLogo()}
                        </div>
                        {this.state.SuccessFlag ? (
                                <div className={"successform"}>{this.renderSuccess()}</div>
                            ) : (
                                <div className={"loginform"}>{this.renderForm()}</div>
                            )}

                        <div className={"loginbg"}>
                            {this.renderGradiant()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ForgotPassword;
