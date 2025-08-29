"use client";

import { useAuthStore } from "@/store/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import {
  Plus,
  Shirt,
  Palette,
  BarChart3,
  Grid3X3,
  Heart,
  TrendingUp,
  Calendar,
} from "lucide-react";

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
        <div className="p-6">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back,{" "}
              {user?.name
                ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
                : "User"}
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your wardrobe today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Link key={stat.name} href={stat.href} className="block">
                <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
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
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {stat.name}
                          </dt>
                          <dd className="text-2xl font-bold text-gray-900">
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
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action) => (
                <Link key={action.name} href={action.href} className="block">
                  <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
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
                          <h3 className="text-lg font-medium text-gray-900">
                            {action.name}
                          </h3>
                          <p className="text-sm text-gray-500">
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
          <div className="bg-white shadow rounded-lg h-fit">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
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
                          <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                            <Plus className="w-4 h-4 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              Added new item{" "}
                              <span className="font-medium text-gray-900">
                                Blue Denim Jacket
                              </span>
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
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
                          <span className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center ring-8 ring-white">
                            <Palette className="w-4 h-4 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              Created outfit{" "}
                              <span className="font-medium text-gray-900">
                                Casual Friday
                              </span>
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
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
                          <span className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center ring-8 ring-white">
                            <Heart className="w-4 h-4 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              Added{" "}
                              <span className="font-medium text-gray-900">
                                White Sneakers
                              </span>{" "}
                              to favorites
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
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
