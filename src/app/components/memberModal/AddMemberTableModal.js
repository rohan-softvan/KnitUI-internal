import React, { Component } from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import CloseIcon from "@material-ui/icons/Close";
import SwitchButton from "../SwitchButton/SwitchButton";

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function createData(name, calories, fat) {
  return { name, calories, fat };
}

const rows = [
  createData("member@email.com", "Admin  Member", 3.7),
  createData("member@email.com", "Admin  Member", 25.0),
  createData("member@email.com", "Admin  Member", 16.0),
  createData("member@email.com", "Admin  Member", 6.0),
  createData("member@email.com", "Admin  Member", 16.0),
  createData("member@email.com", "Admin  Member", 3.2),
  createData("member@email.com", "Admin  Member", 9.0),
  createData("member@email.com", "Admin  Member", 0.0),
  createData("member@email.com", "Admin  Member", 26.0),
  createData("member@email.com", "Admin  Member", 0.2),
  createData("member@email.com", "Admin  Member", 0),
  createData("member@email.com", "Admin  Member", 19.0),
  createData("member@email.com", "Admin  Member", 18.0),
  //].sort((a, b) => (a.calories < b.calories ? -1 : 1));
];
const useStyles2 = {
  table: {
    minWidth: 500,
  },
  tableRow: {
    height: 30,
  },
};

const MembersTableData = [
  // config constant for this sandbox.
  {
    email: "member@email.com",
    isChecked: true,
  },
  {
    email: "member@email.com",
    isChecked: true,
  },
  {
    email: "member@email.com",
    isChecked: true,
  },
  {
    email: "member@email.com",
    isChecked: true,
  },
  {
    email: "member@email.com",
    isChecked: true,
  },
  {
    email: "member@email.com",
    isChecked: true,
  },
  {
    email: "member@email.com",
    isChecked: false,
  },
  {
    email: "member@email.com",
    isChecked: true,
  },
  {
    email: "member@email.com",
    isChecked: true,
  },
  {
    email: "member@email.com",
    isChecked: false,
  },
  {
    email: "member@email.com",
    isChecked: false,
  },
];

class AddMemeberTableModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 5,
      membersTableData: MembersTableData,
    };
  }

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleChange = (data) => {
    data.isChecked = !data.isChecked;
    this.setState({ MembersTableData: this.state.MembersTableData });
  };

  render() {
    const emptyRows =
      this.state.rowsPerPage -
      Math.min(
        this.state.rowsPerPage,
        MembersTableData.length - this.state.page * this.state.rowsPerPage
      );
    let classes = useStyles2;
    return (
      <>
        <TableContainer
          style={{ boxShadow: " none !important" }}
        >
          <Table
            className={classes.table}
            style={{ boxShadow: " none !important" }}
            aria-label="custom pagination table"
          >
            <TableBody>
              {(this.state.rowsPerPage > 0
                ? MembersTableData.slice(
                    this.state.page * this.state.rowsPerPage,
                    this.state.page * this.state.rowsPerPage +
                      this.state.rowsPerPage
                  )
                : MembersTableData
              ).map((row) => (
                <TableRow key={row.name}>
                  <TableCell
                    component="th"
                    scope="row"
                    style={{ borderBottom: "none" }}
                  >
                    {row.email}
                  </TableCell>
                  <TableCell style={{ borderBottom: "none" }} align="center">
                    <SwitchButton
                      offText={"Admin"}
                      onText={"Member"}
                      handleChange={() => {
                        this.handleChange(row);
                      }}
                      checked={row.isChecked}
                    ></SwitchButton>
                  </TableCell>
                  <TableCell style={{ borderBottom: "none" }} align="center">
                    <CloseIcon className={"close-icon"} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={MembersTableData.length}
          rowsPerPage={this.state.rowsPerPage}
          page={this.state.page}
          onChangePage={this.handleChangePage}
          labelRowsPerPage=""
          rowsPerPageOptions={[]}
        />
      </>
    );
  }
}

export default AddMemeberTableModal;
