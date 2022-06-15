/* eslint-disable no-underscore-dangle */
/* eslint-disable no-useless-escape */
import { Card, Grid, TextField, Tooltip, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import React, { useState } from 'react';
import ChipIcon from '../../../assets/images/graphs/chip.png';
import DownloadIcon from '../../../assets/images/graphs/download.png';
import RemoveIcon from '../../../assets/images/graphs/remove.png';
import { deleteGraph, getGraphCSVLink, updateGraphName } from '../../services/GraphService';
import DeleteModel from '../deleteModal/DeleteModel';
import ProgressBarGraph from './ProgressBarGraph';

export default function GraphCard({ obj, key, removeGraphFromList }) {
  // console.log('object :: ', obj);
  const [graph_name, setName] = React.useState(obj.graph_name);
  const [old_graph_name, setOldName] = React.useState(obj.graph_name);
  const [isNameFocused, setIsNamedFocused] = React.useState(false);
  const [show, setShow] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);

  const handleClickOpenModel = () => {
    setDeleteModalOpen(true);
  };
  const deleteModalClose = (isConfirm) => {
    // console.log('isConfirm :: ', isConfirm);

    if (isConfirm) {
      // TODO: DELETE API CALL & second remove from card list
      // setDeleteModalOpen(false);
      // console.log('key ::', key);
      // removeGraphFromList(key, obj);
      removeGraphFromList(key, obj);
      setDeleteModalOpen(false);
      // setTimeout(() => {
      //   setDeleteModalOpen(false);
      // }, 5000);
      deleteGraph(true, obj._id?.$oid)
        .then((response) => {
          if (response.status_code === 200 && response?.success) {
            // removeGraphFromList(key, obj);
            // setDeleteModalOpen(false);
          } else {
            // TODO: add card which is deleted
          }
        })
        .catch((error) => {
          console.log(error);
          // TODO: add card which is deleted
        });
    } else {
      setDeleteModalOpen(false);
    }
  };

  const keyPress = (event) => {
    // console.log('event :: ', event);
    if(event.keyCode == 13){
      // console.log('event ::', event.keyCode,' value ', event.target.value);
      handleNameChange(event.target.value);
   }
  };

  const handleNameChange = (new_graph_name) => {
    // TODO: 1.5 add  sec loader
    // console.log('event.target.value :: ', new_graph_name);
    setIsNamedFocused(false);

    if (graph_name !== old_graph_name) {
      setName(new_graph_name);

      updateGraphName(true, obj._id?.$oid, new_graph_name)
        .then((response) => {
          if (response.status_code !== 200 || !response?.data) {
            setName(old_graph_name);
          }
        })
        .catch((error) => {
          console.log(error);
          setName(old_graph_name);
        });
    }
  };


  const handleDownloadFile = () => {
    setShow((prev) => !prev);

    getGraphCSVLink(obj._id?.$oid, true)
      .then((response) => {
        if (response.status_code === 200 && response?.data) {
          // const url = 'https://www.sample-videos.com/csv/Sample-Spreadsheet-10000-rows.csv';
          // const url =
          //   'https://s3.amazonaws.com/com.knit.dev/public/knit/project/6299acbcd8fa0f3531ea434b/csv_data/1654578930.csv';
          const filename = response?.data.replace(/^.*[\\\/]/, '');
          fetch(response?.data)
            .then((response_blob) => response_blob.blob())
            .then((blob) => {
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = filename;
              link.click();
              document.body.removeChild(link);
            })
            .catch(console.error);
        }
        setShow(false);
      })
      .catch((error) => {
        console.log(error);
        setShow(false);
      });
  };

  return (
    <>
      <DeleteModel
        open={deleteModalOpen}
        onHandleClose={() => {
          deleteModalClose(false);
        }}
        description={`Are you sure you want to delete the '${graph_name}' Graph? `}
        onHandleRemove={() => {
          deleteModalClose(true);
        }}
      />
      <Grid item xl={4} lg={4} md={6} sm={12} xs={12} className="graph-card">
        <Card className="graph-Card-Box">
          <div className="graph-card-header">
            <div className="graph-card-title">
              <div className="graph-title-box">
                {!isNameFocused ? (
                  <Tooltip title={graph_name} placement="bottom-start">
                    <Typography
                      className="graph-title"
                      onClick={() => {
                        setOldName(graph_name);
                        setIsNamedFocused(true);
                      }}
                    >
                      {graph_name}
                    </Typography>
                  </Tooltip>
                ) : (
                  <TextField
                    autoFocus
                    className="graph-title input-graph-title"
                    value={graph_name}
                    onChange={(event) => setName(event.target.value)}
                    onBlur={(event) => handleNameChange(event.target.value)}
                    onKeyDown={(event) => keyPress(event)} 
                  />
                )}
              </div>
              <div className="graph-icons">
                {!show && (
                  <Tooltip title="Export CSV" placement="bottom-start" className="c-pointer">
                    <IconButton aria-label="download" onClick={() => handleDownloadFile()}>
                      <img src={DownloadIcon} alt="Download" />
                    </IconButton>
                  </Tooltip>
                )}
                {show && <CircularProgress className="CircleProgressBar" />}
                <Tooltip title="Delete" placement="bottom-start" className="c-pointer">
                  <IconButton aria-label="delete">
                    <img src={RemoveIcon} alt="Remove" onClick={() => handleClickOpenModel()} />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </div>

          <div className="graph-ques-ans-box">
            {obj && obj.tag_data ? (
              obj.tag_data.map((tag, index) => (
                <div className="Ques-Ans-Progress" key={index}>
                  <Grid container direction="row" alignItems="center" spacing={1}>
                    <Grid item xs={4} lg={4} md={4} sm={4}>
                      <Tooltip title={tag.tag_name} placement="bottom-start">
                        <div className="graph-tags">{tag.tag_name}</div>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={8} lg={8} md={8} sm={8}>
                      <ProgressBarGraph tag={tag} total_tag_usage_count={obj.total_tag_usage_count} />
                    </Grid>
                  </Grid>
                </div>
              ))
            ) : (
              <p>No Tags Found.</p>
            )}
          </div>
          <div className="generate-Chips">
            {obj.graph_type === 'AUTO_GENERATED' ? (
              <Typography>
                Generated by <img src={ChipIcon} alt="Chip" />
              </Typography>
            ) : (
              <></>
            )}
          </div>
        </Card>
      </Grid>
    </>
  );
}
