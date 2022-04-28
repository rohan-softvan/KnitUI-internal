import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import ButtonComponent from "../../components/button/Button";
import AddMemberTableModal from "./AddMemberTableModal"
import AddIcon from '@material-ui/icons/Add';
import { Grid , withWidth } from '@material-ui/core';
import Color from '../../config/Color';

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
        borderRadius: 10
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        color: Color.primary,
        top:3
    },
   
});
const modalStyle={
    modalLabel:{
        color:"#001839",
        fontSize: 14,
        fontWeight: "bold"
    },
    memberInput:{
        marginTop:"10px"
    },
    mainDiv:{
        display:"flex",
        justifyContent:"flex-end"
    }
}

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                   <CloseIcon className={"close-icon"} />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

class AddMembersModal extends Component {
    constructor(props) {
        super(props);
        this.state={
            open:false,
            rowsPerPage:5,
            
        }
      }

    handleClickOpen = () => {
        this.setState({open:true})
    };
    
    handleClose = () => {
        // setOpen(false);
        this.setState({open:false})
    };

    render(){
        let classes=modalStyle;
        return (
            <div>
                 {this.props.width === "xs"  ?
                   <ButtonComponent
                   icon={<AddIcon />}
                   iconPosition={"left"}
                   fontSize={13}
                   width={"120px"}
                   margin={"0px"}
                   text={"Add Member"}
                   onClick={this.handleClickOpen}></ButtonComponent>
                   :
                  <ButtonComponent
                  icon={<AddIcon />}
                  iconPosition={"left"}
                  margin={"0px"}
                  text={"Add Member"}
                  width={"150px"}
                  onClick={this.handleClickOpen}></ButtonComponent>
                  }
                <Dialog onClose={this.handleClose} open={this.state.open} fullWidth maxWidth="sm">
                    <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
                        <Typography style={classes.modalLabel}>
                        Add Members
                        </Typography>
                    </DialogTitle>
                    <DialogContent dividers style={{overflow: "hidden",padding: 20,display: "flex",justifyContent: "center"}} >
                        <Grid container style={{minHeight: 80,height: 100,maxHeight: 25,margin:'-18px'}} spacing={2}> 
                            <Grid item xs={12} md={10} lg={10} sm={10}>
                                    <TextField id="outlined-basic" label="Add member's email address..." size={'small'}  style={classes.memberInput} fullWidth variant="outlined" />
                            </Grid>
                            <Grid item xs={12} md={2} lg={2} sm={2}  style={classes.mainDiv}>
                                <ButtonComponent margin={"12px 0px 0px 0px"} text={"Add"} width={90}/>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogContent dividers>
                            <AddMemberTableModal/>
                    </DialogContent>
                    <DialogActions>
                        <Grid container>
                            <Grid item xs={12} md={12} lg={12} sm={12} style={classes.mainDiv}>
                                <ButtonComponent
                                text={"Done"}
                                width={90} />
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
   
}

export default withStyles(styles)(AddMembersModal)
