import React, { Component } from "react";
import {Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";


class ProjectSurveyModel extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        let {selectedQualtrics, handleQualtrics, menu} = this.props;
        return (
            <Grid>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12}>

                        <div>
                            <Typography className={"select-Pr-ttl"}>
                                Select your Qualtrics Project
                            </Typography>
                            <Typography className={"select-pr-sub-ttl"}>
                                Choose the Qualtrics project you want to import data from.
                            </Typography>
                        </div>

                        <div>
                            <Grid container className={"mt-30"}>
                                <Grid item xs={12} md={12} sm={12} lg={12}>
                                    <Autocomplete
                                        onChange={(event, value) => handleQualtrics(event,value)}
                                        id="combo-box-demo"
                                        value={selectedQualtrics}
                                        options={menu}
                                        getOptionLabel={(option) => option.title}
                                        renderInput={(params) => <TextField {...params}  variant="outlined" />}
                                    />
                                </Grid>

                            </Grid>

                        </div>
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}


export default ProjectSurveyModel;