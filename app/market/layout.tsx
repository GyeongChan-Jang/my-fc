'use client';

import { Container, Flex, Paper } from '@mantine/core';
import React from 'react';
import Map from '@/components/map/Map';
import Sidebar from '@/components/Sidebar/Sidebar';

function MarketLayout() {
  return (
    <Paper h="100%">
      <Flex h="100%" wrap="nowrap">
        <Sidebar />
        <Map />
      </Flex>
    </Paper>
  );
}

export default MarketLayout;
