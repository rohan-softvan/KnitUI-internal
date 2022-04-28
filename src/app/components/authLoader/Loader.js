import React, { Component } from "react";
import {Grid, Typography} from "@material-ui/core";

class AuthLoader extends Component{
    render(){
        return(
            <>
            <div class="loading">
                <div class="loading_line_wrapper">
                    <div class="loading_line">
                        <div class="loading_line_inner loading_line_inner--1"></div>
                        <div class="loading_line_inner loading_line_inner--2"></div>
                    </div>
                </div>
            </div>
            </>
        )
    }    
}

export default AuthLoader;