'use client';

import {
  Button,
  Container,
  Flex,
  Group,
  Select,
  UnstyledButton,
  Image,
  Text,
  Badge,
} from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';

import Link from 'next/link';
import React from 'react';

const headerItems = [
  {
    title: '홈',
    link: '/',
  },
  {
    title: '브랜드페이지 관리',
    link: '/brand',
  },
  {
    title: '가맹점 관리',
    link: '/franchise',
  },
  {
    title: '창업 문의',
    link: '/contact',
  },
  {
    title: '매물 관리',
    link: '/property',
  },
  {
    title: '공실 정보',
    link: '/vacancy',
  },
  {
    title: '상권 분석',
    link: '/market',
  },
  {
    title: '이용 요금',
    link: '/fee',
  },
  {
    title: '사용자 관리',
    link: '/user',
  },
];

function Header() {
  return (
    <Container
      pos="sticky"
      w="100%"
      display="flex"
      style={{ justifyContent: 'space-between', borderBottom: '1px solid rgb(238, 238, 238)' }}
      h={64}
      bg="white"
    >
      <Group w={377}>
        <Flex gap={20} pl={20}>
          <UnstyledButton w={145}>
            <Link href="/market">
              <Image src="https://partner.myfranchise.kr/img/a5e350752ec16d22fe3abd86d7752e3d.svg" />
            </Link>
          </UnstyledButton>
          <Flex gap={6} align="center">
            <UnstyledButton>
              <Text fw="bold" c="#2c2c2c">
                (주)청년부엌
              </Text>
            </UnstyledButton>
            <Badge h={16} p="0 4px" radius={4} color="rgb(80, 43, 207)">
              스탠다드
            </Badge>
          </Flex>
        </Flex>
      </Group>
      <Group>
        <Flex gap={16} style={{ flexShrink: 0 }}>
          {headerItems.map((header) => (
            <UnstyledButton>
              <Link
                style={{
                  textDecoration: 'none',
                  color: '#2c2c2c',
                }}
                href={header.link}
                key={header.title}
              >
                <Text fw="bold" size="16px">
                  {header.title}
                </Text>
              </Link>
            </UnstyledButton>
          ))}
        </Flex>
      </Group>
      <Group w={311}>
        <Flex pr={20} gap={20}>
          <Select w={190} />
          <UnstyledButton ta="center" bg="rgb(238, 238, 238)" w={32}>
            <Text fw="bold" c="#fff" fz={16}>
              장
            </Text>
          </UnstyledButton>
          <UnstyledButton
            display="flex"
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgb(231, 231, 231)',
            }}
            ta="center"
            w={32}
            h={32}
            bg="white"
          >
            <IconSettings size={20} />
          </UnstyledButton>
        </Flex>
      </Group>
    </Container>
  );
}

export default Header;
