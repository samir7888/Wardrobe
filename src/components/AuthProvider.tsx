"use client";

import PersistAuth from "./PersistAuth";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PersistAuth>{children}</PersistAuth>;
}
