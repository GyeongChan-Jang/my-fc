import { Button, Container, Flex, Group, Select, UnstyledButton } from '@mantine/core';
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
    <Container display="flex" style={{ justifyContent: 'space-between' }}>
      <Group>
        <Flex>
          <UnstyledButton>마이프차 partner</UnstyledButton>
          <UnstyledButton>브랜드</UnstyledButton>
        </Flex>
      </Group>
      <Group>
        <Flex>
          {headerItems.map((header) => (
            <Link href={header.link} key={header.title}>
              <UnstyledButton>{header.title}</UnstyledButton>
            </Link>
          ))}
        </Flex>
      </Group>
      <Group>
        <Flex>
          <Select />
          <UnstyledButton>장</UnstyledButton>
          <UnstyledButton>설정</UnstyledButton>
        </Flex>
      </Group>
    </Container>
  );
}

export default Header;
