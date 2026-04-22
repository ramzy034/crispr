import { motion } from "framer-motion";
import { BookOpen, ExternalLink } from "lucide-react";
import { useLang } from "../lib/LangContext";
import { UI } from "../lib/translations";

type Reference = {
  authors: string;
  year: number;
  title: string;
  journal: string;
  note?: string;
  url: string;
};

type Category = {
  category: string;
  color: string;
  items: Reference[];
};

const REFS: Category[] = [
  {
    category: "Foundational Discovery",
    color: "#4fc3f7",
    items: [
      {
        authors: "Ishino Y, Shinagawa H, Makino K, Amemura M, Nakata A.",
        year: 1987,
        title: "Nucleotide sequence of the iap gene, responsible for alkaline phosphatase isozyme conversion in Escherichia coli, and identification of the gene product.",
        journal: "J. Bacteriol. 169(12):5429–5433",
        note: "First incidental observation of CRISPR-like repeats. Their immune function was unknown at the time.",
        url: "https://pubmed.ncbi.nlm.nih.gov/3316184/",
      },
      {
        authors: "Mojica FJM, Díez-Villaseñor C, García-Martínez J, Soria E.",
        year: 2005,
        title: "Intervening sequences of regularly spaced prokaryotic repeats derive from foreign genetic elements.",
        journal: "J. Mol. Evol. 60:174–182",
        note: "Established that CRISPR spacers match viral and plasmid sequences — the 'immune memory' hypothesis.",
        url: "https://pubmed.ncbi.nlm.nih.gov/15791728/",
      },
      {
        authors: "Jinek M, Chylinski K, Fonfara I, Hauer M, Doudna JA, Charpentier E.",
        year: 2012,
        title: "A programmable dual-RNA–guided DNA endonuclease in adaptive bacterial immunity.",
        journal: "Science 337(6096):816–821",
        note: "Landmark paper demonstrating Cas9 can be directed by a single programmable guide RNA to cut any DNA sequence. Nobel Prize 2020.",
        url: "https://pubmed.ncbi.nlm.nih.gov/22745249/",
      },
    ],
  },
  {
    category: "First Applications in Human Cells",
    color: "#81c784",
    items: [
      {
        authors: "Cong L, Ran FA, Cox D, Lin S, Barretto R, Habib N, Hsu PD, Wu X, Jiang W, Marraffini LA, Zhang F.",
        year: 2013,
        title: "Multiplex genome engineering using CRISPR/Cas systems.",
        journal: "Science 339(6121):819–823",
        note: "First demonstration of CRISPR-Cas9 editing in eukaryotic (human and mouse) cells.",
        url: "https://pubmed.ncbi.nlm.nih.gov/23287718/",
      },
      {
        authors: "Mali P, Yang L, Esvelt KM, Aach J, Guell M, DiCarlo JE, Norville JE, Church GM.",
        year: 2013,
        title: "RNA-guided human genome engineering via Cas9.",
        journal: "Science 339(6121):823–826",
        note: "Independent simultaneous demonstration in human cells by the Church lab.",
        url: "https://pubmed.ncbi.nlm.nih.gov/23287722/",
      },
    ],
  },
  {
    category: "Guide RNA Design & Efficiency",
    color: "#ffb74d",
    items: [
      {
        authors: "Doench JG, Fusi N, Sullender M, Hegde M, Vaimberg EW, Donovan KF, et al.",
        year: 2016,
        title: "Optimized sgRNA design to maximize activity and minimize off-target effects of CRISPR-Cas9.",
        journal: "Nature Biotechnology 34:184–191",
        note: "Provides empirical rules on GC content, guide position, and sequence motif preferences. Basis of the Rule Set 2 (Azimuth) model.",
        url: "https://pubmed.ncbi.nlm.nih.gov/26780180/",
      },
      {
        authors: "Xu H, Xiao T, Chen CH, Li W, Meyer CA, Wu Q, Wu D, Cong L, Zhang F, Liu JS, Brown M, Liu XS.",
        year: 2015,
        title: "Sequence determinants of improved CRISPR sgRNA design.",
        journal: "Genome Research 25:1147–1157",
        url: "https://pubmed.ncbi.nlm.nih.gov/26063738/",
      },
      {
        authors: "Haeussler M, Schönig K, Eckert H, et al.",
        year: 2016,
        title: "Evaluation of off-target and on-target scoring algorithms and integration into the guide RNA selection tool CRISPOR.",
        journal: "Genome Biology 17:148",
        note: "Comprehensive comparison of on-target scoring models. Recommend using CRISPOR for research-grade guide selection.",
        url: "https://pubmed.ncbi.nlm.nih.gov/27380939/",
      },
    ],
  },
  {
    category: "Off-Target Effects & Specificity",
    color: "#ef9a9a",
    items: [
      {
        authors: "Fu Y, Foden JA, Khayter C, Maeder ML, Reyon D, Joung JK, Sander JD.",
        year: 2013,
        title: "High-frequency off-target mutagenesis induced by CRISPR-Cas nucleases in human cells.",
        journal: "Nature Biotechnology 31:822–826",
        note: "First systematic characterisation of off-target editing, establishing the importance of seed-region mismatches.",
        url: "https://pubmed.ncbi.nlm.nih.gov/23792628/",
      },
      {
        authors: "Hsu PD, Scott DA, Weinstein JA, Ran FA, Konermann S, Agarwala V, Li Y, Fine EJ, Wu X, Shalem O, Cradick TJ, Marraffini LA, Bao G, Zhang F.",
        year: 2013,
        title: "DNA targeting specificity of RNA-guided Cas9 nucleases.",
        journal: "Nature Biotechnology 31:827–832",
        url: "https://pubmed.ncbi.nlm.nih.gov/23873081/",
      },
      {
        authors: "Doench JG, Fusi N, Sullender M, et al.",
        year: 2016,
        title: "Optimized sgRNA design to maximize activity and minimize off-target effects of CRISPR-Cas9.",
        journal: "Nature Biotechnology 34:184–191",
        note: "Introduces the CFD (Cutting Frequency Determination) off-target score, a weighted mismatch penalty model used in industry tools.",
        url: "https://pubmed.ncbi.nlm.nih.gov/26780180/",
      },
    ],
  },
  {
    category: "Clinical Applications",
    color: "#ce93d8",
    items: [
      {
        authors: "Frangoul H, Altshuler D, Cappellini MD, Chen YS, Domm J, Eustace BK, et al.",
        year: 2021,
        title: "CRISPR-Cas9 gene editing for sickle cell disease and β-thalassemia.",
        journal: "New England Journal of Medicine 384:252–260",
        note: "First published clinical trial data for CRISPR-based haematological therapy targeting BCL11A. Basis of Casgevy.",
        url: "https://pubmed.ncbi.nlm.nih.gov/33283989/",
      },
      {
        authors: "U.S. Food and Drug Administration.",
        year: 2023,
        title: "FDA approves first CRISPR/Cas9-based gene therapies to treat patients with sickle cell disease.",
        journal: "FDA Press Release, December 8, 2023",
        note: "Historic first regulatory approval of a CRISPR therapeutic in the United States (Casgevy / exagamglogene autotemcel).",
        url: "https://www.fda.gov/vaccines-blood-biologics/cellular-gene-therapy-products/casgevy-exagamglogene-autotemcel",
      },
    ],
  },
  {
    category: "Ethics & Governance",
    color: "#f06292",
    items: [
      {
        authors: "Lander ES, Baylis F, Zhang F, Charpentier E, Berg P, Liu C, et al.",
        year: 2019,
        title: "Adopt a moratorium on heritable genome editing.",
        journal: "Nature 567:165–168",
        note: "Call for global moratorium on clinical heritable genome editing, prompted by He Jiankui's announcement of CRISPR-edited babies (2018).",
        url: "https://pubmed.ncbi.nlm.nih.gov/30867611/",
      },
      {
        authors: "WHO Expert Advisory Committee on Developing Global Standards for Governance and Oversight of Human Genome Editing.",
        year: 2021,
        title: "Human Genome Editing: A Framework for Governance.",
        journal: "World Health Organization",
        url: "https://www.who.int/publications/i/item/9789240030381",
      },
    ],
  },
  {
    category: "Reviews & Further Reading",
    color: "#69f0ae",
    items: [
      {
        authors: "Anzalone AV, Koblan LW, Liu DR.",
        year: 2020,
        title: "Genome editing with CRISPR–Cas nucleases, base editors, transposons and prime editors.",
        journal: "Nature Biotechnology 38:824–844",
        note: "Comprehensive review of all major CRISPR editing strategies including base editing and prime editing.",
        url: "https://pubmed.ncbi.nlm.nih.gov/32576985/",
      },
      {
        authors: "Doudna JA.",
        year: 2020,
        title: "The promise and challenge of therapeutic genome editing.",
        journal: "Nature 578:229–236",
        url: "https://pubmed.ncbi.nlm.nih.gov/32051598/",
      },
      {
        authors: "Sheridan C.",
        year: 2023,
        title: "The world's first CRISPR therapy is approved — who will it help?",
        journal: "Nature Medicine 30:26–28",
        url: "https://www.nature.com/articles/s41591-023-02659-z",
      },
    ],
  },
];

