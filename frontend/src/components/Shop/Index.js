import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../css/shop.css';

function Index() {
    const [productsList, setProductsList] = useState([]);
    const [conditionList, setConditionList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedConditions, setSelectedConditions] = useState([]);
    const [sortBy, setSortBy] = useState('');
    const [loading, setLoading] = useState(true);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [sharedProductId, setSharedProductId] = useState(null);


    const fetchData = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/products/filterProducts', {
                categories: selectedCategories,
                conditions: selectedConditions,
                sortBy: sortBy,
            });
            setProductsList(response.data.products);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchData();
        fetchConditions();
        fetchCategories();
    }, [selectedCategories, selectedConditions, sortBy]);
    
    const fetchConditions = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/condition/getAllCondition');
            setConditionList(response.data.allCondition);
        } catch (error) {
            console.error('Error fetching condition:', error);
        }   
    };
    
    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/category/getAllCategory');
            setCategoryList(response.data.allCategory);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }   
    };
    
    const handleCategoryChange = (categoryId) => {
        setSelectedCategories(prevSelected => {
            if (prevSelected.includes(categoryId)) {
                return prevSelected.filter(id => id !== categoryId);
            } else {
                return [...prevSelected, categoryId];
            }
        });
    };
    
    const handleConditionChange = (conditionId) => {
        setSelectedConditions(prevSelected => {
            if (prevSelected.includes(conditionId)) {
                return prevSelected.filter(id => id !== conditionId);
            } else {
                return [...prevSelected, conditionId];
            }
        });
    };
    
    const handleSortByChange = (selectedSortBy) => {
        setSortBy(selectedSortBy);
    };
  
      const handleShareButtonClick = (productId) => {
        const shareableLink = `http://localhost:3000/ProductDetails?id=${productId}`;
        navigator.clipboard.writeText(shareableLink);
        setSharedProductId(productId); // Set the shared product ID
        setTimeout(() => {
            setSharedProductId(null); // Reset the shared product ID after some time
        }, 3000); // Reset after 3 seconds
    };

    const categoriesList = categoryList.length > 0 ? (
        categoryList.map(category => (
            <label key={category._id} className='m-1'>
                <input
                    type="checkbox"
                    value={category._id}
                    checked={selectedCategories.includes(category._id)}
                    onChange={() => handleCategoryChange(category._id)}
                />
                {category.categoryName}
            </label>
        ))
    ) : (
        <div></div>
    );

    const conditionsList = conditionList.length > 0 ? (
        conditionList.map(condition => (
            <label key={condition._id} className='m-1'>
                <input
                    type="checkbox"
                    value={condition._id}
                    checked={selectedConditions.includes(condition._id)}
                    onChange={() => handleConditionChange(condition._id)}
                />
                {condition.conditionName}
            </label>
        ))
    ) : (
        <div></div>
    );

    const sortOptions = [
        { value: 'lowToHigh', label: 'Price: Low to High' },
        { value: 'highToLow', label: 'Price: High to Low' },
        { value: 'newest', label: 'Newest' },
    ];

    const sortByDropdown = (
        <select value={sortBy} onChange={e => handleSortByChange(e.target.value)}>
            <option value=''>Select</option>
            {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
    );

    return (
        <>
            <div className="shop-container">
                <div className="filter-menu">
                    <h5>Sort By:</h5>
                    <hr />
                    {sortByDropdown}
                    <br />
                    <br />
                    <hr />
                    <h5>Filter - </h5>
                    <hr />
                    <h6>By Condition:</h6>
                    {conditionsList}
                    <h6>By Categories:</h6>
                    {categoriesList}
                </div>
                <div className="product-list">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        productsList.length > 0 ? (
                            productsList.map(product => (
                                <div key={product._id} className="product-card">
                                    <div className="product-image">
                                        <img src={`http://localhost:8080/${product.image}`} alt={product.title} />
                                    </div>
                                    <div className="product-details">
                                        <h3 className="product-title">{product.title}</h3>
                                        <p> ( By. {product.artist} ) </p>
                                        <p className="product-price">$ {product.price}</p>
                                        <div className="product-actions">
                                            <Link to={`/ProductDetails?id=${product._id}`} className='btn btn-success w-50 m-1'>
                                                View
                                            </Link>
                                            <button
                                                className={`btn ${sharedProductId === product._id ? 'btn-info' : 'btn-secondary'} w-50`}
                                                onClick={() => handleShareButtonClick(product._id)}
                                                disabled={sharedProductId === product._id}
                                            >
                                                {sharedProductId === product._id ? "Copied" : "Share"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No products available.</p>
                        )
                    )}
                </div>
            </div>        
        
        </>
    );
}

export default Index;
