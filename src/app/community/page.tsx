'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import LandingPageHeader from '@/components/specific/LandingPageHeader';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CommunityPage = () => {
  const router = useRouter();

  const handleExploreBiteScriptClick = () => {
    router.push('/login?callbackUrl=/peer-programming');
  };

  return (
    <div
      className={cn(
        'relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden transition-colors duration-200 font-sans',
        'bg-background text-foreground'
      )}
    >
      <div className="layout-container flex h-full grow flex-col">
        <LandingPageHeader
          handleExploreBiteScriptClick={handleExploreBiteScriptClick}
        />
        <div className="px-4 sm:px-6 lg:px-40 flex flex-1 justify-center pb-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-col gap-10 px-4 py-10">
              <div className="flex flex-col gap-6 text-center">
                <h1 className="text-foreground text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                  Join Our Community
                </h1>
                <h2 className="text-muted-foreground text-base font-normal leading-relaxed max-w-[600px] mx-auto @[480px]:text-xl @[480px]:font-normal @[480px]:leading-relaxed">
                  Connect with fellow learners, share your progress, and get the
                  latest updates from the biteScript community.
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full mt-8 px-4">
                {/* Instagram Card */}
                <div className="bg-card text-card-foreground rounded-xl shadow-sm overflow-hidden border border-border transition-all hover:shadow-md">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C9.01 2.013 9.35 2 11.816 2h.5zm-.25 2.25h-.5c-2.2 0-2.584.012-3.547.06-.976.045-1.505.207-1.857.344-.467.182-.8.4-1.15.75-.35.35-.568.683-.75 1.15-.137.352-.3.88-.344 1.857-.048.963-.06 1.347-.06 3.547v.5c0 2.2.012 2.584.06 3.547.045.976.207 1.505.344 1.857.182.467.4.8.75 1.15.35.35.683.568 1.15.75.352.137.88.3 1.857.344.963.048 1.347.06 3.547.06h.5c2.2 0 2.584-.012 3.547-.06.976-.045 1.505-.207 1.857-.344.467-.182.8-.4 1.15-.75.35-.35.568-.683.75-1.15.137-.352.3-.88.344-1.857.048-.963.06-1.347.06-3.547v-.5c0-2.2-.012-2.584-.06-3.547-.045-.976-.207-1.505-.344-1.857a3.11 3.11 0 00-.75-1.15 3.11 3.11 0 00-1.15-.75c-.352-.137-.88-.3-1.857-.344-.963-.048-1.347-.06-3.547-.06zm-4.065 7.5a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zm3.75-2.25a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-card-foreground">
                        Instagram
                      </h3>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Follow us on Instagram for daily coding tips, and
                      community highlights.
                    </p>
                    <a
                      href="https://instagram.com/bitescript.fun"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full px-5 py-2.5 text-sm font-medium text-primary-foreground bg-gradient-to-br from-primary to-primary/80 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Follow @bitescript.fun
                    </a>
                  </div>
                </div>

                {/* X (Twitter) Card */}
                <div className="bg-card text-card-foreground rounded-xl shadow-sm overflow-hidden border border-border transition-all hover:shadow-md">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-black rounded-lg">
                        <svg
                          className="w-8 h-8 text-white"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-card-foreground">
                        X (Twitter)
                      </h3>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Join the conversation on X for the latest updates, coding
                      challenges, and community discussions.
                    </p>
                    <a
                      href="https://twitter.com/bitescript"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full px-5 py-2.5 text-sm font-medium text-primary-foreground bg-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Follow @bitescript
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-12 text-center">
                <h3 className="text-2xl font-bold text-card-foreground mb-4">
                  #biteScriptCommunity
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                  Share your coding journey with us using #biteScriptCommunity
                  for a chance to be featured on our social media!
                </p>
                <Button
                  onClick={handleExploreBiteScriptClick}
                  className="bg-[#00BFA6] hover:bg-[#00a38f] text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  Start Your Coding Journey
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
