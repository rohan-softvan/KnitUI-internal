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
import '../../css/common.scss';
import { withRouter } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { Auth,Hub } from "aws-amplify";
import message from "antd/lib/message";
import Cookies from "universal-cookie";
import { ADMIN_REDIRECT_URL } from "../../Constants";
import AuthLoader from '../../components/authLoader/Loader';
import {
    setCookie,
    getUserTypeCookie,
    removeCookie,
    getCsrfCookie
} from "../../_helpers";
import { roleEnum } from "../../enums";
import {AWS_REGION,AWS_APP_CLIENT_ID,AWS_USER_POOL_ID,COGNITO_DOMAIN_URL,GOOGLE_REDIRECT_SIGNIN_URL} from "../../../config";
import {checkEmailExist} from "../../services/CommonService";

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
const cookie = new Cookies();

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
class SignIn extends Component{
    constructor(props) {
        super(props);
        this.state = {
            emailError: false,
            emailNullError: false,
            email: "",
            passwordNullError: false,
            passwordError: false,
            password: "",
            userId:'',
            teamName:'',
            buttonDisabled:true,
            registerSuccessMessage:false,
            loading: false,
            loginError:false,
            loginErrorMessage:false,

        };
    }

    componentDidMount() {
        Hub.listen("auth", ({ payload: { event, data } }) => {
            switch (event) {
                case "signIn":
                    this.setState({ user: data });
                    break;
                case "signOut":
                    this.setState({ user: null });
                    break;
                case "customOAuthState":
                    this.setState({ customState: data });
            }
        });

      let isGoogle =  localStorage.getItem('is_google')
    //   let isGoogle= cooki
        // console.log("isGoogle.......",isGoogle)
if(isGoogle){

        Auth.currentAuthenticatedUser()
            .then(user => this.setState({ user },()=>{
                let email = user.signInUserSession.idToken.payload["email"]
                //let token = user.signInUserSession.idToken.jwtToken
                this.getUserDetailByAccessToken(email)
            }))
            .catch(() => console.log("Not signed in"));
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
                    let email = response.data.user_details.email;
                    if (response.data.user_details.is_google_user) {
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
                    }
                }
            });
        }
    };

    handleOnSubmit = async () => {
        if (this.state.email === "") {
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
        this.setState({ loading: true });
        const email = this.state.email;
        const password = this.state.password;
        try {
            await Auth.signIn(email, password).then((user) => {
                setCookie(
                    user.signInUserSession.idToken.payload["custom:user_type"],
                    user.signInUserSession.idToken.jwtToken
                );
                if (user.attributes["custom:user_type"] == "admin") {
                    this.userHasAuthenticated(true,user.attributes["custom:user_type"]);
                } else {
                    cookie.set("user_email",user.attributes["email"])
                    this.userHasAuthenticated(true,user.attributes["custom:user_type"]);
                }
            });
        } catch (e) {
            this.setState({ loading: false,loginError:true,loginErrorMessage:e.message, });
        }
    };

    userHasAuthenticated = (authenticated, userType) => {
        Auth.currentAuthenticatedUser()
            .then((user) => {
                this.setState({ isAuthenticated: true });
                if (userType === roleEnum.KNIT) {
                    this.setState({ loading: false });
                    this.props.history.push({
                        pathname: "/redirectURL",
                        state: {email: cookie.get("user_email")},
                    });
                } else if (userType == "admin") {
                    this.setState({ loading: false });
                }
                else {
                    this.setState({ loading: false });
                }
            })
            .catch((err) => {
                //console.log(err);
                //console.log("log out");
                removeCookie();
                cookie.remove("userHasAuthenticated");
            });
    };


    handleRedirection=()=>{
        const { history } = this.props;
        if(history) history.push('/signUp');
    }
    handleRedirectionFP=()=>{
        const { history } = this.props;
        if(history) history.push('/forgotPassword');
    }

    renderLogo=()=>{
        return(
            <img src={knitlogo} className={"knitLogo"}></img>
        )
    }
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({registerSuccessMessage:false,loginError:false})
        // setOpen(false);
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
            this.setState({ emailError: false, email: text });
            return false;
        } else {
            this.setState({ emailError: true, email: text });
        }

    };

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
            return false;
        } else {
            this.setState({ passwordError: true, password: text });
        }
    };
    handleGoogleLogin=()=>{

        localStorage.setItem("is_google",true);
        cookie.set("is_google",true)
        Auth.federatedSignIn({ provider: "Google"})
    }
    renderForm=()=>{
        return(
            <div className={"auth-form"}>

                <card className="auth-box">
                    <Typography variant={"h6"} component={"h6"} className={"auth-title"}>
                        Sign in
                    </Typography>
                    <Typography variant={"h6"} component={"h6"} className={"auth-sub-title mb-30"}>
                        Log in or <span onClick={this.handleRedirection}>create an account</span> to start using Knit.
                    </Typography>

                    <div className={"form-group"}>
                        <Typography variant={"h6"} className={"form-label"}>Email</Typography>
                        <Input type={"email"} className={this.state.emailNullError || this.state.emailError ? "form-input errorline" : "form-input"} onChange={(text) => {this.emailValidation(text);}}></Input>
                        <Typography variant={"h6"} className={"form-label-error"}>{
                            this.state.emailNullError
                                ? "Please enter a email"
                                : this.state.emailError
                                ? "Please enter a valid email"
                                : false}</Typography>
                    </div>

                    <div className={"form-group"}>
                        <Typography variant={"h6"} className={"form-label password-field"}>Password</Typography>
                        <Input type={"password"} className={this.state.passwordNullError || this.state.passwordError ? "form-input errorline" : "form-input"} onChange={(text) => {
                            this.passwordValidation(text);
                        }}></Input>
                        <Typography variant={"h6"} className={"forgot-pass"} onClick={this.handleRedirectionFP}>Forgot Password?</Typography>
                        <Typography variant={"h6"} className={"form-label-error"}>{
                            this.state.passwordNullError
                                ? "Please Enter Password"
                                : this.state.passwordError
                                ? "You’ve entered an incorrect password"
                                : false
                        }</Typography>
                    </div>

                    <ButtonComponent
                    className={"signupEmail"}
                    iconPosition={"center"}
                    margin={"0px"}
                    text={"Log in with Email"}
                    width={"156px"}
                    onClick={this.handleOnSubmit}></ButtonComponent>

                    <Typography variant={"h6"} component={"h6"} className={"or-title mt-20"}>
                        <span>OR</span>
                    </Typography>

                    <Button
                    className={"signUpGoogle mt-30"}
                    text={"Log in with Google"}
                    disableRipple={true}
                    onClick={()=> this.handleGoogleLogin()}
                    width={"160px"}><img src={Googlelogo} className={"knitLogo"}></img> Log in with Google</Button>
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
                <Snackbar open={this.state.registerSuccessMessage} autoHideDuration={6000} onClose={this.handleClose}>
                    <Alert onClose={this.handleClose} severity="success">
                        This is a success message!
                    </Alert>
                </Snackbar>
                <Snackbar open={this.state.loginError} autoHideDuration={5000} onClose={this.handleClose}>
                    <Alert onClose={this.handleClose} severity="error">
                            Oops, {this.state.loginErrorMessage},Please Try Again.
                    </Alert>
                </Snackbar>
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
