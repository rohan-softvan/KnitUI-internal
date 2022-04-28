import React, { Component } from "react";
import {Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";


class ProjectNameModel extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        let {handleProjectName } = this.props;
        return (
            <Grid>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Typography className={"select-Pr-ttl"}>
                            Name Your Project
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField
                            id="standard-full-width"
                            placeholder="Type here..."
                            fullWidth
                            onChange={(e)=>{handleProjectName(e,"projectName")}}
                            name={"projectName"}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}


export default ProjectNameModel;