const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");

//Used for encryption and decryption of passwords
const bcrypt = require("bcrypt");
//This helps us with the cookie
const jwt = require("jsonwebtoken");

const jwtsecret = process.env.JWT_SECRET;

//Requiring the admin.ejs layout (Doubtful line)
const adminLayout = "../views/layouts/admin";

//Authorization Middleware so that only admin can see the admin/dashboard.ejs template
const authMiddleWare = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, jwtsecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unautorized" });
  }
};
//Admin login page
router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "admin",
      description: "Simple Blog created with NodeJs , Express and MongoDb",
    };

    res.render("admin/index", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

//Admin-Check login
router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;
    //Fetching the user with the above username
    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: "Invalid Credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid Credentials" });
    }

    //Creating a token
    const token = jwt.sign({ userId: user._id }, jwtsecret);
    res.cookie("token", token, { httpOnly: true });
    //Sends a GET request on the route
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

//Admin Dashboard
router.get("/dashboard", authMiddleWare, async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "Simple Blog created with NodeJs , Express and MongoDb",
    };

    const data = await Post.find();
    res.render("admin/dashboard", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

//Creating new posts
//Gets activated when Add post button on the dashboard is clicked
router.get("/add-post", authMiddleWare, async (req, res) => {
  try {
    const locals = {
      title: "Add Post",
      description: "Simple Blog created with NodeJs , Express and MongoDb",
    };

    const data = await Post.find();
    res.render("admin/add-post", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

//Saving the new post into DB
router.post("/add-post", authMiddleWare, async (req, res) => {
  try {
    console.log(req.body);
    //Creating a new document for Posts Collection
    const newPost = new Post({
      title: req.body.title,
      body: req.body.body,
    });
    //Adding new post into collection
    await Post.create(newPost);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

//Editing the posts
//GET route activated when we click on edit post button
router.get("/edit-post/:id", authMiddleWare, async (req, res) => {
  try {
    const locals = {
      title: "Edit Post",
      description: "Simple Blog created with NodeJs , Express and MongoDb",
    };

    const data = await Post.findOne({ _id: req.params.id });
    //Edit form is rendered along with the data of the post
    res.render("admin/edit-post", {
      data,
      layout: adminLayout,
      locals,
    });
  } catch (error) {
    console.log(error);
  }
});

//Inserting the updated post into DB
router.put("/edit-post/:id", authMiddleWare, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now(),
    });
    res.redirect(`/edit-post/${req.params.id}`);
  } catch (error) {
    console.log(error);
  }
});

//Deleting the posts
router.delete("/delete-post/:id", authMiddleWare, async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

//Admin Logout
router.get("/logout", (req, res) => {
  res.clearCookie("token"); //token is the name of the cookie
  // res.json({ message: "Logout Successful" });
  res.redirect("/");
});

//Admin-Register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    // console.log(username+" "+password);
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await User.create({ username, password: hashedPassword });
      res.status(201).json({ message: "User Created", user });
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ message: "User already in use" });
      }

      res.status(500).json({ message: "Internal Server Error" });
    }

    res.render("admin/index", { layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

//Admin-Check login
// router.post('/admin',async(req,res)=>{
//     try{
//         const{username,password}=req.body;
//         console.log(username+" "+password);

//         if(req.body.username==='admin' && req.body.password===password)
//         {
//             res.send('You are logged in');
//         }
//         else{
//             res.send('Wrong username or password');
//         }
//         res.render('admin/index',{layout:adminLayout});
//     }
//     catch(error)
//     {
//         console.log(error);
//     }
// })
