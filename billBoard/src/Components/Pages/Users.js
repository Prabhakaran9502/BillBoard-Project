import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Pagination, Paper, tableCellClasses } from '@mui/material';

import Button from '@mui/material/Button';
import IsoIcon from '@mui/icons-material/Iso';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import axios from "axios";

//Dialog
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';

import UserActive from './UserActive';
import FilterListIcon from '@mui/icons-material/FilterList';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../Pages/styles.css';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#808080',
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function Users() {



    const handleClick = (param) => {
        UserList();
        handleFilterClear();
        setOpen(param);
    }


    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickOpen = () => {
        setOpen(true);
    };


    const [userList, setUserList] = React.useState([]);
    const [userListtoAD, setUserListtoAD] = React.useState({
        left: [],
        right: [],
    });

    React.useEffect(() => {
        UserList();
    }, []);

    function UserList() {
        const data = {
            LoginToken: localStorage.getItem('auth'),
            UserName: '',
            EmailId: '',
            LoginFrom: '',
            LoginTo: ''
        }
        const url = 'https://localhost:44374/api/User/userList';
        axios.post(url, data).then((result) => {
            setUserList(result.data.Table2);
            setUserListtoAD(result.data);
        })
    }

    const data = userListtoAD;

    const [usernameFilter, setUsernameFilter] = React.useState('');
    const [emailFilter, setEmailFilter] = React.useState('');

    const handleFilterClear = () => {
        setUsernameFilter('');
        setEmailFilter('');
        setLastLoginFromDate(null);
        setLastLoginToDate(null);
        UserList();
    }

    const handleChangeUsernameFilter = (event) => {

        const inputValue = event.target.value;
        setUsernameFilter(inputValue);

        const data = {
            LoginToken: localStorage.getItem('auth'),
            UserName: inputValue,
            EmailId: emailFilter == '' ? '' : emailFilter,
            LoginFrom: lastLoginFromDate == null ? '' : lastLoginFromDate.toLocaleDateString(),
            LoginTo: lastLoginToDate == null ? '' : lastLoginToDate.toLocaleDateString()
        }
        const url = 'https://localhost:44374/api/User/userList';
        axios.post(url, data).then((result) => {
            setUserList(result.data.Table2);
            setUserListtoAD(result.data);
        })

        setPage(1);
    }

    const handleChangeEmailFilter = (event) => {
        const inputValue = event.target.value;
        setEmailFilter(inputValue);

        const data = {
            LoginToken: localStorage.getItem('auth'),
            UserName: usernameFilter == '' ? '' : usernameFilter,
            EmailId: inputValue,
            LoginFrom: lastLoginFromDate == null ? '' : lastLoginFromDate.toLocaleDateString(),
            LoginTo: lastLoginToDate == null ? '' : lastLoginToDate.toLocaleDateString()
        }
        const url = 'https://localhost:44374/api/User/userList';
        axios.post(url, data).then((result) => {
            setUserList(result.data.Table2);
            setUserListtoAD(result.data);
        })

        setPage(1);
    }

    //Pagination Start
    const [page, setPage] = React.useState(1); // State for current page, starting from page 1
    const rowsPerPage = 5; // Number of rows per page

    const handleChangePage = (event, newPage) => {
        setPage(newPage); // Update current page
    };

    // Calculate start and end index for slicing data array based on current page
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    //Pagination End

    const [lastLoginFromDate, setLastLoginFromDate] = useState(null);
    const [lastLoginToDate, setLastLoginToDate] = useState(null);

    const handleDateChangeLLFrom = (date) => {

        setLastLoginFromDate(date);
        const dateString = date == null ? '' : (date.toLocaleDateString());

        const data = {
            LoginToken: localStorage.getItem('auth'),
            UserName: usernameFilter == '' ? '' : usernameFilter,
            EmailId: emailFilter == '' ? '' : emailFilter,
            LoginFrom: dateString,
            LoginTo: lastLoginToDate == null ? '' : lastLoginToDate.toLocaleDateString()
        }
        const url = 'https://localhost:44374/api/User/userList';
        axios.post(url, data).then((result) => {
            setUserList(result.data.Table2);
            setUserListtoAD(result.data);
        })

        setPage(1);
    }

    const handleDateChangeLLTo = (date) => {

        setLastLoginToDate(date);
        const dateString = date == null ? '' : (date.toLocaleDateString());

        const data = {
            LoginToken: localStorage.getItem('auth'),
            UserName: usernameFilter == '' ? '' : usernameFilter,
            EmailId: emailFilter == '' ? '' : emailFilter,
            LoginFrom: lastLoginFromDate == null ? '' : lastLoginFromDate.toLocaleDateString(),
            LoginTo: dateString
        }
        const url = 'https://localhost:44374/api/User/userList';
        axios.post(url, data).then((result) => {
            setUserList(result.data.Table2);
            setUserListtoAD(result.data);
        })

        setPage(1);
    }

    return (
        <div>
            <span >
                <span >
                    <div style={{ display: 'flex' }}>
                        <div>
                            <PeopleAltIcon color="secondary"
                                style={{ fontSize: '30px' }}
                                sx={{ mt: 0.1, mr: 1 }}
                            />
                        </div>
                        <div style={{ fontSize: "23px" }}>Users List</div>
                    </div>
                    <Button variant="contained" color="secondary"
                        sx={{
                            width: '40vh', borderRadius: '30px', float: 'right', mt: -5
                        }}
                        onClick={handleClickOpen}
                    >
                        <div style={{ marginRight: '2vh' }}>Enable / Disable User</div> <IsoIcon />
                    </Button>
                </span>
                <span>
                    <Paper sx={{ p: 1, mt: 1, backgroundColor: '#f0f1f2' }}>
                        <div style={{ display: 'flex' }}>
                            <div><FilterListIcon color="secondary"
                                style={{ fontSize: '25px' }}
                                sx={{ mr: 1 }}
                            />
                            </div>
                            <div style={{ fontSize: "18px" }}>Filter</div>

                            <div style={{ display: 'block', marginLeft: '5vh' }}>
                                <div style={{ display: 'flex', marginBottom: '1vh' }}>
                                    <div style={{ width: '15vh' }}>User Name :</div>
                                    <input type="text" name="username"
                                        value={usernameFilter}
                                        onChange={handleChangeUsernameFilter}
                                        style={{
                                            color: '#9c27b0',
                                            width: '30vh',
                                            height: '4.5vh',
                                            border: '1px solid #1976d2',
                                            borderRadius: '10px',
                                            fontSize: '16px',
                                            paddingLeft: '1vh',
                                            marginLeft: '1vh'
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'flex' }}>
                                    <div style={{ width: '15vh' }}>Email Id :</div>
                                    <input type="text" name="emailfilter"
                                        value={emailFilter}
                                        onChange={handleChangeEmailFilter}
                                        style={{
                                            color: '#9c27b0',
                                            width: '30vh',
                                            height: '4.5vh',
                                            border: '1px solid #1976d2',
                                            borderRadius: '10px',
                                            fontSize: '16px',
                                            paddingLeft: '1vh',
                                            marginLeft: '1vh'
                                        }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'block', marginLeft: '3vh' }}>
                                <div style={{ display: 'flex', marginBottom: '1vh' }}>
                                    <div style={{ width: '22vh' }}>Last_Login From :</div>
                                    <DatePicker
                                        // style={{ borderRadius: '8px', border: '1px solid #ccc', padding: '5px' }}
                                        className="customDatePicker"
                                        selected={lastLoginFromDate}
                                        onChange={handleDateChangeLLFrom}
                                        dateFormat="MMM dd yyyy" // Customize date format as needed
                                        maxDate={lastLoginToDate}
                                    />
                                </div>
                                <div style={{ display: 'flex' }}>
                                    <div style={{ width: '22vh' }}>Last_Login To :</div>
                                    <DatePicker
                                        // style={{ borderRadius: '8px', border: '1px solid #ccc', padding: '5px' }}
                                        className="customDatePicker"
                                        selected={lastLoginToDate}
                                        onChange={handleDateChangeLLTo}
                                        dateFormat="MMM dd yyyy" // Customize date format as needed
                                        minDate={lastLoginFromDate}
                                    />
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{
                                width: '15vh', height: '5vh', borderRadius: '30px', ml: 1, float: 'right', mt: -4

                            }}
                            onClick={handleFilterClear}
                        >
                            &nbsp;Clear
                        </Button>
                    </Paper>
                </span>
            </span>
            <TableContainer component={Paper} style={{ textAlign: 'center', marginTop: '1%' }}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell align="left">Email</StyledTableCell>
                            <StyledTableCell align="left">Password</StyledTableCell>
                            <StyledTableCell align="left">Active&nbsp;From</StyledTableCell>
                            <StyledTableCell align="left">Last&nbsp;Login</StyledTableCell>
                            <StyledTableCell align="left">Status</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userList.slice(startIndex, endIndex).map((row) => (
                            <StyledTableRow key={row.Name}>
                                <StyledTableCell component="th" scope="row">
                                    {row.Name}
                                </StyledTableCell>
                                <StyledTableCell align="left">{row.Email}</StyledTableCell>
                                <StyledTableCell align="left">{row.Password}</StyledTableCell>
                                <StyledTableCell align="left">{row.ActiveFrom == null ? 'NILL' : row.ActiveFrom}</StyledTableCell>
                                <StyledTableCell align="left">{row.LastLogin == null ? 'NILL' : row.LastLogin}</StyledTableCell>
                                <StyledTableCell align="left" style={{ color: row.Status == 1 ? 'Green' : 'red' }}>{row.Status == 1 ? "Enabled" : "Disabled"}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Pagination
                        style={{ margin: '20px auto' }}
                        count={Math.ceil(userList.length / rowsPerPage)} // Total number of pages based on data length and rows per page
                        page={page}
                        onChange={handleChangePage}
                        showFirstButton
                        showLastButton
                    />
                </div>
            </TableContainer>

            <Dialog
                fullScreen={fullScreen}
                open={open}
                aria-labelledby="responsive-dialog-title"

            >
                <DialogTitle id="responsive-dialog-title" sx={{ backgroundColor: '#e3e6e5' }}>
                    {"Enable / Disable user"}
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: '#e3e6e5' }}>
                    <DialogContentText>
                        <UserActive message={data} sendToParent={handleClick} />
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}
