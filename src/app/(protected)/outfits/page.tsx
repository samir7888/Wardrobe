"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import { useOutfitStore } from "@/store/outfitStore";
import { Item, ClothingCategory } from "@/types";
import { itemsAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shirt,
  Palette,
  RotateCcw,
  Check,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";

const categoryLabels = {
  top: "Tops",
  bottom: "Bottoms",
  shoes: "Shoes",
  accessories: "Accessories",
};

const categoryIcons = {
  top: Shirt,
  bottom: Shirt,
  shoes: Shirt,
  accessories: Shirt,
};

export default function OutfitPlannerPage() {
  const {
    currentSelection,
    todaysOutfit,
    availableItems,
    isLoading,
    error,
    selectItem,
    deselectItem,
    confirmTodaysOutfit,
    resetTodaysOutfit,
    resetCurrentSelection,
    setAvailableItems,
    setLoading,
    setError,
  } = useOutfitStore();

  const [allItems, setAllItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await itemsAPI.getItems();
        const items = response.items || response || [];
        console.log("Fetched items:", items);
        console.log("Categories found:", [
          ...new Set(items.map((item: Item) => item.category)),
        ]);
        setAllItems(items);
        setAvailableItems(items);
      } catch (err: any) {
        console.error("Failed to fetch items:", err);
        setError(err.response?.data?.message || "Failed to load items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [setAvailableItems, setLoading, setError]);

  const handleItemSelect = (category: ClothingCategory, item: Item) => {
    if (currentSelection[category]?.id === item.id) {
      deselectItem(category);
    } else {
      selectItem(category, item);
    }
  };

  const hasSelection = Object.keys(currentSelection).length > 0;
  const canConfirmOutfit = hasSelection;

  // Get only categories that have items
  const availableCategories = Object.entries(availableItems).filter(
    ([category, items]) => items.length > 0
  ) as [ClothingCategory, Item[]][];

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Sidebar>
          <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">
                  Loading your wardrobe...
                </p>
              </div>
            </div>
          </div>
        </Sidebar>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <Sidebar>
          <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </Sidebar>
      </ProtectedRoute>
    );
  }

  if (allItems.length === 0) {
    return (
      <ProtectedRoute>
        <Sidebar>
          <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Palette className="h-8 w-8 text-indigo-600" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Outfit Planner
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Plan your perfect outfit by selecting items from each category
              </p>
            </div>

            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Shirt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No items in your wardrobe
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Add some clothing items to start planning outfits
                </p>
                <Button asChild>
                  <a href="/items/new">Add Your First Item</a>
                </Button>
              </div>
            </div>
          </div>
        </Sidebar>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Sidebar>
        <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Palette className="h-8 w-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Outfit Planner
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Plan your perfect outfit by selecting items from each category
            </p>
          </div>

          {/* Today's Outfit Section */}
          {todaysOutfit && (
            <Card className="mb-8 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                    <Check className="h-5 w-5" />
                    Today's Outfit
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetTodaysOutfit}
                    className="text-green-700 border-green-300 hover:bg-green-100 dark:text-green-300 dark:border-green-600 dark:hover:bg-green-800"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Change Outfit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(todaysOutfit).map(
                    ([category, item]) =>
                      item && (
                        <div key={category} className="text-center">
                          <div className="relative w-24 h-24 mx-auto mb-2 rounded-lg overflow-hidden bg-white shadow-sm">
                            <Image
                              src={item.imageUrl || "/api/placeholder/96/96"}
                              alt={item.imageUrl}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="text-sm font-medium text-green-800 dark:text-green-200">
                            {item.name}
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-400 capitalize">
                            {category}
                          </p>
                        </div>
                      )
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Categories Section */}
            <div className="lg:col-span-2">
              {availableCategories.length === 0 ? (
                <div className="text-center py-12">
                  <Shirt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No items available
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Add some clothing items to start planning outfits
                  </p>
                  <Button asChild>
                    <a href="/items/new">Add Items</a>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {availableCategories.map(([category, items]) => {
                    const categoryKey = category as ClothingCategory;
                    const Icon = categoryIcons[categoryKey];

                    return (
                      <Card key={category}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Icon className="h-5 w-5" />
                            {categoryLabels[categoryKey]}
                            <Badge variant="secondary" className="ml-auto">
                              {items.length}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                            {items.map((item) => {
                              const isSelected =
                                currentSelection[categoryKey]?.id === item.id;

                              return (
                                <div
                                  key={item.id}
                                  className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                                    isSelected
                                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                  }`}
                                  onClick={() =>
                                    handleItemSelect(categoryKey, item)
                                  }
                                >
                                  <div className="aspect-square relative rounded-md overflow-hidden">
                                    <Image
                                      src={
                                        item.imageUrl ||
                                        "/api/placeholder/120/120"
                                      }
                                      alt={item.name}
                                      fill
                                      className="object-cover"
                                    />
                                    {isSelected && (
                                      <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center">
                                        <Check className="h-6 w-6 text-indigo-600" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="p-2">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                      {item.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {item.color} • {item.size}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Preview Section */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Outfit Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  {hasSelection ? (
                    <div className="space-y-4">
                      {Object.entries(currentSelection).map(
                        ([category, item]) => (
                          <div
                            key={category}
                            className="flex items-center gap-3"
                          >
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                              <Image
                                src={item.imageUrl || "/api/placeholder/64/64"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                {category} • {item.color}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                deselectItem(category as ClothingCategory)
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      )}

                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                        <Button
                          onClick={confirmTodaysOutfit}
                          disabled={!canConfirmOutfit}
                          className="w-full"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Confirm Today's Outfit
                        </Button>
                        <Button
                          variant="outline"
                          onClick={resetCurrentSelection}
                          className="w-full"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset Selection
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Shirt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Select items from each category to build your outfit
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Sidebar>
    </ProtectedRoute>
  );
}
