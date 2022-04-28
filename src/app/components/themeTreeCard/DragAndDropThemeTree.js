import React from 'react';
//import styled from 'styled-components';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
//import './index.css';
import { Tree } from 'antd';
import {Grid, Typography, withStyles} from "@material-ui/core";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import { DownOutlined,RightOutlined,MoreOutlined,EnterOutlined } from '@ant-design/icons';
import MoreVertIcon from "@material-ui/core/SvgIcon/SvgIcon";
import Popper from "@material-ui/core/Popper/Popper";
import TableCell from "@material-ui/core/TableCell/TableCell";
import Color from "../../config/Color";
import './DragAndDropThemeTree.scss'
import childSubtheme from "../../../assets/images/themeTree/childSubtheme.svg";
import childTag from "../../../assets/images/themeTree/childTag.svg";
import subthemeBelow from "../../../assets/images/themeTree/subthemeBelow.svg";
import tagBelow from "../../../assets/images/themeTree/tagBelow.svg";
import { Popover, Button,Input } from 'antd';
import {allThemeNameList,insertChildTag,updateThemeTreeHirerachy,deleteTagThemeTree} from "../../services/ThemeService";
import Alert from "@material-ui/lab/Alert/Alert";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import Skeleton from "@material-ui/lab/Skeleton";
import SubdirectoryArrowLeftIcon from "@material-ui/icons/SubdirectoryArrowLeft";
import ClearIcon from '@material-ui/icons/Clear';
import DeleteModel from "../../components/deleteModal/DeleteModel"

const x = 3;
const y = 2;
const z = 1;
const gData = [];

const generateData = (_level, _preKey, _tns) => {
    const preKey = _preKey || '0';
    const tns = _tns || gData;

    const children = [];
    for (let i = 0; i < x; i++) {
        const key = `${preKey}-${i}`;
        tns.push({ title: "test", key });
        if (i < y) {
            children.push(key);
        }
    }
    if (_level < 0) {
        return tns;
    }
    const level = _level - 1;
    children.forEach((key, index) => {
        tns[index].children = [];
        return generateData(level, key, tns[index].children);
    });
};
generateData(z);

const styles={
    moreVertIcon: {
        "&:active": {
            backgroundColor: Color.lightGreyShadow
        },
        borderRadius: 6,
        cursor:'pointer'
    },
}
const text = <span>Title</span>;
const data = [];

var treeData=[
    {
        // title: <FiberManualRecordIcon style={{width:15,height:28}} />+'Theme Title is here',
        title: <b>Theme Title is here</b>,
        key: '0-0',
        //icon: <FiberManualRecordIcon style={{width:15,height:28}} />,
        children: [
            {
                title: 'SubTheme Title1',
                //title: subTheme(),
                key: '0-0-0',
                icon: '',
                children: [
                    {
                        title: 'Tag1',
                        key: '0-0-0-0',
                        icon: ''
                    },

                ],

            },
            {
                title: 'SubTheme Title2',
                //title:textbox(),
                key: '0-0-1',
                icon: '',
                children: [
                    {
                        title: 'Tag1',
                        key: '0-0-1-0',
                        icon: false
                    },
                    {
                        title: 'Tag2',
                        key: '0-0-1-1',
                        icon: ''
                    }
                ],

            },
            {
                title: 'SubTheme Title3',
                key: '0-0-2',
                icon: '',
                children: [
                    {
                        title: 'Tag1',
                        key: '0-0-2-0',
                        icon: ''
                    },
                    {
                        title: 'Tag2',
                        key: '0-0-2-1',
                        icon: '',
                        switcherIcon: '',

                    },

                ],

            },

        ],

    },

];
//treeData['children'][0] ;


const GenrateTextbox=({textboxName,getTextboxvalue,handleOnChange,textboxValue,clearTextBox })=>(


    <div style={{display:'flex'}}  className={'addDynamicTheme'}>
        {/*{console.log('textboxValue.......',textboxValue)}*/}
        <Input name={textboxName} onKeyUp={(e)=>{getTextboxvalue(e)}} onChange={(event)=>{handleOnChange(event)}} placeholder={"Enter Text"} defaultValue={textboxValue} prefix=""
               suffix={<Button onClick={()=>{getTextboxvalue()}}><SubdirectoryArrowLeftIcon className={"add-theme-active"} /></Button> }/>
        {/*<EnterOutlined  onClick={getTextboxvalue()}/>*/}
        {/*<Button onClick={()=>{getTextboxvalue()}}><SubdirectoryArrowLeftIcon  className={"add-theme-active"} /></Button>*/}
        <Button onClick={()=>{clearTextBox()}}><ClearIcon color={"inherit"} className={"add-theme-active"} /></Button>

    </div>
)




const SubTheme=({id,textboxfun,SubThemeTitleName,themeID,tagfun,themeType})=>(
     <div>
         {/*{console.log('ThemeTYpe.......',themeType)}*/}
         <p className={'subtheme-text-newLine'} onClick={()=> {tagfun(themeID,themeType)}}> {SubThemeTitleName}</p>
    {/*{console.log('key-------->',id)}*/}
        <Popover placement="rightTop"

            //content={content}
                 content={
                     <div>

                         <p><Popover placement="rightTop" className={''}
                                            content={
                                                <div >
                                                    <p onClick={()=>{textboxfun('childSubtheme',id,SubThemeTitleName)}}><img src={childSubtheme} className={"icon"} style={{margin:5}}></img> Child Subtheme</p>
                                                    <p onClick={()=>{textboxfun('subthemeBelow',id,SubThemeTitleName)}}><img src={subthemeBelow} className={"icon"} style={{margin:5}}></img> Subtheme below</p>
                                                    <p onClick={()=>{textboxfun('childTag',id,SubThemeTitleName)}}><img src={childTag} className={"icon"} style={{margin:5}}></img> Child Tag</p>
                                                    <p className={"mb-0"} onClick={()=>{textboxfun('tagBelow',id,SubThemeTitleName)}}><img src={tagBelow} className={"icon"} style={{margin:5}}></img> Tag below</p>
                                                </div>
                                            }
                                            trigger="hover">
                             Insert <RightOutlined height={10} width={10} className={'right-arrow-icon'}/>
                         </Popover> </p>
                         <p onClick={()=>textboxfun('Rename',id,SubThemeTitleName)}>Rename</p>
                         {/*<p onClick={()=>{textboxfun('Rename'+id+''+SubThemeTitleName,'test','test111')}}>Rename</p>*/}
                         <p className={"mb-0"} onClick={()=>{textboxfun('Delete',id,SubThemeTitleName)}}>Delete</p>
                     </div>
                 }
                 trigger="click">

            <MoreOutlined />
        </Popover>

        {/*<MoreVertIcon className={{...styles.moreVertIcon}}/>*/}

        {/*<Popper open={true} anchorEl={null} placement={"bottom-end"} transition>*/}
        {/*    <div className={"popper-main"} >*/}
        {/*        /!*<CloseIcon className={"close-icon"} />*!/*/}
        {/*        <Typography className={"popper-lable"}>test</Typography>*/}
        {/*    </div>*/}
        {/*</Popper>*/}

    </div>

);
// Add Three Dot Menu for Third Layer SUBTHEME in theme Tree
const SubThemeThird=({id,textboxfun,SubThemeTitleName,themeID,tagfun,themeType})=>(
    <div>
        {/*{console.log('ThemeTYpe.......',themeType)}*/}
        <p className={'subtheme-text-newLine'} onClick={()=> {tagfun(themeID,themeType)}}> {SubThemeTitleName}</p>
        {/*{console.log('key-------->',id)}*/}
        <Popover placement="rightTop"

            //content={content}
                 content={
                     <div>

                         <p><Popover placement="rightTop" className={''}
                                     content={
                                         <div >
                                             <p onClick={()=>{textboxfun('childSubtheme',id,SubThemeTitleName)}}><img src={childSubtheme} className={"icon"} style={{margin:5}}></img> Child Subtheme</p>
                                             <p onClick={()=>{textboxfun('subthemeBelow',id,SubThemeTitleName)}}><img src={subthemeBelow} className={"icon"} style={{margin:5}}></img> Subtheme below</p>
                                             <p onClick={()=>{textboxfun('childTag',id,SubThemeTitleName)}}><img src={childTag} className={"icon"} style={{margin:5}}></img> Child Tag</p>
                                             <p className={"mb-0"} onClick={()=>{textboxfun('tagBelow',id,SubThemeTitleName)}}><img src={tagBelow} className={"icon"} style={{margin:5}}></img> Tag below</p>
                                         </div>
                                     }
                                     trigger="hover">
                             Insert <RightOutlined height={10} width={10} className={'right-arrow-icon'}/>
                         </Popover> </p>
                         <p onClick={()=>textboxfun('Rename',id,SubThemeTitleName)}>Rename</p>
                         {/*<p onClick={()=>{textboxfun('Rename'+id+''+SubThemeTitleName,'test','test111')}}>Rename</p>*/}
                         <p className={"mb-0"} onClick={()=>{textboxfun('Delete',id,SubThemeTitleName)}}>Delete</p>
                     </div>
                 }
                 trigger="click">

            <MoreOutlined />
        </Popover>

        {/*<MoreVertIcon className={{...styles.moreVertIcon}}/>*/}

        {/*<Popper open={true} anchorEl={null} placement={"bottom-end"} transition>*/}
        {/*    <div className={"popper-main"} >*/}
        {/*        /!*<CloseIcon className={"close-icon"} />*!/*/}
        {/*        <Typography className={"popper-lable"}>test</Typography>*/}
        {/*    </div>*/}
        {/*</Popper>*/}

    </div>

);
// Add Three Dot Menu for Fourth Layer SUBTHEME in theme Tree
const SubThemeFourth=({id,textboxfun,SubThemeTitleName,themeID,tagfun,themeType})=>(
    <div>
        {/*{console.log('ThemeTYpe.......',themeType)}*/}
        <p className={'subtheme-text-newLine'} onClick={()=> {tagfun(themeID,themeType)}}> {SubThemeTitleName}</p>
        {/*{console.log('key-------->',id)}*/}
        <Popover placement="rightTop"

            //content={content}
                 content={
                     <div>

                         <p><Popover placement="rightTop" className={''}
                                     content={
                                         <div >
                                             <p onClick={()=>{textboxfun('childSubtheme',id,SubThemeTitleName)}}><img src={childSubtheme} className={"icon"} style={{margin:5}}></img> Child Subtheme</p>
                                             <p onClick={()=>{textboxfun('subthemeBelow',id,SubThemeTitleName)}}><img src={subthemeBelow} className={"icon"} style={{margin:5}}></img> Subtheme below</p>
                                             <p onClick={()=>{textboxfun('childTag',id,SubThemeTitleName)}}><img src={childTag} className={"icon"} style={{margin:5}}></img> Child Tag</p>
                                             <p className={"mb-0"} onClick={()=>{textboxfun('tagBelow',id,SubThemeTitleName)}}><img src={tagBelow} className={"icon"} style={{margin:5}}></img> Tag below</p>
                                         </div>
                                     }
                                     trigger="hover">
                             Insert <RightOutlined height={10} width={10} className={'right-arrow-icon'}/>
                         </Popover> </p>
                         <p onClick={()=>textboxfun('Rename',id,SubThemeTitleName)}>Rename</p>
                         {/*<p onClick={()=>{textboxfun('Rename'+id+''+SubThemeTitleName,'test','test111')}}>Rename</p>*/}
                         <p className={"mb-0"} onClick={()=>{textboxfun('Delete',id,SubThemeTitleName)}}>Delete</p>
                     </div>
                 }
                 trigger="click">

            <MoreOutlined />
        </Popover>

        {/*<MoreVertIcon className={{...styles.moreVertIcon}}/>*/}

        {/*<Popper open={true} anchorEl={null} placement={"bottom-end"} transition>*/}
        {/*    <div className={"popper-main"} >*/}
        {/*        /!*<CloseIcon className={"close-icon"} />*!/*/}
        {/*        <Typography className={"popper-lable"}>test</Typography>*/}
        {/*    </div>*/}
        {/*</Popper>*/}

    </div>

);

