import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


// Create New Product
const createProduct = async (formData) => {
  const response = await axios.post(`${BACKEND_URL}/api/product/createProduct`, formData);
  return response.data;
};
// get all Products
const getProducts = async () => {
  const response = await axios.get(`${BACKEND_URL}/api/product/getProducts`);
  return response.data;
};

// Delete a Product
const deleteProduct = async (id) => {
  const response = await axios.delete(`${BACKEND_URL}/api/product/deleteProduct/${id}`  );
  return response.data;
};
// Get a Product
const getProduct = async (id) => {
  const response = await axios.get(`${BACKEND_URL}/api/product/getSingleProduct/${id}`);
  return response.data;
};
// Update Product
const updateProduct = async (id, formData) => {
  const response = await axios.put(`${BACKEND_URL}/api/product/updateProduct/${id}`, formData);
  return response.data;
};


const productService = {
    createProduct,
    getProducts,
     getProduct,
    deleteProduct,
     updateProduct,
  };
  
  export default productService;