import {
  Box,
  Button,
  Checkbox,
  Flex,
  LoadingOverlay,
  Modal,
  Text,
  TextInput,
  UnstyledButton,
  Image,
  Paper,
} from '@mantine/core';

import { IconX } from '@tabler/icons-react';
import React, { useRef, useState } from 'react';
import PDFPrint from '../PDFPrint/PDFPrint';

// export const printModalStyles = createStyles((theme) => ({
//     title: {
//         padding: '20px 10px 10px',
//         width: '100%',
//     },
//     modal: {
//         height: '750px',
//     },
// }));

type PrintModalProps = {
  opened: boolean;
  close: () => void;
  mapImage: string | undefined;
  setMapImage: React.Dispatch<React.SetStateAction<string | undefined>>;
  imageLoading: boolean;
};

const PrintModal = ({ opened, close, mapImage, setMapImage, imageLoading }: PrintModalProps) => {
  // const { classes } = printModalStyles();
  const [isPrint, setIsPrint] = useState(false);

  const linkRef = useRef<HTMLAnchorElement>(null);

  // 모달 닫기 함수
  const modalClose = () => {
    setMapImage(undefined);
    close();
  };

  // 인쇄하기 함수
  const printMapImage = () => {
    setIsPrint(true);
  };

  const onAfterPrint = () => {
    setIsPrint(false);
  };

  // 이미지 다운로드 함수

  return (
    <Modal
      // classNames={{ title: classes.title, modal: classes.modal }}
      size={900}
      zIndex={9999}
      opened={opened}
      onClose={close}
      withCloseButton={false}
      padding={0}
      title={
        <Flex p={'10px 20px'} justify={'space-between'} align={'center'}>
          <TextInput w={300} placeholder="제목을 입력하세요." />
          <Checkbox label="데이터 출처표시" />
          <Flex gap={10}>
            <Button onClick={printMapImage}>인쇄하기</Button>
            <Button>
              <a
                style={{ textDecoration: 'none', color: '#fff' }}
                href={mapImage}
                download={'map-image.png'}
              >
                저장하기
              </a>
            </Button>
          </Flex>
          <UnstyledButton onClick={modalClose}>
            <IconX size={20} />
          </UnstyledButton>
        </Flex>
      }
    >
      <Box style={{ borderTop: '1px solid #e9ecef' }}>
        {!imageLoading ? (
          <Flex p={10} justify={'center'}>
            <Image fit="contain" src={mapImage} alt="map-image" />
          </Flex>
        ) : (
          <LoadingOverlay visible={imageLoading} />
        )}
        <PDFPrint print={isPrint} onAfterPrint={onAfterPrint}>
          <Image fit="contain" src={mapImage} alt="map-image" />
        </PDFPrint>
      </Box>
    </Modal>
  );
};

export default PrintModal;
