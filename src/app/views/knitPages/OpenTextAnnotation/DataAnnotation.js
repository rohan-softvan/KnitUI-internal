import React, { Component, createElement } from "react";
import Cookies from "universal-cookie";
import { CSVLink } from "react-csv/lib";
import { Grid, Typography } from "@material-ui/core";
import withWidth from "@material-ui/core/withWidth";
import "../../../css/common.scss";
import SelectComponent from "../../../components/select/Select";
import BackArrow from "../../../../assets/images/project-details/BackArrow.svg";
import "./DataAnnotation.scss"
import {
    dataActionDropdown,
} from "../../../services/DataService";
import AutoCompleteWidget from "../../../components/autoCompleteWidget/AutoCompleteWidget";
import ChipText from "../../../components/common/ChipText";
import PageWrapper from "../../PageWrapper/PageWrapper";
import AuthLoader from "../../../components/authLoader/Loader";
import { withRouter } from "react-router-dom";
import { defineCustomElements } from "@revolist/revogrid/loader"; // webcomponent definition loader
import { RevoGrid } from "@revolist/revogrid-react";
import AnnotationCardMenu from "../../../components/annotationCardMenu/AnnotationFunctional";
import appThemeColor from "../../../config/ThemeColorConfig";
import {getCombineThemeColor} from "../../../config/ThemeColorConfig";
import DeleteModel from "../../../components/deleteModal/DeleteModel"
import {
    tagUsageDeleteAction, getThemeDetails,
    insertTag
} from "../../../services/VideoService"
import '../../../components/annotationMenu/AnnotationMenu.scss'
import { fetchTableData, openTextSearchData ,tagDeletion } from "../../../services/OpenTextResponses"
import CloseIcon from "../../../../assets/images/close.svg";
import InfoIcon from '@material-ui/icons/Info';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import { Skeleton } from "@material-ui/lab";

const cookie = new Cookies();

const styles = {
    annotationAlert: {
        backgroundColor: "#001839",
        color: "white"
    }
}

let menu = [
    {
        title: "Annotate",
        value: "is_annotate",
        key: 1,
    },
    {
        title: "Export as CSV",
        value: "export_csv",
        key: 2,
    },
    {
        title: "Delete",
        value: "is_deleted",
        key: 3,
    },
];

function goBack() {
    window.history.back()
    var newHash = window.location.hash;
  }

function addZero(data) {
    if (data < 10) {
        data = "0" + data
    }
    return data;
}

const formattedCSVFileDate = () => {
    let dateObj = new Date();
    let month = addZero(dateObj.getMonth() + 1);
    let date = addZero(dateObj.getDate());
    let hours = addZero(dateObj.getHours());
    let minutes = addZero(dateObj.getMinutes());
    return month + "-" + date + "-" + hours + minutes;
}


const getFormattedCSVFileName = (projectTitle) => {
    let formattedProjectTitle = projectTitle ? projectTitle.split(' ').join('_') : "";
    let formattedDate = formattedCSVFileDate();
    return formattedProjectTitle + "_" + formattedDate
}

function getQueryStringValue() {
    return window.location.href.split('/')[5];
}

// let revoColumns = [];
// let revoSource = [];
let isSelectAll = false;
let selectedIdList=[]
class DataAnnotation extends Component {
    constructor(props) {
        super(props);
        defineCustomElements();
        this.state = {
            themeTreeData: {},
            revoColumns: [],
            revoSource: [],
            showAction: true,
            selectedIdList: [],
            csvDetailsData: [],
            highlights: [],
            showAnnotationCard: false,
            isRange: false,
            userId:'',
            questionName:'',
            isCheckbox:false,
            selectionResponse:{},
            totalResponseCount:0,
            newlistResult:{},
            questionOrder:'',
            tagOrder:'',
            searchFlag:false,
            selectRowIndex:-1,
            selectedRowIndexList:[],
            copiedList:[],
            isDownPressed:false,
            isUpPressed :false,
            focusedRowIndex:'',
            clickSelection:false,
            isKeyPressed:false,
            newRevoSource:[],
            ishighlightColorReload:true,
            // highlightText:false
        };
        this.responseLink = React.createRef();
    }

    componentDidMount() {
        if(cookie.get('user_Id')){
            this.setState({userId:cookie.get('user_Id')})
        }
        document.addEventListener('click', this.handleOutsideClick);
        let projectId = getQueryStringValue()
        this.setState({ projectTitle: localStorage.getItem('projectTitle'), projectId: projectId }, () => {
            this.getOpenTextTableData();
            this.getAllThemeDetails()
        });
        let projectTitle;
        projectTitle = 'projectTitle' in this.props ? this.props.projectTitle : ""
        let selected = []
        this.setState({ selected })         
    }

    // componentWillUnmount(){
    //     this.setState({revoColumns:[],revoSource:[]})
    // }

    // Return true if theme has subTheme otherwise it retuns false
    checkThemeChild = (data) => {
        if (Array.isArray(data.children) && data.children.length > 0) {
            return true;
        }
        return false;
    }

    // Return true if theme has Tag otherwise it retuns false
    checkThemeTag = (data) => {
        if (Array.isArray(data.tags) && data.tags.length > 0) {
            return true;
        }
        return false;
    }

    generateMainThemeList = (childList, rootThemeList) => {
        // let {mainThemeList}= this.state;
        rootThemeList['root'] = {
            index: 'root',
            hasChildren: true,
            children: this.state.parentKeys,
            data: 'Root item',
            type: "theme",
        }

    }

    setDataForTheme = (data) => {
        let { mainThemeList } = this.state;
        mainThemeList.push(data);
    }

    //Generate tags Child Node
    generateChildTags = (childList, path, parentId) => {
        let { mainThemeList, parentKeys } = this.state;
        let newChidList = {};
        let mainNewList = {}
        // let new/PathName='';
        // childList=this.getTagNameFromSubTheme(childLis)
        if (childList.tags) {
            for (let i in childList.tags) {
                let newPathName = path
                let keyName = childList.tags[i]._id

                newChidList = {
                    index: childList.tags[i]._id,
                    hasChildren: false,
                    canMove: true,
                    level: childList.tags[i].level,
                    sequence: childList.sequence,
                    data: childList.tags[i].title,
                    color: appThemeColor(childList.sequence + 1, childList.tags[i].level),
                    type: "TAG",
                    isPopper: false,
                    path: path,
                    parentId: parentId,
                    id: childList.tags[i]._id
                }
                mainThemeList[keyName] = newChidList
            }
        } else {
            this.generateChildTags(childList.children, path, parentId)
        }
    }

