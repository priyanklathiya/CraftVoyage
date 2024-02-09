import React, { useState, useEffect } from 'react';
import axios from "axios";
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';

function CraftsmanDatatable(props) {
    const [productData, setProductData] = useState(null);

        
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
                    <Link>Edit</Link>&nbsp;&nbsp;
                    <Link>Disable</Link>                    
                </>
            ),
        },
    ];
    

    useEffect(() => {
            
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

        if (props.isLoggedIn) {
            fetchProductHistory();
        }

    }, [props.isLoggedIn, props.userId]);

    
  return (
      <>
        <div className="container">
            <h1>Your Products</h1>
            <hr />
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