const ThemeTag=({id,textboxfun,SubThemeTitleName,themeID,tagfun,themeType})=>(
    <div>
        <p className={'subtheme-text-newLine'} onClick={()=> {tagfun(themeID,themeType)}}> {SubThemeTitleName}</p>
        <Popover placement="rightTop"

            //content={content}
                 content={
                     <div>

                         <p> <Popover placement="rightTop" className={''}
                                            content={
                                                <div >
                                                    {/*<p onClick={()=>{textboxfun('childSubtheme',id,SubThemeTitleName)}}><img src={childSubtheme} className={"icon"} style={{margin:5}}></img> Child Subtheme</p>*/}
                                                    <p onClick={()=>{textboxfun('subthemeBelow',id,SubThemeTitleName)}}><img src={subthemeBelow} className={"icon"} style={{margin:5}}></img> Subtheme below</p>
                                                    {/*<p onClick={()=>{textboxfun('childTag',id,SubThemeTitleName)}}><img src={childTag} className={"icon"} style={{margin:5}}></img> Child Tag</p>*/}
                                                    <p className={"mb-0"} onClick={()=>{textboxfun('tagBelow',id,SubThemeTitleName)}}><img src={tagBelow} className={"icon"} style={{margin:5}}></img> Tag below</p>
                                                </div>
                                            }
                                            trigger="hover">
                             Insert <RightOutlined height={10} width={10} className={'right-arrow-icon'}/>
                         </Popover></p>
                         <p onClick={()=>textboxfun('Rename',id,SubThemeTitleName)}>Rename</p>
                         {/*<p onClick={()=>{textboxfun('Rename'+id+''+SubThemeTitleName,'test','test111')}}>Rename</p>*/}
                         <p className={"mb-0"} onClick={()=>{textboxfun('Delete',id,SubThemeTitleName)}}>Delete</p>
                     </div>
                 }
                 trigger="click">

            <MoreOutlined />
        </Popover>

        {/*<MoreVertIcon className={{...styles.moreVertIcon}}/>*/}

        {/*<Popper open={true} anchorEl={null} placement={"bottom-end"} transition>*/}
        {/*    <div className={"popper-main"} >*/}
        {/*        /!*<CloseIcon className={"close-icon"} />*!/*/}
        {/*        <Typography className={"popper-lable"}>test</Typography>*/}
        {/*    </div>*/}
        {/*</Popper>*/}

    </div>
);

// Add Three Dot Menu for Third Layer TAG in theme Tree
const ThemeTagThird=({id,textboxfun,SubThemeTitleName,themeID,tagfun,themeType})=>(
    <div>
        <p className={'subtheme-text-newLine'} onClick={()=> {tagfun(themeID,themeType)}}> {SubThemeTitleName}</p>
        <Popover placement="rightTop"

            //content={content}
                 content={
                     <div>

                         <p> <Popover placement="rightTop" className={''}
                                      content={
                                          <div >
                                              {/*<p onClick={()=>{textboxfun('childSubtheme',id,SubThemeTitleName)}}><img src={childSubtheme} className={"icon"} style={{margin:5}}></img> Child Subtheme</p>*/}
                                              <p onClick={()=>{textboxfun('subthemeBelow',id,SubThemeTitleName)}}><img src={subthemeBelow} className={"icon"} style={{margin:5}}></img> Subtheme below</p>
                                              {/*<p onClick={()=>{textboxfun('childTag',id,SubThemeTitleName)}}><img src={childTag} className={"icon"} style={{margin:5}}></img> Child Tag</p>*/}
                                              <p className={"mb-0"} onClick={()=>{textboxfun('tagBelow',id,SubThemeTitleName)}}><img src={tagBelow} className={"icon"} style={{margin:5}}></img> Tag below</p>
                                          </div>
                                      }
                                      trigger="hover">
                             Insert <RightOutlined height={10} width={10} className={'right-arrow-icon'}/>
                         </Popover></p>
                         <p onClick={()=>textboxfun('Rename',id,SubThemeTitleName)}>Rename</p>
                         {/*<p onClick={()=>{textboxfun('Rename'+id+''+SubThemeTitleName,'test','test111')}}>Rename</p>*/}
                         <p className={"mb-0"} onClick={()=>{textboxfun('Delete',id,SubThemeTitleName)}}>Delete</p>
                     </div>
                 }
                 trigger="click">

            <MoreOutlined />
        </Popover>

        {/*<MoreVertIcon className={{...styles.moreVertIcon}}/>*/}

        {/*<Popper open={true} anchorEl={null} placement={"bottom-end"} transition>*/}
        {/*    <div className={"popper-main"} >*/}
        {/*        /!*<CloseIcon className={"close-icon"} />*!/*/}
        {/*        <Typography className={"popper-lable"}>test</Typography>*/}
        {/*    </div>*/}
        {/*</Popper>*/}

    </div>
);

// Add Three Dot Menu for Fourth Layer TAG in theme Tree
const ThemeTagFourth=({id,textboxfun,SubThemeTitleName,themeID,tagfun,themeType})=>(
    <div>
        <p className={'subtheme-text-newLine'} onClick={()=> {tagfun(themeID,themeType)}}> {SubThemeTitleName}</p>
        <Popover placement="rightTop"

            //content={content}
                 content={
                     <div>

                         <p> <Popover placement="rightTop" className={''}
                                      content={
                                          <div >
                                              {/*<p onClick={()=>{textboxfun('childSubtheme',id,SubThemeTitleName)}}><img src={childSubtheme} className={"icon"} style={{margin:5}}></img> Child Subtheme</p>*/}
                                              <p onClick={()=>{textboxfun('subthemeBelow',id,SubThemeTitleName)}}><img src={subthemeBelow} className={"icon"} style={{margin:5}}></img> Subtheme below</p>
                                              {/*<p onClick={()=>{textboxfun('childTag',id,SubThemeTitleName)}}><img src={childTag} className={"icon"} style={{margin:5}}></img> Child Tag</p>*/}
                                              <p className={"mb-0"} onClick={()=>{textboxfun('tagBelow',id,SubThemeTitleName)}}><img src={tagBelow} className={"icon"} style={{margin:5}}></img> Tag below</p>
                                          </div>
                                      }
                                      trigger="hover">
                             Insert <RightOutlined height={10} width={10} className={'right-arrow-icon'}/>
                         </Popover></p>
                         <p onClick={()=>textboxfun('Rename',id,SubThemeTitleName)}>Rename</p>
                         {/*<p onClick={()=>{textboxfun('Rename'+id+''+SubThemeTitleName,'test','test111')}}>Rename</p>*/}
                         <p className={"mb-0"} onClick={()=>{textboxfun('Delete',id,SubThemeTitleName)}}>Delete</p>
                     </div>
                 }
                 trigger="click">

            <MoreOutlined />
        </Popover>

        {/*<MoreVertIcon className={{...styles.moreVertIcon}}/>*/}

        {/*<Popper open={true} anchorEl={null} placement={"bottom-end"} transition>*/}
        {/*    <div className={"popper-main"} >*/}
        {/*        /!*<CloseIcon className={"close-icon"} />*!/*/}
        {/*        <Typography className={"popper-lable"}>test</Typography>*/}
        {/*    </div>*/}
        {/*</Popper>*/}

    </div>
);

