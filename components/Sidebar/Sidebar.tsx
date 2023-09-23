import {
  Box,
  Container,
  Flex,
  Text,
  UnstyledButton,
  // createStyles,
  useMantineTheme,
} from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

// const useMenuStyles = createStyles((theme) => ({
//   menuText: {
//       fontSize: 14,
//       color: theme.colors.dark.at(2),
//   },
//   menuButton: {
//       borderBottom: `1px solid ${theme.colors.gray.at(2)}`,
//       '&:hover': {
//           backgroundColor: theme.colors.gray.at(1),
//           color: theme.colors['fc-dark'].at(7),
//       },
//   },
// }));

type MarketSidebarProps = {
  menu: string;
  menuToggle: (value: string) => void;
  secondSidebar: boolean;
  secondSidebarToggle: () => void;
};

const MarketSidebar = ({
  menu,
  menuToggle,
  secondSidebar,
  secondSidebarToggle,
}: MarketSidebarProps) => {
  // const { classes } = useMenuStyles();
  const theme = useMantineTheme();

  const openSecondSidebar = (menu: string) => {
    if (!secondSidebar) secondSidebarToggle();
    menuToggle(menu);
  };

  return (
    <Container
      bg="#fff"
      p={0}
      style={{
        zIndex: 9999,
        // boxShadow: '0 5px 6px 0 rgba(0, 0, 0, 0.16)',
        borderRight: `1px solid rgb(238, 238, 238)`,
      }}
      top={59}
      left={0}
      w={170}
      h="100%"
      pos="absolute"
    >
      <Box>
        <UnstyledButton
          w="100%"
          onClick={(e: any) => openSecondSidebar(e.currentTarget.value)}
          value={'address'}
        >
          <Flex
            // className={classes.menuButton}
            bg={menu === 'address' ? 'violet' : ''}
            gap={6}
            p={'10px 16px'}
            align="center"
          >
            <Text
              c={menu === 'address' ? 'violet' : 'gray'}
              fw={menu === 'address' ? 'bold' : 'normal'}
              // className={classes.menuText}
              fz={14}
            >
              주소로 검색
            </Text>
          </Flex>
        </UnstyledButton>
      </Box>
      <Box>
        <UnstyledButton
          w="100%"
          onClick={(e: any) => openSecondSidebar(e.currentTarget.value)}
          value={'ranking'}
        >
          <Flex
            bg={menu === 'ranking' ? 'violet' : ''}
            // className={classes.menuButton}
            gap={6}
            p={'10px 16px'}
            align="center"
          >
            <Text
              c={menu === 'ranking' ? 'violet' : 'gray'}
              // className={classes.menuText}
              fz={14}
            >
              맛집랭킹 정보
            </Text>
          </Flex>
        </UnstyledButton>
      </Box>
      <Box>
        <UnstyledButton
          w="100%"
          onClick={(e: any) => openSecondSidebar(e.currentTarget.value)}
          value={'region'}
        >
          <Flex
            bg={menu === 'region' ? 'violet' : ''}
            // className={classes.menuButton}
            gap={6}
            p={'10px 16px'}
            align="center"
          >
            <Text
              c={menu === 'region' ? 'violet' : 'gray'}
              // className={classes.menuText}
              fz={14}
            >
              지역 상권 정보
            </Text>
          </Flex>
        </UnstyledButton>
      </Box>
      {/* 사이드바 닫기 버튼 */}
      {menu !== '' && (
        <UnstyledButton
          onClick={() => secondSidebarToggle()}
          pos={'absolute'}
          w={40}
          h={70}
          bg={'#fff'}
          style={{
            zIndex: 999999999999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            top: '50%',
            left: secondSidebar ? 510 : 170,
            borderTopRightRadius: 4,
            borderBottomRightRadius: 4,
            transform: 'translateY(-50%)',
            // boxShadow: '0 5px 6px 0 rgba(0, 0, 0, 0.16)',
          }}
        >
          {secondSidebar ? <IconChevronLeft /> : <IconChevronRight />}
        </UnstyledButton>
      )}
    </Container>
  );
};

export default MarketSidebar;
