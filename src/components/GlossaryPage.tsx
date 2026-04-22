import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { useLang } from "../lib/LangContext";
import { UI } from "../lib/translations";

type Term = {
  term: string;
  short: string;
  en: string;
  tr: string;
  category: "core" | "protein" | "repair" | "delivery" | "advanced";
};

const GLOSSARY_TERMS: Term[] = [
  // Core
  { term: "CRISPR", short: "Bacterial immune system repurposed for gene editing", en: "Clustered Regularly Interspaced Short Palindromic Repeats. A natural DNA sequence found in bacteria that stores memories of past viral infections. Scientists repurposed this system into one of the most powerful gene-editing tools ever created.", tr: "Kümelenmiş Düzenli Aralıklı Kısa Palindromik Tekrarlar. Bakterilerde bulunan ve geçmiş viral enfeksiyonların 'anılarını' saklayan doğal bir DNA dizisidir. Bilim insanları bu sistemi tarihin en güçlü gen düzenleme araçlarından birine dönüştürdü.", category: "core" },
  { term: "DNA", short: "The molecule encoding all genetic information", en: "Deoxyribonucleic acid. A double-stranded helical molecule made of four nucleotide bases (A, T, G, C) that encodes all genetic instructions. The human genome contains ~3.2 billion base pairs.", tr: "Deoksiribonükleik asit. Dört nükleotid bazından (A, T, G, C) oluşan çift sarmallı bir moleküldür ve tüm genetik talimatları kodlar. İnsan genomu ~3,2 milyar baz çifti içerir.", category: "core" },
  { term: "RNA", short: "Single-stranded molecule carrying genetic instructions", en: "Ribonucleic acid. A single-stranded molecule that carries genetic information from DNA to ribosomes (mRNA) or performs regulatory roles (gRNA). The guide RNA in CRISPR is an RNA molecule.", tr: "Ribonükleik asit. DNA'dan ribozomlara genetik bilgi taşıyan (mRNA) veya düzenleyici roller üstlenen (gRNA) tek iplikli bir moleküldür. CRISPR'daki kılavuz RNA bir RNA molekülüdür.", category: "core" },
  { term: "Gene", short: "A segment of DNA encoding a specific protein", en: "A segment of DNA that encodes a specific functional product — usually a protein. The human genome contains ~20,000 protein-coding genes, though only ~2% of total DNA is protein-coding.", tr: "Belirli bir işlevsel ürünü (genellikle protein) kodlayan bir DNA segmentidir. İnsan genomu ~20.000 protein kodlayan gen içerir, ancak toplam DNA'nın yalnızca ~%2'si protein kodlayıcıdır.", category: "core" },
  { term: "Mutation", short: "A change in the DNA sequence", en: "Any change in the DNA sequence. Point mutations change a single base; indels insert or delete bases; chromosomal mutations affect large regions. Mutations can cause disease (pathogenic) or be neutral/beneficial.", tr: "DNA dizisindeki herhangi bir değişikliktir. Nokta mutasyonları tek bir baz değiştirir; indeller baz ekler veya çıkarır; kromozomal mutasyonlar büyük bölgeleri etkiler. Mutasyonlar hastalığa yol açabilir (patojenik) veya nötr/faydalı olabilir.", category: "core" },
  { term: "Base Pair", short: "Two complementary nucleotides bonded together (A-T, G-C)", en: "Two complementary nucleotides (A-T or G-C) held together by hydrogen bonds, forming the 'rungs' of the DNA ladder. The human genome has ~3.2 billion base pairs. Guide RNAs form base pairs with their target DNA.", tr: "Hidrojen bağlarıyla bir arada tutulan iki tamamlayıcı nükleotid (A-T veya G-C). DNA merdiveninin 'basamaklarını' oluştururlar. İnsan genomu ~3,2 milyar baz çifti içerir. Kılavuz RNA'lar hedef DNA ile baz çiftleri oluşturur.", category: "core" },
  { term: "Genome", short: "The complete set of DNA in an organism", en: "The complete set of genetic information in an organism — all DNA including genes, regulatory regions, and non-coding sequences. The human genome spans ~3.2 billion base pairs across 23 chromosome pairs.", tr: "Bir organizmadaki tüm genetik bilgi kümesi — genler, düzenleyici bölgeler ve kodlamayan diziler dahil tüm DNA. İnsan genomu 23 çift kromozom üzerinde ~3,2 milyar baz çiftine yayılır.", category: "core" },
  { term: "Protospacer", short: "The 20-nt DNA target sequence recognized by guide RNA", en: "The 20-nucleotide DNA sequence immediately upstream of the PAM that is complementary to the spacer in the guide RNA. Cas9 unwinds this region to allow gRNA base pairing and target cleavage.", tr: "PAM'in hemen yukarısında yer alan ve kılavuz RNA'daki aralayıcı diziyle tamamlayıcı olan 20 nükleotidlik DNA dizisidir. Cas9 bu bölgeyi açarak gRNA baz çiftlenmesini ve hedef kesimini mümkün kılar.", category: "core" },

  // Proteins & Components
  { term: "Cas9", short: "The molecular scissors that cut DNA at precise locations", en: "CRISPR-Associated Protein 9. An endonuclease enzyme (from Streptococcus pyogenes) that makes precise double-strand cuts in DNA, guided to its target by a gRNA. One of the most widely used molecular tools in biology.", tr: "CRISPR İlişkili Protein 9. Streptococcus pyogenes'ten türetilmiş, bir gRNA tarafından hedefine yönlendirilen ve DNA'da hassas çift zincir kesikler yapan bir endonükleaz enzimidir. Biyolojide en yaygın kullanılan moleküler araçlardan biridir.", category: "protein" },
  { term: "gRNA / Guide RNA", short: "The GPS of CRISPR — navigates Cas9 to the target", en: "Guide RNA. A short synthetic RNA (~100 nt) containing a 20 nt spacer sequence that matches the DNA target, fused to a scaffold that recruits Cas9. Changing the spacer redirects Cas9 to any new target — the programmable part of the system.", tr: "Kılavuz RNA. Hedef DNA ile eşleşen 20 nt aralayıcı dizi içeren kısa sentetik RNA'dır (~100 nt). Aralayıcıyı değiştirmek Cas9'u yeni bir hedefe yönlendirir — sistemin programlanabilir kısmıdır.", category: "protein" },
  { term: "PAM", short: "Short DNA motif Cas9 requires to cut", en: "Protospacer Adjacent Motif. A short DNA sequence (NGG for SpCas9) immediately 3' of the target site. Cas9 cannot cut without a PAM. Different Cas variants recognize different PAMs.", tr: "Protoaralayıcı Komşu Motifi. Hedef sitenin hemen 3' yanında yer alan kısa bir DNA dizisidir (SpCas9 için NGG). Cas9, PAM olmadan kesim yapamaz. Farklı Cas varyantları farklı PAM'leri tanır.", category: "protein" },
  { term: "SpCas9", short: "The most common Cas9, from S. pyogenes (uses NGG PAM)", en: "Streptococcus pyogenes Cas9. The most widely used CRISPR endonuclease. Uses NGG PAM, high activity, extensively characterized. Its large size (~160 kDa, ~4.2 kb gene) is a limitation for AAV delivery.", tr: "Streptococcus pyogenes Cas9. En yaygın kullanılan CRISPR endonükleazıdır. NGG PAM kullanır, yüksek aktiviteye sahiptir. Büyük boyutu (~160 kDa, ~4,2 kb gen) AAV iletimi için sınırlamadır.", category: "protein" },
  { term: "SaCas9", short: "Smaller Cas9 variant that fits inside AAV vectors", en: "Staphylococcus aureus Cas9. A smaller Cas9 variant (~3.2 kb gene) that fits within AAV's ~4.7 kb packaging limit. Uses NNGRRT PAM — more restrictive than NGG but enables in-vivo AAV delivery.", tr: "Staphylococcus aureus Cas9. AAV'nin ~4,7 kb paketleme limitine sığan daha küçük Cas9 varyantıdır (~3,2 kb gen). NNGRRT PAM kullanır — NGG'den daha kısıtlayıcı ama AAV in-vivo iletimini mümkün kılar.", category: "protein" },
  { term: "Cas12a (Cpf1)", short: "Alternative CRISPR enzyme, T-rich PAM, staggered cuts", en: "An alternative CRISPR endonuclease using T-rich PAMs (TTTN). Creates staggered (non-blunt) cuts and processes its own gRNA array. Useful where NGG PAMs are absent or for multiplex editing.", tr: "T açısından zengin PAM'ler (TTTN) kullanan alternatif CRISPR endonükleazıdır. Basamaklı (düz olmayan) kesikler oluşturur ve kendi gRNA dizisini işler. NGG PAM'lerin olmadığı durumlarda veya çoklu düzenlemeler için kullanışlıdır.", category: "protein" },
  { term: "Cas13", short: "CRISPR enzyme that targets RNA, not DNA", en: "A CRISPR effector targeting and degrading RNA rather than DNA. Can knock down gene expression without permanent genome changes. Explored for antiviral applications and transient gene modulation.", tr: "DNA yerine RNA'yı hedefleyip parçalayan CRISPR efektörüdür. Kalıcı genom değişikliği olmadan gen ifadesini baskılayabilir. Antiviral uygulamalar ve geçici gen modülasyonu için araştırılmaktadır.", category: "protein" },
  { term: "RNP", short: "Cas9 protein pre-loaded with guide RNA — the active editor", en: "Ribonucleoprotein. The active CRISPR editing complex: Cas9 protein pre-loaded with gRNA. RNP delivery gives rapid, transient editing with lower off-target and immunogenicity risk versus DNA-based delivery. Standard for ex-vivo electroporation.", tr: "Ribonükleoprotein. Aktif CRISPR düzenleme kompleksi: gRNA ile önceden yüklenmiş Cas9 proteinidir. RNP iletimi, DNA tabanlı iletimden daha düşük hedef dışı ve immünojenisite riski ile hızlı, geçici düzenleme sağlar.", category: "protein" },

  // DNA Repair
  { term: "NHEJ", short: "Fast, error-prone repair that creates indels", en: "Non-Homologous End Joining. The dominant double-strand break repair pathway. Rapidly joins broken DNA ends without a template — often causing small indels at the cut site. Active in all cell cycle phases. Used for gene knockout.", tr: "Homoloji Dışı Uç Birleştirme. Baskın çift zincir kırık onarım yoludur. Kırık DNA uçlarını şablon olmadan hızla birleştirir — genellikle kesim yerinde küçük indeller oluşturur. Tüm hücre döngüsü fazlarında aktiftir. Gen nakavt etme için kullanılır.", category: "repair" },
  { term: "HDR", short: "Precise repair using a donor template", en: "Homology-Directed Repair. Uses a donor DNA template with homology arms to make exact sequence changes at a break site. Only active in S/G2 phase — efficient mainly in dividing cells. Used for precise corrections and knock-ins.", tr: "Homoloji Yönlendirmeli Onarım. Bir kırık noktasında tam dizi değişiklikleri yapmak için homoloji kollarına sahip donör DNA şablonu kullanır. Yalnızca S/G2 fazında aktiftir — esas olarak bölünen hücrelerde etkilidir.", category: "repair" },
  { term: "Indel", short: "Small insertion or deletion caused by NHEJ repair", en: "Insertion/Deletion. A small mutation (1–20 bp) introduced at a CRISPR cut site by NHEJ. Indels often cause frameshifts — shifting the reading frame and creating premature stop codons that disable the gene product.", tr: "Ekleme/Silme. NHEJ tarafından CRISPR kesim noktasında oluşturulan küçük mutasyondur (1–20 bp). İndeller genellikle çerçeve kaymasına yol açar ve geni devre dışı bırakan erken dur kodonları oluşturur.", category: "repair" },
  { term: "Double-Strand Break (DSB)", short: "A cut through both DNA strands — triggers repair", en: "Occurs when both strands of the DNA helix are severed. DSBs trigger cell cycle arrest and activate repair (NHEJ or HDR). Cas9 creates a DSB to enable gene editing.", tr: "DNA sarmalının her iki zincirinin de kesilmesiyle oluşur. DSB'ler hücre döngüsü durmasını tetikler ve onarımı (NHEJ veya HDR) aktive eder. Cas9, gen düzenlemeyi mümkün kılmak için DSB oluşturur.", category: "repair" },
  { term: "Frameshift", short: "Mutation shifting the reading frame, often disables gene", en: "A mutation caused by inserting or deleting bases in a number not divisible by 3, shifting the reading frame of all downstream codons. Usually produces a non-functional protein due to a premature stop codon.", tr: "3'e bölünemeyen sayıda baz eklenmesi/silinmesiyle oluşan ve aşağı akış kodonların okuma çerçevesini kaydıran mutasyon. Genellikle erken dur kodonu nedeniyle işlevsiz protein üretir.", category: "repair" },
  { term: "Off-target", short: "Unintended CRISPR edit at a non-target genomic site", en: "An unintended CRISPR edit at a location other than the intended target. Occurs when the gRNA partially matches a different genomic sequence. Off-target rates depend on guide sequence, Cas9 variant, and delivery method.", tr: "Hedeflenen konumdan farklı bir genomik konumda meydana gelen istenmeyen CRISPR düzenlemesidir. gRNA'nın farklı bir genomik diziyle kısmen eşleşmesi durumunda oluşur.", category: "repair" },
  { term: "Specificity Score", short: "0–100 rating of how uniquely a guide targets its site", en: "A 0–100 score reflecting how uniquely a guide RNA binds its target versus off-target sites. Higher = fewer predicted off-targets. Calculated using mismatch count, position (seed region weighting), and PAM presence.", tr: "Bir kılavuz RNA'nın genomdaki diğer konumlara kıyasla hedefini ne kadar benzersiz şekilde bağladığını yansıtan 0–100 puanıdır. Yüksek puan = daha az hedef dışı site.", category: "repair" },

  // Delivery
  { term: "AAV", short: "Adeno-Associated Virus — viral vector for in-vivo delivery", en: "A small, non-pathogenic virus used to deliver CRISPR components. Has ~4.7 kb packaging capacity and natural tissue tropism. Different serotypes target different tissues (AAV9 → CNS, AAV8 → liver).", tr: "CRISPR bileşenlerini iletmek için kullanılan küçük, patojen olmayan virüstür. ~4,7 kb paketleme kapasitesine ve doğal doku tropizmine sahiptir. Farklı serotipleri farklı dokuları hedefler.", category: "delivery" },
  { term: "LNP", short: "Lipid Nanoparticle — synthetic vehicle for RNA delivery", en: "A synthetic fat-droplet delivery system for Cas9 mRNA + gRNA. Highly efficient for liver targeting. Transient — Cas9 is degraded after editing, reducing off-target risk. Used in NTLA-2001, the first in-vivo CRISPR trial showing results.", tr: "Cas9 mRNA + gRNA için sentetik yağ-damlacığı iletim sistemidir. Karaciğer hedefleme için son derece etkilidir. Geçici — Cas9, düzenlemeden sonra parçalanır. Klinik sonuçlar gösteren ilk in-vivo CRISPR denemesi NTLA-2001'de kullanılır.", category: "delivery" },
  { term: "Electroporation", short: "Electrical pulses that open cell pores for CRISPR entry", en: "Uses brief electrical pulses to create temporary pores in cell membranes, allowing Cas9 RNP to enter. Highly efficient (>80%) for blood cells. The standard approach for all current ex-vivo CRISPR clinical trials including Casgevy.", tr: "Hücre zarlarında geçici porlar oluşturmak için kısa elektrik darbeleri kullanır; Cas9 RNP'nin girmesine izin verir. Kan hücreleri için son derece etkilidir (>%80). Casgevy dahil tüm ex-vivo CRISPR klinik denemelerinde standart yaklaşımdır.", category: "delivery" },
  { term: "Ex-vivo", short: "Editing cells removed from the body, then returned", en: "'Out of the living.' Cells are removed from the patient, edited in a controlled lab environment, then returned. Maximum control over editing and safety. Used in Casgevy for sickle cell disease.", tr: "'Canlının dışında.' Hücreler hastadan alınır, kontrollü laboratuvar ortamında düzenlenir, ardından geri verilir. Maksimum kontrol sağlar. Casgevy'de orak hücre hastalığı için kullanılır.", category: "delivery" },
  { term: "In-vivo", short: "Delivering CRISPR directly into the living body", en: "'Within the living.' CRISPR components delivered directly into a living organism. Necessary for non-removable tissues (liver, CNS, muscle). More complex, but eliminates the need for cell extraction.", tr: "'Canlının içinde.' CRISPR bileşenleri doğrudan canlı bir organizmaya iletilir. Çıkarılamayan dokular (karaciğer, SSS, kas) için gereklidir. Daha karmaşıktır ama hücre çıkarımına gerek kalmaz.", category: "delivery" },

  // Advanced
  { term: "Base Editing", short: "Converting A→G or C→T without cutting DNA", en: "A CRISPR-derived technology converting one DNA base to another (A→G or C→T) without creating a double-strand break, using a deaminase enzyme fused to a catalytically impaired Cas9. More precise for single-point mutations. Developed by David Liu (Harvard).", tr: "Katalitik olarak bozulmuş bir Cas9'a bağlı deaminaz enzimi kullanarak çift zincir kırık oluşturmadan bir DNA bazını diğerine (A→G veya C→T) dönüştüren CRISPR türevi teknolojidir. David Liu (Harvard) tarafından geliştirildi.", category: "advanced" },
  { term: "Prime Editing", short: "'Search and replace' genome editor — no DSB needed", en: "A versatile CRISPR-based editor using a Cas9 nickase fused to reverse transcriptase, guided by a pegRNA. Can install all 12 point mutations, small insertions, and deletions without DSBs or donor templates. Developed by David Liu (Harvard, 2019).", tr: "Bir pegRNA tarafından yönlendirilen, reverse transcriptase'ye bağlı Cas9 nikaz kullanan çok yönlü CRISPR tabanlı düzenleyicidir. DSB veya donör şablonu olmadan tüm 12 nokta mutasyonunu gerçekleştirebilir. David Liu (Harvard, 2019) tarafından geliştirildi.", category: "advanced" },
  { term: "Germline Editing", short: "Heritable edits in eggs, sperm, or embryos", en: "Gene editing of germline cells (eggs, sperm, or early embryos). Any edit is heritable — present in every cell of all future generations. Banned in clinical use in most countries. He Jiankui's 2018 experiment (first CRISPR babies) was internationally condemned.", tr: "Eşey hücrelerinde (yumurta, sperm veya erken embriyolar) gen düzenlemesidir. Her düzenleme kalıtsaldır — tüm gelecek nesillerin her hücresinde bulunur. Çoğu ülkede klinik kullanımda yasaklanmıştır.", category: "advanced" },
  { term: "Somatic Editing", short: "Non-heritable edits in a living patient's cells", en: "Gene editing of somatic (non-reproductive) cells in a living patient. Changes affect only the treated individual — not heritable. The basis for all current CRISPR clinical trials including Casgevy.", tr: "Canlı bir hastanın somatik (üreme olmayan) hücrelerinde gen düzenlemesidir. Değişiklikler yalnızca tedavi edilen bireyi etkiler — kalıtılamaz. Casgevy dahil tüm CRISPR klinik denemelerinin temelidir.", category: "advanced" },
  { term: "BCL11A", short: "Gene whose enhancer deletion reactivates fetal hemoglobin", en: "A transcription factor that suppresses fetal hemoglobin (HbF) after birth. Casgevy deletes BCL11A's erythroid enhancer with paired CRISPR cuts, de-repressing HbF as a functional substitute for defective adult hemoglobin in sickle cell disease.", tr: "Doğumdan sonra fetal hemoglobin (HbF) üretimini baskılayan transkripsiyon faktörüdür. Casgevy, orak hücre hastalığında kusurlu yetişkin hemoglobin için işlevsel yedek olarak HbF'yi serbest bırakmak amacıyla BCL11A'nın eritroid güçlendiricisini siler.", category: "advanced" },
  { term: "Fetal Hemoglobin (HbF)", short: "Oxygen carrier switched off after birth, reactivatable by CRISPR", en: "An oxygen-carrying protein produced during fetal development but suppressed after birth. HbF can substitute for defective adult hemoglobin. Reactivating HbF is the strategy behind Casgevy and several other gene therapies.", tr: "Fetal gelişim sırasında üretilen ancak doğumdan sonra baskılanan oksijen taşıyıcı proteindir. HbF, kusurlu yetişkin hemoglobinin yerini alabilir. HbF'yi yeniden aktive etmek Casgevy'nin arkasındaki stratejidir.", category: "advanced" },
  { term: "Knock-out", short: "Disabling a gene using NHEJ-induced indels", en: "A gene editing strategy that disables a gene's function by introducing NHEJ-induced indels that cause frameshift mutations. The most common CRISPR application in research — used to study gene function and model disease.", tr: "NHEJ kaynaklı indeller aracılığıyla çerçeve kayması mutasyonları oluşturarak bir genin işlevini devre dışı bırakan gen düzenleme stratejisidir. Araştırmalarda en yaygın CRISPR uygulamasıdır.", category: "advanced" },
  { term: "Knock-in", short: "Inserting a specific DNA sequence via HDR", en: "A gene editing strategy that inserts a specific sequence into the genome using HDR with a donor template. Used to add or correct genes. Less efficient than knockout due to HDR's requirement for dividing cells.", tr: "Donör şablonu ile HDR kullanarak genomu belirli bir dizi ekleyen gen düzenleme stratejisidir. Gen eklemek veya düzeltmek için kullanılır. HDR'nin bölünen hücreler gerektirmesi nedeniyle nakavttan daha az verimlidir.", category: "advanced" },
];

