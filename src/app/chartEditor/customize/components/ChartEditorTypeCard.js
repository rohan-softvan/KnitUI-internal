import React from 'react';
import {Card} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";

function ChartEditorTypeCard({icon, title, component}) {
    return (
        <Card style={{height: 161,display: 'flex',alignItems:'center',justifyContent: 'center'}}>
            <CardContent className={'exportOptions'}>
                <img src={icon} alt={title} className={'imgIcon'}/>
                <div
                    className={`card-title ${component === "chartType" ? 'card-title-chart-type' : 'card-title-export'}`}>{title}</div>
            </CardContent>
        </Card>
    );
}

export default ChartEditorTypeCard;