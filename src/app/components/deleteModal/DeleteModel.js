import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { Grid, withWidth } from "@material-ui/core";
import ButtonComponent from "../../components/button/Button";
import './DeleteModel.scss'

const modalStyle = {
    modalLabel: {
      color: "#001839",
      fontSize: 14,
      fontWeight: "500",
    },
    modaltext:{
      color: "#001839",
      fontSize: 14,
      fontWeight: "300",
    },
    memberInput: {
      marginTop: "10px",
    },
    mainDiv: {
      display: "flex",
      justifyContent: "flex-end",
    },
  };
  
const styles = []

const DialogTitle = withStyles(theme => ({
    root: {
        //borderBottom: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing.unit * 2,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing.unit,
        top: '3px',
        color: '#001839',
    },
}))(props => {
    const { children, classes, onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon className={"close-icon"} />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});
const DialogContent = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing.unit * 2,
    },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
    root: {
        //borderTop: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing.unit,
    },
}))(MuiDialogActions);

class DeleteModal extends Component {

    render() {
        let classes = modalStyle;
        return (
            <div>
                <Dialog fullWidth open={this.props.open} maxWidth={"sm"} className="deletemodel" onClose={()=>{this.props.onHandleClose()}}>
                    <DialogTitle onClose={()=>{this.props.onHandleClose()}}>
                        <Typography style={classes.modalLabel}>
                            Confirm deletion
                        </Typography>
                    </DialogTitle>
                    <DialogContent dividers className={""}>
                        <Typography style={classes.modaltext}>{this.props.description}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Grid container>
                            <Grid
                                item
                                xs={12}
                                md={12}
                                lg={12}
                                sm={12}
                                style={classes.mainDiv}
                            >
                                <Button className="cancelbtn" onClick={()=>{this.props.onHandleClose()}}>
                                    Cancel
                                </Button>
                                <ButtonComponent                                    
                                    text={"Delete"}
                                    width={90}
                                    className={"deletebtnmodel"}
                                    onClick={()=>{this.props.onHandleRemove()}}
                                />
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }


}

export default withStyles(styles)(DeleteModal);