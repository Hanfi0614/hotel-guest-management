import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";

import Shell from "./layout/Shell";
import Home from "./routes/Home";
import Guests from "./routes/Guests";
import NewGuest from "./routes/NewGuest";
import EditGuest from "./routes/EditGuest";
import { ToastProvider } from "./components/Toaster";

// Create a single QueryClient for the whole app
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // avoid refetch spam but still stay fairly fresh
      staleTime: 60_000,        // 1 min
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const router = createBrowserRouter([
  {
    element: <Shell />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/guests", element: <Guests /> },
      { path: "/guests/new", element: <NewGuest /> },
      { path: "/guests/:id", element: <EditGuest /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
      {/* Optional devtools (remove in production) */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
