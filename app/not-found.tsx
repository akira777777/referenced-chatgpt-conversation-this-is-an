import Link from "next/link";
import { ArrowRight } from "lucide-react";
export default function NotFound() { return <main className="error-page"><span>404</span><h1>This page needs a different route.</h1><p>The device or page may have moved. Start a repair or return home.</p><div><Link className="button" href="/repair">Start a repair <ArrowRight/></Link><Link className="button button-secondary" href="/">Return home</Link></div></main>; }
