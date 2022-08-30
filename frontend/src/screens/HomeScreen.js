import React, { useEffect, useState } from 'react'
import { Col, Row, Card, Button} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts } from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Product from '../components/Product'
import { useParams, useNavigate } from "react-router-dom";

const HomeScreen = () => {
  const { keyword } = useParams();
  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)   // productList is a reducer
  const { loading, error, products } = productList 
  useEffect(() => {
    dispatch(listProducts(keyword))
  }, [dispatch, keyword])

  const navigate = useNavigate();
  
  const categoryOneHandler = () => {
   
    navigate(`/category/?category=Gadget`)

  };
  const categoryTwoHandler = () => {
    navigate(`/category/?category=Furniture`)
   

  };
  const categoryThreeHandler = () => {
    navigate(`/category/?category=Plant`)

  };
  return (
    <>
      <Row style={{
        justifyContent: 'center',
      }}>
      <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src="./images/Gadgets.jpg" />
      <Card.Body>
        <Card.Title>Gadget</Card.Title>
        <Card.Text>
        Gadget Accessories refers to items such as keyboards, mouses, chargers, headphones and hands free devices or any item that You may attach or connect to Your electronic Gadget.
        </Card.Text>
        <Button variant="primary" onClick={categoryOneHandler} >See More</Button>
      </Card.Body>
    </Card>
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src="./images/Furniture.jpg" />
      <Card.Body>
        <Card.Title>Furniture</Card.Title>
        <Card.Text>
        Furniture makes your life easier and provides you with warmth in the house. The presence of furniture gives you an ease of mind towards the utility and styling.
        </Card.Text>
        <Button variant="primary" onClick={categoryTwoHandler}>See More</Button>
      </Card.Body>
    </Card>
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src="./images/Plants.jpg" />
      <Card.Body>
        <Card.Title>Plant</Card.Title>
        <Card.Text>
        Plants are nature’s gift as they are beneficial for us in many ways.They provide us with a variety of things to fulfil our daily requirements, including food to eat, air to breathe etc.
        </Card.Text>
        <Button variant="primary" onClick={categoryThreeHandler}>See More</Button>
      </Card.Body>
    </Card>
      </Row>
      <h1>Latest Products</h1>
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
export default HomeScreen