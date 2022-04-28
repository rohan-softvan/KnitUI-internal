import React, { Component } from "react";
import {Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import AddNewProjectCard from "../../newProjectCard/NewProjectCard";
import Qualtrics from "../../../../assets/images/projects/qualtrics.png";
import Csv from "../../../../assets/images/projects/csv.png";
import Other from "../../../../assets/images/projects/other.png";


let projectDataSourceOptions1=[
    {
        text:"Qualtrics",
        value:"QUALTRICS",
        link:Qualtrics
    },
    {
        text:"CSV file",
        value:"CSV",
        link:Csv
    },
    {
        text:"1000+ other apps",
        value:"Other",
        link:Other
    }
]

let projectDataSourceOptions2=[
    {
        text:"Qualtrics",
        value:"QUALTRICS",
        link:Qualtrics
    },
    {
        text:"Upload Videos",
        value:"VIDEOS",
        link:Csv
    },
    {
        text:"1000+ other apps",
        value:"Other",
        link:Other
    }
]

class ProjectDataSourceModel extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        let {selectedDataSource, setDataSource, selectedProjectType} = this.props;
        let projectDataSourceOptions = selectedProjectType === 'QUALITATIVE' ?
                                        projectDataSourceOptions2 : projectDataSourceOptions1;
        return (
            <Grid>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Typography className={"select-Pr-ttl"}>
                            Select Data Source
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Typography className={"select-pr-sub-ttl"}>
                            Based on where your data is
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
                    {projectDataSourceOptions && projectDataSourceOptions.map((item,index)=>{
                        return(
                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                <AddNewProjectCard
                                    selectedValue={selectedDataSource}
                                    url={item.link}
                                    text={item.text}
                                    value={item.value}
                                    setValue={()=>{setDataSource(item.value)}}/>
                            </Grid>
                        )
                    })}
                </Grid>
            </Grid>
        )
    }
}


export default ProjectDataSourceModel;
