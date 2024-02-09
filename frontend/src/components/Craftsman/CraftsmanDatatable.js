import React, { useState, useEffect } from 'react';
import axios from "axios";
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom'

function CraftsmanDatatable(props) {
    const [productData, setProductData] = useState(null);
    // const [status, setStatus] = useState(null);

    const [isSuccess, setIsSuccess] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    
    const location = useLocation()
    const history = useNavigate();
            
    async function fetchProductHistory() {
        try {
                await axios.post("http://localhost:8080/api/products/getAllProductsById", {
                    userId: props.userId
                })
                .then((response) => {            
                    if (response.status === 200) {   
                        setProductData(response.data.product);
                    // setOrderData(response.data.OrderHistory);                        
                    // console.log(response.data.OrderHistory);                        
                } else {
                    console.error('Error fetching Product Details');
                    setProductData(null);
                }
            });
        } catch (error) {
            console.error('Error fetching Product Data:', error);
            setProductData(null);
        }
    }

    useEffect(() => {

        if (props.isLoggedIn) {
            fetchProductHistory();
        }

    }, [props.isLoggedIn, props.userId]);

    async function changeStatusEvent(id, status){ 

        
                                    
        await axios.post("http://localhost:8080/api/products/updateStatus", {productId: id, status: status })
            .then((response) => { 
                window.scrollTo(0, 0);
                if (response.status === 200) {
                    if (response.data.status === 1) {
                       
                        fetchProductHistory();

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
        
    const columns = [
        {
            name: 'Title',
            selector: (row) => row.title,
            sortable: true,
        },
        {
            name: 'Year',
            selector: (row) => row.year,
            width: "80px"
        },
        {
            name: 'Artist',
            selector: (row) => row.artist,
        },
        {
            name: 'Style',
            selector: (row) => row.style,
        },
        {
            name: 'Image',
            cell: (row) => (
                <img src={`http://localhost:8080/${row.image}`} style={{ width: '140px', height: 'auto' }} alt={ `${row.image}` } />
            ),
            width: "150px",
        },
        {
            name: 'Quantity',
            selector: (row) => row.quantity,
            width: "80px"
        },
        {
            name: 'dimensions',
            selector: (row) => ("h:" + row.dimensions.height + ",w:" + row.dimensions.width + ",d:" + row.dimensions.depth),
            width: "150px"
        },
        {
            name: 'price',
            selector: (row) => row.price,
            width: "80px"
        },
        {
            name: 'Condition',
            selector: (row) => row.condition,
        },
        {      
            name: 'Edit',
            cell: (row) => (
                <>
                    <Link to="/AddUpdateProduct" state={{ type: 'update', productDetails: row }} >Edit</Link>&nbsp;&nbsp;
                    {/* check status of product */}
                    {row.status === true ? (
                        <button className='btn btn-danger' onClick={()=> changeStatusEvent(row._id, false)}>Disable</button>
                    ): (
                        <button className='btn btn-success' onClick={()=> changeStatusEvent(row._id, true)}>Enable</button> 
                    )}
                    
                </>
            ),
        },
    ];
    

    
    return (
      
      <>
          <div className="container">
              
              <h1>Your Products</h1>
              
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
                

                {productData && productData.length > 0 ? (
                    <DataTable columns={columns} data={productData} pagination fixedHeader />                  
                ) : (                      
                    <p>No data available</p>                      
                )}      

            </div>

      </>
  )
}

export default CraftsmanDatatable