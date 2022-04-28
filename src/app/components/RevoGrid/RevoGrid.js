import React, {Component, useEffect} from "react";
import { defineCustomElements } from "@revolist/revogrid/loader"; // webcomponent definition loader
import { RevoGrid } from "@revolist/revogrid-react";


// export const myTemplate = (h, column) => {
//     return <span style={{ color: 'red' }}><div class="me">{column.name}</div></span>;
// }

// function getQueryStringValue() {
//     return window.location.href.split('/')[5];
// }
// function getListStringValue() {
//     return window.location.href.split('=')[1];
// }


export default function RevoGridFunctional(props) {
    useEffect(() => {
        defineCustomElements();
    });


    return (
    <div style={{ "border": '1px solid #DDDDDD', 'borderRadius': '10px' }}>
        <RevoGrid
            theme="material"
            columns={props.revoColumns}
            source={props.source}
            onBeforeeditstart={(e) => { e.preventDefault() }}
            // onAfterEdit={(e) => this.afterEdit(e)}
            // onBeforeaange={(e)=>{console.log("e==?",e)}}
            // onBeforeaange={(e)=>{console.log("e==?",e)}}
            resize={true}
            range={true}
            // canFocus={false}
            useClipboard={true}
            stretch={true}
            // rowDefinitions= {rowDefinitions}
            // sortable={true}
            // rowDefinitions={[{ type: 'row', index: 0, size: 45 }]}
            // readonly={true}
        />
    </div>
    )

}