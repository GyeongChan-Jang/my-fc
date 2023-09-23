import { Box, Divider, Flex, Group, Text, useMantineTheme } from '@mantine/core';
import { RefObject } from 'react';
import { fromMetersToText } from '../MeasureDistance/MeasurePolyline';

type DistanceInfoPointerProps = {
  distance?: number;
  distanceInfoRef: RefObject<HTMLDivElement>;
};

const DistanceInfoPointer = ({ distance, distanceInfoRef }: DistanceInfoPointerProps) => {
  const theme = useMantineTheme();

  return (
    <Box
      p={10}
      ref={distanceInfoRef}
      style={{
        position: 'fixed',
        backgroundColor: 'white',
        border: `1px solid #493AEB`,
        top: window.screenY + 10,
        left: window.screenX + 10,
      }}
      w={170}
      h={100}
    >
      <Group>
        <Flex fz={14} w="70%" justify={'space-between'} align={'center'}>
          <Text>총 거리</Text>
          <Text fw="bold" c={'#493AEB'}>
            {fromMetersToText(distance)}
          </Text>
        </Flex>
      </Group>
      <Divider my={5} mx="auto" w={150} h={1} orientation="horizontal" />
      <Text fz={12}>마우스 오른쪽 버튼 또는 'ESC' 키를 눌러 마침</Text>
    </Box>
  );
};

export default DistanceInfoPointer;
