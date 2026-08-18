import { redirect } from "next/navigation";
import { brands } from "@/lib/data";

export function generateStaticParams() {
  return brands.flatMap(b => b.models.map(m => ({ brand: b.id, device: m.id })));
}

export default async function DevicePage({ params }: { params: Promise<{ brand: string; device: string }> }) {
  const { brand, device } = await params;
  redirect(`/repair?brand=${brand}&model=${device}`);
}

