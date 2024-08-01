import React from "react";

import { styled } from '@mui/material/styles';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Pagination, Paper, tableCellClasses } from '@mui/material';

import Inventory2Icon from '@mui/icons-material/Inventory2';
import Button from '@mui/material/Button';
import axios from "axios";
import UpdateIcon from '@mui/icons-material/Update';

//Dialog
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

import CategoryIcon from '@mui/icons-material/Category';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FenceIcon from '@mui/icons-material/Fence';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import './ProductStock.css';

import FilterListIcon from '@mui/icons-material/FilterList';

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


export default function ProductStock() {

    const [productStockList, setProductStockList] = React.useState([]);
    const [productQtyList, setProductQtyList] = React.useState([]);
    const [userId, setUserId] = React.useState([]);
    const [userListDrop, setUserListDrop] = React.useState([]);
    const [brandListDrop, setBrandListDrop] = React.useState([]);
    const [productListDrop, setProductListDrop] = React.useState([]);
    const [productDetails, setProductDetails] = React.useState([]);
    const [productQtyUpdate, setProductQtyUpdate] = React.useState({});


    const [brandListForFilter, setBrandListForFilter] = React.useState([]);
    const [selectedBrandIdForFilter, setSelectedBrandIdForFilter] = React.useState('');

    const [productListForFilter, setProductListForFilter] = React.useState([]);
    const [selectedProductIdForFilter, setSelectedProductIdForFilter] = React.useState('');

    const [usernameFilter, setUsernameFilter] = React.useState('');

    const [qty, setQty] = React.useState('');
    const [updateQty, setUpdateQty] = React.useState('');


    const [errorMessage, setErrorMessage] = React.useState('')
    const [errorUpdateQtyMessage, setErrorUpdateQtyMessage] = React.useState('');


    React.useEffect(() => {
        ProductStockList();
        BrandListForFilter();
        ProductListForFilter(0);
    }, []);


    const [open, setOpen] = React.useState(false);
    const [openStockUpdate, setOpenStockUpdate] = React.useState(false);


    const handleClickOpen = () => {
        UserListDD();
        setErrorMessage('');
        setOpen(true);
    };

    const handleClickOpenStockUpdate = (row) => {
        setProductQtyUpdate(row);
        setUpdateQty(row.Qty);
        setOpenStockUpdate(true);
    };

    const handleAddProductQty = () => {

        if (selectedUserId == '') {
            setErrorMessage('Please select the user.');
        }
        else if (selectedBrandId == '') {
            setErrorMessage('Please select the brand.');
        }
        else if (selectedProductId == '') {
            setErrorMessage('Please select the product.');
        }
        else if (qty == '') {
            setErrorMessage('Please enter valid quantity.');
        }
        else {
            const qtyforadd = {
                Brand_Name: productDetails.Brand_Name,
                BrandId: productDetails.BrandId,
                Product_Name: productDetails.Product_Name,
                ProductId: productDetails.ProductId,
                Qty: qty,
                UserName: productDetails.Name,
                UserId: productDetails.UserId,
                QtyRowId: Math.floor(Math.random() * 1000) + 1
            };
            setProductQtyList([...productQtyList, qtyforadd]);
            if (userListDrop.length != 1) {
                setSelectedUserId('');
            }
            handleClear();
        }
    };

    const handleUpdateProductQty = () => {
        if (updateQty == '') {
            setErrorUpdateQtyMessage('Please enter valid quantity.');
        }
        else {
            const data = {
                LoginToken: localStorage.getItem('auth'),
                Qty: updateQty,
                StockId: productQtyUpdate.User_Product_Stock_Id
            }
            const url = 'https://localhost:44374/api/Product/updateStockQty';
            axios.post(url, data).then((result) => {
                if (result.data.Table[0].Result == 'Successfull') {
                    setErrorUpdateQtyMessage('');
                    ProductStockList();
                    setOpenStockUpdate(false);
                }
            })

        }
    }

    const handleSaveProductQty = () => {
        if (productQtyList.length > 0) {

            var updatedQtyList = '';
            productQtyList.forEach((item, index) => {
                updatedQtyList = updatedQtyList + '#' + item.BrandId + '#' + item.ProductId + '#' + item.Qty + '#' + item.UserId + ',';
            });

            const newString = updatedQtyList.slice(0, -1);

            const data = {
                LoginToken: localStorage.getItem('auth'),
                UpdatedQtyList: newString
            }
            const url = 'https://localhost:44374/api/Product/addStockQty';
            axios.post(url, data).then((result) => {
                if (result.data.Table[0].Result == 'Successfull') {
                    setProductQtyList([]);
                    if (userListDrop.length != 1) {
                        setSelectedUserId('');
                    }
                    ProductStockList();
                    handleClear();
                    setOpen(false);
                }
            })

        }
        else {
            setErrorMessage('Please select valid product & quantity.');
        }
    }

    const handleClose = () => {
        handleClear();
        setSelectedUserId('');
        setProductQtyList([]);
        setOpen(false);
    };

    const handleCloseStockUpdate = () => {
        setOpenStockUpdate(false);
    };

    function ProductStockList() {
        const data = {
            LoginToken: localStorage.getItem('auth'),
            BrandId: selectedBrandIdForFilter == '' ? 0 : selectedBrandIdForFilter,
            ProductId: selectedProductIdForFilter == '' ? 0 : selectedProductIdForFilter,
            UserId: 0,
            UserName: usernameFilter == '' ? '' : usernameFilter
        }
        const url = 'https://localhost:44374/api/Product/productStockList';
        axios.post(url, data).then((result) => {
            setProductStockList(result.data.Table);
            setUserId(result.data.Table1[0]);
        })
    }

    const UserListDD = () => {
        const data = {
            LoginToken: localStorage.getItem('auth')
        }
        const url = 'https://localhost:44374/api/Product/usersListForStockAdd';
        axios.post(url, data).then((result) => {
            setUserListDrop(result.data.Table);
            if (result.data.Table.length == 1) {
                BrandListDD(result.data.Table[0].UserId);
            }
        })

    }

    const handleChangeBrandIdForFilter = (event) => {
        setSelectedBrandIdForFilter(event.target.value);
        setSelectedProductIdForFilter('');
        setUsernameFilter('');
        ProductListForFilter(event.target.value);
        const data = {
            LoginToken: localStorage.getItem('auth'),
            BrandId: event.target.value,
            ProductId: 0,
            UserId: 0,
            UserName: ''
        }
        const url = 'https://localhost:44374/api/Product/productStockList';
        axios.post(url, data).then((result) => {
            setProductStockList(result.data.Table);
            setUserId(result.data.Table1[0]);
        })
        setPage(1);

    };

    const BrandListForFilter = () => {
        const data = {
            LoginToken: localStorage.getItem('auth'),
        }
        const url = 'https://localhost:44374/api/Product/brandListForFilter';
        axios.post(url, data).then((result) => {
            setBrandListForFilter(result.data.Table);
        })
    }

    const handleChangeProductIdForFilter = (event) => {
        setSelectedProductIdForFilter(event.target.value);
        setUsernameFilter('');
        const data = {
            LoginToken: localStorage.getItem('auth'),
            BrandId: selectedBrandIdForFilter == 0 ? 0 : selectedBrandIdForFilter,
            ProductId: event.target.value,
            UserId: 0,
            UserName: ''
        }
        const url = 'https://localhost:44374/api/Product/productStockList';
        axios.post(url, data).then((result) => {
            setProductStockList(result.data.Table);
            setUserId(result.data.Table1[0]);
        })
        setPage(1);
    };

    const ProductListForFilter = (BrandId) => {
        const data = {
            BrandId: BrandId
        }

        const url = 'https://localhost:44374/api/Product/productListForFilter';
        axios.post(url, data).then((result) => {
            setProductListForFilter(result.data.Table);
        })
    }

    const handleChangeUsernameFilter = (event) => {
        const inputValue = event.target.value;
        setUsernameFilter(inputValue);

        const data = {
            LoginToken: localStorage.getItem('auth'),
            BrandId: selectedBrandIdForFilter == 0 ? 0 : selectedBrandIdForFilter,
            ProductId: selectedProductIdForFilter == 0 ? 0 : selectedProductIdForFilter,
            UserId: 0,
            UserName: event.target.value
        }
        const url = 'https://localhost:44374/api/Product/productStockList';
        axios.post(url, data).then((result) => {
            setProductStockList(result.data.Table);
            setUserId(result.data.Table1[0]);
        })
        setPage(1);
    }

    const BrandListDD = (userId) => {
        const data = {
            UserId: userId
        }
        setSelectedUserId(userId);
        const url = 'https://localhost:44374/api/Product/brandListForStockAdd';
        axios.post(url, data).then((result) => {
            setBrandListDrop(result.data.Table);
        })
    }

    const ProductListDD = (userId, brandId) => {
        const data = {
            UserId: userId,
            Brandid: brandId
        }
        setSelectedBrandId(brandId);
        const url = 'https://localhost:44374/api/Product/productListForStockAdd';
        axios.post(url, data).then((result) => {
            setProductListDrop(result.data.Table);
        })
    }

    const ProductDetails = (userId, brandId, productId) => {
        const data = {
            UserId: userId,
            BrandId: brandId,
            ProductId: productId,
        }
        setSelectedProductId(productId);
        const url = 'https://localhost:44374/api/Product/productDetails';
        axios.post(url, data).then((result) => {
            setProductDetails(result.data.Table[0]);
        })
    }

    const [selectedUserId, setSelectedUserId] = React.useState('');

    const handleChangeUserId = (event) => {
        BrandListDD(event.target.value);
        setSelectedUserId(event.target.value);
        setSelectedBrandId('');
        setSelectedProductId('');
        setProductDetails([]);
        setQty('');
        setErrorMessage('');
    };

    const [selectedBrandId, setSelectedBrandId] = React.useState('');

    const handleChangeBrandId = (event) => {
        ProductListDD(selectedUserId, event.target.value);
        setSelectedBrandId(event.target.value);
        setSelectedProductId('');
        setProductDetails([]);
        setQty('');
        setErrorMessage('');
    };

    const [selectedProductId, setSelectedProductId] = React.useState('');

    const handleChangeProductId = (event) => {
        ProductDetails(selectedUserId, selectedBrandId, event.target.value);
        setSelectedProductId(event.target.value);
        setProductDetails([]);
        setQty('');
        setErrorMessage('');
    };

    const handleClear = () => {

        setSelectedBrandId('');
        setSelectedProductId('');
        setProductDetails([]);
        setQty('');
        setErrorMessage('');
    };

    const handleFilterClear = () => {
        setSelectedBrandIdForFilter('');
        setSelectedProductIdForFilter('');
        setUsernameFilter('');
        ProductListForFilter(0);

        const data = {
            LoginToken: localStorage.getItem('auth'),
            BrandId: 0,
            ProductId: 0,
            UserId: 0,
            UserName: ''
        }
        const url = 'https://localhost:44374/api/Product/productStockList';
        axios.post(url, data).then((result) => {
            setProductStockList(result.data.Table);
            setUserId(result.data.Table1[0]);
        })
    }

    const handleChangeQty = (event) => {
        const inputValue = event.target.value;

        // Regex to match only whole numbers with 6 digits
        if (/^\d{0,6}$/.test(inputValue)) {
            setQty(inputValue);
            setErrorMessage('');
        }
    }

    const handleDelete = (id) => {
        const updatedData = productQtyList.filter(item => item.QtyRowId !== id);
        setProductQtyList(updatedData);
    };

    const handleUpdateQty = (event) => {
        const inputValue = event.target.value;

        // Regex to match only whole numbers with 6 digits
        if (/^\d{0,6}$/.test(inputValue)) {
            setUpdateQty(inputValue);
            setErrorUpdateQtyMessage('');
        }
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

    return (
        <div>
            <span >
                <span >
                    <div style={{ display: 'flex' }}>
                        <div><Inventory2Icon color="secondary"
                            style={{ fontSize: '30px' }}
                            sx={{ mt: 0.1, mr: 1 }} />
                        </div>
                        <div style={{ fontSize: "23px" }}>Product Stock List</div>
                    </div>
                    <Button variant="contained" color="secondary"
                        sx={{
                            width: '25vh', borderRadius: '30px', float: 'right', mt: -5
                        }}

                        onClick={handleClickOpen}
                    >
                        <div style={{ marginRight: '1vh' }}>Add Stock</div> <AddShoppingCartIcon />
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
                        <div style={{ display: 'flex' , marginLeft:'5vh'}}>
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
                            <div style={{ marginRight: '2vh' }}>
                                Product :
                                <Select
                                    id="demo-simple-select"
                                    value={selectedProductIdForFilter}
                                    onChange={handleChangeProductIdForFilter}
                                    sx={{
                                        width: '30vh', height: '4.5vh',
                                        color: '#9c27b0', borderColor: 'red',
                                        borderRadius: '10px', marginLeft: '2vh'
                                    }}
                                >
                                    {productListForFilter.map((option, index) => (
                                        <MenuItem key={index} value={option.ProductId}>
                                            {option.Product_Name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                            <div style={{ display: userId.UserId == 3 ? '' : 'none' }}>
                                User Name :
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
                                        marginLeft: '2vh'
                                    }}
                                />
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
                            <StyledTableCell align="left">Product Name</StyledTableCell>
                            <StyledTableCell align="left">Stock / Qty</StyledTableCell>
                            <StyledTableCell align="left" style={{ display: userId.UserId == 3 ? '' : 'none' }}>User Name</StyledTableCell>
                            <StyledTableCell align="left">Update Stock</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productStockList.slice(startIndex, endIndex).map((row) => (
                            <StyledTableRow key={row.User_Product_Stock_Id}>
                                <StyledTableCell component="th" scope="row">
                                    {row.Brand_Name}
                                </StyledTableCell>
                                <StyledTableCell align="left">{row.Product_Name}</StyledTableCell>
                                <StyledTableCell align="left">{row.Qty}</StyledTableCell>
                                <StyledTableCell align="left" style={{ display: userId.UserId == 3 ? '' : 'none' }}>{row.UserName}</StyledTableCell>
                                <StyledTableCell align="left" >
                                    <Button variant="contained" color="secondary"
                                        sx={{
                                            width: '18vh', height: '3.5vh', borderRadius: '30px',
                                        }}
                                        onClick={() => handleClickOpenStockUpdate(row)}
                                    >
                                        <UpdateIcon sx={{ fontSize: '20px', mr: 1 }} />
                                        <div> Update</div>
                                    </Button>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Pagination
                        style={{ margin: '20px auto' }}
                        count={Math.ceil(productStockList.length / rowsPerPage)} // Total number of pages based on data length and rows per page
                        page={page}
                        onChange={handleChangePage}
                        showFirstButton
                        showLastButton
                    />
                </div>
            </TableContainer>

            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
                sx={{ mt: 0, p: 1 }}
            >
                <DialogTitle sx={{ backgroundColor: '#e3e6e5' }}>
                    {"Add Stock Quantity"}
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: '#e3e6e5' }}>
                    <DialogContentText id="alert-dialog-slide-description">
                        <div style={{ display: 'flex' }}>
                            <Paper sx={{ p: 1, m: 1, width: '80vh', height: '11vh' }} >
                                <div style={{ display: 'flex' }}>
                                    <AccountBoxIcon style={{ fontSize: '25px', color: '#808080' }} />
                                    <div style={{ fontSize: '15px', color: '#808080', marginLeft: '2%' }}>User</div>
                                </div>
                                <div style={{ float: 'right', fontSize: '15px', color: '#9c27b0' }}>
                                    <div style={{ display: userListDrop.length == 1 ? '' : 'none' }}>{userListDrop.length == 1 ? userListDrop[0].Name : ''}</div>
                                    <Select
                                        id="demo-simple-select"
                                        value={selectedUserId}
                                        onChange={handleChangeUserId}
                                        sx={{
                                            width: '200px', height: '4.5vh',
                                            color: '#9c27b0', borderColor: 'red',
                                            display: userListDrop.length == 1 ? 'none' : '',
                                            borderRadius: '10px'
                                        }}
                                    >
                                        {userListDrop.map((option, index) => (
                                            <MenuItem key={index} value={option.UserId}>
                                                {option.Name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </div>
                            </Paper>
                            <Paper sx={{ p: 1, m: 1, width: '80vh', height: '11vh' }} >
                                <div style={{ display: 'flex' }}>
                                    <FenceIcon style={{ fontSize: '25px', color: '#808080' }} />
                                    <div style={{ fontSize: '15px', color: '#808080', marginLeft: '2%' }}>Brand</div>
                                </div>
                                <div style={{ float: 'right', fontSize: '15px', color: '#9c27b0' }}>
                                    <Select
                                        id="demo-simple-select"
                                        value={selectedBrandId}
                                        onChange={handleChangeBrandId}
                                        sx={{
                                            width: '200px', height: '4.5vh',
                                            color: '#9c27b0', borderColor: 'red',
                                            borderRadius: '10px'
                                        }}
                                    >
                                        {brandListDrop.map((option, index) => (
                                            <MenuItem key={index} value={option.BrandId}>
                                                {option.Brand_Name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </div>
                            </Paper>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <Paper sx={{ p: 1, m: 1, width: '60vh', height: '11vh' }} >
                                <div style={{ display: 'flex' }}>
                                    <CategoryIcon style={{ fontSize: '25px', color: '#808080' }} />
                                    <div style={{ fontSize: '15px', color: '#808080', marginLeft: '2%' }}>Product</div>
                                </div>
                                <div style={{ float: 'right', fontSize: '15px', color: '#9c27b0' }}>
                                    <Select
                                        id="demo-simple-select"
                                        value={selectedProductId}
                                        onChange={handleChangeProductId}
                                        sx={{
                                            width: '200px', height: '4.5vh',
                                            color: '#9c27b0', borderColor: 'red',
                                            borderRadius: '10px'
                                        }}
                                    >
                                        {productListDrop.map((option, index) => (
                                            <MenuItem key={index} value={option.ProductId}>
                                                {option.Product_Name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </div>
                            </Paper>
                            <Paper sx={{ p: 1, m: 1, width: '58vh', height: '11vh' }} >
                                <div style={{ display: 'flex' }}>
                                    <AddCircleIcon style={{ fontSize: '25px', color: '#808080' }} />
                                    <div style={{ fontSize: '15px', color: '#808080', marginLeft: '2%' }}>Add Stock Quantity</div>
                                </div>

                                <div style={{ display: 'flex', fontSize: '15px', color: '#9c27b0' }}>
                                    <div style={{ color: '#808080', marginLeft: '1vh' }}>
                                        In-Stock :&nbsp;
                                    </div>
                                    <div style={{ color: '#9c27b0' }}>{productDetails.Qty == undefined ? 0 : productDetails.Qty}</div>
                                    <div style={{}}>
                                        <input type="text" name="Qty"
                                            value={qty}
                                            onChange={handleChangeQty}
                                            style={{
                                                color: '#9c27b0',
                                                width: '15vh',
                                                height: '4.5vh',
                                                border: '1px solid #1976d2',
                                                borderRadius: '10px',
                                                fontSize: '16px',
                                                paddingLeft: '1vh',
                                                marginLeft: '5vh'
                                            }}
                                        />
                                    </div>
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
                                    onClick={handleAddProductQty}
                                    variant="contained" color="secondary"
                                    sx={{
                                        width: '25vh', height: '3.5vh', borderRadius: '30px'
                                    }}
                                >Add to Queue</Button>
                            </div>
                            {errorMessage.length > 0
                                &&
                                (
                                    <div style={{ color: "red", width: '35vh', order: 2 }}>
                                        {errorMessage}
                                    </div>

                                )
                            }
                            <div style={{ display: 'flex', order: 3 }}>
                                <Button
                                    onClick={handleSaveProductQty}
                                    variant="contained" color="secondary"
                                    sx={{
                                        width: '12vh', height: '3.5vh', borderRadius: '30px',
                                    }}
                                >Save</Button>
                                <Button
                                    onClick={handleClose}
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
                                    <th>Product Name</th>
                                    <th>Stock / Qty</th>
                                    <th style={{ display: userId.UserId == 3 ? '' : 'none' }}> User Name</th>
                                    <th>Delete</th>
                                    {/* Add more headers as needed */}
                                </tr>
                            </thead>
                            {/* Table Body - Scrollable */}
                            <tbody>
                                {productQtyList.map((item, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                                        <td>{item.Brand_Name}</td>
                                        <td>{item.Product_Name}</td>
                                        <td>{item.Qty}</td>
                                        <td style={{ display: userId.UserId == 3 ? '' : 'none' }}>{item.UserName}</td>
                                        <td><DeleteForeverIcon
                                            sx={{ color: 'red', fontSize: '20px', mr: 1 }}
                                            onClick={() => handleDelete(item.QtyRowId)}
                                        />
                                        </td>
                                        {/* Render additional cells for other data */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </DialogContent>
            </Dialog>


            <Dialog
                open={openStockUpdate}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
                sx={{ mt: 0, p: 1 }}
            >
                <DialogTitle sx={{ backgroundColor: '#e3e6e5' }}>
                    {"Update Stock Quantity"}
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: '#e3e6e5' }}>
                    <DialogContentText id="alert-dialog-slide-description">
                        <div style={{ display: 'flex' }}>
                            <Paper sx={{ p: 1, m: 1, width: '80vh', height: '11vh' }} >
                                <div style={{ display: 'flex' }}>
                                    <AccountBoxIcon style={{ fontSize: '25px', color: '#808080' }} />
                                    <div style={{ fontSize: '15px', color: '#808080', marginLeft: '2%' }}>User</div>
                                </div>
                                <div style={{ float: 'right', fontSize: '15px', color: '#9c27b0' }}>
                                    <div >{productQtyUpdate.UserName}</div>
                                </div>
                            </Paper>
                            <Paper sx={{ p: 1, m: 1, width: '80vh', height: '11vh' }} >
                                <div style={{ display: 'flex' }}>
                                    <FenceIcon style={{ fontSize: '25px', color: '#808080' }} />
                                    <div style={{ fontSize: '15px', color: '#808080', marginLeft: '2%' }}>Brand</div>
                                </div>
                                <div style={{ float: 'right', fontSize: '15px', color: '#9c27b0' }}>
                                    <div> {productQtyUpdate.Brand_Name} </div>
                                </div>
                            </Paper>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <Paper sx={{ p: 1, m: 1, width: '60vh', height: '11vh' }} >
                                <div style={{ display: 'flex' }}>
                                    <CategoryIcon style={{ fontSize: '25px', color: '#808080' }} />
                                    <div style={{ fontSize: '15px', color: '#808080', marginLeft: '2%' }}>Product</div>
                                </div>
                                <div style={{ float: 'right', fontSize: '15px', color: '#9c27b0' }}>
                                    <div> {productQtyUpdate.Product_Name} </div>
                                </div>
                            </Paper>
                            <Paper sx={{ p: 1, m: 1, width: '58vh', height: '11vh' }} >
                                <div style={{ display: 'flex' }}>
                                    <AddCircleIcon style={{ fontSize: '25px', color: '#808080' }} />
                                    <div style={{ fontSize: '15px', color: '#808080', marginLeft: '2%' }}>Update Stock Quantity</div>
                                </div>

                                <div style={{ display: 'flex', fontSize: '15px', color: '#9c27b0' }}>
                                    <div style={{ color: '#808080', marginLeft: '1vh' }}>
                                        In-Stock :&nbsp;
                                    </div>
                                    <div style={{ color: '#9c27b0' }}> {productQtyUpdate.Qty} </div>
                                    <div style={{}}>
                                        <input type="text" name="Qty"
                                            value={updateQty}
                                            onChange={handleUpdateQty}
                                            style={{
                                                color: '#9c27b0',
                                                width: '15vh',
                                                height: '4.5vh',
                                                border: '1px solid #1976d2',
                                                borderRadius: '10px',
                                                fontSize: '16px',
                                                paddingLeft: '1vh',
                                                marginLeft: '5vh'
                                            }}
                                        />
                                    </div>
                                </div>
                            </Paper>
                        </div>

                        <div style={{
                            display: 'flex', height: '5vh',
                            justifyContent: 'right',
                            alignItems: 'right',
                            marginTop: '2vh'
                        }}>

                            {errorUpdateQtyMessage.length > 0
                                &&
                                (
                                    <div style={{ color: "red", width: '35vh', order: 1 }}>
                                        {errorUpdateQtyMessage}
                                    </div>

                                )
                            }
                            <div style={{ display: 'flex', order: 2 }}>
                                <Button
                                    onClick={handleUpdateProductQty}
                                    variant="contained" color="secondary"
                                    sx={{
                                        width: '12vh', height: '3.5vh', borderRadius: '30px',
                                    }}
                                >
                                    Update
                                </Button>
                                <Button
                                    onClick={handleCloseStockUpdate}
                                    variant="contained" color="primary"
                                    sx={{
                                        ml: 1, width: '12vh', height: '3.5vh', borderRadius: '30px',
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div >
    )
}