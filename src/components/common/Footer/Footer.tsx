import Link from 'next/link';
import { FaGithub, FaTwitter, FaDiscord } from 'react-icons/fa';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:gap-8">
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
            <p className="text-sm text-muted-foreground">
              © {currentYear} biteScript. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/yourusername/bitescript"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <FaGithub className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com/yourhandle"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <FaTwitter className="h-5 w-5" />
            </a>
            <a
              href="https://discord.gg/yourinvite"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Discord"
            >
              <FaDiscord className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