    //Generate Sub Theme Child Node
    generateChildSubTheme = (childList, path, parentId) => {
        let { mainThemeList, parentKeys } = this.state;
        let newPath;
        if (path != '') {
            newPath = path + childList.title + ' > '
        } else {
            newPath = childList.title + ' > '
        }
        let newChidList = {};
        let mainNewList = {}
        if (Array.isArray(childList.children) && childList.children.length > 0) {
            for (let i in childList.children) {

                let keyName = childList._id

                newChidList = {
                    index: childList._id,
                    hasChildren: this.checkThemeChild(childList) || this.checkThemeTag(childList),
                    children: this.getTagNameFromSubTheme(childList),
                    level: childList.level,
                    sequence: childList.sequence,
                    data: childList.title,
                    canMove: true,
                    color: appThemeColor(childList.sequence + 1, childList.level),
                    type: childList.type,
                    isPopper: false,
                    path: newPath,
                    parentId: parentId,
                    id: childList._id
                }
                if (Array.isArray(childList.tags) && childList.tags.length > 0) {
                    this.generateChildTags(childList, newPath, childList._id);
                }
                mainThemeList[keyName] = newChidList
                this.generateChild(childList.children[i], newPath, childList._id)

            }
        } else {
            newChidList = {
                index: childList._id,
                hasChildren: this.checkThemeChild(childList) || this.checkThemeTag(childList),
                level: childList.level,
                sequence: childList.sequence,
                children: this.getTagNameFromSubTheme(childList),
                data: childList.title,
                type: childList.type,
                canMove: true,
                color: appThemeColor(childList.sequence + 1, childList.level),
                isPopper: false,
                path: newPath,
                parentId: parentId,
                id: childList._id
            }
            mainThemeList[childList._id] = newChidList
            if (Array.isArray(childList.tags) && childList.tags.length > 0) {
                this.generateChildTags(childList, newPath, childList._id);
            }
        }
    }


    //generate multiple level Child Nodes
    generateChild = (childList, path, parentId) => {
        this.generateChildSubTheme(childList, path, parentId)
    }

    //get All Tag Name
    getTagNameFromSubTheme = (childList) => {
        let childTagList = [];
        if (childList.tags) {
            for (let i in childList.tags) {
                childTagList.push(childList.tags[i]._id)
            }
        }
        if (childList.children) {
            for (let i in childList.children) {
                childTagList.push(childList.children[i]._id)
            }
        }
        return childTagList;
    }


    
    //get All Theme Details
    getAllThemeDetails = () => {
        this.setState({
            mainThemeList: {},
            parentKeys: []
        })
        getThemeDetails(this.state.projectId).then((response) => {
            if (response.data && response.data.length > 0) {
                let { mainThemeList, parentKeys } = this.state;
                let themeTreeData = {}
                let child = [];
                for (let i in response.data) {
                    if (this.checkThemeChild(response.data[i])) {
                        parentKeys.push(response.data[i]._id)
                        this.generateChild(response.data[i], '', response.data[i]._id)
                    } else {
                        let childList = []
                        if (this.checkThemeTag(response.data[i])) {
                            childList = this.getTagNameFromSubTheme(response.data[i])
                            this.generateChildTags(response.data[i], response.data[i].title + ' > ', response.data[i]._id)
                        }
                        let themeList = {
                            index: response.data[i]._id,
                            hasChildren: this.checkThemeChild(response.data[i]) || this.checkThemeTag(response.data[i]),
                            level: response.data[i].level,
                            children: childList,
                            canMove: true,
                            sequence: response.data[i].sequence,
                            data: response.data[i].title,
                            type: response.data[i].type,
                            id: response.data[i]._id,
                            parentId: response.data[i]._id,
                            isPopper: false,
                            color: appThemeColor(response.data[i].sequence + 1, response.data[i].level),
                            path: response.data[i].title + "  >  "
                        }
                        var keyName = response.data[i]._id;
                        mainThemeList[keyName] = themeList;
                        parentKeys.push(keyName)
                    }
                }
                this.generateMainThemeList(parentKeys, mainThemeList)
                themeTreeData = mainThemeList;
                this.setState({ themeTreeData })
            }
        })
    }

    setAnswerJson = (data) => {
        let answerList = [];
        for (let j = 0; j < data.length; j++) {
            if (JSON.stringify(data[j]) != '{}') {
                if (data[j].question_answer != "") {
                    answerList.push({
                        questionId: data[j].question_id,
                        questionAnswer: data[j].question_answer,
                        questionType: data[j].question_type ? data[j].question_type.type : "",
                        questionSelector: data[j].question_type ? data[j].question_type.selector : "",
                        originalVideoDuration: data[j].original_video_duration,
                        videoThumbnailUrl: data[j].video_thumbnail_url
                    });
                } else {
                    answerList.push({
                        questionId: data[j].question_id,
                        questionAnswer: "-",
                        questionType: data[j].question_type.type,
                        originalVideoDuration: data[j].original_video_duration,
                        videoThumbnailUrl: data[j].video_thumbnail_url

                    });
                }
            } else {
                answerList.push({
                    questionId: "-",
                    questionAnswer: "-",
                    questionType: "-",
                    originalVideoDuration: "-",
                    videoThumbnailUrl: "-",

                });
            }

            // break;
        }
        return answerList;
    };

    getTagDetailsMap = (details) => {
        let detailsofTags = [];
        for (let i in details) {
            detailsofTags.push(details[i].name)
        }
        return detailsofTags
    }

    getCSVOpenText = (projectId) => {
        let csvDetailsData = [];
        let { selectedIdListRow } = this.state;
        let mainData = []
        let header = []

        header.push(this.state.revoColumns[1].name, "Tags")
        mainData.push(header)
        let insertedId=[]
        for (let j in this.state.selectedIdList) {
            csvDetailsData = []
            for (let i in this.state.revoSource) {
                if (this.state.selectedIdList[j] === this.state.revoSource[i].id && !insertedId.includes(this.state.revoSource[i].id)) {
                    insertedId.push(this.state.selectedIdList[j])
                    csvDetailsData.push(this.state.revoSource[i].transcript, this.getTagDetailsMap(this.state.revoSource[i].details))
                }
                // mainData.push(csvDetailsData)
            }
            mainData.push(csvDetailsData)
        }
        // mainData = [header, ...mainData];
        let outerThis = this;
        this.setState({ mainData }, () => {
            setTimeout(() => {
                outerThis.responseLink.link.click();
                outerThis.setState({ loading: false })
            }, 3000);
        })
        this.setState({selectedRowIndexList: [],selectedIdList:[] },()=>{
            this.handleRefreshData(this.state.revoSource,this.state.questionName)
        })
    }

    deteleOpenTextData = (projectId) => {
        let newList = []
        let insertedId=[]
        
        for(let i in this.state.selectedIdList){
            for (let j in this.state.revoSource) {
                if(!insertedId.includes(this.state.revoSource[i].id) && this.state.revoSource[j].id == this.state.selectedIdList[i]){
                    insertedId.push(this.state.revoSource[j].id)
                    newList.push(this.state.revoSource[j].featureId)            
                }
            }
        }

        let user_data = {
            knit_qualtric_resp_id_list: newList,
            is_deleted: true,
        };
        dataActionDropdown(user_data).then((response) => {
            if (response.status_code == 200 && response.success == true) {
                let newUpdatedList = []
                for (let i in this.state.revoSource) {        
                    for(let j in this.state.selectedIdList){
                        newUpdatedList=this.state.revoSource.filter(el=> el.id != this.state.selectedIdList[j])                
                    }     
                } 
                this.setState({revoSource:newUpdatedList, selectedIdList: [] , selectedRowIndexList:[],questionResponses: newUpdatedList.length , deleteModalOpen: false},()=>{
                    this.handleRefreshData(this.state.revoSource,this.state.questionName)
                })
            }
        });
    }

