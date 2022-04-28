const firstLevel   = [1,8,15,22]
const secondLevel  = [2,9,16,23]
const thirdLevel   = [3,10,17,24]
const fourthLevel  = [4,11,18,25]
const fifthLevel   = [5,12,19,26]
const sixthLevel   = [6,13,20,27]
const seventhLevel = [7,14,21,28]

const appThemeColor = (type,opacity) => {
    if(firstLevel.includes(type)){
        return 'rgba(18,152,138,'+opacity+')';
    }else if(secondLevel.includes(type)){
        return "rgba(244,160,0,"+opacity+")";
    }else if(thirdLevel.includes(type)){
        return "rgba(0,24,57,"+opacity+")";
    }else if(fourthLevel.includes(type)){
        return "rgba(209,73,38,"+opacity+")";
    }else if(fifthLevel.includes(type)){
        return "rgba(8,72,64,"+opacity+")";
    }else if(sixthLevel.includes(type)){
        return "rgba(211,101,130,"+opacity+")";
    }else if(seventhLevel.includes(type)){
        return "rgba(100,44,169,"+opacity+")";
    }else{
        return "rgba(226,226,226,1)"
    }
  };

export  const getCombineThemeColor = (color1,color2) =>{
    let split_color1 = color1.replace("rgba(","").replace(")","").split(",")
    let split_color2 = color2.replace("rgba(","").replace(")","").split(",")
    let color3 = ""
    for (let i =0 ; i<split_color1.length - 1; i++){
        let mixer = parseInt(split_color1[i])*parseFloat(split_color1[3])*(1 - parseFloat(split_color2[3])) + parseInt(split_color2[i])*parseFloat(split_color1[3])
        color3 += mixer.toString() + ","
    }
    // color3 = "rgba("+color3+(parseFloat(split_color1[3])*(1 - parseFloat(split_color2[3])) + parseFloat(split_color2[3])).toString() + ")"
    color3 = "rgba("+color3+"0.2)"
    return color3

}

  export default appThemeColor;


