import Link from 'next/link';
import { VscDebugDisconnect } from 'react-icons/vsc';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[hsl(var(--landing-bg))] dark:bg-background text-foreground px-4">
      <div className="text-center max-w-lg">
        <div className="mt-4 flex justify-center">
          <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary p-3">
            <VscDebugDisconnect className="h-10 w-10 sm:h-16 sm:w-16" />
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Oops, this page got lost in the bytes.
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Back to home
          </Link>
          <Link
            href="/learn"
            className="text-sm font-medium text-primary hover:underline"
          >
            Explore byteScript
          </Link>
        </div>
      </div>
    </main>
  );
}
