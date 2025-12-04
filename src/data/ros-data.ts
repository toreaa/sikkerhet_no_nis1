// ROS-analyse data - Risiko- og Sårbarhetsanalyse

// CIA-triad: Konfidensialitet, Integritet, Tilgjengelighet
export interface CIAImpact {
  confidentiality: boolean // K - Konfidensialitet
  integrity: boolean // I - Integritet
  availability: boolean // T - Tilgjengelighet
}

export interface ThreatScenario {
  id: string
  category: string
  name: string
  description: string
  vulnerabilityDescription: string // Sårbarhet beskrivelse
  consequenceDescription: string // Konsekvens beskrivelse
  technicalDetails: string
  ciaImpact: CIAImpact
  baseProbability: 1 | 2 | 3 | 4
  baseConsequence: 1 | 2 | 3
  probabilityFactors: string[]
  consequenceFactors: string[]
  existingMeasures: string[] // Typiske eksisterende tiltak
  additionalMeasures: string[] // Ytterligere tiltak
  mitigations: string[] // Alle tiltak samlet
  relevantFlags: string[]
  exposureMultiplier: {
    internet: number
    helsenett: number
    internal: number
  }
  mitigationEffect: {
    probabilityReduction: number
    consequenceReduction: number
  }
}

export interface RiskAssessment {
  scenario: ThreatScenario
  // Før tiltak
  adjustedProbability: number
  adjustedConsequence: number
  riskScore: number
  riskLevel: "low" | "medium" | "high" | "critical"
  // Etter tiltak
  mitigatedProbability: number
  mitigatedConsequence: number
  mitigatedRiskScore: number
  mitigatedRiskLevel: "low" | "medium" | "high" | "critical"
  // Tiltak
  applicableExistingMeasures: string[]
  applicableAdditionalMeasures: string[]
  applicableMitigations: string[]
}

// Sannsynlighetsnivåer
export const probabilityLevels = {
  1: { label: "Svært lav", description: "Usannsynlig, < 1% sjanse per år" },
  2: { label: "Lav", description: "Lite sannsynlig, 1-10% sjanse per år" },
  3: { label: "Moderat", description: "Kan skje, 10-50% sjanse per år" },
  4: { label: "Høy", description: "Sannsynlig, > 50% sjanse per år" },
}

// Konsekvensnivåer
export const consequenceLevels = {
  1: { label: "Lav", description: "Begrenset skade, enkelt å håndtere" },
  2: { label: "Moderat", description: "Betydelig skade, krever ressurser å håndtere" },
  3: { label: "Alvorlig", description: "Stor skade, kan true liv, helse eller drift" },
}

// Risikonivåer basert på score
export const riskLevels = {
  low: { min: 1, max: 3, label: "Lav risiko", color: "green", action: "Akseptabel risiko, overvåk" },
  medium: { min: 4, max: 6, label: "Moderat risiko", color: "yellow", action: "Vurder tiltak, prioriter ved kapasitet" },
  high: { min: 7, max: 9, label: "Høy risiko", color: "orange", action: "Tiltak må implementeres" },
  critical: { min: 10, max: 12, label: "Kritisk risiko", color: "red", action: "Umiddelbar handling påkrevd" },
}

