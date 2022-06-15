import React, { lazy } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import { PrivateRoute } from '../../components/common/PrivateRoute.js';
import { roleEnum } from '../../enums/index.js';

const Projects = lazy(() => import('./Projects/Projects'));
const Members = lazy(() => import('./Members/Members'));
const Videos = lazy(() => import('./Videos/Videos'));
const VideoDetails = lazy(() => import('./VideoDetails/VideoDetails'));
const Data = lazy(() => import('./Data/Data'));
const DataAnnotation = lazy(() => import('./OpenTextAnnotation/DataAnnotation'));
const ShowReels = lazy(() => import('./ShowReels/ShowReels'));
const Themes = lazy(() => import('./Themes/Themes'));
const Graphs = lazy(() => import('./Graphs/Graphs'));
const KnitRoutes = [
  {
    path: '/knit/projects',
    name: 'Projects',
    Component: Projects,
  },
  {
    path: '/knit/projectsDetails/:id/Data',
    name: 'Project-Details',
    Component: Data,
  },
  {
    path: '/knit/projectsDetails/:id/Data?view=list&questionId=:questionId&numericId=:numericId',
    name: 'Project-Details',
    Component: DataAnnotation,
  },
  {
    path: '/knit/projectsDetails/:id/Data?view=grid&questionId=:questionId&numericId=:numericId',
    name: 'Project-Details',
    Component: DataAnnotation,
  },
  {
    path: '/knit/projectsDetails/:id/Data?view=list',
    name: 'Project-Details',
    Component: Data,
  },
  {
    path: '/knit/projectsDetails/:id/Data?view=grid',
    name: 'Project-Details',
    Component: Data,
  },
  {
    path: '/knit/projectsDetails/:id/Video?view=grid',
    name: 'Project-Details',
    Component: Videos,
  },
  {
    path: '/knit/projectsDetails/:id/Video?view=list',
    name: 'Project-Details',
    Component: Videos,
  },
  {
    path: '/knit/projectsDetails/:id/Video/:vid',
    name: 'Project-Details',
    Component: VideoDetails,
  },
  {
    path: '/knit/projectsDetails/:id/Video',
    name: 'Project-Details',
    Component: Videos,
  },
  {
    path: '/knit/projectsDetails/:id/ShowReels',
    name: 'Project-Details',
    Component: ShowReels,
  },
  {
    path: '/knit/projectsDetails/:id/ShowReels/:sid',
    name: 'Project-Details',
    Component: ShowReels,
  },
  {
    path: '/knit/projectsDetails/:id/Themes',
    name: 'Project-Details',
    Component: Themes,
  },
  {
    path: '/knit/projectsDetails/:id/Themes/annotations/:themeID',
    name: 'Project-Details',
    Component: Themes,
  },
  {
    path: '/knit/projectsDetails/:id/Themes/analysis/:tId',
    name: 'Project-Details',
    Component: Themes,
  },
  {
    path: '/knit/members',
    name: 'Members',
    Component: Members,
  },
  {
    path: '/knit/projectsDetails/:id/Graphs',
    name: 'Graphs',
    Component: Graphs,
  },
];
//?tab=1
export default function KnitRoute(props) {
  return (
    <Switch>
      <Redirect exact={true} from="/knit" to="/knit/projects" />
      {window.location.href.split('/')[5]
        ? localStorage.getItem('projectIdList').includes(window.location.href.split('/')[5])
          ? KnitRoutes.map(({ path, Component }, key) => (
              <PrivateRoute key={key} path={path} roles={[roleEnum.KNIT]} component={Component} />
            ))
          : (window.location.href = '/knit/projects')
        : KnitRoutes.map(({ path, Component }, key) => (
            <PrivateRoute key={key} path={path} roles={[roleEnum.KNIT]} component={Component} />
          ))}
    </Switch>
  );
}
