
import express from "express";
import easyinvoice from 'easyinvoice';
const router = express.Router();
import fs from 'fs'





router.post("/", async (req, res) => {

    const { orderlist } = req.body;
    console.log(orderlist)
    console.log("invoice route: " + orderlist?.totalPrice)
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };
    let orderItems = []

    orderlist.orderItems.forEach ( (orderItem) => 
        {
            console.log('loop orderItems:')
            console.log(orderItem)
            
            const product = {
                'quantity': orderItem.qty,
                'description': orderItem.name,
                'tax-rate': 15,
                'price': orderItem.price

            }
            console.log('invoice er shomoy product: ')
            console.log(product)
            orderItems.push(product)
        }
    )
    console.log('Order Items print hobe shob:')
    console.log(orderItems)
    

    var data = {
        "images": {
            "background": "https://public.easyinvoice.cloud/pdf/sample-background.pdf"
        },
        "sender": {
            "company": "Shopaholic",
            "address": "Akhalia, Surma",
            "zip": "3100",
            "city": "Sylhet",
            "country": "Bangladesh"
        },
        "client": {
            "company": orderlist.user.name,
            "address": orderlist.user.email,
            "zip": orderlist.shippingAddress.postalCode,
            "city": orderlist.shippingAddress.city,
            "country": orderlist.shippingAddress.country
        },
        "information": {
            "number": orderlist.paymentResult.id,
            "date": orderlist.paymentResult.update_time.substring(0, 10),
            "due-date": orderlist.paymentResult.update_time.substring(0,10)
        },
        "products": orderItems,
        "bottom-notice": "Thank you for your order. Stay connected with Shopaholic",
        "settings": {
            "currency": "USD",
            "tax-notation": "vat",
            "margin-top": 50,
            "margin-right": 50,
            "margin-left": 50,
            "margin-bottom": 25
        }
    }
    
    const result = await easyinvoice.createInvoice(data);
    await fs.writeFileSync("frontend/public/invoices/"+orderlist._id+".pdf", result.pdf, 'base64');
    res.json({ message: "invoice325.pdf" });
   
  
});

export default router;
