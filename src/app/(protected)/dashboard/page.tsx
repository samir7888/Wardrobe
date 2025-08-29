"use client";

import { useAuthStore } from "@/store/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { Plus, Shirt, Palette, BarChart3, Grid3X3, Heart } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function DashboardPage() {
  const { user } = useAuthStore();

  const stats = [
    {
      name: "Total Items",
      value: "24",
      icon: Shirt,
      color: "bg-blue-500",
      href: "/items",
    },
    {
      name: "Outfits Created",
      value: "8",
      icon: Palette,
      color: "bg-purple-500",
      href: "/outfits",
    },
    {
      name: "Categories",
      value: "5",
      icon: Grid3X3,
      color: "bg-green-500",
      href: "/categories",
    },
    {
      name: "Favorites",
      value: "12",
      icon: Heart,
      color: "bg-red-500",
      href: "/favorites",
    },
  ];

  const quickActions = [
    {
      name: "Add New Item",
      description: "Upload a new piece to your wardrobe",
      icon: Plus,
      color: "bg-indigo-500",
      href: "/items/new",
    },
    {
      name: "Plan Outfit",
      description: "Create a new outfit combination",
      icon: Palette,
      color: "bg-purple-500",
      href: "/outfits",
    },
    {
      name: "View Analytics",
      description: "See your wardrobe insights",
      icon: BarChart3,
      color: "bg-green-500",
      href: "/analytics",
    },
  ];

  return (
    <ProtectedRoute>
      <Sidebar>
        <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
          {/* Welcome Header */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back,{" "}
                {user?.name
                  ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
                  : "User"}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Here's what's happening with your wardrobe today.
              </p>
            </div>
            <ThemeToggle />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Link key={stat.name} href={stat.href} className="block">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div
                          className={`w-8 h-8 ${stat.color} rounded-md flex items-center justify-center`}
                        >
                          <stat.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                            {stat.name}
                          </dt>
                          <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stat.value}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action) => (
                <Link key={action.name} href={action.href} className="block">
                  <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div
                            className={`w-10 h-10 ${action.color} rounded-md flex items-center justify-center`}
                          >
                            <action.icon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {action.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg h-fit border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Recent Activity
              </h2>
            </div>
            <div className="p-6">
              <div className="flow-root">
                <ul className="-mb-8">
                  <li>
                    <div className="relative pb-8">
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                            <Plus className="w-4 h-4 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Added new item{" "}
                              <span className="font-medium text-gray-900 dark:text-white">
                                Blue Denim Jacket
                              </span>
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                            <time>2 hours ago</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="relative pb-8">
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                            <Palette className="w-4 h-4 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Created outfit{" "}
                              <span className="font-medium text-gray-900 dark:text-white">
                                Casual Friday
                              </span>
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                            <time>1 day ago</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="relative pb-6">
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                            <Heart className="w-4 h-4 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Added{" "}
                              <span className="font-medium text-gray-900 dark:text-white">
                                White Sneakers
                              </span>{" "}
                              to favorites
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                            <time>3 days ago</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Sidebar>
    </ProtectedRoute>
  );
}