const ThemeTitleName=({id,textboxfun,SubThemeTitleName,tagfun,themeID,themeType})=>(
    <div>
        <p style={{color:"#001839",fontWeight:'500', marginBottom: '0px'}} onClick={()=> {tagfun(themeID,themeType)}}>{SubThemeTitleName}</p>
        {/*{SubThemeTitleName}*/}
        <Popover placement="rightTop"

            //content={content}
                 content={
                     <div>

                         <p> <Popover placement="rightTop" className={''}
                                            content={
                                                <div >
                                                    <p onClick={()=>{textboxfun('childSubtheme',id,SubThemeTitleName)}}><img src={childSubtheme} className={"icon"} style={{margin:5}}></img> Child Subtheme</p>
                                                    {/*<p onClick={()=>{textboxfun('subthemeBelow',id,SubThemeTitleName)}}><img src={subthemeBelow} className={"icon"} style={{margin:5}}></img> Subtheme below</p>*/}
                                                    <p onClick={()=>{textboxfun('childTag',id,SubThemeTitleName)}}><img src={childTag} className={"icon"} style={{margin:5}}></img> Child Tag</p>
                                                    {/*<p className={"mb-0"} onClick={()=>{textboxfun('tagBelow',id,SubThemeTitleName)}}><img src={tagBelow} className={"icon"} style={{margin:5}}></img> Tag below</p>*/}
                                                </div>
                                            }
                                            trigger="hover">
                             Insert <RightOutlined height={10} width={10} className={'right-arrow-icon'}/>
                         </Popover></p>
                         <p onClick={()=>textboxfun('Rename',id,SubThemeTitleName)}>Rename</p>
                         {/*<p onClick={()=>{textboxfun('Rename'+id+''+SubThemeTitleName,'test','test111')}}>Rename</p>*/}
                         <p className={"mb-0"} onClick={()=>{textboxfun('Delete',id,SubThemeTitleName)}}>Delete</p>
                     </div>
                 }
                 trigger="click">

            <MoreOutlined />
        </Popover>

        {/*<MoreVertIcon className={{...styles.moreVertIcon}}/>*/}

        {/*<Popper open={true} anchorEl={null} placement={"bottom-end"} transition>*/}
        {/*    <div className={"popper-main"} >*/}
        {/*        /!*<CloseIcon className={"close-icon"} />*!/*/}
        {/*        <Typography className={"popper-lable"}>test</Typography>*/}
        {/*    </div>*/}
        {/*</Popper>*/}

    </div>

)

const ThemeTitle=({ThemeTitleName})=>(

    <p style={{color:"#001839",fontWeight:'500', marginBottom: '0px'}}>{ThemeTitleName}</p>





)


function getIndexNumber(indexValue) {

if(indexValue){
    var inputValue = indexValue[0];

    const fields = inputValue.split('-');

    let finalIndex = fields[2]
    return finalIndex;
}
}
function getIndexNumberThird(indexValue) {

    if(indexValue){
        var inputValue = indexValue[0];

        const fields = inputValue.split('-');

        let finalIndex = fields[3]
        return finalIndex;
    }


}
function getIndexNumberFourth(indexValue) {

    if(indexValue){
        var inputValue = indexValue[0];

        const fields = inputValue.split('-');

        let finalIndex = fields[4]
        return finalIndex;
    }


}
class Demo extends React.Component {
    state = {
        //gData:treeData,
        gData:[],
        expandedKeys: ['0-0', '0-0-0', '0-0-0-0','0-0-0-0-0'],
        //expandedKeys: '',
        anchorEl:null,
        childSubthemeText:'',
        childTagText:'',
        tagBelow:'',
        themeTitleColor:'',
        renameText:'',
        renameIndex:'',
        renameIndexThird:'',
        renameIndexFourth:'',
        currentIndex:'',
        subthemeBelowText:'',
        tagBelowText:'',
        childSubthemeIndexData:'',
        childSubthemeIndexChild:'',
        childSubthemeIndexChildThird:'',
        childSubthemeIndexChildFourth:'',
        totalSubtheme:[],
        totalSubthemeThird:[],
        totalSubthemeFourth:[],
        knitProjectId:'',
        knitUserId:'',
        parentThemeId:'',
        expandParent:false,
        hirerachyWarningMessage:false,
        dropSeqkey:'',
        textValidationFlag:'',
        deleteThemeModalFlag:false,
        deleteSubThemeModalFlag:false,
        description:'Are you sure you want to delete the theme you selected? Once you delete a theme, it will be removed from all videos and responses that it has been used, and all subthemes and tags within the theme will also be deleted. This action cannot be undone.',
        subThemeDescription:'Are you sure you want to delete the subtheme you selected ? Once you delete a subtheme, it will be removed from all videos and responses that it has been used, and all subthemes and tags under the selected subtheme will also be deleted. This action cannot be undone.',
        deleteTagModalFlag:false,
        TagDescription:'Are you sure you want to delete the tag you selected? Once you delete a tag, it will be removed from all videos and responses that it has been used. This action cannot be undone.'
    };

    componentDidMount() {
this.setState({
    knitProjectId:this.props.data.knit_project_id.$oid,
    knitUserId:this.props.data.knit_user_id.$oid,
    parentThemeId:this.props.data._id.$oid
})
        this.loadThemeTitleTree(this.props.data.knit_project_id.$oid,this.props.data._id.$oid);


        //ThemeColor(this.props.color);


        // this.getColor(1)
        {/*<ThemeColor primary={this.props.color} />*/}


        {/*<ThemeColor ThemeColorCode={this.props.color}/>*/}
        this.setState({ themeTitleColor:this.props.color});
 
    }



    loadThemeTitleTree= async (knit_project_id,parent_theme_id)=>{
        this.setState({isThemeBoxSkel:true})
       // this.setState({ gData:"" });

        let user_data = {
            "knit_theme_id": true,
            "knit_project_id": knit_project_id,
            "parent_theme_id": parent_theme_id
        };
        allThemeNameList(user_data).then((response) => {

let responseData = response.data
this.addThreeDotMenu(responseData);
          
            this.setState({ gData:responseData,isThemeBoxSkel:false});
            //this.setState({ themeData:response.data });
        });

    }
clearTextBoxTheme=()=>{
    this.loadThemeTitleTree(this.state.knitProjectId,this.state.parentThemeId);
}

    addThreeDotMenu=(responseData)=>{

        let data = responseData[0].children

        this.setState({ totalSubtheme:data});

        responseData[0].title = <ThemeTitleName key={responseData[0].key} themeID={responseData[0]._id} themeType={responseData[0].type} SubThemeTitleName={responseData[0].title} tagfun={(subthemeId,themeType)=>{this.tagFrequencyFunction(subthemeId,themeType)}} textboxfun={(value,id,themeName)=>{this.themeTitleOperation(value,id,themeName)}}/>
        for(let i in data){

            if(responseData[0].children[i].children) {
                let second = responseData[0].children[i].children

                if (second.length > 0) {
                    this.setState({totalSubthemeThird: second});
                for (let j in second) {
                    if (second[j].title && second[j].key && second[j].type === "TAG") {
                        responseData[0].children[i].children[j].title =
                            <ThemeTagThird key={second[j].key} themeID={second[j]._id} themeType={second[j].type}
                                           SubThemeTitleName={second[j].title} tagfun={(subthemeId, themeType) => {
                                this.tagFrequencyFunction(subthemeId, themeType)
                            }} textboxfun={(value, id, themeName) => {
                                this.textboxFunctionThird(value, id, themeName)
                            }}/>
                    }

                    if (second[j].title && second[j].key && second[j].type === "THEME") {
                        responseData[0].children[i].children[j].title =
                            <SubThemeThird key={second[j].key} themeID={second[j]._id} themeType={second[j].type}
                                           SubThemeTitleName={second[j].title} tagfun={(subthemeId, themeType) => {
                                this.tagFrequencyFunction(subthemeId, themeType)
                            }} textboxfun={(value, id, themeName) => {
                                this.textboxFunctionThird(value, id, themeName)
                            }}/>
                    }


                    //for 3rd and Forth layer in theme tree
                    if (responseData[0].children[i].children[j].children) {

                        let third = responseData[0].children[i].children[j].children
                        if (third.length > 0) {
                            this.setState({totalSubthemeFourth: third});
                            for (let k in third) {
                                if (third[k].title && third[k].key && third[k].type === "TAG") {
                                    responseData[0].children[i].children[j].children[k].title =
                                        <ThemeTagFourth key={third[k].key} themeID={third[k]._id}
                                                        themeType={third[k].type} SubThemeTitleName={third[k].title}
                                                        tagfun={(subthemeId, themeType) => {
                                                            this.tagFrequencyFunction(subthemeId, themeType)
                                                        }} textboxfun={(value, id, themeName) => {
                                            this.textboxFunctionFourth(value, id, themeName)
                                        }}/>
                                }

                                if (third[k].title && third[k].key && third[k].type === "THEME") {
                                    responseData[0].children[i].children[j].children[k].title =
                                        <SubThemeFourth key={third[k].key} themeID={third[k]._id}
                                                        themeType={third[k].type} SubThemeTitleName={third[k].title}
                                                        tagfun={(subthemeId, themeType) => {
                                                            this.tagFrequencyFunction(subthemeId, themeType)
                                                        }} textboxfun={(value, id, themeName) => {
                                            this.textboxFunctionFourth(value, id, themeName)
                                        }}/>
                                }

                            }
                        }

                    }


                }
            }

            }


            if(data[i].title && data[i].key && data[i].type === "TAG"){
                responseData[0].children[i].title = <ThemeTag key={data[i].key} themeID={data[i]._id} themeType={data[i].type} SubThemeTitleName={data[i].title} tagfun={(subthemeId,themeType)=>{this.tagFrequencyFunction(subthemeId,themeType)}} textboxfun={(value,id,themeName)=>{this.textboxFunction(value,id,themeName)}}/>
            }

            if(data[i].title && data[i].key && data[i].type === "THEME"){
               responseData[0].children[i].title = <SubTheme key={data[i].key} themeID={data[i]._id} themeType={data[i].type} SubThemeTitleName={data[i].title} tagfun={(subthemeId,themeType)=>{this.tagFrequencyFunction(subthemeId,themeType)}} textboxfun={(value,id,themeName)=>{this.textboxFunction(value,id,themeName)}}/>

        }
             this.setState({ gData:responseData});
        }
    }


