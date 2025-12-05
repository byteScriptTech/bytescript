'use client';

import { Plus, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { CustomTestService } from '@/services/firebase/customTestService';
import { practiceQuestionsService } from '@/services/firebase/practiceQuestionsService';
import { CustomTest, TestQuestion } from '@/types/customTest';
import { PracticeQuestion } from '@/types/practiceQuestion';

import QuestionEditor from './QuestionEditor';

interface TestCreatorProps {
  onCancel: () => void;
  onSave: (testId: string) => void;
}

export default function TestCreator({ onCancel, onSave }: TestCreatorProps) {
  const { currentUser } = useAuth();

  const [isSaving, setIsSaving] = useState(false);
  const [practiceQuestions, setPracticeQuestions] = useState<
    PracticeQuestion[]
  >([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('custom');

  const [testData, setTestData] = useState<Partial<CustomTest>>({
    title: '',
    description: '',
    duration: 30,
    questions: [],
    isPublic: false,
    tags: [],
    difficulty: 'Beginner',
  });

  const [newTag, setNewTag] = useState('');

  // ----------------------------
  // Load questions from library
  // ----------------------------
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        const questions = await practiceQuestionsService.getAllQuestions();
        setPracticeQuestions(questions);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load practice questions');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  // ----------------------------
  // Add custom question
  // ----------------------------
  const addQuestion = (type: TestQuestion['type']) => {
    const newQuestion: TestQuestion = {
      id: `q_${Date.now()}`,
      type,
      question: '',
      correctAnswer: '',
      points: 10,
      explanation: '',
      options: type === 'multiple-choice' ? ['', '', '', ''] : undefined,
    };

    setTestData((prev) => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion],
    }));
  };

  // ----------------------------
  // Add selected library questions
  // ----------------------------
  const addSelectedQuestions = () => {
    const questionsToAdd = practiceQuestions
      .filter((q) => selectedQuestions.has(q.id))
      .map((pq): TestQuestion => {
        // Convert PracticeQuestion to TestQuestion
        if (pq.type === 'mcq') {
          return {
            id: pq.id,
            type: 'multiple-choice',
            question: pq.question,
            points: pq.points,
            options: pq.options.map((opt) => opt.text),
            correctAnswer: pq.options.find((opt) => opt.isCorrect)?.text || '',
            explanation: pq.explanation,
          };
        } else {
          // pq.type === 'coding'
          return {
            id: pq.id,
            type: 'coding',
            question: pq.question,
            points: pq.points,
            language: pq.language,
            codeTemplate: pq.initialCode,
            correctAnswer: pq.testCases?.[0]?.output || '',
            explanation: pq.explanation,
            testCases: pq.testCases?.map((tc) => ({
              input: tc.input,
              expectedOutput: tc.output,
              isHidden: tc.isHidden,
            })),
          };
        }
      });

    setTestData((prev) => ({
      ...prev,
      questions: [...(prev.questions || []), ...questionsToAdd],
    }));

    toast.success(`Added ${questionsToAdd.length} question(s)`);

    setSelectedQuestions(new Set());
    setActiveTab('custom');
  };

  // ----------------------------
  // Save Test
  // ----------------------------
  const handleSave = async () => {
    if (!currentUser) return toast.error('You must be logged in');

    if (
      !testData.title ||
      !testData.description ||
      !testData.questions?.length
    ) {
      return toast.error(
        'Please fill required fields and add at least one question'
      );
    }

    setIsSaving(true);

    try {
      const testPayload = {
        ...testData,
        createdBy: currentUser.uid,
      } as Omit<CustomTest, 'id' | 'createdAt' | 'updatedAt'>;

      const testId = await CustomTestService.createTest(testPayload);

      toast.success('Test created successfully!');
      onSave(testId);
    } catch (error) {
      console.error(error);
      toast.error('Failed to create test');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Create Custom Test</h1>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" /> Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Test'}
          </Button>
        </div>
      </div>

      {/* BASIC INFO */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Test Title *</Label>
            <Input
              value={testData.title || ''}
              onChange={(e) =>
                setTestData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter test title"
            />
          </div>

          <div>
            <Label>Duration (minutes)</Label>
            <Input
              type="number"
              min="1"
              value={testData.duration || 30}
              onChange={(e) =>
                setTestData((prev) => ({
                  ...prev,
                  duration: parseInt(e.target.value) || 30,
                }))
              }
            />
          </div>
        </div>

        <div>
          <Label>Description *</Label>
          <Textarea
            value={testData.description || ''}
            onChange={(e) =>
              setTestData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Difficulty</Label>
            <Select
              value={testData.difficulty}
              onValueChange={(value) =>
                setTestData((prev) => ({
                  ...prev,
                  difficulty: value as 'Beginner' | 'Intermediate' | 'Advanced',
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={testData.isPublic}
              onCheckedChange={(checked) =>
                setTestData((prev) => ({ ...prev, isPublic: checked }))
              }
            />
            <Label>Make Public</Label>
          </div>
        </div>

        {/* TAGS */}
        <div>
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2 my-2">
            {testData.tags?.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() =>
                    setTestData((prev) => ({
                      ...prev,
                      tags: prev.tags?.filter((t) => t !== tag),
                    }))
                  }
                />
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="New tag"
              onKeyDown={(e) =>
                e.key === 'Enter' &&
                newTag.trim() &&
                setTestData((prev) => ({
                  ...prev,
                  tags: [...(prev.tags ?? []), newTag.trim()],
                }))
              }
            />
            <Button
              onClick={() => {
                if (!newTag.trim()) return;
                setTestData((prev) => ({
                  ...prev,
                  tags: [...(prev.tags ?? []), newTag.trim()],
                }));
                setNewTag('');
              }}
            >
              Add
            </Button>
          </div>
        </div>
      </Card>

      {/* QUESTIONS */}
      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Questions</h3>

          <Button
            variant="outline"
            onClick={() =>
              setActiveTab(activeTab === 'custom' ? 'library' : 'custom')
            }
          >
            {activeTab === 'custom' ? 'Select from Library' : 'Add Custom'}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="custom">Custom Questions</TabsTrigger>
            <TabsTrigger value="library">Library</TabsTrigger>
          </TabsList>

          {/* CUSTOM QUESTIONS */}
          <TabsContent value="custom" className="space-y-4">
            <div className="flex justify-end">
              <Select
                onValueChange={(v) =>
                  addQuestion(
                    v as
                      | 'multiple-choice'
                      | 'coding'
                      | 'true-false'
                      | 'fill-blank'
                  )
                }
              >
                <SelectTrigger className="w-[200px]">
                  <Plus className="h-4 w-4 mr-2" /> Add Question
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple-choice">
                    Multiple Choice
                  </SelectItem>
                  <SelectItem value="coding">Coding</SelectItem>
                  <SelectItem value="true-false">True/False</SelectItem>
                  <SelectItem value="fill-blank">Fill in Blank</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {testData.questions?.map((q, i) => (
              <QuestionEditor
                key={q.id}
                question={q}
                index={i}
                onUpdate={(updates: Partial<TestQuestion>) =>
                  setTestData((prev) => ({
                    ...prev,
                    questions: prev.questions?.map((qq) =>
                      qq.id === q.id ? { ...qq, ...updates } : qq
                    ),
                  }))
                }
                onRemove={() =>
                  setTestData((prev) => ({
                    ...prev,
                    questions: prev.questions?.filter((qq) => qq.id !== q.id),
                  }))
                }
              />
            ))}

            {!testData.questions?.length && (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                No questions yet. Add one!
              </div>
            )}
          </TabsContent>

          {/* LIBRARY */}
          <TabsContent value="library">
            {isLoading ? (
              <p className="text-center py-10">Loading...</p>
            ) : (
              <>
                <div className="max-h-[400px] overflow-y-auto space-y-2">
                  {practiceQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="flex items-start gap-3 p-4 border rounded-md hover:bg-accent/40"
                    >
                      <Checkbox
                        checked={selectedQuestions.has(q.id)}
                        onCheckedChange={() => {
                          setSelectedQuestions((prev) => {
                            const newSet = new Set(prev);
                            newSet.has(q.id)
                              ? newSet.delete(q.id)
                              : newSet.add(q.id);
                            return newSet;
                          });
                        }}
                      />

                      <div>
                        <p className="font-medium">
                          {q.question.slice(0, 120)}
                          {q.question.length > 120 ? '...' : ''}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <Badge>
                            {q.type === 'mcq' ? 'Multiple Choice' : 'Coding'}
                          </Badge>
                          <Badge variant="outline">{q.points} pts</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2 mt-3">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('custom')}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={selectedQuestions.size === 0}
                    onClick={addSelectedQuestions}
                  >
                    Add Selected ({selectedQuestions.size})
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
