import React, { Component } from "react";
import {Grid, Typography} from "@material-ui/core";
import './Auth.scss';
import knitlogo from '../../../assets/images/Knit_Badge_logo.svg';
import Button from "@material-ui/core/Button";
import '../../css/common.scss';

import { Player, Controls } from '@lottiefiles/react-lottie-player';

class Error404 extends Component{
    handleRedirection=()=>{
        const { history } = this.props;
        if(history) history.push('/login');
    }
    handleRedirectionSUp=()=>{
        const { history } = this.props;
        if(history) history.push('/signUp');
    }

    renderLogo=()=>{
        return(
            <img src={knitlogo} className={"knitLogo"}></img>
        )
    }
    renderForm=()=>{
        return(
            <div className={"auth-form"}>
                <Typography variant={"h1"} component={"h1"} className={"error404"}>404</Typography>
            </div>
        )
    }
    renderGradiant=()=>{
        return(
            <Grid container spacing={1}>
                <Grid item xs={12} md={12} lg={12} sm={12}>
                    <Typography variant={"h6"} component={"h6"} className={"login-title-class"}>
                        Oops! Something went wrong.
                    </Typography>
                    
                    <Player
                    autoplay
                    loop
                    src="https://assets10.lottiefiles.com/packages/lf20_fxyybi2x.json" 
                    className={"astronaut"}
                    >
                    </Player>

                    <Typography variant={"h6"} component={"h6"} className={"error-rescued"}>
                        <span onClick={this.handleRedirectionSUp}>Click here</span> to be rescued.
                    </Typography>

                    <Button onClick={this.handleRedirection} className={"gobackhome"}>Go back home</Button>
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

export default Error404;
