import { Card, Grid } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';

export default function GraphCardSkeleton() {
  return (
    <>
      <Grid item xl={4} lg={4} md={6} sm={12} xs={12} className="graph-card">
        <Card className="graph-Card-Box">
          <div className="graph-card-header">
            <div className="graph-card-title">
              <div className="graph-title-box">
                <Skeleton variant="rectangular" width="80%" height={15} style={{ margin: '4px 0px' }} />
              </div>
              <div className="graph-icons" style={{ display: 'flex' }}>
                <Skeleton variant="rectangular" width={20} height={15} style={{ marginRight: '25px' }} />
                <Skeleton variant="rectangular" width={20} height={15} />
              </div>
            </div>
          </div>
          <div className="graph-ques-ans-box">
            <div className="Ques-Ans-Progress">
              <Grid container direction="row" alignItems="center" spacing={2}>
                <Grid item xs={4} lg={4} md={4} sm={4}>
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="80%" />
                </Grid>
                <Grid item xs={6} lg={7} md={6} sm={6}>
                  <Skeleton variant="text" width="100%" />
                </Grid>
                <Grid item xs={2} lg={1} md={2} sm={2}>
                  <Skeleton variant="text" width="100%" />
                </Grid>
              </Grid>
            </div>
            <div className="Ques-Ans-Progress">
              <Grid container direction="row" alignItems="center" spacing={2}>
                <Grid item xs={4} lg={4} md={4} sm={4}>
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="80%" />
                </Grid>
                <Grid item xs={6} lg={7} md={6} sm={6}>
                  <Skeleton variant="text" width="100%" />
                </Grid>
                <Grid item xs={2} lg={1} md={2} sm={2}>
                  <Skeleton variant="text" width="100%" />
                </Grid>
              </Grid>
            </div>
            <div className="Ques-Ans-Progress">
              <Grid container direction="row" alignItems="center" spacing={2}>
                <Grid item xs={4} lg={4} md={4} sm={4}>
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="80%" />
                </Grid>
                <Grid item xs={6} lg={7} md={6} sm={6}>
                  <Skeleton variant="text" width="100%" />
                </Grid>
                <Grid item xs={2} lg={1} md={2} sm={2}>
                  <Skeleton variant="text" width="100%" />
                </Grid>
              </Grid>
            </div>
            <div className="Ques-Ans-Progress">
              <Grid container direction="row" alignItems="center" spacing={2}>
                <Grid item xs={4} lg={4} md={4} sm={4}>
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="80%" />
                </Grid>
                <Grid item xs={6} lg={7} md={6} sm={6}>
                  <Skeleton variant="text" width="100%" />
                </Grid>
                <Grid item xs={2} lg={1} md={2} sm={2}>
                  <Skeleton variant="text" width="100%" />
                </Grid>
              </Grid>
            </div>
            <div className="Ques-Ans-Progress">
              <Grid container direction="row" alignItems="center" spacing={2}>
                <Grid item xs={4} lg={4} md={4} sm={4}>
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="80%" />
                </Grid>
                <Grid item xs={6} lg={7} md={6} sm={6}>
                  <Skeleton variant="text" width="100%" />
                </Grid>
                <Grid item xs={2} lg={1} md={2} sm={2}>
                  <Skeleton variant="text" width="100%" />
                </Grid>
              </Grid>
            </div>
            <div className="Ques-Ans-Progress">
              <Grid container direction="row" alignItems="center" spacing={2}>
                <Grid item xs={4} lg={4} md={4} sm={4}>
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="80%" />
                </Grid>
                <Grid item xs={6} lg={7} md={6} sm={6}>
                  <Skeleton variant="text" width="100%" />
                </Grid>
                <Grid item xs={2} lg={1} md={2} sm={2}>
                  <Skeleton variant="text" width="100%" />
                </Grid>
              </Grid>
            </div>
          </div>
          <div className="generate-Chips">
            <Skeleton variant="rectangular" width={100} height={15} style={{ margin: '4px 0px 5px' }} />
            <Skeleton variant="rectangular" width={20} height={15} style={{ margin: '4px 0px 5px 10px' }} />
          </div>
        </Card>
      </Grid>
    </>
  );
}
