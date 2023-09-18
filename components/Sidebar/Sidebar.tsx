import { Box, Container, Flex, Image, Paper, Text } from '@mantine/core';
import React from 'react';

function Sidebar() {
  return (
    <Paper h="100%">
      <Container p={0} w="150px">
        <Box p={10} w="100%" h={40}>
          <Flex
            align="center"
            p={8}
            style={{ border: '1px solid rgb(238, 238, 238)', borderRadius: '6px' }}
          >
            <Image
              style={{
                flexShrink: 0,
                width: '24px',
                height: '24px',
              }}
              mr={8}
              src="https://cdn.myfranchise.kr/images/79/798YXxw5wFsG6SAuDcTk7z"
              alt="logo"
            />
            <Text fz={14} style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              경성밥상
            </Text>
          </Flex>
        </Box>
      </Container>
    </Paper>
  );
}

export default Sidebar;
