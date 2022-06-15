/* eslint-disable no-underscore-dangle */
import { Grid, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import GraphCard from '../../../components/graphs/GraphsCard';
import GraphCardSkeleton from '../../../components/graphs/GraphsCardSkeleton';
import '../../../css/common.scss';
import { getAllGraphs } from '../../../services/GraphService';
import PageWrapper from '../../PageWrapper/PageWrapper';
import './Graph.scss';

function getQueryStringValue() {
  return window.location.href.split('/')[5];
}

class Graphs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page_number: 1,
      page_size: 6,
      has_more: true,
      items: [],
      total_graphs: 0,
      is_first_time_load: true,
      count: 1,
      projectId: '',
    };
  }

  componentDidMount() {
    const projectId = getQueryStringValue();
    if (projectId) {
      this.setState({ projectId }, () => {
        this.getAllGraphsData();
      });
    }
  }

  getAllGraphsData = () => {
    // setTimeout(() => {
    //   // items: items1.data.graph_data,
    //   if (this.state.count < 4) {
    //     // TODO add logic for hash more if new data.length not equal to page size then no data
    //     // items: this.state.items.concat(items1.data.graph_data),
    //     this.setState({
    //       page_number: this.state.page_number + 1,
    //       items: this.state.items.concat(items1.data.graph_data),
    //       total_graphs: items1.data.total_graphs ? items1.data.total_graphs : total_graphs,
    //       count: this.state.count + 1,
    //     });
    //   } else {
    //     this.setState({ has_more: false });
    //   }

    //   if (this.state.is_first_time_load) {
    //     this.setState({
    //       is_first_time_load: !this.state.is_first_time_load,
    //     });
    //   }
    // }, 4000);
    // getAllGraphs(true, '62566d90e610ef0009603543', this.state.page_number, this.state.page_size)
    getAllGraphs(true, this.state.projectId, this.state.page_number, this.state.page_size)
        .then((response) => {
          if (response.status_code === 200 && response?.data?.graph_data) {
            // update page number, page size, data, has more
            // items: this.state.items.concat(Array.from({ length: 20 }))
            // items: this.state.items.concat(response.data.graph_data),
            this.setState({
              page_number: this.state.page_number + 1,
              items: this.state.items.concat(response.data.graph_data),
              total_graphs: response.data.total_graphs ? response.data.total_graphs : this.state.total_graphs,
              has_more: response.data.graph_data.length >= this.state.page_size,
            });
          } else {
            this.setState({ has_more: false });
          }
          if (this.state.is_first_time_load) {
            this.setState({
              is_first_time_load: !this.state.is_first_time_load,
            });
          }
        })
        .catch((_error) => {
          this.setState({ has_more: false });
        });
  };

  removeGraphFromList = (index, object) => {
    const { items } = this.state;
    // console.log('items :: b ', items, ' index :: ', index);
    // items.splice(index + 1, 1);
    // console.log('items :: a ', items, ' index :: ', index);
    // items = items.filter((data) => data._id?.$oid != object._id?.$oid);
    // console.log('items :: ', items);
    // const i = items.findIndex((data) => data._id?.$oid === object._id?.$oid);
    // console.log('items :: b ', items, ' index :: ', index, ' i ', i, 'object._id?.$oid :: ', object._id?.$oid);
    items.splice(
        items.findIndex((data) => data._id?.$oid === object._id?.$oid),
        1
    );
    // console.log('items :: a ', items, ' index :: ', index);
    this.setState({ items, total_graphs: this.state.total_graphs - 1 });
  };

  renderTitle = (total_graphs) => (
      <Grid container spacing={1}>
        <Grid item xs={12} md={12} lg={12} sm={12}>
          <Typography variant="h6" component="h6" className="title-class">
            Graphs
          </Typography>
          {this.state.items && total_graphs ? (
              <Typography className="subTitle">
                Showing {this.state.items.length} of {total_graphs} graphs
              </Typography>
          ) : (
              <></>
          )}
        </Grid>
      </Grid>
  );

  render() {
    const { items, is_first_time_load, total_graphs, has_more } = this.state;
    return (
        <PageWrapper selected={1} selectedId={5} isSidebar projectId={this.state.projectId}>
          <div style={{ width: '100%' }}>
            <div style={{ width: 'calc(100% - 180px)', overflow: 'overlay', float: 'right', background: '#FBFBFB' }}>
              <div className="main-class">
                {this.renderTitle(total_graphs)}

                {is_first_time_load && (
                    <Grid container direction="row" spacing={2}>
                      <GraphCardSkeleton />
                      <GraphCardSkeleton />
                    </Grid>
                )}

                <Grid container direction="row" className="innerLayoutSpace">
                  <InfiniteScroll
                      dataLength={items.length}
                      next={this.getAllGraphsData}
                      hasMore={has_more}
                      loader={!is_first_time_load ? <CircularProgress className="loaderScroll" /> : <></>}
                      height={725}
                  >
                    {!is_first_time_load &&
                        items &&
                        items.map((object, index) => (
                            <GraphCard obj={object} key={object._id?.$oid} removeGraphFromList={this.removeGraphFromList} />
                        ))}
                    {!is_first_time_load && items.length === 0 && (
                        <Typography className="empty-message">No graphs to show.</Typography>
                    )}
                  </InfiniteScroll>
                </Grid>
              </div>
            </div>
          </div>
        </PageWrapper>
    );
  }
}

