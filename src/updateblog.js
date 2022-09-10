

const updateBlog = async function (req, res) {

    try {
        let blogId = req.params.blogId
        let data = req.body;
        let(title, body, tags, category, subcategory, isDeleted, deletedAt, isPublished, publishedAt) = req.body

        //check blogid is present or not in params
        if (!blogId) {
            return res.status(400).send({ status: false, msg: "blogId is not correct" });
        }

        //check authorId is valid or not
        if (isValidObjectId(blogId)) {
            return res.status(400).send({ status: false, msg: "Enter a valid Object Id" });
        }

        //check id is present in DB or not
        let blog = await blogModel.findById(blogId)
        if (!blog) return res.status(400).send({ status: false, msg: "No blog exists" });

        // //finding the data is delted or not
        if (findBlogId.isDeleted)
            return res.status(404).send({ status: false, msg: "No blog founds or has been already deleted" });

        
        // if data value is empty
        if (Object.keys(data).length == 0){
            return res.status(400).send({ status: false, msg: "data is requierd to update" });
        }
  
        // check if tags are present then push new tags
        if("tags" in data){
            if(!(Array.isArray(data.tags))){
                data.tags = data.tags.split()
            }
            data.tags.map((data)=> blog.tags.push(data))
            data.tags = blog.tags
        }

        // check is the subcatgery is present and push to new subcategory
        if("subcategory" in data){
            if(!(Array.isArray(data.subcategory))){
                data.subcategory = data.subcategory.split()
            }
            data.subcategory.map((data)=> blog.subcategory.push(data))
            data.subcategory = blog.subcategory
        }

        //check ispublised is true
        if(data.isPublished == true){
            data.publishedAt = new Date()
        }

        let updateData = await blogModel.findByIdAndUpdate(blogId, data, {isDeleted:true, new:true})
        return res.status(400).send({ status: true,  data: updateData });
    }
    catch (err) {
        res.status(500).send({ status: false, Error: err.message });
      }
}