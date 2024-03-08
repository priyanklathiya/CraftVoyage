import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom'

function AddUpdateBlogs() {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [userId, setUserId] = useState('');
    const location = useLocation()
    const { type, blogDetails } = location.state;
    const history = useNavigate();

    useEffect(() => {
        async function fetchUserSession() {
            try {
                const response = await axios.get("http://localhost:8080/auth/userSession");
                if (response.data) {
                    if (response.data.valid === true) {
                        setUserId(response.data.userId);
                        setIsLoggedIn(true);
                    } else {
                        setIsLoggedIn(false);
                        window.location.href = '/CraftsmanLogin';
                    }
                } else {
                    setIsLoggedIn(false);
                    window.location.href = '/CraftsmanLogin';
                }
            } catch (error) {
                console.error('Error fetching user session:', error);
                setIsLoggedIn(false);
                window.location.href = '/CraftsmanLogin';
            }
        }
        fetchUserSession();
    }, []);
    
    // form use states
    
    const [formErrors, setFormErrors] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFailed, setIsFailed] = useState(false);

    const [image, setImage] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [articleBody, setArticleBody] = useState("");
    const [blogId, setBlogId] = useState("");

    const [successMsg, setSuccessMsg] = useState("");
    // separate state variables to track new image selections on update
    const [newImage, setNewImage] = useState(false);

    useEffect(() => {
        if (type === "update") {

            // Set all the state values based on the product details, including image paths
            setTitle(blogDetails.title);
            setDescription(blogDetails.description);
            setArticleBody(blogDetails.articleBody);
            setBlogId(blogDetails._id);
            setImage(blogDetails.image);

        }        
    }, [type, blogDetails]);
    
    const formRef = useRef();
    

    const HandleSubmitEvent = (e) => {
        e.preventDefault();
        let formErrors = {};


        if (type === "update") {
             formErrors = {
                title: !title,
                description: !description,
                articleBody: !articleBody,
                image: !image && !blogDetails.image && !newImage,
            };
        } else {
            formErrors = {
                title: !title,
                description: !description,
                articleBody: !articleBody,
                image: !image
            };
        }
        
        setIsSuccess(false);
        setIsFailed(false);
        setFormErrors({ ...formErrors });
        if (Object.values(formErrors).some((v) => v)) return;

        const formData = new FormData();

        if (type === "update") { 
            formData.append("title", title);
            formData.append("description", description);
            formData.append("articleBody", articleBody);
            formData.append("userId", userId);
            formData.append("blogId", blogId);

                        
            if (newImage) {
                
                formData.append("newImage", newImage);
                formData.append("image", image);
            } else {
                // Use the original image path if a new image wasn't selected
                formData.append("image", blogDetails.image || "");
            }

            axios.post("http://localhost:8080/api/blogs/updateBlog", formData, { headers: { "Content-Type": "multipart/form-data" } })
                .then((response) => { 
                    window.scrollTo(0, 0);
                    if (response.status === 200) {
                        if (response.data.status === 1) {
                        
                            history("/ViewBlogs");
                        }
                        else {
                            setIsSuccess(false);
                            setIsFailed(true);
                            setSuccessMsg(response.data.msg);
                        }
                    } else {
                        setIsSuccess(false);
                        setIsFailed(true);
                        setSuccessMsg('Something went wrong. Please try again later!');
                    }
            }).catch((err) => { 
                setIsSuccess(false);
                setIsFailed(true);
                setSuccessMsg(err.message);
            })
        } else {
            // add new
            formData.append("title", title);
            formData.append("description", description);
            formData.append("articleBody", articleBody);
            formData.append("userId", userId);
            formData.append("image", image);
            axios.post("http://localhost:8080/api/blogs/addBlog", formData, { headers: { "Content-Type": "multipart/form-data" } })
                .then((response) => {
                    window.scrollTo(0, 0);
                    if (response.status === 200) {
                        if (response.data.status === 1) {
                            setIsSuccess(true);
                            setIsFailed(false);
                            setSuccessMsg(response.data.msg);
                            setTitle("");
                            setDescription("");
                            setArticleBody("");
                            setBlogId("");
                            setImage("");
                            formRef.current.reset();
                        }
                        else {
                            setIsSuccess(false);
                            setIsFailed(true);
                            setSuccessMsg(response.data.msg);
                        }
                    } else {
                        setIsSuccess(false);
                        setIsFailed(true);
                        setSuccessMsg('Something went wrong. Please try again later!');
                    }
                }).catch((err) => {
                    setIsSuccess(false);
                    setIsFailed(true);
                    setSuccessMsg(err.message);
                })
        }
    }


  return (
    <>
          <div className='container mt-5'>
              
              <h1>Add/Update Blogs</h1>
              
              <hr />
              {isSuccess && (                  
                <div className="alert alert-success m-3" role="alert">
                    <b>Success!</b><br /> {successMsg}
                </div>
              )}
              
        
              {isFailed && (                  
                <div className="alert alert-danger m-3" role="alert">
                    <b>Failed!</b><br /> {successMsg}
                </div>
              )}

              <form ref={formRef} onSubmit={HandleSubmitEvent} method="post" encType="multipart/form-data">
                  <div className="form-group col-sm-6 margin-center">
                        <label htmlFor="title">Title: </label><br/>
                        <input type="text"
                            className={`form-control ${formErrors && (formErrors?.title ? "is-invalid" : "is-valid")}`}
                            id="title"
                            name="title"
                            value={title}
                            onChange={(e) => {setTitle(e.currentTarget.value);}}
                            placeholder="Enter title" />
                        <div className="invalid-feedback">Please enter correct title</div>
                  </div>
                  <div className="form-group col-sm-6 margin-center">
                      <label htmlFor="description">Description: </label><br />                      
                      <textarea                          
                      className={`form-control ${formErrors && (formErrors?.description ? "is-invalid" : "is-valid")}`}
                          id="description"
                          name="description"
                          value={description}
                          onChange={(e) => { setDescription(e.currentTarget.value); }}
                          placeholder="Enter Product Description"
                      ></textarea>
                        <div className="invalid-feedback">Please enter correct description</div>
                  </div>

                    <div className="form-group col-sm-6 margin-center">
                      <label htmlFor="articleBody">Article Body: </label><br />                      
                      <textarea                          
                      className={`form-control ${formErrors && (formErrors?.articleBody ? "is-invalid" : "is-valid")}`}
                          id="articleBody"
                          name="articleBody"
                          value={articleBody}
                          onChange={(e) => { setArticleBody(e.currentTarget.value); }}
                          placeholder="Enter Article Body"
                      ></textarea>
                        <div className="invalid-feedback">Please enter article body</div>
                  </div>
                    <div className="form-group col-sm-6 margin-center">
                        <label htmlFor="image">Image </label><br/>
                        <input type="file"
                            className={`form-control ${formErrors && (formErrors?.image ? "is-invalid" : "is-valid")}`}
                            id="image"
                            name="image"
                            onChange={(e) => {
                              setImage(e.currentTarget.files[0]);
                                if (type === "update") {
                                    setNewImage(true);
                                }
                          }}
                          placeholder="Select an image" />
                        <div className="invalid-feedback">Please select image</div>
                  </div>
                  
                  {type === "update" && (
                      
                      <img src={`http://localhost:8080/${blogDetails.image}`} style={{ width: '200px', height: 'auto' }}  alt={`${blogDetails.image}`} />
                      
                  )}

                  <div className='col-sm-6 margin-center'>
                    <button type="submit" className="btn btn-primary mt-2 mb-4">Submit</button>
                  </div>

              </form>

          </div>
          
          
    </>
  )
}

export default AddUpdateBlogs