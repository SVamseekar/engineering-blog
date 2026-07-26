export type ProjectEntry = {
  id: string;
  name: string;
  tagline: string;
  url?: string;
  demo?: string;
  repo?: string;
  docs?: string;
  color: string;
};

export const projects: ProjectEntry[] = [
  {
    id: "masova",
    name: "MaSoVa",
    tagline: "Restaurant OS — unified kitchen queue, KDS, delivery, fiscal ledgers",
    repo: "https://github.com/SVamseekar",
    color: "#c45c26",
  },
  {
    id: "aequitas",
    name: "Aequitas",
    tagline: "Transit safety and GIS route intelligence for dispatchers",
    color: "#2563eb",
  },
  {
    id: "workforceguard",
    name: "WorkforceGuard AI",
    tagline: "Fair shift scheduling and labor compliance before lawsuits",
    color: "#7c3aed",
  },
  {
    id: "eu-ai-assurance",
    name: "EU AI Assurance",
    tagline: "Risk tiers, lineage, and CI gates for the EU AI Act",
    color: "#0d9488",
  },
  {
    id: "meridian",
    name: "Meridian",
    tagline: "Multi-channel commercial analytics and defendable revenue numbers",
    color: "#db2777",
  },
];

export function getProject(id: string): ProjectEntry | undefined {
  return projects.find((p) => p.id === id);
}
