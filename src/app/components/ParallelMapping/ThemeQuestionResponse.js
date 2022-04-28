import React, {Component} from "react";
import { Grid,Typography } from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import Box from "@material-ui/core/Box";
import LinearProgress from '@material-ui/core/LinearProgress';
import PropTypes from "prop-types";
import "./ThemeQuestionResponse.scss"
import "../../css/common.scss";
import exportIcon from "../../../assets/images/export.svg";

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

class ThemeQuestionResponse extends Component {
    render() {
        return (
            <Card className={"padd-20 border-tlr-none"}>
                <Grid item xs={12} sm={6} md={6} lg={12}>                    
                    {/*<Typography className={"videotitle mb-20"}>                        */}
                    {/*   {this.props.data.questionNumber && this.props.data.questionNumber} {this.props.data.questionText && this.props.data.questionText}*/}
                    {/*</Typography>*/}

                    <Grid className={"videotitle mb-20"}>

                        <Grid style={{float: "left"}}>
                            <Typography
                                component={"span"}
                                style={{
                                    fontSize: "14px",
                                    color: "#001839",
                                    textAlign: "left",
                                    fontWeight:'500'
                                }}>
                                {this.props.data.questionNumber && this.props.data.questionNumber} {this.props.data.questionText && this.props.data.questionText}
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




                </Grid>
                <Grid item md={12} xs={12} lg={12} sm={12}>                
                {this.props.data.questionChoice && this.props.data.questionChoice.map((item, index) => {
                    return(
                        <>                        
                            <div style={{display:'flex',alignItems: 'center'}}>
                                <Typography
                                    component={"span"}
                                    style={{
                                        fontSize: "14px",
                                        color: "#001839",
                                        width:"60px"
                                    }}>
                                    {item.percentage ? item.percentage : 0}%
                                </Typography>
                                <BorderLinearProgress variant="determinate" value={item.percentage ? item.percentage : 0} valueBuffer={item.percentage} style={{width:'96%'}}/>
                            </div>
                            <div style={{display:'flex'}}>
                                <div style={{width:'90%',paddingLeft:'60px'}}>
                                    <Typography
                                        component={"span"}
                                        style={{
                                            fontSize: "14px",
                                            color: "#001839",
                                            // textAlign: "left"
                                        }}>
                                        {item.choiceText ? item.choiceText  : ""}
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
                                    {item.total ? item.total : 0} responses
                                </Typography>
                            </div>
                        </>
                                    
                    )
                })
                }
                </Grid> 
                 
            </Card>
        )
    }
}

export default withStyles(styles)(ThemeQuestionResponse);
