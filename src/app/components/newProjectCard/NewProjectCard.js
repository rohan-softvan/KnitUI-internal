import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import Color from '../../config/Color'
import { Grid , withWidth } from '@material-ui/core';
import img from'../../../assets/images/navbar/dashboard.svg'
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Popper from "@material-ui/core/Popper/Popper";
import Paper from "@material-ui/core/Paper/Paper";
import TableCell from "@material-ui/core/TableCell/TableCell";
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import "./NewProjectCard.scss"
const styles = (theme) => ({
    root: {
        minWidth: 275,
    },
});

let id = 0;
const defaultProps = {
    bgcolor: 'background.paper',
    borderColor: '#DDDDDD',
    m: 1,
    border: 1,margin:'0px',
    style: { width: '3rem', height: '3rem', marginBottom:'30%' },
};

class NewProjectCard extends Component {
    constructor(props) {
        super(props);
        this.state={
            open:false,
            rowsPerPage:5,
            anchorEl:null,
        }
    }

    handleClick = (event) => {
        this.setState({
            anchorEl:event.currentTarget,
            open:!this.state.open
        })
    };

    handleClose = () => {
        // setOpen(false);
        this.setState({open:false})
    };

    render(){

        return (
            <div>
                <Card className={this.props.selectedValue == this.props.value ? "modal-box-card-active" :"modal-box-card"} onClick={()=>{this.props.setValue(this.props.value)}}>
                    <CardContent className={"cardContent"}>

                        <Grid container>
                            <Grid item xs={12} sm={6}>
                                {/*<img src={img} width={30}/>*/}
                                {this.props.url ?
                                <img src={this.props.url} width={40} height={40} />
                            :
                            <Box borderRadius={10} {...defaultProps} />
                            }
                            
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={'dot-icon'}>

                            </Grid>

                            <Grid item xs={12} className={"mt-5-percent"}>
                                <Typography className={"mdl-small-desc mt-20"}>
                                    {this.props.text? this.props.text:""}
                                </Typography>
                            </Grid>

                        </Grid>
                    </CardContent>
                </Card>

            </div>
        );
    }

}

export default withStyles(styles)(NewProjectCard)
