  
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ExternalLink, Tags, X, Users2, CalendarCheck, LineChart, HeartPulse, RefreshCw, CheckCircle2, MinusCircle, Coffee, Heart, Lightbulb } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Toggle } from "@/components/ui/toggle";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

/*
  Release 1.1 — Adds clickable tags (apply filter) + minimal Pros/Cons on cards.
  Keeps: pastel peach accent, simplified compass splash, header without icon, tag dialog, icon groups.
*/

// THEME
const ACCENT_HEX = "#ffac80"; // pastel peach FAD4C0
const ACCENT_FG = "#2F1E1C"; // readable on peach
const BUY_ME_A_COFFEE_URL = "https://buymeacoffee.com/dasdaz";
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

// TAGS (for type inference only)
const TAGS = [
	"benchmark",
	"books",
	"communication",
	"community",
	"dashboards",
	"documentation",
	"feedback",
	"insight",
	"localization",
	"management",
	"playtesting",
	"podcast",
	"project management",
	"quality",
	"recommended",
	"rituals",
	"roadmapping",
	"scheduling",
	"team health",
	"testing",
	"toolbelt",
	"visualization",
	"workflows"
] as const;
export type Tag = typeof TAGS[number] | string;

// ICON FILTER GROUPS
const ICON_FILTERS: { key: string; label: string; description: string; icon: React.ElementType; tags: Tag[]; }[] = [
  { 
    key: "planning", 
    label: "Planning", 
    description: "Roadmaps, estimation, scheduling, capacity", 
    icon: CalendarCheck, 
    tags: ["roadmapping", "estimation", "scheduling", "capacity planning", "project management"] 
  },
  { 
    key: "people", 
    label: "People", 
    description: "Team health, onboarding, communication, feedback", 
    icon: Users2, 
    tags: ["team health", "onboarding", "feedback", "communication", "rituals", "retrospectives"] 
  },
  { 
    key: "delivery", 
    label: "Delivery", 
    description: "Workflows, automation, bug tracking", 
    icon: RefreshCw, 
    tags: ["workflows", "automation", "bug tracking"] 
  },
  { 
    key: "insight", 
    label: "Insight", 
    description: "Dashboards, visualization, playtesting", 
    icon: LineChart, 
    tags: ["dashboards", "visualization", "playtesting", "benchmark"] 
  },
  { 
    key: "quality", 
    label: "Quality", 
    description: "Retrospectives, risk management, templates", 
    icon: HeartPulse, 
    tags: ["risk management", "templates", "localization", "testing"] 
  },
  { 
    key: "inspiration", 
    label: "Inspiration", 
    description: "Books, podcasts, learning, community", 
    icon: Lightbulb, 
    tags: ["books", "podcast", "learning", "community"] 
  }
];


// DATA TYPES
export type ToolCard = {
  id: string;
  title: string;
  summary: string;
  tags: Tag[];
  link: string;
  thumbnail: string;
  authorNote?: string;
  // NEW 2.0 fields (optional)
  pros?: string[];
  cons?: string[];
};

