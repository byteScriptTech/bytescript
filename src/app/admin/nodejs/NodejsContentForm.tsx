'use client';

import type { ComponentProps } from 'react';

import { nodejsService } from '@/services/nodejsService';

import { JavaScriptContentForm } from '../javascript/JavaScriptContentForm';

export type NodejsContentFormProps = Omit<
  ComponentProps<typeof JavaScriptContentForm>,
  'service' | 'redirectPath'
>;

export function NodejsContentForm(props: NodejsContentFormProps) {
  return (
    <JavaScriptContentForm
      {...props}
      service={nodejsService}
      redirectPath="/admin/nodejs"
    />
  );
}
