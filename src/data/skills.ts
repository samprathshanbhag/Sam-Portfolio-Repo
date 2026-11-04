export interface SkillDoor {
  id: string;
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  tools: string[];
  metrics: string[];
  accent: string;
}

export const skillDoors: SkillDoor[] = [
  {
    id: "dashboards-bi",
    slug: "/dashboards-bi",
    number: "01",
    title: "Dashboards & BI",
    subtitle: "Turning dense datasets into high-signal executive decisions",
    description:
      "Transforming messy multi-source data into intuitive, fast-loading Power BI & Tableau dashboards with custom DAX calculations, interactive drill-downs, and actionable business storytelling.",
    tools: ["Power BI", "DAX", "Tableau", "Excel", "Data Storytelling"],
    metrics: ["10+ Dashboards Delivered", "4-Page Retail Executive Suite", "1.06M+ Transactions Analyzed"],
    accent: "#E8B04A",
  },
  {
    id: "data-engineering",
    slug: "/data-engineering",
    number: "02",
    title: "Data Engineering",
    subtitle: "Resilient ETL/ELT pipelines across Bronze-Silver-Gold Lakehouse layers",
    description:
      "Engineering end-to-end data pipelines using Microsoft Fabric Lakehouse, PySpark, Python, and Dataflows Gen2 with built-in data quality flags, deduplication, and automated orchestration.",
    tools: ["Microsoft Fabric", "PySpark", "Python", "Dataflows Gen2", "Notebooks", "Pipelines"],
    metrics: ["1.5M+ Total Records Processed", "Medallion Architecture", "Automated DQ Flagging"],
    accent: "#64B5F6",
  },
  {
    id: "data-modeling",
    slug: "/data-modeling",
    number: "03",
    title: "Data Modeling & Warehousing",
    subtitle: "Star schemas, SCD Type 2 history, and enterprise dimensional warehouses",
    description:
      "Architecting robust dimensional warehouses in T-SQL and Fabric Warehouse. Designing surrogate and natural keys, implementing SCD Type 2 tracking, and mapping ER diagrams in SQLDBM.",
    tools: ["T-SQL", "Microsoft Fabric Warehouse", "SQLDBM", "Star Schema", "SCD Type 2", "Semantic Models"],
    metrics: ["9 Dimension Tables", "10 Fact Tables", "Full SCD2 Audit Tracking"],
    accent: "#81C784",
  },
  {
    id: "training",
    slug: "/training",
    number: "04",
    title: "Training & Mentoring",
    subtitle: "Empowering teams and interns on modern data architectures",
    description:
      "Mentoring aspiring data engineers and analysts on Microsoft Fabric, data modeling, SQL optimization, and analytics workflows with structured hands-on curricula and peer code reviews.",
    tools: ["Microsoft Fabric", "Curriculum Design", "Mentorship", "Stakeholder Communication"],
    metrics: ["26 Interns Guided", "Curriculum Completed", "5-Month Intensive Curriculum"],
    accent: "#BA68C8",
  },
];

