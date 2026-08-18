"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { SiteChrome } from "@/components/SiteChrome";
import { Button, PlaceholderTag } from "@/components/ui";
export default function TrackPage() { const [id, setId] = useState("REP-240182"); const router = useRouter(); return <SiteChrome><div className="track-hero"><div className="container narrow"><p className="eyebrow">REPAIR TRACKING <PlaceholderTag/></p><h1>Know exactly where things stand.</h1><p>Enter your repair number to see the latest progress.</p><form onSubmit={e => { e.preventDefault(); router.push(`/track/${id || "REP-240182"}`); }}><Search/><input value={id} onChange={e => setId(e.target.value)} aria-label="Repair number" placeholder="Repair number, e.g. REP-240182"/><Button>Track repair <ArrowRight/></Button></form><small>Try the demo order: REP-240182</small></div></div></SiteChrome>; }
