export type ExposureType = "internet" | "helsenett"
export type GradingLevel = 1 | 2 | 3 | 4

// Tjenestekritikalitet (tilgjengelighet/drift)
export type ServiceCriticalityLevel = 1 | 2 | 3 | 4

// Informasjonsklassifisering (konfidensialitet)
export type InformationClassificationLevel = 1 | 2 | 3 | 4

export interface Measure {
  id: string
  name: string
  description: string
  legal_basis: string
  required: boolean
  category: "technical" | "organizational"
  status?: "current" | "upcoming" // For å markere kommende krav (NIS2)
  effectiveDate?: string // Når kravet trer i kraft
}

export interface LegalRequirement {
  id: string
  name: string
  source: string
  url: string
  description: string
}

// Tjenestekritikalitet-info
export interface ServiceCriticalityInfo {
  level: ServiceCriticalityLevel
  name: string
  shortName: string
  description: string
  examples: string[]
  legalBasis: string[]
}

// Informasjonsklassifisering-info
export interface InformationClassificationInfo {
  level: InformationClassificationLevel
  name: string
  shortName: string
  description: string
  examples: string[]
  legalBasis: string[]
}

// Legacy - beholdes for bakoverkompatibilitet
export interface GradingInfo {
  level: GradingLevel
  name: string
  description: string
  examples: string[]
  legalBasis: string[]
}

export interface ExposureInfo {
  type: ExposureType
  name: string
  description: string
  riskLevel: string
}