const CATEGORY_COLORS: Record<string, string> = {
  core: "#4fc3f7",
  protein: "#81c784",
  repair: "#ffb74d",
  delivery: "#ce93d8",
  advanced: "#f06292",
};

const CATEGORY_LABELS_EN: Record<string, string> = {
  core: "Core Concepts",
  protein: "Proteins & Components",
  repair: "DNA Repair",
  delivery: "Delivery",
  advanced: "Advanced Topics",
};

const CATEGORY_LABELS_TR: Record<string, string> = {
  core: "Temel Kavramlar",
  protein: "Proteinler ve Bileşenler",
  repair: "DNA Onarımı",
  delivery: "İletim",
  advanced: "İleri Konular",
};

export default function GlossaryPage() {
  const { lang } = useLang();
  const T = UI[lang];
  const [filter, setFilter] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = GLOSSARY_TERMS.filter((t) => {
    const q = filter.toLowerCase();
    const matchesSearch =
      !q ||
      t.term.toLowerCase().includes(q) ||
      t.short.toLowerCase().includes(q) ||
      t.en.toLowerCase().includes(q);
    const matchesCat = !activeCategory || t.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const categoryLabels = lang === "tr" ? CATEGORY_LABELS_TR : CATEGORY_LABELS_EN;

  return (
    <div className="gp-root">
      <div className="lp-orb lp-orb-1" />
      <div className="lp-orb lp-orb-2" />

      {/* Hero */}
      <section className="gp-hero">
        <div className="gp-hero-inner">
          <motion.div
            className="lp-hero-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <BookOpen size={14} />
            {T.glossaryBadge}
          </motion.div>
          <motion.h1
            className="gp-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {T.glossaryTitle}
          </motion.h1>
          <motion.p
            className="gp-sub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {T.glossarySub}
          </motion.p>

          {/* Search */}
          <motion.div
            className="gp-search-wrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Search size={16} className="gp-search-icon" />
            <input
              className="gp-search-input"
              placeholder={T.glossarySearch}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </motion.div>

          {/* Category filters */}
          <motion.div
            className="gp-cats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <button
              className={`gp-cat-btn ${!activeCategory ? "gp-cat-active" : ""}`}
              onClick={() => setActiveCategory(null)}
            >
              {T.glossaryAll}
            </button>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                className={`gp-cat-btn ${activeCategory === key ? "gp-cat-active" : ""}`}
                style={
                  activeCategory === key
                    ? {
                        borderColor: CATEGORY_COLORS[key],
                        color: CATEGORY_COLORS[key],
                        background: `${CATEGORY_COLORS[key]}18`,
                      }
                    : {}
                }
                onClick={() => setActiveCategory(activeCategory === key ? null : key)}
              >
                {label}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Terms grid */}
      <section className="gp-terms-section">
        <p className="gp-count">
          {filtered.length} {T.glossaryTerms}
        </p>
        <div className="gp-grid">
          {filtered.map((term, i) => (
            <TermCard key={term.term} term={term} lang={lang} index={i} />
          ))}
          {filtered.length === 0 && (
            <div className="gp-empty">
              <p>
                {T.glossaryNoResults} &ldquo;{filter}&rdquo;
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function TermCard({
  term,
  lang,
  index,
}: {
  term: Term;
  lang: string;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const color = CATEGORY_COLORS[term.category];

  return (
    <motion.div
      className={`gp-term-card ${expanded ? "gp-term-expanded" : ""}`}
      style={{ "--term-color": color } as React.CSSProperties}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.025, 0.5), duration: 0.35 }}
      onClick={() => setExpanded((v) => !v)}
    >
      <div className="gp-term-top">
        <div className="gp-term-header">
          <span className="gp-term-name">{term.term}</span>
          <span className="gp-term-cat-dot" style={{ background: color }} />
        </div>
        <p className="gp-term-short">{term.short}</p>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="gp-term-def"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {lang === "tr" ? term.tr : term.en}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="gp-term-expand-hint">
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </div>
    </motion.div>
  );
}
