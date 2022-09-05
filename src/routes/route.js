const express=require("express")
const router=express.Router();
const authorController=require("../Controllers/authorController")
const blogController=require("../Controllers/blogController")


router.post("/authors", authorController.authors)





module.exports = router;
<<<<<<< HEAD

=======
// >>>>>>> 7859239187b5e77100fb047665030c3599f9fb2b
>>>>>>> 52844ad1f374387523adbe380719c32bf24f553e
