# Add Italian (it) Locale — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Italian as the fourth language across every layer of the Carol Orofino website — routing, UI strings, blog posts, language switcher, date formatting, questionnaire, and email.

**Architecture:** Italian (`it`) is added to `next-intl` routing config, which automatically propagates to middleware and sitemap. All hardcoded locale arrays and ternary chains must be updated manually. No feature flag — all changes ship together.

**Tech Stack:** Next.js App Router, next-intl, TypeScript, Tailwind CSS v4.

---

## Task 1: Add `it` to Routing Config

**Files:**
- Modify: `src/lib/i18n.ts`

- [ ] **Step 1: Edit `src/lib/i18n.ts`**

Replace:
```ts
locales: ['pt', 'en', 'es'] as const,
```
With:
```ts
locales: ['pt', 'en', 'es', 'it'] as const,
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/i18n.ts
git commit -m "feat(i18n): add Italian locale to routing config"
```

---

## Task 2: Create Italian UI Translation File

**Files:**
- Create: `src/messages/it.json`

- [ ] **Step 1: Create `src/messages/it.json` with the following content**

```json
{
  "nav": {
    "home": "Home",
    "projects": "Progetti Consegnati",
    "about": "Chi siamo",
    "services": "Servizi",
    "projectsShort": "Progetti",
    "blog": "Journal",
    "contact": "Contatti",
    "questionnaire": "Questionario"
  },
  "home": {
    "tagline": "Interior Design che trasforma gli spazi in esperienze",
    "collectionsTitle": "Il Nostro Lavoro",
    "residencial": "Residenziale",
    "comercial": "Commerciale",
    "fachadas": "Facciate",
    "inspire-se": "Inspire-se",
    "reforma": "Ristrutturazione",
    "viewAllProjects": "Vedi tutti i progetti",
    "featuredTitle": "Progetti in Evidenza",
    "aboutTitle": "Carol Orofino",
    "aboutTeaser": "Credo che ogni spazio racconti una storia. Con oltre 10 anni di esperienza, creo ambienti che uniscono funzionalità, bellezza e identità.",
    "aboutLink": "Scopri di più",
    "blogTitle": "Dal Journal",
    "blogTeaser": "Riflessioni sul design, riferimenti e l'arte di creare spazi che durano.",
    "blogLink": "Leggi gli articoli",
    "questionnaireSectionEyebrow": "Lavoriamo insieme",
    "questionnaireSectionTitle": "Parlami del tuo progetto",
    "questionnaireSectionBody": "Compila il questionario di briefing e parlami del tuo spazio, del tuo stile e dei tuoi sogni. Con queste informazioni, creo una proposta davvero personalizzata per te.",
    "questionnaireSectionCta": "Inizia il questionario"
  },
  "projects": {
    "title": "Progetti Consegnati",
    "noResults": "Nessun progetto trovato.",
    "filter": {
      "all": "Tutti",
      "residencial": "Residenziale",
      "comercial": "Commerciale",
      "reforma": "Ristrutturazione",
      "inspire-se": "Inspire-se"
    }
  },
  "project": {
    "location": "Posizione",
    "year": "Anno",
    "category": "Categoria",
    "whatsappCta": "Voglio un progetto come questo",
    "whatsappMessage": "Ciao Carol, sono interessato/a al progetto {title} e vorrei saperne di più."
  },
  "about": {
    "title": "Chi è Carol Orofino",
    "bio": "Carol Orofino è un'interior designer specializzata in Design Sostenibile. In oltre 10 anni di carriera, ha sviluppato progetti residenziali e commerciali che traducono la personalità dei propri clienti in spazi unici e funzionali.",
    "philosophy": "Filosofia del Design",
    "philosophyText": "Credo che il design d'interni vada oltre l'estetica. Si tratta di creare spazi che trasformano l'esperienza di chi vi abita — spazi che ispirano, accolgono e durano.",
    "eyebrow": "Chi siamo",
    "customEyebrow": "Esclusivamente per te",
    "customTitle": "Progetti su misura, fatti per te",
    "customBody": "Ogni progetto inizia con un ascolto attento. Capire il tuo stile di vita, i tuoi gusti e il modo in cui usi ogni spazio è ciò che ci permette di creare ambienti davvero unici — funzionali, accoglienti e in armonia con chi sei. Un progetto personalizzato non è solo più bello; è uno che continua ad avere senso molto tempo dopo che ti sei sistemato.",
    "servicesTitle": "Servizi",
    "ctaTitle": "Lavoriamo insieme",
    "ctaSubtitle": "Parlami del tuo progetto",
    "ctaButton": "Chatta su WhatsApp",
    "ctaWhatsappMessage": "Ciao Carol, vorrei saperne di più sui tuoi servizi."
  },
  "services": {
    "title": "Servizi"
  },
  "contact": {
    "title": "Contatti",
    "whatsappLabel": "Chatta su WhatsApp",
    "whatsappMessage": "Ciao Carol, vorrei saperne di più sui tuoi servizi.",
    "emailLabel": "Email",
    "instagramLabel": "Instagram",
    "followOn": "Segui su Instagram",
    "questionnaireLink": "Compila il questionario di briefing"
  },
  "questionnaire": {
    "title": "Questionario di Briefing",
    "progress": "Passo {current} di {total}",
    "next": "Avanti",
    "back": "Indietro",
    "submit": "Invia",
    "submitting": "Invio in corso...",
    "errorGeneric": "Qualcosa è andato storto. Riprova.",
    "step1": {
      "title": "Identificazione e Contatti",
      "name": "Nome completo",
      "whatsapp": "WhatsApp",
      "email": "Email",
      "namePlaceholder": "Il tuo nome completo",
      "whatsappPlaceholder": "+39 XXX XXX XXXX",
      "emailPlaceholder": "tua@email.com",
      "nameError": "Il nome è obbligatorio",
      "whatsappError": "Numero WhatsApp non valido",
      "emailError": "Email non valida"
    },
    "step2": {
      "title": "Lo Spazio",
      "roomType": "Quale spazio vuoi trasformare?",
      "roomTypePlaceholder": "Seleziona...",
      "roomOptions": {
        "sala": "Soggiorno",
        "quarto": "Camera da letto",
        "cozinha": "Cucina",
        "escritorio": "Ufficio",
        "consultorio": "Studio medico",
        "outro": "Altro"
      },
      "roomTypeError": "Seleziona un tipo di ambiente",
      "area": "Misure (se le conosci)",
      "areaPlaceholder": "Es.: soggiorno 4×5 m, camera 3×3 m, o semplicemente 'un appartamento di 60 mq'",
      "floorPlan": "Planimetria o schizzo (opzionale)",
      "floorPlanHint": "PDF, PNG o JPG — max 10MB",
      "photos": "Foto o video dello spazio (opzionale)",
      "photosHint": "Più file — max 50MB totali",
      "fileTooLarge": "Il file supera la dimensione massima",
      "fileInvalidType": "Tipo di file non consentito",
      "substituir": "Sostituisci",
      "remover": "Rimuovi",
      "adicionarMais": "Aggiungi altri"
    },
    "step3": {
      "title": "Stile e Riferimenti",
      "styles": "Quale stile ti rappresenta?",
      "styleOptions": {
        "minimalista": "Minimalista",
        "industrial": "Industriale",
        "escandinavo": "Scandinavo",
        "classico": "Classico",
        "moderno": "Moderno",
        "boho": "Boho",
        "japandi": "Japandi",
        "rustico": "Rustico",
        "contemporaneo": "Contemporaneo",
        "provencal": "Provenzale"
      },
      "mustHave": "Cosa deve essere incluso nel tuo progetto?",
      "mustHavePlaceholder": "Es.: grande scrivania da lavoro, illuminazione calda...",
      "mustHaveHint": "Max 500 caratteri"
    },
    "step4": {
      "title": "Ambito e Investimento",
      "scopeType": "Cosa stai cercando?",
      "scopeOptions": {
        "consultoria": "Consulenza colori e arredamento",
        "projeto3d": "Progetto 3D dettagliato",
        "reforma": "Ristrutturazione completa con supervisione"
      },
      "scopeTypeError": "Seleziona un tipo di progetto",
      "urgency": "Qual è la tua tempistica?",
      "urgencyOptions": {
        "imediata": "Immediata",
        "3meses": "Entro 3 mesi",
        "sondando": "Solo esplorando"
      },
      "budget": "Fascia di investimento per l'esecuzione",
      "budgetOptions": {
        "ate10k": "Fino a R$ 10.000",
        "10a30k": "R$ 10.000 – R$ 30.000",
        "30a80k": "R$ 30.000 – R$ 80.000",
        "acima80k": "Oltre R$ 80.000"
      }
    },
    "success": {
      "title": "Grazie!",
      "message": "Abbiamo ricevuto il tuo questionario e ti contatteremo presto.",
      "backToHome": "home"
    }
  },
  "blog": {
    "title": "Journal",
    "subtitle": "Design, riferimenti e ispirazione",
    "minRead": "min di lettura",
    "readMore": "Leggi l'articolo",
    "backToBlog": "Torna al journal",
    "authorRole": "Specialista in Interior Design",
    "relatedPostsTitle": "Continua a Leggere",
    "breadcrumbHome": "Home",
    "contactCta": "Inizia una conversazione",
    "sidebarHighlights": "In evidenza",
    "sidebarCategories": "Categorie",
    "allCategories": "Tutte",
    "noPosts": "Nessun articolo in questa categoria.",
    "expertTip": "Consiglio dell'esperto",
    "sidebarInThisArticle": "In questo articolo",
    "sidebarCtaTitle": "Pronto a trasformare il tuo spazio?",
    "sidebarCtaBody": "Carol Orofino segue progetti residenziali e commerciali.",
    "sidebarCtaButton": "Parla con Carol",
    "categoryLabels": {
      "Luxo": "Lusso",
      "Minimalismo": "Minimalismo",
      "Design Escandinavo": "Design Scandinavo"
    }
  },
  "comercial": {
    "hero": "Commerciale",
    "back": "Indietro",
    "s1": {
      "label": "01 — Strategia",
      "title": "Design che\nlavora per te",
      "p1": "In uno spazio commerciale, l'ambiente parla prima di te. Trasmette serietà, personalità o calore — a volte tutti e tre insieme.",
      "p2": "Lavoro per assicurarmi che ogni dettaglio — layout, arredi, luce, palette — rinforzi chi sei e cosa vuoi comunicare."
    },
    "s2": {
      "label": "02 — Esecuzione",
      "title": "Spazi che\nrimangono con te",
      "p1": "Dal briefing alla consegna, supervisiono ogni fase: progetto tecnico, materiali, fornitori, costruzione.",
      "p2": "L'obiettivo è sempre lo stesso — uno spazio in cui le persone vogliono tornare, che rafforza la credibilità del tuo brand e funziona perfettamente ogni giorno."
    },
    "cta": {
      "title": "Progettiamo il tuo spazio?",
      "body": "Parlami della tua attività e di cosa hai bisogno dallo spazio.",
      "button": "Compila il questionario"
    }
  },
  "residencial": {
    "hero": "Residenziale",
    "back": "Indietro",
    "s1": {
      "label": "01 — Approccio",
      "title": "Una casa fatta\napposta per te",
      "p1": "Prima di tracciare qualsiasi linea, ascolto. Come ti svegli, come intrattieni gli ospiti, cosa ti stanca del tuo spazio attuale, cosa non puoi fare a meno di avere.",
      "p2": "Solo allora inizia il progetto — uno che unisce ciò che è bello con ciò che funziona davvero nella tua vita."
    },
    "s2": {
      "label": "02 — Risultato",
      "title": "Spazi che\naccolgono",
      "p1": "Da un appartamento compatto a una casa spaziosa, la cura è la stessa: materiali che invecchiano bene, una luce che trasforma, ogni pezzo al posto giusto.",
      "p2": "Il risultato è una casa che sembra sempre essere stata così — e da cui non vorrai andartene."
    },
    "cta": {
      "title": "Creiamo la tua casa?",
      "body": "Parlami del tuo spazio e di cosa sogni per esso.",
      "button": "Compila il questionario"
    }
  },
  "designDeInteriores": {
    "hero": "Interior\nDesign",
    "back": "Indietro",
    "s1": {
      "label": "01 — Processo",
      "title": "Dal concetto\nalla consegna",
      "p1": "Comincio ascoltando. La routine, i gusti, cosa ti disturba dello spazio attuale, cosa manca. Solo allora arriva il progetto — concept, moodboard, 3D e supervisione in cantiere fino al giorno della consegna.",
      "p2": "Il risultato è uno spazio che sembra sempre essere stato così: come se non potesse essere altrimenti."
    },
    "s2": {
      "label": "02 — Filosofia",
      "title": "Spazi che\ntrasformano",
      "p1": "Il design d'interni non è decorazione. È la differenza tra uno spazio che abiti e uno spazio che ti appartiene.",
      "p2": "Ogni materiale, ogni proporzione, ogni fonte di luce è scelta con intenzione — così che l'intero ambiente parli la stessa lingua."
    },
    "cta": {
      "title": "Creiamo insieme?",
      "body": "Parlami del tuo spazio e di cosa sogni per esso.",
      "button": "Compila il questionario"
    }
  },
  "projetos": {
    "hero": "Progetti",
    "back": "Indietro",
    "s1": {
      "label": "01 — Cucina",
      "title": "Praticità\ne bellezza",
      "p1": "La cucina è il cuore della casa. Mobili su misura, piani di lavoro ben proporzionati e illuminazione attenta fanno tutta la differenza nella vita quotidiana.",
      "p2": "Ogni centimetro progettato intorno al tuo stile di vita."
    },
    "s2": {
      "label": "02 — Studio",
      "title": "Spazio per\nla concentrazione e la creatività",
      "p1": "Uno spazio di lavoro ben progettato va oltre una scrivania e una sedia. Organizzazione, luce e il giusto flusso creano l'ambiente ideale per un lavoro di qualità.",
      "p2": "Perché il posto in cui lavori merita la stessa cura."
    },
    "s3": {
      "label": "03 — Camera",
      "title": "Un posto per\nriposare davvero",
      "p1": "La camera da letto deve essere un santuario. Materiali avvolgenti, una palette calmante e arredi che si adattano al ritmo di chi ci vive.",
      "p2": "Ogni decisione presa affinché tu senta di essere davvero arrivato a casa."
    },
    "s4": {
      "label": "04 — Bagno",
      "title": "Uno spazio\nper il benessere",
      "p1": "Il bagno non è più solo utilità. Con i materiali giusti e una composizione equilibrata, diventa un luogo di riposo e rinnovamento.",
      "p2": "Eleganza nei dettagli che tocchi e vedi ogni giorno."
    },
    "cta": {
      "title": "Pronto per iniziare?",
      "body": "Parlami del tuo spazio e creiamo insieme qualcosa di straordinario.",
      "button": "Compila il questionario"
    }
  },
  "inspireSe": {
    "metaTitle": "Ispirati — Carol Orofino",
    "metaDescription": "Stili di interior design che traducono la personalità in spazi unici.",
    "heroLabel": "Interior Design",
    "heroTitle": "Ispirati",
    "back": "Indietro",
    "cta": {
      "title": "Creiamo insieme?",
      "body": "Parlami del tuo spazio e di cosa sogni per esso.",
      "button": "Compila il questionario"
    },
    "classicos": {
      "title": "Classici",
      "text": "Lo stile classico valorizza l'eleganza senza tempo, la sofisticatezza e l'armonia. Si basa su pezzi strutturati, tagli impeccabili e design equilibrato — indipendente dalle tendenze passeggere. Uno stile che trasmette fiducia, autorità e raffinatezza, privilegiando qualità, durabilità e versatilità."
    },
    "contemporaneo": {
      "title": "Contemporaneo",
      "text": "Lo stile contemporaneo è il design del momento presente, caratterizzato da continua evoluzione e adattamento alle nuove tendenze. Valorizza funzionalità, comfort e sofisticatezza, creando ambienti equilibrati e moderni. I tratti principali includono linee pulite, spazi integrati e un'estetica semplice priva di eccessi."
    },
    "minimalista": {
      "title": "Minimalista",
      "text": "Lo stile minimalista si fonda sul concetto 'il meno è il più', privilegiando semplicità, funzionalità ed eliminazione dell'eccesso. Valorizza spazi organizzati, linee rette, pochi elementi e materiali di alta qualità — creando ambienti eleganti, luminosi e senza tempo."
    },
    "escandinavo": {
      "title": "Scandinavo",
      "text": "Lo stile scandinavo è un'estetica che fonde minimalismo, funzionalità e accoglienza, ispirata ai paesi nordici. Valorizza ambienti luminosi, organizzati e ben illuminati con mobili semplici e design pulito. La forte presenza di materiali naturali come il legno chiaro e i tessuti morbidi porta equilibrio e comfort allo spazio."
    },
    "industrial": {
      "title": "Industriale",
      "text": "Lo stile industriale trae ispirazione dalle vecchie fabbriche e dai magazzini urbani, celebrando un'estetica grezza, funzionale e ricca di personalità. Mette in risalto materiali grezzi, strutture a vista e spazi aperti — moderni e sobri. Il concetto è mostrare le ossa dello spazio, trasformando elementi come tubi e travi in parte del design."
    },
    "japandi": {
      "title": "Japandi",
      "text": "Lo stile Japandi è la fusione del design scandinavo e dell'estetica giapponese, unendo funzionalità, semplicità e calore. Mescola il minimalismo zen con il comfort nordico, creando ambienti equilibrati, eleganti e accoglienti. Onora l'essenziale, la natura e la bellezza dell'imperfezione (wabi-sabi)."
    },
    "boho": {
      "title": "Boho",
      "text": "Lo stile Boho è un'estetica libera, creativa e ricca di personalità che mescola influenze hippie, etniche e vintage. Valorizza comfort, natura e artigianato, creando spazi rilassati, accoglienti e unici. La decorazione sovrappone texture, mobili naturali, piante e pezzi con storia — senza regole rigide."
    },
    "moderno": {
      "title": "Moderno",
      "text": "Lo stile moderno è definito da funzionalità, semplicità e forme geometriche, seguendo il principio che la forma segue la funzione. Valorizza spazi integrati, ben illuminati e organizzati con un design pulito privo di eccessi. L'estetica è razionale ed elegante, focalizzata sulla praticità e sul collegamento tra interno ed esterno."
    },
    "rustico": {
      "title": "Rustico",
      "text": "Lo stile rustico valorizza la naturalità, la semplicità e la connessione con la natura, portando l'atmosfera accogliente della campagna in ogni spazio. Utilizza materiali grezzi come legno, pietra e ferro, mettendo in risalto texture, imperfezioni e finiture naturali. Gli spazi sono caldi, confortevoli e pieni di carattere."
    },
    "provencal": {
      "title": "Provenzale",
      "text": "Lo stile provenzale si ispira alle case di campagna del sud della Francia, fondendo fascino rustico con eleganza classica. Crea ambienti romantici, luminosi e accoglienti con mobili in legno invecchiato, dettagli curvi ed elementi artigianali. La decorazione celebra texture delicate, stampe floreali e materiali naturali come lino, ferro e ceramica."
    }
  },
  "footer": {
    "rights": "Tutti i diritti riservati."
  },
  "notFound": {
    "title": "Pagina non trovata",
    "description": "La pagina che stai cercando non esiste.",
    "back": "Torna alla home"
  }
}
```