    handleCellAnnotation = (props,e) => {
        if(this.state.tagColumn && this.state.selectRowIndex >=0){
            this.state.selectedIdList.push(this.state.revoSource[this.state.selectRowIndex].id)
            window.localStorage.setItem("x",e.pageX)
            window.localStorage.setItem("y",e.pageY)
            if(this.state.selectedIdList.length > 0){
                selectedIdList=this.state.selectedIdList
                this.setState({selectedIdList:this.state.selectedIdList})
            }
            this.setState({
                showAnnotationCard: true,
                selectedIdList:this.state.selectedIdList,
                // tanscriptWidth: tanscriptWidth,
            })
            // document.getElementsByClassName('tree-container')[0].click()
        }
    }

    handleAction = (e) => {      
        window.localStorage.removeItem('x')
        window.localStorage.removeItem('y')
        let tanscriptWidth = document.getElementById("annotaCard").offsetTop - 55;
        if (e === 'is_annotate') {
            if(this.state.selectedIdList.length > 0){
                selectedIdList=this.state.selectedIdList
                this.setState({selectedIdList:this.state.selectedIdList})
            }
            this.setState({
                showAnnotationCard: true,
                tanscriptWidth: tanscriptWidth,
            })
        }
        else if (e == "export_csv") {
            this.getCSVOpenText(this.state.projectId);
        }
        else if (e == "is_deleted") {
            this.setState({deleteModalOpen:true})
        }
    }

    /*Outside Click Annotaiton Hide Start*/
    hiddleOutSideAnnotation = () => {
        if(this.state.tagColumn){
            this.setState({selectedIdList : [],selectedRowIndexList:[]})
        }
        this.setState({
            showAnnotationCard: false,
            selectRowIndex:-1
        })
    }
    /*Outside Click Annotaiton Hide End*/


    insertTag = (newValue, themeFlag) => {  
        insertTag(newValue).then((response) => {
           
            if (response.status_code == 200 && response.data) {  
                isSelectAll=false;
                selectedIdList=[]
                this.setState({ showAnnotationCard: false, selectedText: '' ,selectedIdList:[],selectedIdListRow:[],selectedRowIndexList:[]})
                let insertedId=[]
                let newTagDetails=[]
                for(let j in response.data.feature_data){
                    for (let i in this.state.revoSource) {
                        if (!insertedId.includes(this.state.revoSource[i].id) && (response.data.feature_data[j]._id.$oid  == this.state.revoSource[i].id)) {      
                            insertedId.push(this.state.revoSource[i].id)
                            newTagDetails=this.getDetailsofTag(response.data.feature_data[j].tag_dtls)
                            this.state.revoSource[i].details=newTagDetails
                            this.state.revoSource[i].name=this.getOpentextTimeStamp( response.data.feature_data[j].open_text_timestamps)
                    }
                }
            }

            let revoSourceTemp=this.state.revoSource
            this.setState({ishighlightColorReload:true})
                this.handleRefreshData(revoSourceTemp,this.state.questionName)
                // this.setState({revoSource:revoSourceTemp},()=>{
                // })
            }
        })
    }

    handleScroll = () => {
        this.setState({ x: this.state.x, y: this.state.y })
    }

    getDetailsofTag = (data) => {
        let tag_details = [];
        for (let i in data) {
            let details = {
                name: data[i].tag_dtl ? data[i].tag_dtl.tag_name : data[i].name,
                color: data[i].sequence ? appThemeColor(data[i].sequence, data[i].level) : data[i].color,
                id: data[i]._id ? data[i]._id.$oid : data[i].id,
                tagId:data[i].tag_dtl ? data[i].tag_dtl._id.$oid : data[i].tagId,
            }
            tag_details.push(details)
        }
        return tag_details       
    }

    getOpentextTimeStamp = (data) =>{
        let timeStamp = [];
        let startIndex=0;
        let endIndex=0;
        for (let i in data){
            endIndex+=data[i].value.length
            let openTextStamp = {
                index: data[i].index,
                startIndex : startIndex,
                endIndex: endIndex,
                type: data[i].type,
                value: data[i].value,
                className: this.state.ishighlightColorReload ? this.getClassName(data[i].highlight_dtls ? data[i].highlight_dtls : data[i].highlightDetails) : data[i].className,
                unique_element_key: data[i].unique_element_key,
                highlightDetails:data[i].highlight_dtls ? data[i].highlight_dtls : data[i].highlightDetails
            }
            startIndex+=data[i].value.length
            timeStamp.push(openTextStamp)
        }

        return timeStamp
    }
    
    tagClickEvent = (tagId,item) => { 
        let featureId = null;
        let user_data=[]
        let insertedId=[]
        let idList=this.state.selectedIdList.length > 0 ? this.state.selectedIdList : selectedIdList
        for (let j in idList) {
            for (let i in this.state.revoSource) {
                if (!insertedId.includes(this.state.revoSource[i].id) && (idList[j] == this.state.revoSource[i].id)) {  
                    let new_timeStamp=[]
                    let newTranscript=''
                    insertedId.push(this.state.revoSource[i].id)
                    for(let j in this.state.revoSource[i].name){
                        newTranscript+=this.state.revoSource[i].name[j].value
                        new_timeStamp.push({
                            index: this.state.revoSource[i].name[j].index,
                            type: this.state.revoSource[i].name[j].type,
                            value: this.state.revoSource[i].name[j].value,
                            unique_element_key:this.state.revoSource[i].name[j].unique_element_key,
                        })
                    }
                    let searchlist;
                    if(JSON.stringify(this.state.newlistResult) != '{}'){
                        searchlist={}
                        for (const [key, value] of Object.entries(this.state.newlistResult)) {
                            if(this.state.revoSource[i].id == key){
                                searchlist[key]=value
                            }
                        }
                    }
                    if(Array.isArray(tagId) && tagId.length> 0){
                        for(let j in tagId){
                            user_data.push({
                                "knit_project_id": this.state.projectId,
                                "knit_user_id": this.state.userId,
                                "knit_tag_id": tagId[j],
                                "knit_project_response_id": this.state.revoSource[i].featureId,
                                "knit_feature_response_id":this.state.revoSource[i].id,
                                "tag_associated_text": newTranscript,
                                "tag_associated_text_timestamp": new_timeStamp,
                                "feature_dtls":searchlist
                            })
                        }
                   
                    }else{
                        user_data.push({
                            "knit_project_id": this.state.projectId,
                            "knit_user_id": this.state.userId,
                            "knit_tag_id": tagId,
                            "knit_project_response_id": this.state.revoSource[i].featureId,
                            "knit_feature_response_id":this.state.revoSource[i].id,
                            "tag_associated_text": newTranscript,
                            "tag_associated_text_timestamp": new_timeStamp,
                            "feature_dtls":searchlist
                        })
                    }   
                    
                    
                } 
            }
        }
        let user_request={
            is_bulk:user_data,
            is_tag:true,
            tag_comment:true
        }
        this.insertTag(user_request,false);

    }

