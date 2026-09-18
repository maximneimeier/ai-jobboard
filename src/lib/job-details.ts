type JobDetails = {
  description: string;
  responsibilities: string[];
  requirements: string[];
};

export const JOB_DETAILS: Record<string, JobDetails> = {
  "linear-spd": {
    description:
      "Linear baut Issue Tracking, das sich wie ein Produkt anfühlt, nicht wie ein Ticket-System. Als Senior Product Designer in Berlin gestaltest du Kernflows, das Design-System und die Details, die Power-User merken.\n\nDu arbeitest in einem kleinen, produktgeführten Team mit hoher Ownership. Wenig Abstimmungstheater, direkte Zusammenarbeit mit Engineering, sichtbare Wirkung in der Fläche.",
    responsibilities: [
      "End-to-end Flows für Issues, Views und Collaboration gestalten",
      "Design-System und Komponenten mit Engineering pflegen",
      "Research mit intensiven Nutzerinnen und Nutzern führen",
      "Qualität bis in die Umsetzung begleiten, nicht nur übergeben",
    ],
    requirements: [
      "Mehrjährige Erfahrung als Product Designer, ideal im B2B-SaaS",
      "Stark in Figma, Systems und Research",
      "Portfolio mit shipped Product Work",
      "Hybrid in Berlin, etwa zwei Tage im Office",
    ],
  },
  "pitch-lead": {
    description:
      "Pitch ist ein design-led Präsentationsprodukt mit Sitz in Berlin. Als Lead Product Designer verantwortest du ein Team, die Marke im Produkt und die nächsten großen Oberflächen.\n\nDu setzt Richtung, coachst Designerinnen und Designer und bleibst nah am Making. Die Rolle verbindet Craft, Brand und Product Leadership.",
    responsibilities: [
      "Design-Team führen und Craft-Qualität heben",
      "Produkt- und Markensprache in den Kernflächen halten",
      "Roadmap mit Product und Gründung priorisieren",
      "Komplexe Flows selbst gestalten, nicht nur reviewen",
    ],
    requirements: [
      "Führungserfahrung in Product Design",
      "Sicher in Figma, Brand und Product Thinking",
      "Erfahrung mit wachsenden Design-Teams",
      "Hybrid in Berlin",
    ],
  },
  "personio-pd": {
    description:
      "Personio skaliert HR-Software für den europäischen Mittelstand. Als Product Designer arbeitest du in einem großen Design-Org mit klaren Prozessen, Research-Support und Scale-up-Tempo.\n\nDie Rolle ist remote aus Deutschland möglich. Du übernimmst eine Produktfläche, testest regelmäßig und lieferst in kurzen Zyklen.",
    responsibilities: [
      "Flows für HR-Admin und Mitarbeitende gestalten",
      "Usability-Tests planen und Erkenntnisse umsetzen",
      "Mit PM und Engineering in Squads liefern",
      "Bestehende Patterns im Design-System nutzen und erweitern",
    ],
    requirements: [
      "Erfahrung als Product Designer, ideal B2B oder HR-Tech",
      "Sicher in Figma und Research",
      "Comfort mit größeren Organisationen",
      "Remote in Deutschland",
    ],
  },
  "raycast-pd": {
    description:
      "Raycast ist ein Launcher für den Desktop, gebaut von einem sehr kleinen Remote-Team. Als Product Designer gestaltest du Extensions, Core-UX und die System-Nähe zu macOS.\n\nVier-Tage-Woche ist möglich. Du brauchst Urteilskraft, weil es wenig Prozess und viel Fläche gibt.",
    responsibilities: [
      "Core-UX und Extension-Oberflächen gestalten",
      "macOS-Patterns ernst nehmen und weiterdenken",
      "Eng mit Engineering an Performance und Details arbeiten",
      "Leichte Research-Runden mit Power-Usern fahren",
    ],
    requirements: [
      "Senior-Niveau in Product Design",
      "Erfahrung mit Desktop- oder Productivity-Tools",
      "Figma und Systems, ideal macOS-Nähe",
      "Remote-first, 4-Tage-Woche möglich",
    ],
  },
  "polar-staff": {
    description:
      "Polar baut Payments und Monetization für Open-Source-Teams. Als Staff Engineer gestaltest du die Go-Plattform, Kubernetes-Setups und Postgres-Modelle, die Last und Klarheit aushalten.\n\nRemote in DACH, ohne Bereitschaft, mit optionaler 4-Tage-Woche. Hohe Autonomie, wenig Konzern.",
    responsibilities: [
      "Kritische Backend-Pfade in Go entwerfen und bauen",
      "Betrieb auf Kubernetes vereinfachen",
      "Datenmodell und Consistenz in Postgres halten",
      "Andere Engineers über Reviews und Architektur führen",
    ],
    requirements: [
      "Staff-Niveau in Backend oder Platform",
      "Tiefe in Go, Kubernetes und Postgres",
      "Erfahrung mit Zahlungs- oder Billing-Systemen von Vorteil",
      "Remote in DACH, keine Bereitschaft",
    ],
  },
  "langfuse-be": {
    description:
      "Langfuse ist Observability für LLM-Apps. Als Backend Engineer in Berlin baust du Tracing, Auswertung und APIs in TypeScript, Node und Postgres.\n\nHybrid, zwei Tage die Woche im Office. Kleines Startup, direkte Nähe zu Nutzerinnen und Nutzern, die selbst entwickeln.",
    responsibilities: [
      "APIs und Ingest-Pipelines für Traces bauen",
      "Postgres-Schemas und Query-Pfade halten",
      "Performance unter wachsendem Event-Volumen sichern",
      "Mit Product an Developer-Experience der API arbeiten",
    ],
    requirements: [
      "Erfahrung in Backend mit TypeScript und Node",
      "Sicher mit Postgres",
      "Interesse an LLM-Tooling",
      "Hybrid in Berlin",
    ],
  },
  "n26-be": {
    description:
      "N26 betreibt eine Banking-Plattform für Millionen Kundinnen und Kunden. Als Backend Engineer arbeitest du an Kotlin- und Java-Services, Kafka-Streams und den Pfaden, die Geld bewegen.\n\nHybrid in Berlin. Rotierende Bereitschaft etwa alle sechs Wochen gehört dazu.",
    responsibilities: [
      "Services für Konto, Payments oder Ledger weiterbauen",
      "Event-Flows mit Kafka robust machen",
      "Incidents in der Bereitschaft mittragen",
      "Quality und Observability in einem großen Engineering-Org halten",
    ],
    requirements: [
      "Senior-Erfahrung in JVM-Backends",
      "Kotlin oder Java, plus Kafka",
      "Comfort mit reguliertem Umfeld",
      "Bereitschaft, On-Call mitzutragen",
    ],
  },
  "tr-fe": {
    description:
      "Trade Republic baut Brokerage für den Massenmarkt. Als Senior Frontend Engineer gestaltest du Web und App in React, TypeScript und React Native, mit hoher Geschwindigkeit und sichtbarer Consumer-Qualität.\n\nHybrid in Berlin, starkes Mobile-Team, kurze Wege zu Product.",
    responsibilities: [
      "Trading- und Onboarding-Flows in Web und App bauen",
      "Shared Components zwischen React und React Native halten",
      "Performance und Zugänglichkeit in der Fläche sichern",
      "Mit Design an Micro-Interactions und Klarheit arbeiten",
    ],
    requirements: [
      "Senior-Niveau in React und TypeScript",
      "Erfahrung mit React Native oder starkem Mobile-Web",
      "Sinn für Consumer-UX",
      "Hybrid in Berlin",
    ],
  },
  "celonis-data": {
    description:
      "Celonis macht Process Mining für Enterprise-Kunden. Als Data Scientist in München entwickelst du Modelle, SQL- und Spark-Pipelines und Übersetzungen von Prozessdaten in Entscheidungen.\n\nHybrid, klare Karrierepfade, München oder Remote in Deutschland.",
    responsibilities: [
      "Modelle und Analysen auf Prozessdaten entwickeln",
      "Pipelines in Python, SQL und Spark bauen",
      "Mit Customer-Teams Use Cases schärfen",
      "Ergebnisse so erklären, dass Fachbereiche sie nutzen",
    ],
    requirements: [
      "Senior-Erfahrung in Data Science oder Analytics",
      "Python, SQL und Spark",
      "Erfahrung mit Enterprise-Stakeholdern von Vorteil",
      "Hybrid in München",
    ],
  },
  "gyg-pm": {
    description:
      "GetYourGuide ist ein Marktplatz für Aktivitäten und Tours. Als Senior Product Manager in Berlin verantwortest du eine Fläche zwischen Discovery, Buchung und Partnern.\n\nStarkes PM-Handwerk, Hybrid in Berlin, enge Arbeit mit Design, Data und Engineering.",
    responsibilities: [
      "Roadmap für eine Marktplatz-Fläche besitzen",
      "Entscheidungen mit Analytics und SQL unterlegen",
      "Discovery mit Design und Research fahren",
      "Lieferung über Squads steuern und nach Launch messen",
    ],
    requirements: [
      "Mehrjährige PM-Erfahrung, ideal Marketplace oder Travel",
      "Sicher mit Analytics, SQL und Figma-Nähe",
      "Klar in Stakeholder-Kommunikation",
      "Hybrid in Berlin",
    ],
  },
  "contentful-pm": {
    description:
      "Contentful ist ein Headless-CMS für Unternehmen, die Content über APIs ausspielen. Als Product Manager arbeitest du remote in Deutschland an einer B2B-Fläche, nah an Engineering und Kunden.\n\nDu schärfst Probleme, schneidest Releases und hältst die API-Story konsistent.",
    responsibilities: [
      "Eine Produktfläche von Discovery bis Launch führen",
      "API- und Integrationsanforderungen mit Engineering klären",
      "Kundenfeedback in eine priorisierte Roadmap übersetzen",
      "Erfolg über Usage und Retention messen",
    ],
    requirements: [
      "PM-Erfahrung in B2B-SaaS oder Developer-Tools",
      "Verständnis für APIs und Analytics",
      "Sicher remote mit verteilten Teams",
      "Remote in Deutschland",
    ],
  },
  "adjust-mkt": {
    description:
      "Adjust misst Mobile Attribution für Apps und Werbung. Als Product Marketing Manager in Berlin formulierst du Positionierung, Launch-Erzählungen und die Sprache, mit der Sales arbeitet.\n\nHybrid in Berlin, B2B-Messaging, enge Nähe zu Product und GTM.",
    responsibilities: [
      "Positionierung und Narrative für Launches schreiben",
      "Sales mit Messaging, Decks und Enablement ausstatten",
      "Wettbewerbsbild und Kategorien scharf halten",
      "Mit Product an Packaging und Naming arbeiten",
    ],
    requirements: [
      "Erfahrung in Product Marketing, ideal B2B oder Mobile",
      "Stark in Positionierung und Schreibe",
      "Comfort mit Sales-Nähe",
      "Hybrid in Berlin",
    ],
  },
  "zalando-ae": {
    description:
      "Zalando Partner Solutions verkauft Plattform und Advertising an Marken. Als Account Executive arbeitest du vor Ort in Berlin in einem großen Sales-Org mit klaren Quoten und Playbooks.\n\nDie Rolle ist onsite, mit festem Territorium und sichtbaren Zahlen.",
    responsibilities: [
      "Pipeline über Outbound und Inbound aufbauen",
      "SaaS-Deals von Discovery bis Abschluss führen",
      "Forecasts und CRM sauber halten",
      "Mit Customer Success die ersten 90 Tage absichern",
    ],
    requirements: [
      "Erfahrung im B2B- oder SaaS-Vertrieb",
      "Sicher mit Outbound und Quota",
      "Comfort in einem großen Sales-Org",
      "Vor Ort in Berlin",
    ],
  },
  "sap-se": {
    description:
      "SAP entwickelt Enterprise-Software in großem Maßstab. Als Senior Software Engineer in München arbeitest du hybrid an Cloud-Services, Java und dort, wo ABAP noch die Brücke zur bestehenden Landschaft ist.\n\nKlare Benefits, Kernzeiten, Konzernstrukturen. Bereitschaft ist Teil mancher Teams.",
    responsibilities: [
      "Services in Java und Cloud weiterbauen",
      "Integrationen in bestehende SAP-Landschaften halten",
      "Codequalität, Tests und Reviews in einem großen Org leben",
      "Bei Bedarf On-Call im eigenen Produktbereich mittragen",
    ],
    requirements: [
      "Senior-Erfahrung in Java oder Enterprise-Backends",
      "Cloud-Kenntnisse, ABAP von Vorteil",
      "Comfort mit Konzernprozessen",
      "Hybrid in München, On-Call möglich",
    ],
  },
  "siemens-de": {
    description:
      "Siemens verbindet Industrie und Cloud. Als Data Engineer in München baust du Pipelines in Python, Spark und Azure, die Maschinen-, Qualitäts- und Betriebsdaten nutzbar machen.\n\nFormelle Prozesse, Hybrid, starke Domain neben der Technik.",
    responsibilities: [
      "Datenpipelines von Shopfloor bis Cloud bauen",
      "Spark-Jobs und Azure-Infrastruktur betreiben",
      "Datenqualität und Verträge mit Fachbereichen klären",
      "Dokumentation und Übergabe in einem Konzernumfeld halten",
    ],
    requirements: [
      "Erfahrung als Data Engineer",
      "Python, Spark und Azure",
      "Interesse an industriellen Daten",
      "Hybrid in München",
    ],
  },
  "delivery-fe": {
    description:
      "Delivery Hero betreibt Bestellplattformen in vielen Märkten. Als Frontend Engineer in Berlin baust du React- und TypeScript-Flächen im Platform-Team, oft unter Last und mit kurzen Zyklen.\n\nHybrid, hohes Tempo, On-Call im Platform-Team.",
    responsibilities: [
      "Storefront- und Partner-Oberflächen in React bauen",
      "Shared UI und Performance über Märkte halten",
      "Incidents im On-Call mittragen",
      "Mit Backend an API-Verträgen und Rollouts arbeiten",
    ],
    requirements: [
      "Erfahrung in React und TypeScript",
      "Comfort mit Tempo und unvollständigen Specs",
      "Bereitschaft zu On-Call",
      "Hybrid in Berlin",
    ],
  },
  "hellofresh-ds": {
    description:
      "HelloFresh steuert Wachstum und Supply Chain über Daten. Als Senior Data Analyst in Berlin arbeitest du mit SQL, dbt und Looker an Fragen, die Produktion, Nachfrage und Marketing verbinden.\n\nHybrid, drei Tage Office, enge Arbeit mit Ops und Finance.",
    responsibilities: [
      "Kennzahlen und Modelle für Supply Chain und Growth bauen",
      "dbt-Modelle und Looker-Explores pflegen",
      "Deep Dives für Leadership aufbereiten",
      "Datenlücken mit Stakeholdern schließen",
    ],
    requirements: [
      "Senior-Erfahrung in Analytics",
      "SQL, dbt und Looker oder vergleichbares BI",
      "Sinn für operative Zusammenhänge",
      "Hybrid in Berlin, drei Tage Office",
    ],
  },
  "coba-pm": {
    description:
      "Die Commerzbank digitalisiert Kernprozesse im Banking. Als IT Project Manager in Frankfurt steuerst du Vorhaben zwischen Fachbereich, interner IT und Dienstleistern, oft in klassischen Phasenmodellen.\n\nPräsenzkultur, klare Hierarchien, vor Ort in Frankfurt.",
    responsibilities: [
      "IT-Vorhaben planen, steuern und berichten",
      "Anforderungen zwischen Banking und IT übersetzen",
      "Risiken, Budget und Zeitlinien halten",
      "Lenkungskreise vorbereiten und Entscheidungen einsammeln",
    ],
    requirements: [
      "Erfahrung in IT-Projektleitung, ideal Banking",
      "Sicher mit Waterfall und Stakeholder-Gremien",
      "Comfort mit Präsenz und Konzernsteuerung",
      "Vor Ort in Frankfurt",
    ],
  },
  "sumup-ios": {
    description:
      "SumUp baut Zahlungsprodukte für kleine Händlerinnen und Händler. Als iOS Engineer in Berlin arbeitest du an der App in Swift, an Terminal-Nähe und an Flows, die in stressigen Momenten einfach bleiben.\n\nHybrid, starkes Mobile-Handwerk, Scale-up ohne Konzernsetup.",
    responsibilities: [
      "iOS-App in Swift weiterbauen",
      "Zahlungs- und Onboarding-Flows robust machen",
      "Mit Design an Klarheit und Fehlerzuständen arbeiten",
      "Releases, Qualität und Store-Reviews mittragen",
    ],
    requirements: [
      "Senior-Erfahrung in iOS und Swift",
      "Sinn für Consumer- oder Merchant-Apps",
      "Comfort mit Hardware-Nähe von Vorteil",
      "Hybrid in Berlin",
    ],
  },
  "typeform-growth": {
    description:
      "Typeform macht Formulare, die sich wie ein Gespräch anfühlen. Als Growth Lead steuerst du remote in Europa Akquise, Aktivierung und Experimente, mit Ownership über Kanal und Messung.\n\nKleines Team, 4-Tage-Woche möglich, viel Fläche für eigene Wetten.",
    responsibilities: [
      "Growth-Roadmap für Acquisition und Activation besitzen",
      "Experimente mit Analytics und SEO aufsetzen",
      "Content, Performance und Produkt-Hooks verbinden",
      "Ein kleines Squad ohne viel Prozess führen",
    ],
    requirements: [
      "Lead-Erfahrung in Growth oder Performance",
      "Sicher mit Analytics, SEO und Experimentdesign",
      "Autonomie in einem kleinen Remote-Team",
      "Remote in Europa, 4-Tage-Woche möglich",
    ],
  },
  "figma-pd": {
    description:
      "Figma baut das Design-Tool, in dem viele dieser Stellen überhaupt entstehen. Als Product Designer im Berlin Hub gestaltest du Surfaces für Collaboration, Systems oder Core-Editor, auf hohem Niveau und mit sehr kritischem internem Publikum.\n\nHybrid, Scale-up, Design als Kernprodukt.",
    responsibilities: [
      "Eine Produktfläche im Editor oder in Collaboration gestalten",
      "Systems und Patterns so bauen, dass andere darauf aufsetzen",
      "Research mit Designerinnen und Designern als Nutzergruppe führen",
      "Eng mit Engineering an Präzision und Performance arbeiten",
    ],
    requirements: [
      "Senior Product Design, ideal Tools oder Creative Software",
      "Exzellent in Figma, Systems und Research",
      "Portfolio, das Urteilskraft zeigt, nicht nur Polishes",
      "Hybrid in Berlin",
    ],
  },
  "vercel-dx": {
    description:
      "Vercel baut das Deployment- und Next.js-Ökosystem. Als Developer Experience Engineer arbeitest du remote an Docs, Templates, CLI-Pfaden und den Stellen, an denen Framework und Plattform aufeinanderstoßen.\n\nKein Konzernsetup, weltweites Remote, hohes Niveau im TypeScript- und React-Stack.",
    responsibilities: [
      "DX-Pfade in Next.js, CLI und Dashboard verbessern",
      "Beispiele, Templates und Docs an echte Workflows koppeln",
      "Mit Framework- und Product-Teams an Reibungspunkten arbeiten",
      "Feedback aus der Community in konkrete Fixes übersetzen",
    ],
    requirements: [
      "Senior-Erfahrung in TypeScript, React und Next.js",
      "Spaß an Developer-Tools und klarer Erklärung",
      "Comfort mit öffentlicher Arbeit und Async Remote",
      "Remote weltweit",
    ],
  },
  "ottonova-be": {
    description:
      "Ottonova ist eine digitale Krankenversicherung. Als Go Engineer baust du remote in DACH Backends in Go, gRPC und Postgres für Anträge, Tarife und Leistungsfälle.\n\nKleines Startup, regulierte Domain, keine Konzernschichten um das Engineering herum.",
    responsibilities: [
      "Services in Go und gRPC für Kernprozesse bauen",
      "Daten und Konsistenz in Postgres halten",
      "Regulatorische Anforderungen in einfache Modelle übersetzen",
      "Mit Product an fachlich korrekten Flows arbeiten",
    ],
    requirements: [
      "Senior-Erfahrung in Go",
      "gRPC und Postgres",
      "Interesse an Insurtech oder regulierten Produkten",
      "Remote in DACH",
    ],
  },
  "staffbase-sales": {
    description:
      "Staffbase baut Employee-Communication für Unternehmen. Als Account Executive DACH gewinnst du Enterprise-Deals hybrid aus Chemnitz, mit Fokus auf interne Kommunikation, IT und HR als Käufer.\n\nB2B-SaaS, längere Zyklen, echtes Discovery vor dem Pitch.",
    responsibilities: [
      "Enterprise-Pipeline in DACH aufbauen",
      "Mehrere Stakeholder durch Evaluation und Abschluss führen",
      "Demos und Business Cases mit Solutions abstimmen",
      "Forecast und Übergabe an Customer Success sauber halten",
    ],
    requirements: [
      "Erfahrung im B2B- oder Enterprise-Vertrieb",
      "Sicher mit längeren Cycles und mehreren Entscheidern",
      "DACH-Markt und Deutsch als Arbeitssprache",
      "Hybrid in Chemnitz",
    ],
  },
  "linear-pe": {
    description:
      "Linear sucht eine Product Engineer in Berlin, die Design und Code in einem Schritt denkt. Du baust Kernflächen in TypeScript und React, hältst Postgres sauber und shippst in einem Tempo, das Designer merken.\n\nKleines Team, keine Bereitschaft, 4-Tage-Woche möglich. Du sitzt neben Design, nicht hinter einem Ticket-Board.",
    responsibilities: [
      "Product-Flächen in TypeScript und React bauen",
      "Daten und APIs in Postgres mitverantworten",
      "Mit Design an Interaktion und Performance feilen",
      "Reviews und Qualität ohne schweres Prozesshaus halten",
    ],
    requirements: [
      "Senior-Niveau in TypeScript und React",
      "Spaß an Product Engineering, nicht nur Ticket-Abarbeiten",
      "Postgres-Erfahrung",
      "Hybrid in Berlin, 4-Tage-Woche möglich",
    ],
  },
  "langfuse-pd": {
    description:
      "Langfuse sucht den ersten Product Designer. Du setzt die visuelle Sprache für LLM-Observability, von Trace-Views bis zu leeren Zuständen, die Entwicklerinnen und Entwickler verstehen.\n\nDrei Leute im Design-Umkreis, du selbst. Hybrid in Berlin, direkte Nähe zu Foundern und Backend.",
    responsibilities: [
      "Produkt- und Markensprache von null aufziehen",
      "Komplexe Trace- und Eval-UIs verständlich machen",
      "Research mit Engineers als Nutzergruppe führen",
      "Figma-System so schlank halten, dass es das Team trägt",
    ],
    requirements: [
      "Senior Product Design, ideal Developer Tools",
      "Sicher, ohne großes Design-Org zu arbeiten",
      "Figma, Research und Product Thinking",
      "Hybrid in Berlin",
    ],
  },
  "figma-de": {
    description:
      "Als Design Engineer bei Figma in Berlin arbeitest du an der Naht zwischen Editor, Rendering und UI. Multiplayer, Pixel-Genauigkeit und Performance sind der Job, nicht ein Extra.\n\nDu schreibst TypeScript und React, denkst aber wie jemand, der selbst designet. Hybrid im Berlin Hub.",
    responsibilities: [
      "Editor-nahe Oberflächen in TypeScript und React bauen",
      "Design-System und Code-Qualität in der Fläche halten",
      "Mit Product Design an schwierigen Interaktionen arbeiten",
      "Performance und Multiplayer-Kantenfälle ernst nehmen",
    ],
    requirements: [
      "Senior-Erfahrung in TypeScript und React",
      "Nähe zu Design, ideal eigenes Craft",
      "Comfort mit komplexen UIs und Details",
      "Hybrid in Berlin",
    ],
  },
  "raycast-macos": {
    description:
      "Raycast lebt in der Menüleiste. Als macOS Engineer baust du Core und Extensions in Swift, mit TypeScript dort, wo die Extension API anfasst.\n\nSehr kleines Remote-Team, 4-Tage-Woche, keine Bereitschaft. Du brauchst Urteil, weil Specs kurz sind.",
    responsibilities: [
      "Core- und Extension-Pfade in Swift bauen",
      "AppKit- und System-Nähe sauber halten",
      "TypeScript-APIs für Extensions mitdenken",
      "Performance unter Tastendruck-Latenz priorisieren",
    ],
    requirements: [
      "Senior-Erfahrung in Swift und macOS",
      "TypeScript von Vorteil",
      "Spaß an Desktop-Craft und kleinen Teams",
      "Remote, 4-Tage-Woche möglich",
    ],
  },
  "polar-pd": {
    description:
      "Polar macht Payments für Open-Source-Maintainer. Als Product Designer gestaltest du Billing, Checkouts und Dashboards so, dass sie sich nach Produkt anfühlen, nicht nach PSP.\n\nRemote, fünf Leute um dich, 4-Tage-Woche, keine Bereitschaft.",
    responsibilities: [
      "Checkout, Payouts und Billing-Flows gestalten",
      "Ein schlankes System in Figma halten",
      "Mit Engineering an Edge Cases von Geld und Steuern arbeiten",
      "Open-Source-Nutzer in Research einbinden",
    ],
    requirements: [
      "Senior Product Design, ideal Fintech oder B2B",
      "Sicher in Figma und Systems",
      "Comfort mit Remote und hoher Autonomie",
      "4-Tage-Woche möglich",
    ],
  },
  "n26-spd": {
    description:
      "Als Staff Product Designer bei N26 arbeitest du über Squads hinweg an Konto, Karte und den Flows, die Millionen Menschen täglich sehen. Du setzt Systems, nicht nur Screens.\n\nHybrid in Berlin, 22 Designerinnen und Designer um dich, kein On-Call, aber hohe Erwartung an Urteilskraft.",
    responsibilities: [
      "Systeme und Patterns über mehrere Squads tragen",
      "Kritische Banking-Flows selbst gestalten",
      "Andere Designerinnen und Designer über Critique führen",
      "Research und Legal-Anforderungen in klare UX übersetzen",
    ],
    requirements: [
      "Staff- oder sehr starkes Senior-Niveau",
      "Erfahrung mit Consumer-Finance oder großen Plattformen",
      "Figma, Systems, Research",
      "Hybrid in Berlin",
    ],
  },
  "vercel-pd": {
    description:
      "Vercel sucht eine Product Designer für Dashboard, Deployments und die Stellen, an denen Next.js auf die Plattform trifft. Remote, hohes Niveau, kein Konzernprozess.\n\nDu arbeitest mit DX-Engineering und Product an Reibung, die Entwicklerinnen und Entwickler spüren.",
    responsibilities: [
      "Dashboard- und Deploy-Flows gestalten",
      "Systems für eine schnell wachsende Plattform halten",
      "Mit DX und Engineering an unklaren Kanten arbeiten",
      "Feedback aus der Community in Interfaces übersetzen",
    ],
    requirements: [
      "Senior Product Design, ideal Developer Tools",
      "Figma, Systems, Product Thinking",
      "Comfort mit Async Remote",
      "Remote weltweit",
    ],
  },
  "celonis-pd": {
    description:
      "Celonis macht Prozessdaten sichtbar. Als Senior Product Designer in München gestaltest du Analyseflächen für Enterprise-Teams, die Prozesse steuern, nicht nur Reports lesen.\n\nHybrid, 18 Leute im Design, B2B mit hoher Informationsdichte.",
    responsibilities: [
      "Analyse- und Workflow-UIs für Process Mining gestalten",
      "Research mit Operations- und IT-Rollen führen",
      "Komplexe Daten in scannbare Surfaces übersetzen",
      "Mit PM und Data Science an Prioritäten arbeiten",
    ],
    requirements: [
      "Senior Product Design, ideal B2B oder Data Products",
      "Figma und Research",
      "Comfort mit Informationsdichte",
      "Hybrid in München",
    ],
  },
};
