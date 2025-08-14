export type Topic = {
  id: string;
  name: string;
};

export interface LearnContentProps {
  currentTopic: Topic | undefined;
  setCurrentTopic: (topic: Topic) => void;
}

export interface ContentProps {
  // Add any props that the Content component expects
  // For example:
  // content?: any;
  // loading?: boolean;
}
