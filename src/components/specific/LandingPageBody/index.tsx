import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/button';

interface LandingPageBodyProps {
  handleExploreByteScriptClick: () => void;
}

const LandingPageBody: React.FC<LandingPageBodyProps> = ({
  handleExploreByteScriptClick,
}) => {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#f0fdf9] dark:bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight text-foreground">
                Master Programming
                <span className="text-[#00BFA6]">
                  {' '}
                  with Interactive Learning
                </span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Learn competitive programming, data structures, and multiple
              languages with interactive visualizations, peer collaboration, and
              AI assistance.
            </p>
            <div className="pt-4 flex justify-center">
              <Link href="/learn">
                <Button
                  className="px-10 py-7 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all transform hover:scale-105"
                  size="lg"
                >
                  Start Learning Now
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-10 px-4 py-10 @container">
            <div className="flex flex-col gap-6 text-center">
              <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                Master Programming Through Practice
              </h1>
              <h2 className="text-base font-normal leading-relaxed max-w-[600px] mx-auto @[480px]:text-xl @[480px]:font-normal @[480px]:leading-relaxed text-muted-foreground">
                byteScript is an interactive platform built to make learning
                programming easy, engaging, and effective. Whether you&apos;re
                just starting out or looking to level up your skills, byteScript
                guides you through hands-on coding and real-world problem
                solving.
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full p-0">
              <Link href="/competitive-programming">
                <div
                  data-testid="feature-card-competitive"
                  className="group flex w-full gap-3 rounded-xl border border-border/50 bg-gradient-to-br from-card to-card/80 p-6 flex-col hover:shadow-2xl hover:scale-102 hover:border-primary/50 transition-all duration-300 cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div
                    className="text-foreground relative z-10"
                    data-icon="Trophy"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M200,32H56A24,24,0,0,0,32,56V200a24,24,0,0,0,24,24H200a24,24,0,0,0,24-24V56A24,24,0,0,0,200,32Zm8,168a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V56a8,8,0,0,1,8-8H200a8,8,0,0,1,8,8ZM40,16V216a8,8,0,0,1-16,0V16a8,8,0,0,1,16,0ZM232,16V216a8,8,0,0,1-16,0V16a8,8,0,0,1,16,0Z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 relative z-10">
                    <h2 className="text-foreground text-lg font-bold leading-tight group-hover:text-primary transition-colors duration-300">
                      Competitive Programming
                    </h2>
                    <p className="text-muted-foreground text-sm font-normal leading-normal">
                      Practice curated patterns and templates for contest
                      problems with explanations and variations.
                    </p>
                    <div className="flex items-center text-primary text-sm font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Explore Now</span>
                      <svg
                        className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
              <Link href="/practice">
                <div
                  data-testid="feature-card-problems"
                  className="group flex w-full gap-3 rounded-xl border border-border/50 bg-gradient-to-br from-card to-card/80 p-6 flex-col hover:shadow-2xl hover:scale-102 hover:border-primary/50 transition-all duration-300 cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div
                    className="text-foreground relative z-10"
                    data-icon="Puzzle"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M224,96a32,32,0,0,0-32-32,32,32,0,0,0-32-32H96A32,32,0,0,0,64,64,32,32,0,0,0,32,96v64a32,32,0,0,0,32,32,32,32,0,0,0,32,32h64a32,32,0,0,0,32-32,32,32,0,0,0,32-32ZM160,64h16V80H160ZM96,64h48V80H96ZM64,96H80V80h16V64a16,16,0,0,1,16-16h48a16,16,0,0,1,16,16V80h16V96h16v16H208v48H192v16H176v16H128a16,16,0,0,1-16-16H96V160H80V144H64Zm16,64h16v16H80Zm16,32h48v16H96Z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 relative z-10">
                    <h2 className="text-foreground text-lg font-bold leading-tight group-hover:text-primary transition-colors duration-300">
                      Problem Solving
                    </h2>
                    <p className="text-muted-foreground text-sm font-normal leading-normal">
                      Large catalog of practice problems with difficulty tags,
                      solutions, and testcases.
                    </p>
                    <div className="flex items-center text-primary text-sm font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Start Practicing</span>
                      <svg
                        className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
              <Link href="/learn/data-structures">
                <div
                  data-testid="feature-card-dsa"
                  className="group flex w-full gap-3 rounded-xl border border-border/50 bg-gradient-to-br from-card to-card/80 p-6 flex-col hover:shadow-2xl hover:scale-102 hover:border-primary/50 transition-all duration-300 cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div
                    className="text-foreground relative z-10"
                    data-icon="TreeStructure"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M232,120h-8V88a24,24,0,0,0-24-24H136V56a24,24,0,0,0-24-24H56A24,24,0,0,0,32,56v72a24,24,0,0,0,24,24h8v32a24,24,0,0,0,24,24h64v8a24,24,0,0,0,24,24h56a24,24,0,0,0,24-24V144A24,24,0,0,0,232,120ZM56,48h56a8,8,0,0,1,8,8v8H48V56A8,8,0,0,1,56,48Zm8,96a8,8,0,0,1-8-8V80H120v56H64Zm96,56H88V184h64v8a8,8,0,0,1-8,8Zm64-16H168V144a8,8,0,0,0-8-8H136V88h64a8,8,0,0,1,8,8v32h8a8,8,0,0,1,8,8v48Z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 relative z-10">
                    <h2 className="text-foreground text-lg font-bold leading-tight group-hover:text-primary transition-colors duration-300">
                      Data Structures
                    </h2>
                    <p className="text-muted-foreground text-sm font-normal leading-normal">
                      Learn core data structures with interactive visualizations
                      and step-through animations.
                    </p>
                    <div className="flex items-center text-primary text-sm font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Learn Now</span>
                      <svg
                        className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="@container py-16 @[480px]:py-24 text-center">
            <div className="flex flex-col gap-8 @[480px]:gap-12 max-w-[720px] mx-auto">
              <div className="flex flex-col gap-4">
                <h1 className="text-foreground tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                  Ready to Start Your Coding Journey?
                </h1>
                <p className="text-muted-foreground text-base font-normal leading-relaxed">
                  byteScript is a free, open-source platform built by
                  developers, for learners like you. Join our growing community
                  and start mastering coding, problem-solving, and AI—one step
                  at a time.
                </p>
              </div>
              <div className="flex flex-col @[480px]:flex-row @[480px]:justify-center items-center gap-4 @[480px]:gap-6">
                <Button
                  onClick={handleExploreByteScriptClick}
                  className="flex items-center justify-center w-full @[480px]:w-auto max-w-[320px] h-10 @[480px]:h-12 px-4 @[480px]:px-6 rounded-lg bg-[#00BFA6] hover:bg-[#00A38C] text-white text-sm @[480px]:text-base font-semibold tracking-[0.015em] transition-all duration-200 ease-out transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="truncate">Get Started</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Start your learning journey in three simple steps
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center p-8 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300">
              <div className="w-20 h-20 bg-[#d9f7f0] dark:bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#c2f0e6] dark:group-hover:bg-primary/20 transition-colors">
                <span className="text-3xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                Sign Up for Free
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Create your account and get instant access to our comprehensive
                learning platform. No setup required.
              </p>
            </div>
            <div className="group text-center p-8 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300">
              <div className="w-20 h-20 bg-[#d9f7f0] dark:bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#c2f0e6] dark:group-hover:bg-primary/20 transition-colors">
                <span className="text-3xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                Choose Your Path
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Select from competitive programming, data structures, JavaScript
                learning, or peer programming sessions.
              </p>
            </div>
            <div className="group text-center p-8 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300">
              <div className="w-20 h-20 bg-[#d9f7f0] dark:bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#c2f0e6] dark:group-hover:bg-primary/20 transition-colors">
                <span className="text-3xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                Learn and Progress
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Master programming through hands-on practice. Track your
                progress and build real projects as you learn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#f0fdf9] dark:bg-primary/5 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Master Programming?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our comprehensive learning platform and master competitive
            programming, data structures, JavaScript, and more with interactive
            visualizations and AI assistance.
          </p>
          <div className="flex justify-center">
            <Link href="/learn">
              <Button className="px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-white dark:text-black">
                Start Learning for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPageBody;
