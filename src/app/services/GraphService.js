import { BASE_URL } from '../Constants';
import { request } from './UtilService';
// const BASE_URL = 'https://z8u0f7pppb.execute-api.us-east-1.amazonaws.com/dev';

const DATA_PATH = 'project/graph';

// get all graphs data
export async function getAllGraphs(is_graph_fetch, knit_project_id, page_number, page_size) {
  return request({
    url: `${BASE_URL}${DATA_PATH}/retrieval?is_graph_fetch=${is_graph_fetch}&knit_project_id=${knit_project_id}&page_number=${page_number}&page_size=${page_size}`,
    method: 'GET',
  });
}

// https://z8u0f7pppb.execute-api.us-east-1.amazonaws.com/dev/project/graph/fetch?knit_graph_id=6299acbcd8fa0f3531ea434b&is_export=true
// GET
// get csv download link
export async function getGraphCSVLink(knit_graph_id, is_export) {
  return request({
    url: `${BASE_URL}${DATA_PATH}/fetch?knit_graph_id=${knit_graph_id}&is_export=${is_export}`,
    method: 'GET',
  });
}

// https://z8u0f7pppb.execute-api.us-east-1.amazonaws.com/dev/project/graph/update
// POST
// {
//   "is_graph_update":true,
//   "knit_graph_id":"6299acfd0dc10607186c6fb8",
//   "graph_name":"Upload an Image of the Planting a tree"
// }
// update graph name
export async function updateGraphName(is_graph_update, knit_graph_id, graph_name) {
  return request({
    url: `${BASE_URL}${DATA_PATH}/update`,
    method: 'POST',
    body: JSON.stringify({ is_graph_update, knit_graph_id, graph_name }),
  });
}

// https://z8u0f7pppb.execute-api.us-east-1.amazonaws.com/dev/project/graph/delete?is_graph_delete=true&knit_graph_id=6299ac4dee5cc9a3426bd24b
// GET
// delete graph
export async function deleteGraph(is_graph_delete, knit_graph_id) {
  return request({
    url: `${BASE_URL}${DATA_PATH}/delete?knit_graph_id=${knit_graph_id}&is_graph_delete=${is_graph_delete}`,
    method: 'GET',
  });
}
