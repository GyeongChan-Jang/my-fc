import { Box, Button, Flex, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import dayjs from 'dayjs';
import React, { Dispatch, MutableRefObject, RefObject, useEffect, useRef, useState } from 'react';
import { NaverMap, useListener, useNavermaps } from 'react-naver-maps';

type MapPanoramaProps = {
  panoramaRef: RefObject<HTMLDivElement>;
  onPanorama: boolean;
  setOnPanorama: Dispatch<React.SetStateAction<boolean>>;
  pointerRef: RefObject<HTMLDivElement>;
  panoramaInfo: naver.maps.PanoramaLocation | undefined;
  panoramaInstance: MutableRefObject<naver.maps.Panorama | undefined>;
  miniMapInstance: MutableRefObject<naver.maps.Map | undefined>;
  miniMapRef: RefObject<HTMLDivElement>;
};

const MapPanorama = ({
  panoramaRef,
  panoramaInstance,
  setOnPanorama,
  onPanorama,
  pointerRef,
  miniMapInstance,
  miniMapRef,
  panoramaInfo,
}: MapPanoramaProps) => {
  const directionMarkerRef = useRef<naver.maps.Marker>();
  const navermaps = useNavermaps();
  const [streetLayer] = useState(new navermaps.StreetLayer());

  // 파노라마 뷰 종료 함수
  const offPanorama = () => {
    if (!panoramaInstance.current) return;
    pointerRef.current?.style.setProperty('display', 'block');
    panoramaInstance.current.setVisible(false);
    setOnPanorama(false);
  };

  // window 창 사이즈 변화에 따라 파노라마 뷰 크기 조절
  const resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      const { width, height } = entry.contentRect;
      if (panoramaRef.current) {
        panoramaRef.current?.style.setProperty('width', `${width}px`);
        panoramaRef.current?.style.setProperty('height', `${height}px`);
      }
    }
  });

  useEffect(() => {
    if (onPanorama && panoramaRef.current) {
      resizeObserver.observe(window.document.body);
    }
  }, [panoramaRef.current, onPanorama, panoramaInstance.current]);

  // 방향 마커 생성 및 미니맵 생성
  useEffect(() => {
    if (directionMarkerRef.current) {
      directionMarkerRef.current.setMap(null);
    }

    if (!miniMapInstance.current) return;

    if (!miniMapInstance.current || !panoramaInfo) return;

    // streeyLayer 추가
    streetLayer.setMap(miniMapInstance.current);

    directionMarkerRef.current = new naver.maps.Marker({
      map: miniMapInstance.current,
      position: new naver.maps.LatLng(panoramaInfo?.coord),
      icon: {
        content: `<img id="directionMarker" src="https://partner.myfranchise.kr/img/ef4f90575f7c7dfa471f998f75e786df.svg" style="transform: rotate(${
          panoramaInstance.current?.getPov().pan
        }deg); width: 30px; height: 30px;"/>`,
      },
    });

    if (!miniMapInstance.current) return;
    directionMarkerRef.current.setMap(miniMapInstance.current);
  }, [miniMapInstance.current, panoramaInfo]);

  // 파노라마 위치 변경시 미니맵 이동
  useListener(panoramaInstance.current, 'pano_changed', () => {
    if (!miniMapInstance.current || !panoramaInstance.current) return;
    miniMapInstance.current?.setCenter(panoramaInstance.current?.getLocation().coord);
    // 미니맵 중앙으로 마커 이동
    directionMarkerRef.current?.setPosition(panoramaInstance.current?.getLocation().coord);
  });

  // 파노라마 시야 변경시 마커 회전
  useListener(panoramaInstance.current, 'pov_changed', () => {
    if (!directionMarkerRef.current || !panoramaInstance.current) return;
    directionMarkerRef.current?.setIcon({
      content: `<img id="directionMarker" src="https://partner.myfranchise.kr/img/ef4f90575f7c7dfa471f998f75e786df.svg" style="transform: rotate(${
        panoramaInstance.current?.getPov().pan
      }deg); width: 30px; height: 30px;"/>`,
    });
  });

  return (
    <>
      <Flex>
        <Box
          style={{
            top: 30,
            left: 30,
            position: 'fixed',
            zIndex: 9999 + 1,
            borderRadius: 4,
          }}
          bg="#222"
          p={10}
        >
          {panoramaInfo && (
            <Flex c="#fff" gap={5}>
              <Text fw="bold">{panoramaInfo.address}</Text>
              <Text>{dayjs(panoramaInfo.photodate).format('YYYY년 MM월 DD일')}</Text>
            </Flex>
          )}
        </Box>
        <Button
          variant="default"
          onClick={offPanorama}
          p={'10px 10px'}
          style={{
            position: 'fixed',
            zIndex: 9999 + 1,
            top: 30,
            right: 30,
            borderColor: '#222',
            backgroundColor: '#222',
            // ':hover': {
            //     backgroundColor: '#333',
            // },
          }}
        >
          <IconX color="#fff" size={20} />
        </Button>
      </Flex>
      <div
        id="minimap"
        ref={miniMapRef}
        style={{
          zIndex: 9999 + 1,
          left: 30,
          bottom: 30,
          width: 320,
          height: 240,
        }}
      ></div>
    </>
  );
};

export default MapPanorama;
