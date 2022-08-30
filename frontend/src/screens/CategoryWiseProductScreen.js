import React, { useEffect, useState } from 'react'
import { Col, Row, Card, Button} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { listProductsByCategory } from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Product from '../components/Product'

import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { PRODUCT_LIST_By_Category_SUCCESS } from '../constants/productConstants'

const CategoryWiseProductScreen = () => {
    const { search } = useLocation();
    const dispatch = useDispatch()
    const category = search ? search.split('=')[1] : ''
    console.log('here cate', category)
  const productListByCategory = useSelector((state) => state.productListByCategory)   // productList is a reducer
  const { loading, error, products } = productListByCategory


  useEffect(() => {
    console.log('use effect of cat:', category)
    dispatch(listProductsByCategory(category))
  }, [dispatch, category])

  
  return (
    <>
      
      <h1>{category}</h1>
      { loading ? <Loader/> : error ? <Message variant='danger'>{error}</Message> : <Row>
        {products.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
      }
      
    </>
  )
}
export default CategoryWiseProductScreen