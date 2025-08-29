"use client";

import { useState, useEffect } from "react";
import { itemsAPI } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";

interface Item {
  id: string;
  name: string;
  description?: string;
  category: string;
  color: string;
  size: string;
  imageUrl?: string;
  createdAt: string;
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await itemsAPI.getItems();
      setItems(data.items);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Your Wardrobe
              </h1>
              <Link
                href="/items/new"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Add New Item
              </Link>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No items in your wardrobe yet.
                </p>
                <Link
                  href="/items/new"
                  className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-sm font-medium"
                >
                  Add Your First Item
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((item) => (
                  <Link key={item.id} href={`/items/${item.id}`}>
                    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                      {item.imageUrl && (
                        <div className="aspect-w-1 aspect-h-1 w-full">
                          <img
                            className="w-full h-48 object-cover"
                            src={item.imageUrl}
                            alt={item.name}
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.category}
                        </p>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {item.color}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {item.size}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