// Oppdaterte trusselscenarier med detaljert format
export const threatScenarios: ThreatScenario[] = [
  // 1. Ransomware
  {
    id: "ransomware",
    category: "Ondsinnet programvare",
    name: "Ransomware-angrep",
    description: "Kryptering av data og systemer med krav om løsepenger",
    vulnerabilityDescription: "Eksponerte RDP-tjenester, sårbare VPN-løsninger, manglende MFA, eller phishing-angrep gir angripere initiell tilgang til nettverket.",
    consequenceDescription: "Kritiske systemer og data blir kryptert. Tjenestene vil ikke være tilgjengelige. Potensiell datalekkasje ved dobbel utpressing. Betydelig omdømmeskade.",
    technicalDetails: "Moderne ransomware (LockBit 3.0, BlackCat/ALPHV, Cl0p) eksfiltrerer data før kryptering. Gjennomsnittlig nedetid: 21 dager. Løsepengekrav i helse: $1.27M gjennomsnitt.",
    ciaImpact: { confidentiality: true, integrity: true, availability: true },
    baseProbability: 3,
    baseConsequence: 3,
    probabilityFactors: ["Internett-eksponert RDP/VPN", "Manglende MFA", "Utdaterte systemer", "Manglende sikkerhetsopplæring"],
    consequenceFactors: ["Helseopplysninger", "Kritisk infrastruktur", "Manglende offline backup", "Ingen hendelsesresponsplan"],
    existingMeasures: [
      "Antivirus/EDR installert",
      "Brannmur konfigurert",
      "Daglig backup kjører",
      "E-postfiltrering aktivert",
    ],
    additionalMeasures: [
      "Implementer offline/immutable backup (3-2-1-1 regel)",
      "MFA på alle eksterne tilganger",
      "Nettverkssegmentering med mikrosegmentering",
      "XDR-løsning med automatisert respons",
      "Kvartalsvise phishing-simuleringer",
      "Incident response plan med øvelser",
    ],
    mitigations: [
      "Offline backup", "MFA", "Nettverkssegmentering", "EDR/XDR", "Phishing-opplæring", "Hendelsesresponsplan"
    ],
    relevantFlags: ["internet", "health_data", "critical_system"],
    exposureMultiplier: { internet: 1.5, helsenett: 1.0, internal: 0.6 },
    mitigationEffect: { probabilityReduction: 2, consequenceReduction: 1 },
  },

  // 2. Leverandørkjedeangrep
  {
    id: "supply_chain",
    category: "Leverandørkjedeangrep",
    name: "Kompromittert leverandør/programvare",
    description: "Angrep via tredjeparts programvare eller leverandørtilgang",
    vulnerabilityDescription: "Manglende kontroll på leverandørers sikkerhetsnivå. Automatiske oppdateringer fra kompromitterte kilder. Bred leverandørtilgang til systemer.",
    consequenceDescription: "Massiv dataeksponering via betrodd kanal. Vanskelig å oppdage. Kan gi full tilgang til interne systemer og data.",
    technicalDetails: "Kjente angrep: SolarWinds Orion (2020), Kaseya VSA (2021), MOVEit (2023). Helsesektoren særlig utsatt pga. mange integrasjoner (EPJ, lab, radiologi).",
    ciaImpact: { confidentiality: true, integrity: true, availability: true },
    baseProbability: 2,
    baseConsequence: 3,
    probabilityFactors: ["Mange tredjepartsleverandører", "Automatiske oppdateringer", "Manglende leverandørvurdering"],
    consequenceFactors: ["Kritisk knutepunkt", "Tilgang til pasientdata", "Mange integrerte systemer"],
    existingMeasures: [
      "Databehandleravtaler på plass",
      "Årlig leverandørgjennomgang",
      "Nettverksovervåking",
    ],
    additionalMeasures: [
      "Leverandørsikkerhetsscoring (SOC 2, ISO 27001 krav)",
      "Segmenterte leverandørtilganger med JIT-access",
      "Overvåking av leverandøraktivitet (UEBA)",
      "Software Bill of Materials (SBOM) krav",
      "Incident response plan for leverandørbrudd",
      "Pen-test krav i kontrakter",
    ],
    mitigations: [
      "Leverandørvurdering", "Segmentering", "UEBA", "SBOM", "Hendelsesplan"
    ],
    relevantFlags: ["critical_infrastructure", "extensive_integration", "health_data"],
    exposureMultiplier: { internet: 1.2, helsenett: 1.1, internal: 0.9 },
    mitigationEffect: { probabilityReduction: 1, consequenceReduction: 1 },
  },

  // 3. Målrettet phishing
  {
    id: "phishing_targeted",
    category: "Sosial manipulering",
    name: "Målrettet phishing (spear phishing)",
    description: "Målrettede e-postangrep mot ansatte med tilgang til sensitive systemer",
    vulnerabilityDescription: "Ansatte med tilgang til sensitive systemer mottar troverdige, målrettede phishing-forsøk basert på OSINT-innsamling.",
    consequenceDescription: "Kompromitterte kontoer gir tilgang til sensitive data. Kan være starten på større angrep.",
    technicalDetails: "AI-generert phishing øker i kvalitet. Business Email Compromise (BEC) målretter ledelse og økonomi. QR-kode phishing (quishing) omgår e-postfiltre.",
    ciaImpact: { confidentiality: true, integrity: false, availability: false },
    baseProbability: 4,
    baseConsequence: 2,
    probabilityFactors: ["Stor brukergruppe", "Offentlig eksponert organisasjon", "Manglende opplæring"],
    consequenceFactors: ["Privilegerte brukere rammes", "Tilgang til pasientdata", "Manglende MFA"],
    existingMeasures: [
      "E-postfiltrering (spam/phishing)",
      "Årlig sikkerhetsopplæring",
      "Varsling av mistenkelige e-poster",
    ],
    additionalMeasures: [
      "Månedlige phishing-simuleringer med oppfølging",
      "DMARC/DKIM/SPF implementering",
      "MFA på alle kontoer (hardware-tokens for admin)",
      "Privileged Access Management (PAM)",
      "Sikkerhetskultur-program",
      "AI-basert e-postanalyse",
    ],
    mitigations: [
      "Phishing-simuleringer", "DMARC", "MFA", "PAM", "Opplæring"
    ],
    relevantFlags: ["public_facing", "patient_identifiable", "health_data"],
    exposureMultiplier: { internet: 1.3, helsenett: 1.1, internal: 0.9 },
    mitigationEffect: { probabilityReduction: 2, consequenceReduction: 1 },
  },

  // 4. Kompromitterte kontoer
  {
    id: "unauthorized_access",
    category: "Uautorisert tilgang",
    name: "Kompromitterte brukerkontoer",
    description: "Uautorisert tilgang via stjålne, gjettede eller lekkede passord",
    vulnerabilityDescription: "Svak passordpolicy, gjenbrukte passord fra andre lekkasjer, eller manglende MFA gjør kontoer sårbare.",
    consequenceDescription: "Angriper får tilgang med legitime rettigheter. Vanskelig å oppdage. Kan eskalere privilegier.",
    technicalDetails: "Credential stuffing fra 24+ milliarder lekkede passord. Password spraying mot vanlige passord. Gjennomsnittlig tid til oppdagelse: 207 dager.",
    ciaImpact: { confidentiality: true, integrity: true, availability: false },
    baseProbability: 3,
    baseConsequence: 2,
    probabilityFactors: ["Manglende MFA", "Svak passordpolicy", "Gjenbrukte passord", "Ingen credential monitoring"],
    consequenceFactors: ["Tilgang til EPJ", "Administrative rettigheter", "Lateral movement mulig"],
    existingMeasures: [
      "Passordpolicy (min 8 tegn)",
      "Kontolåsing etter feilforsøk",
      "Logging av innlogging",
    ],
    additionalMeasures: [
      "MFA på alle kontoer (phishing-resistent for admin)",
      "Passordpolicy min 14 tegn eller passphrase",
      "Credential monitoring (Have I Been Pwned Enterprise)",
      "Kontobasert anomalideteksjon (UEBA)",
      "Passwordless autentisering for sensitive systemer",
      "Regelmessig tilgangsgjennomgang",
    ],
    mitigations: [
      "MFA", "Sterk passordpolicy", "Credential monitoring", "UEBA", "Tilgangsgjennomgang"
    ],
    relevantFlags: ["patient_identifiable", "health_data"],
    exposureMultiplier: { internet: 1.4, helsenett: 1.1, internal: 0.9 },
    mitigationEffect: { probabilityReduction: 2, consequenceReduction: 1 },
  },

  // 5. Datalekkasje/eksfiltrering
  {
    id: "data_exfiltration",
    category: "Datalekkasje",
    name: "Uautorisert dataeksfiltrering",
    description: "Sensitiv data kopieres ut av organisasjonen",
    vulnerabilityDescription: "Manglende DLP-kontroller, bred datatilgang, eller mulighet for å bruke USB/skytjenester gjør eksfiltrering mulig.",
    consequenceDescription: "Helseopplysninger på avveie. GDPR-brudd med potensielle bøter. Stor omdømmeskade. Mulig utpressing.",
    technicalDetails: "Helsejournaler verdt $250-1000 på darknet (10x kredittkort). Eksfiltrering via DNS tunneling, cloud storage, eller krypterte kanaler.",
    ciaImpact: { confidentiality: true, integrity: false, availability: false },
    baseProbability: 2,
    baseConsequence: 3,
    probabilityFactors: ["Manglende DLP", "Bred datatilgang", "USB/cloud tillatt", "Manglende logging"],
    consequenceFactors: ["Helseopplysninger", "Mange pasienter", "Sensitive diagnoser"],
    existingMeasures: [
      "Tilgangsstyring implementert",
      "Logging av filaksess",
      "Kryptert lagring",
    ],
    additionalMeasures: [
      "Data Loss Prevention (DLP) på endpoint og nettverk",
      "USB-restriksjon/blokkering",
      "Cloud Access Security Broker (CASB)",
      "Data classification og tagging",
      "Need-to-know tilgangsprinsipp",
      "Regelmessig tilgangsgjennomgang",
    ],
    mitigations: [
      "DLP", "USB-kontroll", "CASB", "Data classification", "Tilgangsstyring"
    ],
    relevantFlags: ["health_data", "patient_identifiable", "high_confidentiality"],
    exposureMultiplier: { internet: 1.2, helsenett: 1.0, internal: 1.0 },
    mitigationEffect: { probabilityReduction: 1, consequenceReduction: 1 },
  },

  // 6. DDoS
  {
    id: "ddos",
    category: "Tjenestenekt",
    name: "DDoS-angrep",
    description: "Distribuert tjenestenektangrep som overbelaster systemer",
    vulnerabilityDescription: "Internett-eksponerte tjenester uten tilstrekkelig beskyttelse kan overbelastes av distribuerte angrep.",
    consequenceDescription: "Kritiske helsetjenester blir utilgjengelige. Pasientbehandling kan forsinkes eller stoppes.",
    technicalDetails: "DDoS-as-a-service fra $20/time. Angrep på 1+ Tbps observert. Applikasjonslagsangrep (L7) vanskeligere å stoppe.",
    ciaImpact: { confidentiality: false, integrity: false, availability: true },
    baseProbability: 3,
    baseConsequence: 2,
    probabilityFactors: ["Internett-eksponert", "Kritisk helsetjeneste", "Politisk sensitivt", "Manglende DDoS-beskyttelse"],
    consequenceFactors: ["Pasientbehandling påvirkes", "Ingen redundans", "Lang gjenopprettingstid"],
    existingMeasures: [
      "Brannmur med rate limiting",
      "ISP-varsling ved angrep",
      "Redundant internettlinje",
    ],
    additionalMeasures: [
      "Dedikert DDoS-beskyttelse (Cloudflare, Akamai, Azure)",
      "Web Application Firewall (WAF)",
      "Auto-skalering av infrastruktur",
      "Anycast DNS",
      "DDoS-responsplan med ISP",
      "Kommunikasjonsplan for nedetid",
    ],
    mitigations: [
      "DDoS-beskyttelse", "WAF", "Auto-skalering", "Responsplan"
    ],
    relevantFlags: ["internet", "critical_system", "public_facing"],
    exposureMultiplier: { internet: 1.5, helsenett: 0.4, internal: 0.1 },
    mitigationEffect: { probabilityReduction: 2, consequenceReduction: 1 },
  },

  // 7. Sårbarhetsutnyttelse
  {
    id: "vulnerability_exploitation",
    category: "Sårbarhetsutnyttelse",
    name: "Utnyttelse av kjente sårbarheter",
    description: "Angrep via upatchede systemer og publiserte CVE-er",
    vulnerabilityDescription: "Systemer med kjente, upatchede sårbarheter eksponert mot nettverk. Treg patchingprosess.",
    consequenceDescription: "Full systemkompromittering mulig. Kan føre til videre angrep i nettverket.",
    technicalDetails: "Median tid fra CVE til exploit: 7 dager. CISA KEV-katalogen viser aktivt utnyttede sårbarheter. Kritiske VPN-sårbarheter (Fortinet, Ivanti) utnyttes timer etter publisering.",
    ciaImpact: { confidentiality: true, integrity: true, availability: true },
    baseProbability: 3,
    baseConsequence: 3,
    probabilityFactors: ["Treg patching (>30 dager)", "Legacy-systemer", "Internett-eksponert", "Manglende sårbarhetsskanning"],
    consequenceFactors: ["Kritisk system", "Lateral movement mulig", "Ingen segmentering"],
    existingMeasures: [
      "Månedlig patching",
      "Antivirus oppdatert",
      "Brannmur på plass",
    ],
    additionalMeasures: [
      "Kontinuerlig sårbarhetsskanning (ukentlig)",
      "Patching SLA (kritisk: 24-72t, høy: 7 dager)",
      "Virtual patching via WAF/IPS",
      "Nettverkssegmentering",
      "CISA KEV-overvåking",
      "Penetrasjonstesting årlig",
    ],
    mitigations: [
      "Sårbarhetsskanning", "Rask patching", "Virtual patching", "Segmentering", "Pen-test"
    ],
    relevantFlags: ["internet", "critical_infrastructure", "health_data"],
    exposureMultiplier: { internet: 1.5, helsenett: 1.0, internal: 0.5 },
    mitigationEffect: { probabilityReduction: 2, consequenceReduction: 1 },
  },

  // 8. Innsidertrussel
  {
    id: "insider_threat",
    category: "Innsidertrussel",
    name: "Ondsinnet eller uaktsom innsider",
    description: "Ansatte som bevisst eller ubevisst forårsaker sikkerhetshendelse",
    vulnerabilityDescription: "Ansatte med bred tilgang, utilstrekkelig logging, eller manglende kontroller kan misbruke tilgang.",
    consequenceDescription: "Datatyveri, sabotasje, eller utilsiktet eksponering av sensitive data.",
    technicalDetails: "34% av databrudd involverer innsidere (Verizon DBIR). Helsepersonell trenger bred tilgang for å utføre jobben, noe som øker risikoen.",
    ciaImpact: { confidentiality: true, integrity: true, availability: true },
    baseProbability: 2,
    baseConsequence: 2,
    probabilityFactors: ["Bred tilgang", "Manglende logging", "Utilfredse ansatte", "Ingen UEBA"],
    consequenceFactors: ["Tilgang til mange pasienter", "Administrative rettigheter", "Manglende segmentering"],
    existingMeasures: [
      "Tilgangsstyring basert på rolle",
      "Logging av systemtilgang",
      "Arbeidsreglement",
    ],
    additionalMeasures: [
      "User Entity Behavior Analytics (UEBA)",
      "Prinsipp om minste privilegium",
      "Logging av all datatilgang med varsling",
      "Regelmessig tilgangsgjennomgang",
      "Strukturert offboarding-prosess",
      "Bakgrunnssjekk ved ansettelse",
    ],
    mitigations: [
      "UEBA", "Minste privilegium", "Logging", "Tilgangsgjennomgang", "Offboarding"
    ],
    relevantFlags: ["health_data", "patient_identifiable"],
    exposureMultiplier: { internet: 1.0, helsenett: 1.0, internal: 1.0 },
    mitigationEffect: { probabilityReduction: 1, consequenceReduction: 1 },
  },

  // 9. Medisinsk utstyr
  {
    id: "medical_device",
    category: "Medisinsk utstyr",
    name: "Kompromittert medisinsk utstyr (IoMT)",
    description: "Angrep mot nettverkstilkoblet medisinsk utstyr",
    vulnerabilityDescription: "Medisinsk utstyr med begrenset sikkerhetsfunksjonalitet, lang livssyklus, og sjelden oppdatering eksponert på nettverk.",
    consequenceDescription: "Utstyrssvikt kan påvirke pasientbehandling. Dataeksfiltrering fra enheter. Springbrett til videre angrep.",
    technicalDetails: "53% av IoMT-enheter har kjente sårbarheter. Infusjonspumper, MR-maskiner, pacemakere har vist sårbarheter. FDA-varsler om IoMT-sikkerhet øker.",
    ciaImpact: { confidentiality: true, integrity: true, availability: true },
    baseProbability: 2,
    baseConsequence: 3,
    probabilityFactors: ["Mange IoMT-enheter", "Flat nettverksstruktur", "Legacy-utstyr", "Manglende inventar"],
    consequenceFactors: ["Livsopprettholdende utstyr", "Pasientdata på enheten", "Mange pasienter påvirkes"],
    existingMeasures: [
      "Utstyrsinventar delvis på plass",
      "Vedlikeholdsavtaler",
      "Nettverksovervåking",
    ],
    additionalMeasures: [
      "Dedikert IoMT-nettverk (VLAN-segmentering)",
      "Komplett IoMT-inventar med sårbarhetsinfo",
      "Sikkerhetskrav i anskaffelser",
      "Passiv nettverksovervåking (NAC)",
      "Leverandørkrav til sikkerhet og patching",
      "Risikovurdering før tilkobling",
    ],
    mitigations: [
      "Segmentering", "IoMT-inventar", "Sikkerhetskrav", "NAC", "Risikovurdering"
    ],
    relevantFlags: ["critical_system", "health_data", "patient_identifiable"],
    exposureMultiplier: { internet: 1.3, helsenett: 1.1, internal: 0.9 },
    mitigationEffect: { probabilityReduction: 1, consequenceReduction: 1 },
  },

  // 10. Backup-svikt
  {
    id: "backup_failure",
    category: "Kontinuitet",
    name: "Backup-svikt ved hendelse",
    description: "Backup er utilgjengelig, inkomplett, eller korrupt ved behov for gjenoppretting",
    vulnerabilityDescription: "Backup på samme nettverk som produksjon, manglende testing, eller for lange intervaller gjør backup sårbar.",
    consequenceDescription: "Permanent datatap ved ransomware eller systemfeil. Langvarig nedetid. Kan true virksomhetens eksistens.",
    technicalDetails: "Ransomware målretter aktivt backup-systemer. 37% av gjenopprettingsforsøk feiler. RTO/RPO ofte ikke testet under reelle forhold.",
    ciaImpact: { confidentiality: false, integrity: true, availability: true },
    baseProbability: 2,
    baseConsequence: 3,
    probabilityFactors: ["Backup på samme nettverk", "Manglende testing", "Lange backup-intervaller", "Ingen immutable backup"],
    consequenceFactors: ["Kritisk system", "Mye data", "Lang akseptabel nedetid"],
    existingMeasures: [
      "Daglig backup kjører",
      "Backup til ekstern lokasjon",
      "Backup-monitorering",
    ],
    additionalMeasures: [
      "3-2-1-1 backup-strategi (inkl. immutable)",
      "Offline/air-gapped backup",
      "Kvartalsvis gjenopprettingstesting",
      "Dokumentert RTO/RPO per system",
      "Ransomware-resistent backup-løsning",
      "Kryptert backup med separat nøkkelhåndtering",
    ],
    mitigations: [
      "3-2-1-1 backup", "Immutable backup", "Testing", "RTO/RPO", "Offline backup"
    ],
    relevantFlags: ["critical_system", "health_data"],
    exposureMultiplier: { internet: 1.0, helsenett: 1.0, internal: 1.0 },
    mitigationEffect: { probabilityReduction: 2, consequenceReduction: 1 },
  },

  // 11. API-sikkerhet
  {
    id: "api_security",
    category: "Applikasjonssikkerhet",
    name: "API-sårbarheter og misbruk",
    description: "Utnyttelse av usikre eller feilkonfigurerte API-er",
    vulnerabilityDescription: "Manglende autentisering, autorisasjon, eller rate limiting på API-endepunkter. Eksponering av sensitive data.",
    consequenceDescription: "Massiv datahøsting, uautorisert tilgang til funksjoner, eller tjenestenekt.",
    technicalDetails: "OWASP API Security Top 10. Broken Object Level Authorization (BOLA) er vanligste sårbarhet. Helse-API-er (FHIR, HL7) krever spesiell sikring.",
    ciaImpact: { confidentiality: true, integrity: true, availability: true },
    baseProbability: 3,
    baseConsequence: 2,
    probabilityFactors: ["Mange API-er", "Manglende API-gateway", "Ingen rate limiting", "Legacy-API-er"],
    consequenceFactors: ["API-er eksponerer pasientdata", "Integrasjon med kritiske systemer"],
    existingMeasures: [
      "API-autentisering (API-nøkler)",
      "HTTPS påkrevd",
      "Grunnleggende logging",
    ],
    additionalMeasures: [
      "API Gateway med autentisering og rate limiting",
      "OAuth 2.0/OIDC for autorisasjon",
      "API-spesifikk WAF-beskyttelse",
      "Regelmessig API-sikkerhetstesting",
      "API-inventar og dokumentasjon",
      "Versjonering og deprecation-policy",
    ],
    mitigations: [
      "API Gateway", "OAuth 2.0", "WAF", "API-testing", "Inventar"
    ],
    relevantFlags: ["internet", "helsenett", "health_data", "extensive_integration"],
    exposureMultiplier: { internet: 1.4, helsenett: 1.2, internal: 0.7 },
    mitigationEffect: { probabilityReduction: 2, consequenceReduction: 1 },
  },

  // 12. Cloud-feilkonfigurasjon
  {
    id: "cloud_misconfiguration",
    category: "Skysikkerhet",
    name: "Feilkonfigurert skytjeneste",
    description: "Sensitiv data eksponert gjennom feilkonfigurerte skytjenester",
    vulnerabilityDescription: "Åpne S3-buckets, feilkonfigurerte tilganger, eller manglende kryptering i skytjenester.",
    consequenceDescription: "Offentlig eksponering av sensitive data. Brudd på GDPR og Normen. Betydelig omdømmeskade.",
    technicalDetails: "Skyfeilkonfigurasjon er involvert i 15% av databrudd. Azure, AWS og GCP har komplekse tilgangsmodeller som ofte feilkonfigureres.",
    ciaImpact: { confidentiality: true, integrity: false, availability: false },
    baseProbability: 2,
    baseConsequence: 3,
    probabilityFactors: ["Mye skybruk", "Kompleks konfigurasjon", "Manglende sky-kompetanse", "Ingen CSPM"],
    consequenceFactors: ["Helseopplysninger i sky", "Mange tjenester", "Offentlig eksponert"],
    existingMeasures: [
      "Grunnleggende IAM-konfigurasjon",
      "Kryptering aktivert",
      "Noe logging",
    ],
    additionalMeasures: [
      "Cloud Security Posture Management (CSPM)",
      "Infrastructure as Code med sikkerhetsskanning",
      "Minste privilegium IAM-policy",
      "Regelmessig konfigurasjonsgjennnomgang",
      "Cloud Access Security Broker (CASB)",
      "Automatisert compliance-sjekking",
    ],
    mitigations: [
      "CSPM", "IaC-sikkerhet", "IAM-review", "CASB", "Compliance-sjekk"
    ],
    relevantFlags: ["health_data", "internet", "high_confidentiality"],
    exposureMultiplier: { internet: 1.3, helsenett: 0.8, internal: 0.5 },
    mitigationEffect: { probabilityReduction: 2, consequenceReduction: 1 },
  },

  // 13. Manglende logging/deteksjon
  {
    id: "detection_gap",
    category: "Deteksjon",
    name: "Manglende logging og deteksjonsevne",
    description: "Sikkerhetshendelser oppdages ikke eller for sent",
    vulnerabilityDescription: "Utilstrekkelig logging, ingen sentral logganalyse (SIEM), eller manglende varsling ved anomalier.",
    consequenceDescription: "Angripere opererer uoppdaget over lang tid. Større skadeomfang. Vanskelig etterforskning.",
    technicalDetails: "Gjennomsnittlig tid til oppdagelse (MTTD): 207 dager. Angrep oppdages ofte av eksterne parter. Log4j-lignende sårbarheter krever rask deteksjon.",
    ciaImpact: { confidentiality: true, integrity: true, availability: true },
    baseProbability: 3,
    baseConsequence: 2,
    probabilityFactors: ["Ingen SIEM/SOAR", "Begrenset logging", "Ingen 24/7 overvåking", "For mange varsler (alert fatigue)"],
    consequenceFactors: ["Kritiske systemer", "Sensitive data", "Regulatoriske krav til logging"],
    existingMeasures: [
      "Lokal logging på systemer",
      "Brannmurlogging",
      "Manuell gjennomgang ved hendelser",
    ],
    additionalMeasures: [
      "Sentral SIEM-løsning med korrelering",
      "SOAR for automatisert respons",
      "24/7 SOC (intern eller managed)",
      "Use cases for helsespesifikke trusler",
      "Threat hunting-kapasitet",
      "Regelmessig logganalyse-review",
    ],
    mitigations: [
      "SIEM", "SOAR", "SOC", "Threat hunting", "Use cases"
    ],
    relevantFlags: ["health_data", "critical_system", "critical_infrastructure"],
    exposureMultiplier: { internet: 1.2, helsenett: 1.1, internal: 1.0 },
    mitigationEffect: { probabilityReduction: 1, consequenceReduction: 1 },
  },

  // 14. Fysisk sikkerhet
  {
    id: "physical_security",
    category: "Fysisk sikkerhet",
    name: "Fysisk tilgang til kritisk infrastruktur",
    description: "Uautorisert fysisk tilgang til serverrom, nettverksutstyr, eller klienter",
    vulnerabilityDescription: "Mangelfull adgangskontroll, ingen logging av fysisk tilgang, eller usikrede enheter.",
    consequenceDescription: "Direkte tilgang til systemer omgår mange logiske kontroller. Datatyveri eller sabotasje.",
    technicalDetails: "USB Rubber Ducky, Raspberry Pi implants, eller direkte disktilgang kan kompromittere systemer raskt. Sosial manipulering for fysisk tilgang er effektivt.",
    ciaImpact: { confidentiality: true, integrity: true, availability: true },
    baseProbability: 2,
    baseConsequence: 2,
    probabilityFactors: ["Mange lokasjoner", "Besøkende med tilgang", "Manglende adgangskontroll"],
    consequenceFactors: ["Serverrom tilgjengelig", "Ukrypterte disker", "USB tillatt"],
    existingMeasures: [
      "Låste serverrom",
      "Besøksregistrering",
      "Adgangskort-system",
    ],
    additionalMeasures: [
      "Logging av all fysisk tilgang til kritiske områder",
      "Video-overvåking med oppbevaring",
      "Disk-kryptering (BitLocker/FileVault)",
      "USB-port blokkering",
      "Besøkspolicy med eskortekrav",
      "Regelmessig fysisk sikkerhetsgjennomgang",
    ],
    mitigations: [
      "Adgangslogging", "Video", "Disk-kryptering", "USB-blokkering", "Besøkspolicy"
    ],
    relevantFlags: ["critical_infrastructure", "health_data"],
    exposureMultiplier: { internet: 0.8, helsenett: 1.0, internal: 1.2 },
    mitigationEffect: { probabilityReduction: 1, consequenceReduction: 1 },
  },

  // 15. Tredjeparts skyrisiko
  {
    id: "third_party_cloud",
    category: "Tredjeparts risiko",
    name: "Hendelse hos skyleverandør",
    description: "Sikkerhetshendelse eller nedetid hos tredjeparts skyleverandør",
    vulnerabilityDescription: "Avhengighet av enkelt skyleverandør uten redundans eller exit-strategi.",
    consequenceDescription: "Utilgjengelighet av kritiske tjenester. Mulig dataeksponering ved leverandørbrudd.",
    technicalDetails: "Microsoft 365, Epic i sky, skybaserte lab-systemer. Store hendelser: Azure AD-nedetid, LastPass-brudd. Viktig med shared responsibility-forståelse.",
    ciaImpact: { confidentiality: true, integrity: false, availability: true },
    baseProbability: 2,
    baseConsequence: 2,
    probabilityFactors: ["Stor skyavhengighet", "Enkeltleverandør", "Kritiske tjenester i sky"],
    consequenceFactors: ["Ingen plan B", "Mye data hos leverandør", "Kritisk for drift"],
    existingMeasures: [
      "SLA-avtaler",
      "Leverandørovervåking",
      "Databehandleravtale",
    ],
    additionalMeasures: [
      "Multi-cloud eller hybrid strategi for kritiske tjenester",
      "Regelmessig leverandørsikkerhetsreview",
      "Exit-strategi og dataportabilitet",
      "Lokal backup av skydata",
      "Hendelsesresponsplan for leverandørnedetid",
      "Shared responsibility-dokumentasjon",
    ],
    mitigations: [
      "Multi-cloud", "Exit-strategi", "Lokal backup", "Leverandør-review", "Hendelsesplan"
    ],
    relevantFlags: ["critical_system", "health_data"],
    exposureMultiplier: { internet: 1.1, helsenett: 1.0, internal: 0.8 },
    mitigationEffect: { probabilityReduction: 1, consequenceReduction: 1 },
  },

  // ===== NYE SCENARIOER - HELSESPESIFIKKE =====

  // 16. EPJ-kompromittering
  {
    id: "epj_compromise",
    category: "Helsesystemer",
    name: "Kompromittert EPJ-system",
    description: "Elektronisk pasientjournal kompromitteres eller manipuleres",
    vulnerabilityDescription: "EPJ-systemer med kompleks integrasjonsarkitektur, mange brukere, og lange livssykluser. Ofte basert på eldre teknologi.",
    consequenceDescription: "Feil pasientinformasjon kan føre til feilbehandling. Massiv datalekkasje av sensitive helseopplysninger. Total driftsstans.",
    technicalDetails: "EPJ-systemer (DIPS, MetaVision, Helseplattformen) er kritiske knutepunkter. Integrasjoner mot lab, radiologi, legemiddel. HL7/FHIR-grensesnitt må sikres.",
    ciaImpact: { confidentiality: true, integrity: true, availability: true },
    baseProbability: 2,
    baseConsequence: 3,
    probabilityFactors: ["Kompleks integrasjonsarkitektur", "Mange brukere", "Legacy-komponenter", "Eksponert mot Helsenett"],
    consequenceFactors: ["All pasientbehandling avhenger av EPJ", "Juridisk dokumentasjon", "Kritisk for pasientsikkerhet"],
    existingMeasures: [
      "Rollebasert tilgangsstyring",
      "Logging av all tilgang",
      "Redundant infrastruktur",
      "Databehandleravtale med leverandør",
    ],
    additionalMeasures: [
      "Segmentering av EPJ-infrastruktur",
      "Applikasjonsspesifikk WAF",
      "Kontinuerlig sårbarhetsskanning",
      "Penetrasjonstesting årlig",
      "Anomalideteksjon på bruksmønster",
      "Dokumentert nedetidsprosedyre",
    ],
    mitigations: [
      "Segmentering", "WAF", "Sårbarhetsskanning", "Pen-test", "Anomalideteksjon", "Nedetidsprosedyre"
    ],
    relevantFlags: ["health_data", "critical_system", "patient_identifiable"],
    exposureMultiplier: { internet: 1.4, helsenett: 1.2, internal: 0.8 },
    mitigationEffect: { probabilityReduction: 1, consequenceReduction: 1 },
  },

  // 17. Legemiddelsystemsvikt
  {
    id: "medication_system",
    category: "Helsesystemer",
    name: "Svikt i legemiddelsystem",
    description: "Kompromittering eller feil i systemer for legemiddelhåndtering",
    vulnerabilityDescription: "Integrasjon mellom EPJ, apotek, og infusjonspumper. Kompleks logikk for dosering og interaksjonssjekk.",
    consequenceDescription: "Feil dosering kan være livstruende. Manglende interaksjonsvarsel. Feilmedisinering ved identitetsfeil.",
    technicalDetails: "FEST, eResept, kurveløsninger. Automatiske infusjonspumper styrt av nettverk. Barcode-verifisering ved administrering.",
    ciaImpact: { confidentiality: false, integrity: true, availability: true },
    baseProbability: 2,
    baseConsequence: 3,
    probabilityFactors: ["Kompleks systemintegrasjon", "Nettverkstilkoblet utstyr", "Mange manuelle prosesser"],
    consequenceFactors: ["Direkte pasientpåvirkning", "Livsfarlige feil mulig", "Regulatoriske konsekvenser"],
    existingMeasures: [
      "Dobbeltsjekk-rutiner",
      "Interaksjonsvarsel i system",
      "Logging av all ordinering",
    ],
    additionalMeasures: [
      "Redundant interaksjonssjekk",
      "Segmentering av infusjonspumper",
      "Automatisert integritetssjekk",
      "Backup-prosedyrer for manuell drift",
      "Regelmessig testing av varsler",
      "Opplæring i fallback-prosedyrer",
    ],
    mitigations: [
      "Redundans", "Segmentering", "Integritetssjekk", "Backup-prosedyrer", "Testing"
    ],
    relevantFlags: ["health_data", "critical_system"],
    exposureMultiplier: { internet: 1.0, helsenett: 1.1, internal: 1.0 },
    mitigationEffect: { probabilityReduction: 1, consequenceReduction: 1 },
  },

  // 18. Labsystemfeil
  {
    id: "lab_system",
    category: "Helsesystemer",
    name: "Kompromittert laboratoriesystem",
    description: "Angrep eller feil i laboratorieinformasjonssystem (LIS)",
    vulnerabilityDescription: "LIS-systemer med integrasjon mot analyseinstrumenter, EPJ, og eksterne laboratorier. Ofte eldre systemer.",
    consequenceDescription: "Feil prøvesvar kan føre til feildiagnose. Forsinkede svar påvirker behandling. Datamanipulering kan gå uoppdaget.",
    technicalDetails: "Integrasjon via HL7/ASTM. Instrumenter med begrenset sikkerhet. Krav til sporbarhet og akkreditering (ISO 15189).",
    ciaImpact: { confidentiality: true, integrity: true, availability: true },
    baseProbability: 2,
    baseConsequence: 3,
    probabilityFactors: ["Legacy-instrumenter", "Mange integrasjoner", "Begrenset sikkerhetsoppdatering"],
    consequenceFactors: ["Feildiagnose mulig", "Akkrediteringskrav", "Forsinkelser i behandling"],
    existingMeasures: [
      "Kvalitetskontroll av prøvesvar",
      "Autovalidering med regler",
      "Logging av endringer",
    ],
    additionalMeasures: [
      "Segmentering av lab-nettverk",
      "Integritetsovervåking av prøvesvar",
      "Redundant kommunikasjon til EPJ",
      "Manuell backup-prosedyre",
      "Anomalideteksjon på svardata",
      "Regelmessig sikkerhetsgjennomgang",
    ],
    mitigations: [
      "Segmentering", "Integritetsovervåking", "Redundans", "Backup-prosedyre", "Anomalideteksjon"
    ],
    relevantFlags: ["health_data", "critical_system"],
    exposureMultiplier: { internet: 1.0, helsenett: 1.1, internal: 0.9 },
    mitigationEffect: { probabilityReduction: 1, consequenceReduction: 1 },
  },

  // 19. Bildesystem (RIS/PACS)
  {
    id: "imaging_system",
    category: "Helsesystemer",
    name: "Kompromittert bildediagnostikk (RIS/PACS)",
    description: "Angrep på radiologi-informasjonssystem eller bildearkiv",
    vulnerabilityDescription: "PACS-systemer med store datamengder, DICOM-protokoll med kjente svakheter, og mange integrasjoner.",
    consequenceDescription: "Tap av bilder forsinker diagnose. Manipulerte bilder kan føre til feilbehandling. Stor datamengde attraktiv for utpressing.",
    technicalDetails: "DICOM-protokoll, ofte uten kryptering. Store lagringsvolumer. AI-integrasjon for bildediagnose. Teleradiologi-tilgang.",
    ciaImpact: { confidentiality: true, integrity: true, availability: true },
    baseProbability: 2,
    baseConsequence: 3,
    probabilityFactors: ["DICOM-svakheter", "Store datamengder", "Ekstern tilgang for teleradiologi"],
    consequenceFactors: ["Forsinket diagnose", "Mange pasienter", "Kreftdiagnostikk kritisk"],
    existingMeasures: [
      "PACS-arkivering",
      "Tilgangsstyring",
      "Backup av bilder",
    ],
    additionalMeasures: [
      "DICOM-kryptering (TLS)",
      "Segmentering av modaliteter",
      "Integritetssjekk på bilder",
      "Sikker teleradiologi-løsning",
      "Regelmessig testing av gjenoppretting",
      "Redundant arkivering",
    ],
    mitigations: [
      "DICOM TLS", "Segmentering", "Integritetssjekk", "Sikker fjernaksess", "Redundant arkiv"
    ],
    relevantFlags: ["health_data", "critical_system", "patient_identifiable"],
    exposureMultiplier: { internet: 1.3, helsenett: 1.1, internal: 0.8 },
    mitigationEffect: { probabilityReduction: 1, consequenceReduction: 1 },
  },

  // 20. Identitetsfeil
  {
    id: "patient_identity",
    category: "Pasientsikkerhet",
    name: "Pasientidentitetsfeil",
    description: "Feil pasient kobles til feil data grunnet systemfeil eller manipulering",
    vulnerabilityDescription: "Kompleks identitetshåndtering på tvers av systemer. Manuelle prosesser. Felles pasienter mellom virksomheter.",
    consequenceDescription: "Feil pasient får feil behandling. Journalsammenblanding. Alvorlige pasientskader mulig.",
    technicalDetails: "Personidentifikator (fødselsnummer) som nøkkel. Integrasjon mot Folkeregisteret. D-nummer og hjelpenummer-problematikk.",
    ciaImpact: { confidentiality: true, integrity: true, availability: false },
    baseProbability: 2,
    baseConsequence: 3,
    probabilityFactors: ["Mange integrasjoner", "Manuelle registreringer", "Delt data mellom virksomheter"],
    consequenceFactors: ["Direkte pasientskade mulig", "Juridisk ansvar", "Tillitsbrudd"],
    existingMeasures: [
      "Fødselsnummer-validering",
      "Dobbeltsjekk ved kritiske prosedyrer",
      "Fotoverifikasjon",
    ],
    additionalMeasures: [
      "Automatisert identitetsmatch-varsel",
      "Biometrisk identifikasjon for kritiske prosedyrer",
      "Integritetssjekk på pasientkobling",
      "Logging av alle identitetsoppslag",
      "Regelmessig duplikatsjekk",
      "Opplæring i identifikasjonsprosedyrer",
    ],
    mitigations: [
      "Automatisk varsel", "Biometri", "Integritetssjekk", "Logging", "Duplikatsjekk"
    ],
    relevantFlags: ["health_data", "patient_identifiable", "critical_system"],
    exposureMultiplier: { internet: 1.0, helsenett: 1.0, internal: 1.0 },
    mitigationEffect: { probabilityReduction: 1, consequenceReduction: 1 },
  },

  // ===== COMPLIANCE OG REGULATORISK =====

  // 21. GDPR-brudd
  {
    id: "gdpr_violation",
    category: "Compliance",
    name: "Brudd på personvernforordningen (GDPR)",
    description: "Behandling av personopplysninger i strid med GDPR/personopplysningsloven",
    vulnerabilityDescription: "Manglende oversikt over databehandling. Utilstrekkelig samtykke. Feil rettslig grunnlag. Manglende DPIA.",
    consequenceDescription: "Bøter opptil 4% av omsetning eller 20M EUR. Omdømmeskade. Pålegg om stans. Erstatningskrav fra registrerte.",
    technicalDetails: "GDPR Art. 5-11 (prinsipper), Art. 12-23 (rettigheter), Art. 24-43 (ansvar). Schrems II for overføring til tredjeland.",
    ciaImpact: { confidentiality: true, integrity: false, availability: false },
    baseProbability: 3,
    baseConsequence: 2,
    probabilityFactors: ["Manglende oversikt", "Kompleks dataflyt", "Tredjelandsoverføring", "Manglende DPIA"],
    consequenceFactors: ["Mange registrerte", "Sensitive kategorier (helse)", "Tidligere påpekninger"],
    existingMeasures: [
      "Personvernerklæring",
      "Behandlingsprotokoll",
      "Databehandleravtaler",
    ],
    additionalMeasures: [
      "Komplett behandlingsoversikt (Art. 30)",
      "DPIA for høyrisiko-behandling",
      "Automatisert innsynsløsning",
      "Privacy by Design i utvikling",
      "Regelmessig compliance-audit",
      "Personvernombud med ressurser",
    ],
    mitigations: [
      "Behandlingsoversikt", "DPIA", "Innsynsløsning", "Privacy by Design", "Compliance-audit"
    ],
    relevantFlags: ["health_data", "patient_identifiable"],
    exposureMultiplier: { internet: 1.2, helsenett: 1.0, internal: 0.9 },
    mitigationEffect: { probabilityReduction: 2, consequenceReduction: 1 },
  },

  // 22. Normen-brudd
  {
    id: "normen_violation",
    category: "Compliance",
    name: "Brudd på Normen for helse-IKT",
    description: "Manglende etterlevelse av Norm for informasjonssikkerhet i helse- og omsorgssektoren",
    vulnerabilityDescription: "Normen er bransjestandard med krav fra Helsedirektoratet. Tilsyn fra Helsetilsynet og Datatilsynet.",
    consequenceDescription: "Tilsynspålegg. Krav om utbedring. Mulig stans av tjenester. Omdømmeskade i sektoren.",
    technicalDetails: "Normen v7.0 (2025). Faktaark for spesifikke krav. Krav til logging, tilgangsstyring, kryptering, risikovurdering.",
    ciaImpact: { confidentiality: true, integrity: true, availability: true },
    baseProbability: 3,
    baseConsequence: 2,
    probabilityFactors: ["Manglende dokumentasjon", "Utdatert risikovurdering", "Manglende tilgangsgjennomgang"],
    consequenceFactors: ["Tilsynsvarsel mottatt", "Kritisk tjeneste", "Mange brukere"],
    existingMeasures: [
      "Sikkerhetspolicy på plass",
      "Årlig risikovurdering",
      "Tilgangsstyring implementert",
    ],
    additionalMeasures: [
      "Gap-analyse mot Normen v7.0",
      "Dokumentert styringssystem",
      "Internrevisjon av sikkerhet",
      "Kontinuerlig compliance-monitorering",
      "Opplæringsprogram for ansatte",
      "Leverandøroppfølging mot Normen",
    ],
    mitigations: [
      "Gap-analyse", "Styringssystem", "Internrevisjon", "Compliance-monitorering", "Opplæring"
    ],
    relevantFlags: ["health_data", "normen_required"],
    exposureMultiplier: { internet: 1.1, helsenett: 1.0, internal: 1.0 },
    mitigationEffect: { probabilityReduction: 2, consequenceReduction: 1 },
  },

  // 23. Digitalsikkerhetsloven-brudd
  {
    id: "digital_security_law",
    category: "Compliance",
    name: "Brudd på Digitalsikkerhetsloven",
    description: "Manglende etterlevelse av Digitalsikkerhetsloven for samfunnsviktige tjenester",
    vulnerabilityDescription: "Ny lov fra oktober 2025 med krav til sikkerhetsstyring, varsling, og tilsyn. Ingen overgangsperiode.",
    consequenceDescription: "Overtredelsesgebyr opptil 25G eller 4% av omsetning (maks 50M NOK). Pålegg fra tilsynsmyndighet.",
    technicalDetails: "Digitalsikkerhetsloven §§ 7-9. Digitalsikkerhetsforskriften §§ 7-13. Krav til sikkerhetsstyringssystem, risikovurdering, varsling.",
    ciaImpact: { confidentiality: true, integrity: true, availability: true },
    baseProbability: 3,
    baseConsequence: 2,
    probabilityFactors: ["Ny regulering", "Komplekse krav", "Kort implementeringstid", "Manglende ressurser"],
    consequenceFactors: ["Samfunnsviktig tjeneste", "Mange brukere", "Kritisk infrastruktur"],
    existingMeasures: [
      "Grunnleggende sikkerhetstiltak",
      "Hendelseshåndtering",
      "Beredskapsplan",
    ],
    additionalMeasures: [
      "Sikkerhetsstyringssystem godkjent av ledelsen",
      "Årlig gjennomgang av styringssystem",
      "24/72/30-dagers varslingsprosedyre",
      "Dokumentert risikovurdering per § 7-8",
      "Tekniske tiltak per § 10",
      "Personellsikkerhet per § 12",
    ],
    mitigations: [
      "Styringssystem", "Varslingsprosedyre", "Risikovurdering", "Tekniske tiltak", "Personellsikkerhet"
    ],
    relevantFlags: ["critical_system", "critical_infrastructure", "digitalsikkerhetsloven_required"],
    exposureMultiplier: { internet: 1.2, helsenett: 1.1, internal: 1.0 },
    mitigationEffect: { probabilityReduction: 2, consequenceReduction: 1 },
  },

  // ===== TEKNISK INFRASTRUKTUR =====

  // 24. Nettverksbrudd
  {
    id: "network_breach",
    category: "Nettverkssikkerhet",
    name: "Nettverksinnbrudd og lateral bevegelse",
    description: "Angriper får tilgang til internt nettverk og beveger seg lateralt",
    vulnerabilityDescription: "Flat nettverksstruktur, manglende segmentering, eller svak intern sikkerhet gjør lateral bevegelse enkelt.",
    consequenceDescription: "Angriper får tilgang til flere systemer. Eskalering til domenekontroller. Full kompromittering av infrastruktur.",
    technicalDetails: "Mimikatz, BloodHound, Cobalt Strike for AD-angrep. Pass-the-hash, Kerberoasting. Gjennomsnittlig 9 dager fra initial tilgang til full kompromittering.",
    ciaImpact: { confidentiality: true, integrity: true, availability: true },
    baseProbability: 3,
    baseConsequence: 3,
    probabilityFactors: ["Flat nettverk", "Legacy-protokoller (SMBv1, LLMNR)", "Manglende EDR", "Delte admin-passord"],
    consequenceFactors: ["AD-dominans", "Mange systemer", "Kritisk infrastruktur"],
    existingMeasures: [
      "Brannmur mellom soner",
      "Antivirus på klienter",
      "Domenekontrollere sikret",
    ],
    additionalMeasures: [
      "Mikrosegmentering",
      "Privileged Access Workstation (PAW)",
      "LAPS for lokal admin",
      "Deaktiver legacy-protokoller",
      "EDR med lateral movement-deteksjon",
      "AD-herding etter Microsoft best practices",
    ],
    mitigations: [
      "Mikrosegmentering", "PAW", "LAPS", "Legacy-deaktivering", "EDR", "AD-herding"
    ],
    relevantFlags: ["critical_infrastructure", "health_data"],
    exposureMultiplier: { internet: 1.3, helsenett: 1.1, internal: 1.0 },
    mitigationEffect: { probabilityReduction: 2, consequenceReduction: 1 },
  },

  // 25. DNS-angrep
  {
    id: "dns_attack",
    category: "Nettverkssikkerhet",
    name: "DNS-angrep og manipulering",
    description: "Angrep mot DNS-infrastruktur eller DNS-basert dataeksfiltrering",
    vulnerabilityDescription: "Intern DNS uten sikkerhet, manglende DNSSEC, eller tillatt DNS-trafikk ut.",
    consequenceDescription: "Omdirigering til falske tjenester. Dataeksfiltrering via DNS-tunneling. Phishing via falske domener.",
    technicalDetails: "DNS tunneling for C2 og eksfiltrering. Homoglyph-domener for phishing. DNS over HTTPS kan omgå sikkerhet.",
    ciaImpact: { confidentiality: true, integrity: true, availability: true },
    baseProbability: 2,
    baseConsequence: 2,
    probabilityFactors: ["Ingen DNS-filtrering", "Tillatt all utgående DNS", "Manglende DNSSEC"],
    consequenceFactors: ["Kritiske tjenester via DNS", "Ingen DNS-logging"],
    existingMeasures: [
      "Intern DNS-server",
      "Brannmur",
      "E-postfiltrering",
    ],
    additionalMeasures: [
      "DNS-filtrering (Cisco Umbrella, Quad9)",
      "Blokkering av direkte DNS ut",
      "DNS-logging og analyse",
      "DNSSEC-validering",
      "DNS over HTTPS-policy",
      "Typosquatting-overvåking",
    ],
    mitigations: [
      "DNS-filtrering", "Utgående blokkering", "DNS-logging", "DNSSEC", "DoH-policy"
    ],
    relevantFlags: ["internet", "health_data"],
    exposureMultiplier: { internet: 1.3, helsenett: 1.0, internal: 0.7 },
    mitigationEffect: { probabilityReduction: 2, consequenceReduction: 1 },
  },

  // 26. Krypteringssvakheter
  {
    id: "crypto_weakness",
    category: "Kryptografi",
    name: "Svak eller feil kryptering",
    description: "Bruk av utdaterte eller feilkonfigurerte krypteringsalgoritmer",
    vulnerabilityDescription: "Legacy-systemer med gammel kryptering, feilkonfigurerte sertifikater, eller manglende kryptering.",
    consequenceDescription: "Sensitiv data kan dekrypteres. Man-in-the-middle mulig. Compliance-brudd (GDPR Art. 32).",
    technicalDetails: "SSL 3.0, TLS 1.0/1.1 sårbare. SHA-1 utfaset. RSA <2048 bit usikkert. Quantum-trusler mot RSA/ECC kommer.",
    ciaImpact: { confidentiality: true, integrity: true, availability: false },
    baseProbability: 2,
    baseConsequence: 2,
    probabilityFactors: ["Legacy-systemer", "Manglende sertifikathåndtering", "Eldre protokoller tillatt"],
    consequenceFactors: ["Helseopplysninger", "Finansielle data", "Autentiseringsdata"],
    existingMeasures: [
      "HTTPS påkrevd",
      "Sertifikater fra CA",
      "TLS aktivert",
    ],
    additionalMeasures: [
      "Minimum TLS 1.2, helst 1.3",
      "Sertifikatmonitorering og automatisk fornyelse",
      "Kryptoinventar og policy",
      "Deaktivering av svake cipher suites",
      "HSM for nøkkelhåndtering",
      "Post-quantum krypto-strategi",
    ],
    mitigations: [
      "TLS 1.3", "Sertifikatmonitorering", "Kryptopolitikk", "Cipher-hardening", "HSM"
    ],
    relevantFlags: ["health_data", "high_confidentiality"],
    exposureMultiplier: { internet: 1.4, helsenett: 1.1, internal: 0.8 },
    mitigationEffect: { probabilityReduction: 2, consequenceReduction: 1 },
  },

  // 27. Virtualisering/Container-angrep
  {
    id: "container_escape",
    category: "Infrastruktur",
    name: "Container/VM-escape og hypervisor-angrep",
    description: "Angriper bryter ut av container eller VM til underliggende infrastruktur",
    vulnerabilityDescription: "Feilkonfigurerte containere, sårbare images, eller hypervisor-sårbarheter.",
    consequenceDescription: "Tilgang til andre containere/VM-er. Kompromittering av hele plattformen. Multi-tenant risiko.",
    technicalDetails: "Container breakout (CVE-2019-5736). VM escape sjeldnere men alvorligere. Kubernetes RBAC-feil. Supply chain via images.",
    ciaImpact: { confidentiality: true, integrity: true, availability: true },
    baseProbability: 2,
    baseConsequence: 3,
    probabilityFactors: ["Kjører containere", "Delt infrastruktur", "Manglende image-skanning"],
    consequenceFactors: ["Multi-tenant", "Kritiske systemer på plattformen"],
    existingMeasures: [
      "Oppdatert container runtime",
      "Ressursbegrensninger",
      "Nettverkspolicy",
    ],
    additionalMeasures: [
      "Container image-skanning (Trivy, Snyk)",
      "Runtime-sikkerhet (Falco)",
      "Pod Security Standards/Policies",
      "Least-privilege service accounts",
      "Network policies per namespace",
      "Regelmessig Kubernetes-sikkerhetsscan",
    ],
    mitigations: [
      "Image-skanning", "Runtime-sikkerhet", "Pod Security", "Least-privilege", "Network policies"
    ],
    relevantFlags: ["critical_infrastructure"],
    exposureMultiplier: { internet: 1.2, helsenett: 1.0, internal: 0.9 },
    mitigationEffect: { probabilityReduction: 2, consequenceReduction: 1 },
  },

  // ===== TILGJENGELIGHET OG KONTINUITET =====

  // 28. Strømbrudd/infrastruktursvikt
  {
    id: "power_failure",
    category: "Fysisk infrastruktur",
    name: "Strømbrudd og infrastruktursvikt",
    description: "Tap av strøm, kjøling, eller annen kritisk infrastruktur",
    vulnerabilityDescription: "Avhengighet av strøm og kjøling uten tilstrekkelig redundans eller reserveløsninger.",
    consequenceDescription: "Systemnedetid. Datatap ved ukontrollert nedstenging. Utstyrsskade. Langvarig gjenoppretting.",
    technicalDetails: "UPS gir 15-30 min. Diesel-aggregat må starte på 10-15 sek. Kjølesvikt kan gi nedetid på timer. Energikriser øker risiko.",
    ciaImpact: { confidentiality: false, integrity: true, availability: true },
    baseProbability: 2,
    baseConsequence: 2,
    probabilityFactors: ["Enkelt strøminntak", "Gammel UPS", "Manglende aggregat-test"],
    consequenceFactors: ["Kritiske systemer", "Lang gjenopprettingstid", "Pasientbehandling påvirkes"],
    existingMeasures: [
      "UPS på kritiske systemer",
      "Diesel-aggregat",
      "Redundant kjøling",
    ],
    additionalMeasures: [
      "Doble strøminntak fra ulike forsyninger",
      "Månedlig aggregat-test med last",
      "Kjøle-redundans N+1",
      "Automatisk failover av tjenester",
      "Dokumentert nedstenging-prioritering",
      "Varslingssystem for infrastruktur",
    ],
    mitigations: [
      "Dual-feed strøm", "Aggregat-testing", "N+1 kjøling", "Automatisk failover", "Nedstengingsprioritering"
    ],
    relevantFlags: ["critical_system", "critical_infrastructure"],
    exposureMultiplier: { internet: 1.0, helsenett: 1.0, internal: 1.0 },
    mitigationEffect: { probabilityReduction: 1, consequenceReduction: 1 },
  },

  // 29. Hendelsesresponsvikt
  {
    id: "incident_response_failure",
    category: "Beredskap",
    name: "Svikt i hendelseshåndtering",
    description: "Organisasjonen klarer ikke håndtere sikkerhetshendelse effektivt",
    vulnerabilityDescription: "Manglende hendelsesresponsplan, utrent personell, eller manglende verktøy for respons.",
    consequenceDescription: "Hendelsen eskalerer. Lengre nedetid. Større datalekkasje. Høyere kostnader.",
    technicalDetails: "NIST Incident Response (IR) rammeverk. Mean Time To Respond (MTTR). Forensisk kapasitet. Kommunikasjonskrise.",
    ciaImpact: { confidentiality: true, integrity: true, availability: true },
    baseProbability: 3,
    baseConsequence: 2,
    probabilityFactors: ["Ingen IR-plan", "Utrent team", "Manglende øvelser", "Ingen 24/7 kapasitet"],
    consequenceFactors: ["Kritiske systemer", "Regulatoriske varlingskrav", "Omdømme"],
    existingMeasures: [
      "Grunnleggende varslingsliste",
      "IT-vaktordning",
      "Loggingskapasitet",
    ],
    additionalMeasures: [
      "Dokumentert IR-plan med playbooks",
      "IR-team med definerte roller",
      "Årlige IR-øvelser (tabletop og teknisk)",
      "Retainer med IR-leverandør",
      "Forensisk verktøy og kompetanse",
      "Kommunikasjonsplan for krise",
    ],
    mitigations: [
      "IR-plan", "IR-team", "Øvelser", "Retainer", "Forensisk kapasitet", "Kommunikasjonsplan"
    ],
    relevantFlags: ["critical_system", "health_data", "critical_infrastructure"],
    exposureMultiplier: { internet: 1.1, helsenett: 1.0, internal: 1.0 },
    mitigationEffect: { probabilityReduction: 1, consequenceReduction: 2 },
  },

  // 30. Avhengighetssvikt (single point of failure)
  {
    id: "single_point_failure",
    category: "Arkitektur",
    name: "Single Point of Failure",
    description: "Kritiske tjenester avhenger av enkeltkomponenter uten redundans",
    vulnerabilityDescription: "Sentrale systemer, nettverkskomponenter, eller ekspertise uten backup eller redundans.",
    consequenceDescription: "Total nedetid ved svikt. Langvarig gjenoppretting. Avhengighet av enkeltpersoner.",
    technicalDetails: "Database-cluster, load balancer, autentiseringstjeneste, DNS. Nøkkelpersonavhengighet.",
    ciaImpact: { confidentiality: false, integrity: false, availability: true },
    baseProbability: 2,
    baseConsequence: 3,
    probabilityFactors: ["Ikke-redundant arkitektur", "Budsjettbegrensninger", "Legacy-systemer"],
    consequenceFactors: ["Mange avhengige systemer", "Lang failover-tid", "Kritisk for drift"],
    existingMeasures: [
      "Noe redundans på nettverk",
      "Daglig backup",
      "Dokumentasjon",
    ],
    additionalMeasures: [
      "SPOF-analyse av alle kritiske tjenester",
      "Høytilgjengelighetsarkitektur (HA) for kritiske komponenter",
      "Aktiv-aktiv eller aktiv-passiv failover",
      "Geografisk redundans for kritiske data",
      "Kompetanseredundans (flere kan systemene)",
      "Regelmessig failover-testing",
    ],
    mitigations: [
      "SPOF-analyse", "HA-arkitektur", "Failover", "Geo-redundans", "Kompetansespredning", "Testing"
    ],
    relevantFlags: ["critical_system", "critical_infrastructure"],
    exposureMultiplier: { internet: 1.0, helsenett: 1.0, internal: 1.0 },
    mitigationEffect: { probabilityReduction: 1, consequenceReduction: 2 },
  },

  // ===== MENNESKELIGE FAKTORER =====

  // 31. Kompetansemangel
  {
    id: "competence_gap",
    category: "Menneskelige faktorer",
    name: "Mangel på sikkerhetskompetanse",
    description: "Utilstrekkelig sikkerhetskompetanse i organisasjonen",
    vulnerabilityDescription: "Få sikkerhetsressurser, manglende opplæring, eller utdatert kompetanse.",
    consequenceDescription: "Sårbarheter overses. Feilkonfigurasjoner. Treg respons på hendelser. Dårlige beslutninger.",
    technicalDetails: "Skills gap i cybersecurity. Konkurranse om talenter. Rask teknologiutvikling. Kompleksitet i moderne trusler.",
    ciaImpact: { confidentiality: true, integrity: true, availability: true },
    baseProbability: 3,
    baseConsequence: 2,
    probabilityFactors: ["Lite sikkerhetsteam", "Høy turnover", "Manglende budsett til kompetanse"],
    consequenceFactors: ["Kritiske systemer", "Kompleks infrastruktur", "Regulatoriske krav"],
    existingMeasures: [
      "IT-personell med noe sikkerhetsansvar",
      "Grunnleggende opplæring",
      "Ekstern bistand ved behov",
    ],
    additionalMeasures: [
      "Dedikert sikkerhetspersonell",
      "Sertifiseringsprogram (CISSP, CISM, etc.)",
      "Regelmessig faglig oppdatering",
      "Managed Security Service Provider (MSSP)",
      "Security Champions i utviklingsteam",
      "Tabletop-øvelser for kompetansebygging",
    ],
    mitigations: [
      "Dedikerte ressurser", "Sertifisering", "Faglig oppdatering", "MSSP", "Security Champions"
    ],
    relevantFlags: ["critical_system", "health_data"],
    exposureMultiplier: { internet: 1.1, helsenett: 1.0, internal: 1.0 },
    mitigationEffect: { probabilityReduction: 1, consequenceReduction: 1 },
  },

  // 32. Shadow IT
  {
    id: "shadow_it",
    category: "Menneskelige faktorer",
    name: "Shadow IT og uautoriserte systemer",
    description: "Bruk av IKT-løsninger utenfor IT-avdelingens kontroll",
    vulnerabilityDescription: "Ansatte tar i bruk skytjenester, apper, eller systemer uten godkjenning. Data lagres ukontrollert.",
    consequenceDescription: "Sensitive data i usikrede løsninger. Compliance-brudd. Ingen backup eller sikkerhet.",
    technicalDetails: "Dropbox, Google Drive, WhatsApp for pasientdata. Egne Excel-løsninger. Uautoriserte SaaS-tjenester.",
    ciaImpact: { confidentiality: true, integrity: true, availability: false },
    baseProbability: 3,
    baseConsequence: 2,
    probabilityFactors: ["Tungvinte offisielle løsninger", "Manglende opplæring", "Svak policy-håndhevelse"],
    consequenceFactors: ["Helseopplysninger", "Mange brukere", "GDPR-krav"],
    existingMeasures: [
      "IT-policy",
      "Godkjenningsprosess for nye systemer",
      "Nettverksovervåking",
    ],
    additionalMeasures: [
      "Cloud Access Security Broker (CASB)",
      "SaaS-inventory og kontroll",
      "Brukervennlige godkjente alternativer",
      "Regelmessig Shadow IT-scan",
      "Opplæring i datasikkerhet",
      "Tydelig policy med konsekvenser",
    ],
    mitigations: [
      "CASB", "SaaS-kontroll", "Gode alternativer", "Shadow IT-scan", "Opplæring"
    ],
    relevantFlags: ["health_data", "patient_identifiable"],
    exposureMultiplier: { internet: 1.3, helsenett: 1.0, internal: 0.9 },
    mitigationEffect: { probabilityReduction: 2, consequenceReduction: 1 },
  },

  // 33. Feilkonfigurering av brukere
  {
    id: "user_misconfiguration",
    category: "Menneskelige faktorer",
    name: "Feilkonfigurering og menneskelige feil",
    description: "Sikkerhetshendelser forårsaket av utilsiktede feil fra administratorer eller brukere",
    vulnerabilityDescription: "Komplekse systemer, manglende prosedyrer, eller tidspress fører til feilkonfigurasjoner.",
    consequenceDescription: "Eksponering av data eller systemer. Nedetid. Sikkerhetshull introdusert.",
    technicalDetails: "Feilkonfigurert brannmur, åpne S3-buckets, feil i AD-grupper, publiserte secrets i kode.",
    ciaImpact: { confidentiality: true, integrity: true, availability: true },
    baseProbability: 3,
    baseConsequence: 2,
    probabilityFactors: ["Komplekse systemer", "Manglende 4-øyne prinsipp", "Manuell konfigurasjon"],
    consequenceFactors: ["Kritiske systemer", "Internett-eksponert"],
    existingMeasures: [
      "Endringsrutiner",
      "Dokumentasjon",
      "Testing før produksjon",
    ],
    additionalMeasures: [
      "Infrastructure as Code (IaC) med review",
      "Automatisert konfigurasjonsskanning",
      "Peer review av kritiske endringer",
      "Automatiserte deployment-pipelines",
      "Drift-mot-baseline varsling",
      "Secret scanning i kode",
    ],
    mitigations: [
      "IaC", "Konfigurasjonsskanning", "Peer review", "CI/CD", "Baseline-varsling", "Secret scanning"
    ],
    relevantFlags: ["critical_system", "internet"],
    exposureMultiplier: { internet: 1.3, helsenett: 1.0, internal: 0.9 },
    mitigationEffect: { probabilityReduction: 2, consequenceReduction: 1 },
  },

  // ===== AVANSERTE TRUSLER =====

  // 34. APT (Advanced Persistent Threat)
  {
    id: "apt_attack",
    category: "Avanserte trusler",
    name: "Advanced Persistent Threat (APT)",
    description: "Sofistikert, langvarig angrep fra statlige aktører eller organisert kriminalitet",
    vulnerabilityDescription: "Høyverdi-mål med sensitive data. Begrenset deteksjonskapasitet mot sofistikerte teknikker.",
    consequenceDescription: "Langvarig uoppdaget tilstedeværelse. Massiv dataeksfiltrering. Strategisk etterretning. Sabotasje mulig.",
    technicalDetails: "Zero-days, supply chain, spear phishing. Living-off-the-land teknikker. MITRE ATT&CK framework. Kjente grupper mot helse: Lazarus, APT41.",
    ciaImpact: { confidentiality: true, integrity: true, availability: true },
    baseProbability: 1,
    baseConsequence: 3,
    probabilityFactors: ["Høyverdi-data (forskning, helse)", "Nasjonal interesse", "Svak deteksjon"],
    consequenceFactors: ["Strategiske data", "Kritisk infrastruktur", "Nasjonal sikkerhet"],
    existingMeasures: [
      "Perimetersikkerhet",
      "Antivirus/EDR",
      "Logging",
    ],
    additionalMeasures: [
      "Threat hunting-program",
      "MITRE ATT&CK-basert deteksjon",
      "Deception technology (honeypots)",
      "Network Traffic Analysis (NTA)",
      "Samarbeid med NSM/HelseCERT",
      "Red team/Purple team øvelser",
    ],
    mitigations: [
      "Threat hunting", "ATT&CK-deteksjon", "Deception", "NTA", "Myndighetsamarbeid", "Red team"
    ],
    relevantFlags: ["critical_infrastructure", "health_data", "security_law"],
    exposureMultiplier: { internet: 1.3, helsenett: 1.1, internal: 0.9 },
    mitigationEffect: { probabilityReduction: 1, consequenceReduction: 1 },
  },

  // 35. AI-drevet angrep
  {
    id: "ai_attack",
    category: "Avanserte trusler",
    name: "AI-forsterket cyberangrep",
    description: "Angrep som bruker kunstig intelligens for økt effektivitet",
    vulnerabilityDescription: "Tradisjonelle sikkerhetstiltak kan omgås av AI-optimaliserte angrep. Deepfakes for sosial manipulering.",
    consequenceDescription: "Mer overbevisende phishing. Automatisert sårbarhetsutnyttelse. Adaptiv malware. Deepfake-svindel.",
    technicalDetails: "GPT-generert phishing, AI-polymorf malware, deepfake audio/video for CEO fraud, automatisert OSINT.",
    ciaImpact: { confidentiality: true, integrity: true, availability: true },
    baseProbability: 2,
    baseConsequence: 2,
    probabilityFactors: ["Høyprofilert mål", "Tradisjonelle tiltak kun", "Manglende AI-sikkerhet"],
    consequenceFactors: ["Finansiell eksponering", "Omdømme", "Kritiske beslutninger"],
    existingMeasures: [
      "E-postfiltrering",
      "Sikkerhetsopplæring",
      "Verifikasjonsprosedyrer",
    ],
    additionalMeasures: [
      "AI-basert e-postanalyse",
      "Deepfake-deteksjonsverktøy",
      "Out-of-band verifikasjon for kritiske handlinger",
      "AI Security awareness-opplæring",
      "Kontinuerlig oppdatering av deteksjon",
      "Samarbeid med sikkerhetsforskere",
    ],
    mitigations: [
      "AI-deteksjon", "Deepfake-verktøy", "Out-of-band verifisering", "AI-opplæring", "Oppdatert deteksjon"
    ],
    relevantFlags: ["health_data", "critical_system"],
    exposureMultiplier: { internet: 1.3, helsenett: 1.0, internal: 0.8 },
    mitigationEffect: { probabilityReduction: 1, consequenceReduction: 1 },
  },
]