export default Graphs;

const data = {
  success: 1,
  data: [
    {
      graph_name: 'Graph Name',
      total_tag_usage_count: 270,
      tag_data: [
        {
          tag_name: 'Keep up with latest trends',
          total_tag_usage_count: 90,
        },
        {
          tag_name: 'Brand is always updating',
          total_tag_usage_count: 90,
        },
        {
          tag_name: 'Values they believe in',
          total_tag_usage_count: 90,
        },
      ],
    },
  ],
};

const items1 = {
  status_code: 200,
  success: true,
  message: 'Graph & Themes details found.',
  data: {
    total_graphs: 6,
    graph_data: [
      {
        _id: {
          $oid: '6299ac93ee5cc9a3426bd24d',
        },
        graph_name: 'Upload a Video of your plant review',
        graph_type: 'AUTO_GENERATED',
        knit_project_id: {
          $oid: '62566d90e610ef0009603543',
        },
        knit_user_id: {
          $oid: '61fb73f335e32c0009fbe831',
        },
        knit_theme_id: {
          $oid: '6299ac92d2a27f0009cad483',
        },
        question_id: 'QID37',
        question_text: 'Upload a Video of your plant review',
        created_on: 1654218455,
        modified_on: 1654218455,
        is_deleted: false,
        is_pinned: false,
      },
      {
        _id: {
          $oid: '6299acbcd8fa0f3531ea434b',
        },
        graph_name: 'Upload a Video of your plant review',
        graph_type: 'AUTO_GENERATED',
        knit_project_id: {
          $oid: '62566d90e610ef0009603543',
        },
        knit_user_id: {
          $oid: '61fb73f335e32c0009fbe831',
        },
        knit_theme_id: {
          $oid: '6299acbbd2a27f0009cad490',
        },
        question_id: 'QID37',
        question_text: 'Upload a Video of your plant review',
        created_on: 1654218586,
        modified_on: 1654218586,
        is_deleted: false,
        is_pinned: false,
        total_tag_usage_count: 5,
        tag_data: [
          {
            _id: {
              $oid: '6299acbdd2a27f0009cad492',
            },
            tag_name: 'City facilities',
            tag_usage_count: 3,
          },
          {
            _id: {
              $oid: '6299acc3d2a27f0009cad498',
            },
            tag_name: 'Restaurant Brands',
            tag_usage_count: 1,
          },
          {
            _id: {
              $oid: '6299acc9d2a27f0009cad49e',
            },
            tag_name: 'User feedbacks',
            tag_usage_count: 1,
          },
        ],
      },
      {
        _id: {
          $oid: '6299acfd0dc10607186c6fb8',
        },
        graph_name: 'Upload an Image of the Planting a tree',
        graph_type: 'AUTO_GENERATED',
        knit_project_id: {
          $oid: '62566d90e610ef0009603543',
        },
        knit_user_id: {
          $oid: '61fb73f335e32c0009fbe831',
        },
        knit_theme_id: {
          $oid: '6299acfca7ec140009373189',
        },
        question_id: 'QID36',
        question_text: 'Upload an Image of you Planting a tree',
        created_on: 1654218642,
        modified_on: 1654254740,
        is_deleted: false,
        is_pinned: false,
        total_tag_usage_count: 2,
        tag_data: [
          {
            _id: {
              $oid: '6299acffa7ec14000937318b',
            },
            tag_name: 'Customer preferences',
            tag_usage_count: 1,
          },
          {
            _id: {
              $oid: '6299ad03a5a806000840baf0',
            },
            tag_name: 'Product features',
            tag_usage_count: 1,
          },
        ],
      },
      {
        _id: {
          $oid: '6299ac93ee5cc9a3426bd24d',
        },
        graph_name: 'Upload a Video of your plant review',
        graph_type: 'AUTO_GENERATED',
        knit_project_id: {
          $oid: '62566d90e610ef0009603543',
        },
        knit_user_id: {
          $oid: '61fb73f335e32c0009fbe831',
        },
        knit_theme_id: {
          $oid: '6299ac92d2a27f0009cad483',
        },
        question_id: 'QID37',
        question_text: 'Upload a Video of your plant review',
        created_on: 1654218455,
        modified_on: 1654218455,
        is_deleted: false,
        is_pinned: false,
      },
      {
        _id: {
          $oid: '6299acbcd8fa0f3531ea434b',
        },
        graph_name: 'Upload a Video of your plant review',
        graph_type: 'AUTO_GENERATED',
        knit_project_id: {
          $oid: '62566d90e610ef0009603543',
        },
        knit_user_id: {
          $oid: '61fb73f335e32c0009fbe831',
        },
        knit_theme_id: {
          $oid: '6299acbbd2a27f0009cad490',
        },
        question_id: 'QID37',
        question_text: 'Upload a Video of your plant review',
        created_on: 1654218586,
        modified_on: 1654218586,
        is_deleted: false,
        is_pinned: false,
        total_tag_usage_count: 5,
        tag_data: [
          {
            _id: {
              $oid: '6299acbdd2a27f0009cad492',
            },
            tag_name: 'City facilities',
            tag_usage_count: 3,
          },
          {
            _id: {
              $oid: '6299acc3d2a27f0009cad498',
            },
            tag_name: 'Restaurant Brands',
            tag_usage_count: 1,
          },
          {
            _id: {
              $oid: '6299acc9d2a27f0009cad49e',
            },
            tag_name: 'User feedbacks',
            tag_usage_count: 1,
          },
        ],
      },
      {
        _id: {
          $oid: '6299acfd0dc10607186c6fb8',
        },
        graph_name: 'Upload an Image of the Planting a tree',
        graph_type: 'AUTO_GENERATED',
        knit_project_id: {
          $oid: '62566d90e610ef0009603543',
        },
        knit_user_id: {
          $oid: '61fb73f335e32c0009fbe831',
        },
        knit_theme_id: {
          $oid: '6299acfca7ec140009373189',
        },
        question_id: 'QID36',
        question_text: 'Upload an Image of you Planting a tree',
        created_on: 1654218642,
        modified_on: 1654254740,
        is_deleted: false,
        is_pinned: false,
        total_tag_usage_count: 2,
        tag_data: [
          {
            _id: {
              $oid: '6299acffa7ec14000937318b',
            },
            tag_name: 'Customer preferences',
            tag_usage_count: 1,
          },
          {
            _id: {
              $oid: '6299ad03a5a806000840baf0',
            },
            tag_name: 'Product features',
            tag_usage_count: 1,
          },
        ],
      },
    ],
  },
};
