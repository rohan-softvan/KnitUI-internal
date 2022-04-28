import React, {Component} from "react";
import {withStyles} from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import {Grid} from "@material-ui/core";
import "./ThemeAnalysis.scss";
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper/Paper";
import PropTypes from "prop-types";
import StatsSummaryWrapper from "../common/StatsSummaryWrapper";
import FontFamily from "../../config/FontFamily";
import Divider from '@material-ui/core/Divider';
import exportIcon from "../../../assets/images/export.svg";
import tagBelow from "../../../assets/images/themeTree/tagBelow.svg";
import {themesTagFrequencyList,themesTagFrequencyDetail} from "../../services/ThemeService";
import DragAndDropTree from "../themeTreeCard/DragAndDropThemeTree";
import Skeleton from '@material-ui/lab/Skeleton';
const styles ={

}

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 5,
        borderRadius: 5,
    },
    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
        borderRadius: 5,
        backgroundColor: '#001839',
    },
}))(LinearProgress);


function LinearProgressWithLabel(props) {
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate and buffer variants.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
};


class TagFrequencyDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            rowsPerPage: 5,
            anchorEl: null,
            value: 0,
            tagFrequencyData:[],
            isThemeAnalysisSkelSkel : false,
            themeId:'',
            projectId:''
        };
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render

       // this.setState({tagFrequencyData:nextProps.tagData,isThemeAnalysisSkelSkel:nextProps.isSkeleton})
        this.setState({projectId:nextProps.projectId,themeId:nextProps.themeId},()=>{
            this.loadTagFrequencyDetail(this.state.projectId,this.state.themeId)
        })
    }

    componentDidMount() {

        //this.loadTagFrequencyDetail(this.props.projectId,this.props.themeId)
        //this.setState({tagFrequencyData:this.props.tagData,isThemeAnalysisSkelSkel:this.props.isSkeleton})
        this.setState({projectId:this.props.projectId,themeId:this.props.themeId},()=>{
            this.loadTagFrequencyDetail(this.state.projectId,this.state.themeId)
        })
    }

    handleClick = (event) => {
        this.setState({
            anchorEl: event.currentTarget,
            open: !this.state.open,
        });
    };

    handleClose = () => {
        // setOpen(false);
        this.setState({ open: false });
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    loadTagFrequencyDetail= async (knitProjectId,themeId)=>{

        this.setState({ isThemeAnalysisSkel:true})

        themesTagFrequencyDetail(knitProjectId,themeId).then((response) => {
            if (response.data.length >0){

                if(response.data[1].tag_data.length >0){

                    this.setState({tagFrequencyData:response.data[1].tag_data, isThemeAnalysisSkel:false})
                }
            }
            this.setState({ isThemeAnalysisSkel: false})
        });

    }

    renderTagFrequencyCard=()=>{
        return(

            <StatsSummaryWrapper className={'main-card-fixed'}
                                 style={{
                                     borderRadius: "10px",
                                     // height: "43vh" ,
                                     // minHeight: "400px" ,
                                     marginTop:'2%'
                                 }}
            >

                <Grid container>
                    <Grid item xs={12} md={12}>
                        <Grid style={{padding:'20px'}}>

                            <Grid style={{float: "left"}}>
                                <Typography
                                    component={"span"}
                                    style={{
                                        fontSize: "14px",
                                        color: "#001839",
                                        textAlign: "left",
                                        fontWeight:'500'
                                    }}>
                                    Tag Frequency
                                </Typography></Grid>
                            <Grid style={{textAlign: "right"}}>
                                <Typography
                                    component={"span"}
                                    style={{
                                        fontSize: "14px",
                                        color: "#001839",
                                    }}>
                                    <img src={exportIcon} className={"icon"} style={{margin:5}}/>

                                </Typography></Grid>

                        </Grid>

                        <Divider style={{marginBottom:'20px'}}/>

                        {this.state.isThemeAnalysisSkel && (
                            <div className={'analysis-body'}>
                                <div className={"process-with-response"}>
                                    <div className={"processbar-val-show"}>
                                        <div className={"process-val"}>
                                            <Skeleton variant="text" style={{marginBottom:10,width:'100%'}} />
                                        </div>
                                        <div className={"processbar-show"}>
                                            <Skeleton variant="rect" height={13}></Skeleton>
                                        </div>
                                    </div>
                                    <div className={"like-responce-blank"}>
                                        <div className={"blank-box"}></div>
                                        <div className={"like-responce"}>
                                            <div className={"likebox"}>
                                                <Skeleton variant="text" style={{width:'150px'}} />
                                            </div>
                                            <div className={"responcebox"}>
                                                <Skeleton variant="text" style={{width:'30px'}} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={"process-with-response"}>
                                    <div className={"processbar-val-show"}>
                                        <div className={"process-val"}>
                                            <Skeleton variant="text" style={{marginBottom:10,width:'100%'}} />
                                        </div>
                                        <div className={"processbar-show"}>
                                            <Skeleton variant="rect" height={13}></Skeleton>
                                        </div>
                                    </div>
                                    <div className={"like-responce-blank"}>
                                        <div className={"blank-box"}></div>
                                        <div className={"like-responce"}>
                                            <div className={"likebox"}>
                                                <Skeleton variant="text" style={{width:'150px'}} />
                                            </div>
                                            <div className={"responcebox"}>
                                                <Skeleton variant="text" style={{width:'30px'}} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {!this.state.isThemeAnalysisSkel &&(
                            this.state.tagFrequencyData.length > 0 ?

                                this.state.tagFrequencyData.map((item, index) => {
                                    return (

                                        <Grid container style={{ padding: '0px 20px 20px 20px', marginBottom: '0px' }}>

                                            <Grid item md={12} xs={12} lg={12} sm={12}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>

                                                    <Typography
                                                        component={"span"}
                                                        style={{
                                                            fontSize: "14px",
                                                            color: "#001839",
                                                            width: "60px"
                                                        }}>
                                                        {item.tag_usage_frequency}%
                                                    </Typography>
                                                    <BorderLinearProgress variant="determinate" value={item.tag_usage_frequency} valueBuffer={item.tag_usage_frequency} style={{ width: '95%' }} />
                                                </div>
                                                <div style={{ display: 'flex' }}>
                                                    <div style={{ width: '90%', paddingLeft: '60px' }}>
                                                        <Typography
                                                            component={"span"}
                                                            style={{
                                                                fontSize: "14px",
                                                                color: "#001839",
                                                                // textAlign: "left"
                                                            }}>
                                                            {item.tag_name}
                                                        </Typography>
                                                    </div>

                                                    <Typography
                                                        component={"span"}
                                                        style={{
                                                            fontSize: "14px",
                                                            color: "#001839",
                                                            width: "10%",
                                                            textAlign: "end"
                                                        }}>
                                                        {item.tag_usage_count}
                                                    </Typography>


                                                </div>
                                            </Grid>

                                        </Grid>


                                    )
                                })
                                :''

                        )}




                    </Grid>
                </Grid>
            </StatsSummaryWrapper>



        )
    }

    renderParallelMappingCard=()=>{
        return(

            <StatsSummaryWrapper className={'main-card-fixed'}
                                 style={{
                                     borderRadius: "10px",
                                     // height: "43vh" ,
                                     // minHeight: "400px" ,
                                     marginTop:'2%'
                                 }}
            >

                <Grid container>
                    <Grid item xs={12} md={12}>
                        <Grid style={{padding:'20px'}}>

                            <Grid style={{float: "left"}}>
                                <Typography
                                    component={"span"}
                                    style={{
                                        fontSize: "14px",
                                        color: "#001839",
                                        textAlign: "left",
                                        fontWeight:'500'
                                    }}>
                                    Parallel Mapping
                                </Typography></Grid>
                            <Grid style={{textAlign: "right"}}>
                                <Typography
                                    component={"span"}
                                    style={{
                                        fontSize: "14px",
                                        color: "#001839",
                                    }}>
                                    <img src={exportIcon} className={"icon"} style={{margin:5}}/>
                                </Typography></Grid>

                        </Grid>

                        <Divider style={{marginBottom:'2%'}}/>
                        <Grid style={{padding:'5px 20px'}}>

                            <Grid style={{float: "left"}}>
                                <Typography
                                    component={"span"}
                                    style={{
                                        fontSize: "14px",
                                        color: "#001839",
                                        textAlign: "left",
                                        fontWeight:'500'
                                    }}>
                                    Q1: Do you study at the University of Virginia?
                                </Typography></Grid>
                            <Grid style={{textAlign: "right"}}>
                                <Typography
                                    component={"span"}
                                    style={{
                                        fontSize: "14px",
                                        color: "#001839",
                                    }}>
                                    <img src={exportIcon} className={"icon"} style={{margin:5}}/>
                                </Typography></Grid>

                        </Grid>
                        <Grid container style={{padding:'20px 20px 0px'}}>

                            <Grid item md={12} xs={12} lg={12} sm={12}>
                                <div style={{display:'flex',alignItems: 'center'}}>

                                    <Typography
                                        component={"span"}
                                        style={{
                                            fontSize: "14px",
                                            color: "#001839",
                                            width:"5%"
                                        }}>
                                        95%
                                    </Typography>
                                    <BorderLinearProgress variant="determinate" value={60} valueBuffer={60} style={{width:'95%'}}/>
                                </div>
                                <div style={{display:'flex'}}>
                                    <div style={{width:'90%',paddingLeft:'5%'}}>
                                        <Typography
                                            component={"span"}
                                            style={{
                                                fontSize: "14px",
                                                color: "#001839",
                                                // textAlign: "left"
                                            }}>
                                            Yes
                                        </Typography>
                                    </div>

                                    <Typography
                                        component={"span"}
                                        style={{
                                            fontSize: "14px",
                                            color: "#001839",
                                            width:"10%",
                                            textAlign:"end"
                                        }}>
                                        190
                                    </Typography>


                                </div>
                            </Grid>

                        </Grid>
                        <Grid container style={{padding:'20px'}}>

                            <Grid item md={12} xs={12} lg={12} sm={12}>
                                <div style={{display:'flex',alignItems: 'center'}}>

                                    <Typography
                                        component={"span"}
                                        style={{
                                            fontSize: "14px",
                                            color: "#001839",
                                            width:"5%"
                                        }}>
                                        9.5%
                                    </Typography>
                                    <BorderLinearProgress variant="determinate" value={35} valueBuffer={35} style={{width:'95%'}}/>
                                </div>
                                <div style={{display:'flex'}}>
                                    <div style={{width:'90%',paddingLeft:'5%'}}>
                                        <Typography
                                            component={"span"}
                                            style={{
                                                fontSize: "14px",
                                                color: "#001839",
                                                // textAlign: "left"
                                            }}>
                                            No
                                        </Typography>
                                    </div>

                                    <Typography
                                        component={"span"}
                                        style={{
                                            fontSize: "14px",
                                            color: "#001839",
                                            width:"10%",
                                            textAlign:"end"
                                        }}>
                                        10
                                    </Typography>


                                </div>
                            </Grid>

                        </Grid>

                        <Divider style={{marginBottom:'2%'}}/>
                        <Grid style={{padding:'5px 20px'}}>

                            <Grid style={{float: "left"}}>
                                <Typography
                                    component={"span"}
                                    style={{
                                        fontSize: "14px",
                                        color: "#001839",
                                        textAlign: "left",
                                        fontWeight:'500'
                                    }}>
                                    Q1: Do you study at the University of Virginia?
                                </Typography></Grid>
                            <Grid style={{textAlign: "right"}}>
                                <Typography
                                    component={"span"}
                                    style={{
                                        fontSize: "14px",
                                        color: "#001839",
                                    }}>
                                    <img src={exportIcon} className={"icon"} style={{margin:5}}/>
                                </Typography></Grid>

                        </Grid>
                        <Grid container style={{padding:'20px 20px 0px'}}>

                            <Grid item md={12} xs={12} lg={12} sm={12}>
                                <div style={{display:'flex',alignItems: 'center'}}>

                                    <Typography
                                        component={"span"}
                                        style={{
                                            fontSize: "14px",
                                            color: "#001839",
                                            width:"5%"
                                        }}>
                                        95%
                                    </Typography>
                                    <BorderLinearProgress variant="determinate" value={60} valueBuffer={60} style={{width:'95%'}}/>
                                </div>
                                <div style={{display:'flex'}}>
                                    <div style={{width:'90%',paddingLeft:'5%'}}>
                                        <Typography
                                            component={"span"}
                                            style={{
                                                fontSize: "14px",
                                                color: "#001839",
                                                // textAlign: "left"
                                            }}>
                                            Yes
                                        </Typography>
                                    </div>

                                    <Typography
                                        component={"span"}
                                        style={{
                                            fontSize: "14px",
                                            color: "#001839",
                                            width:"10%",
                                            textAlign:"end"
                                        }}>
                                        190
                                    </Typography>


                                </div>
                            </Grid>

                        </Grid>
                        <Grid container style={{padding:'20px', marginBottom:'2%'}}>

                            <Grid item md={12} xs={12} lg={12} sm={12}>
                                <div style={{display:'flex',alignItems: 'center'}}>

                                    <Typography
                                        component={"span"}
                                        style={{
                                            fontSize: "14px",
                                            color: "#001839",
                                            width:"5%"
                                        }}>
                                        9.5%
                                    </Typography>
                                    <BorderLinearProgress variant="determinate" value={35} valueBuffer={35} style={{width:'95%'}}/>
                                </div>
                                <div style={{display:'flex'}}>
                                    <div style={{width:'90%',paddingLeft:'5%'}}>
                                        <Typography
                                            component={"span"}
                                            style={{
                                                fontSize: "14px",
                                                color: "#001839",
                                                // textAlign: "left"
                                            }}>
                                            No
                                        </Typography>
                                    </div>

                                    <Typography
                                        component={"span"}
                                        style={{
                                            fontSize: "14px",
                                            color: "#001839",
                                            width:"10%",
                                            textAlign:"end"
                                        }}>
                                        10
                                    </Typography>


                                </div>
                            </Grid>

                        </Grid>




                    </Grid>
                </Grid>
            </StatsSummaryWrapper>



        )
    }


    render() {

        let classes = styles;
        return (
            <div>
                {/*<Card className={'card-height-width'}>*/}
                {/*    <CardContent>*/}
                {/*        <Grid container>*/}
                {/*            <Grid item xs={12} style={{ }}>*/}
                {/*                                                    <BorderLinearProgress variant="determinate" value={60} valueBuffer={60} />*/}
                {/*            </Grid>*/}
                {/*        </Grid>*/}
                {/*    </CardContent>*/}
                {/*</Card>*/}

                {this.renderTagFrequencyCard()}
                {this.renderParallelMappingCard()}

            </div>
        );
    }
}

export default withStyles(styles)(TagFrequencyDetail);
