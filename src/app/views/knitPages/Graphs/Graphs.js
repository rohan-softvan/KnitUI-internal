import React, {useEffect, useState} from 'react';
import {Grid, Typography} from "@material-ui/core";
import PageWrapper from "../../PageWrapper/PageWrapper";
import withWidth from "@material-ui/core/withWidth";
import {withRouter} from "react-router-dom";
import Card from '@material-ui/core/Card';
import "./Graphs.scss"
import "../../../css/common.scss";
import Divider from "@material-ui/core/Divider";
import downloadSvg from "../../../../assets/images/graphs/download.svg";
import deleteSvg from "../../../../assets/images/graphs/delete.svg";

function Graphs() {

  const [projectId, setProjectId] = useState('')

  const renderThemeTitle = () => {
    return (
        <Grid container spacing={1}>
          <Grid item xs={12} md={4} lg={4} sm={4}>
            <Typography variant={"h6"} component={"h6"} className={"title-class"}>
              Graphs
            </Typography>
            <Typography className={"subTitle"}>
              Showing 2 of 2 graphs
            </Typography>
          </Grid>
          <Grid item xs={12} md={8} lg={8} sm={8} className={"buttonDiv"}
                style={{display: 'flex', justifyContent: 'flex-end'}}>
          </Grid>
          <Grid item xs={12} md={12} lg={12} sm={12}>

          </Grid>
        </Grid>
    )
  }


  function getQueryStringValue() {
    return window.location.href.split('/')[5];
  }

  useEffect(() => {
    let projectId = getQueryStringValue()
    if (projectId) {
      setProjectId(projectId);
    }
  }, [])

  const renderCard = ({title, question}) => {
    return <Grid item xs={4} sm={4} md={4} lg={4}>
      <Card className={"graphs-card"}>
        <Grid style={{padding: '15px'}}>
          <Grid style={{float: "left"}}>
            <Typography
                component={"span"}
                style={{
                  fontSize: "14px",
                  color: "#001839",
                  textAlign: "left",
                  fontWeight: '500'
                }}>
              {title}
            </Typography></Grid>
          <Grid style={{textAlign: "right"}}>
            <Typography
                component={"span"}
                style={{
                  fontSize: "14px",
                  color: "#001839",
                }}>
              <img alt={"download"} src={downloadSvg} className={"icon"} style={{margin: 5}}/>
              <img alt={"delete"} src={deleteSvg} className={"icon"} style={{margin: 5}}/>
            </Typography></Grid>
        </Grid>

        <Divider style={{marginBottom: '20px'}}/>
        <div className={"question"}>
          What can brands do to make their products more appealing to Gen Z?
        </div>
        <Divider style={{marginBottom: '20px'}}/>
        <div className={"progress-bar-list"}>
          <Grid item xs={4} sm={4} md={4} lg={4}>
            <Typography>Keep up with latest trends</Typography>
          </Grid>
        </div>
      </Card>
    </Grid>
  }

  return (
      <PageWrapper selected={1} selectedId={5} isSidebar={true} projectId={projectId}>
        <div style={{width: "100%"}}>
          <div style={{width: "calc(100% - 180px)", float: "right", background: "#FBFBFB"}}>
            <div className={"main-class"}>
              {renderThemeTitle()}
              <Grid container spacing={2} style={{marginBottom: '20px'}} className={"graphs-grid"}>
                {renderCard({
                  title: 'Graph 1',
                  question: 'What can brands do to make their products more appealing to Gen Z?'
                })}
                {renderCard({
                  title: 'Appealing',
                  question: 'What can brands do to make their products more appealing to Gen Z?'
                })}
              </Grid>
            </div>
          </div>

        </div>
      </PageWrapper>
  );
}

export default withWidth()(withRouter(Graphs));