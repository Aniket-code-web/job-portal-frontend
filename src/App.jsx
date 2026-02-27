import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      {/* 🔔 Global Toast Notifications */}
      <Toaster position="top-right" />

      {/* 🌐 App Routes */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;