const express=require("express")
const router=express.Router();
const authorController=require("../Controllers/authorController")
const blogController=require("../Controllers/blogController")




router.post("/authors",authorController.authors)











module.exports = router;
>>>>>>> 7859239187b5e77100fb047665030c3599f9fb2b
