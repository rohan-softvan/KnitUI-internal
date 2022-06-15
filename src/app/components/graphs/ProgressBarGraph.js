/* eslint-disable react/jsx-props-no-spreading */
import { Box, Grid, Typography } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import React from 'react';

function LinearProgressWithLabel({ progress, ...props }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={progress} {...props} />
      </Box>
      {/* <Box sx={{minWidth: 35}}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
              props.value,
          )}`}</Typography>
        </Box> */}
    </Box>
  );
}

export default function ProgressBarGraph({ tag, total_tag_usage_count }) {
  // const [progress, setProgress] = React.useState(tag.tag_usage_count);
  // React.useEffect(() => {
  //   const timer = setInterval(() => {
  //     setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
  //   }, 800);
  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

  return (
    <Grid container direction="row" alignItems="center" spacing={0}>
      <Grid item xs={10} lg={10} md={10} sm={10}>
        <LinearProgressWithLabel
          value={(tag.tag_usage_count / total_tag_usage_count) * 100}
          className="customProgress"
        />
      </Grid>
      <Grid item xs={2} lg={2} md={2} sm={2}>
        <Typography className="countNumber">{tag.tag_usage_count}</Typography>
      </Grid>
    </Grid>
  );
}