- [ ] **Step 2: Verify key count matches en.json**

Run: `node -e "const en=require('./src/messages/en.json');const it=require('./src/messages/it.json');const flat=(o,p='')=>Object.entries(o).flatMap(([k,v])=>typeof v==='object'?flat(v,p+k+'.'):[[p+k,v]]);const ek=flat(en).map(([k])=>k);const ik=flat(it).map(([k])=>k);const missing=ek.filter(k=>!ik.includes(k));console.log('Missing keys:',missing)"`
Expected: `Missing keys: []`

- [ ] **Step 3: Commit**

```bash
git add src/messages/it.json
git commit -m "feat(i18n): add Italian UI translations"
```

---

## Task 3: Add Italian Blog Post Translations

**Files:**
- Modify: `src/data/posts.ts`

- [ ] **Step 1: Update the `Post` type to include `it` in `translations`**

In `src/data/posts.ts`, find the interface block:
```ts
  translations: {
    pt: {
      title: string
      subtitle: string
      sections: PostSection[]
      conclusion: string
      cta: string
    }
    en: {
```

Replace with:
```ts
  translations: {
    pt: {
      title: string
      subtitle: string
      sections: PostSection[]
      conclusion: string
      cta: string
    }
    en: {
      title: string
      subtitle: string
      sections: PostSection[]
      conclusion: string
      cta: string
    }
    es: {
      title: string
      subtitle: string
      sections: PostSection[]
      conclusion: string
      cta: string
    }
    it: {
      title: string
      subtitle: string
      sections: PostSection[]
      conclusion: string
      cta: string
    }
  }
```

