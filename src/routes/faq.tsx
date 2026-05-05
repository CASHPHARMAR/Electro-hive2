import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/faq")({
  component: FAQPage,
  head: () => ({
    meta: [
      { title: "FAQ — Electronic Hive" },
      { name: "description", content: "Answers to common questions about ordering, payment, delivery, warranty and returns at Electronic Hive." },
      { property: "og:title", content: "FAQ — Electronic Hive" },
      { property: "og:description", content: "Common questions about ordering, payment, delivery, warranty and returns." },
    ],
  }),
});

const faqs = [
  {
    q: "How do I place an order?",
    a: "Browse the shop, tap a product, and click 'Order on WhatsApp'. We'll confirm availability and arrange payment & delivery within minutes.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept Mobile Money (MTN, Telecel, AirtelTigo), bank transfer, and cash on delivery within Accra.",
  },
  {
    q: "Do you deliver?",
    a: "Yes. Same-day delivery within Accra. Nationwide delivery via STC, VIP or trusted couriers (1–3 business days).",
  },
  {
    q: "Are the laptops tested?",
    a: "Every device is fully inspected — battery health, screen, keyboard, ports, performance and Windows activation — before it's listed.",
  },
  {
    q: "Do you offer a warranty?",
    a: "Yes. All laptops come with a 7-day return guarantee and a 30-day functional warranty. Specific warranty terms vary per product.",
  },
  {
    q: "Can I return a product?",
    a: "Yes — within 7 days of purchase if the product has a fault we missed. Items must be in original condition with all accessories.",
  },
  {
    q: "Are the laptops new or used?",
    a: "We sell both. Each listing clearly shows the condition (New or Used). Used laptops are UK/US imports in excellent working condition.",
  },
  {
    q: "Where are you located?",
    a: "We're based in Accra, Ghana. Pickup is available by appointment — message us on WhatsApp to arrange.",
  },
];

function FAQPage() {
  return (
    <SiteLayout>
      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold mb-3">Frequently Asked Questions</h1>
        <p className="text-muted-foreground mb-8">Everything you need to know before ordering. Still unsure? Message us on WhatsApp.</p>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-10 rounded-2xl border border-border bg-card p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Still have questions?</h2>
          <p className="text-sm text-muted-foreground mb-4">We usually reply within minutes during business hours.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild>
              <a href={whatsappLink()} target="_blank" rel="noopener">
                <MessageCircle className="h-4 w-4 mr-1" /> Chat on WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link to="/contact">Contact page</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}