    handleSelectAll = (e) => {
        let { selectedIdList,selectedRowIndexList } = this.state;
        selectedIdList=[]
        // let revoSource=[]
        for(let i in this.state.revoSource){
            this.state.revoSource[i]['is_checked']['checked']=!this.state.revoSource[i]['is_checked']['checked']
            isSelectAll=e.target.checked
            if(e.target.checked == true){
                selectedIdList.push(this.state.revoSource[i].id)
                selectedRowIndexList.push(Number(i))
            }else{
                selectedIdList=selectedIdList.filter(el=> el != this.state.revoSource[i].id)
                selectedRowIndexList=selectedRowIndexList.filter(el => el != Number(i))
            }
        }
        this.setState({revoSource: this.state.revoSource,selectedIdList: selectedIdList,selectedRowIndexList:selectedRowIndexList,isCheckbox:e.target.checked },()=>{
            this.handleRefreshData(this.state.revoSource,this.state.questionName)
        })
    }

    handleChangeChk = (Checked_id, e) => {
        let { selectedIdList,isCheckbox ,selectedRowIndexList} = this.state;
        for (let i in this.state.revoSource) {
            if (Checked_id == this.state.revoSource[i].id) {
                if (e == true) {
                    if(!selectedIdList.includes(Checked_id)){
                        selectedIdList.push(Checked_id)
                    }
                    if(!selectedRowIndexList.includes(Number(i))){
                        selectedRowIndexList.push(Number(i))
                    }
                    this.state.revoSource[i]['is_checked']['checked']=true
                    this.setState({isCheckbox:true})                    
                }else{
                    selectedIdList=selectedIdList.filter(el=> el != Checked_id)
                    selectedRowIndexList=selectedRowIndexList.filter(el => el != Number(i))
                    this.state.revoSource[i]['is_checked']['checked']=false
                }
                if(selectedIdList.length <= 0){
                    this.setState({isCheckbox:false})
                }
            }
            // break;
        }
        this.setState({ revoSource: this.state.revoSource,  selectedIdList: selectedIdList,selectedRowIndexList:selectedRowIndexList ,clickSelection:true }, () => {
            // this.handleRefreshData(this.state.revoSource,this.state.questionName)
        })
        
    }


    getCharactersCountUntilNode=(node, parent)=>{
        var walker = document.createTreeWalker(
          parent || document.body,
          NodeFilter.SHOW_TEXT,
          null,
          false
        );
        var found = false;
        var chars = 0;
        while (walker.nextNode()) {
          if(walker.currentNode === node) {
            found = true;
            break;
          }
          chars += walker.currentNode.textContent.length;
        }
        if(found) {
          return chars;
        }
        else return -1;
      }

    handleSelection=(e,data,index)=>{
        var container = document.getElementsByClassName('main-class-name')[index];
        var sel = window.getSelection();
        var range = sel.getRangeAt(0);
        var sel_start = range.startOffset;
        var sel_end = range.endOffset;
        var charsBeforeStart = this.getCharactersCountUntilNode(range.startContainer, container);
        var charsBeforeEnd = this.getCharactersCountUntilNode(range.endContainer, container);
        if(charsBeforeStart < 0 ) {
            console.warn('out of range');
            return;
        }
        var startIndex = charsBeforeStart + sel_start;
        var end_index = charsBeforeEnd + sel_end;
        
        var range = window.getSelection().getRangeAt(0);
        let totalwords = 0;
        let newSelectedList = [];
        let transcriptEndIndexflag
        let selectedText=''
        totalwords = startIndex + range.toString().length
        for (let i = 0; i < data.name.length; i++) {
            if (startIndex >= data.name[i].startIndex && startIndex < data.name[i].endIndex) {
                transcriptEndIndexflag = true
            }
            if (transcriptEndIndexflag == true) {
                selectedText+=data.name[i].value
                newSelectedList.push({
                    index: data.name[i].index,
                    startIndex : data.name[i].startIndex,
                    endIndex: data.name[i].endIndex,
                    type: data.name[i].type,
                    value: data.name[i].value,
                    unique_element_key:data.name[i].unique_element_key,
                    highlightDetails:data.name[i].highlight_dtls
                }); 
                
            }
            if (data.name[i].endIndex >= totalwords) {
                transcriptEndIndexflag = false
            }
        }
        this.setState({newSelectedTimeStamp: newSelectedList})
        // let newNode = document.createElement('mark');
        // newNode.classList.add('selected-text')
        // newNode.appendChild(range.extractContents());
        // range.insertNode(newNode);
        // console.log('range.extractContents()==>',range.extractContents())
       if(range.toString().length > 0){
        window.localStorage.setItem("x",e.pageX)
        window.localStorage.setItem("y",e.pageY)
               this.setState({
                   showAnnotationCard: true,
               })
            }
    }

    handleSelectionAnnotation =(tagId)=>{
        let user_data=[]
        let new_timeStamp=[]
        let newTranscript=''
        for(let i in this.state.newSelectedTimeStamp){
            newTranscript+=this.state.newSelectedTimeStamp[i].value;
            new_timeStamp.push({
                index: this.state.newSelectedTimeStamp[i].index,
                type: this.state.newSelectedTimeStamp[i].type,
                value: this.state.newSelectedTimeStamp[i].value,
                unique_element_key:this.state.newSelectedTimeStamp[i].unique_element_key,
            })
        }
        let searchlist;
        if(JSON.stringify(this.state.newlistResult) != '{}'){
            searchlist={}
            for (const [key, value] of Object.entries(this.state.newlistResult)) {
                if(this.state.selectionResponse.id == key){
                    searchlist[key]=value
                }
            }
        }

        user_data.push({
            "knit_project_id": this.state.projectId,
            "knit_user_id": this.state.userId,
            "knit_tag_id": tagId,
            "knit_project_response_id": this.state.selectionResponse.featureId,
            "knit_feature_response_id":this.state.selectionResponse.id,
            "tag_associated_text": newTranscript,
            "tag_associated_text_timestamp": new_timeStamp,
            "feature_dtls":searchlist
        })
        let user_request={
            is_bulk:user_data,
            is_tag:true,
            tag_comment:true
        }
        this.insertTag(user_request,false);
    }