    tagFrequencyFunction = (themeId,themeType)=>{
        this.props.tagFrequency(themeId,themeType);

    }



    themeTitleOperation=(textboxData,key,themeName)=>{
       
        if(textboxData === "Rename"){

            var newStateArray = this.state.gData.slice();

            newStateArray[0].title=<GenrateTextbox textboxName={'renameText'} clearTextBox={()=>{this.clearTextBoxTheme()}} textboxValue={themeName} getTextboxvalue={(e,value)=>{ if(e.target.value != null && e.target.value != ""  && e.keyCode == 13){this.getThemeTitleTextboxData(e,value,textboxData)}else if(e.target.value == null || e.target.value == "" ){ this.setState({themeTitleNullError:true})}}} handleOnChange={(event)=>{this.handleOnChange(event)}}/>

            this.setState({gData:newStateArray})
        }
        else if(textboxData === "Delete"){

            var newStateArray = this.state.gData.slice();
            
            this.setState({deleteThemeModalFlag:true,selectedThemeId:newStateArray[0]._id})
        }
        else if(textboxData === "childSubtheme"){

            var newStateArray = this.state.gData.slice();

            newStateArray[0].children.push({title:<GenrateTextbox textboxName={'childSubthemeText'} clearTextBox={()=>{this.clearTextBoxTheme()}} getTextboxvalue={(e,value)=>{ if(e.target.value != null && e.target.value != ""  && e.keyCode == 13){this.getThemeTitleTextboxData(e,value,textboxData)}else if(e.target.value == null || e.target.value == "" ){ this.setState({themeTitleNullError:true})}}} handleOnChange={(event)=>{this.handleOnChange(event)}}/>});

            this.setState({gData:newStateArray,})
        }
        else if(textboxData === "childTag"){

            var newStateArray = this.state.gData.slice();

            newStateArray[0].children.push({title:<GenrateTextbox textboxName={'childTagText'} clearTextBox={()=>{this.clearTextBoxTheme()}} getTextboxvalue={(e,value)=>{ if(e.target.value != null && e.target.value != ""  && e.keyCode == 13){this.getThemeTitleTextboxData(e,value,textboxData)}else if(e.target.value == null || e.target.value == "" ){ this.setState({themeTitleNullError:true})}}} handleOnChange={(event)=>{this.handleOnChange(event)}}/>});

            this.setState({gData:newStateArray})
        }
        else {
        }
    }

    getThemeTitleTextboxData=(event,textboxvalue,optionName)=>{
        if(event.keyCode == 13) {
            if (optionName === "Rename") {

                var newStateArray = this.state.gData.slice();
                newStateArray[0].title = this.state.renameText;

                this.renameThemeTitle(this.state.parentThemeId, this.state.renameText, "THEME")

                this.addThreeDotMenu(newStateArray);

                this.setState({gData: newStateArray})
                // this.loadThemeTitleTree(this.state.knitProjectId,this.state.parentThemeId);
            } else if (optionName === "Delete") {
                //textbox("","");s
            } else if (optionName === "childSubtheme") {

                var newStateArray = this.state.gData.slice();
                //newStateArray[0].children[0].title = this.state.childSubthemeText;
                this.addchildSubTheme(this.state.childSubthemeText, this.state.parentThemeId);

                this.setState({gData: newStateArray}, () => {
                    this.addThreeDotMenu(newStateArray);
                })
            } else if (optionName === "childTag") {
                var newStateArray = this.state.gData.slice();

                this.addChildTag(this.state.childTagText, this.state.parentThemeId);

                this.setState({gData: newStateArray}, () => {
                })
            } else {
            }
        }else {
            this.setState({ themeTitleNullError:true});
        }
    }

