'use client';
import { useRouter } from 'next/navigation';

import BoxReveal from '@/components/ui/box-reveal';
import { Button } from '@/components/ui/button';

function LoginForm() {
  const router = useRouter();
  const handleExploreBiteScriptClick = () => {
    router.push('/login');
  };
  return (
    <div className="h-full flex justify-center items-center pt-40">
      <div className="size-full max-w-lg items-center justify-center overflow-hidden pt-8">
        <BoxReveal boxColor={'#00BFA6'} duration={0.5}>
          <p className="text-[3.5rem] font-semibold">
            biteScript<span className="text-[#00BFA6]">.</span>
          </p>
        </BoxReveal>
        <BoxReveal boxColor={'#00BFA6'} duration={0.5}>
          <h2 className="mt-[.5rem] text-[1rem]">
            <span className="text-[#00BFA6]">biteScript</span> is an interactive
            platform that simplifies learning programming languages and
            problem-solving, starting with JavaScript and expanding to others
            through hands-on practice and real-world challenges.
          </h2>
        </BoxReveal>

        <BoxReveal boxColor={'#00BFA6'} duration={0.5}>
          <div className="mt-6">
            <p className="my-2">
              <span className="font-semibold text-[#00BFA6]">
                Language-Focused Learning:
              </span>{' '}
              Start with JavaScript and soon dive into Typescript, Python, and
              more. biteScript offers tailored exercises and resources for all
              skill levels.
            </p>
            <p>
              <span className="font-semibold text-[#00BFA6]">
                Interactive Problem Solving:
              </span>{' '}
              Sharpen your coding skills with real-world challenges, from simple
              logic puzzles to advanced algorithms, designed to keep you
              thinking.
            </p>
            <p>
              <span className="font-semibold text-[#00BFA6]">
                Progressive Learning Path:
              </span>{' '}
              Follow a structured journey that builds your knowledge
              step-by-step, helping you grow from beginner to expert at your own
              pace.
            </p>
          </div>
        </BoxReveal>

        <BoxReveal boxColor={'#00BFA6'} duration={0.5}>
          <Button
            onClick={handleExploreBiteScriptClick}
            className="mt-[1.6rem] bg-[#00BFA6] hover:bg-[#00A38C]"
          >
            Explore
          </Button>
        </BoxReveal>
      </div>
    </div>
  );
}

export default LoginForm;
