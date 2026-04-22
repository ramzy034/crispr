import type { Chapter } from "./learningData";

export const CHAPTERS_TR: Chapter[] = [
  {
    id: "what-is-crispr",
    title: "CRISPR Nedir?",
    subtitle: "Moleküler makaslar açıklandı",
    emoji: "✂️",
    color: "#4fc3f7",
    accentDark: "#0d2a3a",
    estimatedMinutes: 5,
    sections: [
      {
        heading: "DNA — Yaşamın Kitabı",
        visual: "dna-animation",
        content: [
          {
            type: "paragraph",
            text: "Vücudunuzdaki her hücre yaklaşık 3 milyar baz çifti DNA içerir — sizi inşa edip çalıştırmak için eksiksiz, mikroskobik bir talimat kılavuzu. Bu kılavuz, her biri belirli bir protein veya işlevden sorumlu yaklaşık 20.000 gene ayrılmıştır.",
          },
          {
            type: "highlight",
            text: "3 milyar baz çiftinden yalnızca 1'ini etkileyen bir gendeki tek 'yazım hatası' — tek bir baz çifti mutasyonu — Orak Hücre Anemisi, Huntington Hastalığı veya Kistik Fibrozis gibi yıkıcı hastalıklara yol açabilir.",
            color: "#4fc3f7",
          },
          {
            type: "fact-grid",
            facts: [
              { label: "İnsan genomundaki baz çiftleri", value: "3,2 Milyar", color: "#4fc3f7" },
              { label: "Protein kodlayan genler", value: "~20.000", color: "#81c784" },
              { label: "Her hücredeki DNA uzunluğu", value: "~2 metre", color: "#ffb74d" },
              { label: "İnsan vücudundaki hücreler", value: "37 Trilyon", color: "#ce93d8" },
            ],
          },
        ],
      },
      {
        heading: "CRISPR-Cas9'a Giriş",
        visual: "cas9-diagram",
        content: [
          {
            type: "paragraph",
            text: "CRISPR (Kümelenmiş Düzenli Aralıklı Kısa Palindromik Tekrarlar), başlangıçta bakteriyel bağışıklık sisteminin bir parçası olarak keşfedildi. Bakteriler onu, daha önce enfekte etmiş viral DNA'yı tanıyıp yok etmek için kullanır. Bilim insanları bu doğal sistemi, şimdiye kadar yaratılmış en güçlü gen düzenleme araçlarından birine dönüştürdü.",
          },
          {
            type: "steps",
            steps: [
              {
                icon: "🔍",
                title: "Ara",
                body: "Özel bir kılavuz RNA (gRNA) — kısa, sentetik bir RNA parçası — hedeflenen tam DNA dizisiyle eşleşen bir sırayla programlanır. Milyarlarca baz çiftini tarayarak eşleşmesini bulur.",
              },
              {
                icon: "✂️",
                title: "Kes",
                body: "Hedef bölgeye yönlendirilen Cas9 proteini moleküler makas görevi görür. DNA sarmalının her iki ipliğini de keserek hassas bir çift iplik kırığı oluşturur.",
              },
              {
                icon: "🔧",
                title: "Düzenle",
                body: "Hücre kırığı tespit eder ve onarım mekanizmasını harekete geçirir. Bilim insanları bu onarım sürecini belirli genetik dizileri silmek, bozmak veya değiştirmek için kullanabilir.",
              },
            ],
          },
          {
            type: "highlight",
            text: "2020 Nobel Ödülü: Jennifer Doudna ve Emmanuelle Charpentier, CRISPR-Cas9'u gen düzenleme aracı olarak geliştirdikleri için Kimya alanında Nobel Ödülü'nü aldı.",
            color: "#ffd54f",
          },
        ],
      },
      {
        heading: "CRISPR Neden Her Şeyi Değiştirdi",
        visual: "video",
        content: [
          {
            type: "video",
            url: "https://www.youtube.com/embed/2pp17E4E-O8",
            caption: "CRISPR DNA'mızı nasıl düzenler — Jennifer Doudna'nın TED Konuşması",
          },
          {
            type: "paragraph",
            text: "CRISPR'dan önce ZFN ve TALEN gibi gen düzenleme araçları mevcuttu, ancak bunların tasarımı inanılmaz derecede pahalı, yavaş ve tutarsızdı. CRISPR, gen düzenlemeyi demokratikleştirdi — tasarımı daha hızlıdır (aylar yerine günler), daha ucuzdur (on binler yerine yüzler) ve neredeyse her organizmada çalışır.",
          },
          {
            type: "comparison",
            left: {
              title: "CRISPR Öncesi",
              color: "#ef9a9a",
              items: [
                "Düzenleme araçları tasarımı aylar sürer",
                "Deney başına 10.000–50.000 dolar",
                "Düşük özgüllük",
                "Birkaç organizmada sınırlı",
                "Yüksek uzmanlaşma gerektirir",
              ],
            },
            right: {
              title: "CRISPR ile",
              color: "#81c784",
              items: [
                "Kılavuz RNA tasarımı günler sürer",
                "Deney başına 100 doların altında",
                "Yüksek hassas hedefleme",
                "Her organizmada çalışır",
                "Çoğu biyoloji laboratuvarına erişilebilir",
              ],
            },
          },
        ],
      },
    ],
    quiz: [
      {
        question: "CRISPR-Cas9'da kılavuz RNA'nın (gRNA) rolü nedir?",
        options: [
          "DNA çift sarmalını fiziksel olarak keser",
          "Bir GPS görevi görür — Cas9'u tam DNA hedef dizisine yönlendirir",
          "Cas9'un kesmesinin ardından DNA kırığını onarır",
          "Cas9 proteinini hücre çekirdeğine taşır",
        ],
        correct: 1,
        explanation:
          "gRNA, hedef bölgedeki tamamlayıcı DNA dizisiyle baz çifti oluşturarak moleküler bir GPS görevi görür. Cas9, gRNA'yı takip eder ve tam o konumda kesimi yapar.",
      },
      {
        question: "CRISPR-Cas9 özünde nereden gelir?",
        options: [
          "Bilim insanları tarafından laboratuvarda sıfırdan tasarlandı",
          "Bir mantar savunma mekanizmasından türetildi",
          "Bakterilerin doğal bağışıklık sisteminin bir parçasıdır",
          "İnsan genomunda bulundu",
        ],
        correct: 2,
        explanation:
          "Bakteriler CRISPR'ı adaptif bir bağışıklık sistemi olarak kullanır — viral DNA parçalarını depolar ve virüs tekrar saldırırsa bu viral DNA'yı tanımak ve kesmek için Cas9 kullanır. Bilim insanları bu doğal sistemi yeniden kullandı.",
      },
      {
        question: "CRISPR için 2020 Nobel Ödülü'nü kim kazandı?",
        options: [
          "Francis Crick ve James Watson",
          "Jennifer Doudna ve Emmanuelle Charpentier",
          "David Baltimore ve Howard Temin",
          "Craig Venter ve George Church",
        ],
        correct: 1,
        explanation:
          "Jennifer Doudna (UC Berkeley) ve Emmanuelle Charpentier (Max Planck Enstitüsü), CRISPR-Cas9'u hassas bir gen düzenleme aracına dönüştürdükleri için ortaklaşa 2020 Kimya Nobel Ödülü'nü aldı.",
      },
    ],
  },
  {
    id: "paired-deletions",
    title: "Eşleştirilmiş Silemeler",
    subtitle: "Bir DNA segmentini eksiz etmek için iki kılavuz RNA kullanmak",
    emoji: "🔬",
    color: "#81c784",
    accentDark: "#0a1f0a",
    estimatedMinutes: 6,
    sections: [
      {
        heading: "Tek Kesi ile Sorun",
        visual: "nhej-diagram",
        content: [
          {
            type: "paragraph",
            text: "Tek bir CRISPR kesisi yapıldığında, hücrenin onarım mekanizması (NHEJ) kırığı hızla sarar — çoğunlukla saatler içinde. Sonuç, kesi bölgesinde küçük bir rastgele ekleme veya silme (indel) olur. Bu bir geni bozabilirse de büyük bir düzenleyici bölgeyi kaldırmaz.",
          },
          {
            type: "highlight",
            text: "Bir DNA segmentinin tamamını silmek — hastalığa neden olan bir güçlendirici veya konak DNA'sına entegre edilmiş viral bir genom gibi — kaldırmak istediğiniz bölgeyi çevreleyen iki kesiye ihtiyacınız vardır.",
            color: "#81c784",
          },
          {
            type: "paragraph",
            text: "Bu strateji eşleştirilmiş silme veya CRISPR eksizyonu olarak adlandırılır. İki kılavuz RNA, silinecek bölgenin her iki tarafındaki dizileri hedefler. Her iki Cas9 kompleksi eş zamanlı olarak keser ve hücre iki serbest ucu birleştirerek aralarındaki segmenti tamamen düşürür.",
          },
        ],
      },
      {
        heading: "Eksizyonun Mekaniği",
        visual: "grna-diagram",
        content: [
          {
            type: "steps",
            steps: [
              {
                icon: "1️⃣",
                title: "İki gRNA Tasarlayın",
                body: "Kılavuz RNA 1, silinecek bölgenin yukarısındaki (5') bir diziyi hedefler. Kılavuz RNA 2, aşağısındaki (3') bir diziyi hedefler. Birlikte hedefi çevrelerler.",
              },
              {
                icon: "2️⃣",
                title: "Eş Zamanlı Çift Kesim",
                body: "Her iki gRNA-Cas9 kompleksi aynı anda bağlanır ve keser; silme hedefinin her iki tarafında birer tane olmak üzere iki çift iplik kırığı oluşturur.",
              },
              {
                icon: "3️⃣",
                title: "NHEJ Uçları Birleştirir",
                body: "Hücrenin Homolojisel Olmayan Uç Birleştirme (NHEJ) yolu, orta segment serbest kaldıktan sonra geriye kalan iki serbest DNA ucunu tespit eder ve bunları birbirine bağlar.",
              },
              {
                icon: "4️⃣",
                title: "Segment Eksiz Edildi",
                body: "İki kesi bölgesi arasındaki DNA segmenti — 50 baz çiftinden birkaç kilobaza kadar herhangi bir yerde olabilir — genomdan kalıcı olarak kaldırılır.",
              },
            ],
          },
          {
            type: "fact-grid",
            facts: [
              { label: "Tipik silme boyutu", value: "50 bç – 10 kb", color: "#81c784" },
              { label: "Eksiyon verimliliği", value: "%10–60", color: "#4fc3f7" },
              { label: "NHEJ onarımı için süre", value: "Saatler", color: "#ffb74d" },
              { label: "Hedef dışı risk", value: "Kaliteli gRNA ile düşük", color: "#ce93d8" },
            ],
          },
        ],
      },
      {
        heading: "Gerçek Dünya Uygulaması: Orak Hücre Hastalığı",
        visual: "dna-animation",
        content: [
          {
            type: "highlight",
            text: "Victoria Gray, 2019'da orak hücre hastalığı için CRISPR gen düzenlemesiyle tedavi edilen ilk kişiydi. 2023 yılında FDA, yukarıda açıklanan tam BCL11A güçlendirici silme stratejisini kullanan Casgevy'yi onayladı — bu, şimdiye kadar onaylanan ilk CRISPR terapisiydi. Gray şöyle söyledi: 'Terapi, hayal edebileceğimin çok ötesinde hayatımı dönüştürdü.'",
            color: "#81c784",
          },
          {
            type: "paragraph",
            text: "Orak Hücre Hastalığı, kırmızı kan hücrelerini sert ve hilal şekilli yapan HBB genindeki bir mutasyondan kaynaklanır. Bir atılım stratejisi, HBB mutasyonunu doğrudan düzeltmez — bunun yerine BCL11A genindeki küçük bir güçlendirici bölgeyi siler.",
          },
          {
            type: "highlight",
            text: "BCL11A normalde doğumdan sonra fetal hemoglobin (HbF) üretimini baskılar. Eşleştirilmiş gRNA'larla güçlendiricisini silerek bilim insanları HbF üretimini yeniden aktive edebilir — bu, kusurlu yetişkin hemoglobinini telafi eder. Bu, FDA tarafından Aralık 2023'te onaylanan ilk CRISPR terapisi olan Casgevy'nin arkasındaki stratejidir.",
            color: "#81c784",
          },
        ],
      },
    ],
    quiz: [
      {
        question: "Silme stratejileri neden bir yerine İKİ kılavuz RNA kullanır?",
        options: [
          "İki gRNA, hücreye iletim verimliliğini artırır",
          "Tek bir gRNA hiçbir zaman yeterince özgül değildir",
          "İki flanking kesi, hücrenin aralarındaki tüm segmenti eksiz etmesine olanak tanır",
          "İki gRNA, Cas9'a karşı bağışıklık tepkisini azaltır",
        ],
        correct: 2,
        explanation:
          "Tek bir kesi NHEJ tarafından onarılır ve küçük bir indel oluşturur. Bir bölgeyi çevreleyen iki kesi, hücrenin dış uçları birleştirmesine neden olarak orta segmenti düşürür — tanımlı bir silme oluşturur.",
      },
      {
        question: "Eşleştirilmiş silemeden sonra DNA uçlarını hangi onarım mekanizması birleştirir?",
        options: [
          "Homolojiyle Yönlendirilmiş Onarım (HDR)",
          "Baz Eksizyon Onarımı (BER)",
          "Uyumsuzluk Onarımı (MMR)",
          "Homolojisel Olmayan Uç Birleştirme (NHEJ)",
        ],
        correct: 3,
        explanation:
          "NHEJ, çift iplik kırıkları için baskın onarım yoludur. Araya giren segment eksiz edildikten sonra geriye kalan iki serbest ucu birleştirir ve silme işlemini tamamlar.",
      },
      {
        question: "Orak Hücre Hastalığında BCL11A güçlendirici silme stratejisi neyi hedefler?",
        options: [
          "HBB nokta mutasyonunu doğrudan düzeltir",
          "HBB geninin tamamını siler",
          "Bir baskılayıcı güçlendiriciyi kaldırarak fetal hemoglobini yeniden aktive eder",
          "Kırmızı kan hücrelerinin hilal şeklinde olmasını önler",
        ],
        correct: 2,
        explanation:
          "BCL11A, doğumdan sonra fetal hemoglobini (HbF) baskılar. Eritroid güçlendiricisini silmek HbF'nin baskılamasını kaldırır ve kusurlu yetişkin hemoglobinini telafi eder — tam bir fonksiyonel tedavi stratejisi.",
      },
    ],
  },
  {
    id: "repair-mechanisms",
    title: "DNA Onarımı",
    subtitle: "NHEJ ve HDR — kesimden sonra ne olur",
    emoji: "🔧",
    color: "#ffb74d",
    accentDark: "#1f1000",
    estimatedMinutes: 5,
    sections: [
      {
        heading: "Hücrenin Acil Yanıtı",
        visual: "nhej-diagram",
        content: [
          {
            type: "paragraph",
            text: "Çift iplik DNA kırıkları, bir hücrenin yaşayabileceği en tehlikeli DNA hasarı biçimlerinden biridir. Onarılmadan bırakılırsa kromozomal istikrarsızlığa ve hücre ölümüne yol açarlar. Hücre, yanıt vermek için iki temel yol geliştirmiştir — ve bilim insanları her ikisini de CRISPR düzenlemesinde stratejik olarak kullanır.",
          },
          {
            type: "comparison",
            left: {
              title: "NHEJ — Hızlı & Hassas Olmayan",
              color: "#ef9a9a",
              items: [
                "Tüm hücre döngüsü aşamalarında aktif",
                "Şablon gerektirmez",
                "Hızlı (dakikalardan saatlere)",
                "Çoğunlukla küçük indeller oluşturur",
                "Gen bozma için kullanılır",
                "Çoğu hücrede baskın yol",
              ],
            },
            right: {
              title: "HDR — Yavaş & Hassas",
              color: "#81c784",
              items: [
                "Yalnızca S/G2 aşamasında aktif",
                "DNA şablonu gerektirir",
                "Daha yavaş (saatlerden günlere)",
                "Tam değişiklikler yapabilir",
                "Hassas düzeltmeler için kullanılır",
                "Ağırlıklı olarak bölünen hücrelerde etkili",
              ],
            },
          },
        ],
      },
      {
        heading: "NHEJ'in Ayrıntısı",
        visual: "nhej-diagram",
        content: [
          {
            type: "paragraph",
            text: "Homolojisel Olmayan Uç Birleştirme, iki kırık DNA ucunu şablon olmaksızın birleştirir. İlgili enzimler (Ku70/Ku80, DNA-PKcs, Ligaz IV), bu süreçte birkaç nükleotid ekleyebilir veya kaldırabilir — kesi bölgesinde küçük eklemeler veya silemeler (indeller) oluşturur.",
          },
          {
            type: "highlight",
            text: "Gen nakavt deneyleri için NHEJ aslında istenir — rastgele indeller çoğunlukla okuma çerçevesini kaydırır ve erken bir durdurma kodonu oluşturarak proteini tamamen devre dışı bırakır.",
            color: "#ffb74d",
          },
          {
            type: "steps",
            steps: [
              {
                icon: "💥",
                title: "Kırık Tespit Edildi",
                body: "Ku70/Ku80 heterodimeri, bozunmayı önleyerek saniyeler içinde her iki kırık uca hızla bağlanır.",
              },
              {
                icon: "🔍",
                title: "Uç İşleme",
                body: "DNA-PKcs ve Artemis uçları keser veya doldurur — bazen rastgele nükleotidler ekler.",
              },
              {
                icon: "🔗",
                title: "Ligasyon",
                body: "Ligaz IV/XRCC4/XLF kompleksi, dizi uyumluluğundan bağımsız olarak iki ucu birleştirir.",
              },
            ],
          },
        ],
      },
      {
        heading: "HDR — Hassas Düzenleme",
        visual: "cas9-diagram",
        content: [
          {
            type: "paragraph",
            text: "Homolojiyle Yönlendirilmiş Onarım, kesi bölgesinde tam bir değişiklik yapmak için sağlanan bir DNA şablonu (donör) kullanır. Şablon, istenen diziyi içerir ve her iki tarafında 'homolojiyi kolları' bulunur — kesimlerin her iki tarafında genomik DNA'ya eşleşen diziler. Hücre bu kolları, şablonu genomun tam içine kopyalamak için kullanır.",
          },
          {
            type: "video",
            url: "https://www.youtube.com/embed/jAhjPd4MD-E",
            caption: "NHEJ ve HDR: DNA onarım yolları açıklandı",
          },
          {
            type: "fact-grid",
            facts: [
              { label: "Bölünmeyen hücrelerde HDR verimliliği", value: "<%1", color: "#ef9a9a" },
              { label: "Bölünen hücrelerde HDR verimliliği", value: "%1–10", color: "#ffb74d" },
              { label: "Optimize protokollerle HDR", value: "%60'a kadar", color: "#81c784" },
              { label: "Gerekli homolojiyi kol uzunluğu", value: "50–1000 bç", color: "#4fc3f7" },
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        question: "Hassas düzenlemeler yapmak için hangi onarım yolu DNA şablonu gerektirir?",
        options: [
          "NHEJ",
          "HDR",
          "Her ikisi de şablon gerektirir",
          "Hiçbiri şablon kullanmaz",
        ],
        correct: 1,
        explanation:
          "HDR (Homolojiyle Yönlendirilmiş Onarım), hedef bölgeyle eşleşen homolojiyi kollarına sahip bir donör DNA şablonu gerektirir. NHEJ herhangi bir şablon olmaksızın uçları doğrudan birleştirerek çalışır.",
      },
      {
        question: "NHEJ neden gen nakavt deneyleri için kullanışlıdır?",
        options: [
          "Hedef gende hassas düzeltmeler yapar",
          "Her zaman yeni bir gen dizisi ekler",
          "Rastgele indelleri geni çerçeveden kaydırabilir ve erken bir durdurma kodonu oluşturabilir",
          "Geni bozmak yerine gen ifadesini aktive eder",
        ],
        correct: 2,
        explanation:
          "NHEJ kaynaklı indeller çoğunlukla çerçeve kayması mutasyonlarına neden olur — okuma çerçevesini kaydırarak ribozomun yanlış kodları okumasına yol açar. Bu genellikle erken bir durdurma kodonu oluşturur ve proteini keserek devre dışı bırakır.",
      },
      {
        question: "Nöronlar, kas hücreleri ve diğer bölünmeyen hücrelerde HDR neden daha az etkilidir?",
        options: [
          "Bu hücrelerin daha güçlü CRISPR bağışıklık tepkileri vardır",
          "HDR yalnızca hücre döngüsünün S/G2 aşamasında aktiftir",
          "Bölünmeyen hücrelerin daha güçlü NHEJ mekanizması vardır",
          "Cas9 bölünmeyen hücrelere giremez",
        ],
        correct: 1,
        explanation:
          "HDR, yalnızca DNA replikasyonu (S fazı) ve ardından gelen G2 fazı sırasında mevcut olan hücresel mekanizmaya dayanır. Mitoz sonrası hücreler (nöronlar, kardiyomiyositler) kalıcı olarak G0/G1'dedir, bu da HDR'yi esasen kullanılamaz kılar.",
      },
    ],
  },
  {
    id: "delivery-methods",
    title: "İletim Yöntemleri",
    subtitle: "CRISPR'ı doğru hücrelere ulaştırmak",
    emoji: "🚀",
    color: "#ce93d8",
    accentDark: "#1a0a1f",
    estimatedMinutes: 6,
    sections: [
      {
        heading: "İletim Sorunu",
        visual: "delivery-diagram",
        content: [
          {
            type: "paragraph",
            text: "İşlevsel bir CRISPR sistemine sahip olmak, savaşın yalnızca yarısıdır. Cas9 proteini ve kılavuz RNA, hücrelerin anlamlı bir bölümünü düzenlemek için yeterli konsantrasyonlarda doğru doku içindeki doğru hücre tipinin çekirdeğine fiziksel olarak iletilmelidir. Bu, gen tedavisindeki en zor çözülmemiş sorunlardan biridir.",
          },
          {
            type: "highlight",
            text: "İdeal bir iletim aracı şunlardır: toksik olmayan, immünojenik olmayan, dokuya özgü, verimli ve büyük bir genetik yükü taşıyabilir. Hiçbir mevcut teknoloji bu kriterlerin tamamını mükemmel biçimde karşılamamaktadır.",
            color: "#ce93d8",
          },
          {
            type: "fact-grid",
            facts: [
              { label: "Cas9 protein boyutu", value: "~160 kDa", color: "#ce93d8" },
              { label: "SpCas9 gen boyutu", value: "~4,2 kb", color: "#4fc3f7" },
              { label: "AAV kapasite sınırı", value: "~4,7 kb", color: "#ffb74d" },
              { label: "LNP iletim verimliliği", value: "%80'e kadar", color: "#81c784" },
            ],
          },
        ],
      },
      {
        heading: "Ex-vivo ve In-vivo",
        visual: "delivery-diagram",
        content: [
          {
            type: "comparison",
            left: {
              title: "Ex-vivo Düzenleme",
              color: "#4fc3f7",
              items: [
                "Hücreler hastadan alınır",
                "Kontrollü laboratuvar ortamında düzenlenir",
                "Yeniden infüzyon öncesi kalite kontrol edilir",
                "Kan ve bağışıklık hücreleri için çalışır",
                "Daha yüksek düzenleme verimliliği",
                "Örnek: Casgevy (Orak Hücre)",
              ],
            },
            right: {
              title: "In-vivo Düzenleme",
              color: "#ce93d8",
              items: [
                "CRISPR doğrudan vücuda iletilir",
                "Çıkarılamayan dokuları hedefler",
                "Karaciğer, göz, kas, beyin",
                "Viral veya lipid nanopartikül vektörleri kullanır",
                "Daha karmaşık, daha az kontrollü",
                "Örnek: NTLA-2001 (TTR Amiloidozu)",
              ],
            },
          },
          {
            type: "paragraph",
            text: "Ex-vivo düzenleme — hücreleri çıkarma, vücut dışında düzenleme ve geri döndürme — maksimum kontrol sağlar ve şu anda klinik olarak en başarılı yaklaşımdır. In-vivo iletim, hastaların vücudundaki hücreleri doğrudan düzenlemeyi amaçlar ve bu, çıkarılamayan organları etkileyen hastalıklar için gereklidir.",
          },
        ],
      },
      {
        heading: "İletim Araçları",
        visual: "delivery-diagram",
        content: [
          {
            type: "fact-grid",
            facts: [
              { label: "Elektroporasyon verimliliği", value: ">%80", color: "#ffb74d" },
              { label: "AAV maksimum yük", value: "4,7 kb", color: "#4fc3f7" },
              { label: "LNP partikül boyutu", value: "50–120 nm", color: "#ce93d8" },
              { label: "LNP karaciğer hedefleme", value: "%80'e kadar", color: "#81c784" },
            ],
          },
          {
            type: "steps",
            steps: [
              {
                icon: "⚡",
                title: "Elektroporasyon",
                body: "Kısa bir elektrik darbesi, hücre zarında geçici porlar açar ve Cas9 RNP (ribonükleoprotein) komplekslerinin içeri girmesine olanak tanır. Kan hücreleri için son derece etkilidir — Casgevy dahil tüm mevcut ex-vivo klinik denemelerinde kullanılır.",
              },
              {
                icon: "🧬",
                title: "Adeno İlişkili Virüs (AAV)",
                body: "Mühendislik yapılmış virüsler CRISPR bileşenlerini DNA olarak taşır. Farklı AAV serotipleri farklı dokuları hedefler (AAV9 → SSS, AAV8 → karaciğer). Sınırlama: 4,7 kb kapasitesi SpCas9 + gRNA için oldukça sıkıdır.",
              },
              {
                icon: "💊",
                title: "Lipid Nanopartikülleri (LNP'ler)",
                body: "Sentetik yağ damlacıkları Cas9 mRNA'sını ve gRNA'yı kapsüller. Karaciğer hedefleme için son derece etkilidir. Klinik sonuçlar gösteren ilk in-vivo CRISPR terapisi olan NTLA-2001'de kullanılır. mRNA geçicidir — Cas9 kısa süreliğine eksprese edilir ve bu hedef dışı riski azaltır.",
              },
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        question: "'Ex-vivo' gen düzenleme ne anlama gelir?",
        options: [
          "Enjeksiyonlar kullanarak canlı bir organizma içinde DNA düzenleme",
          "Hücreleri vücuttan çıkardıktan sonra düzenleme, ardından geri döndürme",
          "CRISPR bileşenlerini iletmek için virüs kullanma",
          "Embriyonik hücreleri implantasyon öncesinde düzenleme",
        ],
        correct: 1,
        explanation:
          "Ex-vivo düzenleme, hücreleri (örn. hematopoietik kök hücreler) hastadan çıkarır, kontrollü bir laboratuvar ortamında düzenler, kalite kontrolleri yapar ve ardından yeniden infüze eder. Bu yaklaşım, Orak Hücre Hastalığı için Casgevy'de kullanılır.",
      },
      {
        question: "AAV'nin 4,7 kb boyut sınırı CRISPR iletimi için neden bir zorluktur?",
        options: [
          "AAV'yi üretmeyi çok pahalı kılar",
          "SpCas9 geni yaklaşık 4,2 kb olup gRNA ve promotörler için neredeyse hiç yer bırakmaz",
          "AAV hücre çekirdeğine giremez",
          "4,7 kb sınırı bağışıklık tepkilerine neden olur",
        ],
        correct: 1,
        explanation:
          "SpCas9 yaklaşık 4,2 kb'dir ve bu AAV'nin tüm kapasitesini neredeyse doldurur. Bir gRNA ifade kaseti, promotörler ve düzenleyici elementleri sığdırmak büyük bir mühendislik zorluğu haline gelir. Bu sorunu çözmek için daha küçük Cas varyantları (SaCas9, CjCas9) veya split-intein stratejileri kullanılır.",
      },
      {
        question: "Cas9'u lipid nanopartikülleri aracılığıyla mRNA olarak iletmenin temel avantajı nedir?",
        options: [
          "mRNA, uzun süreli ifade için kalıcı olarak genomun içine entegre olur",
          "mRNA bir kez çevrilir ve bozunur, Cas9 aktivitesini sınırlayarak hedef dışı düzenlemeyi azaltır",
          "mRNA iletimi tüm doku tiplerini eşit olarak hedefler",
          "mRNA bağışıklık baskılaması gerektirmez",
        ],
        correct: 1,
        explanation:
          "mRNA özünde geçicidir — saatler ile günler içinde protein olarak çevrilir ve ardından bozunur. Bu, Cas9'un yalnızca kısa süreliğine aktif olduğu anlamına gelir ve uzun süreli Cas9 ifadesine yol açan DNA tabanlı iletimle kıyaslandığında hedef dışı kesimler için pencereyi azaltır.",
      },
    ],
  },
  {
    id: "ethics-future",
    title: "Etik & Gelecek",
    subtitle: "Sorumluluk, eşitlik ve yolun ilerisi",
    emoji: "⚖️",
    color: "#f06292",
    accentDark: "#1a0512",
    estimatedMinutes: 7,
    sections: [
      {
        heading: "Germline Düzenleme Tartışması",
        visual: "cas9-diagram",
        content: [
          {
            type: "paragraph",
            text: "CRISPR terapilerinin çoğu somatik hücreleri — canlı bir hastadaki üreme dışı hücreleri — hedef alır. Bu değişiklikler kalıtılamaz. Germline düzenleme ise yumurta, sperm veya erken embriyoları hedef alır; bu da değişikliklerin kalıtsal olduğu — gelecekteki tüm nesillere aktarıldığı anlamına gelir. Bu ayrım, çağımızın en önemli biyoetik tartışmasının merkezindedir.",
          },
          {
            type: "highlight",
            text: "Kasım 2018'de Çinli bilim insanı He Jiankui, CRISPR ile düzenlenmiş CCR5 genlerine sahip ikiz kız çocuklarının doğumunu duyurdu — bu, kalıtsal insan genomu düzenlemelerinin ilkiydi. Küresel bilim camiası bunu zamansız ve etik dışı olarak kınadı. He, üç yıl hapis cezasına çarptırıldı.",
            color: "#f06292",
          },
          {
            type: "comparison",
            left: {
              title: "Somatik Düzenleme ✓",
              color: "#81c784",
              items: [
                "Yalnızca tedavi edilen hastayı etkiler",
                "Değişiklikler kalıtılamaz",
                "FDA/EMA tarafından düzenlenir",
                "Casgevy bir örnektir",
                "Etik açıdan geniş çapta kabul görür",
              ],
            },
            right: {
              title: "Germline Düzenleme ⚠",
              color: "#ef9a9a",
              items: [
                "Tüm gelecek nesilleri değiştirir",
                "Doğumdan sonra geri alınamaz",
                "'Tasarım bebeği' endişeleri doğurur",
                "Çoğu ülkede yasaklanmıştır",
                "Henüz hiçbir klinik kullanım haklı değil",
              ],
            },
          },
        ],
      },
      {
        heading: "Kim Erişim Hakkına Sahip?",
        visual: "delivery-diagram",
        content: [
          {
            type: "paragraph",
            text: "FDA tarafından onaylanan ilk CRISPR terapisi olan Casgevy, hasta başına yaklaşık 2,2 milyon dolara mal olmaktadır. Dönüştürücü bir tedavi olmasına rağmen, bu fiyatla yalnızca en zengin sağlık sistemlerinde erişilebilir durumdadır. Bu durum derin bir eşitlik sorunu yaratmaktadır: hastalıkları tedavi edebilen gen düzenlemesi, zenginlerin ayrıcalığı olmamalıdır.",
          },
          {
            type: "fact-grid",
            facts: [
              { label: "Casgevy liste fiyatı (ABD)", value: "2,2 Milyon $", color: "#f06292" },
              { label: "Dünya genelinde orak hücre hastaları", value: "~300.000", color: "#4fc3f7" },
              { label: "Düşük gelirli ülkelerde yaşayan", value: ">%70", color: "#ffb74d" },
              { label: "Bugün erişimi olan ülkeler", value: "~5", color: "#ef9a9a" },
            ],
          },
          {
            type: "highlight",
            text: "WHO'nun İnsan Genomu Düzenleme girişimi, tüm kalıtsal insan genomu düzenleme araştırmalarının küresel bir kaydının tutulmasını ve eşit erişim çerçevelerini talep etmektedir. Teknoloji, onu yönlendirmesi gereken yönetim sistemlerinden daha hızlı ilerliyoruz.",
            color: "#ffb74d",
          },
        ],
      },
      {
        heading: "CRISPR'ın Geleceği",
        visual: "dna-animation",
        content: [
          {
            type: "paragraph",
            text: "CRISPR yerinde durmuyor. DNA kesmesinin ötesinde, yeni nesil araçlar mümkün olanı genişletiyor — tek harfli düzeltmelerden genomu hiç dokunmadan RNA düzenlemeye kadar.",
          },
          {
            type: "steps",
            steps: [
              {
                icon: "🔤",
                title: "Baz Düzenleme",
                body: "Çift zincir kırık oluşturmadan tek bir DNA bazını (A→G veya C→T) dönüştürür. Harvard'dan David Liu tarafından geliştirildi. Tek nokta mutasyonlarını düzeltmek için daha hassastır.",
              },
              {
                icon: "✏️",
                title: "Prime Editing",
                body: "Değiştirilmiş bir Cas9 (nikaz) + pegRNA kullanan 'ara ve değiştir' aracıdır. Donör şablonu gerektirmeden 12 olası nokta mutasyonunun herhangi birini, küçük eklemeleri/silmeleri yazabilir.",
              },
              {
                icon: "🧬",
                title: "Cas13 — RNA Düzenleme",
                body: "DNA yerine RNA'yı hedef alır. Kalıcı genom değişikliği olmadan gen ifadesini bastırabilir veya düzenleyebilir. Antiviral terapiler ve geçici gen modülasyonu için araştırılmaktadır.",
              },
              {
                icon: "🌱",
                title: "Tarım ve Ötesi",
                body: "CRISPR, hastalığa dirençli buğday, kuraklığa dayanıklı mısır ve alerjensiz fıstık geliştirmektedir. Yabancı DNA içermeyen USDA onaylı CRISPR ürünleri özel etiket gerektirmez.",
              },
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        question: "Somatik ve germline CRISPR düzenleme arasındaki temel etik fark nedir?",
        options: [
          "Somatik düzenleme germline düzenlemeden daha pahalıdır",
          "Germline düzenlemeler kalıtsaldır — tüm gelecek nesillere aktarılır",
          "Somatik düzenleme Cas9 kullanırken germline düzenleme Cas12a kullanır",
          "Germline düzenleme farklı bir PAM dizisi gerektirir",
        ],
        correct: 1,
        explanation: "Somatik hücre düzenlemeleri yalnızca tedavi edilen hastayı etkiler ve kalıtılamaz. Germline düzenlemeleri (yumurta, sperm veya embriyolarda) kalıtsal genomu değiştirir — tüm gelecek torunları etkiler. Bu nedenle germline düzenleme çoğu ülkede yasaklanmış veya sıkı biçimde kısıtlanmıştır.",
      },
      {
        question: "İlk onaylı CRISPR terapisi (Casgevy) hasta başına yaklaşık ne kadar maliyetlidir?",
        options: ["50.000 $", "500.000 $", "2,2 milyon $", "10 milyon $"],
        correct: 2,
        explanation: "Casgevy'nin liste fiyatı hasta başına yaklaşık 2,2 milyon dolardır. Bu durum, orak hücre hastalarının büyük çoğunluğunun bu tedaviye erişemeyen düşük gelirli ülkelerde yaşadığı göz önüne alındığında ciddi eşitlik endişeleri doğurmaktadır.",
      },
      {
        question: "'Prime Editing'i standart CRISPR-Cas9'dan farklı kılan nedir?",
        options: [
          "Prime Editing daha uzun bir kılavuz RNA kullanır",
          "Prime Editing yalnızca DNA'yı silebilir, ekleyemez",
          "Prime Editing, çift zincir kırık olmadan hassas düzenlemeler yazmak için Cas9 nikaz + pegRNA kullanır",
          "Prime Editing yalnızca bitki hücrelerinde çalışır",
        ],
        correct: 2,
        explanation: "Prime Editing, bir reverse transcriptase'ye bağlı Cas9 'nikaz' (yalnızca bir zinciri keser) kullanır ve bir pegRNA tarafından yönlendirilir. Çift zincir kırık veya ayrı bir donör şablonu olmadan 12 nokta mutasyonunun herhangi birini, küçük eklemeleri/silmeleri gerçekleştirebilir.",
      },
    ],
  },
];
