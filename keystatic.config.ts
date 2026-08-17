import { collection, config, fields, singleton } from "@keystatic/core";

// A konfiguráció a böngészőben is fut: az Astro/Vite DEV jelzője ott is
// elérhető. Helyben fájlrendszeres, az éles buildben GitHubos tárolást használ.
const storage = import.meta.env.DEV
  ? { kind: "local" as const }
  : { kind: "github" as const, repo: "GuzuSoftware/mentasolar.hu" };

const seoFields = () => ({
  title: fields.text({ label: "SEO-cím" }),
  description: fields.text({
    label: "Meta leírás",
    multiline: true,
  }),
  canonical: fields.text({
    label: "Canonical URL felülírása",
    description: "Opcionális. Üresen hagyva az oldal saját https://mentasolar.hu/... canonical URL-je készül.",
  }),
  ogTitle: fields.text({
    label: "Open Graph cím",
    description: "Opcionális. Üresen hagyva a SEO-cím kerül megosztásra.",
  }),
  ogDescription: fields.text({
    label: "Open Graph leírás",
    multiline: true,
    description: "Opcionális. Üresen hagyva a meta leírás kerül megosztásra.",
  }),
  ogImage: fields.image({
    label: "Open Graph megosztási kép",
    description: "Opcionális. Csak feltöltött kép esetén jelenik meg og:image és twitter:image metaadat.",
    directory: "public/images/seo",
    publicPath: "/images/seo/",
  }),
  robotsIndex: fields.checkbox({
    label: "Indexelhető oldal",
    defaultValue: true,
  }),
  robotsFollow: fields.checkbox({
    label: "Linkek követhetők",
    defaultValue: true,
  }),
});

