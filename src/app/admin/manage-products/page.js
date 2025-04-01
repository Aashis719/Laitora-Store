"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";
import Image from "next/image";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null); // Track the product being edited
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // For image URL
  const [isAdding, setIsAdding] = useState(false); // To toggle add product form visibility
  const [isEditMode, setIsEditMode] = useState(false);  // Track whether in edit mode


  // Fetch products from Supabase
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const { data, error } = await supabase.from("product_items").select("*");
      if (error) {
        toast.error("Failed to fetch products");
        console.error("Fetch Error:", error);
      } else {
        setProducts(data);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // Delete a product
  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setLoading(true);
    const { error } = await supabase.from("product_items").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete product");
      console.error("Delete Error:", error);
    } else {
      toast.success("Product deleted successfully");
      setProducts(products.filter((p) => p.id !== id));
    }
    setLoading(false);
  }

  // Start editing a product
  function handleEdit(product) {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
    setCategory(product.category);
    setDescription(product.description);
    setImageUrl(product.image_url);
  }

  // Save edited product
  async function handleSave() {
    const { error } = await supabase
      .from("product_items")
      .update({
        name,
        price,
        category,
        description,
        image_url: imageUrl,
      })
      .eq("id", editingProduct.id);

    if (error) {
      toast.error("Failed to save changes");
      console.error("Update Error:", error);
    } else {
      toast.success("Product updated successfully");
      setProducts(products.map((product) => (product.id === editingProduct.id ? { ...product, name, price, category, description, image_url: imageUrl } : product)));
      setEditingProduct(null); // Exit editing mode
    }
  }

  // Add a new product
  async function handleAdd() {
    const { data, error } = await supabase
      .from("product_items")
      .insert([{ name, price, category, description, image_url: imageUrl }])
      .select(); // Selects and returns the newly inserted data
  
    if (error) {
      toast.error("Failed to add product");
      console.error("Add Error:", error);
    } else {
      toast.success("Product added successfully");
  
      // Ensure the newly added product has a unique `id`
      const newProduct = data[0]; // Supabase returns the inserted item with an id
  
      setProducts([...products, newProduct]);
  
      // Reset form fields
      setIsAdding(false);
      setName("");
      setPrice("");
      setCategory("");
      setDescription("");
      setImageUrl("");
    }
  }
  

  return (
    <div className="p-6 bg-amber-50 text-gray-900 min-h-screen">
      <div className="flex gap-10 justify-between py-2 px-10">
      <h1 className="text-3xl font-bold mb-4 text-lime-600">Manage Products</h1>
    {/* Add Product Button */}
    <button
        onClick={() => {
          setIsAdding(true); // Show the add product form
          // Reset the state values for a clean, empty form
          setName("");
          setPrice("");
          setCategory("");
          setDescription("");
          setImageUrl("");
        }} // Show the add product form
        className="bg-teal-700 text-white px-4 py-2 rounded mb-4 cursor-pointer hover:bg-teal-900 hover:scale-x-105 duration-200 "
      >
        Add New Product
      </button>
      </div>

 {/* Add Product Form */}
 {isAdding && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md w-96 text-gray-700">
            <h2 className="text-xl font-semibold mb-4"
            >Add New Product</h2>
            <input
              type="text"
              className="w-full mb-4 p-2 border rounded"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              className="w-full mb-4 p-2 border rounded"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              type="text"
              className="w-full mb-4 p-2 border rounded"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <textarea
              className="w-full mb-4 p-2 border rounded"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="url"
              className="w-full mb-4 p-2 border rounded"
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <div className="flex justify-between">
            <button
                onClick={() => setIsAdding(false)} // Close the add product form without saving
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Add Product
              </button>
              
            </div>
          </div>
        </div>
      )}


      {loading ? (
        <p>Loading products...</p>
      ) : (
        <ul className="space-y-4 p-10 pt-4 grid grid-cols-4 gap-5">
         {products.length > 0 ? (
  products.map((product) => (
    <li key={product.id} className="border-2 border-amber-600 rounded p-4  flex justify-between flex-col hover:border-amber-900 duration-200">
      <div className="flex items-center">
        {product.image_url && (
          <Image
          src={product.image_url}
          alt={product.name}
          width={64}  // Set the width according to your design
          height={64} // Set the height according to your design
          className="object-cover mr-4"
        />
        )}
        <div>
          <h2 className="text-lg font-semibold">{product.name}</h2>
          <p>${product.price}</p>
          {product.category && <p className="text-sm text-gray-500">Category: {product.category}</p>}
          {product.description && <p className="text-sm text-gray-500">Description: {product.description}</p>}
        </div>
      </div>
      <div className="space-x-2 flex justify-center items-center mt-5">
        <button
          onClick={() => handleEdit(product)}
          className="bg-amber-500 text-white px-4 py-2 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(product.id)}
          className="bg-red-600/90 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
      </div>
    </li>
  ))
) : (
  <p>No products found</p>
)}

        </ul>
      )}

      

     

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900/50 bg-opacity-50 flex items-center justify-center">
          <div className="bg-amber-50 p-6 rounded-md w-96 text-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-lime-600 ">Edit Product</h2>
            <input
              type="text"
              className="w-full mb-4 p-2 border rounded"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}

            />
            <input
              type="number"
              className="w-full mb-4 p-2 border rounded"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              type="text"
              className="w-full mb-4 p-2 border rounded"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <textarea
              className="w-full mb-4 p-2 border rounded"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="url"
              className="w-full mb-4 p-2 border rounded"
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <div className="flex justify-between">
            <button
                onClick={() => setEditingProduct(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
             
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