    getTextboxData=(event,textboxvalue,optionName)=>{
        if(event.keyCode == 13 ){

        if(optionName === "Rename"){

            var newStateArray = this.state.gData.slice();
            newStateArray[0].children[this.state.renameIndex].title=this.state.renameText;
            //console.log("In RENAME........",this.state.renameText);
            this.renameThemeTitle(newStateArray[0].children[this.state.renameIndex]._id,this.state.renameText,newStateArray[0].children[this.state.renameIndex].type)

            this.addThreeDotMenu(newStateArray);

            this.setState({gData:newStateArray})
            //this.loadThemeTitleTree(this.state.knitProjectId,this.state.parentThemeId);

        }
        else if(optionName === "Delete"){
            //textbox("","");s
        }
        else if(optionName === "childSubtheme"){

            var newStateArray = this.state.gData.slice();

            // console.log("childSubtheme.........",newStateArray[0].children[this.state.childSubthemeIndexChild]._id)

            newStateArray[0].children[this.state.childSubthemeIndexChild].children[this.state.childSubthemeIndexData].title=this.state.childSubthemeText;

            this.addchildSubTheme(this.state.childSubthemeText,newStateArray[0].children[this.state.childSubthemeIndexChild]._id)

            this.setState({gData:newStateArray},()=>{
                // console.log("getTextboxData.....11111111........",this.state.gData);
                //this.loadThemeTitleTree(this.state.knitProjectId,this.state.parentThemeId);
            })
        }
        else if(optionName === "subthemeBelow"){
            var newStateArray = this.state.gData.slice();

            newStateArray[0].children[this.state.totalSubtheme.length - 1].title=this.state.subthemeBelowText;
// console.log("Parent IDDD.....",newStateArray[0]._id);
            this.addchildSubTheme(this.state.subthemeBelowText,newStateArray[0]._id)

//this.addsubThemebelow(newStateArray[0]._id,this.state.subthemeBelowText);
            this.setState({gData:newStateArray},()=>{
                this.addThreeDotMenu(newStateArray);
                // console.log("getTextboxData.....11111111........",this.state.gData);
                //this.loadThemeTitleTree(this.state.knitProjectId,this.state.parentThemeId);
            })

        }
        else if(optionName === "childTag"){
            var newStateArray = this.state.gData.slice();

            newStateArray[0].children[this.state.childSubthemeIndexChild].children[this.state.childSubthemeIndexData].title=this.state.childTagText;
            this.addChildTag(this.state.childTagText,newStateArray[0].children[this.state.childSubthemeIndexChild]._id)

            this.setState({gData:newStateArray},()=>{
                // console.log("getTextboxData.....11111111........",this.state.gData);
                //this.loadThemeTitleTree(this.state.knitProjectId,this.state.parentThemeId);
            })
        }
        else if(optionName === "tagBelow"){
            var newStateArray = this.state.gData.slice();

            newStateArray[0].children[this.state.totalSubtheme.length - 1].title=this.state.tagBelowText;
            this.addChildTag(this.state.tagBelowText,newStateArray[0]._id)

            this.setState({gData:newStateArray},()=>{
                // console.log("getTextboxData.....11111111........",this.state.gData);
                //this.loadThemeTitleTree(this.state.knitProjectId,this.state.parentThemeId);
            })

        }
        else {
            // console.log("hello...in fffff",data);
        }

        }else {
            //console.log("insertParentThemeTitle....Else...ELSE...",this.state.textValidationFlag);
            this.setState({ themeTitleNullError:true});

        }
    }

//Get Textbox data Functions for third Layer DATA
    getTextboxDataThird=(event,textboxvalue,optionName)=>{
        //console.log("event...subthemeBelowText...",this.state.subthemeBelowText);
        if(event.keyCode == 13 ){
            // console.log("insertTitle....IFIFI..IF IF..",this.state.textValidationFlag);

            if(optionName === "Rename"){

                var newStateArray = this.state.gData.slice();
                newStateArray[0].children[this.state.renameIndex].children[this.state.renameIndexThird].title=this.state.renameText;

                //console.log("In RENAME........",this.state.renameText);
                this.renameThemeTitle(newStateArray[0].children[this.state.renameIndex].children[this.state.renameIndexThird]._id,this.state.renameText,newStateArray[0].children[this.state.renameIndex].children[this.state.renameIndexThird].type)

                this.addThreeDotMenu(newStateArray);

                this.setState({gData:newStateArray})
                //this.loadThemeTitleTree(this.state.knitProjectId,this.state.parentThemeId);

            }
            else if(optionName === "Delete"){
                //textbox("","");s
            }
            else if(optionName === "childSubtheme"){

                var newStateArray = this.state.gData.slice();

                 //console.log("childSubtheme.........childSubthemeIndexChildThird....",this.state.childSubthemeText,".........ID......",newStateArray[0].children[this.state.childSubthemeIndexChild].children[this.state.childSubthemeIndexChildThird].children[this.state.childSubthemeIndexData])

                newStateArray[0].children[this.state.childSubthemeIndexChild].children[this.state.childSubthemeIndexChildThird].children[this.state.childSubthemeIndexData].title=this.state.childSubthemeText;

                this.addchildSubTheme(this.state.childSubthemeText,newStateArray[0].children[this.state.childSubthemeIndexChild].children[this.state.childSubthemeIndexChildThird]._id)

                this.setState({gData:newStateArray},()=>{
                    // console.log("getTextboxData.....11111111........",this.state.gData);
                    //this.loadThemeTitleTree(this.state.knitProjectId,this.state.parentThemeId);
                })
            }
            else if(optionName === "subthemeBelow"){
                var newStateArray = this.state.gData.slice();
                let arrayIndex = getIndexNumber(this.state.currentIndex);
               // console.log("Parent IDDD......subthemeBelow......",newStateArray[0].children[arrayIndex]._id,"....TotalSubthemeThird.length.....",this.state.totalSubthemeThird.length);
                newStateArray[0].children[arrayIndex].children[this.state.totalSubthemeThird.length - 1].title=this.state.subthemeBelowText;

                // console.log("Parent IDDD.....",newStateArray[0]._id);
                this.addchildSubTheme(this.state.subthemeBelowText,newStateArray[0].children[arrayIndex]._id)

//this.addsubThemebelow(newStateArray[0]._id,this.state.subthemeBelowText);
                this.setState({gData:newStateArray},()=>{
                    this.addThreeDotMenu(newStateArray);
                    // console.log("getTextboxData.....11111111........",this.state.gData);
                    //this.loadThemeTitleTree(this.state.knitProjectId,this.state.parentThemeId);
                })

            }
            else if(optionName === "childTag"){
                var newStateArray = this.state.gData.slice();

                newStateArray[0].children[this.state.childSubthemeIndexChild].children[this.state.childSubthemeIndexChildThird].children[this.state.childSubthemeIndexData].title=this.state.childTagText;
                this.addChildTag(this.state.childTagText,newStateArray[0].children[this.state.childSubthemeIndexChild].children[this.state.childSubthemeIndexChildThird]._id)

                this.setState({gData:newStateArray},()=>{
                    // console.log("getTextboxData.....11111111........",this.state.gData);
                    //this.loadThemeTitleTree(this.state.knitProjectId,this.state.parentThemeId);
                })
            }
            else if(optionName === "tagBelow"){
                var newStateArray = this.state.gData.slice();
                let arrayIndex = getIndexNumber(this.state.currentIndex);

                //console.log("arrayIndex.....",arrayIndex,'...llll....',this.state.totalSubthemeThird.length);

                newStateArray[0].children[arrayIndex].children[this.state.totalSubthemeThird.length - 1].title=this.state.tagBelowText;
                this.addChildTag(this.state.tagBelowText,newStateArray[0].children[arrayIndex]._id)

                this.setState({gData:newStateArray},()=>{
                    // console.log("getTextboxData.....11111111........",this.state.gData);
                    //this.loadThemeTitleTree(this.state.knitProjectId,this.state.parentThemeId);
                })

            }
            else {
                // console.log("hello...in fffff",data);
            }

        }else {
            //console.log("insertParentThemeTitle....Else...ELSE...",this.state.textValidationFlag);
            this.setState({ themeTitleNullError:true});

        }
    }
//Get Textbox data Functions for Fourth Layer DATA
    getTextboxDataFourth=(event,textboxvalue,optionName)=>{
        //console.log("event...subthemeBelowText...",this.state.subthemeBelowText);
        if(event.keyCode == 13 ){
            // console.log("insertTitle....IFIFI..IF IF..",this.state.textValidationFlag);

            if(optionName === "Rename"){

                var newStateArray = this.state.gData.slice();
                newStateArray[0].children[this.state.renameIndex].children[this.state.renameIndexThird].children[this.state.renameIndexFourth].title=this.state.renameText;
                //console.log("In RENAME........",this.state.renameText);
                this.renameThemeTitle(newStateArray[0].children[this.state.renameIndex].children[this.state.renameIndexThird].children[this.state.renameIndexFourth]._id,this.state.renameText,newStateArray[0].children[this.state.renameIndex].children[this.state.renameIndexThird].children[this.state.renameIndexFourth].type)

                this.addThreeDotMenu(newStateArray);

                this.setState({gData:newStateArray})
                //this.loadThemeTitleTree(this.state.knitProjectId,this.state.parentThemeId);

            }
            else if(optionName === "Delete"){
                //textbox("","");s
            }
            else if(optionName === "childSubtheme"){

                var newStateArray = this.state.gData.slice();

                // console.log("childSubtheme.........",newStateArray[0].children[this.state.childSubthemeIndexChild]._id)

                newStateArray[0].children[this.state.childSubthemeIndexChild].children[this.state.childSubthemeIndexChildThird].children[this.state.childSubthemeIndexChildFourth].children[this.state.childSubthemeIndexData].title=this.state.childSubthemeText;

                this.addchildSubTheme(this.state.childSubthemeText,newStateArray[0].children[this.state.childSubthemeIndexChild].children[this.state.childSubthemeIndexChildThird].children[this.state.childSubthemeIndexChildFourth]._id)

                // newStateArray[0].children[this.state.childSubthemeIndexChild].children[this.state.childSubthemeIndexData].title=this.state.childSubthemeText;
                //
                // this.addchildSubTheme(this.state.childSubthemeText,newStateArray[0].children[this.state.childSubthemeIndexChild]._id)

                this.setState({gData:newStateArray},()=>{
                    // console.log("getTextboxData.....11111111........",this.state.gData);
                    //this.loadThemeTitleTree(this.state.knitProjectId,this.state.parentThemeId);
                })
            }
            else if(optionName === "subthemeBelow"){
                let arrayIndex = getIndexNumber(this.state.currentIndex);
                let arrayIndexthrid = getIndexNumberThird(this.state.currentIndex);
                var newStateArray = this.state.gData.slice();
                //console.log("NewStateArray......",newStateArray,"....ArrayIndex......",arrayIndex,"...arrayIndexthrid....",arrayIndexthrid);
                //console.log("this.state.totalSubthemeFourth.length.......",this.state.totalSubthemeFourth.length);
                //console.log("array.......",newStateArray[0].children[arrayIndex].children[arrayIndexthrid]);
                newStateArray[0].children[arrayIndex].children[arrayIndexthrid].children[this.state.totalSubthemeFourth.length - 1].title=this.state.subthemeBelowText;
// console.log("Parent IDDD.....",newStateArray[0]._id);
               this.addchildSubTheme(this.state.subthemeBelowText,newStateArray[0].children[arrayIndex].children[arrayIndexthrid]._id)

//this.addsubThemebelow(newStateArray[0]._id,this.state.subthemeBelowText);
                this.setState({gData:newStateArray},()=>{
                    this.addThreeDotMenu(newStateArray);
                    // console.log("getTextboxData.....11111111........",this.state.gData);
                    //this.loadThemeTitleTree(this.state.knitProjectId,this.state.parentThemeId);
                })

            }
            else if(optionName === "childTag"){
                var newStateArray = this.state.gData.slice();

                newStateArray[0].children[this.state.childSubthemeIndexChild].children[this.state.childSubthemeIndexChildThird].children[this.state.childSubthemeIndexChildFourth].children[this.state.childSubthemeIndexData].title=this.state.childTagText;
                this.addChildTag(this.state.childTagText,newStateArray[0].children[this.state.childSubthemeIndexChild].children[this.state.childSubthemeIndexChildThird].children[this.state.childSubthemeIndexChildFourth]._id)

                this.setState({gData:newStateArray},()=>{
                    // console.log("getTextboxData.....11111111........",this.state.gData);
                    //this.loadThemeTitleTree(this.state.knitProjectId,this.state.parentThemeId);
                })
            }
            else if(optionName === "tagBelow"){
                let arrayIndex = getIndexNumber(this.state.currentIndex);
                let arrayIndexthrid = getIndexNumberThird(this.state.currentIndex);
                var newStateArray = this.state.gData.slice();

                newStateArray[0].children[arrayIndex].children[arrayIndexthrid].children[this.state.totalSubthemeFourth.length - 1].title=this.state.tagBelowText;
                this.addChildTag(this.state.tagBelowText,newStateArray[0].children[arrayIndex].children[arrayIndexthrid]._id)

                this.setState({gData:newStateArray},()=>{
                    // console.log("getTextboxData.....11111111........",this.state.gData);
                    //this.loadThemeTitleTree(this.state.knitProjectId,this.state.parentThemeId);
                    })

            }
            else {
                // console.log("hello...in fffff",data);
            }

        }else {
            //console.log("insertParentThemeTitle....Else...ELSE...",this.state.textValidationFlag);
            this.setState({ themeTitleNullError:true});

        }
    }


