const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { type } = require("os");

app.use(express.json());
app.use(cors());

//Database Connection with MongoDB
mongoose.connect("mongodb+srv://mevini:mevinisilva123@cluster0.3vgkh6b.mongodb.net/ecommerceDB?retryWrites=true&w=majority&appName=Cluster0/e-commerce") 


//API Creation

app.get("/",(req,res)=>{
    res.send("Express App is Running")

})


//image storage
const storage = multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
})

const upload = multer({storage:storage})

// creating upload endpoint for images
app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

// Scema fro creating product
const Product = mongoose.model("Product",{
    id:{
        type: Number,
        required:true,
    },
    name:{
        type: String,
        required:true,

    },
    image:{
        type: String,
        required:true,
    },
    category:{
        type: String,
        required:true,
    },
    new_price:{
        type: Number,
        required:true,
    },
    old_price:{
        type: Number,
        required:true,
    },
    date:{
        type: Date,
        default:Date.now,
    },
    available:{
        type: Boolean,
        default:true,
    }

})

app.post('/addproduct', async (req, res) => {
  try {
    // Find all existing products to generate a new ID
    const products = await Product.find({});
    let id;

    if (products.length > 0) {
      const lastProduct = products.slice(-1)[0];
      id = lastProduct.id + 1;
    } else {
      id = 1;
    }

    // Create the product
    const product = new Product({
      id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
    });

    await product.save();
    console.log("Product saved:", product);

    // Send JSON response
    res.json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});




//creating middleware to fetch user
const fetchUser = async (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"Please authenticate using valid token"})
    }
    else{
        try{
            const data = jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();

        }catch(error){
            res.status(401).send({errors:"Please authenticate using valid token"})

        }
    }

}




// creating api for deleting product

app.post('/removeproduct',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })

})


//Creating api for getting all products
app.get('/allproducts',async (req,res)=>{
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
})


