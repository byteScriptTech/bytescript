'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';

import { InterviewQuestionsList } from '@/components/interview/InterviewQuestionsList';
import { Button } from '@/components/ui/button';
import { interviewService } from '@/services/interviewService';

interface Question {
  id: string;
  question: string;
  answer: Array<{
    type: string;
    content: string | string[] | { language: string; code: string };
  }>;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  topic: string;
}

export default function InterviewTopicClient() {
  const params = useParams();
  const topicId = params.topicId as string;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage, setQuestionsPerPage] = useState(10);

  // Handle search
  const filteredQuestions = useMemo(() => {
    if (!searchQuery) return questions;
    const query = searchQuery.toLowerCase();
    return questions.filter(
      (q) =>
        q.question.toLowerCase().includes(query) ||
        q.answer.some((a) => {
          if (typeof a.content === 'string') {
            return a.content.toLowerCase().includes(query);
          }
          if (Array.isArray(a.content)) {
            return a.content.some(
              (c) => typeof c === 'string' && c.toLowerCase().includes(query)
            );
          }
          return false;
        })
    );
  }, [questions, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const paginatedQuestions = useMemo(() => {
    const startIndex = (currentPage - 1) * questionsPerPage;
    return filteredQuestions.slice(startIndex, startIndex + questionsPerPage);
  }, [filteredQuestions, currentPage, questionsPerPage]);

  // Reset to first page when questionsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [questionsPerPage]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        console.log(`[DEBUG] Fetching questions for topic: ${topicId}`);
        console.log('[DEBUG] interviewService:', interviewService);

        const questions = await interviewService.getQuestionsByTopic(topicId);
        console.log(
          '[DEBUG] Raw response from getQuestionsByTopic:',
          questions
        );

        if (!questions) {
          console.error('[ERROR] No questions array returned from service');
          setError('Failed to load questions: Invalid response from server');
          return;
        }

        if (questions.length === 0) {
          console.warn(`[WARN] No questions found for topic: ${topicId}`);
          setError(`No questions found for topic: ${topicId}`);
          return;
        }

        console.log(
          `[DEBUG] Successfully loaded ${questions.length} questions`
        );
        setQuestions(questions);
        setSearchQuery('');
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (topicId) {
      fetchQuestions();
    }
  }, [topicId]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle questions per page change
  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuestionsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Format questions for display
  const formatQuestion = (q: Question) => {
    const answerText = q.answer
      .map((a) => {
        if (a.type === 'text' && typeof a.content === 'string') {
          return a.content;
        }
        if (
          a.type === 'code' &&
          a.content &&
          typeof a.content === 'object' &&
          !Array.isArray(a.content) &&
          'code' in a.content
        ) {
          return `\`\`\`${a.content.language || ''}\n${a.content.code}\n\`\`\``;
        }
        if (Array.isArray(a.content)) {
          return a.content.join('\n');
        }
        return '';
      })
      .filter(Boolean)
      .join('\n\n');

    return {
      id: q.id,
      question: q.question,
      answer: answerText,
    };
  };

  // Format all questions for display
  const formattedQuestions = paginatedQuestions.map(formatQuestion);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/interview">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to topics
          </Link>
        </Button>

        <h1 className="text-3xl font-bold mb-6 capitalize">
          {topicId} Interview Questions
        </h1>

        <div className="space-y-6">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {`${filteredQuestions.length} ${filteredQuestions.length === 1 ? 'question' : 'questions'}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>

          <InterviewQuestionsList
            questions={formattedQuestions}
            searchQuery={searchQuery}
          />

          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/interview">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to topics
          </Link>
        </Button>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/interview">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to topics
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-6 capitalize">
        {topicId} Interview Questions
      </h1>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {`${filteredQuestions.length} ${filteredQuestions.length === 1 ? 'question' : 'questions'}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <label
                htmlFor="perPage"
                className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap"
              >
                Show:
              </label>
              <select
                id="perPage"
                value={questionsPerPage}
                onChange={handlePerPageChange}
                className="text-sm border rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-background dark:border-input dark:text-foreground dark:focus:ring-blue-500 w-full sm:w-auto"
              >
                {[5, 10, 15, 20, 25, 50].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-background dark:border-input dark:text-foreground dark:placeholder-muted-foreground"
              />
            </div>
          </div>
        </div>

        <InterviewQuestionsList
          questions={formattedQuestions}
          searchQuery={searchQuery}
        />

        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