export default config({
  storage,
  collections: {
    faqs: collection({
      label: "Gyakori kérdések",
      slugField: "question",
      path: "src/data/faqs/*",
      format: "json",
      columns: ["question", "order"],
      schema: {
        question: fields.slug({
          name: { label: "Kérdés", validation: { isRequired: true } },
          slug: {
            label: "Azonosító",
            description: "Új kérdés létrehozásakor adja meg. Mentés után a technikai azonosító nem módosítható.",
          },
        }),
        answer: fields.text({
          label: "Válasz",
          multiline: true,
          validation: { isRequired: true },
        }),
        order: fields.integer({
          label: "Sorrend",
          defaultValue: 1,
          validation: { isRequired: true, min: 1 },
        }),
      },
    }),
    solarOffers: collection({
      label: "Napelemes ajánlatok",
      slugField: "marketingName",
      path: "src/data/solar-offers/*",
      format: "json",
      columns: ["marketingName", "offerType", "published", "order"],
      schema: {
        marketingName: fields.slug({
          name: { label: "Csomag marketingneve", validation: { isRequired: true } },
          slug: {
            label: "Azonosító",
            description: "Új ajánlat létrehozásakor adja meg. Mentés után a technikai azonosító nem módosítható.",
          },
        }),
        published: fields.checkbox({ label: "Megjelenjen az oldalon", defaultValue: false }),
        example: fields.checkbox({ label: "Példa tartalom", description: "Bekapcsolva a látogatók számára is látszik a „Példa” jelölés.", defaultValue: false }),
        offerType: fields.select({
          label: "Ajánlat típusa",
          defaultValue: "new-system",
          options: [
            { label: "Új napelemes rendszer", value: "new-system" },
            { label: "Meglévő rendszer bővítése", value: "system-extension" },
          ],
        }),
        systemType: fields.select({
          label: "Új rendszer típusa",
          description: "Rendszerbővítésnél nem számít.",
          defaultValue: "grid",
          options: [
            { label: "Hálózati rendszer", value: "grid" },
            { label: "Szigetüzemű rendszer", value: "off-grid" },
          ],
        }),
        storageType: fields.select({
          label: "Energiatárolás",
          description: "Új rendszer esetén ez határozza meg a kategóriát.",
          defaultValue: "without-storage",
          options: [
            { label: "Tároló nélkül", value: "without-storage" },
            { label: "Akkumulátorral", value: "with-storage" },
          ],
        }),
        extensionType: fields.select({
          label: "Bővítési kategória",
          description: "Új rendszernél nem számít.",
          defaultValue: "inverter-storage",
          options: [
            { label: "Invertercsere és energiatároló", value: "inverter-storage" },
            { label: "Energiatárolás, áramszüneti ellátással", value: "full-backup" },
          ],
        }),
        image: fields.image({
          label: "Csomag képe",
          description: "Ajánlott: 1600 × 700 px (16:7), fekvő kép. Ez az arány tölti ki pontosan az ajánlatkártya teljes szélességű képrészét.",
          directory: "public/images/solar-offers",
          publicPath: "/images/solar-offers/",
          validation: { isRequired: true },
        }),
        summary: fields.text({ label: "Rövid leírás", multiline: true, validation: { isRequired: true } }),
        inverterBrand: fields.text({ label: "Inverter márkája", validation: { isRequired: true } }),
        batteryBrand: fields.text({ label: "Akkumulátor márkája", description: "Tároló nélküli ajánlatnál hagyja üresen." }),
        panelBrand: fields.text({ label: "Napelem panel márkája", validation: { isRequired: true } }),
        systemPower: fields.text({ label: "Rendszer névleges teljesítménye", validation: { isRequired: true } }),
        batteryCapacity: fields.text({ label: "Energiatároló névleges kapacitása" }),
        priceText: fields.text({ label: "Csomagár", description: "Bruttó árat adjon meg, például: 2 990 000 Ft. Opcionális." }),
        highlights: fields.array(fields.text({ label: "Előny" }), { label: "Kiemelt előnyök" }),
        order: fields.integer({ label: "Sorrend", defaultValue: 1, validation: { isRequired: true, min: 1 } }),
      },
    }),
    climateOffers: collection({
      label: "Klíma ajánlatok",
      slugField: "marketingName",
      path: "src/data/climate-offers/*",
      format: "json",
      columns: ["marketingName", "brand", "published", "order"],
      schema: {
        marketingName: fields.slug({
          name: { label: "Csomag marketingneve", validation: { isRequired: true } },
          slug: {
            label: "Azonosító",
            description: "Új ajánlat létrehozásakor adja meg. Mentés után a technikai azonosító nem módosítható.",
          },
        }),
        published: fields.checkbox({ label: "Megjelenjen az oldalon", defaultValue: false }),
        image: fields.image({
          label: "Csomag képe",
          description: "Ajánlott: 1600 × 1000 px, fekvő kép. A kártyán és a részletező modalban is ez a kép jelenik meg; a termék teljes egészében, körben elegendő üres térrel legyen látható.",
          directory: "public/images/climate-offers",
          publicPath: "/images/climate-offers/",
          validation: { isRequired: true },
        }),
        summary: fields.text({ label: "Rövid leírás", multiline: true, validation: { isRequired: true } }),
        brand: fields.text({ label: "Márkanév", validation: { isRequired: true } }),
        power: fields.text({ label: "Teljesítmény", description: "A kártya felsorolásában jelenik meg.", validation: { isRequired: true } }),
        priceText: fields.text({ label: "Csomagár", description: "Bruttó árat adjon meg, például: 396 000 Ft. Opcionális; kitöltve narancssárga kiemeléssel jelenik meg a kártyán." }),
        highlights: fields.array(fields.text({ label: "Tulajdonság" }), { label: "További, kártyán megjelenő tulajdonságok" }),
        warranty: fields.text({ label: "Garancia", validation: { isRequired: true } }),
        coolingEnergyClass: fields.text({ label: "Hűtési energiaosztály", validation: { isRequired: true } }),
        heatingEnergyClass: fields.text({ label: "Fűtési energiaosztály", validation: { isRequired: true } }),
        seer: fields.text({ label: "SEER", validation: { isRequired: true } }),
        scop: fields.text({ label: "SCOP", validation: { isRequired: true } }),
        order: fields.integer({ label: "Sorrend", defaultValue: 1, validation: { isRequired: true, min: 1 } }),
      },
    }),
    chargerOffers: collection({
      label: "Autótöltő ajánlatok",
      slugField: "marketingName",
      path: "src/data/charger-offers/*",
      format: "json",
      columns: ["marketingName", "brand", "published", "order"],
      schema: {
        marketingName: fields.slug({
          name: { label: "Csomag marketingneve", validation: { isRequired: true } },
          slug: {
            label: "Azonosító",
            description: "Új ajánlat létrehozásakor adja meg. Mentés után a technikai azonosító nem módosítható.",
          },
        }),
        published: fields.checkbox({ label: "Megjelenjen az oldalon", defaultValue: false }),
        image: fields.image({ label: "Csomag képe", description: "Ajánlott: 1600 × 1000 px, fekvő kép. A termék teljes egészében, körben elegendő üres térrel legyen látható.", directory: "public/images/charger-offers", publicPath: "/images/charger-offers/", validation: { isRequired: true } }),
        summary: fields.text({ label: "Rövid leírás", multiline: true, validation: { isRequired: true } }),
        brand: fields.text({ label: "Márkanév", validation: { isRequired: true } }),
        priceText: fields.text({ label: "Csomagár", description: "Például: 175 900 Ft + ÁFA. Opcionális." }),
        highlights: fields.array(fields.text({ label: "Tulajdonság" }), { label: "Kártyán megjelenő további tulajdonságok" }),
        technicalDetails: fields.array(fields.text({ label: "Műszaki adat" }), { label: "Műszaki adatok a részletező modalhoz", description: "Szabadon megadható címkék, például: 22 kW, 2 év garancia, háromfázisú kivitel." }),
        features: fields.object({
          type2: fields.checkbox({ label: "Type 2" }), type1: fields.checkbox({ label: "Type 1" }), ip54: fields.checkbox({ label: "IP54" }), ip65: fields.checkbox({ label: "IP65" }), wifi: fields.checkbox({ label: "WiFi" }), cable5m: fields.checkbox({ label: "5 m kábel" }), cable6m: fields.checkbox({ label: "6 m kábel" }), bluetooth: fields.checkbox({ label: "Bluetooth" }), smart: fields.checkbox({ label: "Smart" }), rfid: fields.checkbox({ label: "RFID" }),
        }, { label: "Gyakori jellemzők", description: "Jelölje be az ajánlatra jellemző elemeket. Ezek kis ikonként is megjelennek a kártyán." }),
        order: fields.integer({ label: "Sorrend", defaultValue: 1, validation: { isRequired: true, min: 1 } }),
      },
    }),
  },
  singletons: {
    site: singleton({
      label: "Alapadatok és főoldal",
      path: "src/content/site",
      format: "json",
      schema: {
        heroEyebrow: fields.text({ label: "Nyitó címke" }),
        heroTitle: fields.text({ label: "Nyitó főcím" }),
        heroSubtitle: fields.text({ label: "Nyitó helyi szolgáltatási sor" }),
        heroText: fields.text({ label: "Nyitó szöveg", multiline: true }),
        homeLocalIntro: fields.text({ label: "Főoldali helyi bevezető", multiline: true }),
        faqHeading: fields.text({ label: "GYIK főcím" }),
        contactHeading: fields.text({ label: "Kapcsolat főcím" }),
        contactIntro: fields.text({ label: "Kapcsolat bevezető", multiline: true }),
        phone: fields.text({ label: "Telefonszám" }),
        email: fields.text({ label: "E-mail-cím" }),
        address: fields.text({ label: "Cím" }),
        facebook: fields.url({ label: "Facebook" }),
        instagram: fields.url({ label: "Instagram" }),
        seo: fields.object(seoFields(), { label: "Főoldal SEO" }),
        faqSeo: fields.object(seoFields(), { label: "GYIK SEO" }),
        contactSeo: fields.object(seoFields(), { label: "Kapcsolat SEO" }),
      },
    }),
    solar: singleton({
      label: "Napelem oldal és SEO",
      path: "src/content/solar",
      format: "json",
      schema: {
        defaultSystemType: fields.select({
          label: "Új rendszer alapértelmezett típusa",
          defaultValue: "grid",
          options: [
            { label: "Hálózati rendszer", value: "grid" },
            { label: "Szigetüzemű rendszer", value: "off-grid" },
          ],
        }),
        defaultStorageType: fields.select({
          label: "Alapértelmezett energiatárolás",
          defaultValue: "without-storage",
          options: [
            { label: "Tároló nélkül", value: "without-storage" },
            { label: "Akkumulátorral", value: "with-storage" },
          ],
        }),
        hubTitle: fields.text({ label: "Napelem oldal főcíme" }),
        hubHeroSubtitle: fields.text({ label: "Napelem oldal helyi szolgáltatási sora" }),
        offerIntro: fields.text({ label: "Napelemes ajánlatok rövid bevezetője", multiline: true }),
        hubInfoTitle: fields.text({ label: "Napelem oldal információs blokkjának címe" }),
        hubIntro: fields.array(fields.text({ label: "Bekezdés", multiline: true }), { label: "Napelem oldal bevezetője" }),
        newSystemTitle: fields.text({ label: "Új rendszer oldal főcíme" }),
        newSystemHeroSubtitle: fields.text({ label: "Új rendszer oldal helyi szolgáltatási sora" }),
        newSystemInfoTitle: fields.text({ label: "Új rendszer információs blokkjának címe" }),
        newSystemIntro: fields.array(fields.text({ label: "Bekezdés", multiline: true }), { label: "Új rendszer oldal bevezetője" }),
        extensionTitle: fields.text({ label: "Rendszerbővítés oldal főcíme" }),
        extensionHeroSubtitle: fields.text({ label: "Rendszerbővítés oldal helyi szolgáltatási sora" }),
        extensionInfoTitle: fields.text({ label: "Rendszerbővítés információs blokkjának címe" }),
        extensionIntro: fields.array(fields.text({ label: "Bekezdés", multiline: true }), { label: "Rendszerbővítés oldal bevezetője" }),
        seo: fields.object(seoFields(), { label: "Napelem oldal SEO" }),
        primaryKeyword: fields.text({ label: "Napelem oldal elsődleges keresőkifejezése", description: "Szerkesztési segítség; nem meta keywords mező." }),
        secondaryKeywords: fields.array(fields.text({ label: "Keresőkifejezés" }), { label: "Napelem oldal további keresőkifejezései", description: "Szerkesztési segítség; nem meta keywords mező." }),
        newSystemSeo: fields.object(seoFields(), { label: "Új napelemes rendszer SEO" }),
        newSystemPrimaryKeyword: fields.text({ label: "Új rendszer elsődleges keresőkifejezése", description: "Szerkesztési segítség; nem meta keywords mező." }),
        newSystemSecondaryKeywords: fields.array(fields.text({ label: "Keresőkifejezés" }), { label: "Új rendszer további keresőkifejezései", description: "Szerkesztési segítség; nem meta keywords mező." }),
        extensionSeo: fields.object(seoFields(), { label: "Rendszerbővítés SEO" }),
        extensionPrimaryKeyword: fields.text({ label: "Rendszerbővítés elsődleges keresőkifejezése", description: "Szerkesztési segítség; nem meta keywords mező." }),
        extensionSecondaryKeywords: fields.array(fields.text({ label: "Keresőkifejezés" }), { label: "Rendszerbővítés további keresőkifejezései", description: "Szerkesztési segítség; nem meta keywords mező." }),
      },
    }),
    climate: singleton({
      label: "Klíma oldal és SEO",
      path: "src/content/climate",
      format: "json",
      schema: {
        pageTitle: fields.text({ label: "Klíma oldal főcíme" }),
        heroSubtitle: fields.text({ label: "Klíma oldal helyi szolgáltatási sora" }),
        offerIntro: fields.text({ label: "Klíma ajánlatok rövid bevezetője", multiline: true }),
        infoTitle: fields.text({ label: "Klíma információs blokkjának címe" }),
        intro: fields.array(fields.text({ label: "Bekezdés", multiline: true }), { label: "Klíma oldal bevezetője" }),
        seo: fields.object(seoFields(), { label: "Klíma oldal SEO" }),
        primaryKeyword: fields.text({ label: "Elsődleges keresőkifejezés", description: "Például: klíma szereléssel. Szerkesztési segítség; nem meta keywords mező." }),
        secondaryKeywords: fields.array(fields.text({ label: "Keresőkifejezés" }), { label: "További keresőkifejezések", description: "Például: klíma telepítés, Midea klíma vagy Fisher klíma." }),
      },
    }),
    charger: singleton({
      label: "Autótöltő oldal és SEO",
      path: "src/content/charger",
      format: "json",
      schema: {
        pageTitle: fields.text({ label: "Autótöltő oldal főcíme" }),
        heroSubtitle: fields.text({ label: "Autótöltő oldal helyi szolgáltatási sora" }),
        offerIntro: fields.text({ label: "Autótöltő ajánlatok rövid bevezetője", multiline: true }),
        infoTitle: fields.text({ label: "Autótöltő információs blokkjának címe" }),
        intro: fields.array(fields.text({ label: "Bekezdés", multiline: true }), { label: "Autótöltő oldal bevezetője" }),
        seo: fields.object(seoFields(), { label: "Autótöltő oldal SEO" }),
        primaryKeyword: fields.text({ label: "Elsődleges keresőkifejezés", description: "Például: autótöltő telepítés. Szerkesztési segítség; nem meta keywords mező." }),
        secondaryKeywords: fields.array(fields.text({ label: "Keresőkifejezés" }), { label: "További keresőkifejezések", description: "Például: fali autótöltő, Type 2 töltő, Wallbox telepítés." }),
      },
    }),
  },
  ui: { brand: { name: "MentaSolar tartalomkezelő" } },
});