- [ ] **Step 2: Add Italian translation for post `the-new-language-of-luxury`**

Inside the first post object (slug: `'the-new-language-of-luxury'`), after the closing `},` of the `es` block, add:

```ts
      it: {
        title: 'Il Nuovo Linguaggio del Lusso',
        subtitle: 'Il vero lusso non è mai stato rumoroso. È sempre stato preciso.',
        sections: [
          {
            heading: 'Oltre la Superficie Dorata',
            body: 'Per decenni, il lusso nel design d\'interni ha parlato in un unico dialetto: cornici dorate, pavimenti in marmo, lampadari di cristallo. L\'opulenza come evidenza. L\'ambiente annunciava il proprio costo affinché il visitatore non dovesse chiederlo.\n\nQuesto linguaggio sta invecchiando. Il nuovo lusso non annuncia. Rivela — lentamente, a chi sa guardare. Un unico pezzo di mobilio con il tipo di artigianato che può venire solo dalle mani, non dalle macchine. Una finitura a parete che cambia colore mentre il pomeriggio avanza. Un tessuto che chiede di essere toccato prima di poter essere compreso.',
            image: '/images/blog/new-language-of-luxury-sala.png',
          },
          {
            heading: 'Il Materiale Sa',
            body: 'Il vero lusso vive nella qualità dei materiali — non nei loro prezzi, ma nella loro onestà. Pietra che è stata estratta, non colata. Legno che è cresciuto, non ingegnerizzato. Pelle che si ammorbidirà negli anni, non si screpolerà.\n\nQuesti materiali condividono una qualità comune: migliorano con il tempo. Portano la memoria dell\'uso. In un mondo di oggetti usa e getta, un materiale che diventa più bello con l\'età è, di per sé, un atto di radicalismo. Questo è il lusso.',
            table: [
              { label: 'Pietra', value: 'Estratta, non colata — ogni venatura è unica e racconta il tempo' },
              { label: 'Legno', value: 'Cresciuto, non ingegnerizzato — acquista colore e carattere negli anni' },
              { label: 'Pelle naturale', value: 'Si ammorbidisce e costruisce memoria con l\'uso — migliora nel tempo' },
              { label: 'Lino e lana', value: 'Tessuti che respirano — onestà tattile, bellezza che non ha bisogno di esibirsi' },
            ],
            tip: 'Un materiale davvero di lusso non ha bisogno di trattamenti per sembrare costoso — lo è già. Quando valuti un pezzo, passaci sopra la mano: i materiali onesti si rivelano al tatto prima di qualsiasi etichetta.',
            image: '/images/blog/new-language-of-luxury-closet.png',
          },
          {
            heading: 'Lo Spazio come Privilegio Massimo',
            body: 'In città dense dove i metri quadrati sono valuta, lo spazio stesso è diventato il materiale più esclusivo di tutti. Non lo spazio come vuoto — ma lo spazio come intenzione. Un ambiente con spazio per respirare. Un corridoio abbastanza largo da percorrere lentamente. Un angolo lettura che non chiede nulla se non la tua presenza.\n\nL\'interno di lusso di questo decennio restituisce lo spazio al suo abitante. Non riempie ogni angolo. Si fida del silenzio. Progetta per la quiete tanto quanto per l\'uso.',
            image: '/images/blog/new-language-of-luxury-living.png',
          },
          {
            heading: 'Personalizzazione al di sopra del Prestigio',
            body: 'Il cambiamento che definisce il lusso contemporaneo con maggiore chiarezza è questo: si è spostato dallo status all\'identità. La domanda non è più "cosa dice questo ambiente della mia ricchezza?" ma "cosa dice questo ambiente di chi sono?"\n\nQuesto è più difficile da progettare. Richiede ascolto. Richiede di capire come una persona si muove nella propria casa alle sette del mattino, cosa ha bisogno da un ambiente dopo una lunga giornata, quali oggetti hanno significato per lei. L\'ambiente più lussuoso non è il più costoso. È quello che veste il suo proprietario come un abito su misura.',
          },
        ],
        conclusion:
          'Il lusso, ben inteso, non è uno stile. È uno standard di attenzione — applicato ai materiali, allo spazio, all\'essere umano che ci vivrà. Quando un ambiente è progettato con quel livello di cura, non ha bisogno di proclamarsi. Chi entra semplicemente lo sa.',
        cta: 'Carol Orofino Design porta questo standard di attenzione a ogni progetto. Se sei pronto a investire in uno spazio costruito intorno a chi sei davvero, ti invitiamo a cominciare.',
      },
```

