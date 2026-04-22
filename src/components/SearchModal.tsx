import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, X, BookOpen, GraduationCap } from "lucide-react";
import { useLang } from "../lib/LangContext";
import { UI } from "../lib/translations";
import { CHAPTERS } from "../lib/learningData";
import { CHAPTERS_TR } from "../lib/learningDataTR";

type SearchResult = {
  type: "glossary" | "module";
  title: string;
  body: string;
  color: string;
  emoji?: string;
};

// Flat glossary data for search
const GLOSSARY_ENTRIES = [
  { term: "CRISPR", def: "Clustered Regularly Interspaced Short Palindromic Repeats. Bacterial immune system repurposed for gene editing. Stores memories of past viral infections.", defTR: "Kümelenmiş Düzenli Aralıklı Kısa Palindromik Tekrarlar. Bakteriyel bağışıklık sistemi gen düzenlemesi için yeniden kullanıldı." },
  { term: "DNA", def: "Deoxyribonucleic acid. Double-stranded helical molecule encoding all genetic instructions. 3.2 billion base pairs in humans.", defTR: "Deoksiribonükleik asit. Tüm genetik talimatları kodlayan çift sarmallı molekül. İnsanlarda 3,2 milyar baz çifti." },
  { term: "Cas9", def: "Molecular scissors that cut DNA at precise locations guided by the gRNA. Most common variant is SpCas9 from S. pyogenes.", defTR: "gRNA tarafından yönlendirilen, kesin konumlarda DNA kesen moleküler makaslar." },
  { term: "gRNA / Guide RNA", def: "The GPS of CRISPR. A short synthetic RNA that navigates Cas9 to the exact DNA target sequence. The programmable part.", defTR: "CRISPR'ın GPS'i. Cas9'u tam DNA hedef dizisine yönlendiren kısa sentetik RNA." },
  { term: "PAM", def: "Protospacer Adjacent Motif. Short DNA sequence (NGG for SpCas9) required for Cas9 to recognize and cut its target.", defTR: "Protoaralayıcı Komşu Motifi. Cas9'un hedefini tanıyıp kesmesi için gerekli kısa DNA dizisi (NGG)." },
  { term: "NHEJ", def: "Non-Homologous End Joining. Fast error-prone DNA repair causing small indels. Used for gene knockout.", defTR: "Homoloji Dışı Uç Birleştirme. Küçük indellere yol açan hızlı, hata eğilimli DNA onarımı." },
  { term: "HDR", def: "Homology-Directed Repair. Precise repair using a DNA template. Only works in dividing cells.", defTR: "Homoloji Yönlendirmeli Onarım. DNA şablonu kullanan hassas onarım. Yalnızca bölünen hücrelerde çalışır." },
  { term: "Indel", def: "Small insertion or deletion at a CRISPR cut site caused by NHEJ repair.", defTR: "NHEJ onarımı tarafından CRISPR kesim noktasında oluşturulan küçük ekleme veya silme." },
  { term: "Off-target", def: "Unintended CRISPR edit at a non-target genomic site where the guide RNA partially matches.", defTR: "Kılavuz RNA'nın kısmen eşleştiği hedef dışı genomik konumda istenmeyen CRISPR düzenlemesi." },
  { term: "AAV", def: "Adeno-Associated Virus. Viral vector for in-vivo CRISPR delivery. ~4.7 kb packaging capacity.", defTR: "Adeno İlişkili Virüs. In-vivo CRISPR iletimi için viral vektör. ~4,7 kb paketleme kapasitesi." },
  { term: "LNP", def: "Lipid Nanoparticle. Synthetic fat-droplet delivery vehicle for RNA cargo. Highly efficient for liver.", defTR: "Lipid Nanopartikül. RNA kargo için sentetik yağ-damlacığı iletim aracı. Karaciğer için son derece etkili." },
  { term: "Base Editing", def: "Converts single DNA bases (A→G or C→T) without double-strand breaks. Developed by David Liu.", defTR: "Çift zincir kırık olmadan tek DNA bazlarını dönüştürür (A→G veya C→T). David Liu tarafından geliştirildi." },
  { term: "Prime Editing", def: "'Search and replace' genome editor using Cas9 nickase + pegRNA. No DSB or donor template needed.", defTR: "Cas9 nikaz + pegRNA kullanan 'ara ve değiştir' genom düzenleyicisi. DSB veya donör şablonu gerekmez." },
  { term: "BCL11A", def: "Gene whose enhancer deletion reactivates fetal hemoglobin — the strategy behind Casgevy.", defTR: "Güçlendirici silinmesi fetal hemoglobini yeniden aktive eden gen — Casgevy'nin arkasındaki strateji." },
  { term: "Casgevy", def: "First FDA-approved CRISPR therapy (December 2023) for sickle cell disease. Cost: ~$2.2 million.", defTR: "İlk FDA onaylı CRISPR terapisi (Aralık 2023) orak hücre hastalığı için. Maliyet: ~2,2 milyon $." },
  { term: "Electroporation", def: "Electrical pulses that open cell pores for CRISPR entry. >80% efficiency in blood cells.", defTR: "CRISPR girişi için hücre zarı porlarını açan elektrik darbeleri. Kan hücrelerinde >%80 verimlilik." },
  { term: "Germline Editing", def: "Heritable edits in eggs, sperm, or embryos. Changes pass to all future generations. Banned clinically.", defTR: "Yumurta, sperm veya embriyolarda kalıtsal düzenlemeler. Tüm gelecek nesillere aktarılır. Klinik olarak yasaklı." },
  { term: "Ex-vivo", def: "Editing cells removed from the body then returned. Maximum control. Used in Casgevy.", defTR: "Vücuttan alınan hücrelerin düzenlenip geri verilmesi. Maksimum kontrol. Casgevy'de kullanılır." },
  { term: "Frameshift", def: "Mutation shifting the reading frame, usually disabling the gene product.", defTR: "Okuma çerçevesini kaydıran mutasyon, genellikle gen ürününü devre dışı bırakır." },
  { term: "Specificity Score", def: "0–100 rating of how uniquely a guide RNA targets its intended site versus off-target sites.", defTR: "Kılavuz RNA'nın hedefini ne kadar benzersiz şekilde bağladığının 0–100 puanı." },
];

