import React, { Component } from "react";
import {Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import {CLOUDFRONT_URL} from "../../../Constants";

const errorMessage = {
    color: '#D14926',
    fontSize: '10px',
    marginTop: '5px'
}


class ProjectAPITokenModel extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        let {selectedToken, handleTokenChange, showTokenAPIError} = this.props;
        return (
            <Grid>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <div>
                            <Typography className={"select-Pr-ttl"}>
                                Import data from Qualtrics
                            </Typography>
                            <Typography className={"select-pr-sub-ttl"}>
                                Locate and enter your Qualtrics API Token. Read the guide.
                            </Typography>
                        </div>

                        <div>
                            <Grid container className={"mt-20"}>
                                <Grid item xs={12} md={6} sm={12} lg={6}>
                                    <Typography className={"select-pr-sub-ttl"}>API Token</Typography>
                                    <TextField
                                        id="standard-full-width"
                                        onChange={(e)=>{handleTokenChange(e,"apiToken")}}
                                        name="apiToken"
                                        className={"API-Token"}
                                        value={selectedToken}
                                    />
                                    <div style={{ ...errorMessage, display: showTokenAPIError ? 'block': 'none' }}>
                                        {'Invalid API token'}
                                    </div>
                                </Grid>
                                <Grid item xs={12} md={6} sm={12} lg={6}>
                                    <video width="100%" height="130px" controls loop autoPlay style={{background:"#000",objectFit: "fill",borderRadius: 5,border: "1px solid #E2E2E2"}}>
                                        <source src={CLOUDFRONT_URL+"public/knit/static/Qualtrics_API_Token_tutorial.mp4"} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}


export default ProjectAPITokenModel;