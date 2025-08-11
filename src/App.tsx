
/*
 Release 1 — 2025-08-11
 Baseline: v3.1 (stable) — pastel peach accent, simplified compass splash, Tag Picker dialog, header without icon.
*/
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ExternalLink, Tags, X, Users2, CalendarCheck, LineChart, Brain, HeartPulse, RefreshCw } from "lucide-react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./components/ui/dropdown-menu";
import { Toggle } from "./components/ui/toggle";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";
import { Checkbox } from "./components/ui/checkbox";

const ACCENT_HEX = "#bf8ed1"; // pastel peach
const ACCENT_FG = "#2F1E1C";

function StyleInjector() {
  return (
    <style>{`
      :root{ --primary: ${ACCENT_HEX}; --primary-foreground: ${ACCENT_FG}; --ring: ${ACCENT_HEX}; }
      .pp-hover:hover{ background-color: ${ACCENT_HEX}33; }
      .pp-focus:focus-visible{ box-shadow: 0 0 0 2px ${ACCENT_HEX}; }
      .pp-link:hover{ color: ${ACCENT_HEX}; }
    `}</style>
  );
}

// Debounce
function useDebounced<T>(value: T, delay = 200) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => { const t = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return debounced;
}
function useQuerySync(filters: string[], tags: string[], q: string) {
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.length) params.set("groups", filters.join(","));
    if (tags.length) params.set("tags", tags.join(","));
    if (q) params.set("q", q);
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", url);
  }, [filters, tags, q]);
}

// Splash (simple compass only)
function Splash({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 1800); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onDone}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 160, damping: 14 }}>
        <CompassSVG />
      </motion.div>
    </motion.div>
  );
}
function CompassSVG() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" role="img" aria-label="Pocket Producer intro animation">
      <motion.circle cx="80" cy="80" r="50" className="fill-background" stroke={ACCENT_HEX} strokeWidth="3" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}/>
      <motion.g style={{ transformOrigin: "80px 80px" }}
        animate={{ rotate: [-90, 40, -20, 10, 0] }}
        transition={{ duration: 1.2, ease: "easeOut", times: [0, 0.25, 0.45, 0.7, 1] }}>
        <polygon points="80,40 85,80 80,120 75,80" fill={ACCENT_HEX} />
      </motion.g>
    </svg>
  );
}

// Data
type Tag = string;
type ToolCardT = { id: string; title: string; summary: string; tags: Tag[]; link: string; thumbnail: string; authorNote?: string; };
const TOOL_DATA: ToolCardT[] = [
  { id: "story-map-101", title: "Story Mapping 101", summary: "Visualize features along a backbone and slices for scope alignment.", tags: ["visualization", "planning", "roadmapping", "documentation"], link: "https://example.com/story-mapping", thumbnail: "https://picsum.photos/seed/storymap/640/360", authorNote: "Great for defining vertical slices." },
  { id: "retro-card-pack", title: "Retro Card Pack", summary: "Prompt cards for healthier retros and concrete experiments.", tags: ["retrospectives", "team health", "templates", "feedback"], link: "https://example.com/retro-cards", thumbnail: "https://picsum.photos/seed/retro/640/360" },
  { id: "scope-slicer", title: "Scope Slicer", summary: "Impact/Effort matrix to cut scope quickly pre-demo.", tags: ["risk management", "workflows", "planning"], link: "https://example.com/scope-slicer", thumbnail: "https://picsum.photos/seed/scope/640/360" },
  { id: "playtest-discord", title: "Playtest Discord Finder", summary: "Directory of Discords to recruit playtesters fast.", tags: ["playtesting", "community", "feedback", "communication"], link: "https://example.com/playtest-discord", thumbnail: "https://picsum.photos/seed/discord/640/360" },
  { id: "jira-quickflows", title: "Jira Quickflows", summary: "Minimal Jira workflows with lightweight automation.", tags: ["workflows", "automation", "bug tracking", "documentation"], link: "https://example.com/jira-quickflows", thumbnail: "https://picsum.photos/seed/jira/640/360" },
  { id: "capacity-lite", title: "Capacity Lite", summary: "One‑pager to model capacity with vacations & events.", tags: ["capacity planning", "scheduling", "project management", "templates"], link: "https://example.com/capacity-lite", thumbnail: "https://picsum.photos/seed/capacity/640/360" },
];