    handleDeleteTag=(id,data)=>{
        let searchlist;
        let min;
        let max;
            if(JSON.stringify(this.state.newlistResult) != '{}'){
                for (const [key, value] of Object.entries(this.state.newlistResult)) {
                    if(data.id == key){
                        max=Math.max(...value.index_list) // 4
                        min=Math.min(...value.index_list)
                    }
                }
                tagDeletion(id,min,max).then((response) => {
                    if(JSON.stringify(response) != '{}'){
                        let insertedId=[]
                          for(let j in response.data.feature_data){
                              for (let i in this.state.revoSource) {
                                  if (!insertedId.includes(this.state.revoSource[i].id) && (response.data.feature_data[j]._id.$oid  == this.state.revoSource[i].id)) {  
                                      insertedId.push(this.state.revoSource[i].id)
                                      this.state.revoSource[i].details=this.getDetailsofTag(response.data.feature_data[j].tag_dtls)
                                      this.state.revoSource[i].name=this.getOpentextTimeStamp( response.data.feature_data[j].open_text_timestamps)
                              }
                          }
                      }
                    }
        
                this.setState({revoSource:this.state.revoSource},()=>{
                    this.handleRefreshData(this.state.revoSource,this.state.questionName)
                })
                })
            }else{
                tagUsageDeleteAction(id).then((response) => {
                    if(JSON.stringify(response) != '{}'){
                        let insertedId=[]
                          for(let j in response.data.feature_data){
                              for (let i in this.state.revoSource) {
                                  if (!insertedId.includes(this.state.revoSource[i].id) && (response.data.feature_data[j]._id.$oid  == this.state.revoSource[i].id)) {  
                                      insertedId.push(this.state.revoSource[i].id)
                                      this.state.revoSource[i].details=this.getDetailsofTag(response.data.feature_data[j].tag_dtls)
                                      this.state.revoSource[i].name=this.getOpentextTimeStamp( response.data.feature_data[j].open_text_timestamps)
                              }
                          }
                      }
                    }
        
                this.setState({revoSource:this.state.revoSource},()=>{
                    this.handleRefreshData(this.state.revoSource,this.state.questionName)
                })
                })
            }

        this.state.revoSource[this.state.selectRowIndex].details= this.state.revoSource[this.state.selectRowIndex].details.filter(el => el.id != id)
        this.setState({revoSource:this.state.revoSource,selectedIdListRow:[],selectedRowIndexList:[],selectedIdList:[]},()=>{
        //     this.handleRefreshData(this.state.revoSource,this.state.questionName)
        })

    }

    handleKeyUp=(id,event)=>{
        var key;
        var isShift;
        var isCtrl;
        var ctrlDown = event.ctrlKey||event.metaKey // Mac support
        var {isDownPressed,isUpPressed} = this.state;

        let {selectRowIndex,selectedRowIndexList,selectedIdList}=this.state;
        if(this.state.clickSelection){
            this.setState({selectedRowIndexList:[],selectedIdList:[],selectionResponse:{}},()=>{
                // this.(this.state.revoSource,this.state.questionName)
            })
        }

        if (event) {
            // this.setState({isKeyPressed:true,isRange:true})
          key = event.keyCode;
          isShift = !!event.shiftKey; // typecast to boolean
          isCtrl = !!event.ctrlKey; // typecast to boolean
        } else {
          key = event.which;
          isCtrl = !!event.ctrlKey; // typecast to boolean
        }
        if (ctrlDown && event.keyCode  == 67) {
            // Do stuff.
            this.state.copiedList=this.state.revoSource[selectRowIndex].details;
            this.setState({copiedList:this.state.copiedList},()=>{
                if(Array.isArray(this.state.copiedList) && this.state.copiedList.length > 0){
                this.setState({succesTagModal : true })
                }
            })
         }

         //For Paste
         if ((event.ctrlKey || event.metaKey) && event.keyCode == 86) {
             if(Array.isArray(this.state.copiedList) && this.state.copiedList.length > 0){
                 selectedIdList.push(this.state.revoSource[selectRowIndex].id)
                 this.state.revoSource[selectRowIndex].details=this.state.copiedList
                 let newList=[]
                 this.setState({selectedIdList:selectedIdList,revoSource:this.state.revoSource},()=>{
                     if(Array.isArray(this.state.copiedList) && this.state.copiedList.length > 0){
                         for(let i in this.state.copiedList){
                             newList.push(this.state.copiedList[i].tagId)
                         }
                         this.tagClickEvent(newList)
                     }else{
                         this.tagClickEvent(this.state.copiedList[0].tagId)
                     }
                 })
                 this.setState({copiedList:[],revoSource:this.state.revoSource})
             }
         }
         
         if(isShift && key == 40){  
            if(this.state.isUpPressed){
                if(selectRowIndex == this.state.focusedRowIndex){
                    this.setState({isUpPressed:false})
                }else{
                    selectedRowIndexList=selectedRowIndexList.filter(el => el != selectRowIndex)
                    selectedIdList=selectedIdList.filter(el => el != this.state.revoSource[selectRowIndex].id)
                }
            }else{
                this.setState({isDownPressed : true})
                // this.state.revoSource[selectRowIndex]['is_checked']['checked']=!this.state.revoSource[selectRowIndex].is_checked.checked
                if(!selectedRowIndexList.includes(selectRowIndex)){  
                    selectedRowIndexList.push(selectRowIndex)
                } 
                if(!selectedIdList.includes(this.state.revoSource[selectRowIndex].id)){
                    selectedIdList.push(this.state.revoSource[selectRowIndex].id)
                }
                if(selectRowIndex > -1){
                    if(!this.state.revoSource[selectRowIndex+1].is_checked.checked){
                        if(!selectedRowIndexList.includes(selectRowIndex+1)){
                            selectedRowIndexList.push(selectRowIndex+1)
                        } 
                        if(!selectedIdList.includes(this.state.revoSource[selectRowIndex+1].id)){
                            selectedIdList.push(this.state.revoSource[selectRowIndex+1].id)
                        }
                    }
                }
            }
            this.setState({selectRowIndex:selectRowIndex+1,selectedRowIndexList:selectedRowIndexList,selectedIdList:selectedIdList,isCheckbox:true,clickSelection:false},()=>{
                this.handleRefreshData(this.state.revoSource,this.state.questionName)
            })
            // this.handleRefreshData(this.state.revoSource,this.state.questionName)
        }

    if(isShift && key == 38){
        if(this.state.isDownPressed){
            if(selectRowIndex == this.state.focusedRowIndex){
                this.setState({isDownPressed:false})
            }else{
                selectedRowIndexList=selectedRowIndexList.filter(el => el != selectRowIndex)
                selectedIdList=selectedIdList.filter(el => el != this.state.revoSource[selectRowIndex].id)
            }
        }else{
            this.setState({isUpPressed : true})
            if(selectRowIndex > -1){
                // this.state.revoSource[selectRowIndex]['is_checked']['checked']=!this.state.revoSource[selectRowIndex].is_checked.checked
                if(!selectedRowIndexList.includes(selectRowIndex)){
                    selectedRowIndexList.push(selectRowIndex)
                } 
                if(!selectedIdList.includes(this.state.revoSource[selectRowIndex].id)){
                    selectedIdList.push(this.state.revoSource[selectRowIndex].id)
                }
                if(selectRowIndex != 0){
                    if(!this.state.revoSource[selectRowIndex-1].is_checked.checked){
                        if(!selectedRowIndexList.includes(selectRowIndex-1)){
                            selectedRowIndexList.push(selectRowIndex-1)
                        } 
                        if(!selectedIdList.includes(this.state.revoSource[selectRowIndex-1].id)){
                            selectedIdList.push(this.state.revoSource[selectRowIndex-1].id)
                        }
                    }
            }
            }
        }
        this.state.revoSource[selectRowIndex]['is_checked']['checked']=!this.state.revoSource[selectRowIndex].is_checked.checked
        this.setState({selectRowIndex:selectRowIndex-1,selectedRowIndexList:selectedRowIndexList,selectedIdList:selectedIdList,isCheckbox:true,
        clickSelection:false},()=>{
            this.handleRefreshData(this.state.revoSource,this.state.questionName)
        })
        }
    }


