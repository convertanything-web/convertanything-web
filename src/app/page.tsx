import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ConversionSearch from "@/components/ConversionSearch";
import { conversionCategories, highValuePairs, slugForConversion } from "@/lib/conversions";
import { getUnitLabel } from "@/lib/engine";
import { absoluteUrl } from "@/lib/seo";

const faqs = [
  {
    question: "How do I convert kg to lbs?",
    answer:
      "Enter the kilogram value, choose Weight, select kilograms as the from unit and pounds as the to unit, then convert. One kilogram equals 2.20462 pounds.",
  },
  {
    question: "How do I convert cm to inches or feet?",
    answer:
      "Choose Length, enter the centimeter value, then select inches or feet as the target unit. ConvertAnything also supports value pages like 180 cm to feet.",
  },
  {
    question: "How do I convert Celsius to Fahrenheit?",
    answer:
      "Choose Temperature, select Celsius as the from unit and Fahrenheit as the to unit. The formula is Fahrenheit = Celsius x 9/5 + 32.",
  },
  {
    question: "Can I convert MB to GB and GB to MB?",
    answer:
      "Yes. Choose Digital Storage and select megabytes, gigabytes, kilobytes, terabytes, bytes, or bits. ConvertAnything uses binary storage units for KB, MB, GB, and TB.",
  },
  {
    question: "Are all numeric conversion pages indexed?",
    answer:
      "No. ConvertAnything only indexes curated high-value numeric pages and keeps arbitrary number pages out of the index to avoid thin duplicate pages.",
  },
];

export default function Home() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ConvertAnything",
    url: absoluteUrl("/"),
    potentialAction: {
      "@type": "SearchAction",
      target: absoluteUrl("/convert/{search_term_string}"),
      "query-input": "required name=search_term_string",
    },
  };
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ConvertAnything",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />

      <section className="mx-auto flex min-h-[62vh] w-full max-w-5xl flex-col justify-center px-4 py-16 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">ConvertAnything</p>
        <h1 className="mt-4 text-5xl font-bold tracking-normal sm:text-7xl">Convert anything</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Fast unit conversions with formulas, tables, reverse converters, and carefully curated value pages.
        </p>
        <div className="mt-9">
          <ConversionSearch />
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-3">
          <div>
            <h2 className="text-xl font-semibold">Categories</h2>
            <p className="mt-2 text-sm text-slate-600">Browse unit families and all compatible pairs.</p>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {Object.values(conversionCategories).map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="rounded-md border border-slate-200 px-3 py-3 text-sm font-medium transition hover:border-teal-300 hover:text-teal-800"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-semibold">Popular conversions</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {highValuePairs.slice(0, 12).map(([from, to]) => (
            <Link
              key={`${from}-${to}`}
              href={slugForConversion(from, to)}
              className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-medium transition hover:border-teal-300 hover:text-teal-800"
            >
              {getUnitLabel(from)} to {getUnitLabel(to)}
            </Link>
          ))}
        </div>
        <AdSlot className="mt-8" />
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <h2 className="text-2xl font-semibold">Unit Conversion FAQs</h2>
          <div className="mt-5 divide-y divide-slate-200 rounded-md border border-slate-200">
            {faqs.map((faq, index) => (
              <details key={faq.question} className="p-4" open={index === 0}>
                <summary className="cursor-pointer font-semibold text-slate-950">{faq.question}</summary>
                <p className="mt-2 max-w-3xl leading-7 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
