import React from 'react';

const LandingPageFooter: React.FC = () => {
  return (
    <footer className="flex justify-center bg-muted/50 border-t border-border">
      <div
        data-testid="footer-container"
        className="max-w-[960px] flex-1 flex-col"
      >
        <div className="flex flex-col gap-6 px-5 py-10 text-center @container">
          <p className="text-muted-foreground text-base font-normal leading-normal">
            © {new Date().getFullYear()} ByteScript. Open Source under the MIT
            License.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingPageFooter;