    getClassName=(highlightDetails)=>{
        let mixedColor=''
        let className=''
        if(Array.isArray(highlightDetails) && highlightDetails.length > 0){

            for(let i=0;i<highlightDetails.length;i++){
            let firstTheme=highlightDetails[i].sequence == 0 ? 'rgba(108, 108, 108 , 0.2)' : highlightDetails[i].sequence;
            let secondTheme=''
            if(highlightDetails[i+1]){
                 secondTheme=highlightDetails[i+1].sequence == 0 ? 'rgba(108, 108, 108 , 0.2)' : highlightDetails[i+1].sequence;
            }
            
            if(mixedColor == ''){
                let color1=appThemeColor(firstTheme,0.2);
                let color2=appThemeColor(secondTheme,0.2)
                mixedColor=getCombineThemeColor(color1,color2)
            }else{
                if(highlightDetails.length>2){
                    mixedColor=getCombineThemeColor(mixedColor,appThemeColor(secondTheme,0.2))
                }
            }
            let count= Math.round(Math.random() * 1000);
            var style = document.createElement('style');
            style.type = 'text/css';
            document.getElementsByTagName('head')[0].appendChild(style);
            className+=" highlighted-theme"+highlightDetails[i].sequence + ' '
            if(highlightDetails.length>1){
                style.innerHTML = '.mergeTheme'+count+'{ background-color:'+ mixedColor +' }';
                className += 'mix-color '
                className += 'mergeTheme'+count + ' '
            }
            if(highlightDetails[i+1]){
                className+=" highlighted-theme"+highlightDetails[i+1].sequence + ' '
            }
        }}
        return className;
    }

    handleRefreshData=(response,questionName)=>{
            let revoSource=[]
            let revoColumns=[]
            revoColumns.push({
                size: 70,
                prop: 'is_checked',
                sortable: false,
                readonly: false,
                columnTemplate: (createElement, props) => {
                    const inputbar = createElement("input", {
                        type: "checkbox",
                        checked: isSelectAll,
                        id:'checkbox',
                        class: {
                            "dataCheckedBox": true
                        },
                        onChange: (e) => {
                            this.handleSelectAll(e);
                        }
                    });
                    return inputbar;
                },
                // defining checkbox template
                cellTemplate: (createElement, props) => {
                    const input = createElement("input", {
                        type: "checkbox",
                        value:props.data[props.rowIndex],
                        checked: props.data[props.rowIndex]['is_checked']['checked'],
                        class: {
                            "dataCheckedBox": true
                        },
                        onChange: (e) => {
                            this.handleChangeChk(props.model['id'], e.target.checked);
                        },
                    });
                    return input;
                },
            },
                {
                    size: 800,
                    prop: "name",
                    name: questionName,
                    sortable: false,
                    readonly: true,
                    columnTemplate: (createElement, props) => {
                         return createElement("div", {
                            class:{
                                "asc-icon":this.state.questionOrder == 'asc' ? true :  false,
                                "desc-icon":this.state.questionOrder == 'desc' ? true :  false
                            },
                            style:{
                                cursor:'pointer'
                            },
                            onClick: (e) => {
                                this.onBeforeSorting(e,props);
                            }
                        },questionName);
                    },
                    cellTemplate: (createElement, props) => {
                        let dataVal = props.data[props.rowIndex].name;
                        let index=0
                        let mixedColor=''
                        let className=''
                        return  (
                            createElement('div', {
                                class: {
                                    'main-class-name': true,
                                },
                            },   dataVal.map((details) => {
                                let transcript=details.value == ' ' ? '\u00A0' : details.value
                                index+=1                    
                            return(
                                createElement('span', {
                                    style:{
                                        color:'#001839',
                                    },
                                    id:index,
                                    onmouseup:(e) => {
                                        this.handleSelection(e,props.data[props.rowIndex],props.rowIndex);                                  
                                    },
                                    onmouseover:() => {
                                        this.setState({isKeyPressed:false,isRange:false})
                                    },
                                    class: {
                                        'inner-cell': true,
                                        [details.className]:true
                                    },
                                },transcript )
                            )
                        }))
                        )
                        
                     
                    },
                },
                {   
                    size:500,   
                    resize:true,
                    prop: "details",
                    name: "Tags",
                    sortable: false,  
                    columnTemplate: (createElement, props) => {
                        return createElement("div", {
                            class:{
                                "asc-icon":this.state.questionOrder == 'asc' ? true :  false,
                                "desc-icon":this.state.questionOrder == 'desc' ? true :  false
                            },
                            style:{
                                cursor:'pointer'
                            },
                            onClick: (e) => {
                                this.onBeforeSorting(e,props);
                            }
                        },"Tags");
                    },         
                    cellTemplate: (createElement, props) => {
                        let dataVal = props.data[props.rowIndex].details;
                        ondblclick=(event)=>{
                            this.handleCellAnnotation(props,event);
                        }              
                        onkeyup = (e)=>{
                            this.handleKeyUp(props.rowIndex,e) 
                         }
                         onkeydown=(e)=>{
                            this.setState({isKeyPressed:true,isRange:true})
                        }
                        return dataVal.map((details) => (
                            createElement('span', {
                                style: {
                                    color: 'fff',
                                    backgroundColor: details.color
                                }, class: {
                                    "tags_box": true
                                },
                                value:details.name,
                            }, details.name, createElement('img', {
                                class: {
                                    "tags_box_icon": true
                                },
                                src: CloseIcon,
                                onmouseup:(e)=>{
                                    this.handleDeleteTag(details.id,props.data[props.rowIndex]);
                                },
                            })
                            )))
                    },
                    // onclick : this.handleCellAnnotation(),
                })
    
            
            for (let i in response) {
                let transcript='';
                let openTextTimeStamp=response[i].open_text_timestamps ? response[i].open_text_timestamps : response[i].name
                    for(let j in openTextTimeStamp){
                        transcript+=openTextTimeStamp[j].value
                    }
                    let id=response[i]._id ? response[i]._id.$oid  : response[i].id;
            revoSource.push({
                    transcript: transcript,
                    details: this.getDetailsofTag(response[i].tag_dtls ? response[i].tag_dtls : response[i].details),
                    id: id,
                    is_checked: {id:response[i]._id ? response[i]._id.$oid  : response[i].id ,
                         checked: isSelectAll ? true : this.state.selectedRowIndexList.includes(Number(i)) || this.state.selectedIdList.includes(id) ? true : false},
                    featureId: response[i].feature_response_id ? response[i].feature_response_id.$oid : response[i].featureId,
                    name:this.getOpentextTimeStamp(openTextTimeStamp)
                })
            }          
            if(JSON.stringify(this.state.selectionResponse) != '{}'){
                this.setState({selectionResponse:{}})
            }
            this.setState({ishighlightColorReload:false})

            this.setState({ revoColumns: revoColumns, revoSource: revoSource}) 
            
    }


