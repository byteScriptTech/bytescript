import React from 'react';

import { Button } from '@/components/ui/button';

interface LandingPageBodyProps {
  handleExploreBiteScriptClick: () => void;
}

const LandingPageBody: React.FC<LandingPageBodyProps> = ({
  handleExploreBiteScriptClick,
}) => {
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-40 flex flex-1 justify-center py-5">
        <div
          role="main"
          className="layout-content-container flex flex-col max-w-[960px] flex-1"
        >
          <div className="@container">
            <div className="@[480px]:p-4 @[480px]:overflow-hidden">
              <div
                data-testid="hero-section"
                className="flex flex-col gap-6 @[480px]:gap-8 @[480px]:rounded-xl @[480px]:overflow-hidden @[480px]:shadow-lg @[480]:min-h-[480px] items-start justify-end px-4 pb-10 @[480px]:px-10 @[480px]:pb-12 bg-card/50"
                style={{
                  backgroundImage: `url('/images/undraw_firmware_3fxd.svg')`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  minHeight: '350px',
                }}
              ></div>
            </div>
          </div>
          <div className="flex flex-col gap-10 px-4 py-10 @container">
            <div className="flex flex-col gap-6 text-center">
              <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                Master Programming Through Practice
              </h1>
              <h2 className="text-base font-normal leading-relaxed max-w-[600px] mx-auto @[480px]:text-xl @[480px]:font-normal @[480px]:leading-relaxed text-muted-foreground">
                biteScript is an interactive platform built to make learning
                programming easy, engaging, and effective. Whether you&apos;re
                just starting out or looking to level up your skills, biteScript
                guides you through hands-on coding and real-world problem
                solving.
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full p-0">
              <div
                data-testid="feature-card-interactive"
                className="flex w-full gap-3 rounded-lg border border-border bg-card p-4 flex-col hover:shadow-md transition-shadow"
              >
                <div
                  className="text-foreground"
                  data-icon="Code"
                  data-size="24px"
                  data-weight="regular"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M69.12,94.15,28.5,128l40.62,33.85a8,8,0,1,1-10.24,12.29l-48-40a8,8,0,0,1,0-12.29l48-40a8,8,0,0,1,10.24,12.3Zm176,27.7-48-40a8,8,0,1,0-10.24,12.3L227.5,128l-40.62,33.85a8,8,0,1,0,10.24,12.29l48-40a8,8,0,0,0,0-12.29ZM162.73,32.48a8,8,0,0,0-10.25,4.79l-64,176a8,8,0,0,0,4.79,10.26A8.14,8.14,0,0,0,96,224a8,8,0,0,0,7.52-5.27l64-176A8,8,0,0,0,162.73,32.48Z"></path>
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-foreground text-base font-bold leading-tight">
                    Interactive Coding Challenges
                  </h2>
                  <p className="text-muted-foreground text-sm font-normal leading-normal">
                    Dive into bite‑sized exercises tailored to your level. Share
                    your solutions, get community driven feedback, and learn
                    together one challenge at a time.
                  </p>
                </div>
              </div>
              <div
                data-testid="feature-card-problem-solving"
                className="flex w-full gap-3 rounded-lg border border-border bg-card p-4 flex-col hover:shadow-md transition-shadow"
              >
                <div
                  className="text-foreground"
                  data-icon="PuzzlePiece"
                  data-size="24px"
                  data-weight="regular"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M220.27,158.54a8,8,0,0,0-7.7-.46,20,20,0,1,1,0-36.16A8,8,0,0,0,224,114.69V72a16,16,0,0,0-16-16H171.78a35.36,35.36,0,0,0,.22-4,36.11,36.11,0,0,0-11.36-26.24,36,36,0,0,0-60.55,23.62,36.56,36.56,0,0,0,.14,6.62H64A16,16,0,0,0,48,72v32.22a35.36,35.36,0,0,0-4-.22,36.12,36.12,0,0,0-26.24,11.36,35.7,35.7,0,0,0-9.69,27,36.08,36.08,0,0,0,33.31,33.6,35.68,35.68,0,0,0,6.62-.14V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V165.31A8,8,0,0,0,220.27,158.54ZM208,208H64V165.31a8,8,0,0,0-11.43-7.23,20,20,0,1,1,0-36.16A8,8,0,0,0,64,114.69V72h46.69a8,8,0,0,0,7.23-11.43,20,20,0,1,1,36.16,0A8,8,0,0,0,161.31,72H208v32.23a35.68,35.68,0,0,0-6.62-.14A36,36,0,0,0,204,176a35.36,35.36,0,0,0,4-.22Z"></path>
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-foreground text-base font-bold leading-tight">
                    Adaptive Problem-Solving
                  </h2>
                  <p className="text-muted-foreground text-sm font-normal leading-normal">
                    Tackle complex problems with adaptive learning paths,
                    designed to challenge and improve your analytical abilities.
                  </p>
                </div>
              </div>
              <div
                data-testid="feature-card-community-collaboration"
                className="flex w-full gap-3 rounded-lg border border-border bg-card p-4 flex-col hover:shadow-md transition-shadow"
              >
                <div
                  className="text-foreground"
                  data-icon="UsersThree"
                  data-size="24px"
                  data-weight="regular"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.84,8,57,57,0,0,0-98.16,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z"></path>
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-foreground text-base font-bold leading-tight">
                    Community Collaboration
                  </h2>
                  <p className="text-muted-foreground text-sm font-normal leading-normal">
                    Join a vibrant community of learners and experts,
                    collaborate on projects, and share your knowledge.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="@container py-16 @[480px]:py-24 text-center">
            <div className="flex flex-col gap-8 @[480px]:gap-12 max-w-[720px] mx-auto">
              <div className="flex flex-col gap-4">
                <h1 className="text-foreground tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                  Ready to Start Your Coding Journey?
                </h1>
                <p className="text-muted-foreground text-base font-normal leading-relaxed">
                  biteScript is a free, open-source platform built by
                  developers, for learners like you. Join our growing community
                  and start mastering coding, problem-solving, and AI—one step
                  at a time.
                </p>
              </div>
              <div className="flex flex-col @[480px]:flex-row @[480px]:justify-center items-center gap-4 @[480px]:gap-6">
                <Button
                  onClick={handleExploreBiteScriptClick}
                  className="flex items-center justify-center w-full @[480px]:w-auto max-w-[320px] h-10 @[480px]:h-12 px-4 @[480px]:px-6 rounded-lg bg-[#00BFA6] hover:bg-[#00A38C] text-white text-sm @[480px]:text-base font-semibold tracking-[0.015em] transition-all duration-200 ease-out transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="truncate">Get Started</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPageBody;
