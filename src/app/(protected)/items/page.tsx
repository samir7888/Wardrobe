"use client";

import { useState, useEffect, useMemo } from "react";
import { itemsAPI } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import FilterCard from "@/components/FilterCard";
import Link from "next/link";

interface Item {
  id: string;
  title: string;
  category: string;
  color?: string;
  season?: string;
  imageUrl: string;
  notes?: string;
  createdAt: string;
}

const CATEGORIES = [
  "All",
  "TOP",
  "BOTTOM",
  "OUTERWEAR",
  "FOOTWEAR",
  "ACCESSORY",
];

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);

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

  const filteredItems = useMemo(() => {
    const selectedCategory = CATEGORIES[selectedCategoryIndex];
    if (selectedCategory === "All") {
      return items.filter((item) => item.imageUrl);
    }
    return items.filter(
      (item) => item.category === selectedCategory && item.imageUrl
    );
  }, [items, selectedCategoryIndex]);

  const handleCategoryChange = (index: number, category: string) => {
    setSelectedCategoryIndex(index);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Sidebar>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </Sidebar>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Sidebar>
        <div className="p-6">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              {/* Category Filter */}
              <div className="mb-8 flex justify-center">
                <FilterCard
                  tabs={CATEGORIES}
                  activeIndex={selectedCategoryIndex}
                  onTabChange={handleCategoryChange}
                  isProduct={false}
                />
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
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No items found in the{" "}
                    {CATEGORIES[selectedCategoryIndex].toLowerCase()} category.
                  </p>
                  <Link
                    href="/items/new"
                    className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-sm font-medium"
                  >
                    Add New Item
                  </Link>
                </div>
              ) : (
                <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
                  {filteredItems.map((item) => (
                    <Link key={item.id} href={`/items/${item.id}`}>
                      <div className="break-inside-avoid mb-4 group">
                        <div className="relative overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                          <img
                            className="w-full h-auto object-cover"
                            src={item.imageUrl}
                            alt={item.title}
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black group-hover:bg-opacity-20 transition-all duration-300 flex items-end ">
                            <div className="w-full p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <h3 className="text-white text-sm font-medium truncate">
                                {item.title}
                              </h3>
                              <p className="text-white/80 text-xs">
                                {item.category}
                              </p>
                            </div>
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
      </Sidebar>
    </ProtectedRoute>
  );
}
