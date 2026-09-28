"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  Download,
  ExternalLink,
  MapPin,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { AppShell } from "@/components/ui/efferd-dashboard-2-utils/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgency } from "@/lib/agency-store";

type BusinessLead = {
  id?: number;
  name: string;
  category?: string;
  rating?: number | string;
  review_count?: number;
  address?: string;
  phone?: string;
  website?: string;
  source?: string;
  search_query?: string;
  search_location?: string;
  imported?: boolean;
};

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=200&q=80";

export default function LeadFinderPage() {
  const { addLead } = useAgency();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<BusinessLead[]>([]);
  const [savedLeads, setSavedLeads] = useState<BusinessLead[]>([]);
  const [importedKeys, setImportedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    refreshSaved();
  }, []);

  async function refreshSaved() {
    try {
      const res = await fetch("/api/lead-finder");
      const data = await res.json();
      if (Array.isArray(data)) setSavedLeads(data);
    } catch {
      /* ignore */
    }
  }

  async function onCrawl(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const res = await fetch("/api/lead-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, location }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Crawl failed.");
        return;
      }
      setResults(data.leads || []);
      await refreshSaved();
    } catch {
      setError("The request did not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  function importLead(business: BusinessLead) {
    const key = business.name + (business.address || "");
    addLead({
      id: `lf-${Date.now()}`,
      name: business.name,
      company: business.name,
      source: "Google Maps",
      value: 0,
      stage: "Baru",
      owner: "",
      image: PLACEHOLDER_IMG,
      externalId: key,
    });
    setImportedKeys((prev) => new Set(prev).add(key));
  }

  function isImported(business: BusinessLead) {
    const key = business.name + (business.address || "");
    return importedKeys.has(key);
  }

  async function deleteLead(id: number) {
    await fetch(`/api/lead-finder?id=${id}`, { method: "DELETE" });
    setSavedLeads((prev) => prev.filter((l) => l.id !== id));
  }

  const ratingStr = (r?: number | string) =>
    r !== undefined && r !== null ? String(r) : "—";

  return (
    <AppShell>
      <PageHeader
        action={
          <Button
            disabled={loading || !query || !location}
            onClick={() => onCrawl(new Event("submit") as unknown as FormEvent)}
            size="sm"
          >
            <Search />
            {loading ? "Crawling…" : "Crawl"}
          </Button>
        }
        description="Search Google Maps for businesses by category and location. Results are saved to PostgreSQL and can be imported as prospek."
        eyebrow="Growth"
        title="Lead Finder"
      />

      {/* Search form */}
      <form
        className="grid gap-3 border-b px-4 py-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:px-6"
        onSubmit={onCrawl}
      >
        <div className="grid gap-1.5">
          <Label htmlFor="lf-query">What are you looking for?</Label>
          <Input
            id="lf-query"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. coffee shops, dentists, gyms"
            value={query}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="lf-location">Location</Label>
          <Input
            id="lf-location"
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Jakarta, Bandung, Surabaya"
            value={location}
          />
        </div>
        <Button className="hidden sm:block" disabled={loading} type="submit">
          <MapPin />
          {loading ? "Crawling…" : "Find leads"}
        </Button>
      </form>

      {/* Error */}
      {error ? (
        <p className="px-4 py-3 text-destructive text-sm sm:px-6">{error}</p>
      ) : null}

      {/* Crawl results */}
      {loading ? (
        <div className="grid gap-2 px-4 py-4 sm:px-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton className="h-16 w-full" key={i} />
          ))}
        </div>
      ) : null}

      {!loading && results.length > 0 ? (
        <div className="px-4 py-4 sm:px-6">
          <h2 className="mb-3 font-medium text-sm">
            Crawl results ({results.length})
          </h2>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Business</th>
                  <th className="px-3 py-2 font-medium">Category</th>
                  <th className="px-3 py-2 font-medium">Rating</th>
                  <th className="px-3 py-2 font-medium">Reviews</th>
                  <th className="px-3 py-2 font-medium">Website</th>
                  <th className="px-3 py-2 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {results.map((biz, i) => (
                  <tr key={biz.name + i} className="hover:bg-muted/30">
                    <td className="px-3 py-2 font-medium">{biz.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {biz.category || "—"}
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center gap-1">
                        <Star className="size-3 text-amber-500" />
                        {ratingStr(biz.rating)}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {biz.reviewCount ?? "—"}
                    </td>
                    <td className="px-3 py-2">
                      {biz.website ? (
                        <a
                          className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                          href={biz.website}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Visit <ExternalLink className="size-3" />
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Button
                        disabled={isImported(biz)}
                        onClick={() => importLead(biz)}
                        size="sm"
                        variant={isImported(biz) ? "secondary" : "default"}
                      >
                        <Download className="size-3" />
                        {isImported(biz) ? "Imported" : "Import"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {/* Saved leads from database */}
      <div className="px-4 py-4 sm:px-6">
        <h2 className="mb-3 font-medium text-sm">
          Saved business leads ({savedLeads.length})
        </h2>
        {savedLeads.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Crawled businesses will appear here once you run a search.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Business</th>
                  <th className="px-3 py-2 font-medium">Category</th>
                  <th className="px-3 py-2 font-medium">Rating</th>
                  <th className="px-3 py-2 font-medium">Searched</th>
                  <th className="px-3 py-2 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {savedLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-muted/30">
                    <td className="px-3 py-2 font-medium">{lead.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {lead.category || "—"}
                    </td>
                    <td className="px-3 py-2">{ratingStr(lead.rating)}</td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {lead.search_query} · {lead.search_location}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          onClick={() => importLead(lead)}
                          size="sm"
                          variant={isImported(lead) ? "secondary" : "default"}
                        >
                          <Download className="size-3" />
                          {isImported(lead) ? "Imported" : "Import"}
                        </Button>
                        {lead.id ? (
                          <Button
                            onClick={() => deleteLead(lead.id)}
                            size="icon"
                            variant="ghost"
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
