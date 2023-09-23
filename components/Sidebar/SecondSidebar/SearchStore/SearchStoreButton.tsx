// import { useMapDispatch, useMapState } from '@/contexts/mapContext';
// import { GetCommonStoreListData } from '@/hooks/swr/use-common-store-list';
import { ActionIcon, Flex, Text, useMantineTheme } from '@mantine/core';
import { IconChevronDown, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import React from 'react';

interface Props {
  opened: boolean;
  // data: GetCommonStoreListData | undefined;
  data: any;
}

// const useStyles = createStyles((theme) => ({
//     selectedStoreTitle: {
//         fontSize: '14px',
//         fontWeight: 'bold',
//         color: theme.colors['fc-dark'].at(-1),
//     },
// }));

const SearchStoreButton = ({ opened, data }: Props) => {
  const theme = useMantineTheme();
  // const mapState = useMapState();
  // const { classes } = useStyles();
  const router = useRouter();
  // const mapDispatch = useMapDispatch();

  const closeSearch = () => {
    router.push(router.pathname);
    // mapDispatch({
    //     type: 'SET_OPENED',
    //     payload: false,
    // });
  };

  return (
    <Flex
      justify="space-between"
      align="center"
      style={{
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: '4px',
      }}
    >
      <Text
        style={{
          fontSize: '14px',
          color: `${theme.colors['fc-gray'].at(-4)}`,
        }}
        // className={`${mapState.selectedMarker?.store_nm && classes.selectedStoreTitle}`}
      >
        {/* {opened ? '매장명 검색' : mapState.selectedMarker?.store_nm || '매장명 검색'} */}
        {opened ? '매장명 검색' : '매장이름'}
      </Text>
      <ActionIcon onClick={closeSearch}>
        {opened ? <IconX color="#222" /> : <IconChevronDown />}
      </ActionIcon>
    </Flex>
  );
};

export default SearchStoreButton;
