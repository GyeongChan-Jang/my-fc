// 맵 우측 상단에 표시되는 컨트롤입니다!(영역분석, 주변가게, 공공정보)
import { Image, Text, UnstyledButton } from '@mantine/core';
import {
  Box,
  Button,
  Container,
  Flex,
  Group,
  Popover,
  SimpleGrid,
  useMantineTheme,
} from '@mantine/core';
import { IconLiveView, IconPolygon, IconX } from '@tabler/icons-react';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useToggle } from 'react-use';

// const usePopoverStyles = createStyles((theme) => ({
//     dropdownItem: {
//         color: theme.colors['fc-gray'].at(-3),
//         height: '44px',
//         fontfz: '14px',
//         '&:hover': {
//             backgroundColor: theme.colors['fc-gray'].at(1),
//         },
//     },
// }));

type MapOverlayControlProps = {
  isDong: boolean;
  dongToggle: () => void;
  isRadius: boolean;
  radiusToggle: (nextValue?: any) => void;
  setRadiusArray: Dispatch<SetStateAction<string[]>>;
};

const MapOverlayControl = ({
  isDong,
  dongToggle,
  isRadius,
  radiusToggle,
  setRadiusArray,
}: MapOverlayControlProps) => {
  const theme = useMantineTheme();

  // const { classes } = usePopoverStyles();

  const [area, areaToggle] = useToggle(false);
  const [near, nearToggle] = useToggle(false);
  const [pub, publicToggle] = useToggle(false);

  // 행정동 선택시 클릭 handler
  const handleArea = () => {
    areaToggle();
    dongToggle();
  };

  // ESC 버튼 -> 행정동 경계 종료
  useEffect(() => {
    const escFunction = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDong) {
        areaToggle(false);
        dongToggle();
        radiusToggle(false);
      }
    };
    document.addEventListener('keydown', escFunction, false);
    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [isDong, area]);

  // 반경 선택시 클릭 handler
  const startRadius = () => {
    areaToggle();
    radiusToggle();
    const id = new Date().getTime().toString();
    setRadiusArray((prev) => [...prev, id]);
  };

  return (
    <Container p={0} pos={'absolute'} top={20} right={24}>
      <Flex gap={10} justify={'space-between'}>
        <Popover opened={area} position="bottom-start">
          <Popover.Target>
            <Button
              onClick={areaToggle}
              c={area || isDong || isRadius ? '#101113' : '#4e4e4e'}
              bg={area || isDong || isRadius ? '#caf0f8' : '#fff'}
              variant={area || isDong || isRadius ? 'outline' : 'basic-gray'}
              w={112}
              h={42}
            >
              영역 분석
            </Button>
          </Popover.Target>
          <Popover.Dropdown p={0}>
            <Box w={160}>
              <Group
                p="17px 14px"
                style={{
                  borderBottom: `1px solid rgb(238, 238, 238)}`,
                }}
              >
                <Flex w="100%" align="center" justify="space-between">
                  <Text fz={14} fw="bold">
                    영역 선택
                  </Text>
                  <UnstyledButton onClick={areaToggle}>
                    <IconX />
                  </UnstyledButton>
                </Flex>
              </Group>
              <Group>
                {/* <Group spacing={0}> */}
                <UnstyledButton onClick={handleArea} w="100%">
                  <Flex
                    // className={classes.dropdownItem}
                    p="7px 12px"
                    align="center"
                    gap={8}
                  >
                    <IconLiveView
                      size={20}
                      // className={classes.dropdownItem}
                    />
                    <Text fw={isDong ? 'bold' : 'normal'}>행정동 선택</Text>
                  </Flex>
                </UnstyledButton>
                <UnstyledButton w="100%">
                  <Flex
                    // className={classes.dropdownItem}
                    p="7px 12px"
                    align="center"
                    gap={8}
                  >
                    <IconPolygon
                      size={20}
                      // className={classes.dropdownItem}
                    />
                    <Text>다각형 그리기</Text>
                  </Flex>
                </UnstyledButton>
                <UnstyledButton w="100%" onClick={startRadius}>
                  <Flex
                    // className={classes.dropdownItem}
                    p="7px 12px"
                    align="center"
                    gap={8}
                  >
                    <Image w={20} src="/svg/radius-all.svg" />
                    <Text fw={isRadius ? 'bold' : 'normal'}>반경 그리기</Text>
                  </Flex>
                </UnstyledButton>
                <UnstyledButton w="100%">
                  <Flex
                    // className={classes.dropdownItem}
                    p="7px 12px"
                    align="center"
                    gap={8}
                  >
                    <Image w={20} src="/svg/radius-500.svg" />
                    <Text>반경 500m</Text>
                  </Flex>
                </UnstyledButton>
                <UnstyledButton w="100%">
                  <Flex
                    // className={classes.dropdownItem}
                    p="7px 12px"
                    align="center"
                    gap={8}
                  >
                    <Image w={20} height={20} src="/svg/radius-1000.svg" />
                    <Text>반경 1km</Text>
                  </Flex>
                </UnstyledButton>
                <UnstyledButton w="100%">
                  <Flex
                    // className={classes.dropdownItem}
                    p="7px 12px"
                    align="center"
                    gap={8}
                  >
                    <Image w={20} src="/svg/radius-2000.svg" />
                    <Text>반경 2km</Text>
                  </Flex>
                </UnstyledButton>
                <UnstyledButton w="100%">
                  <Flex
                    // className={classes.dropdownItem}
                    p="7px 12px"
                    align="center"
                    gap={8}
                  >
                    <Image w={20} src="/svg/radius-3000.svg" />
                    <Text>반경 3km</Text>
                  </Flex>
                </UnstyledButton>
              </Group>
            </Box>
          </Popover.Dropdown>
        </Popover>
        <Button bg="#fff" c={'#4e4e4e'} variant="basic-gray" w={112} h={42}>
          주변 가게
        </Button>
        <Button bg="#fff" c={'#4e4e4e'} variant="basic-gray" w={112} h={42}>
          공공 정보
        </Button>
      </Flex>
    </Container>
  );
};

export default MapOverlayControl;