    getOpenTextTableData = (sortingData) => {
        let {sortOrder} = this.state;
        if(JSON.stringify(this.state.selectionResponse) != '{}'){ 
            this.setState({ revoColumns: [], revoSource: [],selectionResponse:{}})
        }
        let user_data = {
            "knit_project_id": this.state.projectId,
            "question_id": this.props.location.state.questionId,
            "numeric_question_id": this.props.location.state.numericQuestionId.toString(),
        }                                   
        if(sortingData){
            user_data ={
                "knit_project_id": this.state.projectId,
                "question_id": this.props.location.state.questionId,
                "numeric_question_id": this.props.location.state.numericQuestionId.toString(),
                "sort_field" : sortingData[0].name,
                "sort_order" : sortingData[0].order
            }
        }
        if(JSON.stringify(this.state.newlistResult) != '{}'){
            
            user_data = {
                "knit_project_id": this.state.projectId,
                "question_id": this.props.location.state.questionId,
                "numeric_question_id": this.props.location.state.numericQuestionId.toString(),           
                "feature_dtls": this.state.newlistResult,      
            }   
            if(sortingData){
                user_data ={
                    "knit_project_id": this.state.projectId,
                    "question_id": this.props.location.state.questionId,
                    "numeric_question_id": this.props.location.state.numericQuestionId.toString(),
                    "feature_dtls": this.state.newlistResult,      
                    "sort_field" : sortingData[0].name,
                    "sort_order" : sortingData[0].order
                }
            }
        }


        fetchTableData(user_data).then((response) => {
            if (response.data) {
                if(JSON.stringify(this.state.newlistResult) == '{}'){
                    this.setState({totalResponseCount:response.data.feature_data.length})
                }
                let questionName = response.data.feature_dtls.question_text                
                this.setState({questionName:response.data.feature_dtls.question_text,questionResponses:response.data.feature_data.length})
                this.handleRefreshData(response.data.feature_data,questionName)
            }
        })
    }

    handleSearch = (event) => {
        let outerThis = this;
        let { value } = event.target;
        if(event.key === 'Enter'){
            if(value && value.trim()){
                this.setState({revoSource:[],selectedRowIndexList:[],selectedIdList:[],ishighlightColorReload:true})
                this.searchOpenText(value);
            }else{
                this.setState({newlistResult:{},searchFlag:false},()=>{
                    this.getOpenTextTableData()
                })
            }
        }        
    }

    searchOpenText = (searchValue) => {
        let outerThis = this;
        let searchBody = {
            "knit_project_id": this.state.projectId,
            "search_by": searchValue,
            "question_details_dict":{
                "question_id": this.props.location.state.questionId,
                "numeric_question_id": this.props.location.state.numericQuestionId.toString(),
            },
            "is_open_text": true
        }
        openTextSearchData(searchBody).then((response) => {
            if(JSON.stringify(response.data) != '{}'){
                this.setState({newlistResult : response.data,searchFlag:false }, () =>{
                    this.getOpenTextTableData();
                })
            }else{
                this.setState({searchFlag:true,questionResponses:0})
            }
        })
    }

    renderTitle = () => {
        return (
            <Grid container spacing={1} style={{ paddingBottom: 30 }}>
                <Grid item xs={12} md={12} lg={5} sm={2}>
                    <div style={{ display: 'flex' }}>
                        <img src={BackArrow} className={"back-arrow c-pointer"} onClick={() => { goBack(); }} />
                        <Typography variant={"h6"} component={"h6"} className={"title"}>
                            {this.state.questionName ? this.state.questionName : ''}                           
                        </Typography>
                    </div>
                        <Typography className={"subTitle"}>Showing {this.state.questionResponses ? this.state.questionResponses : 0 } of {this.state.totalResponseCount ? this.state.totalResponseCount : 0} responses</Typography>
                </Grid>
                <Grid item xs={12} md={12} lg={7} sm={10} className={"buttonDiv sub-div-header"}>
                    {Array.isArray(this.state.selectedIdList) && this.state.selectedIdList.length > 0 && this.state.isCheckbox && 
                        <SelectComponent
                            menu={menu}
                            handleChange={(e) => {
                                this.handleAction(e.target.value);
                            }}
                            menuValue={this.state.menuValue}
                        ></SelectComponent>
                    }
                        <AutoCompleteWidget handleChange={(event)=>{this.handleSearch(event)}}>
                    </AutoCompleteWidget>
                </Grid>

                <Grid item xs={12} md={12} lg={12} sm={12}>
                    {this.state.mainData &&
                        Array.isArray(this.state.mainData) &&
                        this.state.mainData.length > 0 &&
                        <CSVLink
                            style={{ textDecoration: "none" }}
                            data={this.state.mainData}
                            filename={`${getFormattedCSVFileName(this.state.projectTitle)}.csv`}
                            target="_blank"
                            ref={(r) => (this.responseLink = r)}></CSVLink>}
                </Grid>

            </Grid>
        );
    };

    handleRouteChange = (value, id, questionId) => {
        return (
            <div>
                {value === 1 ?
                    this.props.history.push({
                        pathname: "/knit/projectsDetails/" + this.props.location.state.projectid + "/Data?view=list"
                    })
                    : value === 1 ?
                        this.props.history.push({
                            pathname: "/knit/projectsDetails/" + this.props.location.state.projectid + "/Data?view=grid"
                        })
                        : value === 2 ?
                            this.props.history.push({
                                pathname: "/knit/projectsDetails/" + this.state.projectId + "/Video?view=grid"
                            })
                            : value === 2 ?
                                this.props.history.push({
                                    pathname: "/knit/projectsDetails/" + this.state.projectId + "/Video?view=list"
                                })
                                : value === 2 ?
                                    this.props.history.push({
                                        pathname: "/knit/projectsDetails/" + this.state.projectId + "/Video/:id"
                                    })
                                    : value === 3 ?
                                        this.props.history.push({
                                            pathname: "/knit/projectsDetails/" + this.state.projectId + "/ShowReels"
                                        })
                                        : value === 4 ?
                                            this.props.history.push({
                                                pathname: "/knit/projectsDetails/" + this.state.projectId + "/Themes"
                                            })
                                            : <></>
                }

            </div>
        )

    }

    handleCellTypeCheck = (event) => {
        if(Array.isArray(this.state.selectedRowIndexList) && this.state.selectedRowIndexList.length > 0 && !this.state.clickSelection){
            this.setState({selectedRowIndexList: [],selectedIdList:[]},()=>{
                // this.handleRefreshData(this.state.revoSource,this.state.questionName)
            })
        }
        if (event.detail['prop'] === 'details') {
            this.setState({ isRange: true ,tagColumn:true,isCheckbox:false})
            this.state.selectedRowIndexList.push(event.detail.rowIndex)
            this.setState({selectionResponse:{},selectedIdList:[],selectRowIndex:event.detail.rowIndex, focusedRowIndex :event.detail.rowIndex,
                selectedRowIndexList:this.state.selectedRowIndexList,isDownPressed:false,isUpPressed:false})
        } else {
            if(event.detail['prop'] == 'name'){
                this.setState({ selectionResponse: event.detail.model,isRange:false , tagColumn: false,
                    selectRowIndex:event.detail.rowIndex, 
                    focusedRowIndex :event.detail.rowIndex, selectedRowIndexList:this.state.selectedRowIndexList})   
            }else{
                this.state.selectedRowIndexList.push(event.detail.rowIndex)
                this.setState({ isRange: true , tagColumn: false ,selectRowIndex:event.detail.rowIndex, 
                    focusedRowIndex :event.detail.rowIndex, selectedRowIndexList:this.state.selectedRowIndexList,
                    isDownPressed:false,isUpPressed:false})
            }
      
            this.setState({ tagColumn: false })
        }
    }


