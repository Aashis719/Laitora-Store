"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase"; 
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddProduct() {
  const [name, setName] = useState("");      
  const [price, setPrice] = useState("");    
  const [category, setCategory] = useState(""); 
  const [description, setDescription] = useState("");  
  const [image, setImage] = useState(null);  
  const [loading, setLoading] = useState(false);  
  const router = useRouter();  

  async function handleAddProduct(e) {
    e.preventDefault();  
    setLoading(true);    

    let imageUrl = "";
    
    if (image) {
      const { data, error } = await supabase.storage
        .from("product-images")  
        .upload(`images/${Date.now()}-${image.name}`, image);  

      if (error) {
        toast.error("Failed to upload image");
        setLoading(false);
        return;
      }

      // ✅ Fixed getPublicUrl
      imageUrl = supabase.storage.from("product-images").getPublicUrl(data.path).data.publicUrl;
    }

    // ✅ Ensure correct table name
    const { data, error } = await supabase
      .from("product_items")  // Use correct table name (update in Supabase if needed)
      .insert([
        { 
          name, 
          price: Number(price), 
          category, 
          description,  
          image_url: imageUrl,   
        },
      ])
      .select(); // Fetch inserted data

    if (error) {
      console.error("Insert Error:", error); // Log error
      toast.error("Failed to add product: " + error.message);
    } else {
      console.log("Inserted Data:", data); // Log success
      toast.success("Product added successfully!");
      router.push("/admin/manage-products");  
    }
    setLoading(false);
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded">
      <h1 className="text-xl font-bold mb-4 text-teal-400">Add Product</h1>
      <form onSubmit={handleAddProduct} className="space-y-4 text-gray-700">
        <input 
          type="text" 
          className='text-gray-700 input' 
          placeholder="Product Name"  
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          type="number" 
          className='text-gray-700 input'  
          placeholder="Price"  
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          className='text-gray-700 input'  
          placeholder="Category"  
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          required 
        />
        <textarea 
          className='text-gray-700 input'  
          placeholder="Description"  
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required 
        />
        <input 
          type="file" 
          className='text-gray-700 input'  
          accept="image/*" 
          onChange={(e) => setImage(e.target.files[0])} 
          required 
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded" 
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