// Hjelpefunksjon for å sjekke om et svar inneholder en verdi
function answerIncludes(answer: string | string[] | undefined, value: string): boolean {
  if (!answer) return false
  if (Array.isArray(answer)) return answer.includes(value)
  return answer === value
}

// Funksjon for å beregne risiko basert på klassifiseringssvar
export function calculateRiskAssessment(
  answers: Record<string, string | string[]>,
  flags: string[],
  exposure: "internet" | "helsenett" | "internal"
): RiskAssessment[] {
  const assessments: RiskAssessment[] = []

  // Utled implisitte flagg for helsesektoren - de fleste systemer i helse behandler helseopplysninger
  const impliedFlags = new Set(flags)

  // Legg til health_data hvis det sannsynligvis er et helsesystem
  if (flags.includes("normen_required") || flags.includes("patient_identifiable")) {
    impliedFlags.add("health_data")
  }

  // Legg til exposure-relaterte flagg
  if (exposure === "internet") {
    impliedFlags.add("internet")
    impliedFlags.add("public_facing")
  } else if (exposure === "helsenett") {
    impliedFlags.add("helsenett")
  }

  // I helsesektoren er de fleste systemer kritiske på et eller annet nivå
  if (flags.includes("critical_system") || flags.includes("critical_infrastructure")) {
    impliedFlags.add("critical_infrastructure")
    impliedFlags.add("critical_system")
  }

  const allFlags = Array.from(impliedFlags)

  for (const scenario of threatScenarios) {
    // Mer inkluderende relevansvurdering
    // Inkluder scenario hvis:
    // 1. Det ikke har noen spesifikke flagg-krav (alltid relevant)
    // 2. Minst ett av scenariets flagg matcher brukerens flagg/eksponering
    // 3. Scenariet er generelt relevant for helsesektoren (health_data flagg matcher)
    const isRelevant =
      scenario.relevantFlags.length === 0 ||
      scenario.relevantFlags.some(flag =>
        allFlags.includes(flag) ||
        exposure === flag
      ) ||
      // Alltid inkluder scenariene som er universelt relevante i helsesektoren
      scenario.relevantFlags.includes("health_data") ||
      scenario.relevantFlags.includes("critical_system")

    if (!isRelevant) continue

    // Juster sannsynlighet basert på eksponering
    let adjustedProbability = scenario.baseProbability * scenario.exposureMultiplier[exposure]

    // Juster basert på svar (støtter både enkeltvalg og multi-selekt)
    if (answerIncludes(answers["data_type"], "health") || answerIncludes(answers["data_type"], "classified")) {
      adjustedProbability *= 1.2
    }
    if (answerIncludes(answers["integration"], "critical_hub") || answerIncludes(answers["integration"], "extensive")) {
      adjustedProbability *= 1.1
    }
    if (answerIncludes(answers["user_base"], "public") || answerIncludes(answers["user_base"], "patients")) {
      adjustedProbability *= 1.1
    }

    adjustedProbability = Math.min(4, Math.max(1, Math.round(adjustedProbability)))

    // Juster konsekvens
    let adjustedConsequence: number = scenario.baseConsequence

    if (answerIncludes(answers["infrastructure_impact"], "critical")) {
      adjustedConsequence = 3
    } else if (answerIncludes(answers["infrastructure_impact"], "significant") && adjustedConsequence < 3) {
      adjustedConsequence = Math.min(3, adjustedConsequence + 1)
    }

    if (answerIncludes(answers["confidentiality_impact"], "severe") || answerIncludes(answers["confidentiality_impact"], "national")) {
      adjustedConsequence = 3
    }

    if (flags.includes("health_data") || flags.includes("patient_identifiable")) {
      adjustedConsequence = Math.max(adjustedConsequence, 2)
    }

    adjustedConsequence = Math.min(3, Math.max(1, Math.round(adjustedConsequence)))

    // Beregn risikoscore før tiltak
    const riskScore = adjustedProbability * adjustedConsequence

    // Beregn risiko etter tiltak
    const mitigatedProbability = Math.max(1, adjustedProbability - scenario.mitigationEffect.probabilityReduction)
    const mitigatedConsequence = Math.max(1, adjustedConsequence - scenario.mitigationEffect.consequenceReduction)
    const mitigatedRiskScore = mitigatedProbability * mitigatedConsequence

    // Bestem risikonivå
    const getRiskLevel = (score: number): "low" | "medium" | "high" | "critical" => {
      if (score <= 3) return "low"
      if (score <= 6) return "medium"
      if (score <= 9) return "high"
      return "critical"
    }

    assessments.push({
      scenario,
      adjustedProbability,
      adjustedConsequence,
      riskScore,
      riskLevel: getRiskLevel(riskScore),
      mitigatedProbability,
      mitigatedConsequence,
      mitigatedRiskScore,
      mitigatedRiskLevel: getRiskLevel(mitigatedRiskScore),
      applicableExistingMeasures: scenario.existingMeasures,
      applicableAdditionalMeasures: scenario.additionalMeasures,
      applicableMitigations: scenario.mitigations,
    })
  }

  return assessments.sort((a, b) => b.riskScore - a.riskScore)
}

