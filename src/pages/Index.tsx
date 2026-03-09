import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PainPointsSection from "@/components/PainPointsSection";
import WidgetSection from "@/components/WidgetSection";
import ContractSection from "@/components/ContractSection";
import OperationsSection from "@/components/OperationsSection";
import DataEngineSection from "@/components/DataEngineSection";
import FlywheelSection from "@/components/FlywheelSection";
import BuiltForOperatorsSection from "@/components/BuiltForOperatorsSection";
import JoinMovementSection from "@/components/JoinMovementSection";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <main className="bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <PainPointsSection />
      <WidgetSection />
      <ContractSection />
      <OperationsSection />
      <DataEngineSection />
      <FlywheelSection />
      <BuiltForOperatorsSection />
      <JoinMovementSection />
      <CTASection />
    </main>
  );
};

export default Index;