// SAMPLE DATA
const TOOL_DATA: ToolCard[] = [
{
    id: "the-culture-map",
    title: "The Culture Map",
    summary: "Helps you work smoothly with international teams by navigating cultural differences without clichés.",
    tags: ["books", "communication", "team health", "recommended"],
    link: "https://www.amazon.co.uk/Culture-Map-Decoding-People-Cultures/dp/1610392760",
    thumbnail: "/thumbnails/the-culture-map.webp",
    pros: ["Great for building cross-cultural trust"],
    cons: ["Less relevant for small, local teams"]
  },
  {
    id: "the-power-of-moments",
    title: "The Power of Moments",
    summary: "Shows how to create rituals and milestones that actually feel meaningful for your team.",
    tags: ["books", "team health", "feedback", "rituals"],
    link: "https://www.amazon.co.uk/Power-Moments-Certain-Experiences-Extraordinary/dp/0593079264",
    thumbnail: "/thumbnails/power-of-moments.webp",
    pros: ["Inspires creative ways to celebrate wins"],
    cons: ["Needs tailoring to your team's culture"]
  },
  {
    id: "creativity-inc",
    title: "Creativity, Inc.",
    summary: "Pixar’s co-founder shares lessons on building a creative powerhouse, mistakes and all.",
    tags: ["books", "team health", "communication"],
    link: "https://www.amazon.co.uk/Creativity-Inc-Overcoming-Unseen-Inspiration/dp/0593070100",
    thumbnail: "/thumbnails/creativity-inc.webp",
    pros: ["Rich with real-world leadership stories"],
    cons: ["More inspirational than step-by-step"]
  },
  {
    id: "coffee-with-butterscotch",
    title: "Coffee with Butterscotch",
    summary: "Three brothers share candid indie dev stories, business lessons, and life with ADHD.",
    tags: ["podcast", "community"],
    link: "https://open.spotify.com/show/27Kgn6OHUaFJrvCVg1ZA7K",
    thumbnail: "/thumbnails/coffee-with-butterscotch.webp",
    pros: ["Honest indie dev perspective", "Entertaining and relatable"],
    cons: ["Casual tone may not suit everyone"]
  },
  {
    id: "game-makers-notebook",
    title: "The Game Maker's Notebook",
    summary: "Industry leaders share honest takes on creative processes, challenges, and leadership.",
    tags: ["podcast", "insight", "recommended"],
    link: "https://open.spotify.com/show/2yB9jTRog4XGCKG5bpNZUA",
    thumbnail: "/thumbnails/game-makers-notebook.webp",
    pros: ["High-profile guests", "Industry-proven insights"],
    cons: ["Long episodes require time commitment"]
  },
  {
    id: "gpc-podcast",
    title: "Game Production Community Podcast",
    summary: "Conversations from the GPC Discord, full of production tips, stories, and lessons.",
    tags: ["podcast", "community", "learning"],
    link: "https://open.spotify.com/show/4GNbLIr3CaqCrGiTWC41AT",
    thumbnail: "/thumbnails/gpc-podcast.webp",
    pros: ["Community-driven content"],
    cons: ["Varied production quality"]
  },
  {
    id: "favro",
    title: "Favro",
    summary: "Flexible project management with kanban boards, timelines, and docs in one place.",
    tags: ["management", "project management", "workflows", "scheduling"],
    link: "https://www.favro.com/",
    thumbnail: "/thumbnails/favro.webp",
    pros: ["Highly customizable workflows"],
    cons: ["Learning curve for new users"]
  },
  {
    id: "asana",
    title: "Asana",
    summary: "Popular task management tool with strong collaboration features.",
    tags: ["management", "project management", "workflows"],
    link: "https://asana.com/",
    thumbnail: "/thumbnails/asana.webp",
    pros: ["Strong integrations"],
    cons: ["Can feel cluttered for small teams"]
  },
  {
    id: "clickup",
    title: "ClickUp",
    summary: "All-in-one platform for tasks, docs, goals, and dashboards.",
    tags: ["management", "project management", "dashboards", "workflows"],
    link: "https://clickup.com/",
    thumbnail: "/thumbnails/clickup.webp",
    pros: ["Feature-rich"],
    cons: ["Overwhelming for simple use cases"]
  },
  {
    id: "basecamp",
    title: "Basecamp",
    summary: "Simple, communication-focused project management for teams.",
    tags: ["management", "communication", "project management"],
    link: "https://basecamp.com/",
    thumbnail: "/thumbnails/basecamp.webp",
    pros: ["Easy to onboard teams"],
    cons: ["Limited advanced PM features"]
  },
  {
    id: "notion",
    title: "Notion",
    summary: "Docs, wikis, and tasks in one space - brilliant if kept tidy, chaotic if not.",
    tags: ["management", "project management", "documentation", "recommended"],
    link: "https://www.notion.so/",
    thumbnail: "/thumbnails/notion.webp",
    pros: ["Holds almost everything in one place"],
    cons: ["Without structure, chaos creeps in fast"]
  },
  {
    id: "roadmunk",
    title: "Roadmunk",
    summary: "Purpose-built roadmapping with clear visuals and multiple views.",
    tags: ["roadmapping", "dashboards", "project management"],
    link: "https://roadmunk.com/",
    thumbnail: "/thumbnails/roadmunk.webp",
    pros: ["Clear roadmap visuals"],
    cons: ["Best suited for product teams"]
  },
  {
    id: "productplan",
    title: "ProductPlan",
    summary: "Collaborative roadmapping tool for aligning teams on product plans.",
    tags: ["roadmapping", "dashboards", "project management"],
    link: "https://www.productplan.com/",
    thumbnail: "/thumbnails/productplan.webp",
    pros: ["Easy collaboration on roadmaps"],
    cons: ["Subscription cost for small teams"]
  },
  {
    id: "monday",
    title: "Monday.com",
    summary: "Highly visual work OS for tracking projects, tasks, and roadmaps.",
    tags: ["roadmapping", "project management", "dashboards", "workflows"],
    link: "https://monday.com/",
    thumbnail: "/thumbnails/monday.webp",
    pros: ["Highly visual interface"],
    cons: ["Some features locked behind higher tiers"]
  },
  {
    id: "smartsheet",
    title: "Smartsheet",
    summary: "Spreadsheet-style tool for managing projects, roadmaps, and workflows.",
    tags: ["roadmapping", "project management", "dashboards", "scheduling"],
    link: "https://www.smartsheet.com/",
    thumbnail: "/thumbnails/smartsheet.webp",
    pros: ["Familiar spreadsheet feel"],
    cons: ["Interface can feel dated"]
  },
  {
    id: "miro",
    title: "Miro",
    summary: "A giant online whiteboard for brainstorming, mapping, and Post-it chaos.",
    tags: ["visualization", "workflows", "playtesting", "recommended"],
    link: "https://miro.com/",
    thumbnail: "/thumbnails/miro.webp",
    pros: ["Makes remote collaboration feel natural"],
    cons: ["License costs can add up"]
  },
  {
    id: "airtable",
    title: "Airtable",
    summary: "Database meets spreadsheet - flexible and great for linking complex data.",
    tags: ["toolbelt", "documentation", "dashboards", "project management"],
    link: "https://www.airtable.com/",
    thumbnail: "/thumbnails/airtable.webp",
    pros: ["Flexible relational database features"],
    cons: ["Limited offline support"]
  },
  {
    id: "crowdin",
    title: "Crowdin",
    summary: "Manages localization projects with collaborative translation workflows.",
    tags: ["localization", "workflows", "documentation"],
    link: "https://crowdin.com/",
    thumbnail: "/thumbnails/crowdin.webp",
    pros: ["Streamlines localization process"],
    cons: ["Pricing may not fit very small projects"]
  },
  {
    id: "company-of-one",
    title: "Company of One",
    summary: "Challenges the growth-at-all-costs mindset and promotes sustainable business.",
    tags: ["books", "project management"],
    link: "https://amzn.eu/d/9JWIxsO",
    thumbnail: "/thumbnails/company-of-one.webp",
    pros: ["Encourages sustainable business thinking"],
    cons: ["Not a step-by-step operations guide"]
  },
  {
    id: "four-thousand-weeks",
    title: "Four Thousand Weeks",
    summary: "Reframes time management around our finite lifespan - focus on what matters.",
    tags: ["books", "scheduling", "team health"],
    link: "https://www.amazon.co.uk/Four-Thousand-Weeks-Management-Mortals/dp/1847924018",
    thumbnail: "/thumbnails/four-thousand-weeks.webp",
    pros: ["Life-changing perspective on time"],
    cons: ["Philosophical rather than tactical"]
  },
  {
    id: "newzoo",
    title: "Newzoo",
    summary: "Market intelligence for games, esports, and mobile, with global reports and data.",
    tags: ["insight", "dashboards", "visualization", "benchmark"],
    link: "https://newzoo.com/",
    thumbnail: "/thumbnails/newzoo.webp",
    pros: ["Industry-standard data source"],
    cons: ["Full reports behind paywall"]
  },
  {
    id: "steamdb",
    title: "SteamDB",
    summary: "Tracks Steam game stats, pricing, player counts, and historical data.",
    tags: ["insight", "dashboards", "visualization", "benchmark"],
    link: "https://steamdb.info/",
    thumbnail: "/thumbnails/steamdb.webp",
    pros: ["Up-to-date store and player data"],
    cons: ["Unofficial, accuracy may vary"]
  },
  {
    id: "vginsights",
    title: "VG Insights",
    summary: "Indie-focused market research with Steam sales estimates and trends.",
    tags: ["insight", "dashboards", "visualization", "benchmark", "recommended"],
    link: "https://vginsights.com/",
    thumbnail: "/thumbnails/vginsights.webp",
    pros: ["Great for indie market research"],
    cons: ["Limited data on non-Steam platforms"]
  },
  {
    id: "teamretro",
    title: "TeamRetro",
    summary: "Online tool for running engaging retrospectives and gathering actionable team feedback.",
    tags: ["team health", "feedback", "rituals", "recommended"],
    link: "https://www.teamretro.com/",
    thumbnail: "/thumbnails/teamretro.webp",
    pros: ["Great templates for varied retro formats"],
    cons: ["Paid plans required for larger teams"]
  },
  {
    id: "untools",
    title: "Untools",
    summary: "Curated collection of thinking tools and frameworks to improve decision-making, problem-solving, and collaboration.",
    tags: ["workflows", "documentation", "rituals", "recommended"],
    link: "https://untools.co/",
    thumbnail: "/thumbnails/untools.webp",
    pros: ["Wide range of practical frameworks"],
    cons: ["Self-guided — no built-in structure"]
  },
  {
    id: "testrail",
    title: "TestRail",
    summary: "Comprehensive test case management platform with strong reporting and integrations.",
    tags: ["quality", "workflows", "dashboards", "testing"],
    link: "https://www.testrail.com/",
    thumbnail: "/thumbnails/testrail.webp",
    pros: ["Detailed reporting features"],
    cons: ["More setup effort than Jira-based options"]
  },
  {
    id: "milanote",
    title: "Milanote",
    summary: "A visual workspace for creative projects - great for moodboards, research, and early planning.",
    tags: ["visualization", "documentation"],
    link: "https://milanote.com/",
    thumbnail: "/thumbnails/milanote.webp",
    pros: ["Flexible visual layout"],
    cons: ["Less suited for structured project tracking"]
  }
];

