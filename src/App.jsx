import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppLayout from "./layout/app-layout";
import LandingPage from "./pages/LandingPage";
import Onboading from "./pages/Onboading";
import JobListing from "./pages/job-listing";
import JobPage from "./pages/job";
import PostJobPage from "./pages/post-job";
import SavedJobPage from "./pages/saved-job";
import MyJob from "./pages/my-jobs";
import { ThemeProvider } from "./components/theme-provider";
import "./App.css";
import ProtectedRoute from "./components/protected-route";
const App = () => {
  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <LandingPage />,
        },
        {
          path: "/onboarding",

          element: (
            <ProtectedRoute>
              <Onboading />
            </ProtectedRoute>
          ),
        },
        {
          path: "/jobs",
          element: (
            <ProtectedRoute>
              <JobListing />
            </ProtectedRoute>
          ),
        },
        {
          path: "/job/:id",
          element: (
            <ProtectedRoute>
              <JobPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/post-job",
          element: (
            <ProtectedRoute>
              <PostJobPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/saved-jobs",
          element: (
            <ProtectedRoute>
              <SavedJobPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/my-jobs",
          element: (
            <ProtectedRoute>
              <MyJob />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
