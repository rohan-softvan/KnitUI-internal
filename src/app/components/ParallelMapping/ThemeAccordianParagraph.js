import React, { Component } from "react";
import { Grid,Typography } from "@material-ui/core";
import Card from '@material-ui/core/Card';
import "./ThemeAccordianParagraph.scss";
import "../../css/common.scss";

import { withStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
// import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = theme => ({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  });

class ThemeAccordianParagraph extends Component {
    render() {
        const { classes } = this.props;
        return(
            <Grid container spacing={2} className={"mt-15 mb-20"}>
                <Grid item xs={12} sm={6} md={6} lg={12}>
                    <Card>
                        <Typography className={"videotitle padd-20 no-border-radius border-tlr-none"}>
                            {this.props.data.questionNumber && this.props.data.questionNumber} {this.props.data.questionName && this.props.data.questionName}
                        </Typography>

                        <div className={classes.root}>
                            {this.props.data.questionAnswer && this.props.data.questionAnswer.map((item,index)=>{
                                return(
                                    <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header" className={"accordTitle"}>
                                        <Typography className={classes.heading}>{item}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                        {item}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                                
                                )
                            })}
                        </div>
                    </Card>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(useStyles, { withTheme: true }) (ThemeAccordianParagraph);
