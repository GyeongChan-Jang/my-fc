import '@mantine/core/styles.css';
import React, { ReactNode } from 'react';
import { MantineProvider, ColorSchemeScript, Paper, Flex } from '@mantine/core';

import Script from 'next/script';
import Header from '@/components/Header/Header';

export const metadata = {
  title: 'My-Franchise',
  description: 'This is My-Franchise clone project',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <ColorSchemeScript />
        <Script
          type="text/javascript"
          src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NAVER_MAPS_CLIENT_ID}&submodules=drawing,panorama,geocoder`}
        />
      </head>
      <body>
        <MantineProvider
          theme={{
            fontFamily: 'inter, sans-serif',
          }}
        >
          <Paper h="100%">
            <Flex h="100%" direction="column" style={{ flexGrow: 1 }}>
              <Header />
              {children}
            </Flex>
          </Paper>
        </MantineProvider>
      </body>
    </html>
  );
}
