import React, { Component } from "react";
import {Grid, Typography} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import './Auth.scss';
import AuthLogin from '../../../assets/images/authimage.svg';
import knitlogo from '../../../assets/images/Knit_Badge_logo.svg';
import Googlelogo from '../../../assets/images/google.svg';
import Button from "@material-ui/core/Button";
import ButtonComponent from "../../components/button/Button";
import Input from '@material-ui/core/Input';
import { checkEmailExist } from "../../services/CommonService";
import AuthLoader from '../../components/authLoader/Loader';
import { withRouter } from 'react-router-dom';
import { Auth,Hub } from "aws-amplify";
import CognitoIdentityServiceProvider from "aws-sdk/clients/cognitoidentityserviceprovider";
import { ENVIRONMENT } from "../../Constants";
import { setCookie } from "../../_helpers";
import { roleEnum } from "../../enums";
import Cookies from "universal-cookie";
import {AWS_REGION,AWS_APP_CLIENT_ID,AWS_USER_POOL_ID,COGNITO_DOMAIN_URL,GOOGLE_REDIRECT_SIGNIN_URL} from "../../../config";
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const cookie = new Cookies();
function genrateRandomNumber() {

    return Math.floor( Math.random() * 1234567890123);
}

const oauth = {
    domain: COGNITO_DOMAIN_URL,
    scope: ['email', 'profile', 'openid'],
    redirectSignIn:GOOGLE_REDIRECT_SIGNIN_URL,
    redirectSignOut: 'https://y5004fqy95.execute-api.us-east-1.amazonaws.com/dev/google',
    responseType: 'token'
};
Auth.configure({
    oauth: oauth,
    region: AWS_REGION,
    userPoolId: AWS_USER_POOL_ID,
    userPoolWebClientId: AWS_APP_CLIENT_ID
});

class SignUp extends Component{
    constructor(props) {
        super(props);
        this.state = {
            emailError: false,
            emailNullError: false,
            email: "",
            buttonDisabled: true,
            passwordNullError: false,
            passwordError: false,
            password: "",
            rePasswordNullError: false,
            rePasswordError: false,
            rePassword: "",
            loading: false,user: null, customState: null
        };
    }
    componentDidMount() {

    }

    checkUserMail = (email) => {
        //console.log("in EMAIL Check...");
        if (email !== "") {
            let data = {
                email: email
            };
            checkEmailExist(data).then((response) => {

                    // console.log("length.....",response.data.length);
                    if (response.data.length > 0) {
                        this.setState({ emailCheck: true});
                    } else {
                        this.setState({ emailCheck: false });

                    }

            });
        }

    };

    emailValidation = (textData) => {
let text =  textData.target.value
        if (text.length === 0) {
            this.setState({ emailNullError: true });
            return false;
        } else {
            this.setState({ emailNullError: false });
        }
        if (emailRegex.test(text.toLowerCase())) {
           this.checkUserMail(text);
            this.setState({ emailError: false, email: text });
            return false;
        } else {
            this.setState({ emailError: true, email: text });
        }

    };

