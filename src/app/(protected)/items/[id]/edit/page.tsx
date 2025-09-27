"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { itemsAPI } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, X } from "lucide-react";
import Link from "next/link";

// Category enum based on Prisma schema
const categories = [
  { value: "TOP", label: "Top" },
  { value: "BOTTOM", label: "Bottom" },
  { value: "OUTERWEAR", label: "Outerwear" },
  { value: "FOOTWEAR", label: "Footwear" },
  { value: "ACCESSORY", label: "Accessory" },
] as const;

// Zod validation schema for updates (all fields optional except when provided)
const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  category: z.enum(["TOP", "BOTTOM", "OUTERWEAR", "FOOTWEAR", "ACCESSORY"], {
    message: "Please select a category",
  }),
  color: z.string().optional(),
  season: z.string().optional(),
  notes: z.string().optional(),
  image: z
    .instanceof(FileList)
    .optional()
    .refine(
      (files) =>
        !files || files.length === 0 || files[0]?.size <= 5 * 1024 * 1024,
      "Image must be less than 5MB"
    )
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          files[0]?.type
        ),
      "Only JPEG, PNG, and WebP images are allowed"
    ),
});

type FormData = z.infer<typeof formSchema>;

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

export default function EditItemPage() {
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();
  const itemId = params.id as string;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: undefined,
      color: "",
      season: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (itemId) {
      fetchItem();
    }
  }, [itemId]);

  const fetchItem = async () => {
    try {
      setIsLoading(true);
      const data = await itemsAPI.getItem(itemId);
      setItem(data);

      // Pre-populate form with existing data
      form.reset({
        title: data.title,
        category: data.category as any,
        color: data.color || "",
        season: data.season || "",
        notes: data.notes || "",
      });

      // Set current image as preview
      if (data.imageUrl) {
        setImagePreview(data.imageUrl);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else if (item?.imageUrl) {
      // Reset to original image if no new file selected
      setImagePreview(item.imageUrl);
    } else {
      setImagePreview(null);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("category", data.category);
      if (data.color) formData.append("color", data.color);
      if (data.season) formData.append("season", data.season);
      if (data.notes) formData.append("notes", data.notes);

      // Only append image if a new one was selected
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      await itemsAPI.updateItem(itemId, formData);
      router.push(`/items/${itemId}`);
    } catch (error: any) {
      console.error("Failed to update item:", error);
      setError(error.response?.data?.message || "Failed to update item");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading item...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error && !item) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-500">
          <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <Link
                href="/items"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Items
              </Link>
            </div>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
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
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Item not found.</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black">
        <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href={`/items/${itemId}`}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Item
            </Link>
          </div>

          <div className="bg-neutral-900 shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">
                Edit Item: {item.title}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Update the details of your wardrobe item.
              </p>
            </div>

            {error && (
              <div className="mx-6 mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="p-6 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Blue Cotton Shirt"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Give your item a descriptive name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                            className="py-3"
                              key={category.value}
                              value={category.value}
                            >
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the category that best describes your item.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Blue, Red, Black"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="season"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Season</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Summer, Winter, All"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any additional notes about this item..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional notes about the item (care instructions,
                        occasions, etc.)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel>Update Image (Optional)</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <Input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={(e) => {
                              const files = e.target.files;
                              onChange(files);
                              handleImageChange(files);
                            }}
                            {...field}
                          />
                          {imagePreview && (
                            <div className="mt-4">
                              <p className="text-sm text-gray-600 mb-2">
                                {imagePreview === item?.imageUrl
                                  ? "Current image:"
                                  : "New image preview:"}
                              </p>
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded-md border"
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload a new image to replace the current one (max 5MB,
                        JPEG/PNG/WebP)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Link href={`/items/${itemId}`}>
                    <Button type="button" variant="outline">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Save className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Item
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
