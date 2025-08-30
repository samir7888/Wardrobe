"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { itemsAPI } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2, Calendar, Tag, Palette } from "lucide-react";
import Link from "next/link";

interface Item {
  id: string;
  title: string;
  category: string;
  color: string | null;
  season: string | null;
  notes: string | null;
  imageUrl: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export default function ItemDetailsPage() {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const itemId = params.id as string;

  useEffect(() => {
    if (itemId) {
      fetchItem();
    }
  }, [itemId]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const data = await itemsAPI.getItem(itemId);
      setItem(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch item");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this item? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await itemsAPI.deleteItem(itemId);
      router.push("/items");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete item");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      TOP: "Top",
      BOTTOM: "Bottom",
      OUTERWEAR: "Outerwear",
      FOOTWEAR: "Footwear",
      ACCESSORY: "Accessory",
    };
    return categoryMap[category] || category;
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Loading item...
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <Link
                href="/items"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Items
              </Link>
            </div>
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!item) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <Link
                href="/items"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Items
              </Link>
            </div>
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Item not found.
              </p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Navigation */}
          <div className="mb-6">
            <Link
              href="/items"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Items
            </Link>
          </div>

          {/* Main Content */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="md:flex">
              {/* Image Section */}
              <div className="md:w-1/2">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-96 md:h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-96 md:h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Tag className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">
                        No image available
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="md:w-1/2 p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {item.title}
                    </h1>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                      {getCategoryLabel(item.category)}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/items/${item.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </div>

                {/* Item Details */}
                <div className="space-y-4">
                  {item.color && (
                    <div className="flex items-center">
                      <Palette className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Color
                        </p>
                        <p className="text-gray-900 dark:text-white capitalize">
                          {item.color}
                        </p>
                      </div>
                    </div>
                  )}

                  {item.season && (
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Season
                        </p>
                        <p className="text-gray-900 dark:text-white capitalize">
                          {item.season}
                        </p>
                      </div>
                    </div>
                  )}

                  {item.notes && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Notes
                      </p>
                      <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                        {item.notes}
                      </p>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Added
                        </p>
                        <p className="text-gray-900 dark:text-white">
                          {formatDate(item.createdAt)}
                        </p>
                      </div>
                      {item.updatedAt !== item.createdAt && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Last Updated
                          </p>
                          <p className="text-gray-900 dark:text-white">
                            {formatDate(item.updatedAt)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-center space-x-4">
            <Link href="/items/new">
              <Button variant="outline">Add Another Item</Button>
            </Link>
            <Link href="/items">
              <Button>View All Items</Button>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