    onBeforeSorting = (event,props) =>{
        let NewSortingList = [];
        if(props.prop == 'name'){
            NewSortingList.push({
                name:'question_answer',
                order: this.state.questionOrder == 'desc'  ? -1 : 1
            })
            this.setState({questionOrder: this.state.questionOrder == 'asc' || this.state.questionOrder == '' ?  'desc' : 'asc'})
        }else if(props.prop == 'details'){
            NewSortingList.push({
                name:'tag',
                order: this.state.questionOrder == 'desc' ? -1 : 1
            })
            this.setState({questionOrder: this.state.questionOrder == 'asc' || this.state.questionOrder == '' ?  'desc' : 'asc'})
        }
        let newSortingjson = JSON.stringify(Object.assign({}, NewSortingList));
        let stringToJsonObject = JSON.parse(newSortingjson);
        this.setState({sortingdata:stringToJsonObject,ishighlightColorReload:true})
        this.getOpenTextTableData(stringToJsonObject)
    }

    handleRange = (event) => {
        if(event.detail.newProps[0] == 'details'){
            let newList=[]
            let tagIdList=[]
            for (const [key, value] of Object.entries(event.detail.newData)) {
                tagIdList=[]
                newList.push(this.state.revoSource[key].id)
               for(let j in value['details']){
                   tagIdList.push(value['details'][j].tagId)
               }
            }
            this.setState({selectedIdList:newList},()=>{
                this.tagClickEvent(tagIdList);
            })
        }else{
            let {selectedIdList}=this.state;
            for (const [key, value] of Object.entries(event.detail.newData)) {
                selectedIdList.push(this.state.revoSource[key].id)
            }
            this.setState({selectedIdList:selectedIdList})
        }
    
    }

    deleteModalClose = () => {        
        this.setState({
          menuValue:0,
          deleteModalOpen: false,
      });
      document.getElementsByClassName('tree-container')[0].click()
    }

    handleSuccesTagModalClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ succesTagModal: false })
        
        // setOpen(false);
    };

    renderDataSkeleton=()=>{
        const { classes } = this.props;
        return(
          <TableRow>
              <TableCell style={{width:"3%"}}>
                    <Skeleton animation={"wave"} variant={"react"} ></Skeleton>
                </TableCell>
                <TableCell >
                    <Skeleton animation={"wave"} variant={"react"} height={50}></Skeleton>
                </TableCell>
                <TableCell>
                    <Skeleton animation={"wave"} variant={"react"} height={50}></Skeleton>
                </TableCell>
            </TableRow>
        )
      }

      skeletontable = () =>{
        return(
          <>
            <TableHead>
              <TableRow>
              <TableCell style={{width:"3%"}}>
                    <Skeleton animation={"wave"} variant={"react"} ></Skeleton>
                </TableCell>
                <TableCell>
                    <Skeleton animation={"wave"} variant={"text"}></Skeleton>
                </TableCell>
                <TableCell >
                    <Skeleton animation={"wave"} variant={"text"}></Skeleton>
                </TableCell>
             </TableRow>
            </TableHead>
            {this.renderDataSkeleton()}
            {this.renderDataSkeleton()}
            {this.renderDataSkeleton()}
            {this.renderDataSkeleton()}
            {this.renderDataSkeleton()}
            {this.renderDataSkeleton()}
            {this.renderDataSkeleton()}
          </>
        )
      }
 
      

    render() {
        let description="";       
        description="Are you sure you want to delete the response you selected Once you delete a response, any tags or analysis associated with the response will be deleted too. This action cannot be undone."
    
        return (
            <div id={"full-page-div"}  style={{height:'100vh'}}>
            <PageWrapper selected={1} selectedId={1} isSidebar={true} projectId={this.state.projectId}>
                 <Snackbar anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                    }}
                        open={this.state.succesTagModal} className={"alert-annotation"} 
                        autoHideDuration={2000}
                         onClose={this.handleSuccesTagModalClose}>
                        <Alert onClose={this.handleSuccesTagModalClose} variant="filled" className={styles.annotationAlert} >
                           Tag Copied !
                        </Alert>
                    </Snackbar>
                <div style={{ width: "100%" }}>
                    <div style={{ width: "calc(100% - 180px)", overflow: "overlay", float: "right", background: "#FBFBFB" }}>
                        <div className={"main-class"} id={'annotaCard'}>
                            {this.renderTitle()}
                            <div className={this.state.loading ? 'fullPageLoader blur-background' : ''}>
                                {this.state.loading && <AuthLoader />}
                            </div>
                            <div>
                                {this.state.searchFlag &&
                                      <div className={"search-teg-text search-error"}>
                                          <InfoIcon  className={"info-icon"}></InfoIcon>
                                          No Results appropriate for this search</div>
                                      }
                                {Array.isArray(this.state.revoColumns) && this.state.revoColumns.length > 0 &&
                                 Array.isArray(this.state.revoSource) && this.state.revoSource.length>0 
                                  && !this.state.searchFlag ?
                                    <RevoGrid
                                        theme="material"
                                        row-size="65"
                                        columns={this.state.revoColumns}
                                        source={this.state.revoSource}
                                        resize={true}
                                        readonly={false} 
                                        useClipboard={false}
                                        range={this.state.isRange}
                                        onBeforecellfocus={(e) => { this.handleCellTypeCheck(e) }}
                                        onBeforeeditstart={(e) => { e.preventDefault() }}
                                        onBeforeaange={(e)=>{ this.handleRange(e) }}   
                                        onBeforefocuslost={(e)=>{ e.detail && e.detail.column.props == 'details' && this.setState({selectedIdList:[]})}}
                                    />
                                    :
                                    <TableContainer className={"tableContainer"}>
                                        <Table stickyHeader className={"table"}>
                                            {this.skeletontable()}
                                        </Table>
                                    </TableContainer>
                                }
                            </div>
                           {this.state.deleteModalOpen &&
                                <DeleteModel open={this.state.deleteModalOpen}
                                onHandleClose={()=>{this.deleteModalClose()}}
                                onHandleRemove={()=>{this.deteleOpenTextData(this.state.projectId)}} description={description}></DeleteModel>
                            }
                        </div>
                    </div>
                </div>
            </PageWrapper>
                {this.state.showAnnotationCard &&
                    <AnnotationCardMenu id={"annotateCard"}
                        onreload={()=>{this.deleteModalClose()}}
                        drag={true}
                        userId={this.state.userId}
                        projectId={this.state.projectId}
                        themeData={this.state.themeTreeData}
                        moveCard={this.state.showAnnotationCard}
                        tanscriptWidth={this.state.tanscriptWidth}
                        outside={() => {
                            this.hiddleOutSideAnnotation()
                        }}
                        getThemeDetails={() => this.getAllThemeDetails()}
                        getTagDetails={()=>{this.getOpenTextTableData()}}
                        knitThemeId={this.state.knitThemeId}
                        tagClickEvent={(id,item)=>{JSON.stringify(this.state.selectionResponse) != "{}" ? this.handleSelectionAnnotation(id) : this.tagClickEvent(id,item)}}
                        expandedItemsList={this.expandedItemsList}
                    />
                }
            </div>
        )
    }
}

export default withWidth()(withRouter(DataAnnotation));