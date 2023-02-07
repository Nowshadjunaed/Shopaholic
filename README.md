# Shopaholic

<b>[Project Demo (pdf)](https://docs.google.com/viewer?url=https://raw.githubusercontent.com/Nowshadjunaed/Shopaholic/main/Shopaholic-Demo.pdf)</b>

### <b>Shopaholic is an E-Commerce site with 3 APIs: Ecommerce API, Bank API and Supplier API</b>

<br/>

## Motivation

E-Commerce can save time for both the buyer and supplier, reducing phone calls about availability, specifications, hours of operation or other information easily found on company and product pages.

## Features Implemented

- <b> A Responsive UI for users </b>
- <b> User </b>
  - Authentication
    - Login, Register, Logout
    - Change Password
  - Profile
    - Update Profile
    - Can see his/her order's list
- <b> Product </b>
  - Product of different categories
  - User can review a product
  - Based on the user review, a rating is calculated
  - Search Product
  - Every user can see reviews of a product
- <b> Cart </b>
  - Add product to cart
  - Quantity Select
  - Remove product from cart
- <b> Checkout Order </b>
  - Select shipping address
  - Payment Method [ Bank API ]
  - User can see order summary when placing order
- <b> Order Payment </b>
  - Pay using the selected payment method
  - Ecommerce asks for a secret pin for verifying trasaction
  - An invoice pdf is generated after payment
  - User can view or download the invoice
- <b> Admin </b>
  - Manage User
    - Can see user list
    - Can make a user admin
    - Delete user if he/she violates Shopaholic policy
  - Manage Product
    - Can see product list
    - Can create product by giving product description
    - Can upload product image
    - Can update product details
    - Can manage inventory
    - Delete product
  - Manage Order
    - Can see order list
    - Can see if the user payment is completed or not for a particular order
    - Can see if a particular order is delivered or not
    - Can see order details
    - See the payment details
    - Can pay the supplier through bank API and get transaction id as response
    - Can send order request with transaction id and ordered products to the supplier through the supplier API. Supplier API verify the transaction and delivers the product and sends delivery response to the admin and admin marks the order as delivered.
- <b> E-Commerce API </b>
  - User Routes
    - Authentication
    - Register user
    - Get authenticated profile
    - Update user profile
    - Get all users
    - Get user by id
    - Delete users
  - Proudct Routes
    - Get all products
    - Get product by id
    - Delete product
    - Update product
    - Create product review
  - Order Routes
    - Create Order
    - Get order by id
    - Get all orders
    - Get authenticated user's orders
    - Change payment status of a order
    - Change supplier payment status
    - Change delivery status
- <b>Supplier API</b>
  - User Routes
    - Authentication
    - Register user
    - Get all users
    - Get user by id
    - Get users by bank account
  - Delivery Request Route
    - Handle delivery
- <b>Bank API</b>
  - User Routes
    - Authentication
    - Register user
    - Get all users
    - Get user balance
    - Deposit balance
  - Pyament Routes
    - Pay money
    - Is payment possible
  - Transaction Routes
    - Get all transaction
    - Get transaction by id
    - Verify transaction

## Work Flow

User registers in the website with personal details and bank information. User can see all the products in home screen and add chosen products to the cart. User can place an order and orders summary is visible to the user. Then User has to pay for the order.<br>
User pays the required amount to the E-Commerce through the bank API. Then bank API returns the transaction number. After that an invoice is generated with the order details and user can view or download the invoice.<br>
E-Commerce pays the supplier through the bank API and bank API returns a transaction number. E-Commerce then sends a delivery request to the supplier API with the transaction number and ordered products.
<br>
Supplier verifies the transaction through the bank API. If the transaction is verified, supplier delivers the product to the user and sends the delivery status to the E-Commerce.

## Used Technologies

- Language: JavaScript
- Frontend: React, Redux, HTML, CSS
- Backend: Node.js, Express.js
- Database: MongoDB

## Clone this Project

```
git clone https://github.com/Nowshadjunaed/Shopaholic.git
```

## Run the Project in your Machine

Install Backend Dependecies:

```
npm i
```

Install Frontend Dependecies:

```
cd frontend
npm i
cd ..
cd bankfrontend
npm i
cd ..
```

To Run The Project

```
npm run dev
```

Rename the file named ".env.example" as ".env". Edit the file and assign PORT, PORT_BANK, PORT_SUPPLIER, MONGO_URI, MONGO_URI_BANK, PORT_SUPPLIER, JWT_SECRET according to instructions written in this file.  
<br>

## Contributors

- <b>[Omar Faruqe Riyad (2017331042)](https://github.com/riyadomf)</b>
- <b>[Jahedul Alam Junaed (2017331025)](https://github.com/Nowshadjunaed)</b>
