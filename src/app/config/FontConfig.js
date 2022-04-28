const FontFamilyName   = [
    {title: "Courier",key: 1,value:'Courier',type:['regular','bold','boldOblique','oblique']},
    {title: "Helvetica",key: 2,value:'Helvetica',type:['regular','bold','boldOblique','oblique']},
    {title: "NewCenturySchlbk",key: 3,value:'NewCenturySchlbk',type:['bold','boldOblique','oblique']},
    {title: "Palatino",key: 4,value:'Palatino',type:['bold','boldOblique','oblique']},
    {title: "Times",key: 5,value:'Times',type:['bold','boldOblique','oblique']},
    {title: "Bitstream-Charter",key: 6,value:'Bitstream-Charter',type:['regular','bold','boldOblique','oblique']},
    {title: "Century-Schoolbook-L",key: 7,value:'Century-Schoolbook-L',type:['bold','boldOblique','oblique']},
    {title: "Courier-10-Pitch",key: 8,value:'Courier-10-Pitch',type:['regular','bold','boldOblique','oblique']},
    {title: "DejaVu-Sans",key: 9,value:'DejaVu-Sans',type:['regular','bold','boldOblique','oblique']},
    {title: "Nimbus-Mono-L",key: 10,value:'Nimbus-Mono-L',type:['regular','bold','boldOblique']},
    {title: "Nimbus-Sans-L",key: 11,value:'Nimbus-Sans-L',type:['regular','bold','boldOblique']},
    {title: "URW-Palladio-L",key: 12,value:'URW-Palladio-L',type:[,'bold','boldOblique','oblique']},
    {title: "Utopia",key: 13,value:'Utopia',type:['regular','bold','boldOblique','oblique']},

]
const FontFamilyType=[
    {title: "Regular",key: 1,value:'regular'},
    {title: "Bold",key: 2,value:'bold'},
    {title: "Bold-Italic",key: 3,value:'boldOblique'},
    {title: "Italic",key: 4,value:'oblique'},
]

const fontsize = [
    {
        title: "10",
        key: 1,
        value:10
    },
    {
        title: "20",
        key: 2,
        value:20
    },
    {
        title: "30",
        key: 3,
        value:30
    },
    {
        title: "40",
        key: 4,
        value:40
    },
    {
        title: "50",
        key: 5,
        value:50
    },
  ];
  

const mainFontConfig=[
    {key:1,name:'Courier',type:'regular',value:'Courier'},
    {key:1,name:'Courier',type:'bold',value:'Courier-Bold'},
    {key:1,name:'Courier',type:'boldOblique',value:'Courier-BoldOblique'},
    {key:1,name:'Courier',type:'oblique',value:'Courier-Oblique'},
    
    {key:2,name:'Helvetica',type:'regular',value:'Helvetica'},
    {key:2,name:'Helvetica',type:'bold',value:'Helvetica-Bold'},
    {key:2,name:'Helvetica',type:'boldOblique',value:'Helvetica-BoldOblique'},
    {key:2,name:'Helvetica',type:'oblique',value:'Helvetica-Oblique'},

    {key:2,name:'NewCenturySchlbk',type:'bold',value:'NewCenturySchlbk-Bold'},
    {key:2,name:'NewCenturySchlbk',type:'boldOblique',value:'NewCenturySchlbk-BoldItalic'},
    {key:2,name:'NewCenturySchlbk',type:'oblique',value:'NewCenturySchlbk-Italic'},

    {key:2,name:'Palatino',type:'bold',value:'Palatino-Bold'},
    {key:2,name:'Palatino',type:'boldOblique',value:'Palatino-BoldItalic'},
    {key:2,name:'Palatino',type:'oblique',value:'Palatino-Italic'},

    {key:2,name:'Times',type:'bold',value:'Times-Bold'},
    {key:2,name:'Times',type:'boldOblique',value:'Times-BoldItalic'},
    {key:2,name:'Times',type:'oblique',value:'Times-Italic'},


    {key:2,name:'Bitstream-Charter',type:'regular',value:'Bitstream-Charter'},
    {key:2,name:'Bitstream-Charter',type:'bold',value:'Bitstream-Charter-Bold'},
    {key:2,name:'Bitstream-Charter',type:'boldOblique',value:'Bitstream-Charter-Bold-Italic'},
    {key:2,name:'Bitstream-Charter',type:'oblique',value:'Bitstream-Charter-Italic'},

    {key:2,name:'Century-Schoolbook-L',type:'bold',value:'Century-Schoolbook-L-Bold'},
    {key:2,name:'Century-Schoolbook-L',type:'boldOblique',value:'Century-Schoolbook-L-Bold-Italic'},
    {key:2,name:'Century-Schoolbook-L',type:'oblique',value:'Century-Schoolbook-L-Italic'},

    {key:2,name:'Courier-10-Pitch',type:'regular',value:'Courier-10-Pitch'},
    {key:2,name:'Courier-10-Pitch',type:'bold',value:'Courier-10-Pitch-Bold'},
    {key:2,name:'Courier-10-Pitch',type:'boldOblique',value:'Courier-10-Pitch-Bold-Italic'},
    {key:2,name:'Courier-10-Pitch',type:'oblique',value:'Courier-10-Pitch-Italic'},

    {key:2,name:'DejaVu-Sans',type:'regular',value:'DejaVu-Sans'},
    {key:2,name:'DejaVu-Sans',type:'bold',value:'DejaVu-Sans-Bold'},
    {key:2,name:'DejaVu-Sans',type:'boldOblique',value:'DejaVu-Sans-Bold-Oblique'},
    {key:2,name:'DejaVu-Sans',type:'oblique',value:'DejaVu-Sans-Oblique'},

    {key:2,name:'Nimbus-Mono-L',type:'regular',value:'Nimbus-Mono-L'},
    {key:2,name:'Nimbus-Mono-L',type:'bold',value:'Nimbus-Mono-L-Bold'},
    {key:2,name:'Nimbus-Mono-L',type:'boldOblique',value:'Nimbus-Mono-L-Bold-Oblique'},


    {key:2,name:'Nimbus-Sans-L',type:'regular',value:'Nimbus-Sans-L'},
    {key:2,name:'Nimbus-Sans-L',type:'bold',value:'Nimbus-Sans-L-Bold'},
    {key:2,name:'Nimbus-Sans-L',type:'boldOblique',value:'Nimbus-Sans-L-Bold-Italic'},


    {key:2,name:'URW-Palladio-L',type:'bold',value:'URW-Palladio-L-Bold'},
    {key:2,name:'URW-Palladio-L',type:'boldOblique',value:'URW-Palladio-L-Bold-Italic'},
    {key:2,name:'URW-Palladio-L',type:'oblique',value:'URW-Palladio-L-Italic'},

    {key:2,name:'Utopia',type:'regular',value:'Utopia'},
    {key:2,name:'Utopia',type:'bold',value:'Utopia-Bold'},
    {key:2,name:'Utopia',type:'boldOblique',value:'Utopia-Bold-Italic'},
    {key:2,name:'Utopia',type:'oblique',value:'Utopia-Italic'},

]
export default {
    FontFamilyName:FontFamilyName,
    FontFamilyType:FontFamilyType,
    Fontsize:fontsize,
    mainFontConfig:mainFontConfig
};
