"use client";

import { useAuthStore } from "@/store/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";

export default function DashboardPage() {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold">Wardrobe Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/items/new" className="block">
                <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                          <span className="text-white font-bold">+</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Add New Item
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            Create a new wardrobe item
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/items" className="block">
                <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                          <span className="text-white font-bold">📋</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            View Items
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            Browse your wardrobe
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
