import * as React from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { Button } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Popover from '@mui/material/Popover';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import MailIcon from '@mui/icons-material/Mail';
import EditNoteIcon from '@mui/icons-material/EditNote';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CategoryIcon from '@mui/icons-material/Category';
import FenceIcon from '@mui/icons-material/Fence';

import axios from "axios";
import { passwordUpdateValidator, nameValidator } from "../Login/regexValidator";

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);


export default function Navbar() {

    const [errorMessage, setErrorMessage] = React.useState('')

    const [userEditVisible, setUserEditVisible] = React.useState(false);

    const [pwdvisible, setPwdvisible] = React.useState(false);
    const [pwd, setPwd] = React.useState([]);

    const [menu, setMenu] = React.useState([]);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        LoginDetails();
        setUserEditVisible(false);
        setPwdvisible(false);
        setAnchorEl(event.currentTarget);
        setErrorMessage('');
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const openPop = Boolean(anchorEl);
    const id = openPop ? 'simple-popover' : undefined;


    const location = useLocation();
    const path = location.pathname;

    const theme = useTheme();
    const [open, setOpen] = React.useState(true);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const navigate = useNavigate();
    const [logout, setLogout] = React.useState(false);
    const [userdata, setUserdata] = React.useState([]);

    React.useEffect(() => {
        LoginDetails();
    }, []);

    function LoginDetails() {
        const data = {
            LoginToken: localStorage.getItem('auth'),
        }
        const url = 'https://localhost:44374/api/Login/loginDetails';
        axios.post(url, data).then((result) => {
            setUserdata(result.data.Table[0]);
            setMenu(result.data.Table1);
            setInput(result.data.Table[0]);

            var pwdValue = '';
            let count = result.data.Table[0].Password.length;

            for (let i = 0; i < count; i++) {
                pwdValue += '*';
            }

            const pass = {
                "PasswordVisible": result.data.Table[0].Password,
                "PasswordHidden": pwdValue
            }

            setPwd(pass);
        }
        )
    }

    const logoutHandler = (e) => {
        e.preventDefault();

        const data = {
            LoginToken: localStorage.getItem('auth'),
        }
        const url = 'https://localhost:44374/api/Login/logout';
        axios.put(url, data).then((result) => {
            const res = JSON.parse(result.data);
            if (res[0].IsLogout == "true") {
                localStorage.removeItem("auth");
                setLogout(true);
                if (!localStorage.getItem('auth')) {
                    navigate("/");
                }
            }
        }
        )
    }

    const onVisiblePWD = () => {
        setPwdvisible(false);
    }

    const onNotvisiblePWD = () => {
        setPwdvisible(true);
    }

    const callIcon = (item) => {
        switch (item) {
            case 'HomeIcon':
                return <HomeIcon />;
            case 'AssessmentIcon':
                return <AssessmentIcon />;
            case 'PersonIcon':
                return <PersonIcon />;
            case 'Inventory2Icon':
                return <Inventory2Icon />;
            case 'CategoryIcon':
                return <CategoryIcon />;
                case 'FenceIcon':
                    return <FenceIcon />;
            default:
                return <PersonIcon />;
                break;
        }
    }

    const handleUserEdit = () => {
        setInput(userdata);
        setUserEditVisible(true);
    }

    const handleUserEditCancel = () => {
        setErrorMessage('');
        setPwdvisible(false);
        setUserEditVisible(false);
        setInput(userdata);
    }

    const [input, setInput] = React.useState({
        Email: '',
        Password: '',
        Name: ''
    });

    const handleChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    const handleUserUpdate = () => {
        if (!nameValidator(input.Name)) {
            return setErrorMessage('Please enter valid name.')
        }
        if (!passwordUpdateValidator(input.Password)) {
            return setErrorMessage('Password should have minimum 8 character with the combination of uppercase,lowercase, numbers and specialcharacters.')
        }

        else {
            const data = {
                Name: input.Name,
                Email: input.Email,
                Password: input.Password
            }
            const url = 'https://localhost:44374/api/User/updateUser';
            axios.post(url, data).then((result) => {
                if (result.data == "Successfull") {
                    setErrorMessage('');
                    setUserEditVisible(false);
                    setPwdvisible(false);
                    LoginDetails();
                }
                else {
                    setErrorMessage('Please enter valid name and password.');
                }
            })
                .catch((error) => {
                    console.log(error);
                })
        }
        if (nameValidator(input.Name) && passwordUpdateValidator(input.Password)) {
            setErrorMessage('');
        }
    }


    // console.log('menu', input);
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Bill Board
                    </Typography>
                    <Button
                        aria-describedby={id}
                        onClick={handleClick}
                        color="inherit"
                        style={{ border: '1px solid white' }}
                        sx={{
                            width: '20vh', height: '4vh', borderRadius: '30px'
                        }}
                    >
                        <AccountCircleIcon />
                        &nbsp;Profile
                    </Button>
                    <Button
                        color="inherit"
                        onClick={logoutHandler}
                        style={{ border: '1px solid white' }}
                        sx={{
                            width: '20vh', height: '4vh', borderRadius: '30px', ml: 2
                        }}
                    >
                        <LogoutIcon />
                        &nbsp;Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Popover
                id={id}
                open={openPop}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}

            >
                <Box sx={{ flexGrow: 1, p: 1, backgroundColor: '#e3e6e5' }}>
                    <Grid>
                        <Paper sx={{ p: 1, m: 1, width: '55vh', height: '11vh' }} >
                            <div style={{ display: 'flex' }}>
                                <AccountBoxIcon style={{ fontSize: '25px', color: '#808080' }} />
                                <div style={{ fontSize: '15px', color: '#808080', marginLeft: '2%' }}>Name</div>
                            </div>
                            <div style={{ float: 'right', fontSize: '15px', color: '#9c27b0' }}>
                                <div style={{ display: userEditVisible == true ? 'none' : '' }}>{userdata.Name}</div>
                                <div style={{ display: userEditVisible == true ? '' : 'none' }}>
                                    <input type="text" name="Name"
                                        style={{
                                            color: '#9c27b0',
                                            width: '40vh',
                                            height: '4.5vh',
                                            border: '2px solid #1976d2',
                                            borderRadius: '40px',
                                            fontSize: '16px',
                                            paddingLeft: '1vh'
                                        }}
                                        value={input.Name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </Paper>
                        <Paper sx={{ p: 1, m: 1, width: '55vh', height: '11vh' }} >
                            <div style={{ display: 'flex' }}>
                                <MailIcon style={{ fontSize: '25px', color: '#808080' }} />
                                <div style={{ fontSize: '15px', color: '#808080', marginLeft: '2%' }}>Email</div>
                            </div>
                            <div style={{ float: 'right', fontSize: '15px', color: '#9c27b0' }}>
                                {userdata.Email}
                            </div>
                        </Paper>
                        <Paper sx={{ p: 1, m: 1, width: '55vh', height: '11vh' }} >
                            <div style={{ display: 'flex' }}>
                                <AccountBoxIcon style={{ fontSize: '25px', color: '#808080' }} />
                                <div style={{ fontSize: '15px', color: '#808080', marginLeft: '2%' }}>Password</div>
                                <div style={{ marginLeft: '60%', display: userEditVisible == true ? 'none' : '' }}>
                                    <VisibilityIcon
                                        style={{ color: '#808080', display: pwdvisible == true ? '' : 'none' }}
                                        onClick={onVisiblePWD}
                                    />
                                    <VisibilityOffIcon
                                        style={{ color: '#808080', display: pwdvisible == false ? '' : 'none' }}
                                        onClick={onNotvisiblePWD}
                                    />
                                </div>
                            </div>
                            <div style={{ float: 'right', fontSize: '15px', color: '#9c27b0', display: userEditVisible == true ? 'none' : '' }}>
                                {pwdvisible == true ? pwd.PasswordVisible : pwd.PasswordHidden}
                            </div>
                            <div style={{ float: 'right', display: userEditVisible == true ? '' : 'none' }}>
                                <input type="text" name="Password"
                                    style={{
                                        color: '#9c27b0',
                                        width: '40vh',
                                        height: '4.5vh',
                                        border: '2px solid #1976d2',
                                        borderRadius: '40px',
                                        fontSize: '16px',
                                        paddingLeft: '1vh'
                                    }}
                                    value={input.Password}
                                    onChange={handleChange}
                                />
                            </div>
                        </Paper>
                        <div style={{ width: '55vh' }}>
                            {errorMessage.length > 0 && (<div style={{ textAlign: "center", marginBottom: "10px", marginTop: "10px", color: "red" }}>{errorMessage}</div>)}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                sx={{
                                    width: '15vh', height: '5vh', borderRadius: '30px',
                                    display: userEditVisible == true ? 'none' : ''
                                }}
                                onClick={handleUserEdit}
                            >
                                <EditNoteIcon />
                                &nbsp;Edit
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                sx={{
                                    width: '15vh', height: '5vh', borderRadius: '30px',
                                    display: userEditVisible == true ? '' : 'none'
                                }}
                                onClick={handleUserUpdate}
                            >
                                &nbsp;Update
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                    width: '15vh', height: '5vh', borderRadius: '30px', ml: 1,
                                    display: userEditVisible == true ? '' : 'none'
                                }}
                                onClick={handleUserEditCancel}
                            >
                                &nbsp;Cancel
                            </Button>
                        </div>
                    </Grid>
                </Box>
            </Popover >
            <Drawer variant="permanent" open={open}>
                <DrawerHeader style={{ backgroundColor: '#1976d2' }}>
                    <span style={{ width: "100%", color: "white", marginLeft: "5%" }}> Hi <br /> {userdata.Name}  </span>
                    <IconButton onClick={handleDrawerClose} style={{ color: 'white' }}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {menu.map((item, index) => (
                        <ListItem
                            key={item.title}
                            disablePadding
                            component={Link}
                            to={item.path}
                            button
                            selected={item.path === path}
                            sx={{ display: 'block' }}
                        >
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {/* {item.icon} */}
                                    {callIcon(item.icon)}
                                </ListItemIcon>
                                <ListItemText primary={item.title} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <Outlet />
            </Box>
        </Box >
    );
}
