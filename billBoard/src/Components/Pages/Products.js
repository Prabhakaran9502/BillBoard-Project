import React, { useEffect } from "react";
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

import CategoryIcon from '@mui/icons-material/Category';
import FenceIcon from '@mui/icons-material/Fence';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FilterListIcon from '@mui/icons-material/FilterList';

// import './ProductStock.css';

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

export default function Products() {

    const [productList, setProductList] = React.useState([]);
    const [userId, setUserId] = React.useState([]);

    const [brandListForFilter, setBrandListForFilter] = React.useState([]);
    const [selectedBrandIdForFilter, setSelectedBrandIdForFilter] = React.useState('');

    const [productListForFilter, setProductListForFilter] = React.useState([]);
    const [selectedProductIdForFilter, setSelectedProductIdForFilter] = React.useState('');

    const [userProductStockList, setUserProductStockList] = React.useState([]);
    const [userProductRowDetails, setUserProductRowDetails] = React.useState([]);

    const [userProductRemoveList, setUserProductRemoveList] = React.useState([]);

    const [openProductDetails, setOpenProductDetails] = React.useState(false);
    const [openProductRemove, setOpenProductRemove] = React.useState(false);
    const [openProductAdd, setOpenProductAdd] = React.useState(false);

    const [errorMessage, setErrorMessage] = React.useState('');
    const [errorMessageProductDetails, setErrorMessageProductDetails] = React.useState('');
    const [errorMessageProductAdd, setErrorMessageProductAdd] = React.useState('');

    const [brandListDrop, setBrandListDrop] = React.useState([]);
    const [productListForAdd, setProductListForAdd] = React.useState([]);

    React.useEffect(() => {
        ProductList();
        BrandListForFilter();
        ProductListForFilter(0);
    }, []);


    function ProductList() {
        const data = {
            LoginToken: localStorage.getItem('auth'),
            BrandId: selectedBrandIdForFilter == '' ? 0 : selectedBrandIdForFilter,
            ProductId: selectedProductIdForFilter == '' ? 0 : selectedProductIdForFilter,
            UserId: 0,
            UserName: ''
        }
        const url = 'https://localhost:44374/api/Product/productList';
        axios.post(url, data).then((result) => {
            setProductList(result.data.Table);
            setUserId(result.data.Table1[0]);
        })
    }

    const handleChangeBrandIdForFilter = (event) => {
        setSelectedBrandIdForFilter(event.target.value);
        setSelectedProductIdForFilter('');
        ProductListForFilter(event.target.value);
        const data = {
            LoginToken: localStorage.getItem('auth'),
            BrandId: event.target.value,
            ProductId: 0,
            UserId: 0,
            UserName: ''
        }
        const url = 'https://localhost:44374/api/Product/productList';
        axios.post(url, data).then((result) => {
            setProductList(result.data.Table);
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
        const data = {
            LoginToken: localStorage.getItem('auth'),
            BrandId: selectedBrandIdForFilter == 0 ? 0 : selectedBrandIdForFilter,
            ProductId: event.target.value,
            UserId: 0,
            UserName: ''
        }
        const url = 'https://localhost:44374/api/Product/productList';
        axios.post(url, data).then((result) => {
            setProductList(result.data.Table);
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

    const handleClickOpenProductDetails = (row) => {
        setUserProductRowDetails(row);
        const data = {
            LoginToken: localStorage.getItem('auth'),
            BrandId: row.BrandId,
            ProductId: row.ProductId
        }
        const url = 'https://localhost:44374/api/Product/userProductStockList';
        axios.post(url, data).then((result) => {
            setUserProductStockList(result.data.Table);
            setUserId(result.data.Table1[0]);
            if (result.data.Table.length == 0) {
                setErrorMessageProductDetails('There is no record with the stock qty.')
            }
        })

        setOpenProductDetails(true);
    };

    const handleClickCloseProductDetails = () => {
        setErrorMessageProductDetails('');
        setOpenProductDetails(false);
        ProductList();
    }


    const handleClickOpenRemoveProduct = (row) => {
        setUserProductRowDetails(row);
        const data = {
            LoginToken: localStorage.getItem('auth'),
            BrandId: row.BrandId,
            ProductId: row.ProductId
        }
        const url = 'https://localhost:44374/api/Product/userProductStockList';
        axios.post(url, data).then((result) => {
            setUserProductRemoveList(result.data.Table);
            setUserId(result.data.Table1[0]);
            if (result.data.Table.length == 0) {
                setErrorMessage('There is no record with the stock qty.');
            }
        })

        setOpenProductRemove(true);
    }

    const handleClickCloseRemoveProduct = () => {
        setCheckedItems([]);
        setRemovalId([]);
        setErrorMessage('');
        setOpenProductRemove(false);
        ProductList();
    }

    const handleClickRemoveProduct = () => {
        if (userId.UserId == 3) {
            var RemovalIdList = '';
            removalId.forEach((item, index) => {
                RemovalIdList = RemovalIdList + item.remId + ',';
            });
            const newString = RemovalIdList.slice(0, -1);
            if (userProductRemoveList.length != 0) {
                if (newString == '') {
                    setErrorMessage('Please select the valid user with product to remove.');
                }
                else {
                    const data = {
                        LoginToken: localStorage.getItem('auth'),
                        RemovalId: newString,
                    }

                    const url = 'https://localhost:44374/api/Product/removeProductStock';
                    axios.post(url, data).then((result) => {
                        if (result.data.Table[0].Result == 'Successfull') {
                            setCheckedItems([]);
                            setRemovalId([]);
                            setOpenProductRemove(false);
                            ProductList();
                        }
                    })

                }
            }
            else {
                setCheckedItems([]);
                setRemovalId([]);
                setErrorMessage('');
                setOpenProductRemove(false);
                ProductList();
            }
        }
        else {
            var newString = '' + userProductRemoveList[0].User_Product_Stock_Id;
            const data = {
                LoginToken: localStorage.getItem('auth'),
                RemovalId: newString,
            }
            const url = 'https://localhost:44374/api/Product/removeProductStock';
            axios.post(url, data).then((result) => {
                if (result.data.Table[0].Result == 'Successfull') {
                    setCheckedItems([]);
                    setRemovalId([]);
                    setOpenProductRemove(false);
                    ProductList();
                }
            })
        }
    }

    const handleFilterClear = () => {
        setSelectedBrandIdForFilter('');
        setSelectedProductIdForFilter('');
        ProductListForFilter(0);

        const data = {
            LoginToken: localStorage.getItem('auth'),
            BrandId: 0,
            ProductId: 0,
            UserId: 0,
            UserName: ''
        }
        const url = 'https://localhost:44374/api/Product/productList';
        axios.post(url, data).then((result) => {
            setProductList(result.data.Table);
            setUserId(result.data.Table1[0]);
        })
    }


    const handleClickOpenProductAdd = () => {
        BrandListDD();
        setOpenProductAdd(true);
    };

    const handleClickCloseProductAdd = () => {
        setOpenProductAdd(false);
        setSelectedBrand({ BrandId: 0, Brand_Name: '' });
        setProductListForAdd([]);

        setProductName('');
        setProductDescription('');
        setProductSuggestionList([]);
        setShowSuggestions(false);
        setSelectedSuggestion({});

        setErrorMessageProductAdd('');
    }

    const BrandListDD = () => {
        const data = {
            LoginToken: localStorage.getItem('auth'),
        }
        const url = 'https://localhost:44374/api/Product/brandListForProductAdd';
        axios.post(url, data).then((result) => {
            setBrandListDrop(result.data.Table);
        })
    }

    const [selectedBrand, setSelectedBrand] = React.useState({ BrandId: 0, Brand_Name: '' });

    const handleChangeBrandId = (event) => {
        const selectedId = parseInt(event.target.value, 10);
        const item = brandListDrop.find(item => item.BrandId === event.target.value);
        if (item) {
            setSelectedBrand(item);
            setProductName('');
            setProductDescription('');
            setProductSuggestionList([]);
            setShowSuggestions(false);
            setSelectedSuggestion({});
            setErrorMessageProductAdd('');
        }
    };

    const handleAddProduct = () => {
        if (selectedBrand.BrandId == '') {
            setErrorMessageProductAdd('Please select the brand.');
        }
        else if (productName == '') {
            setErrorMessageProductAdd('Please enter or choose the product.');
        }
        else if (productDescription == '') {
            setErrorMessageProductAdd('Please enter valid product description.');
        }
        else {
            const qtyforadd = {
                Brand_Name: selectedBrand.Brand_Name,
                BrandId: selectedBrand.BrandId,
                Product_Name: productName,
                ProductId: selectedSuggestion.ProductId == undefined ? 0 : selectedSuggestion.ProductId,
                Product_Description: productDescription,
                QtyRowId: Math.floor(Math.random() * 1000) + 1
            };

            setProductListForAdd([...productListForAdd, qtyforadd]);
            setSelectedBrand({ BrandId: 0, Brand_Name: '' });
            setSelectedSuggestion({});
            setProductName('');
            setProductDescription('');
        }
    };

    const handleDelete = (id) => {
        const updatedData = productListForAdd.filter(item => item.QtyRowId !== id);
        setProductListForAdd(updatedData);
    };

    const [productName, setProductName] = React.useState('');
    const [productSuggestionList, setProductSuggestionList] = React.useState([]);
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [selectedSuggestion, setSelectedSuggestion] = React.useState({});

    React.useEffect(() => {
        const data = {
            LoginToken: localStorage.getItem('auth'),
            BrandId: selectedBrand.BrandId == 0 ? 0 : selectedBrand.BrandId,
            ProductName: productName
        }
        const url = 'https://localhost:44374/api/Product/productSuggestionList';
        axios.post(url, data).then((result) => {
            setProductSuggestionList(result.data.Table);
            if (result.data.Table.length > 0) {
                setShowSuggestions(true);
            } else {
                setShowSuggestions(false);
            }
        })

    }, [productName]);

    const handleChangeProductName = (event) => {
        const inputValue = event.target.value;
        setProductName(inputValue);
        setErrorMessageProductAdd('');
    }

    const handleSuggestionClick = (suggestion) => {
        setProductName(suggestion.Product_Name);
        setSelectedSuggestion(suggestion);
        setProductDescription(suggestion.Product_Description);
        setShowSuggestions(false);
    };

    const [productDescription, setProductDescription] = React.useState('');

    const handleChangeProductDescription = (event) => {
        const inputValue = event.target.value;
        setProductDescription(inputValue);
        setErrorMessageProductAdd('');
    }


    const handleSaveProduct = () => {
        if (productListForAdd.length > 0) {

            var updatedProductList = '';
            productListForAdd.forEach((item, index) => {
                updatedProductList = updatedProductList + '#' + item.BrandId + '#' + item.ProductId + '#' + item.Product_Name + '#' + item.Product_Description + ',';
            });

            const newString = updatedProductList.slice(0, -1);

            const data = {
                LoginToken: localStorage.getItem('auth'),
                UpdatedProductList: newString
            }

            const url = 'https://localhost:44374/api/Product/addProduct';
            axios.post(url, data).then((result) => {
                if (result.data.Table[0].Result == 'Successfull') {
                    setOpenProductAdd(false);
                    setProductListForAdd([]);
                    ProductList();
                    BrandListForFilter();
                    ProductListForFilter(0); 
                }
            })


        }
        else {
            setErrorMessageProductAdd('Please add atleast 1 valid product in the list.');
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


    const [checkedItems, setCheckedItems] = React.useState([]);
    const [removalId, setRemovalId] = React.useState([]);

    const handleCheckboxChange = (event) => {

        setErrorMessage('');
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


    return (
        <div>

            <span >
                <span >
                    <div style={{ display: 'flex' }}>
                        <div><CategoryIcon color="secondary"
                            style={{ fontSize: '30px' }}
                            sx={{ mt: 0.1, mr: 1 }} />
                        </div>
                        <div style={{ fontSize: "23px" }}>Product List</div>
                    </div>
                    <Button variant="contained" color="secondary"
                        sx={{
                            width: '27vh', borderRadius: '30px', float: 'right', mt: -5
                        }}

                        onClick={handleClickOpenProductAdd}
                    >
                        <div style={{ marginRight: '1vh' }}>Add Product</div> <AddShoppingCartIcon />
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
                            <StyledTableCell align="left">Product Description</StyledTableCell>
                            <StyledTableCell align="left"> View </StyledTableCell>
                            <StyledTableCell align="left">Remove</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productList.slice(startIndex, endIndex).map((row) => (
                            <StyledTableRow key={row.ProductId}>
                                <StyledTableCell component="th" scope="row">
                                    {row.Brand_Name}
                                </StyledTableCell>
                                <StyledTableCell align="left">{row.Product_Name}</StyledTableCell>
                                <StyledTableCell align="left">{row.Product_Description}</StyledTableCell>
                                <StyledTableCell align="left">
                                    <Button variant="contained" color="secondary"
                                        sx={{
                                            width: '18vh', height: '3.5vh', borderRadius: '30px',
                                        }}
                                        onClick={() => handleClickOpenProductDetails(row)}
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
                                        onClick={() => handleClickOpenRemoveProduct(row)}
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
                        count={Math.ceil(productList.length / rowsPerPage)} // Total number of pages based on data length and rows per page
                        page={page}
                        onChange={handleChangePage}
                        showFirstButton
                        showLastButton
                    />
                </div>
            </TableContainer>

            {/* Dialog for Product Details */}
            <Dialog
                open={openProductDetails}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
                sx={{ mt: 0, p: 1 }}
            >
                <DialogTitle sx={{ backgroundColor: '#e3e6e5' }}>
                    {"Product Details"}
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
                                    {userProductRowDetails.Brand_Name}
                                </div>
                            </Paper>

                            <Paper sx={{ p: 1, m: 1, width: '55vh', height: '11vh' }} >
                                <div style={{ display: 'flex' }}>
                                    <CategoryIcon style={{ fontSize: '25px', color: '#808080' }} />
                                    <div style={{ fontSize: '15px', color: '#808080', marginLeft: '2%' }}>Product Name</div>
                                </div>
                                <div style={{ float: 'right', fontSize: '15px', color: '#9c27b0' }}>
                                    {userProductRowDetails.Product_Name}
                                </div>
                            </Paper>

                            <Paper sx={{ p: 1, m: 1, width: '55vh', height: '11vh', display: userId.UserId == 3 ? 'none' : '' }} >
                                <div style={{ display: 'flex' }}>
                                    <Inventory2Icon style={{ fontSize: '25px', color: '#808080' }} />
                                    <div style={{ fontSize: '15px', color: '#808080', marginLeft: '2%' }}>Available Stock</div>
                                </div>
                                <div style={{ float: 'right', fontSize: '15px', color: '#9c27b0' }}>
                                    <div style={{ display: userProductStockList.length == 0 ? 'none' : '' }}>
                                        {userProductStockList.map((item, index) => (
                                            <div>
                                                {item.Qty}
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: userProductStockList.length == 0 ? '' : 'none' }}>
                                        No available stock qty
                                    </div>
                                </div>
                            </Paper>
                        </div>
                    </DialogContentText>
                    <div className="datatable" style={{ display: userId.UserId == 3 ? '' : 'none' }}>
                        <table>
                            {/* Table Header */}
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>User Name</th>
                                    <th>Stock / Qty</th>
                                    {/* Add more headers as needed */}
                                </tr>
                            </thead>
                            {/* Table Body - Scrollable */}
                            <tbody>
                                {userProductStockList.map((item, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                                        <td>{item.Product_Name}</td>
                                        <td>{item.User_Name}</td>
                                        <td>{item.Qty}</td>
                                        {/* Render additional cells for other data */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {errorMessageProductDetails.length > 0
                        &&
                        (
                            <div style={{ color: "red", display: userId.UserId == 3 ? '' : 'none', paddingLeft: '1vh' }}>
                                {errorMessageProductDetails}
                            </div>

                        )
                    }
                    <div style={{
                        height: '5vh',
                        marginBottom: '1vh',
                        marginTop: '1vh'
                    }}>

                        <div style={{ float: 'right' }}>
                            <Button
                                onClick={handleClickCloseProductDetails}
                                variant="contained" color="primary"
                                sx={{
                                    ml: 1, width: '12vh', height: '3.5vh', borderRadius: '30px',
                                }}
                            >Okay</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Dialog for Product Details */}
            <Dialog
                open={openProductRemove}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
                sx={{ mt: 0, p: 1 }}
            >
                <DialogTitle sx={{ backgroundColor: '#e3e6e5' }}>
                    {"Product Details"}
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
                                    {userProductRowDetails.Brand_Name}
                                </div>
                            </Paper>

                            <Paper sx={{ p: 1, m: 1, width: '55vh', height: '11vh' }} >
                                <div style={{ display: 'flex' }}>
                                    <CategoryIcon style={{ fontSize: '25px', color: '#808080' }} />
                                    <div style={{ fontSize: '15px', color: '#808080', marginLeft: '2%' }}>Product Name</div>
                                </div>
                                <div style={{ float: 'right', fontSize: '15px', color: '#9c27b0' }}>
                                    {userProductRowDetails.Product_Name}
                                </div>
                            </Paper>

                            <Paper sx={{ p: 1, m: 1, width: '55vh', height: '11vh', display: userId.UserId == 3 ? 'none' : '' }} >
                                <div style={{ display: 'flex' }}>
                                    <Inventory2Icon style={{ fontSize: '25px', color: '#808080' }} />
                                    <div style={{ fontSize: '15px', color: '#808080', marginLeft: '2%' }}>Available Stock</div>
                                </div>
                                <div style={{ float: 'right', fontSize: '15px', color: '#9c27b0' }}>
                                    <div style={{ display: userProductRemoveList.length == 0 ? 'none' : '' }}>
                                        {userProductRemoveList.map((item, index) => (
                                            <div>
                                                {item.Qty}
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: userProductRemoveList.length == 0 ? '' : 'none' }}>
                                        No available stock qty
                                    </div>
                                </div>
                            </Paper>
                        </div>
                    </DialogContentText>
                    <div className="datatable" style={{ display: userId.UserId == 3 ? '' : 'none' }}>
                        <table>
                            {/* Table Header */}
                            <thead>
                                <tr>
                                    <th>Select</th>
                                    <th>User Name</th>
                                    <th>Stock / Qty</th>
                                    {/* Add more headers as needed */}
                                </tr>
                            </thead>
                            {/* Table Body - Scrollable */}
                            <tbody>
                                {userProductRemoveList.map((item, index) => (
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
                                        <td>{item.Qty}</td>
                                        {/* Render additional cells for other data */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {errorMessage.length > 0
                        &&
                        (
                            <div style={{ color: "red", display: userId.UserId == 3 ? '' : 'none', paddingLeft: '1vh' }}>
                                {errorMessage}
                            </div>

                        )
                    }
                    <div style={{
                        height: '5vh',
                        marginBottom: '1vh',
                        marginTop: '1vh'
                    }}>
                        <div style={{ display: userProductRemoveList.length == 0 ? 'none' : '' }}>
                            <div style={{ float: 'right' }}>
                                <Button
                                    onClick={handleClickRemoveProduct}
                                    variant="contained" color="primary"
                                    sx={{
                                        ml: 1, width: '12vh', height: '3.5vh', borderRadius: '30px',
                                    }}
                                >Remove</Button>
                            </div>

                            <div style={{ float: 'right' }}>
                                <Button
                                    onClick={handleClickCloseRemoveProduct}
                                    variant="contained" color="primary"
                                    sx={{
                                        ml: 1, width: '12vh', height: '3.5vh', borderRadius: '30px',
                                    }}
                                >Cancel</Button>
                            </div>
                        </div>
                        <div style={{ float: 'right', display: userProductRemoveList.length == 0 ? '' : 'none' }}>
                            <Button
                                onClick={handleClickCloseRemoveProduct}
                                variant="contained" color="primary"
                                sx={{
                                    ml: 1, width: '12vh', height: '3.5vh', borderRadius: '30px',
                                }}
                            >Okay</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Dialog for Add Product */}
            <Dialog
                open={openProductAdd}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
                sx={{ mt: 0, p: 1 }}
            >
                <DialogTitle sx={{ backgroundColor: '#e3e6e5' }}>
                    {"Add Product"}
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: '#e3e6e5' }}>
                    <DialogContentText id="alert-dialog-slide-description">
                        <div style={{ display: 'flex' }}>
                            <Paper sx={{ p: 1, m: 1, width: '80vh', height: '11vh' }} >
                                <div style={{ display: 'flex' }}>
                                    <FenceIcon style={{ fontSize: '25px', color: '#808080' }} />
                                    <div style={{ fontSize: '15px', color: '#808080', marginLeft: '2%' }}>Brand</div>
                                </div>
                                <div style={{ float: 'right', fontSize: '15px', color: '#9c27b0' }}>
                                    <Select
                                        id="demo-simple-select"
                                        value={selectedBrand.BrandId}
                                        onChange={handleChangeBrandId}
                                        sx={{
                                            width: '30vh', height: '4.5vh',
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

                            <Paper sx={{ p: 1, m: 1, width: '80vh', height: '11vh' }} >
                                <div style={{ display: 'flex' }}>
                                    <CategoryIcon style={{ fontSize: '25px', color: '#808080' }} />
                                    <div style={{ fontSize: '15px', color: '#808080', marginLeft: '2%' }}>Product</div>
                                </div>
                                <div style={{ float: 'right', fontSize: '15px', color: '#9c27b0', position: 'relative' }}>
                                    <input type="text" name="Qty"
                                        value={productName}
                                        onChange={handleChangeProductName}
                                        style={{
                                            color: '#9c27b0',
                                            width: '30vh',
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
                                    {showSuggestions && productSuggestionList.length > 0 && (
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
                                            {productSuggestionList.map((suggestion, index) => (
                                                <li
                                                    key={suggestion.ProductId}
                                                    onClick={() => handleSuggestionClick(suggestion)}
                                                    style={{
                                                        padding: '8px',
                                                        cursor: 'pointer',
                                                        borderBottom: '1px solid #ddd'
                                                    }}
                                                >
                                                    {suggestion.Product_Name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </Paper>

                        </div>

                        <div>
                            <Paper sx={{ p: 1, m: 1, width: '83vh', height: '11vh' }} >
                                <div style={{ display: 'flex' }}>
                                    <CategoryIcon style={{ fontSize: '25px', color: '#808080' }} />
                                    <div style={{ fontSize: '15px', color: '#808080', marginLeft: '2%' }}>Product Description</div>
                                </div>
                                <div style={{ float: 'right', fontSize: '15px', color: '#9c27b0', position: 'relative' }}>
                                    <input type="text"
                                        value={productDescription}
                                        onChange={handleChangeProductDescription}
                                        style={{
                                            color: '#9c27b0',
                                            width: '75vh',
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
                                    onClick={handleAddProduct}
                                    variant="contained" color="secondary"
                                    sx={{
                                        width: '25vh', height: '3.5vh', borderRadius: '30px'
                                    }}
                                >Add to Queue</Button>
                            </div>
                            {errorMessageProductAdd.length > 0
                                &&
                                (
                                    <div style={{ color: "red", width: '35vh', order: 2 }}>
                                        {errorMessageProductAdd}
                                    </div>

                                )
                            }
                            <div style={{ display: 'flex', order: 3 }}>
                                <Button
                                    onClick={handleSaveProduct}
                                    variant="contained" color="secondary"
                                    sx={{
                                        width: '12vh', height: '3.5vh', borderRadius: '30px',
                                    }}
                                >Save</Button>
                                <Button
                                    onClick={handleClickCloseProductAdd}
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
                                    <th>Product Description</th>
                                    <th>Delete</th>
                                    {/* Add more headers as needed */}
                                </tr>
                            </thead>
                            {/* Table Body - Scrollable */}
                            <tbody>
                                {productListForAdd.map((item, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                                        <td>{item.Brand_Name}</td>
                                        <td>{item.Product_Name}</td>
                                        <td>{item.Product_Description}</td>
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