    textboxFunction=(textboxData,key,themeName)=>{
        // console.log("textboxData............",textboxData);
        //
        // console.log("key====>",key);
        // console.log("themeName====>",themeName);

        //treeData[0]['children'][1]['title'] = "test111"
        //console.log(".......",treeData[0]['children'][1]['title']);

        if(textboxData === "Rename"){

            let arrayIndex = getIndexNumber(this.state.currentIndex);

            this.setState({ renameIndex:arrayIndex});

            var newStateArray = this.state.gData.slice();

            //console.log("NewStateArray......",newStateArray,"....ArrayIndex......",arrayIndex);
            //console.log("Rename...Title......",newStateArray[0].children[arrayIndex]);

            newStateArray[0].children[arrayIndex].title=<GenrateTextbox textboxName={'renameText'} textboxValue={themeName} clearTextBox={()=>{this.clearTextBoxTheme()}} getTextboxvalue={(e,value)=>{ if(e.target.value != null && e.target.value != ""  && e.keyCode == 13){this.getTextboxData(e,value,textboxData)}else if(e.target.value == null || e.target.value == "" ){ this.setState({themeTitleNullError:true})}}} handleOnChange={(event)=>{this.handleOnChange(event)}}/>

            this.setState({gData:newStateArray})
        }
        else if(textboxData === "Delete"){
            //textbox("","");s
            let arrayIndex = getIndexNumber(this.state.currentIndex);

            var newStateArray = this.state.gData.slice();

            if(newStateArray[0].children[arrayIndex].type === "TAG"){
                this.setState({deleteTagModalFlag:true,selectedTagId:newStateArray[0].children[arrayIndex]._id})
                //this.deleteTag(newStateArray[0].children[arrayIndex]._id)
            }else {
                this.setState({deleteSubThemeModalFlag:true,selectedThemeId:newStateArray[0].children[arrayIndex]._id})
                // this.deleteThemeTitle(newStateArray[0].children[arrayIndex]._id);
            }
        }
        else if(textboxData === "childSubtheme"){

            var newStateArray = this.state.gData.slice();

            let arrayIndex = getIndexNumber(this.state.currentIndex);

            let testLength = newStateArray[0].children[arrayIndex].children

            let childsubthemeIndex = testLength.length;

            this.setState({childSubthemeIndexData:childsubthemeIndex,childSubthemeIndexChild:arrayIndex})

            newStateArray[0].children[arrayIndex].children[childsubthemeIndex]={title:<GenrateTextbox textboxName={'childSubthemeText'} clearTextBox={()=>{this.clearTextBoxTheme()}} getTextboxvalue={(e,value)=>{ if(e.target.value != null && e.target.value != ""  && e.keyCode == 13){this.getTextboxData(e,value,textboxData)}else if(e.target.value == null || e.target.value == "" ){ this.setState({themeTitleNullError:true})}}} handleOnChange={(event)=>{this.handleOnChange(event)}}/>};

            this.setState({gData:newStateArray})
        }
        else if(textboxData === "subthemeBelow"){

            let arrayIndex = getIndexNumber(this.state.currentIndex);

            var newStateArray = this.state.gData.slice();

            newStateArray[0].children[this.state.totalSubtheme.length]={title:<GenrateTextbox textboxName={'subthemeBelowText'} clearTextBox={()=>{this.clearTextBoxTheme()}} getTextboxvalue={(e,value)=>{ if(e.target.value != null && e.target.value != ""  && e.keyCode == 13){this.getTextboxData(e,value,textboxData)}else if(e.target.value == null || e.target.value == "" ){ this.setState({themeTitleNullError:true})}}}  handleOnChange={(event)=>{this.handleOnChange(event)}}/>};
            this.setState({gData:newStateArray})
        }
        else if(textboxData === "childTag"){

            var newStateArray = this.state.gData.slice();

            let arrayIndex = getIndexNumber(this.state.currentIndex);

            let testLength = newStateArray[0].children[arrayIndex].children

            let childsubthemeIndex = testLength.length;

            this.setState({childSubthemeIndexData:childsubthemeIndex,childSubthemeIndexChild:arrayIndex})

            newStateArray[0].children[arrayIndex].children[childsubthemeIndex]={title:<GenrateTextbox textboxName={'childTagText'} clearTextBox={()=>{this.clearTextBoxTheme()}} getTextboxvalue={(e,value)=>{ if(e.target.value != null && e.target.value != ""  && e.keyCode == 13){this.getTextboxData(e,value,textboxData)}else if(e.target.value == null || e.target.value == "" ){ this.setState({themeTitleNullError:true})}}} handleOnChange={(event)=>{this.handleOnChange(event)}}/>};

            this.setState({gData:newStateArray})
        }
        else if(textboxData === "tagBelow"){

            var newStateArray=this.state.gData.slice();

            newStateArray[0].children[this.state.totalSubtheme.length]={title:<GenrateTextbox textboxName={'tagBelowText'} clearTextBox={()=>{this.clearTextBoxTheme()}} getTextboxvalue={(e,value)=>{ if(e.target.value != null && e.target.value != ""  && e.keyCode == 13){this.getTextboxData(e,value,textboxData)}else if(e.target.value == null || e.target.value == "" ){ this.setState({themeTitleNullError:true})}}} handleOnChange={(event)=>{this.handleOnChange(event)}}/>};
            this.setState({gData:newStateArray})
        }   
        else {
            // console.log("hello...in fffff",data);
        }
    }

//For Thrird Layer Genrate Textbox
    textboxFunctionThird=(textboxData,key,themeName)=>{
        // console.log("textboxData............",textboxData);
        //
        // console.log("key====>",key);
        // console.log("themeName====>",themeName);

        //treeData[0]['children'][1]['title'] = "test111"
        //console.log(".......",treeData[0]['children'][1]['title']);

        if(textboxData === "Rename"){

            let arrayIndex = getIndexNumber(this.state.currentIndex);
let arrayIndexthrid = getIndexNumberThird(this.state.currentIndex);
            this.setState({ renameIndex:arrayIndex});
            this.setState({ renameIndexThird:arrayIndexthrid});

            var newStateArray = this.state.gData.slice();

            //console.log("NewStateArray......",newStateArray,"....ArrayIndex......",arrayIndex);
            //console.log("Rename...Title......",newStateArray[0].children[arrayIndex]);

            newStateArray[0].children[arrayIndex].children[arrayIndexthrid].title=<GenrateTextbox textboxName={'renameText'} textboxValue={themeName} clearTextBox={()=>{this.clearTextBoxTheme()}} getTextboxvalue={(e,value)=>{ if(e.target.value != null && e.target.value != ""  && e.keyCode == 13){this.getTextboxDataThird(e,value,textboxData)}else if(e.target.value == null || e.target.value == "" ){ this.setState({themeTitleNullError:true})}}} handleOnChange={(event)=>{this.handleOnChange(event)}}/>

            this.setState({gData:newStateArray})
        }
        else if(textboxData === "Delete"){
            //textbox("","");s
            let arrayIndex = getIndexNumber(this.state.currentIndex);
            let arrayIndexthrid = getIndexNumberThird(this.state.currentIndex);
            var newStateArray = this.state.gData.slice();

            if(newStateArray[0].children[arrayIndex].children[arrayIndexthrid].type === "TAG"){
                this.setState({deleteTagModalFlag:true,selectedTagId:newStateArray[0].children[arrayIndex].children[arrayIndexthrid]._id})
                // this.deleteTag(newStateArray[0].children[arrayIndex].children[arrayIndexthrid]._id)
            }else {
                this.setState({deleteSubThemeModalFlag:true,selectedThemeId:newStateArray[0].children[arrayIndex].children[arrayIndexthrid]._id})
                // this.deleteThemeTitle(newStateArray[0].children[arrayIndex].children[arrayIndexthrid]._id);
            }
        }
        else if(textboxData === "childSubtheme"){

            var newStateArray = this.state.gData.slice();

            let arrayIndex = getIndexNumber(this.state.currentIndex);
            let arrayIndexthrid = getIndexNumberThird(this.state.currentIndex);
            let testLength = newStateArray[0].children[arrayIndex].children[arrayIndexthrid].children

            let childsubthemeIndex = testLength.length;

            this.setState({childSubthemeIndexData:childsubthemeIndex,childSubthemeIndexChild:arrayIndex,childSubthemeIndexChildThird:arrayIndexthrid})

            newStateArray[0].children[arrayIndex].children[arrayIndexthrid].children[childsubthemeIndex]={title:<GenrateTextbox textboxName={'childSubthemeText'} clearTextBox={()=>{this.clearTextBoxTheme()}} getTextboxvalue={(e,value)=>{ if(e.target.value != null && e.target.value != ""  && e.keyCode == 13){this.getTextboxDataThird(e,value,textboxData)}else if(e.target.value == null || e.target.value == "" ){ this.setState({themeTitleNullError:true})}}} handleOnChange={(event)=>{this.handleOnChange(event)}}/>};

            this.setState({gData:newStateArray})
        }
        else if(textboxData === "subthemeBelow"){

            let arrayIndex = getIndexNumber(this.state.currentIndex);

            var newStateArray = this.state.gData.slice();

            newStateArray[0].children[arrayIndex].children[this.state.totalSubthemeThird.length]={title:<GenrateTextbox textboxName={'subthemeBelowText'} clearTextBox={()=>{this.clearTextBoxTheme()}} getTextboxvalue={(e,value)=>{ if(e.target.value != null && e.target.value != ""  && e.keyCode == 13){this.getTextboxDataThird(e,value,textboxData)}else if(e.target.value == null || e.target.value == "" ){ this.setState({themeTitleNullError:true})}}}  handleOnChange={(event)=>{this.handleOnChange(event)}}/>};
            this.setState({gData:newStateArray})
        }
        else if(textboxData === "childTag"){

            var newStateArray = this.state.gData.slice();

            let arrayIndex = getIndexNumber(this.state.currentIndex);
            let arrayIndexthrid = getIndexNumberThird(this.state.currentIndex);
            let testLength = newStateArray[0].children[arrayIndex].children[arrayIndexthrid].children

            let childsubthemeIndex = testLength.length;

            this.setState({childSubthemeIndexData:childsubthemeIndex,childSubthemeIndexChild:arrayIndex,childSubthemeIndexChildThird:arrayIndexthrid})

            newStateArray[0].children[arrayIndex].children[arrayIndexthrid].children[childsubthemeIndex]={title:<GenrateTextbox textboxName={'childTagText'} clearTextBox={()=>{this.clearTextBoxTheme()}} getTextboxvalue={(e,value)=>{ if(e.target.value != null && e.target.value != ""  && e.keyCode == 13){this.getTextboxDataThird(e,value,textboxData)}else if(e.target.value == null || e.target.value == "" ){ this.setState({themeTitleNullError:true})}}} handleOnChange={(event)=>{this.handleOnChange(event)}}/>};

            this.setState({gData:newStateArray})
        }
        else if(textboxData === "tagBelow"){
            let arrayIndex = getIndexNumber(this.state.currentIndex);
            var newStateArray=this.state.gData.slice();
//console.log("");
            newStateArray[0].children[arrayIndex].children[this.state.totalSubthemeThird.length]={title:<GenrateTextbox textboxName={'tagBelowText'} clearTextBox={()=>{this.clearTextBoxTheme()}} getTextboxvalue={(e,value)=>{ if(e.target.value != null && e.target.value != ""  && e.keyCode == 13){this.getTextboxDataThird(e,value,textboxData)}else if(e.target.value == null || e.target.value == "" ){ this.setState({themeTitleNullError:true})}}} handleOnChange={(event)=>{this.handleOnChange(event)}}/>};
            this.setState({gData:newStateArray})
        }
        else {
            // console.log("hello...in fffff",data);
        }
    }


