"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { toast } from "react-toastify";
import { FaRegHeart } from "react-icons/fa";
import { GiTireIronCross } from "react-icons/gi";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

export default function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [flavor, setFlavor] = useState("");
  const [favoriteProducts, setFavoriteProducts] = useState(new Set());
  const [liked, setLiked] = useState(false);

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

  // Handle open modal
  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // Handle close modal
  const handleCloseModal = (e) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
      setQuantity(1); // Reset quantity to default
      setFlavor("");  // Reset flavor to default
    }
  };

  // Handle Add to Cart
  const handleAddToCart = () => {
    // Logic to add to cart (store it in session, state, or database)
    toast.success(`${selectedProduct.name} added to cart`);
    handleCloseModal();
  };

  // Handle favorite
  const handleFavorite = (productId) => {
    const updatedFavorites = new Set(favoriteProducts);
    if (updatedFavorites.has(productId)) {
      updatedFavorites.delete(productId);
      toast.success("Removed from favorites");
    } else {
      updatedFavorites.add(productId);
      toast.success("Added to favorites");
    }
    setFavoriteProducts(updatedFavorites);
  };

  return (
    <div className="p-6 px-15 bg-gradient-to-br from-white via-blue-300 to-white min-h-screen">
      <h1 className="text-3xl font-bold text-center text-teal-400 mb-8">Our Products</h1>
      {loading ? (
        <p className="text-center text-gray-700">Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-gray-50 shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-all duration-300"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
                <button
                  onClick={() => setLiked(!liked)}
                  className="absolute top-2 right-2 text-red-400  hover:text-red-600"
                >        
             {liked ? <AiFillHeart className="text-red-500 text-3xl" /> : <AiOutlineHeart className="text-red-500 text-3xl" />}
   
                </button>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 truncate">{product.name}</h2>
                <p className="text-gray-600 text-sm truncate">{product.category}</p>
                <p className="text-teal-500 font-bold mt-2">रु {product.price}</p>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleOpenModal(product)}
                    className="bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-600 transition-all duration-200"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleOpenModal(product)}
                    className="bg-blue-900 text-white px-4 py-2 rounded-full hover:bg-blue-500 transition-all duration-200"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && selectedProduct && (
        <div
          className="fixed inset-0 bg-black/60 flex justify-center items-center  z-50 text-gray-700"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-8 w-3/4 md:w-7/12"
            onClick={(e) => e.stopPropagation()} // Prevent closing modal on clicking inside
          >
            <div className="flex flex-col sm:flex-row">
              <div className="relative w-full sm:w-1/2">
                <Image
                  src={selectedProduct.image_url}
                  alt={selectedProduct.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <div className="w-full sm:w-1/2 sm:pl-6 mt-6 sm:mt-0 relative">
             <div className="absolute top-[-15] right-[-20] cursor-pointer  rounded-full py-2 px-4 hover:bg-gray-600/60 hover:text-white text-2xl" onClick={handleCloseModal}>X</div>
                <h2 className="text-2xl font-semibold text-gray-800">{selectedProduct.name}</h2>
                <p className="text-sm text-gray-500 mt-2">{selectedProduct.description}</p>

                <div className="mt-4">
                  <label htmlFor="flavor" className="block text-sm text-gray-700 mb-3 font-semibold">Select Flavor </label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {["chocolate", "vanilla", "strawberry"].map((flav) => (
                      <button
                        key={flav}
                        onClick={() => setFlavor(flav)}
                        className={`p-3 font-semibold w-25 hover:bg-teal-500 hover:border-white hover:text-white cursor-pointer  duration-200 text-sm  border ${flavor === flav ? 'bg-teal-500 text-white' : 'bg-white text-teal-500'} border-amber-400 rounded-full`}
                      >
                        {flav.charAt(0).toUpperCase() + flav.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
                  <label htmlFor="quantity" className="block text-sm text-gray-700 font-semibold">Quantity :</label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setQuantity(quantity - 1 > 0 ? quantity - 1 : 1)}
                      className="text-xl border border-gray-300 rounded-l-md px-4 py-2"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      readOnly
                      className="w-12 text-center border-t border-b border-gray-300"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-xl border border-gray-300 rounded-r-md px-4 py-2"
                    >
                      +
                    </button>
                  </div>
                </div>

                <p className="text-xl text-teal-500 font-bold mt-4">
                  Total: रु {(selectedProduct.price * quantity).toFixed(2)}
                </p>

                <div className="flex justify-center lg:justify-between items-center mt-6">
                  <button
                    onClick={handleCloseModal}
                    className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition-all duration-200 hidden lg:block"
                  >
                    Close
                  </button>
                  <button
                    // onClick={handleAddToCart}
                    onClick={handleCloseModal}
                    className="bg-teal-500 text-white px-6 py-2 rounded-full hover:bg-teal-600 transition-all duration-200"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