export default function ReferencesPage() {
  const { lang } = useLang();
  const T = UI[lang];

  return (
    <div className="rp-root">
      <div className="lp-orb lp-orb-1" style={{ top: "5%", left: "65%" }} />
      <div className="lp-orb lp-orb-2" style={{ top: "50%", left: "15%" }} />

      {/* Hero */}
      <section className="mp-hero">
        <motion.div
          className="mp-hero-inner"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mp-hero-badge">
            <BookOpen size={13} />
            {T.rpBadge}
          </div>
          <h1 className="mp-title">{T.rpTitle}</h1>
          <p className="mp-sub">{T.rpSub}</p>
        </motion.div>
      </section>

      <div className="rp-content">
        {REFS.map((cat, ci) => (
          <motion.div
            key={ci}
            className="rp-category"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: ci * 0.07 }}
          >
            <div className="rp-cat-header">
              <span className="rp-cat-dot" style={{ background: cat.color }} />
              <h2 className="rp-cat-title" style={{ color: cat.color }}>
                {cat.category}
              </h2>
            </div>

            <div className="rp-ref-list">
              {cat.items.map((ref, ri) => (
                <div key={ri} className="rp-ref-card">
                  <div className="rp-ref-meta">
                    <span className="rp-ref-year" style={{ color: cat.color }}>
                      {ref.year}
                    </span>
                    <span className="rp-ref-authors">{ref.authors}</span>
                  </div>
                  <div className="rp-ref-title">{ref.title}</div>
                  <div className="rp-ref-journal">{ref.journal}</div>
                  {ref.note && (
                    <div className="rp-ref-note">{ref.note}</div>
                  )}
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rp-ref-link"
                  >
                    <ExternalLink size={11} />
                    View source →
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        <div className="rp-disclaimer">{T.rpDisclaimer}</div>
      </div>
    </div>
  );
}
