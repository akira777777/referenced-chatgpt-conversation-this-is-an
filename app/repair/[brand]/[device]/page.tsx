import { redirect } from "next/navigation";
export default async function DevicePage({ params }: { params: Promise<{ brand: string; device: string }> }) { const { brand, device } = await params; redirect(`/repair?brand=${brand}&model=${device}`); }
