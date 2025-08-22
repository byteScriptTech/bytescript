'use client';

import React, { useMemo } from 'react';

import { QuestionCard } from '@/components/interview/QuestionCard';

import { AnswerSection } from './types';

interface Question {
  id: string;
  question: string;
  answer: string;
  answerArray?: AnswerSection[];
}

interface InterviewQuestionsListProps {
  questions: Question[];
  searchQuery?: string;
}

export function InterviewQuestionsList({
  questions,
  searchQuery = '',
}: InterviewQuestionsListProps) {
  const filteredQuestions = useMemo(() => {
    if (!searchQuery) return questions;
    const query = searchQuery.toLowerCase();

    return questions.filter((q) => {
      // Check if question or answer string matches
      return (
        q.question.toLowerCase().includes(query) ||
        (typeof q.answer === 'string' && q.answer.toLowerCase().includes(query))
      );
    });
  }, [questions, searchQuery]);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"></div>
      <div className="space-y-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q) => (
            <QuestionCard
              key={q.id}
              id={q.id}
              question={q.question}
              answerArray={q.answerArray || []}
            />
          ))
        ) : (
          <div className="text-gray-500 text-center py-8">
            {searchQuery
              ? 'No questions match your search.'
              : 'No questions available for this topic yet.'}
          </div>
        )}
      </div>
    </>
  );
}

export default InterviewQuestionsList;
