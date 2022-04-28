import React, { Component } from "react";
import {Grid, Typography} from "@material-ui/core";
import './Auth.scss';
import knitlogo from '../../../assets/images/Knit_Badge_logo.svg';
import Button from "@material-ui/core/Button";
import '../../css/common.scss';
import BrokenLink from '../../../assets/images/brokenlink.svg'

import { Player, Controls } from '@lottiefiles/react-lottie-player';

class ErrorVerificationLinkUsed extends Component{
    handleRedirection=()=>{
        const { history } = this.props;
        if(history) history.push('/login');
    }

    renderLogo=()=>{
        return(
            <img src={knitlogo} className={"knitLogo"}></img>
        )
    }
    renderForm=()=>{
        return(
            <div className={"auth-form"}>               
                <img src={BrokenLink} className={"brokenLink"}></img>
            </div>
        )
    }
    renderGradiant=()=>{
        return(
            <Grid container spacing={1}>
                <Grid item xs={12} md={12} lg={12} sm={12}>
                    <Typography variant={"h6"} component={"h6"} className={"login-title-class errorpage-title"}>
                        The verification link you clicked has already been used.
                    </Typography>

                    <Player
                    autoplay
                    loop
                    src="https://assets8.lottiefiles.com/packages/lf20_whywhzqw.json" 
                    className={"cat-link-broken"}
                    >
                    </Player>

                    <Typography variant={"h6"} component={"h6"} className={"error-rescued"}>
                        <span onClick={this.handleRedirection}>Click here</span> to go back to login
                    </Typography>

                    <Button onClick={this.handleRedirection} className={"gobackhome"}>Back to Login</Button>
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

export default ErrorVerificationLinkUsed;