//schema creating for user model
const Users = mongoose.model('Users',{
    name:{
        type:String,    
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})



// Add this after the Users schema

const Order = mongoose.model('Order', {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  items: [{
    productId: Number,
    name: String,
    quantity: Number,
    price: Number,
    total: Number
  }],
  subtotal: Number,
  total: Number,
  orderDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Pending', 'Payment Uploaded', 'Verified', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  receiptUrl: String,
  customerName: String,
  customerEmail: String
});
// Add these endpoints

const PDFDocument = require('pdfkit');
const fs = require('fs');

// Create Order and Generate Invoice
/*app.post('/createorder', fetchUser, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { items, subtotal, total } = req.body;

    // Create order
    const order = new Order({
      userId: user._id,
      items,
      subtotal,
      total,
      customerName: user.name,
      customerEmail: user.email,
      status: 'Pending'
    });

    await order.save();

    // Generate PDF Invoice
    const doc = new PDFDocument();
    const invoicePath = `./upload/invoices/invoice_${order._id}.pdf`;

    // Create invoices directory if it doesn't exist
    if (!fs.existsSync('./upload/invoices')) {
      fs.mkdirSync('./upload/invoices', { recursive: true });
    }

    doc.pipe(fs.createWriteStream(invoicePath));

    // Add content to PDF
    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Order ID: ${order._id}`);
    doc.text(`Customer: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    doc.text('Items:', { underline: true });
    items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.name} x ${item.quantity} = $${item.total}`);
    });

    doc.moveDown();
    doc.text(`Subtotal: $${subtotal}`);
    doc.text(`Total: $${total}`, { bold: true });

    doc.end();

    res.json({ success: true, orderId: order._id });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});*/// ✅ Create Order and Generate One-Page Invoice
app.post('/createorder', fetchUser, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { items, subtotal, total } = req.body;

    // Create order in DB
    const order = new Order({
      userId: user._id,
      items,
      subtotal,
      total,
      customerName: user.name,
      customerEmail: user.email,
      status: 'Pending'
    });

    await order.save();

    // ✅ Create compact, single-page PDF
    const doc = new PDFDocument({
      margin: 50,
      size: 'A4'
    });
    const invoicePath = `./upload/invoices/invoice_${order._id}.pdf`;

    // Create directory if not exists
    if (!fs.existsSync('./upload/invoices')) {
      fs.mkdirSync('./upload/invoices', { recursive: true });
    }

    const stream = fs.createWriteStream(invoicePath);
    doc.pipe(stream);

    // 🔹 HEADER
    doc
      .fontSize(26)
      .font('Helvetica-Bold')
      .fillColor('#FF5A5A')
      .text('STREETSOUL', 50, 50);

    doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor('#666')
      .text('StreetSoul building | 123 Kalutara South', 50, 80)
      .text('Phone: +1 234 567 8900 | mail@streetsoul.com', 50, 93);

    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .fillColor('#333')
      .text('INVOICE', 400, 50, { align: 'right' });

    // Divider line
    doc
      .strokeColor('#ddd')
      .lineWidth(1)
      .moveTo(50, 115)
      .lineTo(550, 115)
      .stroke();

    // 🔹 INVOICE INFO
    let y = 130;

    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#333')
      .text('Invoice Number:', 50, y)
      .font('Helvetica')
      .fillColor('#666')
      .text(` ${order._id.toString().slice(-8).toUpperCase()}`, 140, y);

    y += 12;
    doc
      .font('Helvetica-Bold')
      .fillColor('#333')
      .text('Invoice Date:', 50, y)
      .font('Helvetica')
      .fillColor('#666')
      .text(new Date().toLocaleDateString(), 140, y);

    y += 12;
    doc
      .font('Helvetica-Bold')
      .fillColor('#333')
      .text('Order ID:', 50, y)
      .font('Helvetica')
      .fillColor('#666')
      .text(order._id.toString(), 140, y);

    // 🔹 CUSTOMER INFO
    y = 130;
    doc
      .font('Helvetica-Bold')
      .fillColor('#333')
      .text('Bill To:', 350, y);
    y += 15;
    doc
      .font('Helvetica-Bold')
      .text(user.name, 350, y);
    y += 12;
    doc
      .font('Helvetica')
      .fillColor('#666')
      .text(user.email, 350, y);

    // 🔹 ITEM TABLE HEADER
    y = 190;
    doc
      .rect(50, y, 500, 20)
      .fillAndStroke('#FF5A5A', '#FF5A5A');

    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#FFF')
      .text('Item', 60, y + 5)
      .text('Qty', 310, y + 5)
      .text('Price', 370, y + 5)
      .text('Total', 460, y + 5);

    y += 25;

    // 🔹 ITEMS
    items.forEach((item, index) => {
      if (y > 550) return; // stop to keep 1 page only
      const bg = index % 2 === 0 ? '#FAFAFA' : '#FFF';
      doc.rect(50, y - 3, 500, 20).fill(bg);
      doc
        .fontSize(10)
        .fillColor('#333')
        .text(item.name, 60, y)
        .text(item.quantity.toString(), 310, y)
        .text(`Rs ${item.price.toFixed(2)}`, 370, y)
        .text(`Rs ${item.total.toFixed(2)}`, 460, y);
      y += 20;
    });

    // 🔹 TOTALS
    y += 10;
    doc
      .strokeColor('#ddd')
      .moveTo(350, y)
      .lineTo(550, y)
      .stroke();

    y += 10;
    doc
      .font('Helvetica')
      .fillColor('#666')
      .text('Subtotal:', 370, y)
      .font('Helvetica-Bold')
      .fillColor('#333')
      .text(`Rs ${subtotal.toFixed(2)}`, 470, y);

    y += 15;
    doc
      .font('Helvetica')
      .fillColor('#666')
      .text('Shipping:', 370, y)
      .font('Helvetica-Bold')
      .fillColor('#333')
      .text('FREE', 470, y);

    y += 15;
    doc
      .rect(370, y, 180, 25)
      .fillAndStroke('#FFE5E5', '#FFE5E5');
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('#FF5A5A')
      .text('TOTAL', 380, y + 7)
      .text(`Rs ${total.toFixed(2)}`, 470, y + 7);

    // 🔹 THANK YOU FOOTER
    doc
      .fontSize(10)
      .font('Helvetica-Oblique')
      .fillColor('#999')
      .text('Thank you for shopping with StreetSoul!', 50, 740, {
        align: 'center',
        width: 500
      });

    doc.end();

    stream.on('finish', () => {
      res.json({ success: true, orderId: order._id });
    });

    stream.on('error', (err) => {
      console.error('Invoice generation error:', err);
      res.status(500).json({ success: false, message: 'Failed to generate invoice' });
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});






// Download Invoice
app.get('/invoice/:orderId', async (req, res) => {
  try {
    const invoicePath = `./upload/invoices/invoice_${req.params.orderId}.pdf`;
    
    if (fs.existsSync(invoicePath)) {
      res.download(invoicePath);
    } else {
      res.status(404).json({ success: false, message: 'Invoice not found' });
    }
  } catch (error) {
    console.error('Error downloading invoice:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
// Add multer configuration for receipt uploads

const receiptStorage = multer.diskStorage({
  destination: './upload/receipts',
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const receiptUpload = multer({ storage: receiptStorage });

// Create receipts directory
if (!fs.existsSync('./upload/receipts')) {
  fs.mkdirSync('./upload/receipts', { recursive: true });
}

// Upload Receipt
app.post('/uploadreceipt', fetchUser, receiptUpload.single('receipt'), async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if order belongs to the user
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    order.receiptUrl = `http://localhost:${port}/receipts/${req.file.filename}`;
    order.status = 'Payment Uploaded';
    await order.save();

    res.json({ success: true, message: 'Receipt uploaded successfully' });
  } catch (error) {
    console.error('Error uploading receipt:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Serve receipt files
app.use('/receipts', express.static('upload/receipts'));

// Get all orders (for admin)
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ orderDate: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update order status
app.put('/orders/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});









//creating endpoint for registering user
app.post('/signup',async(req,res)=>{

    let check = await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"existing user found with same email address"})
    }
    let cart ={};
    for(let i=0;i<300;i++){
        cart[i]=0;
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })

    await user.save();

    const data ={
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data,'sercret_ecom');
    res.json({success:true,token})
})



//creating endpoint for login user
app.post('/login',async(req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if (passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"Wrong Password"});
        }
    }
    else{
        res.json({success:false,errors:"Wrong Email Id"})
    }
})


//creating endpoint for newcollections data
app.get('/newcollections',async (req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8); 
    console.log("New Collection Fetched");
    res.send(newcollection);

})


//creating endpoint for popular in women section
app.get('/popularinwomen',async(req,res)=>{
    let products =await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    console.log("Popular in women fetched.")
    res.send(popular_in_women);
})



//creating endpoint for adding products in cartdata
app.post('/addtocart',fetchUser,async (req,res)=>{
    console.log("added",req.body.itemId);
   let userData = await Users.findOne({_id:req.user.id});
   userData.cartData[req.body.itemId] +=1;
   await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData}); 
   res.send("Added")

})

//creating endpoint to remove product from cart data
app.post('/removefromcart',fetchUser,async (req,res)=>{
    console.log("removed",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if( userData.cartData[req.body.itemId] >0)
   userData.cartData[req.body.itemId] -=1;
   await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData}); 
   res.send("Removed")
})

//creating endpoint to get cart data

/*addEventListener.post('/getcart',fetchUser,async(req,res)=>{
    console.log("get cart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})*/
app.post('/getcart', fetchUser, async (req, res) => {
  try {
    // Your logic for fetching the cart
    const userId = req.user.id; // Assuming `fetchUser` middleware adds `req.user`
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json(user.cartData);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});





app.listen(port,(error)=>{
    if(!error){
                console.log("Server is Successfully Running,and App is listening on port "+ port)
    }
    else{
        console.log("Error occurred, server can't start", error);
    }

})
