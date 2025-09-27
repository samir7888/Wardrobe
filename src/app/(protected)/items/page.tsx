"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { itemsAPI } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import FilterCard from "@/components/FilterCard";
import Link from "next/link";
import Image from "next/image";

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

interface PaginatedResponse {
  items: Item[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const CATEGORIES = [
  "All",
  "TOP",
  "BOTTOM",
  "OUTERWEAR",
  "FOOTWEAR",
  "ACCESSORY",
];

const ITEMS_PER_PAGE = 20;

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  const observer = useRef<IntersectionObserver>(null);

  const loadMoreItems = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    try {
      const selectedCategory = CATEGORIES[selectedCategoryIndex];
      const params: any = {
        page: currentPage + 1,
        limit: ITEMS_PER_PAGE,
      };

      if (selectedCategory !== "All") {
        params.category = selectedCategory;
      }

      const data: PaginatedResponse = await itemsAPI.getItems(params);
      setItems((prev) => [...prev, ...data.items]);
      setHasMore(data.page < data.totalPages);
      setCurrentPage((prev) => prev + 1);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load more items");
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, selectedCategoryIndex, currentPage]);

  const lastItemElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || loadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreItems();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore, loadMoreItems]
  );

  useEffect(() => {
    fetchItems(true);
  }, [selectedCategoryIndex]);

  const fetchItems = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setCurrentPage(1);
        setItems([]);
        setError("");
      }

      const selectedCategory = CATEGORIES[selectedCategoryIndex];
      const params: any = {
        page: reset ? 1 : currentPage,
        limit: ITEMS_PER_PAGE,
      };

      if (selectedCategory !== "All") {
        params.category = selectedCategory;
      }

      const data: PaginatedResponse = await itemsAPI.getItems(params);

      if (reset) {
        setItems(data.items);
      } else {
        setItems((prev) => [...prev, ...data.items]);
      }

      setTotalItems(data.total);
      setHasMore(data.page < data.totalPages);

      if (!reset) {
        setCurrentPage((prev) => prev + 1);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch items");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => item.imageUrl);
  }, [items]);

  const handleCategoryChange = (index: number) => {
    if (index !== selectedCategoryIndex) {
      setSelectedCategoryIndex(index);
      setCurrentPage(1);
      setHasMore(true);
    }
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
        <div className="p-1">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="md:px-4 py-6 sm:px-0">
              {/* Category Filter */}
              <div className="mb-8 w-full flex justify-center px-2">
                <div className="mx-auto overflow-x-auto max-w-7xl">
                  <FilterCard
                    tabs={CATEGORIES}
                    activeIndex={selectedCategoryIndex}
                    onTabChange={handleCategoryChange}
                    isProduct={false}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}

              {/* Stats */}
              {totalItems > 0 && (
                <div className="mb-6 text-center">
                  <p className="text-sm text-gray-600">
                    Showing {filteredItems.length} of {totalItems} items
                    {CATEGORIES[selectedCategoryIndex] !== "All" &&
                      ` in ${CATEGORIES[selectedCategoryIndex].toLowerCase()}`}
                  </p>
                </div>
              )}

              {items.length === 0 && !loading ? (
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
              ) : filteredItems.length === 0 && !loading ? (
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
                <>
                  <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
                    {filteredItems.map((item, index) => (
                      <Link key={item.id} href={`/items/${item.id}`}>
                        <div
                          ref={
                            index === filteredItems.length - 1
                              ? lastItemElementRef
                              : null
                          }
                          className="break-inside-avoid mb-4 group"
                        >
                          <div className="relative overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                            <Image
                              width={300}
                              height={400}
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

                  {/* Loading More Indicator */}
                  {loadingMore && (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  )}

                  {/* End of Results */}
                  {!hasMore && filteredItems.length > 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-sm">
                        You&apos;ve reached the end of your wardrobe!
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </Sidebar>
    </ProtectedRoute>
  );
}