- [ ] **Step 3: Add Italian translation for post `the-discipline-of-subtraction`**

Inside the second post object (slug: `'the-discipline-of-subtraction'`), after the closing `},` of the `es` block, add:

```ts
      it: {
        title: 'La Disciplina della Sottrazione',
        subtitle: 'Il minimalismo non è vuoto. È il coraggio di tenere solo ciò che conta.',
        sections: [
          {
            heading: 'Cosa Non È il Minimalismo',
            body: 'Il minimalismo è stato frainteso — ridotto a uno stile visivo, un\'estetica di pareti bianche e scaffali spogli. Ma il vero minimalismo non riguarda il possedere meno cose. Riguarda il rendere ogni cosa deliberata.\n\nUn ambiente minimalista può contenere calore. Può contenere colore, texture, memoria, vita. Quello che non può contenere è il rumore — il rumore visivo di oggetti che non hanno ragione di essere lì, mobili scelti per default, decorazione che riempie lo spazio senza guadagnarselo.',
            image: '/images/blog/discipline-of-subtraction-calor.png',
          },
          {
            heading: 'La Selezione È il Design',
            body: 'L\'abilità più importante nel design minimalista non è ciò che aggiungi. È ciò che rimuovi. Ogni oggetto che lascia un ambiente rende gli oggetti restanti più potenti. La sedia che rimane diventa la sedia — non una delle tante, ma quella, scelta, posizionata, vista.\n\nÈ per questo che il minimalismo è più difficile da progettare del massimalismo. L\'aggiunta è facile. La sottrazione richiede convinzione. Devi essere abbastanza sicuro di ciò che resta da lasciar andare tutto il resto.',
            image: '/images/blog/discipline-of-subtraction-edicao.png',
            table: [
              { label: 'Rimane', value: 'Pezzi con funzione definita, materiali durevoli, proporzione giusta' },
              { label: 'Va via', value: 'Oggetti senza ragione di essere, duplicati, decorazione riempitiva' },
              { label: 'Criterio', value: 'Ogni oggetto deve guadagnarsi il proprio posto — non limitarsi a occuparlo' },
              { label: 'Risultato', value: 'Ogni pezzo restante diventa più potente grazie all\'assenza degli altri' },
            ],
            tip: 'Prima di modificare uno spazio, togli tutto. Reintroduci solo ciò che manca. Ciò che non è stato cercato probabilmente non apparteneva a quel luogo.',
          },
          {
            heading: 'Il Peso Emotivo degli Oggetti',
            body: 'Gli oggetti portano peso — non fisico, ma emotivo. Un ambiente disordinato è stancante non perché sia brutto, ma perché ti chiede qualcosa costantemente. Il tuo sguardo si sposta. La mente prende piccole decisioni. Registri cose, le registri a metà, le eviti.\n\nUn ambiente minimalista ti riposa. Conserva solo ciò che merita la tua attenzione. Il risultato non è freddezza — è chiarezza. La libertà psicologica di uno spazio che non esige.',
          },
          {
            heading: 'Il Minimalismo come Impegno',
            body: 'La difficoltà del minimalismo è che non finisce nella fase di progetto. Richiede manutenzione — un rapporto diverso con gli oggetti, con gli acquisti, con l\'accumulo. Un interno minimalista progettato senza questa comprensione non resterà minimalista.\n\nMa quando la filosofia è genuinamente abbracciata, qualcosa cambia. Inizi a scegliere diversamente. Compri meno, ma meglio. Noti di più. La casa diventa il riflesso di ciò che conta davvero — non di ciò che ha riempito uno spazio, ma di ciò che è stato scelto per starci.',
          },
        ],
        conclusion:
          'Una casa minimalista non è una dichiarazione di contenimento. È una dichiarazione di chiarezza — su ciò che valorizzi, su come vuoi vivere, su cosa vuoi sentire quando varchi la tua porta. Quella chiarezza vale la pena di essere progettata.',
        cta: 'Carol Orofino Design crea interni minimalisti che sono caldi, attenti e profondamente personali. Se la semplicità è la tua forma di lusso, lascia che lo progettiamo insieme.',
      },
```

