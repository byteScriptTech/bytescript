'use client';

import type { ComponentProps } from 'react';

import {
  useCreateTopicMutation,
  useUpdateTopicMutation,
} from '@/store/slices/nodejsSlice';
import type { Topic } from '@/types/content';

import { JavaScriptContentForm } from '../javascript/JavaScriptContentForm';

export type NodejsContentFormProps = Omit<
  ComponentProps<typeof JavaScriptContentForm>,
  'service' | 'redirectPath'
>;

type TopicService = {
  createTopic: (data: Omit<Topic, 'id'>) => Promise<Topic>;
  updateTopic: (id: string, data: Partial<Omit<Topic, 'id'>>) => Promise<Topic>;
};

export function NodejsContentForm(props: NodejsContentFormProps) {
  const [createTopic] = useCreateTopicMutation();
  const [updateTopic] = useUpdateTopicMutation();

  const service: TopicService = {
    createTopic: async (data: Omit<Topic, 'id'>) => {
      const result = await createTopic(data).unwrap();
      return result;
    },
    updateTopic: async (id: string, data: Partial<Omit<Topic, 'id'>>) => {
      const result = await updateTopic({ id, topicData: data }).unwrap();
      return result;
    },
  };

  return (
    <JavaScriptContentForm
      {...props}
      service={service}
      redirectPath="/admin/nodejs"
    />
  );
}
