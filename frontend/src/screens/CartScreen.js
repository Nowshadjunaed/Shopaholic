import React, { useEffect } from 'react'
import { Link, useParams, useNavigate , useLocation, useSearchParams, } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../actions/cartActions'

const CartScreen = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    const { search } = useLocation();

    const productId = id
  
    const qty = search ? Number(search.split('=')[1]) : 1
  
    const dispatch = useDispatch()

    useEffect(() => {
        if (productId) {
          dispatch(addToCart(productId, qty))
        }
    }, [dispatch, productId, qty])
    return <div>Cart</div>
}
export default CartScreen