import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Map, ShieldCheck, LineChart, ArrowUpRight } from "lucide-react";
import CrmBoard from "./CRM";
import AccessBoard from "@/components/admin/AccessBoard";
import InvestorsBoard from "@/components/admin/InvestorsBoard";

/**
 * Business Hub — the internal admin portal. Tabbed so we can keep adding
 * surfaces as the business grows. Admin-only.
 */
export default function AdminPortal() {
  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-28 md:px-8">
      <Helmet><title>Business Hub · Cloud Cowboy</title><meta name="robots" content="noindex" /></Helmet>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          <span className="text-gradient-primary">Cloud Cowboy</span> Hub
        </h1>
        {/* Admins can also open the investor data room. */}
        <Button asChild variant="outline" size="sm" className="gap-1.5">
          <Link to="/portal/market">
            Open investor data room <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="investors" className="w-full">
        <TabsList>
          <TabsTrigger value="investors" className="gap-1.5"><LineChart className="h-4 w-4" /> Investors</TabsTrigger>
          <TabsTrigger value="crm" className="gap-1.5"><Map className="h-4 w-4" /> CRM</TabsTrigger>
          <TabsTrigger value="access" className="gap-1.5"><ShieldCheck className="h-4 w-4" /> Access</TabsTrigger>
        </TabsList>
        <TabsContent value="investors" className="mt-6"><InvestorsBoard /></TabsContent>
        <TabsContent value="crm" className="mt-6"><CrmBoard /></TabsContent>
        <TabsContent value="access" className="mt-6"><AccessBoard /></TabsContent>
      </Tabs>
    </div>
  );
}
