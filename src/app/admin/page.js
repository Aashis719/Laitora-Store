'use client'

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";

export default function AdminDashboard() {

  const { user, isLoaded } = useUser();
  const router = useRouter();

  const adminEmail = "aashishnep10@gmail.com";

  // Memoized function to handle redirection
  const redirectNonAdmin = useCallback(() => {
    if (isLoaded && (!user || user.emailAddresses[0].emailAddress !== adminEmail)) {
      router.push("/");
    }
  }, [isLoaded, user, adminEmail, router]);

  useEffect(() => {
    redirectNonAdmin();
  }, [redirectNonAdmin]);

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4 text-green-500">Admin Dashboard</h1>

      {/* Navigation Links */}
      <nav className="flex space-x-4 mb-6">
        <a href="/admin/add-product" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Product
        </a>
        <a href="/admin/manage-products" className="bg-green-500 text-white px-4 py-2 rounded">
          Manage Products
        </a>
      </nav>

      <p className="text-blue-400">Welcome, Admin! Use the options above to manage your products.</p>
    </div>
  );
}
