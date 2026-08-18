"use client";
import { Button } from "@/components/ui";
export default function ErrorPage({ reset }: { reset(): void }) { return <main className="error-page"><span>!</span><h1>Something interrupted the repair flow.</h1><p>Your selections may still be available. Try loading this step again.</p><Button onClick={reset}>Try again</Button></main>; }
