import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import AnimatedBackground from "./components/home/AnimatedBackground";
import { AuthProvider } from "./lib/auth";
import { RequireAdmin, RequireAllowed } from "./components/auth/Guards";
import Index from "./pages/Index";
import Beta from "./pages/Beta";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import RequestAccess from "./pages/RequestAccess";
import Portal from "./pages/Portal";
import NotFound from "./pages/NotFound";

// Internal hub — lazy-loaded so its code + lead data are NOT in the public bundle.
const Admin = lazy(() => import("./pages/Admin"));
const InvestorPortal = lazy(() => import("./pages/InvestorPortal"));

// Investor data room — lazy so the model + lead data stay out of the public bundle.
const DataRoomLayout = lazy(() => import("./pages/dataroom/DataRoomLayout"));
const MarketPage = lazy(() => import("./pages/dataroom/MarketPage"));
const GtmPage = lazy(() => import("./pages/dataroom/GtmPage"));
const FinancePage = lazy(() => import("./pages/dataroom/FinancePage"));

const queryClient = new QueryClient();

/** Branded fallback while a lazy data-room chunk loads. */
const RouteLoader = () => (
  <div
    className="relative z-10 flex min-h-screen items-center justify-center gap-2 text-muted-foreground"
    role="status"
    aria-live="polite"
  >
    <Loader2 className="h-5 w-5 animate-spin text-primary" />
    <span>Loading data room…</span>
  </div>
);

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
            <Route path="/portal" element={<Portal />} />
            <Route
              path="/investor"
              element={
                <Suspense fallback={null}>
                  <RequireAllowed><InvestorPortal /></RequireAllowed>
                </Suspense>
              }
            />
            {/* Investor data room — Market · Go-To-Market · Finance, behind the investor guard. */}
            <Route
              element={
                <Suspense fallback={<RouteLoader />}>
                  <RequireAllowed><DataRoomLayout /></RequireAllowed>
                </Suspense>
              }
            >
              <Route path="/portal/market" element={<MarketPage />} />
              <Route path="/portal/gtm" element={<GtmPage />} />
              <Route path="/portal/finance" element={<FinancePage />} />
            </Route>
            <Route path="/crm" element={<Navigate to="/admin" replace />} />
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
