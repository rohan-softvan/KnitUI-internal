import React , {useEffect} from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import Typography from "@material-ui/core/Typography";
import MailIcon from "@material-ui/icons/Mail";
import DeleteIcon from "@material-ui/icons/Delete";
import Label from "@material-ui/icons/Label";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import InfoIcon from "@material-ui/icons/Info";
import ForumIcon from "@material-ui/icons/Forum";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import AddIcon from "@material-ui/icons/Add";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import "./Treeview.scss";
let lightgreen;
const useTreeItemStyles = makeStyles((theme,props) => (
 {
  root: {
    backgroundColor: "#FFF",
    // color: theme.palette.text.secondary,
    "&:hover": {
      backgroundColor:"#FFF"
    },
    // "&:focus > $content, &$selected > $content": {
    //   backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
    //   color: "var(--tree-view-color)"
    // },
    // "&:focus > $content $label, &:hover > $content $label, &$selected > $content $label": {
    //   backgroundColor: "transparent"
    // }
  },
  "@global": {
    ".MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label": {
      backgroundColor: "white"
    },
    ".MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label:hover, .MuiTreeItem-root.Mui-selected:focus > .MuiTreeItem-content .MuiTreeItem-label": {
      backgroundColor: "#fff"
    }
  },
  content: {
    borderLeft: props => `3px solid `+ props.borderColor,
    flexDirection: "row-reverse",
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    //paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    "$expanded > &": {
      fontWeight: theme.typography.fontWeightRegular
    }
  },
  group: {
    marginLeft: 0,
    "& $content": {
      paddingLeft: 0,
      //borderLeft: props => `3px solid `+ props.borderColor,
    },
    paddingLeft: 16,
    marginTop:10,
    marginBottom:10
  },
  expanded: {},
  selected: {},
  label: {
    fontWeight: "400",
    color: "#001839",  
    fontSize:14,
    paddingLeft:"0px"
  },
  labelRoot: {
    display: "flex",
    alignItems: "center",
    padding:"10px 0px"
  },
  labelIcon: {
    marginRight: 10,
    marginLeft:10,
    width:15,
    height:15,
    color:'rgb(0 24 57 / 30%)',
    "&:hover": {
        color: props => props.borderColor,
    },
  },
  labelText: {
    fontWeight: "inherit",
    //backgroundColor: "green",
    flexGrow: 1,
    fontSize:14,  
    fontFamily:'Rubik', 
  },
  labelBoldText: {
    fontWeight: 500,
    //backgroundColor: "green",
    flexGrow: 1,
    fontSize:14, 
    fontFamily:'Rubik', 
  }
}));

function StyledTreeItem(props) {
  const classes = useTreeItemStyles(props);
  const {
    labelText,
    labelIcon: LabelIcon,
    labelInfo,
    color,
    bgColor,
    weight,
    ...other
  } = props;
  // console.log("weight==>",props)
  return (
    <TreeItem 
      label={
        <div className={classes.labelRoot}>
          <LabelIcon color="inherit" className={classes.labelIcon} />
          {weight ?
            <Typography variant="body2" className={classes.labelBoldText}>
            {labelText}
          </Typography>
          :
          <Typography variant="body2" className={classes.labelText}>
          {labelText}
        </Typography>
          }
        
          {/* <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography> */}
        </div>
      }
      style={{
        "--tree-view-color": color,
        "--tree-view-bg-color": bgColor
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        selected: classes.selected,
        group: classes.group,
        label: classes.label
      }}
      {...other}
    />
  );
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired
};

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    maxWidth: 400
  }
});

export default function GmailTreeView(props) {
  lightgreen = props.data.color;
  const classes = useStyles(props);
  useEffect(() => {  
    lightgreen = props.data.color;
    // console.log("props.data===>",props.data)
    // console.log("props.data.color===>",props.data.color)
     });

const subTree=(data)=>{
    return(
        data.children &&
        data.children.map((item,index)=>{
            return(
                <StyledTreeItem
                    nodeId={item.id}
                    labelText={item.name}
                    labelIcon={AddIcon}
                    color="#1a73e8"
                    bgColor="#e8f0fe"
                    borderColor={props.color}
                >
                    {item.children && subTree(item)}
                </StyledTreeItem>
            )
        })
        
    )
}
  return (
    <div style={{ display: "flex", color: lightgreen}}>
      <FiberManualRecordIcon style={{width:15,height:40}} />
      <TreeView
            className={classes.root}
            defaultExpanded={["3"]}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            // defaultEndIcon={<AddIcon />}
        >
        {props.data && props.data.name 
            && 
            <StyledTreeItem nodeId={props.data.id} labelText={props.data.name} labelIcon={AddIcon} weight={true}>
               {subTree(props.data)}
            </StyledTreeItem>
            }
        {/* <StyledTreeItem nodeId="3" labelText="Theme title is here" labelIcon={AddIcon}   weight={true}>
            <StyledTreeItem
            nodeId="5"
            labelText="Subtheme title 1"
            labelIcon={AddIcon}
            color="#1a73e8"
            bgColor="#e8f0fe"
          >
            <StyledTreeItem
              nodeId="6"
              labelText="Tag 1"
              labelIcon={AddIcon}
              color="#e3742f"
              bgColor="#fcefe3"
            />
            <StyledTreeItem
              nodeId="9"
              labelText="Tag 2"
              labelIcon={AddIcon}
              color="#e3742f"
              bgColor="#fcefe3"
            />
          </StyledTreeItem>
          <StyledTreeItem
            nodeId="7"
            labelText="Subtheme title 2"
            labelIcon={AddIcon}
            color="#a250f5"
            bgColor="#f3e8fd"
            >
            <StyledTreeItem
              nodeId="10"
              labelText="Tag 1"
              labelIcon={AddIcon}
              color="#e3742f"
              bgColor="#fcefe3"
            />
            <StyledTreeItem
              nodeId="11"
              labelText="Tag 2"
              labelIcon={AddIcon}
              color="#e3742f"
              bgColor="#fcefe3"
            />
        </StyledTreeItem>          
            <StyledTreeItem
            nodeId="8"
            labelText="Subtheme title 3"
            labelIcon={AddIcon}
            color="#3c8039"
            bgColor="#e6f4ea"
          >
              <StyledTreeItem
              nodeId="10"
              labelText="Tag 1"
              labelIcon={AddIcon}
              color="#e3742f"
              bgColor="#fcefe3"
            />
            <StyledTreeItem
              nodeId="11"
              labelText="Tag 2"
              labelIcon={AddIcon}
              color="#e3742f"
              bgColor="#fcefe3"
            />
        </StyledTreeItem>
        </StyledTreeItem>
         */}
      </TreeView>
    </div>
  );
}