// UTIL
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

function Splash({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onDone}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        <PocketSplashFlat />
      </motion.div>
    </motion.div>
  );
}

function PocketSplashFlat() {
  const rim = ACCENT_HEX;      // pastel peach (stitches, rim, needle)
  const cloth = "#FFF7F2";     // warm fabric #FFF7F2
  const seam = ACCENT_HEX;     // outline

  // Downward pocket mouth (dip in the middle)
  const MOUTH_PATH = "M78 92 Q120 106 162 92";

  // Rounded-bottom pocket (flat bottom w/ rounded corners)
  const POCKET_PATH =
    "M78 92 " +
    "Q120 106 162 92 " +
    "L162 148 " +
    "A12 12 0 0 1 150 160 " +
    "H90 " +
    "A12 12 0 0 1 78 148 " +
    "L78 92 Z";

  return (
    <svg
      width="240"
      height="240"
      viewBox="0 0 240 240"
      role="img"
      aria-label="Compass sliding into pocket (flat)"
    >
      {/* --- defs: lighter inner gradient & clip of pocket --- */}
      <defs>
        {/* Vertical inner fade: softer values than before */}
        <linearGradient id="pocketInnerGrad" x1="0" y1="92" x2="0" y2="160">
          <stop offset="0" stopColor="#000" stopOpacity="0.06" />
          <stop offset="0.5" stopColor="#000" stopOpacity="0.03" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </linearGradient>
        {/* Clip to keep shading strictly inside the pocket */}
        <clipPath id="pocketClip">
          <path d={POCKET_PATH} />
        </clipPath>
      </defs>

      {/* Pocket back (base fabric) */}
      <path d={POCKET_PATH} fill={cloth} stroke="transparent" />

      {/* Inner depth (behind the compass) */}
      <g clipPath="url(#pocketClip)">
        <rect x="70" y="85" width="92" height="76" fill="url(#pocketInnerGrad)" />
        {/* Even lighter dark band under the mouth */}
        <path d={MOUTH_PATH} stroke="#000" strokeWidth="4" opacity="0.03" fill="none" />
      </g>

      {/* Compass slides in (peeks out) */}
        <motion.g
          initial={{ y: -50 }}
          animate={{ y: 4 }}     // was 10 → stops higher, more of the compass visible
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
        <circle cx="120" cy="110" r="34" fill="#fff" stroke={rim} strokeWidth="4" />
        {/* Cardinal ticks */}
        <rect x="119" y="74" width="2" height="8" fill={rim} />
        <rect x="119" y="138" width="2" height="8" fill={rim} />
        <rect x="86" y="109" width="8" height="2" fill={rim} />
        <rect x="146" y="109" width="8" height="2" fill={rim} />
        {/* Needle + cap */}
        <polygon
          points="120,82 124,110 120,138 116,110"
          fill={rim}
          transform="rotate(35 120 110)"  // negative = clockwise → NE
        />
        <circle cx="120" cy="110" r="2.6" fill={rim} />
      </motion.g>

      {/* Pocket front + highlight */}
      <g>
        <path d={POCKET_PATH} fill={cloth} stroke={seam} strokeWidth="2.5" />
        {/* Lip highlight */}
        <path d={MOUTH_PATH} stroke="#FFFFFF" strokeWidth="2" opacity="0.6" fill="none" />
      </g>

      {/* Peach stitching */}
      <path
        d={MOUTH_PATH}
        stroke={rim}
        strokeWidth="2"
        fill="none"
        strokeDasharray="5 5"
        strokeLinecap="round"
      />

      {/* Subtle settle bounce */}
      <motion.g
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 1.0 }}
      />
    </svg>
  );
}

