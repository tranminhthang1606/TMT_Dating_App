import { redirect } from "next/navigation";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; // Await the params Promise
  redirect(`/${locale}/matches`);
}