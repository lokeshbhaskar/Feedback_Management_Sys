import React from "react";
import { Outlet } from "@tanstack/router";

export default function App() {
  return (
    <div className="app">
      {/* Global layout or navbar can go here */}
      <Outlet />
    </div>
  );
}
