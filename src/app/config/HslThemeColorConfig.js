
 const firstLevel   = [1,8,15,22]
 const secondLevel  = [2,9,16,23]
 const thirdLevel   = [3,10,17,24]
 const fourthLevel  = [4,11,18,25]
 const fifthLevel   = [5,12,19,26]
 const sixthLevel   = [6,13,20,27]
 const seventhLevel = [7,14,21,28]
 
 const appHSLThemeConfig=(type,opacity)=>{
     let strOpacity = '' + opacity;
     let numOpacity = strOpacity.replace(/%/g, '') * 1;
     numOpacity = numOpacity === 100 ? "" : numOpacity;
    if(firstLevel.includes(type)){
        return '#12988A' + numOpacity;
    }else if(secondLevel.includes(type)){
        return '#F4A000' + numOpacity;
    }else if(thirdLevel.includes(type)){
        return '#001839' + numOpacity;
    }else if(fourthLevel.includes(type)){
        return '#D14926'+ numOpacity;
    }else if(fifthLevel.includes(type)){
        return '#084840'+ numOpacity;
    }else if(sixthLevel.includes(type)){
        return '#D36582'+ numOpacity;
    }else if(seventhLevel.includes(type)){
        return '#642CA9'+ numOpacity;
    }else{

    }
}
export default appHSLThemeConfig;