// Funksjon for å generere risikomatrise-data
export function generateRiskMatrix(assessments: RiskAssessment[]): number[][] {
  const matrix: number[][] = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]

  for (const assessment of assessments) {
    const probIndex = assessment.adjustedProbability - 1
    const consIndex = assessment.adjustedConsequence - 1
    if (probIndex >= 0 && probIndex < 4 && consIndex >= 0 && consIndex < 3) {
      matrix[consIndex][probIndex]++
    }
  }

  return matrix
}

// Hjelpefunksjoner for farger
export function getRiskColor(score: number): string {
  if (score <= 3) return "green"
  if (score <= 6) return "yellow"
  if (score <= 9) return "orange"
  return "red"
}

export function getRiskColorClasses(score: number): { bg: string; text: string; border: string } {
  if (score <= 3) {
    return {
      bg: "bg-green-500/20",
      text: "text-green-600 dark:text-green-400",
      border: "border-green-500/50",
    }
  }
  if (score <= 6) {
    return {
      bg: "bg-yellow-500/20",
      text: "text-yellow-600 dark:text-yellow-400",
      border: "border-yellow-500/50",
    }
  }
  if (score <= 9) {
    return {
      bg: "bg-orange-500/20",
      text: "text-orange-600 dark:text-orange-400",
      border: "border-orange-500/50",
    }
  }
  return {
    bg: "bg-red-500/20",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-500/50",
  }
}

export function getCIALabel(cia: CIAImpact): string {
  const parts: string[] = []
  if (cia.confidentiality) parts.push("K")
  if (cia.integrity) parts.push("I")
  if (cia.availability) parts.push("T")
  return parts.join(", ")
}
