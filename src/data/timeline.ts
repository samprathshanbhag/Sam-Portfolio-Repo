export interface TimelineItem {
  id: string;
  order: string; // "01 / 05", etc.
  date: string;
  year: string;
  title: string;
  organization: string;
  badge?: string;
  roleType: "Certification" | "Experience" | "Education" | "Training" | "Internship";
  description: string;
  bullets: string[];
  skills: string[];
}

export const timeline: TimelineItem[] = [
  {
    id: "dp600-certification",
    order: "01 / 05",
    date: "Oct 2026",
    year: "2026",
    title: "Microsoft Certified: Fabric Analytics Engineer Associate (DP-600)",
    organization: "Microsoft",
    badge: "Score: 919 / 1000",
    roleType: "Certification",
    description:
      "Earned Microsoft's premier certification for analytics engineering, demonstrating advanced proficiency in Fabric Lakehouses, dimensional Warehouses, and Semantic Models with a top-tier score of 919/1000.",
    bullets: [
      "Validated end-to-end expertise in Microsoft Fabric: Lakehouse architecture, PySpark ingestion, Delta Parquet storage, and DAX optimization.",
      "Achieved a 919/1000 score, demonstrating mastery in architecting scalable enterprise data platforms and governed semantic models.",
    ],
    skills: ["Microsoft Fabric", "Lakehouse", "Warehouse", "DAX", "Data Modeling", "Semantic Models"],
  },
  {
    id: "sustunetech-developer",
    order: "02 / 05",
    date: "Sep 2025 – Present",
    year: "2025",
    title: "Developer",
    organization: "SustuneTech, Bengaluru",
    roleType: "Experience",
    description:
      "Leading enterprise data architecture and Fabric implementations for multi-domain sales intelligence, while establishing data modeling best practices across engineering teams.",
    bullets: [
      "Led design of the SITLBI Sales Analytics Data Warehouse in Microsoft Fabric: 9 dimension and 10 fact tables in T-SQL covering sales, AR, collections, stock, renewals and targets; coordinated design reviews with senior stakeholders.",
      "Implemented surrogate/natural keys, SCD Type 2 history tracking and audit fields; documented the model with an ER diagram in SQLDBM.",
      "Primary technical contributor on end-to-end analytics workflows (ingestion, modeling, reporting) using Lakehouse, Dataflows Gen2 and Semantic Models; worked directly with leadership on design and performance best practices.",
      "Guided 26 interns on Microsoft Fabric and data modeling across a 5-month curriculum, achieving a 90%+ completion rate.",
    ],
    skills: ["Microsoft Fabric", "T-SQL", "SQLDBM", "SCD Type 2", "Dataflows Gen2", "Lakehouse", "Mentorship"],
  },
  {
    id: "dbit-graduation",
    order: "03 / 05",
    date: "Jun 2025",
    year: "2025",
    title: "B.E. in Electronics & Communication Engineering",
    organization: "Don Bosco Institute of Technology, Bengaluru (VTU)",
    badge: "CGPA: 7.96",
    roleType: "Education",
    description:
      "Completed an engineering degree focused on mathematical analysis, digital logic, and computation. Developed the ML-based Smart Anti-Theft Floor Mat system as a capstone project.",
    bullets: [
      "Built rigorous computational and quantitative foundation in signal processing, statistical methods, and algorithmic logic.",
      "Engineered an IoT smart anti-theft floor mat system utilizing machine learning to filter 95% of irrelevant sensor noise for accurate threat detection.",
      "Graduated with a strong academic record (CGPA 7.96).",
    ],
    skills: ["Python", "Machine Learning", "Statistical Analysis", "Algorithms", "IoT", "Problem Solving"],
  },
  {
    id: "trainity-trainee",
    order: "04 / 05",
    date: "Apr 2025 – Jun 2025",
    year: "2025",
    title: "Data Analytics Trainee",
    organization: "Trainity (Training Program & Case Projects)",
    roleType: "Training",
    description:
      "Intensive analytics immersion covering Python ETL pipelines, complex SQL querying, and executive visualization on large-scale datasets.",
    bullets: [
      "Cleaned and preprocessed 500K+ records with Python (Pandas, NumPy) and built ETL pipelines for retail and finance datasets.",
      "Wrote 40+ optimized SQL queries, improving extraction speed by 50%.",
      "Built 10+ interactive Tableau dashboards and applied EDA to surface trends, anomalies and key patterns.",
    ],
    skills: ["Python", "Pandas", "NumPy", "SQL", "Tableau", "EDA", "ETL Pipelines"],
  },
  {
    id: "etech-prowess-intern",
    order: "05 / 05",
    date: "Feb 2025 – May 2025",
    year: "2025",
    title: "Student Intern",
    organization: "eTech Prowess",
    roleType: "Internship",
    description:
      "Conducted digital IC design verification and simulation testing for high-reliability semiconductor memory and processor architectures.",
    bullets: [
      "Tested and verified 15+ digital IC designs (memory units, processor cores) using simulation tools.",
      "Documented 8 design issues with 100% resolution before submission.",
    ],
    skills: ["IC Verification", "Simulation Tools", "Root-Cause Analysis", "Technical Documentation"],
  },
];

