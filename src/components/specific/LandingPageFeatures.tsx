'use client';

import {
  Code,
  Cpu,
  Users,
  BookOpen,
  Target,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const features = [
  {
    title: 'Peer Programming',
    description:
      'Collaborate in real-time with other developers. Solve problems together and learn from each other in our interactive coding environment.',
    icon: <Users className="h-8 w-8 text-primary" />,
    link: '/peer-programming',
  },
  {
    title: 'Data Structures',
    description:
      'Master essential data structures with interactive visualizations and hands-on coding challenges.',
    icon: <Cpu className="h-8 w-8 text-primary" />,
    link: '/data-structures',
  },
  {
    title: 'Problem Solving',
    description:
      'Sharpen your problem-solving skills with our curated collection of coding challenges and algorithm problems.',
    icon: <Target className="h-8 w-8 text-primary" />,
    link: '/practice',
  },
  {
    title: 'Learn Programming',
    description:
      'Start your coding journey with our interactive courses in JavaScript, Python, and more.',
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    link: '/learn',
  },
  {
    title: 'Interview Prep',
    description:
      'Prepare for technical interviews with our comprehensive collection of interview questions and mock interviews.',
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    link: '/interview',
  },
  {
    title: 'Coding Challenges',
    description:
      'Test your skills with our daily coding challenges and compete with other developers.',
    icon: <Code className="h-8 w-8 text-primary" />,
    link: '/competitive-programming',
  },
];

export default function LandingPageFeatures() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          What You Can Learn
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-border"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-primary/10 rounded-full mr-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                {feature.description}
              </p>
              <Link href={feature.link}>
                <Button variant="outline" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
