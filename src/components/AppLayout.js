import React from "react";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      {/* Shared components, like Navbar */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
