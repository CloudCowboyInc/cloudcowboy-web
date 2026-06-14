import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AnimatedBackground from "./components/home/AnimatedBackground";
import { AuthProvider } from "./lib/auth";
import { RequireAdmin } from "./components/auth/Guards";
import Index from "./pages/Index";
import Beta from "./pages/Beta";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import RequestAccess from "./pages/RequestAccess";
import NotFound from "./pages/NotFound";

// Internal tools — lazy-loaded so their code + lead data are NOT in the public bundle.
const CRM = lazy(() => import("./pages/CRM"));
const Admin = lazy(() => import("./pages/Admin"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AnimatedBackground />
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/beta" element={<Beta />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/investors" element={<RequestAccess />} />
            <Route
              path="/crm"
              element={
                <Suspense fallback={null}>
                  <RequireAdmin><CRM /></RequireAdmin>
                </Suspense>
              }
            />
            <Route
              path="/admin"
              element={
                <Suspense fallback={null}>
                  <RequireAdmin><Admin /></RequireAdmin>
                </Suspense>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
