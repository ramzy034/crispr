import type { Lang } from "./LangContext";

export const UI: Record<Lang, Record<string, string>> = {
  en: {
    // Nav
    navLearn: "Learning Path",
    navLab: "Designer Tool",
    navExport: "Export Data",

    // Designer Hero
    heroKicker: "VIRTUAL GENETIC ENGINEERING",
    heroTitle1: "CRISPR Paired-Guide",
    heroTitle2: "Designer Tool",
    heroSub:
      "Design, visualise, and test paired-guide RNA candidates. Explore clinical disease models and simulate how molecular scissors edit the code of life.",
    heroStep1: "Select a clinical target",
    heroStep2: "Choose two guide RNAs",
    heroStep3: "Inspect the 3-D excision",

    // SubNav
    subnavBiology: "Biology",
    subnavDesigner: "Designer",
    subnavResults: "Results",

    // Biology section
    sectionBiology: "The Biology",
    simLabel: "Real-time 3D Simulation",
    simLive: "LIVE",
    simHint:
      "Select two guides from the table below — the 3-D model will animate the deletion.",

    // Designer section
    sectionDesigner: "Designer Console",
    sectionDesignerBadge: "STUDENT WORKSPACE",
    seqInputLabel: "Sequence Input",
    seqInputHint: "Paste a genomic FASTA sequence or use the demo below.",
    seqRawChars: "Raw chars:",
    seqCleaned: "Cleaned:",
    btnResetDemo: "Reset to Demo",
    btnClearSel: "Clear Selection",
    filtersLabel: "Guide Quality Filters",
    filtersHint: "Narrow candidates by biochemical properties.",
    strandLabel: "DNA Strand",
    strandBoth: "Both",
    strandFwd: "Forward +",
    strandRev: "Reverse −",
    gcLabel: "GC Content Range",
    gcOptimal: "(optimal 0.40–0.60)",
    hideWarnLabel: "Hide low-efficiency guides automatically",
    genomeMapLabel: "Genome Mapping",
    guidesLabel: "Candidate Guide Library",
    outcomeLabel: "Experimental Outcome",
    excisionRate: "EXCISION SUCCESS RATE",
    effHigh: "High efficiency predicted",
    effMed: "Moderate efficiency — consider optimising GC content",
    effLow: "Low efficiency — review guide selection",
    selectGuides: "Select two guides to compute outcome metrics",

    // Export section
    sectionExport: "Lab Report & Export",
    exportTitle: "Download Your Results",
    exportHint:
      "Export all candidate guides as CSV for spreadsheet analysis, or generate a formal PDF summary of the selected CRISPR pair.",
    btnExportCSV: "↓ Export CSV",
    btnExportPDF: "↓ Generate PDF Report",

    // Learning page
    lpBadge: "INTERACTIVE LEARNING PATH",
    lpTitleBefore: "Master ",
    lpTitleAfter: "Gene Editing",
    lpSub:
      "From molecular scissors to FDA-approved therapies. Four research-grade modules with interactive diagrams, real clinical examples, and knowledge checks.",
    lpStatModules: "Core Modules",
    lpStatSections: "Sections",
    lpStatQuiz: "Quiz Questions",
    lpStatFDA: "FDA Approved",
    lpProgressLabel: "Your Progress",
    lpModulesOf: "of",
    lpModulesComplete: "modules complete",
    lpSelectModule: "SELECT A MODULE",
    lpDone: "Done",
    lpStart: "Start",
    lpReview: "Review",
    lpLocked: "Complete previous module",
    lpAllDone: "All Modules Complete",
    lpReadyTitle: "You're ready to design.",
    lpReadySub:
      "You now understand the biology, the deletion strategy, how cells repair DNA, and how CRISPR is delivered. Time to put it into practice.",
    lpOpenLab: "Open the Designer Tool",

    // IntroBlog
    introKicker: "CRISPR 101",
    introTitle: "The Molecular Stapler",
    introParagraph:
      "Imagine your DNA is a giant book of instructions. Sometimes, a page has a typo that causes disease. CRISPR-Cas9 is a biological tool that can find that specific page and cut it out.",
    step1Label: "1. Search",
    step1Body: 'gRNA finds the exact DNA "address."',
    step2Label: "2. Cut",
    step2Body: "Cas9 scissors make two precise breaks.",
    step3Label: "3. Delete",
    step3Body: "The cell repairs the gap, removing the segment.",
    introLabTitle: "Interactive Lab: Select a Disease",
    introLabPlaceholder: "-- Start by choosing a target --",
    introLoading: "Loading target specifications...",
    introFeasibility: "FEASIBILITY",
    introDelivery: "Delivery Method",
    introStrategy: "Scientific Strategy",
    introGeneName: "Gene Name",
    introStatus: "Target Status",
    introValid: "Valid",
    introBlocked: "Blocked",
    introSelectPrompt:
      "Please select a clinical model to view genomic strategy...",
    introGlossary: "Quick Definitions",
    introGrna: "The GPS",
    introCas9: "The Scissors",
    introPam: 'The "Start" Signal',

    // ConceptModal
    cmKnowledgeCheck: "Knowledge Check",
    cmBack: "Back",
    cmNext: "Next",
    cmTakeQuiz: "Take Quiz",

    // QuizBlock
    qbQuestion: "Question",
    qbOf: "of",
    qbSubmit: "Submit Answer",
    qbNextQ: "Next Question →",
    qbSeeResults: "See Results →",
    qbPerfect: "Perfect Score! 🎉",
    qbPassed: "Module Passed! ✓",
    qbFailed: "Keep Learning 📚",
    qbPassSub: "You've demonstrated a solid understanding of this topic.",
    qbFailSub:
      "Review the material and try again — the concepts take time to stick.",
    qbComplete: "Complete Module →",
    qbCompleteAnyway: "Complete Anyway →",

    // Glossary page
    navGlossary: "Glossary",
    glossaryBadge: "REFERENCE GUIDE",
    glossaryTitle: "CRISPR Glossary",
    glossarySub: "30+ essential terms for understanding CRISPR gene editing — from base pairs to prime editing.",
    glossarySearch: "Filter terms...",
    glossaryAll: "All",
    glossaryTerms: "terms",
    glossaryNoResults: "No results for",

    // Search modal
    searchPlaceholder: "Search terms, modules, definitions...",
    searchClose: "Close",
    searchNoResults: "No results found for",
    searchInGlossary: "Glossary",
    searchInModules: "Modules",

    // Timeline
    timelineTitle: "CRISPR Through History",
    timelineSub: "Key milestones from bacterial immunity to FDA-approved therapy",

    // Fun facts
    factCardTitle: "Did you know?",

    // Reset progress
    resetProgressBtn: "Reset Progress",
    resetConfirmMsg: "Reset all learning progress? This cannot be undone.",
    resetConfirmYes: "Reset",
    resetConfirmNo: "Cancel",

    // Footer
    footerTagline: "An open educational platform for CRISPR gene editing.",
    footerSources: "Further Reading",
    footerDisclaimer: "For educational purposes only. Not medical advice.",
    footerMade: "Made for students everywhere.",

    // New nav pages
    navMethodology: "Methodology",
    navReferences: "References",

    // Redesigned lab labels (honest/heuristic)
    designScoreLabel: "HEURISTIC DESIGN SCORE",
    designScoreNote: "Educational approximation · not wet-lab validated",
    heuristicBadge: "HEURISTIC",

    // Quiz retry
    qbRetry: "Try Again",

    // Methodology page
    mpBadge: "SCORING METHODOLOGY",
    mpTitle: "How This Tool Works",
    mpSub: "A transparent explanation of the algorithms, heuristics, and limitations behind every score in this tool.",
    mpOnTargetTitle: "On-Target Scoring",
    mpOnTargetBody: "The on-target score estimates how efficiently a guide RNA will direct Cas9 to cut its intended site. Our model is a rule-based heuristic that penalises sequence features known to reduce activity — extreme GC content, polyT runs, and long homopolymers. It is inspired by published design principles (Doench et al., 2016) but is not a trained machine-learning model and has not been benchmarked against wet-lab data.",
    mpFormula: "SCORING FORMULA (0–100 scale)",
    mpOnTargetNote: "This score is a starting point for guide selection, not a validated prediction. Two guides with similar scores may perform very differently in an actual experiment.",
    mpOffTargetTitle: "Off-Target Risk Estimation",
    mpOffTargetBody: "Off-target activity occurs when Cas9 cuts at a site that is not the intended target, due to partial complementarity between the guide RNA and non-target sequences. Our tool flags guides using a seed-region heuristic: mismatches in the PAM-proximal 12 nt (the seed) are weighted more heavily because they are more disruptive to Cas9 binding.",
    mpWhatItDoes: "What the heuristic does",
    mpWhatItDoesnt: "What it does NOT do",
    mpOffDoes1: "Estimates relative specificity based on sequence features",
    mpOffDoes2: "Penalises seed-region (PAM-proximal 12 nt) problems more heavily",
    mpOffDoes3: "Flags BAD_SEED warning when seed region contains problematic motifs",
    mpOffDoesnt1: "Perform genome-wide off-target search (no reference genome is loaded)",
    mpOffDoesnt2: "Predict actual cellular off-target activity",
    mpOffDoesnt3: "Replace specialised tools: CRISPOR, CHOPCHOP, or Cas-OFFinder",
    mpKoKiTitle: "Knockout (KO) vs Knock-in (KI)",
    mpKoKiBody: "This tool is designed for deletion/knockout strategies using paired guides. Understanding the distinction between KO and KI is fundamental to experimental design.",
    mpKoKiNote: "This tool models deletion-based knockout only. Knock-in (HDR) experiments require a separate donor template design and are not evaluated here.",
    mpPairTitle: "Pair Feasibility Score",
    mpPairBody: "When two guides are selected, the tool computes a pair feasibility score representing the expected ease of achieving a clean deletion. This is a simplified heuristic based on GC content of both guides and the size of the predicted deletion.",
    mpLimTitle: "Important Limitations",
    mpLim1: "Scores are heuristic approximations — not trained machine-learning models.",
    mpLim2: "No reference genome is loaded — off-target search is restricted to the input sequence only.",
    mpLim3: "Cell type, chromatin accessibility, and delivery efficiency are not modelled.",
    mpLim4: "Indel frequency and editing efficiency depend on many variables not captured here.",
    mpLim5: "This tool is for educational and early-stage exploratory design only.",
    mpLim6: "Always validate guide designs experimentally before any clinical or research use.",
    mpInterpTitle: "How to Interpret Scores",
    mpScoreHigh: "Good design candidate",
    mpScoreHighNote: "GC content is near-optimal and no major sequence warnings are flagged. Suitable for prioritising in a guide set.",
    mpScoreMed: "Acceptable — review warnings",
    mpScoreMedNote: "The guide has minor design concerns. May still work in practice; compare against higher-scoring alternatives.",
    mpScoreLow: "Poor design — avoid if possible",
    mpScoreLowNote: "One or more significant sequence issues detected. Likely to have reduced activity or increased off-target risk.",
    mpInterpNote: "Score thresholds (70 / 45) are heuristic cutoffs. A score of 72 is not meaningfully better than 68 — use these as rough tiers, not precise predictions.",

    // References page
    rpBadge: "ACADEMIC REFERENCES",
    rpTitle: "Sources & Citations",
    rpSub: "Key literature supporting the biology, design principles, and clinical context presented in this tool.",
    rpDisclaimer: "This tool draws on published literature for educational context. Citations are provided for further reading. All original research belongs to the respective authors and journals.",
  },

  tr: {
    // Nav
    navLearn: "Öğrenme Yolu",
    navLab: "Tasarım Aracı",
    navExport: "Veri Dışa Aktar",

    // Designer Hero
    heroKicker: "SANAL GENETİK MÜHENDİSLİK",
    heroTitle1: "CRISPR Çift Kılavuz",
    heroTitle2: "Tasarım Aracı",
    heroSub:
      "Eşleştirilmiş kılavuz RNA adaylarını tasarlayın, görselleştirin ve test edin. Klinik hastalık modellerini keşfedin ve moleküler makasların yaşamın kodunu nasıl düzenlediğini simüle edin.",
    heroStep1: "Klinik hedef seçin",
    heroStep2: "İki kılavuz RNA seçin",
    heroStep3: "3B eksizyonu inceleyin",

    // SubNav
    subnavBiology: "Biyoloji",
    subnavDesigner: "Tasarım",
    subnavResults: "Sonuçlar",

    // Biology section
    sectionBiology: "Biyoloji",
    simLabel: "Gerçek Zamanlı 3B Simülasyon",
    simLive: "CANLI",
    simHint:
      "Aşağıdaki tablodan iki kılavuz seçin — 3B model silme işlemini canlandıracak.",

    // Designer section
    sectionDesigner: "Tasarım Konsolu",
    sectionDesignerBadge: "ÖĞRENCİ ÇALIŞMA ALANI",
    seqInputLabel: "Dizi Girişi",
    seqInputHint:
      "Genomik FASTA dizisi yapıştırın veya aşağıdaki demoyu kullanın.",
    seqRawChars: "Ham karakter:",
    seqCleaned: "Temizlendi:",
    btnResetDemo: "Demoya Sıfırla",
    btnClearSel: "Seçimi Temizle",
    filtersLabel: "Kılavuz Kalite Filtreleri",
    filtersHint: "Adayları biyokimyasal özelliklere göre daraltın.",
    strandLabel: "DNA İpliği",
    strandBoth: "Her İkisi",
    strandFwd: "İleri +",
    strandRev: "Ters −",
    gcLabel: "GC İçerik Aralığı",
    gcOptimal: "(optimal 0.40–0.60)",
    hideWarnLabel: "Düşük verimli kılavuzları otomatik olarak gizle",
    genomeMapLabel: "Genom Haritalaması",
    guidesLabel: "Aday Kılavuz Kitaplığı",
    outcomeLabel: "Deney Sonucu",
    excisionRate: "EKSİZYON BAŞARI ORANI",
    effHigh: "Yüksek verimlilik tahmin ediliyor",
    effMed: "Orta verimlilik — GC içeriğini optimize etmeyi düşünün",
    effLow: "Düşük verimlilik — kılavuz seçimini gözden geçirin",
    selectGuides:
      "Sonuç metriklerini hesaplamak için iki kılavuz seçin",

    // Export section
    sectionExport: "Laboratuvar Raporu ve Dışa Aktarma",
    exportTitle: "Sonuçlarınızı İndirin",
    exportHint:
      "Tüm aday kılavuzları elektronik tablo analizi için CSV olarak dışa aktarın veya seçilen CRISPR çifti için resmi bir PDF özeti oluşturun.",
    btnExportCSV: "↓ CSV Dışa Aktar",
    btnExportPDF: "↓ PDF Raporu Oluştur",

    // Learning page
    lpBadge: "ETKİLEŞİMLİ ÖĞRENME YOLU",
    lpTitleBefore: "",
    lpTitleAfter: "Gen Düzenlemeyi Öğrenin",
    lpSub:
      "Moleküler makastan FDA onaylı terapilere. Etkileşimli diyagramlar, gerçek klinik örnekler ve bilgi kontrolleri içeren dört araştırma düzeyinde modül.",
    lpStatModules: "Temel Modüller",
    lpStatSections: "Bölümler",
    lpStatQuiz: "Test Soruları",
    lpStatFDA: "FDA Onaylı",
    lpProgressLabel: "İlerlemeniz",
    lpModulesOf: "/",
    lpModulesComplete: "modül tamamlandı",
    lpSelectModule: "MODÜL SEÇİN",
    lpDone: "Tamamlandı",
    lpStart: "Başla",
    lpReview: "Tekrar",
    lpLocked: "Önceki modülü tamamlayın",
    lpAllDone: "Tüm Modüller Tamamlandı",
    lpReadyTitle: "Tasarlamaya hazırsınız.",
    lpReadySub:
      "Artık biyolojiyi, silme stratejisini, hücrelerin DNA'yı nasıl onardığını ve CRISPR'ın nasıl iletildiğini anlıyorsunuz. Bunu pratiğe dökme zamanı.",
    lpOpenLab: "Tasarım Aracını Aç",

    // IntroBlog
    introKicker: "CRISPR 101",
    introTitle: "Moleküler Zımba",
    introParagraph:
      "DNA'nızı devasa bir talimat kitabı olarak hayal edin. Bazen bir sayfada hastalığa neden olan bir yazım hatası olur. CRISPR-Cas9, o belirli sayfayı bulup kesebilen biyolojik bir araçtır.",
    step1Label: "1. Ara",
    step1Body: "gRNA tam DNA 'adresini' bulur.",
    step2Label: "2. Kes",
    step2Body: "Cas9 makası iki hassas kırık yapar.",
    step3Label: "3. Sil",
    step3Body: "Hücre boşluğu onararak segmenti kaldırır.",
    introLabTitle: "Etkileşimli Laboratuvar: Bir Hastalık Seçin",
    introLabPlaceholder: "-- Bir hedef seçerek başlayın --",
    introLoading: "Hedef özellikleri yükleniyor...",
    introFeasibility: "UYGULANABİLİRLİK",
    introDelivery: "İletim Yöntemi",
    introStrategy: "Bilimsel Strateji",
    introGeneName: "Gen Adı",
    introStatus: "Hedef Durumu",
    introValid: "Geçerli",
    introBlocked: "Engellendi",
    introSelectPrompt:
      "Genomik stratejiyi görüntülemek için lütfen bir klinik model seçin...",
    introGlossary: "Hızlı Tanımlar",
    introGrna: "GPS",
    introCas9: "Makas",
    introPam: "'Başlat' Sinyali",

    // ConceptModal
    cmKnowledgeCheck: "Bilgi Kontrolü",
    cmBack: "Geri",
    cmNext: "İleri",
    cmTakeQuiz: "Sınava Gir",

    // QuizBlock
    qbQuestion: "Soru",
    qbOf: "/",
    qbSubmit: "Cevabı Gönder",
    qbNextQ: "Sonraki Soru →",
    qbSeeResults: "Sonuçları Gör →",
    qbPerfect: "Mükemmel Puan! 🎉",
    qbPassed: "Modül Geçildi! ✓",
    qbFailed: "Öğrenmeye Devam Et 📚",
    qbPassSub: "Bu konuda sağlam bir anlayış sergilediğinizi gösterdiniz.",
    qbFailSub:
      "Konuyu gözden geçirin ve tekrar deneyin — kavramların yerleşmesi zaman alır.",
    qbComplete: "Modülü Tamamla →",
    qbCompleteAnyway: "Yine de Tamamla →",

    // Glossary page
    navGlossary: "Sözlük",
    glossaryBadge: "BAŞVURU KILAVUZU",
    glossaryTitle: "CRISPR Sözlüğü",
    glossarySub: "CRISPR gen düzenlemesini anlamak için 30'dan fazla temel terim — baz çiftlerinden prime editing'e.",
    glossarySearch: "Terimleri filtrele...",
    glossaryAll: "Tümü",
    glossaryTerms: "terim",
    glossaryNoResults: "Sonuç bulunamadı:",

    // Search modal
    searchPlaceholder: "Terim, modül, tanım ara...",
    searchClose: "Kapat",
    searchNoResults: "Sonuç bulunamadı:",
    searchInGlossary: "Sözlük",
    searchInModules: "Modüller",

    // Timeline
    timelineTitle: "Tarihte CRISPR",
    timelineSub: "Bakteriyel bağışıklıktan FDA onaylı terapiye önemli kilometre taşları",

    // Fun facts
    factCardTitle: "Biliyor muydunuz?",

    // Reset progress
    resetProgressBtn: "İlerlemeyi Sıfırla",
    resetConfirmMsg: "Tüm öğrenme ilerlemesi sıfırlansın mı? Bu işlem geri alınamaz.",
    resetConfirmYes: "Sıfırla",
    resetConfirmNo: "İptal",

    // Footer
    footerTagline: "CRISPR gen düzenlemesi için açık bir eğitim platformu.",
    footerSources: "Daha Fazla Kaynak",
    footerDisclaimer: "Yalnızca eğitim amaçlıdır. Tıbbi tavsiye değildir.",
    footerMade: "Her yerdeki öğrenciler için yapıldı.",

    // New nav pages
    navMethodology: "Metodoloji",
    navReferences: "Kaynaklar",

    // Redesigned lab labels
    designScoreLabel: "HEURİSTİK TASARIM PUANI",
    designScoreNote: "Eğitim amaçlı yaklaşım · deneysel doğrulama yapılmamıştır",
    heuristicBadge: "HEURİSTİK",

    // Quiz retry
    qbRetry: "Tekrar Dene",

    // Methodology page
    mpBadge: "PUANLAMA METODOLOJİSİ",
    mpTitle: "Bu Araç Nasıl Çalışır",
    mpSub: "Bu araçtaki her puanın arkasındaki algoritmaların, buluşsal yöntemlerin ve sınırlamaların şeffaf bir açıklaması.",
    mpOnTargetTitle: "Hedef Puanlama",
    mpOnTargetBody: "Hedef puanı, kılavuz RNA'nın Cas9'u amaçlanan kesim bölgesine ne kadar verimli yönlendireceğini tahmin eder. Modelimiz, bilinen aktivite azaltıcı özellikleri penalize eden kural tabanlı bir buluşsal yöntemdir — aşırı GC içeriği, poliT dizileri ve uzun homopolimerler gibi. Yayımlanmış tasarım ilkelerinden (Doench ve ark., 2016) ilham alınmıştır ancak eğitimli bir makine öğrenmesi modeli değildir.",
    mpFormula: "PUANLAMA FORMÜLÜ (0–100 ölçeği)",
    mpOnTargetNote: "Bu puan, kılavuz seçimi için bir başlangıç noktasıdır, doğrulanmış bir tahmin değildir. Benzer puanlara sahip iki kılavuz gerçek deneyde çok farklı performans gösterebilir.",
    mpOffTargetTitle: "Hedef Dışı Risk Tahmini",
    mpOffTargetBody: "Hedef dışı aktivite, kılavuz RNA ile hedef dışı diziler arasındaki kısmi tamamlayıcılık nedeniyle Cas9'un amaçlanmayan bir bölgeyi kestiğinde meydana gelir. Aracımız, PAM'a yakın 12 nt tohum bölgesindeki sorunları daha ağırlıklı penalize eden bir tohum bölgesi buluşsalı kullanır.",
    mpWhatItDoes: "Buluşsalın yaptıkları",
    mpWhatItDoesnt: "Buluşsalın YAPMADIĞI",
    mpOffDoes1: "Dizi özelliklerine göre göreceli özgüllüğü tahmin eder",
    mpOffDoes2: "Tohum bölgesi (PAM'a yakın 12 nt) sorunlarını daha ağırlıklı penalize eder",
    mpOffDoes3: "Tohum bölgesi sorunluysa BAD_SEED uyarısıyla işaretler",
    mpOffDoesnt1: "Genom çapında hedef dışı arama yapmaz (referans genom yüklü değil)",
    mpOffDoesnt2: "Gerçek hücresel hedef dışı aktiviteyi tahmin etmez",
    mpOffDoesnt3: "CRISPOR, CHOPCHOP veya Cas-OFFinder gibi araçların yerini tutmaz",
    mpKoKiTitle: "Nakavt (KO) ve Knock-in (KI)",
    mpKoKiBody: "Bu araç, eşleştirilmiş kılavuzlar kullanan delesyon/nakavt stratejileri için tasarlanmıştır. KO ile KI arasındaki farkı anlamak, deneysel tasarım için temeldir.",
    mpKoKiNote: "Bu araç yalnızca delesyon tabanlı nakavt modellemektedir. Knock-in (HDR) deneyleri ayrı bir donör şablon tasarımı gerektirir ve burada değerlendirilmez.",
    mpPairTitle: "Çift Uygulanabilirlik Puanı",
    mpPairBody: "İki kılavuz seçildiğinde araç, temiz bir delesyon elde etmenin beklenen kolaylığını temsil eden bir çift uygulanabilirlik puanı hesaplar. Bu, her iki kılavuzun GC içeriğine ve tahmin edilen delesyon boyutuna dayalı basitleştirilmiş bir buluşsaldır.",
    mpLimTitle: "Önemli Sınırlamalar",
    mpLim1: "Puanlar buluşsal yaklaşımlardır — eğitimli makine öğrenmesi modelleri değildir.",
    mpLim2: "Referans genom yüklü değil — hedef dışı arama yalnızca girdi dizisiyle sınırlıdır.",
    mpLim3: "Hücre tipi, kromatin erişilebilirliği ve iletim verimliliği modellenmemiştir.",
    mpLim4: "İndel sıklığı ve düzenleme verimliliği burada yakalanmayan birçok değişkene bağlıdır.",
    mpLim5: "Bu araç yalnızca eğitim ve erken aşama keşif tasarımı içindir.",
    mpLim6: "Kılavuz tasarımlarını her zaman klinik veya araştırma kullanımından önce deneysel olarak doğrulayın.",
    mpInterpTitle: "Puanlar Nasıl Yorumlanır",
    mpScoreHigh: "İyi tasarım adayı",
    mpScoreHighNote: "GC içeriği optimale yakın ve önemli dizi uyarısı yok. Bir kılavuz setinde önceliklendirilebilir.",
    mpScoreMed: "Kabul edilebilir — uyarıları inceleyin",
    mpScoreMedNote: "Kılavuzda küçük tasarım endişeleri var. Pratikte çalışabilir; daha yüksek puanlı alternatiflerle karşılaştırın.",
    mpScoreLow: "Zayıf tasarım — mümkünse kaçının",
    mpScoreLowNote: "Bir veya daha fazla önemli dizi sorunu tespit edildi. Azalmış aktivite veya artan hedef dışı risk muhtemeldir.",
    mpInterpNote: "Puan eşikleri (70 / 45) buluşsal sınır değerlerdir. 72 puanı 68'den anlamlı ölçüde iyi değildir — bunları kesin tahminler olarak değil, kaba katmanlar olarak kullanın.",

    // References page
    rpBadge: "AKADEMİK KAYNAKLAR",
    rpTitle: "Kaynaklar ve Atıflar",
    rpSub: "Bu araçta sunulan biyoloji, tasarım ilkeleri ve klinik bağlamı destekleyen temel literatür.",
    rpDisclaimer: "Bu araç eğitim bağlamı için yayımlanmış literatürden yararlanmaktadır. Atıflar daha fazla okuma için sağlanmıştır. Tüm orijinal araştırmalar ilgili yazarlar ve dergilere aittir.",
  },
};
