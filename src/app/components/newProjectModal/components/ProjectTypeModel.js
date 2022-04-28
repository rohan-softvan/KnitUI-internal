import React, { Component } from "react";
import {Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import AddNewProjectCard from "../../newProjectCard/NewProjectCard";

let projectTypeOptions=[
    {
        text:"Quantitative",
        value:"QUANTITATIVE",
    },
    {
        text:"Qualitative",
        value:"QUALITATIVE",
    },
    {
        text:"Quantitative & Qualitative",
        value:"BOTH",
    }
]


class ProjectTypeModel extends Component{
    constructor(props) {
        super(props);

    }
    render() {
        let {selectedProjectType, setProjectType} = this.props;
        return (
            <Grid>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Typography className={"select-Pr-ttl"}>
                            Select Your Project Type
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Typography className={"select-pr-sub-ttl"}>
                            Based on the data you have
                        </Typography>
                    </Grid>
                </Grid>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                    spacing={3}
                    className="cardTextSpace"
                >
                    {projectTypeOptions && projectTypeOptions.map((item,index)=>{
                        return(
                            <Grid item xs={12} sm={4} md={4} lg={4} key={index}>
                                <AddNewProjectCard
                                    selectedValue={selectedProjectType}
                                    text={item.text} value={item.value}
                                    setValue={()=>setProjectType(item.value)}
                                />
                            </Grid>
                        )
                    })}
                </Grid>
            </Grid>
        )
    }
    
}


export default ProjectTypeModel;
