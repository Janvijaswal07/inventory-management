import React from "react";
import Card from "../../card/Card";
import "./ProductForm.scss";

const ProductForm = ({
  product,
  productImage,
  imagePreview,
  description,
  setDescription,
  handleInputChange,
  handleImageChange,
  saveProduct,
}) => {
  return (
    <div className="add-product">
      <Card cardClass={"card"}>
        <form onSubmit={saveProduct}>
          <Card cardClass={"group"}>
            <label>Product Image</label>
            <code className="--color-dark">
              Supported Formats: jpg, jpeg, png
            </code>
            <input
              type="file"
              name="image"
              onChange={(e) => handleImageChange(e)}
            />

            {imagePreview != null ? (
              <div className="image-preview">
                <img src={imagePreview} alt="product" />
              </div>
            ) : (
              <p>No image set for this product.</p>
            )}
          </Card>
          <label>Product Name:</label>
          <input
            type="text"
            placeholder="Product name"
            name="name"
            value={product?.name}
            onChange={handleInputChange}
          />

          <label>Product Category:</label>
          <input
            type="text"
            placeholder="Product Category"
            name="category"
            value={product?.category}
            onChange={handleInputChange}
          />

          <label>Product Price:</label>
          <input
            type="text"
            placeholder="Product Price"
            name="price"
            value={product?.price}  
            onChange={handleInputChange}
          />

          <label>Product Quantity:</label>
          <input
            type="text"
            placeholder="Product Quantity"
            name="quantity"
            value={product?.quantity}
            onChange={handleInputChange}
          />

          <label>Product Description:</label>
          <textarea
            placeholder="Enter product description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="product-description"
          />

          <div className="--my">
            <button type="submit" className="--btn --btn-primary">
              Save Product
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProductForm;
