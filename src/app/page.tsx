'use client';
import { useRouter } from 'next/navigation';

import LandingPageBody from '@/components/specific/LandingPageBody';
import LandingPageFooter from '@/components/specific/LandingPageFooter';
import LandingPageHeader from '@/components/specific/LandingPageHeader';

function LoginForm() {
  const router = useRouter();
  const handleExploreByteScriptClick = () => {
    router.push('/login');
  };
  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-background text-foreground group/design-root overflow-x-hidden"
      style={{ fontFamily: "Manrope, 'Noto Sans', sans-serif" }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <LandingPageHeader
          handleExploreByteScriptClick={handleExploreByteScriptClick}
        />
        <LandingPageBody
          handleExploreByteScriptClick={handleExploreByteScriptClick}
        />
        <LandingPageFooter />
      </div>
    </div>
  );
}

export default LoginForm;
