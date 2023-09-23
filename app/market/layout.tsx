'use client';

import { Container, Flex, Paper } from '@mantine/core';
import React from 'react';
import Map from '@/components/map/Map';
import Sidebar from '@/components/Sidebar/Sidebar';
import MarketSidebar from '@/components/Sidebar/Sidebar';
import { useToggle as useMantineToggle, useToggle } from '@mantine/hooks';

function MarketLayout() {
  const [menu, menuToggle] = useMantineToggle(['', 'address', 'ranking', 'region']);
  const [secondSidebar, secondSidebarToggle] = useToggle();

  return (
    <Paper h="100%">
      <Flex h="100%" wrap="nowrap">
        {/* 사이드바 */}
        <MarketSidebar
          menu={menu}
          menuToggle={menuToggle}
          secondSidebar={secondSidebar}
          secondSidebarToggle={secondSidebarToggle}
        />
        <Map />
      </Flex>
    </Paper>
  );
}

export default MarketLayout;
