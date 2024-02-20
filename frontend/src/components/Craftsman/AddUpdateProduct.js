import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom'

function AddUpdateProduct() {

    //  check user session 

    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [userId, setUserId] = useState('');
    const location = useLocation()
    const { type, productDetails } = location.state;
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
                        window.location.href = '/CustomerLogin';
                    }
                } else {
                    setIsLoggedIn(false);
                    window.location.href = '/CustomerLogin';
                }
            } catch (error) {
                console.error('Error fetching user session:', error);
                setIsLoggedIn(false);
                window.location.href = '/CustomerLogin';
            }
        }
        fetchUserSession();
    }, []);
    
    // form use states
    
    const [formErrors, setFormErrors] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFailed, setIsFailed] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [year, setYear] = useState("");
    const [artist, setArtist] = useState("");
    const [quantity, setQuantity] = useState("");
    const [image, setImage] = useState("");
    const [height, setHeight] = useState("");
    const [width, setWidth] = useState("");
    const [depth, setDepth] = useState("");
    const [price, setPrice] = useState("");
    const [additionalInformation, setAdditionalInformation] = useState("");
    const [productId, setProductId] = useState("");
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('');
    const [categories, setCategories] = useState([]);
    const [conditions, setConditions] = useState([]);

    const [successMsg, setSuccessMsg] = useState("");
    // separate state variables to track new image selections on update
    const [newImage, setNewImage] = useState(false);

        useEffect(() => {
        // Fetch brand data from your Node.js server using Axios
            axios.get('http://localhost:8080/api/category/getAllCategory') 
            .then((response) => {
                if (response.data) {
                    setCategories(response.data.allCategory);
                }
            })
            .catch((error) => {
                console.error('Error fetching brands: ', error);
            });

            axios.get('http://localhost:8080/api/condition/getAllCondition') 
            .then((response) => {
                if (response.data) {
                    setConditions(response.data.allCondition);
                }
            })
            .catch((error) => {
                console.error('Error fetching brands: ', error);
            });
        
        }, []);
    
    

    useEffect(() => {
        if (type === "update") {

            // Set all the state values based on the product details, including image paths
            setTitle(productDetails.title);
            setDescription(productDetails.description);
            setYear(productDetails.year);
            setArtist(productDetails.artist);
            setQuantity(productDetails.quantity);
            setHeight(productDetails.dimensions.height);
            setWidth(productDetails.dimensions.width);
            setDepth(productDetails.dimensions.depth);
            setPrice(productDetails.price);
            setAdditionalInformation(productDetails.additionalInformation);
            setProductId(productDetails._id);
            setImage(productDetails.image);
            setSelectedCategory(productDetails.categoryId);
            setSelectedCondition(productDetails.conditionId);

        }        
    }, [type, productDetails]);
    
    

    const formRef = useRef();

    const HandleSubmitEvent = (e) => { 
        e.preventDefault();
        let formErrors = {};

        if (type === "update") {                    
            formErrors = {
                title: !title,
                description: !description,
                year: !year,
                artist: !artist,
                quantity: !quantity,
                height: !height,
                width: !width,
                depth: !depth,
                price: !price,
                selectedCategory: !selectedCategory,
                selectedCondition: !selectedCondition,
                image: !image && !productDetails.imagePath.image && !newImage,
            };

        } else {
            formErrors = {
                title: !title,
                description: !description,
                year: !year,
                artist: !artist,
                quantity: !quantity,
                height: !height,
                width: !width,
                depth: !depth,
                price: !price,
                selectedCategory: !selectedCategory,
                selectedCondition: !selectedCondition,
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
            formData.append("year", year);
            formData.append("artist", artist);
            formData.append("quantity", quantity);
            formData.append("height", height);
            formData.append("width", width);
            formData.append("depth", depth);
            formData.append("price", price);
            formData.append("userId", userId);
            formData.append("productId", productId);
            formData.append("categoryId", selectedCategory);
            formData.append("conditionId", selectedCondition);

            
            if (newImage) {
                
                formData.append("newImage", newImage);
                formData.append("image", image);
            } else {
                // Use the original image path if a new image wasn't selected
                formData.append("image", productDetails.image || "");
            }

                                    
        axios.post("http://localhost:8080/api/products/updateProduct", formData, { headers: { "Content-Type": "multipart/form-data" } })
            .then((response) => { 
                window.scrollTo(0, 0);
                if (response.status === 200) {
                    if (response.data.status === 1) {
                       
                        history("/craftsmanDashboard");

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
            formData.append("title", title);
            formData.append("description", description);
            formData.append("year", year);
            formData.append("artist", artist);
            formData.append("quantity", quantity);
            formData.append("image", image);
            formData.append("height", height);
            formData.append("width", width);
            formData.append("depth", depth);
            formData.append("price", price);
            formData.append("userId", userId);
            formData.append("categoryId", selectedCategory);
            formData.append("conditionId", selectedCondition);

            // console.log(formData);
            
            axios.post("http://localhost:8080/api/products/addProduct", formData, { headers: { "Content-Type": "multipart/form-data" } })
                .then((response) => {
                    window.scrollTo(0, 0);
                    if (response.status === 200) {
                        if (response.data.status === 1) {
                            setIsSuccess(true);
                            setIsFailed(false);
                            setSuccessMsg(response.data.msg);
                            setTitle("");
                            setDescription("");
                            setYear("");
                            setArtist("");
                            setQuantity("");
                            setImage("");
                            setHeight("");
                            setWidth("");
                            setDepth("");
                            setPrice("");
                            setSelectedCategory("");
                            setSelectedCondition("");
                            setAdditionalInformation("");
                            formRef.current.reset();


                        }
                        // else if (response.data.status === 1) {
                        //     setIsSuccess(false);
                        //     setIsFailed(true);
                        //     setSuccessMsg("Error: SKU already exists. Please use a different SKU.");
                        // }
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
          <h1>Add/Update Product</h1>
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
              <hr />
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
                        <label htmlFor="year">year: </label><br/>
                        <input type="number"
                            className={`form-control ${formErrors && (formErrors?.year ? "is-invalid" : "is-valid")}`}
                            id="year"
                            name="year"
                            value={year}
                            onChange={(e) => {setYear(e.currentTarget.value);}}
                            placeholder="Enter year" />
                        <div className="invalid-feedback">Please enter correct year in format YYYY.</div>
                  </div>
                  <div className="form-group col-sm-6 margin-center">
                        <label htmlFor="artist">Artist: </label><br/>
                        <input type="text"
                            className={`form-control ${formErrors && (formErrors?.artist ? "is-invalid" : "is-valid")}`}
                            id="artist"
                            name="artist"
                            value={artist}
                            onChange={(e) => {setArtist(e.currentTarget.value);}}
                            placeholder="Enter artist" />
                        <div className="invalid-feedback">Please enter correct artist name</div>
                  </div>



                    <div className="form-group col-sm-6 margin-center">
                        <label htmlFor="categoryId">category :</label><br />
                        <select
                            className={`form-control ${formErrors && (formErrors?.selectedCategory ? "is-invalid" : "is-valid")}`}
                            id="categoryId"
                            name="categoryId"
                            value={selectedCategory}  
                            onChange={(e) => { setSelectedCategory(e.currentTarget.value); }}
                        >
                            <option value="">Select a Category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.categoryName}
                                </option>
                            ))}
                        </select>
                        <div className="invalid-feedback">Please select a valid Category.</div>
                    </div>

                    <div className="form-group col-sm-6 margin-center">
                        <label htmlFor="conditionId">Condition :</label><br />
                        <select
                            className={`form-control ${formErrors && (formErrors?.selectedCondition ? "is-invalid" : "is-valid")}`}
                            id="conditionId"
                            name="conditionId"
                            value={selectedCondition}  
                            onChange={(e) => { setSelectedCondition(e.currentTarget.value); }}
                        >
                            <option value="">Select a Condition</option>
                            {conditions.map((condition) => (
                                <option key={condition._id} value={condition._id}>
                                    {condition.conditionName}
                                </option>
                            ))}
                        </select>
                        <div className="invalid-feedback">Please select a valid Condition.</div>
                    </div>


                  <div className="form-group col-sm-6 margin-center">
                        <label htmlFor="quantity">Quantity: </label><br/>
                        <input type="number"
                            className={`form-control ${formErrors && (formErrors?.quantity ? "is-invalid" : "is-valid")}`}
                            id="quantity"
                            name="quantity"
                            value={quantity}
                            onChange={(e) => {setQuantity(e.currentTarget.value);}}
                            placeholder="Enter quantity" />
                        <div className="invalid-feedback">Please enter correct quantity.</div>
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
                      
                      <img src={`http://localhost:8080/${productDetails.image}`} style={{ width: '200px', height: 'auto' }}  alt={`${productDetails.image}`} />
                      
                  )}
                  
                  <div className="form-group col-sm-6 margin-center">
                      <label htmlFor="height">Height: </label><br />
                        <input type="number"
                          className={`form-control ${formErrors && (formErrors?.height ? "is-invalid" : "is-valid")}`}                          
                          id="height"                          
                          name="height"                          
                          value={height}                          
                          onChange={(e) => { setHeight(e.currentTarget.value); }}                          
                          placeholder="Enter height" />                      
                      <div className="invalid-feedback">Please enter correct height</div>                      
                  </div>
                  <div className="form-group col-sm-6 margin-center">
                      <label htmlFor="width">Width: </label><br />
                        <input type="number"
                          className={`form-control ${formErrors && (formErrors?.width ? "is-invalid" : "is-valid")}`}                          
                          id="width"                          
                          name="width"                          
                          value={width}                          
                          onChange={(e) => { setWidth(e.currentTarget.value); }}                          
                          placeholder="Enter width" />                      
                      <div className="invalid-feedback">Please enter correct width</div>                      
                  </div>
                  <div className="form-group col-sm-6 margin-center">
                      <label htmlFor="depth">Depth: </label><br />
                        <input type="number"
                          className={`form-control ${formErrors && (formErrors?.depth ? "is-invalid" : "is-valid")}`}                          
                          id="depth"                          
                          name="depth"                          
                          value={depth}                          
                          onChange={(e) => { setDepth(e.currentTarget.value); }}                          
                          placeholder="Enter depth" />                      
                      <div className="invalid-feedback">Please enter correct depth</div>                      
                  </div>
                  <div className="form-group col-sm-6 margin-center">
                      <label htmlFor="price">Price: </label><br />
                        <input type="number"
                          className={`form-control ${formErrors && (formErrors?.price ? "is-invalid" : "is-valid")}`}                          
                          id="price"                          
                          name="price"                          
                          value={price}                          
                          onChange={(e) => { setPrice(e.currentTarget.value); }}                          
                          placeholder="Enter price" />                      
                      <div className="invalid-feedback">Please enter correct price</div>                      
                  </div>
                  {/* <div className="form-group col-sm-6 margin-center">
                        <label htmlFor="condition">Condition: </label><br/>
                        <input type="text"
                            className={`form-control ${formErrors && (formErrors?.condition ? "is-invalid" : "is-valid")}`}
                            id="condition"
                            name="condition"
                            value={condition}
                            onChange={(e) => {setCondition(e.currentTarget.value);}}
                            placeholder="Enter condition" />
                        <div className="invalid-feedback">Please enter correct condition</div>
                  </div> */}
                  <div className="form-group col-sm-6 margin-center">
                      <label htmlFor="additionalInformation">Additional Information: </label><br />                      
                      <textarea                          
                      className={`form-control ${formErrors && (formErrors?.additionalInformation ? "is-invalid" : "is-valid")}`}
                          id="additionalInformation"
                          name="additionalInformation"
                          value={additionalInformation}
                          onChange={(e) => { setAdditionalInformation(e.currentTarget.value); }}
                          placeholder="Enter Additional Description"
                      ></textarea>
                        <div className="invalid-feedback">Please enter correct additional Information</div>
                  </div>
                  <div className='col-sm-6 margin-center'>
                    <button type="submit" className="btn btn-primary mt-2 mb-4">Submit</button>
                  </div>
              </form>
          </div>
      </>
  )
}

export default AddUpdateProduct