import { Route, Routes } from 'react-router-dom';
import Home from './Components/Pages/Home';
import Users from './Components/Pages/Users';
import Login from './Components/Login/Login';
import Reports from './Components/Pages/Reports';
import Navbar from './Components/Navbar/Navbar';
import ProductStock from './Components/Pages/ProductStock';
import Products from './Components/Pages/Products';
import Brands from './Components/Pages/Brands';

const MenuRoutes = () => {
    return (
        <Routes>
            <Route exact path='/' element={<Login />} />
            <Route element={<Navbar/>}>
                <Route path='/home' element={<Home />} />
                <Route path='/users' element={<Users />} />
                <Route path='/reports' element={<Reports />} />
                <Route path='/productstock' element={<ProductStock />} />
                <Route path='/products' element={<Products />} />
                <Route path='/brands' element={<Brands />} />
            </Route>
        </Routes>
    )
}
export default MenuRoutes;