interface Challenge {
  code: string;
  answer: string[];
  level?: string;
  question?: string;
}

interface Example {
  code: string;
  description: string;
  language: string;
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
  text: string;
  key_concepts: string;
  objective: string;
  real_world_use_cases: string;
  prerequisites: string;
}

export interface LanguageContent {
  id: string;
  name: string;
  tag: string;
  applications: string[];
  explanation: string[];
  best_practices_and_common_mistakes: BestPracticesAndCommonMistakes;
  related_topics: RelatedTopic[];
  topics: Topic[];
  introduction: Introduction;
  examples: Example[];
  challenges: Challenge[];
}