const ICON_FILTERS = [
  { key: "planning", label: "Planning", tags: ["roadmapping", "estimation", "scheduling", "capacity planning"], icon: CalendarCheck },
  { key: "people", label: "People", tags: ["team health", "onboarding", "feedback", "communication"], icon: Users2 },
  { key: "delivery", label: "Delivery", tags: ["workflows", "bug tracking", "automation"], icon: RefreshCw },
  { key: "insight", label: "Insight", tags: ["dashboards", "visualization", "playtesting"], icon: LineChart },
  { key: "quality", label: "Quality", tags: ["retrospectives", "risk management", "templates"], icon: HeartPulse },
  { key: "knowledge", label: "Knowledge", tags: ["documentation", "community"], icon: Brain },
] as const;

const IconPill: React.FC<{ active?: boolean; icon: React.ElementType; label: string; onClick: () => void; }> = ({ active, icon: Icon, label, onClick }) => (
  <Toggle pressed={!!active} onPressedChange={onClick} aria-label={label} className="flex items-center gap-2 rounded-2xl px-3 py-2 pp-hover">
    <Icon className="h-4 w-4" />
    <span className="hidden sm:inline text-sm">{label}</span>
  </Toggle>
);

const ToolCardView: React.FC<{ tool: ToolCardT }>= ({ tool }) => (
  <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
    <Card className="overflow-hidden hover:shadow-lg transition-shadow rounded-2xl">
      <div className="aspect-video w-full bg-gray-100 overflow-hidden">
        <img src={tool.thumbnail} alt={`${tool.title} thumbnail`} className="h-full w-full object-cover" />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-base sm:text-lg flex items-center justify-between gap-2">
          <span className="line-clamp-1">{tool.title}</span>
          <a href={tool.link} target="_blank" rel="noreferrer" aria-label={`Open source for ${tool.title}`} className="shrink-0 pp-link">
            <Button size="icon" variant="ghost"><ExternalLink className="h-4 w-4" /></Button>
          </a>
        </CardTitle>
        <CardDescription className="line-clamp-3 text-sm">{tool.summary}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <div className="flex flex-wrap gap-2">
          {tool.tags.slice(0, 5).map((t) => (
            <Badge key={t} variant="outline" className="rounded-full text-xs">{t}</Badge>
          ))}
        </div>
        {tool.authorNote && (
          <p className="mt-3 text-xs text-muted-foreground italic">Note: {tool.authorNote}</p>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

function TagPicker({ allTags, activeTags, setActiveTags }: { allTags: string[]; activeTags: string[]; setActiveTags: (v: string[]) => void; }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return allTags.filter(t => t.toLowerCase().includes(query));
  }, [q, allTags]);
  const toggle = (t: string) => {
    setActiveTags(activeTags.includes(t) ? activeTags.filter(x => x !== t) : [...activeTags, t]);
  };
  const clear = () => setActiveTags([]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-2xl pp-hover pp-focus">
          <Tags className="h-4 w-4 mr-2" /> Tags{activeTags.length ? ` (${activeTags.length})` : ""}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Select tags</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tags…" className="pl-9 rounded-2xl" />
          </div>
          <div className="max-h-64 overflow-auto rounded-xl border p-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
            {filtered.map((t) => (
              <label key={t} className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-lg hover:bg-gray-50">
                <Checkbox checked={activeTags.includes(t)} onCheckedChange={() => toggle(t)} />
                <span className="text-sm">{t}</span>
              </label>
            ))}
            {filtered.length === 0 && (
              <div className="text-sm text-muted-foreground px-2 py-1">No tags match "{q}"</div>
            )}
          </div>
          <div className="flex justify-between">
            <Button variant="ghost" onClick={clear} className="rounded-2xl">Clear</Button>
            <Button onClick={() => setOpen(false)} className="rounded-2xl">Done</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [activeGroups, setActiveGroups] = useState<string[]>([]);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sort, setSort] = useState<"title" | "recent">("title");
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const groups = params.get("groups")?.split(",").filter(Boolean) ?? [];
    const tags = params.get("tags")?.split(",").filter(Boolean) ?? [];
    const q = params.get("q") ?? "";
    setActiveGroups(groups);
    setActiveTags(tags);
    setQuery(q);
  }, []);

  const debouncedQuery = useDebounced(query);
  useQuerySync(activeGroups, activeTags, debouncedQuery);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    TOOL_DATA.forEach((t) => t.tags.forEach((x) => s.add(x)));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, []);

  const groupTagSet = useMemo(() => new Set(
    ICON_FILTERS.filter(g => activeGroups.includes(g.key)).flatMap(g => g.tags)
  ), [activeGroups]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return TOOL_DATA.filter((tool) => {
      const textOk = q ? (tool.title + " " + tool.summary + " " + tool.tags.join(" ")).toLowerCase().includes(q) : true;
      const groupsOk = groupTagSet.size ? tool.tags.some((t) => groupTagSet.has(t)) : true;
      const tagsOk = activeTags.length ? activeTags.every((t) => tool.tags.includes(t)) : true;
      return textOk && groupsOk && tagsOk;
    }).sort((a, b) => (sort === "title" ? a.title.localeCompare(b.title) : b.id.localeCompare(a.id)));
  }, [debouncedQuery, activeTags, groupTagSet, sort]);

  const resetFilters = () => { setActiveGroups([]); setActiveTags([]); setQuery(""); };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StyleInjector />
      <AnimatePresence>{showSplash && (<Splash onDone={() => setShowSplash(false)} />)}</AnimatePresence>
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b">
        <div className="mx-auto max-w-6xl px-3 sm:px-4 py-3 flex items-center gap-2">
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight">The Pocket Producer</h1>
          <span className="ml-auto hidden sm:inline text-sm text-muted-foreground">Indie-first • Minimal • Mobile-friendly</span>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-3 sm:px-4 py-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tools, tags, summaries…" className="pl-9 rounded-2xl" aria-label="Search" />
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-2xl pp-hover pp-focus"><Filter className="h-4 w-4 mr-2"/>Sort</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSort("title")}>Title (A→Z)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort("recent")}>Recently Added</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <TagPicker allTags={allTags} activeTags={activeTags} setActiveTags={setActiveTags} />

          {(activeGroups.length || activeTags.length || query) ? (
            <Button variant="ghost" onClick={resetFilters} className="rounded-2xl">Reset</Button>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {ICON_FILTERS.map((g) => (
            <IconPill key={g.key} active={activeGroups.includes(g.key)} icon={g.icon} label={g.label}
              onClick={() => setActiveGroups((prev) => prev.includes(g.key) ? prev.filter((k) => k !== g.key) : [...prev, g.key])}
            />
          ))}
        </div>

        <AnimatePresence>
          {(activeTags.length > 0 || activeGroups.length > 0) && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-2">
              <div className="flex items-center flex-wrap gap-2">
                {activeGroups.map((k) => {
                  const grp = ICON_FILTERS.find((g) => g.key === k)!;
                  const Icon = grp.icon;
                  return (
                    <Badge key={k} className="rounded-full px-3 py-1" variant="default">
                      <Icon className="h-3 w-3 mr-1"/>{grp.label}
                      <button className="ml-1" aria-label={`Remove ${grp.label}`} onClick={() => setActiveGroups((prev) => prev.filter((x) => x !== k))}><X className="h-3 w-3"/></button>
                    </Badge>
                  );
                })}
                {activeTags.map((t) => (
                  <Badge key={t} className="rounded-full px-3 py-1" variant="outline">
                    {t}
                    <button className="ml-1" aria-label={`Remove ${t}`} onClick={() => setActiveTags((prev) => prev.filter((x) => x !== t))}><X className="h-3 w-3"/></button>
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <main className="mx-auto max-w-6xl px-3 sm:px-4 pb-10">
        {filtered.length === 0 ? (
          <EmptyState onReset={resetFilters} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <AnimatePresence>
              {filtered.map((t) => (<ToolCardView key={t.id} tool={t} />))}
            </AnimatePresence>
          </div>
        )}

        <div className="mt-10 text-center text-sm text-muted-foreground">
          <p>Add or edit content in <code>TOOL_DATA</code>. Icon groups live in <code>ICON_FILTERS</code>.</p>
          <p className="mt-1">Designed mobile-first. Try it on your phone ✨</p>
        </div>
      </main>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg">No results</CardTitle>
        <CardDescription>Try removing a filter or broadening your search.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button onClick={onReset} className="rounded-2xl">Clear all filters</Button>
        </div>
      </CardContent>
    </Card>
  );
}
