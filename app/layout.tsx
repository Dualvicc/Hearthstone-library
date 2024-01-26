import '@/styles/globals.css';

import localFont from 'next/font/local';

import { Wrapper } from '@/components/Wrapper';
import { CardsProvider, MetadataProvider, PageProvider } from '@/providers';

const belwe = localFont({
  src: '../public/fonts/Belwe-Bold.woff',
  variable: '--font-belwe',
});

const openSans = localFont({
  src: [
    {
      path: '../public/fonts/open-sans-400.woff',
      weight: '400',
    },
    {
      path: '../public/fonts/open-sans-600.woff',
      weight: '600',
    },
  ],
  variable: '--font-opensans',
});

export const metadata = {
  title: 'Hearthstone Card Library',
  description: 'Explore the latest cards and discover your next big idea!',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className={`${openSans.variable} ${belwe.variable} h-full`}>
      <body className="h-full font-sansSerif text-[14px] font-normal leading-normal text-black">
        {/* <MetadataProvider>
          <PageProvider>
            <CardsProvider> */}
              <Wrapper>{children}</Wrapper>
            {/* </CardsProvider>
          </PageProvider>
        </MetadataProvider> */}
      </body>
    </html>
  );
};

export default RootLayout;