// TAG PICKER (dialog)
function TagPicker({ allTags, activeTags, setActiveTags }: { allTags: string[]; activeTags: string[]; setActiveTags: (v: string[]) => void; }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return allTags.filter(t => t.toLowerCase().includes(query));
  }, [q, allTags]);
  const toggle = (t: string) => setActiveTags(activeTags.includes(t) ? activeTags.filter(x => x !== t) : [...activeTags, t]);
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
              <label key={t} className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-lg hover:bg-muted/50">
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

// SUB-COMPONENTS
const IconPill: React.FC<{ active?: boolean; icon: React.ElementType; label: string; onClick: () => void; }> = ({ active, icon: Icon, label, onClick }) => (
  <Toggle pressed={!!active} onPressedChange={onClick} aria-label={label} className="flex items-center gap-2 rounded-2xl px-3 py-2 pp-hover data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
    <Icon className="h-4 w-4" />
    <span className="hidden sm:inline text-sm">{label}</span>
  </Toggle>
);

// UPDATED: accepts onTagClick and renders Pros/Cons
const ToolCardView: React.FC<{ tool: ToolCard; onTagClick?: (tag: string) => void }>= ({ tool, onTagClick }) => (
  <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
<Card className="relative overflow-hidden hover:shadow-lg transition-shadow rounded-2xl">
  {tool.tags.includes("recommended") && (
    <div className="absolute left-2 top-2">
      <div
        className="rounded-full bg-white text-[var(--primary)] p-1 shadow ring-1 ring-[var(--primary)]/40"
        title="Recommended"
        aria-label="Recommended"
      >
        <Heart className="h-4 w-4" strokeWidth={2} />
      </div>
    </div>
  )}
      <a href={tool.link} target="_blank" rel="noreferrer" aria-label={`Open source for ${tool.title}`}>
        <div className="aspect-video w-full bg-muted/40 overflow-hidden">
          <img src={tool.thumbnail} alt={`${tool.title} thumbnail`} className="h-full w-full object-cover" />
        </div>
      </a>
      <CardHeader className="pb-2">
        <CardTitle className="text-base sm:text-lg flex items-center justify-between gap-2">
          <span className="line-clamp-1">{tool.title}</span>
          <a href={tool.link} target="_blank" rel="noreferrer" className="shrink-0 pp-link">
            <Button size="icon" variant="ghost"><ExternalLink className="h-4 w-4" /></Button>
          </a>
        </CardTitle>
        <CardDescription className="line-clamp-3 text-sm">{tool.summary}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        {/* Clickable tags */}
        <div className="flex flex-wrap gap-2">
          {tool.tags.slice(0, 5).map((t) => (
            <button
              key={t}
              onClick={() => onTagClick?.(t)}
              className="rounded-full border px-2.5 py-1 text-xs hover:bg-[var(--primary)]/20 transition"
              aria-label={`Filter by ${t}`}
              title={`Filter by ${t}`}
            >
              {t}
            </button>
          ))}
        </div>
        {(tool.pros?.length || tool.cons?.length) ? (
          <div className="mt-3 grid grid-cols-1 gap-2 text-xs">
            {tool.pros?.length ? (
              <div className="flex flex-col gap-1">
                {tool.pros.slice(0, 3).map((p, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" color="#7ED957" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            ) : null}
            {tool.cons?.length ? (
              <div className="flex flex-col gap-1">
                {tool.cons.slice(0, 3).map((c, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <MinusCircle className="h-3.5 w-3.5 shrink-0" color="#FF6B6B" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
        {tool.authorNote && (
          <p className="mt-3 text-xs text-muted-foreground italic">Note: {tool.authorNote}</p>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

// MAIN APP
export default function PocketProducerApp() {
  const [query, setQuery] = useState("");
  const [activeGroups, setActiveGroups] = useState<string[]>([]);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sort, setSort] = useState<"title" | "recent">("title");
  const [showSplash, setShowSplash] = useState(true);

  // Load from URL on first render
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

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
        <div className="mx-auto max-w-6xl px-3 sm:px-4 py-3 flex items-center gap-2">
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight">The Pocket Producer<span style={{ color: ACCENT_HEX }}>.</span></h1>
          <span className="ml-auto hidden sm:inline text-sm text-muted-foreground">Curated • Minimal • Mobile-friendly</span>
        </div>
      </header>

      {/* Controls */}
      <section className="mx-auto max-w-6xl px-3 sm:px-4 py-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tools, tags, summaries…" className="pl-9 rounded-2xl" aria-label="Search" />
            </div>
          </div>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-2xl pp-hover pp-focus"><Filter className="h-4 w-4 mr-2"/>Sort</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSort("title")}>
                Title (A→Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort("recent")}>
                Recently Added
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Tag Picker Button */}
          <TagPicker allTags={allTags} activeTags={activeTags} setActiveTags={setActiveTags} />

          {/* Reset */}
          {(activeGroups.length || activeTags.length || query) ? (
            <Button variant="ghost" onClick={resetFilters} className="rounded-2xl">Reset</Button>
          ) : null}
        </div>

        {/* Icon Groups */}
        <div className="mt-3 flex flex-wrap gap-2">
          {ICON_FILTERS.map((g) => (
            <IconPill key={g.key} active={activeGroups.includes(g.key)} icon={g.icon} label={g.label}
              onClick={() => setActiveGroups((prev) => prev.includes(g.key) ? prev.filter((k) => k !== g.key) : [...prev, g.key])}
            />
          ))}
        </div>

        {/* Active Filters */}
        <AnimatePresence>
          {(activeTags.length > 0 || activeGroups.length > 0) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2"
            >
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

      {/* Results */}
      <main className="mx-auto max-w-6xl px-3 sm:px-4 pb-10">
        {filtered.length === 0 ? (
          <EmptyState onReset={resetFilters} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <AnimatePresence>
              {filtered.map((t) => (
                <ToolCardView key={t.id} tool={t} onTagClick={(tag) => setActiveTags((prev) => prev.includes(tag) ? prev : [...prev, tag])} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Footer helper */}
        <div className="mt-10 text-center text-sm text-muted-foreground">
          <p className="mt-1">Designed mobile-first. Try it on your phone ✨</p>
        </div>
        <div className="mt-6 flex justify-center">
          <a href={BUY_ME_A_COFFEE_URL} target="_blank" rel="noreferrer">
          <Button className="rounded-full px-4 py-2">
            <Coffee className="h-4 w-4 mr-2" /> Buy me a coffee
        </Button>
        </a>
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
