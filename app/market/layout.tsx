'use client';

import { Paper } from '@mantine/core';
import React from 'react';
import Map from '@/components/map/Map';

function MarketLayout() {
  return (
    <Paper w="100%" h="100%">
      <Map />
    </Paper>
  );
}

export default MarketLayout;