- [ ] **Step 4: Add Italian translation for post `where-silence-has-a-shape`**

Inside the third post object (slug: `'where-silence-has-a-shape'`), after the closing `},` of the `es` block, add:

```ts
      it: {
        title: 'Dove il Silenzio Ha una Forma',
        subtitle: 'Sul lusso di dire meno — e significare tutto.',
        sections: [
          {
            heading: 'L\'Architettura del Silenzio',
            body: 'Il design scandinavo comprende ciò che la maggior parte degli interni dimentica — che l\'elemento più potente di un ambiente è lo spazio tra gli oggetti. Una poltrona in rovere chiaro, posizionata di fronte a un\'inondazione di luce naturale. Un\'unica tenda di lino, traslucida come un mattino a Bergen, che filtra il calore senza interromperlo. Queste non sono scelte decorative. Sono dichiarazioni.\n\nIl lusso, in questo contesto, non si misura in quantità. Si misura in intenzione. Ogni pezzo guadagna il proprio posto. Ogni texture — la venatura del legno chiaro, il tessuto del lino grezzo, la quieta certezza della pietra spazzolata — racconta una storia che non ha bisogno di essere ripetuta.',
          },
          {
            heading: 'La Texture come Biografia',
            body: 'Passa la mano sulle superfici di un interno scandinavo ben progettato e capirai cose che le parole non possono trasportare. Il calore del rovere naturale: legno che è cresciuto lentamente, che ha acquisito colore e carattere attraverso decenni di luce nordica. La lieve resistenza del lino, tessuto con una scioltezza che respira. La freschezza assoluta e quieta del calcare chiaro sotto i piedi.\n\nQueste texture non sono accenti. Sono la narrazione. In una palette estratta dalla terra stessa — avorio, sabbia calda, il grigio delle acque ferme, il marrone della corteccia invecchiata — ogni materiale diventa una parola in una frase che dice: questa casa è stata costruita con pazienza.',
            table: [
              { label: 'Rovere chiaro', value: 'Base calda — invecchia con grazia e si approfondisce nel tono con l\'uso' },
              { label: 'Lino grezzo', value: 'Leggero e traspirante — ideale per tende, tappezzerie, biancheria da letto' },
              { label: 'Calcare chiaro', value: 'Freschezza e solidità — l\'ancora visiva degli spazi scandinavi' },
              { label: 'Lana naturale', value: 'Calore tattile senza peso visivo — coperte, cuscini, tappeti' },
              { label: 'Ceramica artigianale', value: 'L\'imperfezione come qualità — ogni pezzo è unico e insostituibile' },
            ],
            tip: 'Nel design scandinavo, le texture non decorano — narrano. Quando combini i materiali, dai priorità al contrasto tattile: liscio con ruvido, freddo con caldo, opaco con traslucido.',
            image: '/images/blog/where-silence-has-a-shape-cozinha.png',
          },
          {
            heading: 'Il Lusso del Meno',
            body: 'C\'è un malinteso sul minimalismo: che trattenga. In realtà, gli interni minimalisti più raffinati ti danno tutto — rifiutandosi di toglierti nulla di ciò che conta.\n\nLe linee pulite non significano freddo. Un ambiente di bianchi e beige caldo, con un unico accento in pelle caramello o bronzo spazzolato, può contenere più ricchezza sensoriale di dieci ambienti pieni di ornamenti. Gli occhi riposano. La mente si quieta. Il corpo capisce di essere arrivato in un posto in cui vale la pena stare.\n\nQuesto è il paradosso al cuore del lusso minimalista: meno l\'ambiente parla, più ascolti.',
          },
          {
            heading: 'La Luce come il Materiale più Prezioso',
            body: 'Nessun designer può acquistare ciò che il Nord offre liberamente — quella particolare qualità della luce scandinava: bassa, angolata, generosa. Percorre un ambiente come una conversazione lenta, toccando la texture di una coperta di lana, il bordo di un vaso di ceramica, la venatura pallida di una parete non rifinita.\n\nLa luce non è mai incidentale. Le tende di lino traslucido vengono scelte non solo per ammorbidire una finestra, ma per coreografare come la luce entra in un ambiente nell\'arco delle ore del giorno. I mobili vengono posizionati non per convenzione, ma per il modo in cui cadrà la luce del mattino. La luce naturale, in questa filosofia, non è un supplemento — è il design stesso.',
            image: '/images/blog/where-silence-has-a-shape-banheiro.png',
          },
        ],
        conclusion:
          'Abitare uno spazio concepito in questo linguaggio significa capire che la semplicità, perseguita con rigore assoluto, diventa la propria forma di stravaganza. Se hai sentito che qualcosa manca nel tuo interno — e non riesci a nominarlo con precisione — forse ciò che manca è esattamente questo: meno.',
        cta: 'Carol Orofino Design traduce questa filosofia in spazi che vivono e respirano con te. Per i clienti che cercano interni dove la calma è un lusso deliberato, ti invitiamo a iniziare una conversazione.',
      },
```