    //For Fourth Layer Genrate Textbox
    textboxFunctionFourth=(textboxData,key,themeName)=>{
        // console.log("textboxData............",textboxData);
        //
        // console.log("key====>",key);
        // console.log("themeName====>",themeName);

        //treeData[0]['children'][1]['title'] = "test111"
        //console.log(".......",treeData[0]['children'][1]['title']);

        if(textboxData === "Rename"){

            let arrayIndex = getIndexNumber(this.state.currentIndex);
            let arrayIndexthrid = getIndexNumberThird(this.state.currentIndex);
            let arrayIndexFourth = getIndexNumberFourth(this.state.currentIndex);
            this.setState({ renameIndex:arrayIndex});
            this.setState({ renameIndexThird:arrayIndexthrid});
            this.setState({ renameIndexFourth:arrayIndexFourth});
            var newStateArray = this.state.gData.slice();

            //console.log("NewStateArray......",newStateArray,"....ArrayIndex......",arrayIndex,"...arrayIndexthrid....",arrayIndexthrid,"...arrayIndexFourth....",arrayIndexFourth);
            //console.log("Rename...Title......",newStateArray[0].children[arrayIndex].children[arrayIndexthrid]);

            newStateArray[0].children[arrayIndex].children[arrayIndexthrid].children[arrayIndexFourth].title=<GenrateTextbox textboxName={'renameText'} textboxValue={themeName} clearTextBox={()=>{this.clearTextBoxTheme()}} getTextboxvalue={(e,value)=>{ if(e.target.value != null && e.target.value != ""  && e.keyCode == 13){this.getTextboxDataFourth(e,value,textboxData)}else if(e.target.value == null || e.target.value == "" ){ this.setState({themeTitleNullError:true})}}} handleOnChange={(event)=>{this.handleOnChange(event)}}/>

            this.setState({gData:newStateArray})
        }
        else if(textboxData === "Delete"){
            //textbox("","");s
            let arrayIndex = getIndexNumber(this.state.currentIndex);
            let arrayIndexthrid = getIndexNumberThird(this.state.currentIndex);
            let arrayIndexFourth = getIndexNumberFourth(this.state.currentIndex);
            var newStateArray = this.state.gData.slice();
            //console.log("NewStateArray......",newStateArray,"....ArrayIndex......",arrayIndex,"...arrayIndexthrid....",arrayIndexthrid,"...arrayIndexFourth....",arrayIndexFourth);
            //console.log("Delete......",newStateArray[0].children[arrayIndex].children[arrayIndexthrid].children[arrayIndexFourth]);
            if(newStateArray[0].children[arrayIndex].children[arrayIndexthrid].children[arrayIndexFourth].type === "TAG"){
                this.setState({deleteTagModalFlag:true,selectedTagId:newStateArray[0].children[arrayIndex].children[arrayIndexthrid].children[arrayIndexFourth]._id})
                //this.deleteTag(newStateArray[0].children[arrayIndex].children[arrayIndexthrid].children[arrayIndexFourth]._id)
            }else {
                this.setState({deleteSubThemeModalFlag:true,selectedThemeId:newStateArray[0].children[arrayIndex].children[arrayIndexthrid].children[arrayIndexFourth]._id})
                // this.deleteThemeTitle(newStateArray[0].children[arrayIndex].children[arrayIndexthrid].children[arrayIndexFourth]._id);
            }
        }
        else if(textboxData === "childSubtheme"){

            var newStateArray = this.state.gData.slice();

            let arrayIndex = getIndexNumber(this.state.currentIndex);
            let arrayIndexthrid = getIndexNumberThird(this.state.currentIndex);
            let arrayIndexFourth = getIndexNumberFourth(this.state.currentIndex);
            let testLength = newStateArray[0].children[arrayIndex].children[arrayIndexthrid].children[arrayIndexFourth].children

            let childsubthemeIndex = testLength.length;

            this.setState({childSubthemeIndexData:childsubthemeIndex,childSubthemeIndexChild:arrayIndex,childSubthemeIndexChildThird:arrayIndexthrid,childSubthemeIndexChildFourth:arrayIndexFourth})

            newStateArray[0].children[arrayIndex].children[arrayIndexthrid].children[arrayIndexFourth].children[childsubthemeIndex]={title:<GenrateTextbox textboxName={'childSubthemeText'} clearTextBox={()=>{this.clearTextBoxTheme()}} getTextboxvalue={(e,value)=>{ if(e.target.value != null && e.target.value != ""  && e.keyCode == 13){this.getTextboxDataFourth(e,value,textboxData)}else if(e.target.value == null || e.target.value == "" ){ this.setState({themeTitleNullError:true})}}} handleOnChange={(event)=>{this.handleOnChange(event)}}/>};

            this.setState({gData:newStateArray})
        }
        else if(textboxData === "subthemeBelow"){

            let arrayIndex = getIndexNumber(this.state.currentIndex);
            let arrayIndexthrid = getIndexNumberThird(this.state.currentIndex);
            var newStateArray = this.state.gData.slice();
//..Subtheme FORUTH........",this.state.totalSubthemeFourth);
            newStateArray[0].children[arrayIndex].children[arrayIndexthrid].children[this.state.totalSubthemeFourth.length]={title:<GenrateTextbox textboxName={'subthemeBelowText'} clearTextBox={()=>{this.clearTextBoxTheme()}} getTextboxvalue={(e,value)=>{ if(e.target.value != null && e.target.value != ""  && e.keyCode == 13){this.getTextboxDataFourth(e,value,textboxData)}else if(e.target.value == null || e.target.value == "" ){ this.setState({themeTitleNullError:true})}}}  handleOnChange={(event)=>{this.handleOnChange(event)}}/>};
            this.setState({gData:newStateArray})
        }
        else if(textboxData === "childTag"){

            var newStateArray = this.state.gData.slice();

            let arrayIndex = getIndexNumber(this.state.currentIndex);
            let arrayIndexthrid = getIndexNumberThird(this.state.currentIndex);
            let arrayIndexFourth = getIndexNumberFourth(this.state.currentIndex);
            let testLength = newStateArray[0].children[arrayIndex].children[arrayIndexthrid].children[arrayIndexFourth].children

            let childsubthemeIndex = testLength.length;

            this.setState({childSubthemeIndexData:childsubthemeIndex,childSubthemeIndexChild:arrayIndex,childSubthemeIndexChildThird:arrayIndexthrid,childSubthemeIndexChildFourth:arrayIndexFourth})

            newStateArray[0].children[arrayIndex].children[arrayIndexthrid].children[arrayIndexFourth].children[childsubthemeIndex]={title:<GenrateTextbox textboxName={'childTagText'} clearTextBox={()=>{this.clearTextBoxTheme()}} getTextboxvalue={(e,value)=>{ if(e.target.value != null && e.target.value != ""  && e.keyCode == 13){this.getTextboxDataFourth(e,value,textboxData)}else if(e.target.value == null || e.target.value == "" ){ this.setState({themeTitleNullError:true})}}} handleOnChange={(event)=>{this.handleOnChange(event)}}/>};

            this.setState({gData:newStateArray})
        }
        else if(textboxData === "tagBelow"){
            let arrayIndex = getIndexNumber(this.state.currentIndex);
            let arrayIndexthrid = getIndexNumberThird(this.state.currentIndex);
            var newStateArray=this.state.gData.slice();

            newStateArray[0].children[arrayIndex].children[arrayIndexthrid].children[this.state.totalSubthemeFourth.length]={title:<GenrateTextbox textboxName={'tagBelowText'} clearTextBox={()=>{this.clearTextBoxTheme()}} getTextboxvalue={(e,value)=>{ if(e.target.value != null && e.target.value != ""  && e.keyCode == 13){this.getTextboxDataFourth(e,value,textboxData)}else if(e.target.value == null || e.target.value == "" ){ this.setState({themeTitleNullError:true})}}} handleOnChange={(event)=>{this.handleOnChange(event)}}/>};
            this.setState({gData:newStateArray})
        }
        else {
            // console.log("hello...in fffff",data);
        }
    }




    deleteTag= async (knit_tag_id)=>{

        let user_data = {
            "knit_project_id" : this.state.knitProjectId,
            "knit_tag_id": knit_tag_id,
            "is_deleted": true
        };
        deleteTagThemeTree(user_data).then((response) => {

            //this.loadThemeTitleTree(this.props.data.knit_project_id.$oid,this.props.data._id.$oid);
            // console.log("Theme Tree API Response.......",response.data);
            this.setState({deleteTagModalFlag:false})
            this.props.loadThemeTitle();
            this.props.refreshTagFrequency();
        });

    }

