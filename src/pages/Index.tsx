import HeroSection from "@/components/HeroSection";
import PainPointsSection from "@/components/PainPointsSection";
import WidgetSection from "@/components/WidgetSection";
import ContractSection from "@/components/ContractSection";
import OperationsSection from "@/components/OperationsSection";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <main className="bg-background text-foreground overflow-x-hidden">
      <HeroSection />
      <PainPointsSection />
      <WidgetSection />
      <ContractSection />
      <OperationsSection />
      <CTASection />
    </main>
  );
};

export default Index;