- [ ] **Step 5: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/data/posts.ts
git commit -m "feat(blog): add Italian translations for all 3 posts"
```

---

## Task 4: Fix Hardcoded Locales in Blog Slug Page + Locale Format

**Files:**
- Modify: `src/app/[locale]/blog/[slug]/page.tsx`

- [ ] **Step 1: Update `generateStaticParams` locales array (line ~11)**

Find:
```ts
  const locales: Locale[] = ['pt', 'en', 'es']
```
Replace with:
```ts
  const locales: Locale[] = ['pt', 'en', 'es', 'it']
```

- [ ] **Step 2: Update locale format mapping in the same file (line ~52)**

Find:
```ts
    lang === 'pt' ? 'pt-BR' : lang === 'es' ? 'es-ES' : 'en-US'
```
Replace with:
```ts
    lang === 'pt' ? 'pt-BR' : lang === 'es' ? 'es-ES' : lang === 'it' ? 'it-IT' : 'en-US'
```

- [ ] **Step 3: Commit**

```bash
git add "src/app/[locale]/blog/[slug]/page.tsx"
git commit -m "feat(blog): add Italian to static params and locale format mapping"
```

---

## Task 5: Update Locale Format Mappings in 3 Remaining Files

**Files:**
- Modify: `src/components/AuthorBlock.tsx`
- Modify: `src/components/BlogSidebar.tsx`
- Modify: `src/app/[locale]/blog/page.tsx`

- [ ] **Step 1: Update `src/components/AuthorBlock.tsx` (line ~15)**

Find:
```ts
    locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-US'
