interface Challenge {
  code: string;
  answer: string[];
  level?: string;
  question?: string;
}

interface Example {
  code: string;
  description: string;
}

interface RelatedTopic {
  name: string;
  description: string;
}

interface Topic {
  name: string;
  id: string;
}

interface BestPracticesAndCommonMistakes {
  common_mistakes: string[];
  best_practices: string[];
}

interface Introduction {
  glance: {
    perequisites: string;
    real_world_use_cases: string;
    key_concepts: string;
    objective: string;
  }[];
  text: string;
}

export interface LanguageContent {
  id: string;
  name: string;
  tag: string;
  applications: string[];
  introduction: Introduction;
  explanation: string[];
  examples: Example[];
  challenges: Challenge[];
  best_practices_and_common_mistakes: BestPracticesAndCommonMistakes;
  related_topics: RelatedTopic[];
  topics: Topic[];
}
