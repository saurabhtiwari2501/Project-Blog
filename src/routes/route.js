const express=require("express")
const router=express.Router();
const authorController=require("../Controllers/authorController")
const blogController=require("../Controllers/blogController")


router.post("/authors", authorController.authors)
router.post("/blogs", blogController.createBlog)
router.get("/blogs", blogController.getBlog)
router.put("/blogs/:blogId", blogController.updateBlog)
router.delete("/blogs/:blogId", blogController.deleteBlog)
router.delete("/blogs", blogController.deletedBlog)


module.exports = router;