    deleteThemeTitle= async (knit_theme_id)=>{

        // this.setState({ gData:"" });
        // console.log("theme id==>",knit_theme_id)
        let user_data = {
            knit_theme_id : knit_theme_id,
            is_deleted : true
        };
        allThemeNameList(user_data).then((response) => {

            //this.loadThemeTitleTree(this.props.data.knit_project_id.$oid,this.props.data._id.$oid);
            // console.log("Theme Tree API Response.......",response.data);
            this.setState({deleteThemeModalFlag:false,deleteSubThemeModalFlag:false})
            this.props.loadThemeTitle();
            this.props.refreshTagFrequency();
            });

    }
    renameThemeTitle= async (themeId,themeName,type)=>{

        let user_data ={}
        if(type === "THEME"){
             user_data = {

                "request_type":"rename",
                "is_theme":true,
                "knit_theme_id":themeId,
                "theme_name":themeName
            };
        }
        else if(type === "TAG"){
            user_data = {

                "request_type":"rename",
                "is_tag":true,
                "knit_tag_id":themeId,
                "tag_name":themeName
            };
        }else {

        }

        allThemeNameList(user_data).then((response) => {

            // console.log("Rename Theme Tree API Response.......",response.data);
            this.loadThemeTitleTree(this.state.knitProjectId,this.state.parentThemeId);

        });

    }
    addchildSubTheme= async (themeName,parentThemeId)=>{

        let user_data = {
            "child_theme":true,
            "theme_name":themeName,
            "knit_project_id":this.state.knitProjectId,
            "knit_user_id":this.state.knitUserId,
            "parent_id":parentThemeId

        };
        allThemeNameList(user_data).then((response) => {
            // console.log("addchildSubTheme API Response.......",response.data);
            //this.loadThemeTitleTree(this.state.knitProjectId,this.state.parentThemeId);
            this.props.loadThemeTitle();

        });

    }
    addsubThemebelow= async (parent_theme_id,themeName)=>{

        let user_data = {
            "child_theme":true,
            "theme_name":themeName,
            "knit_project_id":this.state.knitProjectId,
            "knit_user_id":this.state.knitUserId,
            "parent_id":parent_theme_id
        };
        allThemeNameList(user_data).then((response) => {

            // console.log("addsubThemebelow.....Theme Tree API Response.......",response.data);
            //this.loadThemeTitleTree(this.state.knitProjectId,this.state.parentThemeId);
            this.props.loadThemeTitle();
        });

    }
    addChildTag= async (tagName,parentThemeId)=>{

        // this.setState({ gData:"" });

        let user_data = {

            "tag_comment":true,
            "is_tag":true,
            "knit_project_id":this.state.knitProjectId,
            "knit_theme_id":parentThemeId,
            "knit_user_id":this.state.knitUserId,
            "project_type":"QUALTRICS",
            "tag_name":tagName

        };
        insertChildTag(user_data).then((response) => {

            // console.log("addChildTag API Response.......",response.data);
            this.props.loadThemeTitle();
            //this.loadThemeTitleTree(this.state.knitProjectId,this.state.parentThemeId);

        });

    }
    dragDropThemeTag= async (child_theme_id,parent_theme_id,childType)=>{
// console.log("child_theme_id....",child_theme_id)
        let user_data = {
            "seq_key": this.state.dropSeqkey,
            "request_type":"hirerachy",
            "parent":{
                "type":"THEME",
                "_id" : parent_theme_id
            },
            "child":{
                "_id": child_theme_id,
                "type": childType
            }

        };
        updateThemeTreeHirerachy(user_data).then((response) => {

            // console.log("updateThemeTreeHirerachy.......",response.data);
            this.loadThemeTitleTree(this.state.knitProjectId,this.state.parentThemeId);
            // let responseData = response.data
            // this.addThreeDotMenu(responseData);
            //
            // this.setState({ gData:responseData});
            //this.setState({ themeData:response.data });
        });

    }
    // handleOnChange=(event)=>{
    //     // console.log("event.target.name..............",event.target.name);
    //     this.setState({[event.target.name]:event.target.value})
    // }

    handleOnChange=(event)=>{

        let value = event.target.value.trim()

        if(value){
            this.setState({[event.target.name]:event.target.value,themeTitleNullError:false,textValidationFlag:event.target.value})
        }else {
            this.setState({ themeTitleNullError:true});
        }
    }

    onDragEnter = info => {
        //console.log("onDragEnter..............",info);
        // expandedKeys 需要受控时设置
        // this.setState({
        //   expandedKeys: info.expandedKeys,
        // });
    };
    handleClick = (event) => {
        this.setState({
            anchorEl:event.currentTarget,
            open:!this.state.open
        })
    };

    onDrop = info => {
         //console.log(info);

        // console.log("ParentIDDDD.........",info.node._id);
        // console.log("ParentTYPEEE.........",info.node.type);
        // console.log("Child ID.........",info.dragNode._id);
        // console.log("ChildTYPEEE.........",info.dragNode.type);

if(info.node.type === "THEME"){



        const dropKey = info.node.key;
        const dragKey = info.dragNode.key;
        const dropPos = info.node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

        const loop = (data, key, callback) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].key === key) {
                    return callback(data[i], i, data);
                }
                if (data[i].children) {
                    loop(data[i].children, key, callback);
                }
            }
        };
        const data = [...this.state.gData];

        // Find dragObject
        let dragObj;
        loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1);
            dragObj = item;
        });

        if (!info.dropToGap) {
            // Drop on the content
            loop(data, dropKey, item => {
                item.children = item.children || [];
                // where to insert 示例添加到头部，可以是随意位置
                item.children.unshift(dragObj);
            });
        } else if (
            (info.node.props.children || []).length > 0 && // Has children
            info.node.props.expanded && // Is expanded
            dropPosition === 1 // On the bottom gap
        ) {
            loop(data, dropKey, item => {
                item.children = item.children || [];
                // where to insert 示例添加到头部，可以是随意位置
                item.children.unshift(dragObj);
                // in previous version, we use item.children.push(dragObj) to insert the
                // item to the tail of the children
            });
        } else {
            let ar;
            let i;
            loop(data, dropKey, (item, index, arr) => {
                ar = arr;
                i = index;
            });
            if (dropPosition === -1) {
                ar.splice(i, 0, dragObj);
            } else {
                ar.splice(i + 1, 0, dragObj);
            }
        }
   // console.log("Test..........");

    setTimeout(
        () => this.dragDropThemeTag(info.dragNode._id,info.node._id,info.dragNode.type),
        900
    );

    //this.dragDropThemeTag(info.dragNode._id,info.node._id,info.dragNode.type);
        this.setState({
            gData: data,
        });
}else {
this.setState({hirerachyWarningMessage:true})

}
    };
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }


        // setOpen(false);
    if(this.state.hirerachyWarningMessage){
        this.setState({hirerachyWarningMessage:false})
    }else {
        this.setState({themeTitleNullError:false})
    }

    };
    handleonSelect = info => {
        // console.log("handleonSelect event..........",info);
var parentdvs = document.getElementsByClassName('ant-tree-treenode-selected');
        var childdvs = document.getElementsByClassName('ant-tree-node-selected');

        for(var i = 0;i<parentdvs.length;i++){
            parentdvs[i].classList.remove('ant-tree-treenode-selected')
        }


        for(var i = 0;i<childdvs.length;i++){
            childdvs[i].classList.remove('ant-tree-node-selected')
        }

        if(info.length > 0 && info[0] !== undefined){
            //console.log("event....IN IFFF......",info);

            this.setState({
            currentIndex: info,

            });
        }
    };
    handleonDragLeave = (event)=>{
         //console.log("On Drag event..........",event);
    this.setState({dropSeqkey:event.node.pos},()=>{
        //console.log("Set Value instate..........",this.state.dropSeqkey);
    })

    }

    deleteModalClose = () => {
        this.setState({
          deleteThemeModalFlag: false,
          deleteSubThemeModalFlag:false,
          deleteTagModalFlag:false,
      });
      }
    
    render() {
        return (
            <>
                {this.state.isThemeBoxSkel &&(
                    <>
                        <div className={'theme-card-skeleton'}>
                            <Skeleton variant="circle" width={12} height={12} />
                            <Skeleton variant="rect" width={12} height={12} style={{marginLeft:'10px', marginRight:'10px'}} />
                            <Skeleton variant="text" style={{width:'50%'}} />
                        </div>
                    </>
                )}


                <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center'  }} open={this.state.hirerachyWarningMessage} autoHideDuration={3000} onClose={this.handleClose}>
                <Alert onClose={this.handleClose} severity="warning">
                    Please Do Not Add a THEME or TAG under any TAG!
                </Alert>
            </Snackbar>
                <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center'  }} open={this.state.themeTitleNullError} autoHideDuration={3000} onClose={this.handleClose}>
                    <Alert onClose={this.handleClose} severity="error">
                        Please Enter Value in Textbox
                    </Alert>
                </Snackbar>
                {!this.state.isThemeBoxSkel


                ?<div className={"tree-root"}  style={{ display: "flex", color:this.state.themeTitleColor}}>
                    <FiberManualRecordIcon style={{width:15,height:20}} />
                    {/*<ThemeColor primary={this.state.themeTitleColor} />*/}
                    {/*{this.getColor(1)}*/}                    
                    <Tree

                        showLine={{showLeafIcon: false}}
                        showIcon={false|{showLeafIcon: false}}
                        className="draggable-tree"
                        switcherIcon={<DownOutlined />}
                        defaultExpandedKeys={this.state.expandedKeys}
                        //defaultExpandParent={this.state.expandParent}
                        defaultExpandAll={true}
                        draggable
                        blockNode
                        onDragEnter={this.onDragEnter}
                        onDrop={this.onDrop}
                        treeData={this.state.gData}
                        onSelect={this.handleonSelect}
                        //onDragLeave={(e)=>this.handleonDragLeave(e)}
                        onDragEnd={(e)=>this.handleonDragLeave(e)}
                        //treeDate={treeData}
                    />

                </div>
                :''
                }
                {this.state.deleteThemeModalFlag &&
                     <DeleteModel open={this.state.deleteThemeModalFlag}
                     onHandleClose={()=>{this.deleteModalClose()}}
                     onHandleRemove={()=>{this.deleteThemeTitle(this.state.selectedThemeId)}} description={this.state.description}></DeleteModel>
                }
                  {this.state.deleteSubThemeModalFlag &&
                     <DeleteModel open={this.state.deleteSubThemeModalFlag}
                     onHandleClose={()=>{this.deleteModalClose()}}
                     onHandleRemove={()=>{this.deleteThemeTitle(this.state.selectedThemeId)}} description={this.state.subThemeDescription}></DeleteModel>
                }

                {this.state.deleteTagModalFlag && 
                    <DeleteModel open={this.state.deleteTagModalFlag}
                    onHandleClose={()=>{this.deleteModalClose()}}
                    onHandleRemove={()=>{this.deleteTag(this.state.selectedTagId)}} description={this.state.TagDescription}></DeleteModel>
                }
            </>
        );
    }
}

//ReactDOM.render(<Demo />, document.getElementById('container'));
export default (Demo);
