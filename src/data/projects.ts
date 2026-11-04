export interface Project {
  id: string;
  title: string;
  category: "dashboards-bi" | "data-engineering" | "data-modeling" | "training";
  categories: string[];
  role: string;
  organization?: string;
  featured: boolean;
  isCaseStudy?: boolean;
  stack: string[];
  summary: string;
  highlights: string[];
  metrics: { label: string; value: string }[];
  githubUrl?: string; // TODO: Replace with exact GitHub repository URL when available
  placeholderType: "dashboard" | "warehouse" | "pipeline" | "iot" | "curriculum";
  hasRealScreenshots: boolean;
}

export const projects: Project[] = [
  {
    id: "retail-sales-intelligence",
    title: "End-to-End Retail Sales Intelligence Platform",
    category: "data-engineering",
    categories: ["dashboards-bi", "data-engineering"],
    role: "Lead Data Analyst & Engineer",
    featured: true,
    stack: ["Microsoft Fabric", "PySpark", "SQL", "Power BI", "DAX"],
    summary:
      "A complete enterprise-grade retail intelligence platform processing 1.06M+ transaction records using a Bronze-Silver-Gold Medallion architecture inside Microsoft Fabric, paired with a comprehensive 4-page Power BI executive suite.",
    highlights: [
      "Engineered Bronze-Silver-Gold Medallion architecture handling 1.06M+ transactional rows with high-throughput PySpark notebooks.",
      "Embedded robust data validation logic retaining quality flags for transaction cancellations, negative quantities, and missing customer IDs.",
      "Engineered curated Gold-layer aggregations optimized for monthly revenue trends, geographic penetration, and product affinity.",
      "Designed and delivered a four-page Power BI dashboard suite: Executive Overview, Geographic Analysis, Product Performance, and Data Quality & Insights.",
      "Orchestrated continuous ingestion and transformation workflows seamlessly via Fabric Notebooks and data pipelines.",
    ],
    metrics: [
      { label: "Transactions Processed", value: "1.06M+" },
      { label: "Architecture", value: "Medallion (Bronze/Silver/Gold)" },
      { label: "Executive Dashboard", value: "4 Interactive Pages" },
      { label: "Orchestration", value: "Fabric Pipelines" },
    ],
    // TODO: Update with exact repository URL from github.com/samprathshanbhag once published
    githubUrl: "https://github.com/samprathshanbhag",
    placeholderType: "dashboard",
    hasRealScreenshots: false,
  },
  {
    id: "sitlbi-sales-data-warehouse",
    title: "SITLBI Sales Analytics Data Warehouse",
    category: "data-modeling",
    categories: ["data-modeling", "data-engineering"],
    role: "Developer",
    organization: "SustuneTech, Bengaluru",
    featured: true,
    isCaseStudy: true,
    stack: ["Microsoft Fabric", "T-SQL", "SQLDBM", "Semantic Models"],
    summary:
      "Enterprise dimensional data warehouse designed from the ground up in Microsoft Fabric to unify sales, accounts receivable, collections, inventory stock, recurring renewals, and quota targets across multiple business units.",
    highlights: [
      "Architected 9 dimension tables and 10 fact tables using production T-SQL, adhering to star schema standards and query performance benchmarks.",
      "Implemented SCD Type 2 (Slowly Changing Dimensions) history tracking, natural-to-surrogate key mappings, and automated audit metadata.",
      "Authored and maintained comprehensive enterprise entity-relationship models using SQLDBM, facilitating design reviews with C-suite and department leads.",
      "Constructed unified Lakehouse to Warehouse ingestion pipelines with Dataflows Gen2 and deployed high-performance Fabric Semantic Models.",
      "Strict confidentiality observed: architecture, key design principles, and technical methodology presented without proprietary company data.",
    ],
    metrics: [
      { label: "Dimension Tables", value: "9 Dimensions" },
      { label: "Fact Tables", value: "10 Facts" },
      { label: "History Tracking", value: "SCD Type 2" },
      { label: "Data Modeling", value: "SQLDBM ERD" },
    ],
    placeholderType: "warehouse",
    hasRealScreenshots: false,
  },
  {
    id: "smart-anti-theft-system",
    title: "Smart Anti-Theft Floor Mat System Using IoT & Sensors",
    category: "data-engineering",
    categories: ["data-engineering", "dashboards-bi"],
    role: "Lead Hardware & Algorithm Developer",
    featured: false,
    stack: ["Python", "Machine Learning", "IoT Sensors", "Signal Processing"],
    summary:
      "Engineered an IoT smart security system equipped with pressure and motion sensors, utilizing a machine learning filtering algorithm to eliminate ambient noise and enhance threat detection reliability.",
    highlights: [
      "Prototyped hardware sensor arrays integrated with embedded microcontrollers to capture physical vibration and pressure patterns.",
      "Developed a machine learning classification model that successfully filtered out 95% of irrelevant ambient noise and false alarms.",
      "Significantly elevated intrusion detection precision and validated system response times under varying load tests.",
    ],
    metrics: [
      { label: "Signal Noise Filtered", value: "95%" },
      { label: "Classification", value: "ML Classifier" },
      { label: "Verification", value: "100% Validated" },
    ],
    placeholderType: "iot",
    hasRealScreenshots: false,
  },
  {
    id: "fabric-intern-training-program",
    title: "Microsoft Fabric & Data Modeling Internship Program",
    category: "training",
    categories: ["training", "data-modeling"],
    role: "Technical Lead & Mentor",
    organization: "SustuneTech",
    featured: true,
    stack: ["Microsoft Fabric", "Lakehouse", "Dataflows Gen2", "SQL", "Data Modeling"],
    summary:
      "Created and instructed a rigorous 5-month data analytics engineering curriculum, mentoring 26 interns in modern cloud analytics and Fabric best practices to successful completion.",
    highlights: [
      "Authored a modular 5-month syllabus covering Lakehouse architecture, PySpark transformations, T-SQL star schemas, and Power BI semantic modeling.",
      "Conducted weekly live architectural design critiques, query optimization workshops, and milestone evaluations.",
      "Guided 26 junior engineers to successfully build and deploy production-grade portfolio projects.",
    ],
    metrics: [
      { label: "Interns Mentored", value: "26 Engineers" },
      { label: "Program Status", value: "Completed" },
      { label: "Curriculum Duration", value: "5 Months" },
    ],
    placeholderType: "curriculum",
    hasRealScreenshots: false,
  },
  {
    id: "trainity-analytics-case-studies",
    title: "Retail & Financial Datasets ETL & BI Analytics",
    category: "dashboards-bi",
    categories: ["dashboards-bi", "data-engineering"],
    role: "Data Analytics Trainee",
    organization: "Trainity",
    featured: false,
    stack: ["Python", "Pandas", "NumPy", "SQL", "Tableau", "EDA"],
    summary:
      "Executed comprehensive exploratory data analysis, ETL pipelines, and performance-tuned SQL extraction across 500K+ retail and financial records, culminating in 10+ interactive Tableau dashboards.",
    highlights: [
      "Cleaned, deduplicated, and transformed 500K+ multi-table raw records using Python (Pandas & NumPy).",
      "Authored 40+ optimized SQL queries with complex CTEs, window functions, and indexing, boosting query speed by 50%.",
      "Created 10+ interactive Tableau dashboards showcasing sales velocity, regional distributions, and customer churn metrics.",
    ],
    metrics: [
      { label: "Records Preprocessed", value: "500K+" },
      { label: "SQL Query Speedup", value: "+50%" },
      { label: "Tableau Dashboards", value: "10+ Delivered" },
    ],
    placeholderType: "pipeline",
    hasRealScreenshots: false,
  },
];

