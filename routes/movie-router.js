const express = require('express');
const path = require('path');
let router = express.Router;






router.get("/:title",sendSingleMovie);


router.post("/:title",express.json(),rateMovie);
router.post("/:title",express.json(),reviewMovie);
router.put("/:title",express.json(),editMovie);



function sendSingleMovie(req,res,next){
    res.format({
        "text/html": () => {res.render("pages/product")}
    })
}



module.exports = router;