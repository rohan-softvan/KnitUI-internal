import React, { Component, useEffect, useState, useRef } from "react";
import { Button, Grid, Typography, Menu, MenuItem } from "@material-ui/core";
import "../../css/common.scss";
import { Rnd } from "react-rnd";
import { ControlledTreeEnvironment, Tree, StaticTreeDataProvider, UncontrolledTreeEnvironment, UncontrolledTreeEnvironmentProps } from 'react-complex-tree';
import SubdirectoryArrowLeftIcon from '@material-ui/icons/SubdirectoryArrowLeft';
import MoreVertIcon from "@material-ui/icons/MoreVert";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import CloseIcon from '@material-ui/icons/Close';
import './AnnotationCardMenu.scss'
import SearchIcon from "../../../assets/images/search/search.svg";
import InputAdornment from "@material-ui/core/InputAdornment";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormControl from "@material-ui/core/FormControl";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import IconButton from '@material-ui/core/IconButton';
import appThemeColor from "../../config/ThemeColorConfig";
import { allThemeNameList, deleteTagThemeTree, updateThemeTreeHirerachy } from "../../services/ThemeService";
import "react-complex-tree/lib/style.css";

let localStorage=[]
export default function AnnotationFunctional(props) {
    const environment = React.createRef();
    const tree = React.createRef();
    const treeRef = useRef(Tree);
    const [focusedItem, setFocusedItem] = useState([]);
    const [expandedItems, setExpandedItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [placement, setPlacement] = useState('');
    const [anchorElPoper, setAnchorElPoper] = useState({});
    const [themeData, setThemeData] = useState(props.themeData);
    const [searchThemeData, setSearchThemeData] = useState({});
    const [searchFlag, setSearchFlag] = useState(false);
    const [oldThemeData, setOldThemeData] = useState(props.themeData);
    const [searchValue, setSearchValue] = useState('');
    const [dragFlag, setDragFlag] = useState(false);
    const [width, setWidth] = useState();
    const [parentId, setParentId] = useState();
    const [parentPath, setParentPath] = useState();
    const [AddNewTheme, setAddNewTheme] = useState(true);
    const [x, setX] = useState(0);
    const [y, setY] = useState();
    const [themeNullFlag,setThemeNullFlag] = useState(false)
    const [renameItemFlag,setRenameItemFlag] = useState(false)
    const [randomNum,setRandomNum] = useState([])


    useEffect(() => {
        // props.getThemeDetails();
        var container = document.getElementsByClassName('tree-container')[0];
        document.addEventListener('mouseup', function (event) {
            if (container.contains(event.target)) {
                setDragFlag(true)
            }
            // document.getElementById("outlined-adornment-weight").focus();
            // treeRef.current.focusItem('new the1')
        });
        document.getElementById("outlined-adornment-weight search").focus();
        setThemeData(props.themeData)
        if(JSON.stringify(props.themeData) == '{}'){
                setThemeNullFlag(true)
                props.getThemeDetails();
                setThemeData(props.themeData)
        }else{
            setThemeNullFlag(false)
        }
        setExpandedItems(expandedItems)
        if(window.localStorage.getItem("expandedItemsList")){
            setExpandedItems(JSON.parse(window.localStorage.getItem("expandedItemsList")))
        }

    }, [props.themeData]);

    const handleClickAway = () => {
        for (const [key, value] of Object.entries(themeData)) {
            themeData[key].isPopper = false;
        }
        props.outside();
    }

    const handleOpenPoper = (newPlacement, item) => (event) => {
        handleClosePoper();
        item.isPopper = true
        setPlacement(newPlacement);
        setAnchorElPoper(event.currentTarget)
        props.onreload();
    };

    const themeColorSvg = () =>{
        let count=1
        let newList=themeData['root'].children;
        for(let i in newList){
            themeData[newList[i]].color=appThemeColor(Number(i)+1,1)
            // themeData[newList[i]].sequence = Number(i)+1
        }
        setThemeData(themeData)
    }

    const handleClosePoper = () => {
        for (const [key, value] of Object.entries(themeData)) {
            themeData[key].isPopper = false;
        }
    }

    const randomNumber = () => {
        let random=Math.floor((Math.random() * 200) + 1)
        let randomFlag = true
        if(randomNum.length > 0 && randomNum.includes(random)){
            randomFlag = false
        }
        if(!randomFlag){
            random = randomNumber();
        } else {
            let arr = [...randomNum]
            arr.push(random)
            setRandomNum(arr)

        }
        return random
    }


    /*Add New Theme Tree Menu Start*/
    const addNewSubTheme = (item) => {
        let count = randomNumber();
        // let count = Math.floor((Math.random() * 10)+ 5);
        let createNewSubTheme = {
            index: "textbox" + count,
            hasChildren: false,
            children: [],
            data: '',
            type: "text",
            themeType: 'theme',
            isPopper: false,
        }
        themeData.root.children.push("textbox" + count)
        themeData["textbox" + count] = createNewSubTheme;
        // setThemeData(themeData);
    }
    /*Add New Theme Tree Menu End*/

    /*Add Main Tag Tree Menu Start*/
    const addNewTag = (item) => {
        setParentId(item.parentId)
        setParentPath(item.path)
        let count = randomNumber();
        // let count = Math.floor((Math.random() * 10)+ 5);
        let createNewInnerTag = {
            index: "textbox" + count,
            hasChildren: false,
            children: [],
            data: '',
            type: "text",
            themeType: 'tags',
            isPopper: false,
        }
        themeData[item.index].hasChildren= true
        themeData[item.index].children.push("textbox" + count)
        themeData["textbox" + count] = createNewInnerTag;
        treeRef.current.expandItem(item.index)
        // setThemeData(themeData);
    }
    /*Add Main Tag Tree Menu End*/

    /*Add New Tag Menu Start*/
    const addInnerTag = (item, type) => {
        setParentId(item.parentId)
        setParentPath(item.path)
        let count = randomNumber();
        // let count = Math.floor((Math.random() * 10)+ 5);
        let parentItemTag = Object.values(themeData).filter(e => (Array.isArray(e.children) && e.children.length > 0) && e.children.includes(item.index))[0]
        let createNewInnerTag = {
            index: "textbox" + count,
            hasChildren: false,
            children: [],
            data: '',
            type: "text",
            themeType: 'tags',
            isPopper: false,
        }
        parentItemTag.children.push("textbox" + count)
        themeData["textbox" + count] = createNewInnerTag;
        setThemeData(themeData);
    }
    /*Add New Tag Menu End*/

    /*Add New Inner SubTheme Menu Start*/
    const addInnerSubTheme = (item, type) => {
        setParentId(item.parentId)
        setParentPath(item.path)
        let parentItem = Object.values(themeData).filter(e => (Array.isArray(e.children) && e.children.length > 0) && e.children.includes(item.index))[0]
        let count = randomNumber();
        // let count = Math.floor((Math.random() * 10)+ 5);
        let createNewInnerSubTheme = {
            index: "textbox" + count,
            hasChildren: false,
            children: [],
            data: '',
            type: "text",
            themeType:'subTheme',
            isPopper: false,
        }
        themeData["textbox" + count] = createNewInnerSubTheme;
        parentItem.children.push("textbox" + count)
        setThemeData(themeData);
    }
    /*Add New Inner SubTheme Menu End*/

    const handleDeleteSubThemes=(item)=>{
        if(Array.isArray(themeData[item.index].children) && themeData[item.index].children.length>=0){
            for(let i in themeData[item.index].children){
                themeData[themeData[item.index].children[i]].isPopper=false;
                delete themeData[themeData[item.index].children[i]]
            }
            themeData[item.index].children=[]
        }
    }

    /*Remove Theme Tree Menu Start*/
    const removeThemeTree = (item) => {
        handleDeleteSubThemes(item)
        let user_data_theme = {
            "is_deleted": true,
            "knit_theme_id": item.parentId,
        };
        allThemeNameList(user_data_theme).then((response) => {
            removeTextbar(item)          
            delete themeData[item.index]
            if(Array.isArray(themeData['root'].children) && themeData['root'].children.length == 0){
                const elements = document.getElementsByClassName("reload");
                while(elements.length > 0){
                    elements[0].parentNode.removeChild(elements[0]);
                }
                setThemeData({})
                setThemeNullFlag(true)
                for (const [key, value] of Object.entries(themeData)) {
                    delete themeData[key]
                }
               
                // themeData={}
            }else{
                setThemeNullFlag(false)
                setThemeData(themeData)
            }  
            props.getTagDetails()  
            dragFlagStatusChange();
            document.getElementsByClassName('tree-container')[0].click()
        })
    }
    /*Remove Theme Tree Menu End*/


    const dragFlagStatusChange = () =>{
        // let flag = false
        for (const [key, value] of Object.entries(themeData)) {
            if(value.children !== undefined && value.children.length == 0){
                value['hasChildren'] = false
            }

        }
        setThemeData(themeData)
        document.getElementsByClassName('tree-container')[0].click()
    }


    /*Remove Sub Theme Tree Menu Start*/
    const removeSubThemeTree = (item) => {
        handleDeleteSubThemes(item)
        let user_data_subtheme = {
            "is_deleted": true,
            "knit_theme_id": item.id,
        };

        allThemeNameList(user_data_subtheme).then((response) => {
            removeTextbar(item)
            delete themeData[item.index]
            props.getTagDetails()
            document.getElementsByClassName('tree-container')[0].click()
            dragFlagStatusChange();

        })
    }
    /*Remove Sub Theme Tree Menu End*/

    /*Delete Tag Menu for the Theme Tree UI Start*/
    const removeTag = (item) => {
        let user_data_tag = {
            is_deleted: true,
            knit_project_id: props.projectId,
            knit_tag_id: item.id
        }

        allThemeNameList(user_data_tag).then((response) => {
            removeTextbar(item)
            delete themeData[item.index]
            props.getTagDetails()
            document.getElementsByClassName('tree-container')[0].click()
            dragFlagStatusChange();
        })
    }
    /*Delete Tag Menu for the Theme Tree UI End*/


    /*Rename Theme Tree Menu Start*/
    const renameTheme = (item, name) => {
        setRenameItemFlag(true)
        treeRef.current.startRenamingItem(item.index)
    }

    const handleRename = (item, name) => {
        let user_theme_name;
        if (item.type == "TAG") {
            user_theme_name = {
                "is_tag": true,
                "knit_tag_id": item.id,
                "request_type": "rename",
                "tag_name": name
            };
        } else if (item.type == "THEME" || item.type == "THEMES") {
            user_theme_name = {
                "is_theme": true,
                "knit_theme_id": item.parentId,
                "request_type": "rename",
                "theme_name": name
            };
        }
        else if (item.type == "SUB-THEME") {
            user_theme_name = {
                "is_theme": true,
                "knit_theme_id": item.id,
                "request_type": "rename",
                "theme_name": name
            };
        }

        allThemeNameList(user_theme_name).then((response) => {})
    }
    /*Rename Theme Tree Menu End*/

    //Validation For UI Uncontolled theme tree
    const canDropAtTag = (e, target) => {
        setDragFlag(true)
        let type = true;
        let parentType;
        if (target.targetType == 'between-items' && target.parentItem == "root" && e[0].type == 'TAG') {
            return false
        }
        let childId;
        let parentId;
        // for (const [key, value] of Object.entries(themeData)) {

        //     if (key == e[0].index) {
        //         // childType = (value.type === "THEMES" || value.type === "THEME" || value.type === "SUB-THEME") ? "THEME" : value.type
        //         childId = value.id ? value.id : value.parentId
        //     }
        //     if (key == target.targetItem) {
        //         parentId = value.parentId
        //         if(value.parentId == e.parentId){
        //             return false;
        //         }
        //     }
        // }
        let childTId=''
        let childType=''
        
        for (const [key, value] of Object.entries(themeData)) {            
            if (key == target.targetItem) {
                parentType = (value.type === "THEMES" || value.type === "THEME" || value.type === "SUB-THEME" || value.type === "theme") ? "THEME" : value.type
                if (parentType == "TAG") {
                    type = false
                }
            }
            if (key == e[0].index) {
                childType = (value.type === "THEMES" || value.type === "THEME" || value.type === "SUB-THEME") ? "THEME" : value.type
                childTId = value.id ? value.id : value.parentId
            }
            if (key == target.targetItem) {
                parentId = value.id ? value.id : value.parentId
                parentType = (value.type === "THEMES" || value.type === "THEME" || value.type === "SUB-THEME" || value.type === "theme") ? "THEME" : value.type

            }
            parentType = (value.type === "THEMES" || value.type === "THEME" || value.type === "SUB-THEME" || value.type === "theme") ? "THEME" : value.type
            if (key == target.parentItem) {
                parentId = value.id ? value.id : value.parentId ? value.parentId : parentId ? parentId : null

            }
            if(target.parentItem == e[0].index){
                return false;
            }
            // if(parentId == e[0].id){
            //     return false
            // }
        }
        return type
    }


    const handleUpdatedPath=(data,updatedPath,parentId)=>{
        //   let path=updatedPath ? updatedPath  + value.data + ' > ': value.data + ' > ';
        for(let i in data){
            themeData[data[i]].path = parentId ? themeData[parentId].path : themeData[data[i]].data
          //   updatedPath = updatedPath + themeData[data[i]].path + ' > '
          //     themeData[data[i]].path = updatedPath
          //     // value.path = updatedPath ? updatedPath + ' > ' : themeData[parentId].path ?  themeData[parentId].path + ' > ': value.data + ' > '
          //     if(Array.isArray(themeData[data[i]].children) && themeData[data[i]].children.length){
          //         handleUpdatedPath(themeData[data[i]].children,updatedPath,themeData[data[i]].id)
          //     }
          }
      }

    /*Try start*/
        const  dragAndDrop = (e, target) => {
        let parentType
        let parentId
        let childType
        let childTId

        for (const [key, value] of Object.entries(themeData)) {
            if (key == e[0].index) {
                childType = (value.type === "THEMES" || value.type === "THEME" || value.type === "SUB-THEME") ? "THEME" : value.type
                childTId = value.id ? value.id : value.parentId

            }
            if (key == target.targetItem) {
                value['hasChildren'] = true;
                parentId = value.id ? value.id : value.parentId
                parentType = (value.type === "THEMES" || value.type === "THEME" || value.type === "SUB-THEME" || value.type === "theme") ? "THEME" : value.type

                
            }
            if (key == target.parentItem) {
                parentType = (value.type === "THEMES" || value.type === "THEME" || value.type === "SUB-THEME" || value.type === "theme") ? "THEME" : value.type
                parentId = value.id ? value.id : value.parentId ? value.parentId : parentId ? parentId : null
            }
        }


        // setDragFlag(false)
        if (parentType != "TAG"  && childTId && parentId != childTId) {
            let user_data = {
                'knit_project_id': props.projectId,
                "seq_key": target?.childIndex ? target.childIndex.toString() : '0',
                "request_type": "hirerachy",
                "parent": {
                    "type": parentType,
                    "_id": parentId
                },
                "child": {
                    "type": childType,
                    "_id": childTId
                }
            } 
            updateThemeTreeHirerachy(user_data).then((response) => {
                let updatedPath='';
                
                for (const [key, value] of Object.entries(themeData)) {
                    // if(Array.isArray(value.children) && value.children.length >0  && value.children.includes(response.data.$oid)){
                    //     updatedPath= parentId ?  themeData[parentId].path + ' > ' : value.data
                    // }
                    updatedPath= parentId ? value.type != 'TAG' ? themeData[parentId].path + value.data + ' > ' :  themeData[parentId].path : value.data + ' > ';
                    if (childTId == value.index) {
                        value.type = response.type
                        value.parentId = parentId
                        value.path = updatedPath 
                        // value.path = updatedPath ? updatedPath : value.path + ' > '
                        if(Array.isArray(value.children) && value.children.length){
                                handleUpdatedPath(value.children,value.path,value.id)
                        }
                    }
                    
                }
                props.getTagDetails()  
                setThemeData(themeData)
                dragFlagStatusChange();
                themeColorSvg(themeData);
                setDragFlag(true)
                // setThemeData(themeData)
                // props.getThemeDetails()
            })
        }

    }
    /*Try end */


    const renameSubTheme = (item, name) => {
        setRenameItemFlag(true)
        treeRef.current.startRenamingItem(item.index)
    }

    /*Theme Menu for the Theme Tree Ui Start*/
    const renderThemePoper = (item) => {
        return (
            <>
                <Menu
                    anchorEl={anchorElPoper}
                    id="annotation-menu"
                    open={true}
                    onClose={handleClosePoper}
                    onClick={handleClosePoper}
                    PaperProps={{
                        elevation: 0,
                    }}
                    transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                >
                    <MenuItem onClick={() => {
                        addNewSubTheme(item)
                    }}>
                        Insert Theme
                    </MenuItem>
                    <MenuItem onClick={() => {
                        addNewTag(item)
                    }}>
                        Insert Tag
                    </MenuItem>
                    <MenuItem onClick={() => renameTheme(item)}>
                        Rename
                    </MenuItem>
                    <MenuItem onClick={() => {
                        removeThemeTree(item)
                    }}>
                        Delete
                    </MenuItem>
                </Menu>
            </>
        )
    }
    /*Theme Menu for the Theme Tree Ui End*/


    /*Rename Tag for the theme tree Ui Start*/
    const renameTag = (item, name) => {
        setRenameItemFlag(true)
        treeRef.current.startRenamingItem(item.index)
    }
    /*Rename Tag for the theme tree Ui End*/

    /*Tag Menu for the Theme Tree Ui Start*/
    const renderTagPoper = (item) => {
        return (
            <>
                <Menu
                    anchorEl={anchorElPoper}
                    id="annotation-menu"
                    open={true}
                    onClose={handleClosePoper}
                    onClick={handleClosePoper}
                    PaperProps={{
                        elevation: 0,
                    }}
                    transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                >
                    <MenuItem onClick={() => {
                        addInnerSubTheme(item,'subTheme')
                    }}>
                        Insert Theme
                    </MenuItem>
                    <MenuItem onClick={() => {
                        addInnerTag(item,'tags')
                    }}>
                        Insert Tag
                    </MenuItem>
                    <MenuItem onClick={() =>
                        renameTag(item)
                    }>
                        Rename
                    </MenuItem>
                    <MenuItem onClick={() =>
                        removeTag(item)
                    }>
                        Delete
                    </MenuItem>
                </Menu>
            </>
        )
    }
    /*Tag Menu for the Theme Tree Ui End*/


    /*Subtheme Menu for the Theme Tree Ui Start*/
    const renderSubThemePoper = (item) => {
        return (
            <>
                <Menu
                    anchorEl={anchorElPoper}
                    id="annotation-menu"
                    open={true}
                    onClose={handleClosePoper}
                    onClick={handleClosePoper}
                    PaperProps={{
                        elevation: 0,
                    }}
                    transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                >
                    <MenuItem onClick={() => {
                        addInnerSubTheme(item,'subTheme')
                    }}>
                        Insert Theme
                    </MenuItem>
                    <MenuItem onClick={() => {
                        addInnerTag(item,'tags')
                    }}>
                        Insert Tag
                    </MenuItem>
                    <MenuItem onClick={() => renameSubTheme(item)}>
                        Rename
                    </MenuItem>
                    <MenuItem onClick={() => {
                        removeSubThemeTree(item)
                    }}>
                        Delete
                    </MenuItem>
                </Menu>
            </>
        )
    }
    /*Subtheme Menu for the Theme Tree Ui End*/

    //get result from the Theme tree
    const generateSearchResult = (newData, searchValue) => {
        let searchThemeList = {}
        let mainParentThemeName = '';
        let parentKeys = [];
        for (const [key, value] of Object.entries(themeData)) {

            if (value.data.toLowerCase().includes(searchValue.toLowerCase()) && value.type == 'TAG') {
                searchThemeList[value.index] = {
                    index: value.index,
                    hasChildren: false,
                    value: value.data,
                    data: value.path,
                    sequence: value.sequence,
                    level: value.level,
                    id: value.id,
                    color: appThemeColor(value.sequence + 1, value.level),
                };
                parentKeys.push(value.index)

            }

            searchThemeList['root'] = {
                index: 'root',
                hasChildren: true,
                children: parentKeys,
                data: 'Root item',
                type: "theme",
            }
            let newData = [];
            newData['items'] = searchThemeData;
            setSearchThemeData(searchThemeList)
        }


    }

    // Call when Change Value in the search
    const handleOnChange = (event) => {
        setThemeNullFlag(false)
        setSearchValue(event.target.value)
        if (event.target.value.length > 0) {
            setSearchFlag(true)
            // setThemeData({})
            generateSearchResult(themeData, event.target.value);
            
        } else {
            if(JSON.stringify(themeData) == '{}'){
                setThemeNullFlag(true)
            }
            setSearchFlag(false)
            setSearchThemeData({})
            //setThemeData(oldThemeData)
        }
    }


    //called when add new Theme , sub theme or tag in the Annotation
    const handleAddNewObject = (event, themetype, item) => {
        if (event.target.value.length > 0) {
            if (event.key === "Enter") {
                if (themetype === "theme") {
                    insertMainTheme(event, item);
                }
                else if (themetype === "subTheme") {
                    insertSubTheme(event, item)
                }
                else if (themetype === "tags") {
                    insertTag(event, item);
                }
            }
        }
    }


    //reload Theme  Tree after insert Theme/sub theme/tag
    const reloadThemeTree = (value, item,parentId) => { 
        if (JSON.stringify(themeData) == '{}') {
            let parentKeys = [];
            let newThemeData = {}
            let rootThemeList = {}
            parentKeys.push(parentId)
            rootThemeList[parentId] = {
                index: parentId,
                id:parentId,
                hasChildren: false,
                children: [],
                data: value,
                color: appThemeColor(1 , 1),
                type: 'THEMES',
                isPopper: false,
                path: value + " > ",
                parentId: parentId,
            }
            rootThemeList['root'] = {
                index: 'root',
                hasChildren: true,
                children: parentKeys,
                data: 'Root item',
                type: "theme",
            }
            setThemeData(rootThemeList)
            document.getElementsByClassName('tree-container')[0].click()
        } else {
            let countLength=themeData['root'].children.length;
            themeData[parentId] = {
                index: parentId,
                hasChildren: false,
                children: [],
                data: value,
                id: parentId,
                parentId: parentId,
                color: appThemeColor( countLength+1, 1),
                type: 'THEMES',
                isPopper: false,
                path: value + " > "
            }
            themeData['root'].children.push(parentId)
            if(item){
                let newList = themeData['root'].children.filter(el => el != item.index)
                themeData['root'].children = newList;
                removeTextbar(item)
                delete themeData[item.index]
            }

            setThemeData(themeData)
            document.getElementsByClassName('tree-container')[0].click()
        }
    }

    //reload SubTheme  Tree after insert Theme/sub theme/tag
    const reloadSubThemeTree = (value, item, parentId, newString, id) => {
        let parentItem = Object.values(themeData).filter(e => (Array.isArray(e.children) && e.children.length > 0) && e.children.includes(item.index))[0]
        themeData[id] = {
            index: id,
            id: id,
            hasChildren: false,
            children: [],
            data: value,
            type: 'SUB-THEME',
            isPopper: false,
            parentId: parentItem.id,
            path: newString,
        }
        parentItem.children.push(id)
        themeData[id] = themeData[id];
        removeTextbar(item)
        delete themeData[item.index]
        setThemeData(themeData)
        document.getElementsByClassName('tree-container')[0].click()
    }

    //reload Tag  Tree after insert Theme/sub theme/tag
    const reloadTagTree = (value, item, parentId, newString, id) => {
        let parentItemTag = Object.values(themeData).filter(e => (Array.isArray(e.children) && e.children.length > 0) && e.children.includes(item.index))[0]
        themeData[id] = {
            index: id,
            hasChildren: false,
            children: [],
            data: value,
            type: 'TAG',
            isPopper: false,
            parentId: parentItemTag.id,
            id: id,
            path: parentItemTag.path,
        }
        parentItemTag.children.push(id)
        themeData[id] = themeData[id];
        removeTextbar(item)
        delete themeData[item.index]
        setThemeData(themeData)
        document.getElementsByClassName('tree-container')[0].click()
        document.getElementsByClassName('search-reload')[0].click()
    }


    //called when add new rootTheme  api call, sub theme or tag in the Annotation
    const insertMainTheme = (event, item) => {
        let user_data = {
            "parent_theme": true,
            "theme_name": event.target.value,
            "knit_project_id": props.projectId,
            "knit_user_id": props.userId
        };
        allThemeNameList(user_data).then((response) => {
            if (response.status_code == 200 && response.data) {
                setParentId(response?.parent_id)
                reloadThemeTree(event.target.value, item, response.data.$oid)
                setThemeNullFlag(false)
                props.onreload();
                document.getElementsByClassName('tree-container')[0].click()
                event.target.value=""
            }
        });
    }

    //called when add new SubTheme  api call in the Annotation
    const insertSubTheme = (event, item) => {
        let user_data = {
            "child_theme": true,
            "theme_name": event.target.value,
            "knit_project_id": props.projectId,
            "knit_user_id": props.userId,
            "parent_id": parentId,

        };
        allThemeNameList(user_data).then((response) => {
            if (response.status_code == 200 && response.data) {
                setParentId(response?.parent_id)
                reloadSubThemeTree(event.target.value, item, parentId, parentPath, response.data.$oid)     
                props.onreload();
            }
        });
    }

    //called when add new tag  api call in the Annotation
    const insertTag = (event, item) => {
        let projectType = window.localStorage.getItem("projectType")

        let user_data = {
            "tag_comment": true,
            "is_tag": true,
            "knit_project_id": props.projectId,
            "knit_user_id": props.userId,
            "knit_theme_id": parentId,
            "project_type": projectType,
            "tag_name": event.target.value
        }
        allThemeNameList(user_data).then((response) => {
            if (response.status_code == 200 && response.data) {
                setParentId(response?.parent_id)
                reloadTagTree(event.target.value, item, parentId, item.path,response.data.tag_ids[0].$oid)
                props.onreload();
                // props.getThemeDetails()
            }
        });
    }


    /*Remove Textbar in theme tree Start*/
    const removeTextbar = (item) => {
        delete themeData[item.index];
        for (const [key, value] of Object.entries(themeData)) {
            if ((Array.isArray(value.children) && value.children.length > 0) && value.children.includes(item.index)) {
                let newList = value.children.filter(el => el != item.index)
                value.children = newList;
            }
        }
        setThemeData(themeData)
    }
    /*Remove Textbar in theme tree End*/

    /*Drag Event of Tree Start*/
    const handleDrag = (event, target) => {
        for (const [key, value] of Object.entries(themeData)) {
            if (key == target.targetItem) {
                value['hasChildren'] = true;
            }
        }
    }
    /*Drag Event of Tree End*/


    const handletargetEvent = (id,item) => {
        props.tagClickEvent(id,item)
        setSearchFlag(false)
        setSearchThemeData({})
        setThemeData(oldThemeData)
    }

    const setPosition = (e,d) => {
        setX(d.x);
        setY(d.y);
        window.localStorage.setItem('x',d.x);
        window.localStorage.setItem('y', d.y)
    }


    const handleExpandItem=(item, key)=>{
        localStorage.push(item.index)
        let unique = [...new Set(localStorage)]
        setExpandedItems(unique)
        window.localStorage.setItem("expandedItemsList",JSON.stringify(unique));
    }

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <Rnd bounds="parent"
                default={{
                    x: window.localStorage.getItem("x") ? window.localStorage.getItem("x") > 60 ? window.localStorage.getItem("x") :  window.innerWidth - 585 : window.innerWidth - 585,
                    y: window.localStorage.getItem("y") ? window.localStorage.getItem("y") > 270 ? window.localStorage.getItem("y")  :  props.tanscriptWidth  : props.tanscriptWidth,
                }}
                style={{ background: '#fff', position: 'fixed', cursor: 'auto', boxShadow: 'none' }}
                disableDragging={props.drag ? props.drag : dragFlag}
                onResize={(e, direction, ref, delta, position) => {
                    setWidth(ref.offsetWidth)
                }}
                onDragStop={(e, d) => { setPosition(e,d) }}
            >
                <div 
                 className={"search-reload"}
                style={{
                    height: '100%',
                    width: '300px',
                    borderRadius: '5px',
                    // boxShadow: '0px 3px 20px #00000033',
                    paddingBottom: '20px'
                }}
                >
                    <div style={{ padding: '20px 20px 0px 20px' }}
                        onMouseMoveCapture={() => {
                            setDragFlag(false)
                            // props.onreload();
                            // this.setState({ dragFlag: true })
                        }}
                        >
                        <Typography class={'tagTitle'}>Select a tag</Typography>
                        <div className={'searchCard'}>
                            <FormControl className={"root"}>
                                <OutlinedInput
                                    id="outlined-adornment-weight search"
                                    startAdornment={<InputAdornment position="start"> <img
                                        src={SearchIcon} /></InputAdornment>}
                                    aria-describedby="outlined-weight-helper-text"
                                    labelWidth={0}
                                    onChange={handleOnChange}
                                    placeholder={"Search Tags"}
                                    autoComplete="off" 
                                onKeyDown={(e)=>{e.keyCode == '40' && treeRef.current.focusTree()}}
                                />
                            </FormControl>
                        </div>
                    </div>
                    <div className="tree-container">
                        <div id={"reload"} 
                        onMouseMoveCapture={() => {
                            setDragFlag(true)
                        }}>
                            {JSON.stringify(searchThemeData) != '{}' &&
                                <ControlledTreeEnvironment
                                getItemTitle={item => item.data}
                                viewState={{
                                    'tree-1': {
                                        focusedItem: focusedItem
                                      },
                                }}
                                items={searchThemeData}
                                classname={'tree-view-annotation'}
                                canDragAndDrop={false}
                                keyboardBindings={true}
                                canSearchByStartingTyping={false}
                                // renderTreeContainer={({ children, containerProps }) => <div {...containerProps}>{children}</div>}
                                // renderItemsContainer={({ children, containerProps }) => <ul {...containerProps}>{children}</ul>}
                                renderItem={({ item, title, arrow, depth, context, children, type }) => (
                                    <>
                                        <li
                                            {...context.itemContainerWithChildrenProps}
                                            {...context.itemContainerWithoutChildrenProps}
                                            style={{
                                                margin: 0,
                                                width: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'flex-start',
                                                position: 'relative'
                                            }}
                                        >
                                            {item.type == "text" ?
                                                <>
                                                    <div style={{ display: 'flex' }}>
                                                        <input type="text" className="annotateInput" />
                                                        <SubdirectoryArrowLeftIcon style={{ width: '12px', height: '20px', display: 'flex', alignItem: 'center' }} />
                                                    </div>
                                                </>
                                                :
                                                <Typography
                                                    {...context.itemContainerWithChildrenProps}
                                                    {...context.itemContainerWithoutChildrenProps}
                                                    {...context.interactiveElementProps}
                                                    style={{
                                                        display: 'flex',
                                                        flexWrap: 'flex-wrap',
                                                        padding: '0px 0px 10px',
                                                        alignItems: 'center',
                                                        position: 'relative',
                                                        width: '100%'
                                                    }}
                                                    onKeyDown={(e) => { e.keyCode == 13 &&  handletargetEvent(item.id) }}  
                                                    
                                                >
                                                    {arrow}
                                                    <FiberManualRecordIcon 
                                                    className="dotSymbol"
                                                     style={{ width: '10px', height: '10px', color: item.color , margin: "0px 10px 0px 0px" }} />
                                                    <span onClick={() => { handletargetEvent(item.id) }} className={'searchResult'}>
                                                        {title} <span className={'searchValue'}>{item.value}</span>
                                                    </span>
                                                    {/* {title} */}
                                                </Typography>
                                            }

                                        </li>
                                        {children}
                                    </>
                                )}
                                onFocusItem={(item, key) => { setFocusedItem(item.index) }}
                            >
                                <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" ref={treeRef} />
                            </ControlledTreeEnvironment>


                            }
                            {!searchFlag && !themeNullFlag && JSON.stringify(searchThemeData) == '{}' &&
                            <>
                                <UncontrolledTreeEnvironment
                                    dataProvider={new StaticTreeDataProvider(themeData, (item, data) => ({ ...item, data }))}
                                    getItemTitle={item => item.data}
                                    viewState={{
                                        'tree-1': {
                                          expandedItems: expandedItems,
                                        },
                                      }}
                                    canDragAndDrop={true}
                                    canReorderItems={true}
                                    keyboardBindings={true}
                                    canSearchByStartingTyping={false}
                                    onRenameItem={(item, name) => {
                                        setRenameItemFlag(false)
                                        handleRename(item, name)
                                    }}
                                    canDropOnItemWithChildren={true}
                                    keyboardBindings={{
                                        completeProgrammaticDnd: ['control'],
                                    }}

                                    canDropOnItemWithoutChildren={true}
                                    renderItem={({ item, title, arrow, depth, context, children, type }) => (
                                        <>
                                            <li
                                                {...context.itemContainerWithChildrenProps}
                                                {...context.itemContainerWithoutChildrenProps}
                                                style={{
                                                    margin: 0,
                                                    padding: '5px 0px',
                                                    width: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'flex-start',
                                                    position: 'relative'
                                                }}
                                            >

                                                {item.type == "text" ?
                                                    <>
                                                        <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                                                              <input type="text" className="annotateInput"
                                                              placeholder={item.themeType === "tags" ? "Add a Tag" : "Add a Theme" }
                                                                  onKeyPress={(event) => {
                                                                      handleAddNewObject(event, item.themeType, item)
                                                                  }}
                                                              />
                                                            <SubdirectoryArrowLeftIcon style={{
                                                                width: '12px',
                                                                height: '20px',
                                                                display: 'flex',
                                                                alignItem: 'center',
                                                                cursor: 'pointer'
                                                            }} />

                                                            <CloseIcon style={{
                                                                width: '18px',
                                                                height: '20px',
                                                                display: 'flex',
                                                                alignItem: 'center',
                                                                cursor: 'pointer'
                                                            }}
                                                                onClick={() => removeTextbar(item)}
                                                            />
                                                        </div>
                                                    </>
                                                    :
                                                <>

                                                        {item.type == "TAG" ?
                                                        <Typography
                                                        {...context.itemContainerWithoutChildrenProps}
                                                        {...context.itemContainerWithChildrenProps}
                                                        {...context.interactiveElementProps}
                                                        style={{
                                                            display: 'flex',
                                                            flexWrap: 'flex-wrap',
                                                            padding: '0px',
                                                            alignItems: 'center',
                                                            position: 'relative',
                                                            width: '100%'
                                                        }}
                                                        onKeyDown={(e) => {!renameItemFlag  && e.keyCode == 13 &&  handletargetEvent(item.id) }}
                                                        onClick={() => {!renameItemFlag && handletargetEvent(item.id,item)}}   
                                                    >
                                                        {arrow}
                                                        <FiberManualRecordIcon className="dotSymbol" style={{
                                                            width: '10px',
                                                            height: '10px',
                                                            color: item.color,
                                                            margin: "0px 10px 0px 0px"
                                                        }}
                                                        />
                                                            <span>{title}</span>
                                                            </Typography> :
                                                            <Typography
                                                        {...context.itemContainerWithoutChildrenProps}
                                                        {...context.itemContainerWithChildrenProps}
                                                        {...context.interactiveElementProps}
                                                        style={{
                                                            display: 'flex',
                                                            flexWrap: 'flex-wrap',
                                                            padding: '0px',
                                                            alignItems: 'center',
                                                            position: 'relative',
                                                            width: '100%'
                                                        }}
                                                    >
                                                        {arrow}
                                                        <FiberManualRecordIcon className="dotSymbol" style={{
                                                            width: '10px',
                                                            height: '10px',
                                                            color: item.color,
                                                            margin: "0px 10px 0px 0px"
                                                        }}
                                                        />
                                                            <span>{title} </span>
                                                            </Typography>
                                                        }

                                                </>
                                                }

                                                {item.type != "text" &&
                                                    <IconButton
                                                        size="small"
                                                        aria-haspopup="true"
                                                        onClick={handleOpenPoper('bottom-start', item)}
                                                        onClose={handleClosePoper}
                                                    >
                                                        <MoreVertIcon className={'dotIcon'}
                                                        />
                                                    </IconButton>
                                                }
                                                {
                                                    <>
                                                        {(item.type === "THEME" || item.type === "THEMES") && item.isPopper == true && (
                                                            <>
                                                                {renderThemePoper(item)}
                                                            </>
                                                        )}
                                                        {item.type === "SUB-THEME" && item.isPopper == true && (
                                                            <>
                                                                {renderSubThemePoper(item)}
                                                            </>
                                                        )}
                                                        {item.type === "TAG" && item.isPopper == true && (
                                                            <>
                                                                {renderTagPoper(item)}
                                                            </>
                                                        )
                                                        }
                                                    </>
                                                }

                                            </li>
                                            {children}
                                        </>
                                    )}
                                    defaultInteractionMode={{
                                        mode: 'custom',
                                        extends: 'click-item-to-expand',
                                        createInteractiveElementProps: (item, treeId, actions, renderFlags) => ({
                                            onMouseOver: () => {
                                                document
                                                .querySelectorAll(`[data-rct-tree="tree-1"] [data-rct-item-id]`)
                                                .forEach(element => (element.style.background = 'transparent'));
                                                document.querySelector(`[data-rct-tree="tree-1"]  [data-rct-item-id="${item.index}"]`).style.background =
                                                '#EFEFEF';
                                            },
                                            onKeyPressCapture: () => {
                                            
                                            document
                                              .querySelectorAll(`[data-rct-tree="tree-1"] [data-rct-item-id]`)
                                              .forEach(element => (element.style.background = 'transparent'));
                                            document.querySelector(`[data-rct-tree="tree-1"]  [data-rct-item-id="${item.index}"]`).style.background =
                                              '#EFEFEF';
                                          },
                                        }),
                                      }}
                                    onExpandItem={(item, key) => { handleExpandItem(item, key) }}
                                    canDropAt={(e, target) => {
                                        return canDropAtTag(e, target);
                                    }}
                                    onDrop={(e, target) => {  dragAndDrop(e, target) }}
                                >
                                    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" type="theme" ref={treeRef} />
                                </UncontrolledTreeEnvironment>
                                <div style={{display:'flex',marginLeft:11}}>
                                    <FiberManualRecordIcon className="dotSymbol" style={{
                                        width: '10px',
                                        height: '10px',
                                        color: 'rgb(18, 152, 138)',
                                        margin: "10px"
                                    }}
                                    />
                                    <input
                                    type="text"
                                    id="outlined-basic"
                                    label=""
                                    variant="outlined"
                                    placeholder={"+ Add Theme"}
                                    className={"theme-inputBox addTheme"}
                                    style={{ marginLeft: 0, width: 'calc(100% - 0px)' }}
                                    onKeyDown={(event,item) => {
                                        if (event.keyCode == 13 && event.target.value.trim().length > 0) {
                                            insertMainTheme(event,item);
                                        }
                                    }}
                                />
                                 <SubdirectoryArrowLeftIcon class={"main-theme-icon"}/>
                                </div>
                            </>
                            }
                            {themeNullFlag &&
                                <input
                                    type="text"
                                    id="outlined-basic"
                                    label=""
                                    variant="outlined"
                                    placeholder={"+ Add Theme"}
                                    className={"theme-inputBox addTheme"}
                                    style={{ marginLeft: 0, width: 'calc(100% - 0px)' }}
                                    onKeyDown={(event,item) => {
                                        if (event.keyCode == 13 && event.target.value != "") {
                                            insertMainTheme(event,item);
                                        }
                                    }}
                                />
                            }
                        </div>
                    </div>
                </div>
            </Rnd>
        </ClickAwayListener>
    );
}
