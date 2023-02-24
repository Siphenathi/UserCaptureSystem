import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import {visuallyHidden} from "@mui/utils";
import {UserModel} from "../model/userModel";
import {EventType} from "../model/evenType";
import {UserHeadCell} from "../model/userHeadCell";
import {UserEnhancedTableProps} from "../model/userEnhancedTableProps";
import {SortingOrder} from "../model/sortingOrder";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import UserFormDialog from "./userDialog";
import CustomAlert from "../shared/customAlert";
import axios from "axios";
import {AlertModel} from "../model/alertModal";
const baseUrl = "https://localhost:44374/api/v1/user/";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: SortingOrder,
  orderBy: Key
): (
  a: {[key in Key]: number | string},
  b: {[key in Key]: number | string}
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells: readonly UserHeadCell[] = [
  {
    id: "userId",
    label: "UserId",
  },
  {
    id: "firstName",
    label: "FirstName",
  },
  {
    id: "surname",
    label: "Surname",
  },
  {
    id: "contact",
    label: "Contact",
  },
];

const User = () => {
  const [order, setOrder] = useState<SortingOrder>("asc");
  const [orderBy, setOrderBy] = useState<keyof UserModel>("firstName");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchValue, setSearchValue] = useState("");
  const [usersData, setUsersData] = useState([] as UserModel[]);
  const [usersInitialData, setUsersInitialData] = useState([] as UserModel[]);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertDetails, setAlertDetails] = useState({} as AlertModel);
  const [buttonClickEventType, setButtonClickEventType] = useState(
    EventType.add
  );
  const [focusUser, setFocusUser] = useState({} as UserModel);

  const EnhancedTableHead = (props: UserEnhancedTableProps) => {
    const {order, orderBy, onRequestSort} = props;
    const createSortHandler =
      (property: keyof UserModel) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
      };

    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align="right"
              padding="normal"
              sortDirection={orderBy === headCell.id ? order : false}
              sx={{fontWeight: "bold"}}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof UserModel
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const findUser = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enteredName = event.target.value;
    setSearchValue(enteredName);
    var newUserList = searchUsersByAnyField(enteredName);
    setUsersData(newUserList);
  };

  const searchUsersByAnyField = (name: string): UserModel[] => {
    var listOfUsers = usersInitialData;
    if (name === "" || name === undefined) return listOfUsers;

    listOfUsers = listOfUsers.filter((item) => {
      return (
        item.firstName.toLowerCase().includes(name.toLowerCase()) ||
        item.surname.toLocaleLowerCase().includes(name.toLocaleLowerCase()) ||
        item.contact.toLocaleLowerCase().includes(name.toLocaleLowerCase())
      );
    });
    return listOfUsers;
  };

  const userButtonClickEventType = (
    evenType: EventType,
    user: UserModel
  ): void => {
    setButtonClickEventType(evenType);
    setFocusUser(user);
    setOpenUserDialog(true);
  };

  const onSubmitButtonClick = (user: UserModel): void => {
    if (buttonClickEventType === EventType.add) callCreateUserApi(user);
    if (buttonClickEventType === EventType.delete) callDeleteUserApi();
    if (buttonClickEventType === EventType.update) callUpdateUserApi(user);
  };

  useEffect(() => {
    fetchAllUsers();
  }, [""]);

  const callCreateUserApi = (user: UserModel) => {
    axios
      .post(`${baseUrl}create`, user)
      .then((response) => {
        if (response.status === 200) {
          fetchAllUsers();
          setAlertDetails({
            title: "Success",
            description: response.data.message,
            feedbackType: "success",
          });
          setOpenAlert(true);
        }
      })
      .catch((error) => {
        console.log(error);
        setAlertDetails({
          title: "Cannot save User",
          description: `${error.message}.\t${error.response?.data?.errors?.Contact[0]}`,
          feedbackType: "error",
        });
        setOpenAlert(true);
      });
  };

  const fetchAllUsers = () => {
    axios
      .get(`${baseUrl}getusers`)
      .then((response) => {
        var results = response.data as UserModel[];
        setUsersData(results);
        setUsersInitialData(results);
      })
      .catch((error) => {
        console.log(error);
        setAlertDetails({
          title: "Cannot get Employees",
          description: error.message,
          feedbackType: "error",
        });
        setOpenAlert(true);
      });
  };

  const callDeleteUserApi = () => {
    axios
      .delete(`${baseUrl}delete/${focusUser.userId}`)
      .then((response) => {
        if (response.status === 200) {
          fetchAllUsers();
          setAlertDetails({
            title: "Success",
            description: response.data.message,
            feedbackType: "success",
          });
          setOpenAlert(true);
        }
      })
      .catch((error) => {
        console.log(error);
        setAlertDetails({
          title: "Cannot delete User",
          description: `${error.message}.\t${error.response?.data?.errors?.Contact[0]}`,
          feedbackType: "error",
        });
        setOpenAlert(true);
      });
  };

  const callUpdateUserApi = (user: UserModel) => {
    axios
      .put(`${baseUrl}update`, user)
      .then((response) => {
        if (response.status === 200) {
          fetchAllUsers();
          setAlertDetails({
            title: "Success",
            description: response.data.message,
            feedbackType: "success",
          });
          setOpenAlert(true);
        }
      })
      .catch((error) => {
        console.log(error);
        setAlertDetails({
          title: "Cannot update User",
          description: `${error.message}.\t${error.response?.data?.errors?.Contact[0]}`,
          feedbackType: "error",
        });
        setOpenAlert(true);
      });
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - usersData.length) : 0;

  return (
    <Box sx={{width: "100%"}}>
      <Typography
        variant="h4"
        noWrap
        component="div"
        align="center"
        sx={{my: 3}}
      >
        Users
      </Typography>

      <Grid spacing={2} columns={12} sx={{mb: 2}} container>
        <Grid
          item
          xs={6}
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <TextField
            id="outlined-basic"
            label="Search"
            variant="outlined"
            size="small"
            onChange={findUser}
            value={searchValue}
          />
        </Grid>
        <Grid
          item
          xs={6}
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Button
            variant="outlined"
            onClick={() =>
              userButtonClickEventType(EventType.add, {} as UserModel)
            }
          >
            Add New
          </Button>
        </Grid>
      </Grid>
      <Paper sx={{width: "100%", mb: 2}}>
        <TableContainer>
          <Table
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="simple table"
          >
            <EnhancedTableHead
              numSelected={8}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={() => {}}
              onRequestSort={handleRequestSort}
              rowCount={usersData.length}
            />
            <TableBody>
              {stableSort(usersData, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user, index) => {
                  return (
                    <TableRow
                      hover
                      aria-checked={false}
                      tabIndex={-1}
                      key={index}
                      selected={false}
                    >
                      <TableCell component="th" scope="row" align="right">
                        {user.userId}
                      </TableCell>
                      <TableCell align="right">{user.firstName}</TableCell>
                      <TableCell align="right">{user.surname}</TableCell>
                      <TableCell align="right">{user.contact}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          onClick={() =>
                            userButtonClickEventType(EventType.update, user)
                          }
                          color="warning"
                        >
                          Update
                        </Button>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          onClick={() =>
                            userButtonClickEventType(EventType.delete, user)
                          }
                          color="error"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={usersData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <CustomAlert
        openAlert={openAlert}
        setOpenAlertCallBack={setOpenAlert}
        alertDetails={alertDetails}
      />
      <UserFormDialog
        openDialog={openUserDialog}
        setOpenUserDialogCallBack={setOpenUserDialog}
        onSubmitButtonClickCallBack={onSubmitButtonClick}
        focusUser={focusUser}
        buttonClickEventType={buttonClickEventType}
      />
    </Box>
  );
};

export default User;