```
Replace with:
```ts
    locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es-ES' : locale === 'it' ? 'it-IT' : 'en-US'
```

- [ ] **Step 2: Update `src/components/BlogSidebar.tsx` (line ~34)**

Find:
```ts
    locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-US'
```
Replace with:
```ts
    locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es-ES' : locale === 'it' ? 'it-IT' : 'en-US'
```

- [ ] **Step 3: Update `src/app/[locale]/blog/page.tsx` (line ~79)**

Find:
```ts
                          lang === 'pt' ? 'pt-BR' : lang === 'es' ? 'es-ES' : 'en-US',
```
Replace with:
```ts
                          lang === 'pt' ? 'pt-BR' : lang === 'es' ? 'es-ES' : lang === 'it' ? 'it-IT' : 'en-US',
```

- [ ] **Step 4: Commit**

```bash
git add src/components/AuthorBlock.tsx src/components/BlogSidebar.tsx "src/app/[locale]/blog/page.tsx"
git commit -m "feat(i18n): add it-IT locale format to date formatters"
```

---

## Task 6: Add IT to Language Switchers

**Files:**
- Modify: `src/components/Navbar.tsx`
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Update `src/components/Navbar.tsx`**

Find the locale array (lines ~11-13):
```ts
  { code: 'pt', label: 'PT' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
```
Replace with:
```ts
  { code: 'pt', label: 'PT' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'it', label: 'IT' },
```

- [ ] **Step 2: Update `src/components/Footer.tsx`**

Find the locale array (lines ~9-11):
```ts
  { code: 'pt', label: 'PT' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
```
Replace with:
```ts
  { code: 'pt', label: 'PT' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'it', label: 'IT' },
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.tsx src/components/Footer.tsx
git commit -m "feat(ui): add Italian IT button to language switcher"
```

---

## Task 7: Questionnaire Page — Italian Meta Description

**Files:**
- Modify: `src/app/[locale]/questionario/page.tsx`

- [ ] **Step 1: Update the `generateMetadata` locale chain (lines ~17-21)**

Find:
```ts
      locale === 'en'
        ? 'Fill out our questionnaire so we can understand your project and prepare a personalized proposal.'
        : locale === 'es'
          ? 'Completa nuestro cuestionario para entender mejor tu proyecto y preparar una propuesta personalizada.'
          : 'Preencha nosso questionário para que possamos entender melhor o seu projeto e preparar uma proposta personalizada.',
```
Replace with:
```ts
      locale === 'en'
        ? 'Fill out our questionnaire so we can understand your project and prepare a personalized proposal.'
        : locale === 'es'
          ? 'Completa nuestro cuestionario para entender mejor tu proyecto y preparar una propuesta personalizada.'
          : locale === 'it'
            ? 'Compila il nostro questionario per aiutarci a capire il tuo progetto e preparare una proposta personalizzata.'
            : 'Preencha nosso questionário para que possamos entender melhor o seu projeto e preparar uma proposta personalizada.',
```

- [ ] **Step 2: Commit**

```bash
git add "src/app/[locale]/questionario/page.tsx"
git commit -m "feat(questionnaire): add Italian meta description"
```

---

## Task 8: Italian Phone Mask and Email Strings

**Files:**
- Modify: `src/components/questionnaire/Step1Identity.tsx`
- Modify: `src/actions/questionnaireUtils.ts`

- [ ] **Step 1: Add Italian phone mask in `Step1Identity.tsx`**

In `src/components/questionnaire/Step1Identity.tsx`, inside `maskPhone()`, find:
```ts
    if (locale === 'es') {
```
Add the Italian block **before** the `es` block:
```ts
    if (locale === 'it') {
      let digits = value.replace(/\D/g, '')
      if (digits.startsWith('39')) digits = digits.slice(2)
      digits = digits.slice(0, 10)
      if (digits.length === 0) return ''
      if (digits.length <= 3) return `+39 ${digits}`
      if (digits.length <= 6) return `+39 ${digits.slice(0, 3)} ${digits.slice(3)}`
      return `+39 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
    }
    if (locale === 'es') {
```

- [ ] **Step 2: Add Italian DDI normalization in `questionnaireUtils.ts`**

In `src/actions/questionnaireUtils.ts`, inside `normalizeWhatsApp()`, find:
```ts
  if (locale === 'es') {
    return digits.startsWith('54') ? digits : `54${digits}`
  }
```
Add the Italian block **before** the `es` block:
```ts
  if (locale === 'it') {
    return digits.startsWith('39') ? digits : `39${digits}`
  }
  if (locale === 'es') {
    return digits.startsWith('54') ? digits : `54${digits}`
  }
```

- [ ] **Step 3: Add Italian email strings in `questionnaireUtils.ts`**

In `src/actions/questionnaireUtils.ts`, inside `CLIENT_EMAIL_STRINGS`, find the `es` entry closing `},` and add after it:
```ts
  it: {
    subject: 'Abbiamo ricevuto il tuo questionario — Carol Orofino',
    greeting: (name) => `Ciao, ${name}!`,
    confirmation: 'Abbiamo ricevuto il tuo questionario e ti contatteremo a breve.',
    summaryTitle: 'Riepilogo del tuo invio',
    roomLabel: 'Ambiente/i',
    stylesLabel: 'Stile/i',
    nextSteps: 'Carol Orofino esaminerà le tue risposte e ti contatterà via WhatsApp o email.',
  },
```

- [ ] **Step 4: Commit**

```bash
git add src/components/questionnaire/Step1Identity.tsx src/actions/questionnaireUtils.ts
git commit -m "feat(questionnaire): add Italian phone mask and email confirmation strings"
```

---

## Task 9: Final Verification

- [ ] **Step 1: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 2: Run linter**

Run: `npm run lint`
Expected: no errors

- [ ] **Step 3: Run tests**

Run: `npm run test`
Expected: all tests pass (existing tests use `'pt'` hardcoded and are unaffected)

- [ ] **Step 4: Run production build**

Run: `npm run build`
Expected: build completes successfully, routes for `/it/*` are generated in the static params output

- [ ] **Step 5: Smoke-test in dev server (manual)**

Run: `npm run dev`

Visit in browser:
- `http://localhost:3000/it` — home page in Italian
- `http://localhost:3000/it/blog` — blog listing in Italian
- `http://localhost:3000/it/blog/the-new-language-of-luxury` — full article in Italian
- `http://localhost:3000/it/questionario` — questionnaire in Italian, phone field shows `+39` format
- Check language switcher shows PT / EN / ES / IT

- [ ] **Step 6: Final commit if any fixes needed, then done**

```bash
git log --oneline -8
```
Expected: 8 clean commits for this feature.
