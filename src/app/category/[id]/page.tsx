import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import { conversionCategories, slugForConversion } from "@/lib/conversions";
import { performConversion, formatNumber } from "@/lib/engine";
import { absoluteUrl } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(conversionCategories).map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<"/category/[id]">): Promise<Metadata> {
  const { id } = await params;
  const category = conversionCategories[id];

  if (!category) {
    return {
      title: "Category not found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${category.name} conversions`,
    description: `${category.description} Browse ${Object.keys(category.units).length} ${category.name.toLowerCase()} units and all compatible conversion pages.`,
    alternates: { canonical: `/category/${category.id}` },
    keywords: [
      `${category.name} conversions`,
      `${category.name.toLowerCase()} converter`,
      "unit converter",
      "conversion calculator",
      "conversion table",
    ],
    openGraph: {
      title: `${category.name} conversions`,
      description: category.description,
      url: absoluteUrl(`/category/${category.id}`),
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: PageProps<"/category/[id]">) {
  const { id } = await params;
  const category = conversionCategories[id];

  if (!category) notFound();

  const units = Object.values(category.units);
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "ConvertAnything",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${category.name} conversions`,
        item: absoluteUrl(`/category/${category.id}`),
      },
    ],
  };
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} conversions`,
    description: category.description,
    url: absoluteUrl(`/category/${category.id}`),
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="font-semibold text-slate-950">
            ConvertAnything
          </Link>
          <span className="text-sm text-slate-500">{category.name}</span>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-4xl font-bold tracking-normal sm:text-5xl">{category.name} Conversions</h1>
        <p className="mt-4 max-w-2xl text-slate-600">{category.description}</p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {units.map((entry) => (
            <div key={entry.id} className="rounded-md border border-slate-200 bg-white p-4">
              <p className="font-semibold">{entry.pluralName}</p>
              <p className="mt-1 text-sm text-slate-500">{entry.symbol}</p>
            </div>
          ))}
        </div>
        <AdSlot className="mt-8" />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <h2 className="text-2xl font-semibold">Quick conversion matrix</h2>
        <div className="mt-4 overflow-x-auto rounded-md border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-3">From</th>
                {units.slice(0, 5).map((unit) => (
                  <th key={unit.id} className="px-4 py-3">
                    to {unit.symbol}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {units.slice(0, 8).map((fromUnit) => (
                <tr key={fromUnit.id} className="border-t border-slate-200">
                  <td className="px-4 py-3 font-medium">{fromUnit.symbol}</td>
                  {units.slice(0, 5).map((toUnit) => {
                    const conversion = fromUnit.id === toUnit.id ? null : performConversion(1, fromUnit.id, toUnit.id);
                    return (
                      <td key={toUnit.id} className="px-4 py-3">
                        {fromUnit.id === toUnit.id ? "1" : conversion ? formatNumber(conversion.result) : "-"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold">All {category.name.toLowerCase()} converters</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {units.flatMap((fromUnit) =>
            units
              .filter((toUnit) => toUnit.id !== fromUnit.id)
              .map((toUnit) => (
                <Link
                  key={`${fromUnit.id}-${toUnit.id}`}
                  href={slugForConversion(fromUnit.id, toUnit.id)}
                  className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-medium transition hover:border-teal-300 hover:text-teal-800"
                >
                  {fromUnit.pluralName} to {toUnit.pluralName}
                </Link>
              )),
          )}
        </div>
      </section>
    </main>
  );
}
