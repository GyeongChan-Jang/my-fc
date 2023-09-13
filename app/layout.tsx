import '@mantine/core/styles.css';
import React from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';

import Script from 'next/script';
// import { NavermapsProvider } from 'react-naver-maps';

export const metadata = {
  title: 'My-Franchise',
  description: 'This is My-Franchise clone project',
};

export default function RootLayout({ children }: { children: any }) {
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
        <MantineProvider>
          {/* <NavermapsProvider ncpClientId={process.env.NAVER_MAPS_CLIENT_ID!}> */}
          {children}
          {/* </NavermapsProvider> */}
        </MantineProvider>
      </body>
    </html>
  );
}