type Props = {
  onClose: () => void;
  onNavigate?: (page: "learn" | "glossary") => void;
};

export default function SearchModal({ onClose, onNavigate }: Props) {
  const { lang } = useLang();
  const T = UI[lang];
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const chapters = lang === "tr" ? CHAPTERS_TR : CHAPTERS;

  useEffect(() => {
    inputRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const results: SearchResult[] = [];
  if (query.trim().length >= 2) {
    const q = query.toLowerCase();

    // Glossary matches
    for (const entry of GLOSSARY_ENTRIES) {
      const def = lang === "tr" ? entry.defTR : entry.def;
      if (
        entry.term.toLowerCase().includes(q) ||
        def.toLowerCase().includes(q)
      ) {
        results.push({
          type: "glossary",
          title: entry.term,
          body: def,
          color: "#4fc3f7",
        });
        if (results.filter((r) => r.type === "glossary").length >= 5) break;
      }
    }

    // Module matches
    for (const ch of chapters) {
      if (
        ch.title.toLowerCase().includes(q) ||
        ch.subtitle.toLowerCase().includes(q) ||
        ch.sections.some(
          (s) =>
            s.heading.toLowerCase().includes(q) ||
            s.content.some(
              (b) =>
                (b.type === "paragraph" && b.text.toLowerCase().includes(q)) ||
                (b.type === "highlight" && b.text.toLowerCase().includes(q))
            )
        )
      ) {
        results.push({
          type: "module",
          title: ch.title,
          body: ch.subtitle,
          color: ch.color,
          emoji: ch.emoji,
        });
      }
    }
  }

  return (
    <motion.div
      className="sm-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="sm-panel"
        initial={{ opacity: 0, y: -30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.97 }}
        transition={{ type: "spring", damping: 26, stiffness: 360 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="sm-input-row">
          <Search size={18} className="sm-icon" />
          <input
            ref={inputRef}
            className="sm-input"
            placeholder={T.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="sm-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <div className="sm-results">
          {query.trim().length < 2 ? (
            <div className="sm-hint">
              <p>Type at least 2 characters to search across modules and glossary.</p>
            </div>
          ) : results.length === 0 ? (
            <div className="sm-empty">
              {T.searchNoResults} &ldquo;{query}&rdquo;
            </div>
          ) : (
            <>
              {results.filter((r) => r.type === "glossary").length > 0 && (
                <div className="sm-section">
                  <div className="sm-section-label">
                    <BookOpen size={12} />
                    {T.searchInGlossary}
                  </div>
                  {results
                    .filter((r) => r.type === "glossary")
                    .map((r, i) => (
                      <ResultItem
                        key={i}
                        result={r}
                        onClick={() => {
                          onNavigate?.("glossary");
                          onClose();
                        }}
                      />
                    ))}
                </div>
              )}
              {results.filter((r) => r.type === "module").length > 0 && (
                <div className="sm-section">
                  <div className="sm-section-label">
                    <GraduationCap size={12} />
                    {T.searchInModules}
                  </div>
                  {results
                    .filter((r) => r.type === "module")
                    .map((r, i) => (
                      <ResultItem
                        key={i}
                        result={r}
                        onClick={() => {
                          onNavigate?.("learn");
                          onClose();
                        }}
                      />
                    ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="sm-footer-hint">
          <span>ESC to close</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ResultItem({
  result,
  onClick,
}: {
  result: SearchResult;
  onClick: () => void;
}) {
  return (
    <button className="sm-result-item" onClick={onClick}>
      <div className="sm-result-left">
        {result.emoji ? (
          <span className="sm-result-emoji">{result.emoji}</span>
        ) : (
          <span
            className="sm-result-dot"
            style={{ background: result.color }}
          />
        )}
        <div>
          <div className="sm-result-title" style={{ color: result.color }}>
            {result.title}
          </div>
          <div className="sm-result-body">{result.body}</div>
        </div>
      </div>
    </button>
  );
}
