'use client';

import { Plus, Loader2, Edit, Trash2 } from 'lucide-react';
import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  ChangeEvent,
  FormEvent,
} from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { practiceTopicsService } from '@/services/firebase/practiceTopicsService';
import {
  useGetAllQuestionsQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} from '@/store/slices/practiceQuestionsSlice';
import type { PracticeTopic } from '@/types/practice';
import { Option } from '@/types/practiceQuestion';
import type { PracticeQuestion, TestCase } from '@/types/practiceQuestion';
import type { QuestionType } from '@/types/practiceQuestion';

export default function AdminPracticeQuestions() {
  const { toast } = useToast();
  const {
    data: questions = [],
    isLoading: questionsLoading,
    refetch,
  } = useGetAllQuestionsQuery();
  const [createQuestion] = useCreateQuestionMutation();
  const [updateQuestion] = useUpdateQuestionMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();

  const [topics, setTopics] = useState<PracticeTopic[]>([]);
  const [loading, setLoading] = useState(true);
  // Combined loading state
  const isLoadingCombined = loading || questionsLoading;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filtered questions based on selected category
  const filteredQuestions = useMemo(() => {
    if (selectedCategory === 'all') return questions;
    return questions.filter((q) => q.topicId === selectedCategory);
  }, [questions, selectedCategory]);

  // Get unique categories from topics
  const categories = useMemo(() => {
    return [
      { id: 'all', name: 'All Categories' },
      ...topics.map((topic) => ({ id: topic.id, name: topic.name })),
    ];
  }, [topics]);

  type QuestionFormData =
    | {
        type: 'mcq';
        question: string;
        points: number;
        topicId: string;
        options: Option[];
        explanation?: string;
      }
    | {
        type: 'coding';
        question: string;
        points: number;
        topicId: string;
        testCases: TestCase[];
        explanation?: string;
        language: string;
        initialCode?: string;
      };

  const [formData, setFormData] = useState<QuestionFormData>({
    type: 'mcq',
    question: '',
    points: 1,
    topicId: '',
    options: [],
    explanation: '',
  });

  // Handle form data updates based on question type
  const updateFormData = useCallback((updates: Partial<QuestionFormData>) => {
    setFormData((prev) => {
      const newData = { ...prev, ...updates };
      // If changing to coding type, ensure testCases exists
      if (updates.type === 'coding' && !('testCases' in newData)) {
        return { ...newData, testCases: [] } as QuestionFormData;
      }
      // If changing to mcq type, ensure options exists
      if (updates.type === 'mcq' && !('options' in newData)) {
        return { ...newData, options: [] } as QuestionFormData;
      }
      return newData as QuestionFormData;
    });
  }, []);

  // Fetch topics (questions come from Redux)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const topicsData = await practiceTopicsService.getAllTopics();
        setTopics(topicsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load practice questions',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateFormData({
      [name]: name === 'points' ? parseInt(value, 10) || 0 : value,
    } as Partial<QuestionFormData>);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.topicId || !formData.question) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    // Prepare the question data based on type
    const questionData: QuestionFormData =
      formData.type === 'mcq'
        ? {
            type: 'mcq',
            question: formData.question,
            points: formData.points,
            topicId: formData.topicId,
            options: formData.options,
            explanation: formData.explanation,
          }
        : {
            type: 'coding',
            question: formData.question,
            points: formData.points,
            topicId: formData.topicId,
            testCases: formData.testCases || [],
            explanation: formData.explanation,
            language: formData.language || 'javascript',
            initialCode: formData.initialCode || '',
          };

    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateQuestion({
          id: editingId,
          updates: questionData,
        }).unwrap();
        toast({
          title: 'Success',
          description: 'Question updated successfully',
        });
      } else {
        // Create new question
        await createQuestion(questionData).unwrap();
        toast({
          title: 'Success',
          description: 'Question created successfully',
        });
      }

      // Refresh questions from Redux
      refetch();
      resetForm();
    } catch (error) {
      console.error('Error saving question:', error);
      toast({
        title: 'Error',
        description: 'Failed to save question',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (question: PracticeQuestion) => {
    setEditingId(question.id);
    updateFormData({
      ...question,
      topicId: question.topicId || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      await deleteQuestion(id).unwrap();
      toast({
        title: 'Success',
        description: 'Question deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete question',
        variant: 'destructive',
      });
    }
  };

  const resetForm = useCallback(() => {
    updateFormData({
      type: 'mcq',
      question: '',
      points: 1,
      topicId: topics[0]?.id || '',
      options: [],
      explanation: '',
    });
    setEditingId(null);
  }, [topics, updateFormData]);

  const renderQuestionForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6 mb-8">
      <h2 className="text-2xl font-bold mb-6">
        {editingId ? 'Edit Question' : 'Add New Question'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="topicId">Topic *</Label>
          <Select
            value={formData.topicId || ''}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, topicId: value }))
            }
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a topic" />
            </SelectTrigger>
            <SelectContent>
              {topics.map((topic) => (
                <SelectItem key={topic.id} value={topic.id}>
                  {topic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Question Type *</Label>
          <Select
            value={formData.type}
            onValueChange={(value: QuestionType) =>
              setFormData((prev) => {
                if (value === 'mcq') {
                  return {
                    type: 'mcq',
                    question: prev.question,
                    points: prev.points,
                    topicId: prev.topicId,
                    explanation: prev.explanation,
                    options:
                      prev.type === 'mcq'
                        ? prev.options
                        : [
                            {
                              id: crypto.randomUUID(),
                              text: '',
                              isCorrect: false,
                            },
                          ],
                  };
                } else {
                  return {
                    type: 'coding',
                    question: prev.question,
                    points: prev.points,
                    topicId: prev.topicId,
                    explanation: prev.explanation,
                    language: 'javascript', // Default language
                    testCases: [],
                    initialCode: '',
                    solution: '',
                  };
                }
              })
            }
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select question type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mcq">Multiple Choice</SelectItem>
              <SelectItem value="coding">Coding</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="points">Points</Label>
          <Input
            type="number"
            id="points"
            name="points"
            value={formData.points || 1}
            onChange={handleInputChange}
            min="1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="question">Question *</Label>
        <Textarea
          id="question"
          name="question"
          value={formData.question || ''}
          onChange={handleInputChange}
          required
          rows={3}
        />
      </div>

      {formData.type === 'mcq' ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Options</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setFormData((prev) => {
                  if (prev.type !== 'mcq') return prev;

                  const newOption = {
                    id: `opt-${Date.now()}`,
                    text: '',
                    isCorrect: false,
                  };
                  return {
                    ...prev,
                    options: [...prev.options, newOption],
                  };
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Option
            </Button>
          </div>

          <div className="space-y-2">
            {formData.options?.map((option, index) => (
              <div key={option.id} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="correctOption"
                  checked={option.isCorrect}
                  onChange={() => {
                    const updatedOptions = formData.options?.map((opt, i) => ({
                      ...opt,
                      isCorrect: i === index,
                    }));
                    setFormData((prev) => ({
                      ...prev,
                      options: updatedOptions,
                    }));
                  }}
                  className="h-4 w-4"
                />
                <Input
                  value={option.text}
                  onChange={(e) => {
                    const updatedOptions = [...(formData.options || [])];
                    updatedOptions[index].text = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      options: updatedOptions,
                    }));
                  }}
                  placeholder={`Option ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const updatedOptions = [...(formData.options || [])];
                    updatedOptions.splice(index, 1);
                    setFormData((prev) => ({
                      ...prev,
                      options: updatedOptions,
                    }));
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="initialCode">Initial Code (Optional)</Label>
            <Textarea
              id="initialCode"
              name="initialCode"
              value={formData.initialCode || ''}
              onChange={handleInputChange}
              rows={6}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Test Cases</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newTestCase = {
                    input: '',
                    output: '',
                    isHidden: false,
                  };
                  setFormData((prev) => {
                    if (prev.type === 'coding') {
                      return {
                        ...prev,
                        testCases: [...(prev.testCases || []), newTestCase],
                      };
                    }
                    return prev;
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Test Case
              </Button>
            </div>

            <div className="space-y-4">
              {formData.testCases?.map((testCase, index) => (
                <div key={index} className="border rounded-md p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Test Case {index + 1}
                    </span>
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={testCase.isHidden}
                          onChange={(e) => {
                            const updatedTestCases = [
                              ...(formData.testCases || []),
                            ];
                            updatedTestCases[index].isHidden = e.target.checked;
                            setFormData((prev) => ({
                              ...prev,
                              testCases: updatedTestCases,
                            }));
                          }}
                          className="h-4 w-4"
                        />
                        <span>Hidden</span>
                      </label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const updatedTestCases = [
                            ...(formData.testCases || []),
                          ];
                          updatedTestCases.splice(index, 1);
                          setFormData((prev) => ({
                            ...prev,
                            testCases: updatedTestCases,
                          }));
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label>Input</Label>
                      <Input
                        value={testCase.input}
                        onChange={(e) => {
                          const updatedTestCases = [
                            ...(formData.testCases || []),
                          ];
                          updatedTestCases[index].input = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            testCases: updatedTestCases,
                          }));
                        }}
                        placeholder="Input"
                        className="font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Expected Output</Label>
                      <Input
                        value={testCase.output}
                        onChange={(e) => {
                          const updatedTestCases = [
                            ...(formData.testCases || []),
                          ];
                          updatedTestCases[index].output = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            testCases: updatedTestCases,
                          }));
                        }}
                        placeholder="Expected output"
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="explanation">Explanation (Optional)</Label>
        <Textarea
          id="explanation"
          name="explanation"
          value={formData.explanation || ''}
          onChange={handleInputChange}
          rows={3}
          placeholder="Explain the solution or provide hints"
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={resetForm}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {editingId ? 'Update Question' : 'Add Question'}
        </Button>
      </div>
    </form>
  );

  const renderQuestionsList = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">
          {selectedCategory === 'all'
            ? 'All Practice Questions'
            : `Practice Questions: ${topics.find((t) => t.id === selectedCategory)?.name || 'Unknown'}`}
        </h2>
        <div className="flex items-center gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {filteredQuestions.length} question
            {filteredQuestions.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {isLoadingCombined ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"
            />
          ))}
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-gray-500">No questions found</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              updateFormData({
                type: 'mcq',
                question: '',
                points: 1,
                topicId: topics[0]?.id || '',
                options: [],
                explanation: '',
              });
              setEditingId(null);
            }}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Your First Question
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((question) => {
            const topic = topics.find((t) => t.id === question.topicId);
            return (
              <div
                key={question.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">
                      {question.question.substring(0, 100)}
                      {question.question.length > 100 ? '...' : ''}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {question.type.toUpperCase()}
                      </span>
                      {topic && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
                          {topic.name}
                        </span>
                      )}
                      <span>{question.points} points</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(question)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(question.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      {renderQuestionForm()}
      {renderQuestionsList()}
    </div>
  );
}
