'use client';
import { useRouter } from 'next/navigation';

import LandingPageBody from '@/components/specific/LandingPageBody';
import LandingPageFooter from '@/components/specific/LandingPageFooter';
import LandingPageHeader from '@/components/specific/LandingPageHeader';

function LoginForm() {
  const router = useRouter();
  const handleExploreBiteScriptClick = () => {
    router.push('/login');
  };
  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
      style={{ fontFamily: "Manrope, 'Noto Sans', sans-serif" }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <LandingPageHeader
          handleExploreBiteScriptClick={handleExploreBiteScriptClick}
        />
        <LandingPageBody
          handleExploreBiteScriptClick={handleExploreBiteScriptClick}
        />
        <LandingPageFooter />
      </div>
    </div>
  );
}

export default LoginForm;
