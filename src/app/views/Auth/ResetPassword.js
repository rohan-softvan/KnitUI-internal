import React, { Component } from "react";
import {Grid, Typography} from "@material-ui/core";
import './Auth.scss';
import AuthLogin from '../../../assets/images/authimage.svg';
import knitlogo from '../../../assets/images/Knit_Badge_logo.svg';
import ButtonComponent from "../../components/button/Button";
import Input from '@material-ui/core/Input';
import '../../css/common.scss';
//import { useParams } from 'react-router-dom';
import AuthLoader from "../../components/authLoader/Loader";
import {setResetPassword} from "../../services/CommonService";
const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// const { user_name } = useParams()
function getQueryStringValue(key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}
class SignIn extends Component{
    constructor(props) {
        super(props);
        this.state = {
            passwordNullError: false,
            passwordError: false,
            password: "",
            rePasswordNullError: false,
            rePasswordError: false,
            rePassword: "",
            loading: false,
            userName: null,
            customState: null,
            buttonDisabled:true,
            confirmationCode:'',
        };
    }
    componentDidMount() {
       let userName = getQueryStringValue("user_name");
       let confirmationCode =getQueryStringValue("confirmation_code");
        this.setState({ userName: userName ,confirmationCode:confirmationCode});
        // console.log("userName........",userName,".........confirmationCode......",confirmationCode)
    }

    insertNewPassword = ()=> {

        this.setState({ loading: true });
        let data = {
            "is_password_reset":true,
            "username":this.state.userName,
            "password":this.state.password,
            "confirmation_code":this.state.confirmationCode
        };

        setResetPassword(data).then((response) => {
// console.log("response.......",response.Location)

            if (response.Location) {
                this.setState({ loading: false,buttonDisabled: true });
                //console.log("userIDDDD.....");
                //this.setState({ registerSuccessMessage:true});

                this.props.history.push({
                    pathname: response.Location,
                });
            }
            else {

            }

        });
    }
    passwordValidation = (textData) => {
        let text =  textData.target.value
        if (text.length === 0) {
            this.setState({ passwordNullError: true });
            return false;
        } else {
            this.setState({ passwordNullError: false });
        }
        if (passwordRegex.exec(text)) {

            this.setState({ passwordError: false, password: text });

            if(text === this.state.rePassword){
                this.setState({ rePasswordError: false,buttonDisabled:false });
            }
            else {
                this.setState({ rePasswordError: true,buttonDisabled:true });
            }

            return false;
        } else {
            this.setState({ passwordError: true, password: text });
        }
    };

    rePasswordValidation = (textData) => {
        let text =  textData.target.value
        if (text.length === 0) {
            this.setState({ rePasswordNullError: true ,buttonDisabled: true});
            return false;
        } else {
            this.setState({ rePasswordNullError: false ,buttonDisabled: false});
        }
        if (text === this.state.password && this.state.passwordError == false) {
            this.setState({ rePasswordError: false, rePassword: text ,buttonDisabled: false });
            return false;
        } else {
            this.setState({ rePasswordError: true, rePassword: text ,buttonDisabled: true});
        }
    };
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
                        Reset your password
                    </Typography>
                    <Typography variant={"h6"} component={"h6"} className={"auth-sub-title mb-30"}>
                        Choose a secure password.
                    </Typography>
                    
                    <div className={"form-group"}>
                        <Typography variant={"h6"} className={"form-label"}>Create a new password</Typography>
                        <Input type={"password"} placeholder={"Enter your password"} className={this.state.passwordNullError || this.state.passwordError ? "form-input errorline" : "form-input"} onChange={(text) => {
                            this.passwordValidation(text);
                        }}>
                        </Input>
                        <Typography variant={"h6"} className={"form-label-error error-password"}>{
                            this.state.passwordNullError
                                ? "Please Enter Password"
                                : this.state.passwordError
                                ? "Choose a password with at least 8 characters, one capital letter, one small letter, and a number"
                                : false
                        }</Typography>
                    </div> 

                    <div className={"form-group"}>
                        <Typography variant={"h6"} className={"form-label"}>Re-enter the password</Typography>
                        <Input type={"password"} placeholder={"Re-enter your password"} className={this.state.rePasswordNullError || this.state.rePasswordError || this.state.passwordError ? "form-input errorline" : "form-input"} onChange={(text) => {
                            this.rePasswordValidation(text);
                        }}></Input>
                        <Typography variant={"h6"} className={"form-label-error"}>{
                            this.state.rePasswordNullError
                                ? "Please Enter Re-Password"
                                : this.state.rePasswordError
                                ? "The passwords entered don’t match"
                                : false
                        }</Typography>
                    </div>

                    <ButtonComponent
                    className={"signupEmail"}
                    iconPosition={"center"}
                    margin={"0px"}
                    text={"Reset Password"}
                    disabled={this.state.buttonDisabled}
                    width={"150px"}
                    onClick={()=>{this.insertNewPassword()}}></ButtonComponent>
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

    render() {
        return (
            <div className={"auth"}>
                <div className={"login-box"}>
                    <div className={"login-wrap"}>
                        <div className={"auth-logo"}>
                            {this.renderLogo()}
                        </div>
                        <div className={"loginform"}>
                            {this.renderForm()}
                        </div>
                        <div className={"loginbg"}>
                            {this.renderGradiant()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SignIn;
