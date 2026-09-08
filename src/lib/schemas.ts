export type TimeOfDay = 'day' | 'night' | 'dusk' | 'dawn';

export type SettingType =
  | 'urban_market'
  | 'heritage_fort'
  | 'rural_village'
  | 'coastal_waterfront'
  | 'natural_landscape'
  | 'modern_city_street'
  | 'religious_temple'
  | 'industrial_zone'
  | 'other';

export type CrowdDensity = 'high' | 'medium' | 'low';

export type SourceAuthority =
  | 'OFFICIAL_GOVERNMENT'
  | 'GOVERNMENT_RELATED'
  | 'REPUTABLE_NEWS'
  | 'GENERAL_WEBSITE'
  | 'UNKNOWN';

export type EvidenceState =
  | 'VERIFIED_EVIDENCE'
  | 'SUPPORTED_EVIDENCE'
  | 'INSUFFICIENT_EVIDENCE'
  | 'CONFLICTING_EVIDENCE';

export type SupportLevel = 'DIRECT' | 'INDIRECT' | 'UNCLEAR';

export type EvidenceCategory =
  | 'permit_rules'
  | 'heritage_restriction'
  | 'municipal_noc'
  | 'night_shooting_rules'
  | 'drone_restrictions'
  | 'access_logistics'
  | 'recent_news';

export type RecommendationStatus =
  | 'RECOMMENDED'
  | 'FEASIBLE_WITH_CONDITIONS'
  | 'HIGH_RISK_NOT_RECOMMENDED';

export interface SceneSpec {
  setting_type: SettingType;
  architectural_style?: string;
  geography_preference?: string;
  time_of_day: TimeOfDay;
  weather_element?: string;
  season?: string;
  crowd_density: CrowdDensity;
  special_requirements: {
    night_shoot: boolean;
    heritage_risk: boolean;
    water_elements: boolean;
    stunt_pyrotechnics: boolean;
    drone_required: boolean;
    heavy_vehicles: boolean;
  };
  search_keywords: string[];
  regional_preference?: string;
}

export interface LocationCandidate {
  id: string;
  name: string;
  district: string;
  state: string;
  description: string;
  visual_match_reasoning: string;
  discovery_sources: Array<{
    title: string;
    url: string;
    snippet: string;
  }>;
}

export interface EvidenceItem {
  id: string;
  claim: string;
  category: EvidenceCategory;
  source_title: string;
  source_url: string;
  source_authority: SourceAuthority;
  snippet: string;
  evidence_excerpt: string;
  support_level: SupportLevel;
  evidence_state: EvidenceState;
  published_date?: string | null;
}

export interface FeasibilityReport {
  candidate_id: string;
  candidate_name: string;
  feasibility_score: number;
  score_breakdown: {
    visual_match: number;
    permit_evidence: number;
    logistics_access: number;
    risk_profile: number;
  };
  total_source_count: number;
  official_source_count: number;
  evidence_state_summary: {
    VERIFIED_EVIDENCE: number;
    SUPPORTED_EVIDENCE: number;
    INSUFFICIENT_EVIDENCE: number;
    CONFLICTING_EVIDENCE: number;
  };
  evidence_items: EvidenceItem[];
  coverage_gaps: string[];
  risk_warnings: string[];
  key_permit_authorities: string[];
  recommendation_status: RecommendationStatus;
  insufficient_evidence_notice?: string;
}

export interface ProducerBrief {
  scene_summary: string;
  ranked_recommendations: FeasibilityReport[];
  recommended_location?: FeasibilityReport;
  global_caveats: string[];
}

export const SCENE_SPEC_SCHEMA = {
  type: 'object',
  properties: {
    setting_type: {
      type: 'string',
      enum: [
        'urban_market',
        'heritage_fort',
        'rural_village',
        'coastal_waterfront',
        'natural_landscape',
        'modern_city_street',
        'religious_temple',
        'industrial_zone',
        'other',
      ],
    },
    architectural_style: { type: 'string' },
    geography_preference: { type: 'string' },
    time_of_day: { type: 'string', enum: ['day', 'night', 'dusk', 'dawn'] },
    weather_element: { type: 'string' },
    season: { type: 'string' },
    crowd_density: { type: 'string', enum: ['high', 'medium', 'low'] },
    special_requirements: {
      type: 'object',
      properties: {
        night_shoot: { type: 'boolean' },
        heritage_risk: { type: 'boolean' },
        water_elements: { type: 'boolean' },
        stunt_pyrotechnics: { type: 'boolean' },
        drone_required: { type: 'boolean' },
        heavy_vehicles: { type: 'boolean' },
      },
      required: [
        'night_shoot',
        'heritage_risk',
        'water_elements',
        'stunt_pyrotechnics',
        'drone_required',
        'heavy_vehicles',
      ],
    },
    search_keywords: { type: 'array', items: { type: 'string' } },
    regional_preference: { type: 'string' },
  },
  required: ['setting_type', 'time_of_day', 'crowd_density', 'special_requirements', 'search_keywords'],
};

export const LOCATION_CANDIDATES_SCHEMA = {
  type: 'object',
  properties: {
    candidates: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          district: { type: 'string' },
          state: { type: 'string' },
          description: { type: 'string' },
          visual_match_reasoning: { type: 'string' },
        },
        required: ['name', 'district', 'state', 'description', 'visual_match_reasoning'],
      },
    },
  },
  required: ['candidates'],
};

export const EVIDENCE_EXTRACTION_SCHEMA = {
  type: 'object',
  properties: {
    evidence_items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          claim: { type: 'string' },
          category: {
            type: 'string',
            enum: [
              'permit_rules',
              'heritage_restriction',
              'municipal_noc',
              'night_shooting_rules',
              'drone_restrictions',
              'access_logistics',
              'recent_news',
            ],
          },
          source_url: { type: 'string' },
          evidence_excerpt: { type: 'string' },
          support_level: {
            type: 'string',
            enum: ['DIRECT', 'INDIRECT', 'UNCLEAR'],
          },
        },
        required: ['claim', 'category', 'source_url', 'evidence_excerpt', 'support_level'],
      },
    },
  },
  required: ['evidence_items'],
};
