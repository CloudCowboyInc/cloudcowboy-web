import { Helmet } from "react-helmet-async";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Map, ShieldCheck } from "lucide-react";
import CrmBoard from "./CRM";
import AccessBoard from "@/components/admin/AccessBoard";

/**
 * Business Hub — the internal admin portal. Tabbed so we can keep adding
 * surfaces (Ops, Analytics, etc.) as the business grows. Admin-only.
 */
export default function AdminPortal() {
  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-28 md:px-8">
      <Helmet><title>Business Hub · Cloud Cowboy</title><meta name="robots" content="noindex" /></Helmet>
      <h1 className="mb-6 font-display text-3xl font-bold md:text-4xl">
        <span className="text-gradient-primary">Cloud Cowboy</span> Hub
      </h1>

      <Tabs defaultValue="crm" className="w-full">
        <TabsList>
          <TabsTrigger value="crm" className="gap-1.5"><Map className="h-4 w-4" /> CRM</TabsTrigger>
          <TabsTrigger value="access" className="gap-1.5"><ShieldCheck className="h-4 w-4" /> Access</TabsTrigger>
        </TabsList>
        <TabsContent value="crm" className="mt-6"><CrmBoard /></TabsContent>
        <TabsContent value="access" className="mt-6"><AccessBoard /></TabsContent>
      </Tabs>
    </div>
  );
}
