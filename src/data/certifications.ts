export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  score?: string;
  featured: boolean;
  credentialUrl?: string; // Optional external link or verification
  description?: string;
  skills: string[];
}

export const certifications: Certification[] = [
  {
    id: "dp-600",
    title: "Microsoft Certified: Fabric Analytics Engineer Associate (DP-600)",
    issuer: "Microsoft",
    date: "Oct 2026",
    score: "919 / 1000",
    featured: true,
    description:
      "Prestigious professional certification demonstrating enterprise mastery in designing, building, and deploying end-to-end data analytics solutions using Microsoft Fabric, Lakehouse architecture, T-SQL data warehousing, and Power BI semantic models.",
    skills: ["Microsoft Fabric", "Lakehouse", "Data Warehouse", "Semantic Models", "DAX", "PySpark"],
  },
  {
    id: "google-prompting",
    title: "Google Prompting Essentials",
    issuer: "Google (Coursera)",
    date: "May 2026",
    featured: false,
    description:
      "Practical mastery in modern generative AI prompt engineering, structured reasoning, and multi-turn workflows for data analysis and development efficiency.",
    skills: ["AI Prompting", "Generative AI", "Reasoning Workflows"],
  },
  {
    id: "google-ai-essentials",
    title: "Google AI Essentials",
    issuer: "Google (Coursera)",
    date: "May 2026",
    featured: false,
    description:
      "Foundational program covering responsible AI deployment, machine learning concepts, automated workflows, and data-centric decision making.",
    skills: ["Responsible AI", "Applied ML", "Data Automation"],
  },
  {
    id: "power-bi-workshop",
    title: "Power BI Workshop",
    issuer: "Microsoft Partner Community",
    date: "2025",
    featured: false,
    description:
      "Hands-on workshop exploring advanced data modeling, row-level security (RLS), DAX measures, and enterprise report distribution.",
    skills: ["Power BI", "DAX", "Data Modeling", "Dashboard Design"],
  },
  {
    id: "fabric-analyst-in-a-day",
    title: "Fabric Analyst in a Day",
    issuer: "Microsoft",
    date: "2025",
    featured: false,
    description:
      "Comprehensive Microsoft immersion into unified SaaS analytics with OneLake, Dataflows Gen2, Lakehouse shortcuts, and Direct Lake semantic models.",
    skills: ["OneLake", "Direct Lake", "Dataflows Gen2", "Microsoft Fabric"],
  },
  {
    id: "deloitte-data-simulation",
    title: "Deloitte Australia Data Analytics Job Simulation",
    issuer: "Forage",
    date: "2025",
    featured: false,
    description:
      "Simulated enterprise client engagement focused on exploratory analysis, data cleansing, identifying performance bottlenecks, and executive reporting.",
    skills: ["Client Advisory", "Data Validation", "Root-Cause Analysis", "Storytelling"],
  },
  {
    id: "excelr-data-science",
    title: "Data Science with Machine Learning",
    issuer: "ExcelR",
    date: "2025",
    featured: false,
    description:
      "Intensive training in statistical data analysis, Python exploratory frameworks, regression, classification, and predictive modeling.",
    skills: ["Python", "Machine Learning", "Statistics", "Pandas", "Scikit-Learn"],
  },
];

