import React from "react";
import { styled } from '@mui/material/styles';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Pagination, Paper, tableCellClasses } from '@mui/material';
import Button from '@mui/material/Button';
import axios from "axios";

import PreviewIcon from '@mui/icons-material/Preview';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

//Dialog
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';


import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import FenceIcon from '@mui/icons-material/Fence';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FilterListIcon from '@mui/icons-material/FilterList';
import CategoryIcon from '@mui/icons-material/Category';

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

//Dialog
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Brands() {


    const [brandList, setBrandList] = React.useState([]);
    const [userId, setUserId] = React.useState([]);
    const [openBrandDetails, setOpenBrandDetails] = React.useState(false);
    const [openBrandRemove, setOpenBrandRemove] = React.useState(false);
    const [openBrandAdd, setOpenBrandAdd] = React.useState(false);

    const [brandListForFilter, setBrandListForFilter] = React.useState([]);
    const [selectedBrandIdForFilter, setSelectedBrandIdForFilter] = React.useState('');

    const [brandRowDetails, setBrandRowDetails] = React.useState([]);
    const [brandUserList, setBrandUserList] = React.useState([]);

    const [errorMessageBrandRemove, setErrorMessageBrandRemove] = React.useState('');
    const [errorMessageBrandAdd, setErrorMessageBrandAdd] = React.useState('');

    const [userBrandRemoveList, setUserBrandRemoveList] = React.useState([]);
    const [brandListForAdd, setBrandListForAdd] = React.useState([]);

    React.useEffect(() => {
        BrandList();
        BrandListForFilter();
    }, []);

    function BrandList() {
        const data = {
            LoginToken: localStorage.getItem('auth'),
            BrandId: 0
        }
        const url = 'https://localhost:44374/api/Product/brandList';
        axios.post(url, data).then((result) => {
            setBrandList(result.data.Table);
            setUserId(result.data.Table1[0]);
        })
    }

    const BrandListForFilter = () => {
        const data = {
            LoginToken: localStorage.getItem('auth'),
        }
        const url = 'https://localhost:44374/api/Product/brandListForFilter';
        axios.post(url, data).then((result) => {
            setBrandListForFilter(result.data.Table);
        })
    }

    const handleClickOpenBrandDetails = (row) => {

        const data = {
            LoginToken: localStorage.getItem('auth'),
            BrandId: row.BrandId
        }
        const url = 'https://localhost:44374/api/Product/brandUserList';
        axios.post(url, data).then((result) => {
            setBrandUserList(result.data.Table);
        })

        setBrandRowDetails(row);
        setOpenBrandDetails(true);
    };

    const handleClickCloseBrandDetails = () => {
        setOpenBrandDetails(false);
    }

    const handleClickOpenRemoveBrand = (row) => {

        const data = {
            LoginToken: localStorage.getItem('auth'),
            BrandId: row.BrandId
        }
        const url = 'https://localhost:44374/api/Product/brandUserListforRemove';
        axios.post(url, data).then((result) => {
            setUserBrandRemoveList(result.data.Table);
        })
        setBrandRowDetails(row);
        setOpenBrandRemove(true);


    }

    const handleClickCloseRemoveBrand = () => {
        setCheckedItems([]);
        setRemovalId([]);
        setOpenBrandRemove(false);
        BrandList();
        setErrorMessageBrandRemove('');
    }

    const handleChangeBrandIdForFilter = (event) => {
        setSelectedBrandIdForFilter(event.target.value);

        const data = {
            LoginToken: localStorage.getItem('auth'),
            BrandId: event.target.value
        }
        const url = 'https://localhost:44374/api/Product/brandList';
        axios.post(url, data).then((result) => {
            setBrandList(result.data.Table);
            setUserId(result.data.Table1[0]);
        })
    };

    const handleFilterClear = () => {
        setSelectedBrandIdForFilter('');
        BrandList();
    }

    const [checkedItems, setCheckedItems] = React.useState([]);
    const [removalId, setRemovalId] = React.useState([]);

    const handleCheckboxChange = (event) => {

        const { id, checked } = event.target;
        setCheckedItems({ ...checkedItems, [id]: checked });

        const idForRemove = {
            remId: Number(event.target.id),
            status: checked
        };
        setRemovalId([...removalId, idForRemove]);

        if (checked == false) {
            const updatedItems = removalId.filter(item => item.remId !== Number(event.target.id));
            // Update the state with the filtered items
            setRemovalId(updatedItems);
        }

    };


    const handleClickRemoveBrand = () => {
        var RemovalIdList = '';
        removalId.forEach((item, index) => {
            RemovalIdList = RemovalIdList + item.remId + ',';
        });
        const newString = RemovalIdList.slice(0, -1);

        if (newString == '') {
            setErrorMessageBrandRemove('Please select the valid user with brand and product to remove.');
        }
        else {
            const data = {
                LoginToken: localStorage.getItem('auth'),
                RemovalId: newString,
            }

            const url = 'https://localhost:44374/api/Product/removeBrandStock';
            axios.post(url, data).then((result) => {
                if (result.data.Table[0].Result == 'Successfull') {
                    setCheckedItems([]);
                    setRemovalId([]);
                    setOpenBrandRemove(false);
                    BrandList();
                    setErrorMessageBrandRemove('');
                }
            })

        }
    }

    const handleClickOpenBrandAdd = () => {
        setOpenBrandAdd(true);
    };

    const handleClickCloseBrandAdd = () => {
        setOpenBrandAdd(false);
    }

    const [brandName, setBrandName] = React.useState('');
    const [brandSuggestionList, setBrandSuggestionList] = React.useState([]);
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [selectedSuggestion, setSelectedSuggestion] = React.useState({});




    const handleChangeBrandName = (event) => {
        const inputValue = event.target.value;
        setBrandName(inputValue);

        const data = {
            LoginToken: localStorage.getItem('auth'),
            BrandName: inputValue
        }
        const url = 'https://localhost:44374/api/Product/brandSuggestionList';
        axios.post(url, data).then((result) => {
            setBrandSuggestionList(result.data.Table);
            if (result.data.Table.length > 0) {
                setShowSuggestions(true);
            } else {
                setShowSuggestions(false);
            }
        })

        setErrorMessageBrandAdd('');
    }

    const handleSuggestionClick = (suggestion) => {
        setBrandName(suggestion.Brand_Name);
        setSelectedSuggestion(suggestion);
        setBrandDescription(suggestion.Brand_Description);
        setShowSuggestions(false);
    };

    const [brandDescription, setBrandDescription] = React.useState('');

    const handleChangeBrandDescription = (event) => {
        const inputValue = event.target.value;
        setBrandDescription(inputValue);
        setErrorMessageBrandAdd('');
    }

    const handleSaveBrand = () => {
        if (brandListForAdd.length > 0) {
            var updatedBrandList = '';
            brandListForAdd.forEach((item, index) => {
                updatedBrandList = updatedBrandList + '#' + item.BrandId + '#' + item.Brand_Name + '#' + item.Brand_Description + ',';
            });

            const newString = updatedBrandList.slice(0, -1);

            const data = {
                LoginToken: localStorage.getItem('auth'),
                UpdatedBrandList: newString
            }

            const url = 'https://localhost:44374/api/Product/addBrand';
            axios.post(url, data).then((result) => {
                if (result.data.Table[0].Result == 'Successfull') {
                    BrandList();
                    setOpenBrandAdd(false);
                    setBrandListForAdd([]); 

                    setSelectedSuggestion({});
                    setBrandName('');
                    setBrandDescription('');
                    setErrorMessageBrandAdd('');
                }
            })
        }
        else {
            setErrorMessageBrandAdd('Please add atleast 1 valid brand in the list.');
        }

    }


    const handleAddBrand = () => {
        if (brandName == '') {
            setErrorMessageBrandAdd('Please enter or choose the valid brand.')
        }
        else if (brandDescription == '') {
            setErrorMessageBrandAdd('Please enter the valid brand description.')
        }
        else {
            const qtyforadd = {
                Brand_Name: brandName,
                BrandId: selectedSuggestion.BrandId == undefined ? 0 : selectedSuggestion.BrandId,
                Brand_Description: brandDescription,
                QtyRowId: Math.floor(Math.random() * 1000) + 1
            };

            setBrandListForAdd([...brandListForAdd, qtyforadd]);
            setSelectedSuggestion({});
            setBrandName('');
            setBrandDescription('');
            setErrorMessageBrandAdd('');
        }
    };

    const handleDelete = (id) => {
        const updatedData = brandListForAdd.filter(item => item.QtyRowId !== id);
        setBrandListForAdd(updatedData);
    };


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

    return (
        <div>

            <span >
                <span >
                    <div style={{ display: 'flex' }}>
                        <div><FenceIcon color="secondary"
                            style={{ fontSize: '30px' }}
                            sx={{ mt: 0.1, mr: 1 }} />
                        </div>
                        <div style={{ fontSize: "23px" }}>Brand List</div>
                    </div>
                    <Button variant="contained" color="secondary"
                        sx={{
                            width: '27vh', borderRadius: '30px', float: 'right', mt: -5
                        }}

                        onClick={handleClickOpenBrandAdd}
                    >
                        <div style={{ marginRight: '1vh' }}>Add Brand</div> <AddShoppingCartIcon />
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
                        </div>
                        <div style={{ display: 'flex', marginLeft: '5vh' }}>
                            <div style={{ marginRight: '2vh' }}>
                                Brand :
                                <Select
                                    id="demo-simple-select"
                                    value={selectedBrandIdForFilter}
                                    onChange={handleChangeBrandIdForFilter}
                                    sx={{
                                        width: '30vh', height: '4.5vh',
                                        color: '#9c27b0', borderColor: 'red',
                                        borderRadius: '10px', marginLeft: '2vh'
                                    }}
                                >
                                    {brandListForFilter.map((option, index) => (
                                        <MenuItem key={index} value={option.BrandId}>
                                            {option.Brand_Name}
                                        </MenuItem>
                                    ))}
                                </Select>
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

            <TableContainer component={Paper} style={{ marginTop: '1%' }}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Brand Name</StyledTableCell>
                            <StyledTableCell align="left">Brand Description</StyledTableCell>
                            <StyledTableCell align="left"> View </StyledTableCell>
                            <StyledTableCell align="left">Remove</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {brandList.slice(startIndex, endIndex).map((row) => (
                            <StyledTableRow key={row.BrandId}>
                                <StyledTableCell component="th" scope="row">
                                    {row.Brand_Name}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                    {row.Brand_Description}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                    <Button variant="contained" color="secondary"
                                        sx={{
                                            width: '18vh', height: '3.5vh', borderRadius: '30px',
                                        }}
                                        onClick={() => handleClickOpenBrandDetails(row)}
                                    >
                                        <PreviewIcon sx={{ fontSize: '18px', mr: 1 }} />
                                        <div style={{ fontSize: '12px' }}> Details</div>
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell align="left" >
                                    <Button variant="contained" color="secondary"
                                        sx={{
                                            width: '18vh', height: '3.5vh', borderRadius: '30px',
                                        }}
                                        onClick={() => handleClickOpenRemoveBrand(row)}
                                    >
                                        <DeleteForeverIcon sx={{ fontSize: '18px', mr: 1 }} />
                                        <div style={{ fontSize: '12px' }}> Remove</div>
                                    </Button>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Pagination
                        style={{ margin: '20px auto' }}
                        count={Math.ceil(brandList.length / rowsPerPage)} // Total number of pages based on data length and rows per page
                        page={page}
                        onChange={handleChangePage}
                        showFirstButton
                        showLastButton
                    />
                </div>
            </TableContainer>

            {/* Dialog for Brand Details List */}
            <Dialog
                open={openBrandDetails}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
                sx={{ mt: 0, p: 1 }}
            >
                <DialogTitle sx={{ backgroundColor: '#e3e6e5' }}>
                    {"Brand Details"}
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: '#e3e6e5' }}>
                    <DialogContentText id="alert-dialog-slide-description">
                        <div>
                            <Paper sx={{ p: 1, m: 1, width: '55vh', height: '11vh' }} >
                                <div style={{ display: 'flex' }}>
                                    <FenceIcon style={{ fontSize: '25px', color: '#808080' }} />
                                    <div style={{ fontSize: '15px', color: '#808080', marginLeft: '2%' }}>Brand Name</div>
                                </div>
                                <div style={{ float: 'right', fontSize: '15px', color: '#9c27b0' }}>
                                    {brandRowDetails.Brand_Name}
                                </div>
                            </Paper>

                            <Paper sx={{ p: 1, m: 1, width: '55vh', height: '11vh' }} >
                                <div style={{ display: 'flex' }}>
                                    <FenceIcon style={{ fontSize: '25px', color: '#808080' }} />
                                    <div style={{ fontSize: '15px', color: '#808080', marginLeft: '2%' }}>Brand Description</div>
                                </div>
                                <div style={{ float: 'right', fontSize: '15px', color: '#9c27b0' }}>
                                    {brandRowDetails.Brand_Description}
                                </div>
                            </Paper>

                        </div>
                    </DialogContentText>
                    <div className="datatable" style={{ display: userId.UserId == 3 ? '' : 'none' }}>
                        <table>
                            {/* Table Header */}
                            <thead>
                                <tr>
                                    <th>User Name</th>
                                    <th>Product Name</th>
                                    <th>Product Stock</th>
                                    {/* Add more headers as needed */}
                                </tr>
                            </thead>
                            {/* Table Body - Scrollable */}
                            <tbody>
                                {brandUserList.map((item, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                                        <td>{item.User_Name}</td>
                                        <td>{item.Product_Name}</td>
                                        <td>{item.Qty}</td>
                                        {/* Render additional cells for other data */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{
                        height: '5vh',
                        marginBottom: '1vh',
                        marginTop: '1vh'
                    }}>

                        <div style={{ float: 'right' }}>
                            <Button
                                onClick={handleClickCloseBrandDetails}
                                variant="contained" color="primary"
                                sx={{
                                    ml: 1, width: '12vh', height: '3.5vh', borderRadius: '30px',
                                }}
                            >Okay</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Dialog for Remove Brand */}
            <Dialog
                open={openBrandRemove}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
                sx={{ mt: 0, p: 1 }}
            >
                <DialogTitle sx={{ backgroundColor: '#e3e6e5' }}>
                    {"Brand Details"}
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: '#e3e6e5' }}>
                    <DialogContentText id="alert-dialog-slide-description">
                        <div>
                            <Paper sx={{ p: 1, m: 1, width: '55vh', height: '11vh' }} >
                                <div style={{ display: 'flex' }}>
                                    <FenceIcon style={{ fontSize: '25px', color: '#808080' }} />
                                    <div style={{ fontSize: '15px', color: '#808080', marginLeft: '2%' }}>Brand Name</div>
                                </div>
                                <div style={{ float: 'right', fontSize: '15px', color: '#9c27b0' }}>
                                    {brandRowDetails.Brand_Name}
                                </div>
                            </Paper>

                            <Paper sx={{ p: 1, m: 1, width: '55vh', height: '11vh' }} >
                                <div style={{ display: 'flex' }}>
                                    <FenceIcon style={{ fontSize: '25px', color: '#808080' }} />
                                    <div style={{ fontSize: '15px', color: '#808080', marginLeft: '2%' }}>Brand Description</div>
                                </div>
                                <div style={{ float: 'right', fontSize: '15px', color: '#9c27b0' }}>
                                    {brandRowDetails.Brand_Description}
                                </div>
                            </Paper>

                        </div>
                    </DialogContentText>
                    <div className="datatable" >
                        <table>
                            {/* Table Header */}
                            <thead>
                                <tr>
                                    <th>Select</th>
                                    <th>User Name</th>
                                    <th>Brand Name</th>
                                    <th>Product Name</th>
                                    {/* Add more headers as needed */}
                                </tr>
                            </thead>
                            {/* Table Body - Scrollable */}
                            <tbody>
                                {userBrandRemoveList.map((item, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                id={item.User_Product_Stock_Id} // Convert ID to string for HTML attribute
                                                checked={checkedItems[item.User_Product_Stock_Id]}
                                                onChange={handleCheckboxChange}
                                            />
                                        </td>
                                        <td>{item.User_Name}</td>
                                        <td>{item.Brand_Name}</td>
                                        <td>{item.Product_Name}</td>
                                        {/* Render additional cells for other data */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {errorMessageBrandRemove.length > 0
                        &&
                        (
                            <div style={{ color: "red", paddingLeft: '1vh' }}>
                                {errorMessageBrandRemove}
                            </div>

                        )
                    }
                    <div style={{
                        height: '5vh',
                        marginBottom: '1vh',
                        marginTop: '1vh'
                    }}>
                        <div style={{ display: userBrandRemoveList.length > 0 ? '' : 'none' }}>
                            <div style={{ float: 'right' }}>
                                <Button
                                    onClick={handleClickRemoveBrand}
                                    variant="contained" color="primary"
                                    sx={{
                                        ml: 1, width: '12vh', height: '3.5vh', borderRadius: '30px',
                                    }}
                                >Remove</Button>
                            </div>

                            <div style={{ float: 'right' }}>
                                <Button
                                    onClick={handleClickCloseRemoveBrand}
                                    variant="contained" color="primary"
                                    sx={{
                                        ml: 1, width: '12vh', height: '3.5vh', borderRadius: '30px',
                                    }}
                                >Cancel</Button>
                            </div>
                        </div>
                        <div style={{ display: userBrandRemoveList.length > 0 ? 'none' : '' }}>
                            <div style={{ float: 'right' }}>
                                <Button
                                    onClick={handleClickCloseRemoveBrand}
                                    variant="contained" color="primary"
                                    sx={{
                                        ml: 1, width: '12vh', height: '3.5vh', borderRadius: '30px',
                                    }}
                                >Okay</Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Dialog for Add Brand */}
            <Dialog
                open={openBrandAdd}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
                sx={{ mt: 0, p: 1 }}
            >
                <DialogTitle sx={{ backgroundColor: '#e3e6e5' }}>
                    {"Add Brand"}
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: '#e3e6e5' }}>
                    <DialogContentText id="alert-dialog-slide-description">
                        <div style={{ display: 'flex' }}>

                            <Paper sx={{ p: 1, m: 1, width: '40vh', height: '11vh' }} >
                                <div style={{ display: 'flex' }}>
                                    <FenceIcon style={{ fontSize: '25px', color: '#808080' }} />
                                    <div style={{ fontSize: '15px', color: '#808080', marginLeft: '2%' }}>Brand</div>
                                </div>
                                <div style={{ float: 'right', fontSize: '15px', color: '#9c27b0', position: 'relative' }}>
                                    <input type="text" name="Qty"
                                        value={brandName}
                                        onChange={handleChangeBrandName}
                                        style={{
                                            color: '#9c27b0',
                                            width: '35vh',
                                            height: '4.5vh',
                                            border: '1px solid #1976d2',
                                            borderRadius: '10px',
                                            fontSize: '16px',
                                            paddingLeft: '1vh',
                                            marginLeft: '5vh'
                                        }}
                                        onFocus={() => setShowSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow click events
                                    />
                                    {showSuggestions && brandSuggestionList.length > 0 && (
                                        <ul style={{
                                            position: 'absolute',
                                            top: '100%',
                                            left: 0,
                                            right: 0,
                                            border: '1px solid #ddd',
                                            backgroundColor: '#fff',
                                            margin: 0,
                                            padding: 0,
                                            listStyleType: 'none',
                                            maxHeight: '150px',
                                            overflowY: 'auto',
                                            zIndex: 1
                                        }}>
                                            {brandSuggestionList.map((suggestion, index) => (
                                                <li
                                                    key={suggestion.BrandId}
                                                    onClick={() => handleSuggestionClick(suggestion)}
                                                    style={{
                                                        padding: '8px',
                                                        cursor: 'pointer',
                                                        borderBottom: '1px solid #ddd'
                                                    }}
                                                >
                                                    {suggestion.Brand_Name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </Paper>

                            <Paper sx={{ p: 1, m: 1, width: '40vh', height: '11vh' }} >
                                <div style={{ display: 'flex' }}>
                                    <CategoryIcon style={{ fontSize: '25px', color: '#808080' }} />
                                    <div style={{ fontSize: '15px', color: '#808080', marginLeft: '2%' }}>Brand Description</div>
                                </div>
                                <div style={{ float: 'right', fontSize: '15px', color: '#9c27b0', position: 'relative' }}>
                                    <input type="text"
                                        value={brandDescription}
                                        onChange={handleChangeBrandDescription}
                                        style={{
                                            color: '#9c27b0',
                                            width: '35vh',
                                            height: '4.5vh',
                                            border: '1px solid #1976d2',
                                            borderRadius: '10px',
                                            fontSize: '16px',
                                            paddingLeft: '1vh',
                                            marginLeft: '5vh'
                                        }}
                                    />
                                </div>
                            </Paper>
                        </div>
                        <div style={{
                            display: 'flex', height: '5vh',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1vh'
                        }}>
                            <div style={{ order: 1 }}>
                                <Button
                                    onClick={handleAddBrand}
                                    variant="contained" color="secondary"
                                    sx={{
                                        width: '25vh', height: '3.5vh', borderRadius: '30px'
                                    }}
                                >Add to Queue</Button>
                            </div>
                            {errorMessageBrandAdd.length > 0
                                &&
                                (
                                    <div style={{ color: "red", width: '35vh', order: 2 }}>
                                        {errorMessageBrandAdd}
                                    </div>

                                )
                            }
                            <div style={{ display: 'flex', order: 3 }}>
                                <Button
                                    onClick={handleSaveBrand}
                                    variant="contained" color="secondary"
                                    sx={{
                                        width: '12vh', height: '3.5vh', borderRadius: '30px',
                                    }}
                                >Save</Button>
                                <Button
                                    onClick={handleClickCloseBrandAdd}
                                    variant="contained" color="primary"
                                    sx={{
                                        ml: 1, width: '12vh', height: '3.5vh', borderRadius: '30px',
                                    }}
                                >Cancel</Button>
                            </div>
                        </div>
                    </DialogContentText>
                    <div className="datatable">
                        <table>
                            {/* Table Header */}
                            <thead>
                                <tr>
                                    <th>Brand Name</th>
                                    <th>Brand Description</th>
                                    <th>Delete</th>
                                    {/* Add more headers as needed */}
                                </tr>
                            </thead>
                            {/* Table Body - Scrollable */}
                            <tbody>
                                {brandListForAdd.map((item, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                                        <td>{item.Brand_Name}</td>
                                        <td>{item.Brand_Description}</td>
                                        <td><DeleteForeverIcon
                                            sx={{ color: 'red', fontSize: '20px', mr: 1 }}
                                            onClick={() => handleDelete(item.QtyRowId)}
                                        />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    )
}