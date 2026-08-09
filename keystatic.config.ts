import { collection, config, fields, singleton } from "@keystatic/core";

export default config({
  storage: { kind: "github", repo: "GuzuSoftware/mentasolar.hu" },
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
          slug: { label: "Azonosító" },
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
          slug: { label: "Azonosító" },
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
        roofType: fields.select({
          label: "Tetőtípus",
          description: "Rendszerbővítésnél nem számít.",
          defaultValue: "tile",
          options: [
            { label: "Cseréptető", value: "tile" },
            { label: "Trapézlemez", value: "trapezoid" },
            { label: "Lapostető", value: "flat" },
            { label: "Zsindely", value: "shingle" },
            { label: "Cserepeslemez", value: "metal-tile" },
            { label: "Korcolt bádog", value: "standing-seam" },
            { label: "Talajra telepített", value: "ground" },
            { label: "Minden felülethez használható", value: "any" },
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
        priceText: fields.text({ label: "Irányár", description: "Például: 2 990 000 Ft + ÁFA. Opcionális." }),
        highlights: fields.array(fields.text({ label: "Előny" }), { label: "Kiemelt előnyök" }),
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
        heroText: fields.text({ label: "Nyitó szöveg", multiline: true }),
        phone: fields.text({ label: "Telefonszám" }),
        email: fields.text({ label: "E-mail-cím" }),
        address: fields.text({ label: "Cím" }),
        facebook: fields.url({ label: "Facebook" }),
        instagram: fields.url({ label: "Instagram" }),
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
        seoTitle: fields.text({ label: "Napelem oldal SEO-címe", validation: { isRequired: true } }),
        seoDescription: fields.text({ label: "Napelem oldal meta leírása", multiline: true, validation: { isRequired: true } }),
        primaryKeyword: fields.text({ label: "Elsődleges keresőkifejezés", description: "Szerkesztési segítség; nem meta keywords mező." }),
        extensionSeoTitle: fields.text({ label: "Rendszerbővítés SEO-címe", validation: { isRequired: true } }),
        extensionSeoDescription: fields.text({ label: "Rendszerbővítés meta leírása", multiline: true, validation: { isRequired: true } }),
      },
    }),
  },
  ui: { brand: { name: "MentaSolar tartalomkezelő" } },
});