    passwordValidation = (textData) => {
        let text =  textData.target.value

        if(this.state.emailCheck){
            this.setState({ buttonDisabled:true });

        }

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
            this.setState({ passwordError: true, password: text,rePasswordError: true,buttonDisabled:true });
        }
    };

    rePasswordValidation = (textData) => {
        let text =  textData.target.value
        if(this.state.emailCheck){
            this.setState({ buttonDisabled:true });
        }
        else if (text.length === 0) {
            this.setState({ rePasswordNullError: true,buttonDisabled:true });
            return false;
        } else {
            this.setState({ rePasswordNullError: false,buttonDisabled:false });
        }
         if (text === this.state.password && this.state.passwordError == false) {
            this.setState({ rePasswordError: false, rePassword: text,buttonDisabled:false });
            return false;
        } else {
            this.setState({ rePasswordError: true, rePassword: text,buttonDisabled:true });
        }
    };

    handleOnSubmit = async () => {
        if (this.state.emailCheck) {
            this.setState({ emailCheck: true });
            return false;
        } else {
            this.setState({ emailCheck: false });
        }
        if (this.state.email === "" || this.state.emailCheck) {
            this.setState({ emailNullError: true });
            return false;
        } else {
            this.setState({ emailNullError: false });
        }
        if (emailRegex.test(this.state.email.toLowerCase())) {
            this.setState({ emailError: false });
        } else {
            this.setState({ emailError: true });
            return false;
        }

        if (this.state.password === "") {
            this.setState({ passwordNullError: true });
            return false;
        }

        if (this.state.password.length >= 8) {
            this.setState({ passwordError: false });
        } else {
            this.setState({ passwordError: true });
            return false;
        }

        if (this.state.rePassword === "") {
            this.setState({ rePasswordNullError: true });
            return false;
        }

        if (this.state.rePassword === this.state.password) {
            this.setState({ rePasswordError: false });
        } else {
            this.setState({ rePasswordError: true });
            return false;
        }

        // this.props.history.push("/dashboard");
        //};
        const email = this.state.email;
        const password = this.state.password;
        try {
            this.setState({ loading: true });
            // const newUser =
            await Auth.signUp({
                username: genrateRandomNumber().toString(),
                password: password,
                attributes: {
                    "email":email,
                    "custom:user_type": roleEnum.KNIT,
                    //"custom:environment": ENVIRONMENT
                }

            });
            this.setState({ loading: false });
            this.props.history.push({
                pathname: "/redirectURL",
                state: { email: email },
            });

        } catch (e) {
           // message.error(e.message);
            this.setState({ loading: false });
        }

        // try {
        //     console.log("in Submit55555555555555555555")
        //     await Auth.signIn(email, password);
        //
        //     Promise.resolve(Auth.currentAuthenticatedUser()).then((user) => {
        //         Auth.currentCredentials()
        //             .then((credentials) =>
        //                 Promise.resolve(
        //                     new CognitoIdentityServiceProvider({
        //                         apiVersion: "2016-04-18",
        //                         credentials: Auth.essentialCredentials(credentials),
        //                         region: "us-east-1"
        //                     })
        //                 )
        //             )
        //             .then((client) =>
        //                 client
        //                     .adminAddUserToGroup({
        //                         GroupName: roleEnum.KNIT,
        //                         UserPoolId: "us-east-1_ISM7nmxX9",
        //                         Username: '10000000000000'
        //                     })
        //                     .promise()
        //             );
        //         Auth.currentAuthenticatedUser().then((user) => {
        //             const expireTime = user.signInUserSession.idToken.payload.exp;
        //             setCookie(
        //                 user.signInUserSession.idToken.payload["custom:user_type"],
        //                 user.signInUserSession.idToken.jwtToken
        //             );
        //
        //
        //             // let user_data = {
        //             //     company_name: companyName,
        //             //     user_email: email,
        //             //     company_size: comapnySize,
        //             //     role_of_person: roleInCompany,
        //             //     expires_at: expireTime
        //             // };
        //             // advertiserSignup(user_data).then((response) => {
        //             //     if (response.success && response.code === 200) {
        //             //         this.setState({ loading: false });
        //             //         window.location.href = "/advertiser";
        //             //     }
        //             // });
        //
        //         });
        //     });
        // } catch (e) {
        //     //message.error(e.message);
        //     this.setState({ isLoading: false });
        // }
    };


    handleRedirection=()=>{
        const { history } = this.props;
        if(history) history.push('/login');
    }

    handleRedirectionTM=()=>{
        const { history } = this.props;
        if(history) history.push('/signUpWithTeam');
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
                        Sign Up
                    </Typography>
                    <Typography variant={"h6"} component={"h6"} className={"auth-sub-title"}>
                        Already have an account? <span onClick={this.handleRedirection}>Log in.</span>
                    </Typography>

                    <Button                     
                    className={"signUpGoogle mt-30 mb-30"}
                    text={"Sign up with Google"}
                    disableRipple={true}
                    onClick={()=>{cookie.set("is_google",true); Auth.federatedSignIn({ provider: "Google"})}}
                    width={"160px"}><img src={Googlelogo} className={"knitLogo"}></img> Sign up with Google</Button>

                    <Typography variant={"h6"} component={"h6"} className={"or-title"}>
                        <span>OR</span>
                    </Typography> 

                    <div className={"form-group"}>
                        <Typography variant={"h6"} className={"form-label"}>Email</Typography>
                        <Input placeholder={"Enter your email"} className={this.state.emailNullError || this.state.emailError || this.state.emailCheck ? "form-input errorline" : "form-input"}
                               onChange={(text) => {this.emailValidation(text);}}>
                        </Input>
                        <Typography variant={"h6"} className={"form-label-error"}>{
                            this.state.emailNullError
                            ? "Please Enter Email"
                            : this.state.emailError
                            ? "Please enter a valid email"
                            : this.state.emailCheck
                            ? "Email already exist"
                            : false}</Typography>
                    </div> 

                    <div className={"form-group"}>
                        <Typography variant={"h6"} className={"form-label"}>Create a Password</Typography>
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
                        }}>
                        </Input>
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
                    text={"Sign up with Email"}
                    disabled={this.state.buttonDisabled}
                    width={"162px"}
                    onClick={this.handleOnSubmit}></ButtonComponent>

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

export default SignUp;
