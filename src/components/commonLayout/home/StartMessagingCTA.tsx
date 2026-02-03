import { Button } from "@/components/ui/button";

export const StartMessagingCTA = () => {
  return (
    <section className="w-full py-16 md:py-20  text-foreground">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          Start Messaging with Laaffic
        </h2>

        <p className="mt-4 text-base sm:text-lg text-foreground max-w-2xl mx-auto">
          Reach your audience instantly with high-performance messaging solutions
          built for scale, compliance, and conversion.
        </p>

        <div className="mt-8">
          <Button
            size="lg"
            className="bg-background text-foreground hover:bg-background font-semibold px-8 py-6 rounded-full shadow-lg"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
};
