var express    = require("express"),
    app        = express(),
    bodyparser = require("body-parser"),
    mongoose   = require("mongoose"),
    comment    = require("./models/comment"),
    campground = require("./models/campground"),
    seeddb     =require("./seed")


mongoose.connect("mongodb://localhost:27017/yelpcamp_v5", { useNewUrlParser: true });
app.use(bodyparser.urlencoded({extended: true}));

app.use(express.static(__dirname + "/public"));
app.set("view engine","ejs");
seeddb();



// campground.create({
//     name: "camp2",
//     image:"https://s3-media4.fl.yelpcdn.com/bphoto/PDQMnVPDK1QfQfZjwYI9eQ/ls.jpg",
//     description: "ye hai description .. chalo ab gand marao"
    
// },function(err,cats){
//     if(err){
//         console.log("error hai");
//         console.log(err);
//     }else{
//         console.log("newly created campground");
//         console.log(cats);

//     }
// })

// campground.find({},function(err,camps){
//     if(err){
//         console.log("error hai");
//         console.log(err);
//     }else{
//         console.log("all campgrounds");
//         console.log(camps);

//     }
// });

// var campgrounds = [
//     {name: "camp1", image:"https://s3-media4.fl.yelpcdn.com/bphoto/vfiVtX9r8kkK8aS-wAEgIg/ls.jpg"},
//     {name: "camp2", image:"https://s3-media4.fl.yelpcdn.com/bphoto/PDQMnVPDK1QfQfZjwYI9eQ/ls.jpg"},
//     {name: "camp3", image:"https://s3-media3.fl.yelpcdn.com/bphoto/4rFTNElcBfCYE2szMpR3bA/ls.jpg"},   
//     {name: "camp4", image:"https://s3-media3.fl.yelpcdn.com/bphoto/4rFTNElcBfCYE2szMpR3bA/ls.jpg"}, 
//     {name: "camp5", image:"https://s3-media3.fl.yelpcdn.com/bphoto/4rFTNElcBfCYE2szMpR3bA/ls.jpg"},
//     {name: "camp7", image:"https://s3-media4.fl.yelpcdn.com/bphoto/PDQMnVPDK1QfQfZjwYI9eQ/ls.jpg"},   
//     {name: "camp8", image:"https://s3-media4.fl.yelpcdn.com/bphoto/PDQMnVPDK1QfQfZjwYI9eQ/ls.jpg"}  
// ];


app.get("/",function(req,res)
{
    res.render("landing");
});

app.get("/campgrounds",function(req,res)
{    
    campground.find({},function(err,allcampgrounds){
        if(err){
            console.log("error hai");
            console.log(err);
        }else{
            res.render("campgrounds/index",{campgrounds: allcampgrounds});                
        }
    // res.render("campgrounds",{campgrounds: campgrounds});

    });
});

app.post("/campgrounds",function(req,res)
{
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newcamp = {name:name , image:image, description:desc};
    // campgrounds.push(newcamp);
    //using database
    campground.create(newcamp,function(err,cats){
        if(err){
            console.log("error hai");
            console.log(err);
        }else{
            //redirecting to campgrounds
            res.redirect("/campgrounds");
        }
    })

    // res.redirect("/campgrounds");
});

app.get("/campgrounds/new",function(req,res)
{    
    res.render("campgrounds/new");
});

//SHOW==
// foundcampground is whatever we find with id
app.get("/campgrounds/:id",function(req,res)
{    
    campground.findById(req.params.id).populate("comments").exec(function(err,foundcampground){
        if (err){
            console.log("there is an error");
        }else{
            res.render("campgrounds/show",{campground:foundcampground});

        }
    })
    
});

//===============================================
//COMMENTS ROUTES
//===============================================

app.get("/campgrounds/:id/comments/new",function(req,res){
    //find campground using id
    campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err)
        }else{
            res.render("comments/new",{campground:campground})
        }
    })
})

app.post("/campgrounds/:id/comments",function(req,res){
    campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err)
            res.redirect("/campgrounds")
        }else{
            comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err)
                }else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/'+ campground._id);
                }
                
            })
        }
    })
})

app.listen(3000,function()
{
    console.log("port started")
});