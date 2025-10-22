import React from 'react'
import './Admin.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import AddProduct from '../../Components/AddProduct/AddProduct'
import ListProduct from '../../Components/ListProduct/ListProduct'
import Orders from '../../Components/Orders/Orders'
import {Routes,Route} from 'react-router-dom'

const Admin = () => {
  return (
    <div className='admin'>
       <Sidebar />
       <Routes>
        <Route path='/addproduct' element={<AddProduct />} />
        <Route path='/listproduct' element={<ListProduct />} />
          <Route path="/orders" element={<Orders />} />
       </Routes>
      
    </div>
  )
}

export default Admin
