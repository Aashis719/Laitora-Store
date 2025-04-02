"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { toast } from "react-toastify";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [flavor, setFlavor] = useState("");
  const [favoriteProducts, setFavoriteProducts] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

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

  // Load favorite products from local storage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteProducts");
    if (storedFavorites) {
      setFavoriteProducts(new Set(JSON.parse(storedFavorites)));
    }
  }, []);

  // Save favorite products to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("favoriteProducts", JSON.stringify([...favoriteProducts]));
  }, [favoriteProducts]);

  // Load cart items from local storage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Save cart items to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

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
      setFlavor("");   // Reset flavor to default
    }
  };

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (!selectedProduct) return;
    if (!flavor) {
      toast.warning("Please select a flavor");
      return;
    }

    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === selectedProduct.id && item.flavor === flavor
    );

    if (existingItemIndex > -1) {
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += quantity;
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, { ...selectedProduct, quantity, flavor }]);
    }

    toast.success(`${selectedProduct.name} (${flavor}) added to cart`);
    setShowModal(false); // Directly close the modal
    setQuantity(1);
    setFlavor("");
  };

  // Handle favorite toggle for individual products
  const toggleFavorite = (productId) => {
    setFavoriteProducts((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((product) =>
      categoryFilter ? product.category === categoryFilter : true
    )
    .sort((a, b) => {
      if (sortOrder === "low-high") return a.price - b.price;
      if (sortOrder === "high-low") return b.price - a.price;
      return 0;
    });

  const openFavorites = () => {
    setIsFavoritesOpen(true);
  };

  const closeFavorites = () => {
    setIsFavoritesOpen(false);
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const removeFromFavorites = (productId) => {
    setFavoriteProducts((prev) => {
      const newFavorites = new Set(prev);
      newFavorites.delete(productId);
      return newFavorites;
    });
    toast.info("Removed from favorites");
  };

  const removeFromCart = (productId, flavor) => {
    const updatedCart = cartItems.filter(
      (item) => !(item.id === productId && item.flavor === flavor)
    );
    setCartItems(updatedCart);
    toast.info("Removed from cart");
  };

  const updateCartItemQuantity = (productId, flavor, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId, flavor);
      return;
    }
    const updatedCart = cartItems.map((item) =>
      item.id === productId && item.flavor === flavor
        ? { ...item, quantity: newQuantity }
        : item
    );
    setCartItems(updatedCart);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-amber-200">
      <header className="bg-white shadow-md py-4 px-6 fixed w-full z-50 flex items-center justify-between">
        <Link href={'/store'}>
        <h1 className="text-2xl font-bold text-teal-500">Our Products</h1>
        </Link>
        <div className="flex items-center space-x-4">
          <button
            onClick={openFavorites}
            className="relative text-gray-500 hover:text-red-600 transition-all duration-200"
          >
            <FaHeart className="text-2xl" />
            {favoriteProducts.size > 0 && (
              <span className="absolute top-[-8px] right-[-8px] bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {favoriteProducts.size}
              </span>
            )}
          </button>
          <button
            onClick={openCart}
            className="relative text-gray-500 hover:text-teal-600 transition-all duration-200"
          >
            <FaShoppingCart className="text-2xl" />
            {cartItems.length > 0 && (
              <span className="absolute top-[-8px] right-[-8px] bg-teal-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="p-6 px-15 pt-25">
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Search products..."
            className="p-2 border rounded-md w-full md:w-1/3 bg-white text-gray-700 focus:ring-2 focus:ring-teal-500 focus:outline-none focus:border-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="p-2 border rounded-md w-full md:w-1/4 bg-white text-gray-700  focus:ring-2 focus:ring-teal-500 focus:outline-none focus:border-white"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {[...new Set(products.map((p) => p.category))].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            className="p-2 border rounded-md w-full md:w-1/4 bg-white text-gray-700  focus:ring-2 focus:ring-teal-500 focus:outline-none focus:border-white"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="default">Sort by</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>

        {loading ? (
          <p className="text-center text-gray-700">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
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
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-2 right-2 text-red-400  hover:text-red-600"
                  >
                    {favoriteProducts.has(product.id) ? (
                      <AiFillHeart className="text-red-500 text-3xl" />
                    ) : (
                      <AiOutlineHeart className="text-red-500 text-3xl" />
                    )}
                  </button>
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 truncate">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 text-sm truncate">
                    {product.category}
                  </p>
                  <p className="text-teal-500 font-bold mt-2">
                    रु {product.price}
                  </p>
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
            className="fixed inset-0 bg-black/60 flex justify-center items-center   z-50 text-gray-700"
            onClick={handleCloseModal}
          >
            <div
              className="bg-white rounded-lg shadow-lg p-6 px-4 md:px-8 w-3/4 md:w-7/12"
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
                <div className="w-full sm:w-1/2 sm:pl-6 md:mt-6  sm:mt-0 relative">
                  <div
                    className="absolute top-[-25] md:top-[-35] right-[-20] cursor-pointer   rounded-full py-2 px-4 hover:bg-gray-600/60 hover:text-white text-2xl"
                    onClick={handleCloseModal}
                  >
                    X
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-2">
                    {selectedProduct.description}
                  </p>

                  <div className="mt-4">
                    <label
                      htmlFor="flavor"
                      className="block text-sm text-gray-700 mb-3 font-semibold"
                    >
                      Select Flavor{" "}
                    </label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {["chocolate", "vanilla", "strawberry","Butterscotch"].map((flav) => (
                        <button
                          key={flav}
                          onClick={() => setFlavor(flav)}
                          className={`p-3 font-semibold w-27 hover:bg-teal-500 hover:border-white hover:text-white cursor-pointer   duration-200 text-sm   border ${
                            flavor === flav
                              ? "bg-teal-500 text-white"
                              : "bg-white text-teal-500"
                          } border-amber-400 rounded-full`}
                        >
                          {flav.charAt(0).toUpperCase() + flav.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
                    <label
                      htmlFor="quantity"
                      className="block text-sm text-gray-700 font-semibold"
                    >
                      Quantity :
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          setQuantity(quantity - 1 > 0 ? quantity - 1 : 1)
                        }
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
                      onClick={handleAddToCart}
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

        {/* Favorites Sidebar */}
        <div
          className={`fixed top-0 right-0 h-full w-80  bg-white shadow-md z-50 transform transition-transform duration-300 ${
            isFavoritesOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 flex justify-between items-center border-b">
            <h2 className="text-xl font-semibold text-red-500">Favorites</h2>
            <button onClick={closeFavorites}
            className="text-gray-700 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto h-[calc(100vh-60px)]">
          {products
            .filter((product) => favoriteProducts.has(product.id))
            .map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between mb-4 border-b pb-2"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative w-20 h-20">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">{product.name}</h3>
                    <p className="text-teal-600 font-semibold text-sm">
                      रु {product.price}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFromFavorites(product.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          {products.filter((product) => favoriteProducts.has(product.id)).length === 0 && (
            <p className="text-gray-500">No favorite products yet.</p>
          )}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-md z-50 transform transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold text-teal-500">Shopping Cart</h2>
          <button onClick={closeCart} className="text-gray-700 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto h-[calc(100vh-200px)]">
          {cartItems.map((item) => (
            <div
              key={`${item.id}-${item.flavor}`}
              className="flex items-center justify-between mb-4 border-b pb-2"
            >
              <div className="flex items-center space-x-4">
                <div className="relative w-20 h-20">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">{item.name}</h3>
                  <p className="text-sm text-gray-500">Flavor: {item.flavor}</p>
                  <div className="flex items-center text-2xl  space-x-2">
                    <button
                      onClick={() => updateCartItemQuantity(item.id, item.flavor, item.quantity - 1)}
                      className="text-gray-700 hover:text-gray-700  "
                    >
                      -
                    </button>
                    <span className="text-gray-400">{item.quantity}</span>
                    <button
                      onClick={() => updateCartItemQuantity(item.id, item.flavor, item.quantity + 1)}
                      className="text-gray-700 hover:text-gray-700 "
                    >
                      +
                    </button>
                  </div>
                  <p className="text-teal-600 font-semibold text-sm mt-1 ">
                    रु {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.id, item.flavor)}
                className="text-red-500 hover:text-red-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
          {cartItems.length === 0 && (
            <p className="text-gray-500">Your cart is empty.</p>
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="p-6 border-t">
            <p className="text-xl font-semibold text-gray-800">
              Total: रु {calculateTotal().toFixed(2)}
            </p>
            <button className="bg-teal-500 text-white px-4 py-2 rounded-md w-full hover:bg-teal-600 mt-0">
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);
}