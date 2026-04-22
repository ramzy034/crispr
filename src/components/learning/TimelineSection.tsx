import { motion } from "framer-motion";
import { useLang } from "../../lib/LangContext";
import { UI } from "../../lib/translations";

type Event = {
  year: string;
  en: string;
  tr: string;
  color: string;
  icon: string;
  isHighlight?: boolean;
};

const EVENTS: Event[] = [
  { year: "1987", en: "CRISPR-like sequences first observed in E. coli by Yoshizumi Ishino during sequencing experiments.", tr: "Yoshizumi Ishino tarafından dizileme deneyleri sırasında E. coli'de CRISPR benzeri diziler ilk kez gözlemlendi.", color: "#4fc3f7", icon: "🔬" },
  { year: "1993", en: "Francisco Mojica discovers CRISPR repeats in salt-loving archaea, beginning a decade of systematic study.", tr: "Francisco Mojica, tuzu seven arkelarda CRISPR tekrarlarını keşfetti; bu, sistematik çalışmaların on yıllık başlangıcıydı.", color: "#26c6da", icon: "🧪" },
  { year: "2005", en: "Scientists realize CRISPR spacer sequences match viral DNA — the system is a bacterial 'immune memory'.", tr: "Bilim insanları CRISPR aralayıcı dizilerin viral DNA ile eşleştiğini fark etti — sistem bir bakteri 'bağışıklık belleği'dir.", color: "#4fc3f7", icon: "💡" },
  { year: "2012", en: "Doudna & Charpentier publish Science paper showing CRISPR-Cas9 can be programmed to cut any DNA sequence.", tr: "Doudna ve Charpentier, CRISPR-Cas9'un herhangi bir DNA dizisini kesmek için programlanabileceğini gösteren Science makalelerini yayımladı.", color: "#9c6bff", icon: "📄", isHighlight: true },
  { year: "2013", en: "Feng Zhang (Broad Institute) and George Church independently demonstrate CRISPR editing in human cells.", tr: "Feng Zhang (Broad Institute) ve George Church, insan hücrelerinde CRISPR düzenlemesini bağımsız olarak gösterdi.", color: "#81c784", icon: "🧬" },
  { year: "2015", en: "First CRISPR clinical trial approved. CRISPR used to create disease models, engineered immune cells (CAR-T).", tr: "İlk CRISPR klinik denemesi onaylandı. CRISPR, hastalık modelleri ve mühendislik uygulamalı bağışıklık hücreleri (CAR-T) oluşturmak için kullanıldı.", color: "#ffb74d", icon: "🏥" },
  { year: "2018", en: "He Jiankui announces birth of first CRISPR-edited babies (CCR5 edit). Global scientific community condemns the experiment.", tr: "He Jiankui, ilk CRISPR düzenlenmiş bebeklerin (CCR5 düzenlemesi) doğumunu duyurdu. Küresel bilim camiası bu deneyi kınadı.", color: "#ef9a9a", icon: "⚠️" },
  { year: "2019", en: "Victoria Gray becomes first person treated with CRISPR for sickle cell disease — a historic milestone.", tr: "Victoria Gray, orak hücre hastalığı için CRISPR ile tedavi edilen ilk kişi oldu — tarihi bir kilometre taşı.", color: "#81c784", icon: "🩸" },
  { year: "2020", en: "Nobel Prize in Chemistry awarded to Jennifer Doudna and Emmanuelle Charpentier for developing CRISPR-Cas9.", tr: "Kimya Nobel Ödülü, CRISPR-Cas9'u geliştirdikleri için Jennifer Doudna ve Emmanuelle Charpentier'e verildi.", color: "#ffd54f", icon: "🏆", isHighlight: true },
  { year: "2023", en: "FDA approves Casgevy — the first CRISPR therapy — for sickle cell disease and β-thalassemia. A new era begins.", tr: "FDA, orak hücre hastalığı ve β-talasemi için ilk CRISPR terapisi olan Casgevy'yi onayladı. Yeni bir çağ başlıyor.", color: "#69f0ae", icon: "✅", isHighlight: true },
];

export default function TimelineSection() {
  const { lang } = useLang();
  const T = UI[lang];

  return (
    <section className="tl-section">
      <div className="tl-header">
        <div className="tl-title-group">
          <h2 className="tl-title">{T.timelineTitle}</h2>
          <p className="tl-sub">{T.timelineSub}</p>
        </div>
      </div>

      <div className="tl-scroll-wrap">
        <div className="tl-track">
          {/* Connecting line */}
          <div className="tl-line" />

          {EVENTS.map((ev, i) => (
            <motion.div
              key={ev.year}
              className={`tl-event ${ev.isHighlight ? "tl-event-highlight" : ""}`}
              style={{ "--ev-color": ev.color } as React.CSSProperties}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
            >
              {/* Dot */}
              <div className="tl-dot-wrap">
                <div
                  className="tl-dot"
                  style={{ borderColor: ev.color, boxShadow: ev.isHighlight ? `0 0 18px ${ev.color}60` : undefined }}
                >
                  <span className="tl-dot-icon">{ev.icon}</span>
                </div>
              </div>

              {/* Card */}
              <div
                className="tl-card"
                style={
                  ev.isHighlight
                    ? { borderColor: `${ev.color}55`, background: `linear-gradient(145deg, ${ev.color}10, rgba(255,255,255,0.03))` }
                    : {}
                }
              >
                <div className="tl-year" style={{ color: ev.color }}>
                  {ev.year}
                </div>
                <p className="tl-desc">{lang === "tr" ? ev.tr : ev.en}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
