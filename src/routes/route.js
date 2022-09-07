const express=require("express")
const router=express.Router();
const authorController=require("../Controllers/authorController")
const blogController=require("../Controllers/blogController")

// ________________________________Author Api_________________________________
router.post("/authors", authorController.authors)

// ________________________________Blogs Api_________________________________
router.post("/blogs", blogController.createBlog)

router.get("/blogs", blogController.getBlog)

router.put("/blogs/:blogId", blogController.updateBlog)

router.delete("/blogs/:blogId", blogController.deleteBlogByPathParams)

router.delete("/blogs", blogController.deletedBlogByQueryParam)


module.exports = router;


