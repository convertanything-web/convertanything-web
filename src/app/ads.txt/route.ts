export const dynamic = "force-static";

export function GET() {
  const publisherId = process.env.ADSENSE_PUBLISHER_ID || process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const body = publisherId
    ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`
    : "# Add ADSENSE_PUBLISHER_ID=pub-xxxxxxxxxxxxxxxx to publish Google AdSense ads.txt.\n";

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
