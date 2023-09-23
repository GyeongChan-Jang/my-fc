import { Button, Flex, Stack, Text } from '@mantine/core';
import {
  IconDeviceComputerCamera,
  IconMinus,
  IconPlus,
  IconPrinter,
  IconRuler3,
  IconSatellite,
  IconViewfinder,
} from '@tabler/icons-react';
import React, {
  Dispatch,
  MouseEvent,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useListener, useNavermaps } from 'react-naver-maps';
import domtoimage from 'dom-to-image';
import { useDisclosure } from '@mantine/hooks';
import PrintModal from './PrintModal';
// import { PANORAMA_ZINDEX } from '@/utils/constants';
import dayjs from 'dayjs';
import MapPanorama from './MapPanorama';

// const useStyles = createStyles((theme) => ({
//   controlButtonTop: {
//     borderBottomLeftRadius: 0,
//     borderBottomRightRadius: 0,
//     borderBottom: 0,
//   },
//   controlButtonBottom: {
//     borderTopLeftRadius: 0,
//     borderTopRightRadius: 0,
//   },
//   controlButtonMiddle: {
//     borderRadius: 0,
//     borderBottom: 0,
//   },
// }));

type MapControlProps = {
  mapRef: RefObject<naver.maps.Map>;
  mapType: string | undefined;
  setMapType: Dispatch<SetStateAction<string | undefined>>;
  isRoadView: boolean;
  setIsRoadView: Dispatch<SetStateAction<boolean>>;
  pointerRef: RefObject<HTMLDivElement>;
  drawingId?: string;
  endDrawing: () => void;
  setDrawingId: Dispatch<SetStateAction<string | undefined>>;
  setDistanceArray: Dispatch<SetStateAction<string[]>>;
};

const MapControl = ({
  mapRef,
  mapType,
  setMapType,
  isRoadView,
  setIsRoadView,
  pointerRef,
  drawingId,
  endDrawing,
  setDrawingId,
  setDistanceArray,
}: MapControlProps) => {
  const navermaps = useNavermaps();

  //   const { classes } = useStyles();

  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [currentPosLoading, setCurrentPosLoading] = useState<boolean>(false);

  const [mapImage, setMapImage] = useState<string | undefined>(undefined);

  const [opened, { open, close }] = useDisclosure(false);

  const [streetLayer] = useState(new navermaps.StreetLayer());

  const panoramaRef = useRef<HTMLDivElement>(null);

  const [onPanorama, setOnPanorama] = useState<boolean>(false);

  const panoramaInstance = useRef<naver.maps.Panorama>();

  const [panoramaInfo, setPanoramaInfo] = useState<naver.maps.PanoramaLocation>();

  // 거리 측정
  // 거리측정 시작
  const startDrawing = () => {
    const key = new Date().getTime().toString();
    setDistanceArray((prev) => [...prev, key]);
    setDrawingId(key);
  };

  // 미니맵 ref
  const miniMapRef = useRef<HTMLDivElement>(null);
  const miniMapInstance = useRef<naver.maps.Map>();

  // 맵 타입 변경 함수(위성지도)
  const mapTypeChange = useCallback(() => {
    if (mapType === navermaps.MapTypeId.SATELLITE) {
      return setMapType(navermaps.MapTypeId.NORMAL);
    }

    setMapType(navermaps.MapTypeId.SATELLITE);
  }, [mapType]);

  // 맵 이미지 생성 함수
  const mapImageGenerate = () => {
    open();
    const mapElement = mapRef.current?.getElement();
    setImageLoading(true);
    if (mapElement) {
      domtoimage
        .toPng(mapElement)
        .then((dataUrl) => {
          setImageLoading(false);
          setMapImage(dataUrl);
        })
        .catch((error) => {
          setImageLoading(false);
          window.alert(`${error}, 맵 이미지를 만드는데 실패했습니다!`);
        });
    }
  };

  // 확대 축소 함수
  const mapZoom = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
      const value = e.currentTarget.value;
      if (value === 'plus') {
        mapRef.current?.setZoom(mapRef.current.getZoom() + 1);
      } else {
        mapRef.current?.setZoom(mapRef.current.getZoom() - 1);
      }
    },
    [mapRef.current?.getZoom()]
  );

  // 현위치 이동 함수
  const mapCurrentLocation = () => {
    if (navigator.geolocation) {
      setCurrentPosLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosLoading(false);
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          mapRef.current?.setCenter(new navermaps.LatLng(lat, lng));
        },
        (error) => {
          setCurrentPosLoading(false);
          window.alert('현위치를 가져오는데 실패했습니다!');
          console.log(error);
          // throw new Error('현 위치를 가져오는데 실패했습니다!');
        },
        { enableHighAccuracy: true }
      );
    }
  };

  // 거리뷰 전환 함수
  const mapRoadView = () => {
    if (streetLayer.getMap()) {
      streetLayer.setMap(null);
      setIsRoadView(false);
      // 커서 Default로 변경
    } else {
      streetLayer.setMap(mapRef.current);
      setIsRoadView(true);
    }
  };

  // 맵 클릭시 파노라마 뷰 실행 함수

  useEffect(() => {
    const panomaraEvent = navermaps.Event.addListener(mapRef.current, 'click', (e) => {
      const latlng = new navermaps.LatLng(e.coord.y, e.coord.x);

      if (!isRoadView) return;
      setOnPanorama(true);
      if (!panoramaRef.current) return;
      pointerRef.current?.style.setProperty('display', 'none');

      panoramaInstance.current = new navermaps.Panorama(panoramaRef.current, {
        position: latlng,
        pov: {
          pan: 0,
          tilt: 0,
          fov: 100,
        },
      });

      // 파노라마 초기화 완료시 파노라마 정보 저장 및 미니 맵 생성
      const panoramaMinimapEvent = navermaps.Event.addListener(
        panoramaInstance.current,
        'init',
        () => {
          setPanoramaInfo(panoramaInstance.current?.getLocation());
          if (!panoramaRef.current) return;
          if (!miniMapRef.current) return;
          miniMapInstance.current = new navermaps.Map(miniMapRef.current, {
            center: latlng,
            zoom: 16,
          });
          panoramaRef.current.style.setProperty('width', window.innerWidth + 'px');
          panoramaRef.current.style.setProperty('height', window.innerHeight + 'px');
          miniMapRef.current.style.setProperty('position', 'fixed');
        }
      );

      panoramaInstance.current.setVisible(true);
      panoramaRef.current?.style.setProperty('position', 'fixed');
      return () => {
        navermaps.Event.removeListener(panoramaMinimapEvent);
      };
    });

    return () => {
      navermaps.Event.removeListener(panomaraEvent);
    };
  }, [isRoadView]);

  const measureDistanceHandelr = useCallback(() => {
    if (drawingId) {
      endDrawing();
    } else {
      startDrawing();
    }
  }, [drawingId]);

  // ESC 버튼 -> 거리측정 종료
  useEffect(() => {
    const escEvent = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (drawingId) {
          endDrawing();
        }
      }
    };

    window.addEventListener('keydown', escEvent);

    return () => {
      window.removeEventListener('keydown', escEvent);
    };
  }, [drawingId]);

  // ESC 버튼 -> 로드뷰 종료
  useEffect(() => {
    const escEvent = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isRoadView) {
        mapRoadView();
      }
    };

    window.addEventListener('keydown', escEvent);

    return () => {
      window.removeEventListener('keydown', escEvent);
    };
  }, [isRoadView]);

  return (
    <>
      <Stack
        // spacing={10}
        style={{ zIndex: 9998, position: 'absolute', right: 24, top: 200 }}
      >
        <Button
          variant={mapType === navermaps.MapTypeId.SATELLITE ? 'filled' : 'default'}
          w={60}
          h={60}
          p={5}
          onClick={mapTypeChange}
        >
          <Flex align={'center'} direction={'column'}>
            <IconSatellite />
            <Text fz={11}>위성지도</Text>
          </Flex>
        </Button>
        <Stack>
          {/* <Stack spacing={0}> */}
          <Button
            // classNames={{ root: classes.controlButtonTop }}
            variant="default"
            w={60}
            h={60}
            p={5}
            onClick={mapImageGenerate}
          >
            <Flex align={'center'} direction={'column'}>
              <IconPrinter />
              <Text fz={11}>저장.인쇄</Text>
            </Flex>
          </Button>
          <Button
            // classNames={{ root: classes.controlButtonMiddle }}
            variant={drawingId ? 'filled' : 'default'}
            w={60}
            h={60}
            p={5}
            onClick={measureDistanceHandelr}
          >
            <Flex align={'center'} direction={'column'}>
              <IconRuler3 />
              <Text fz={11}>거리측정</Text>
            </Flex>
          </Button>
          <Button
            // classNames={{ root: classes.controlButtonMiddle }}
            variant={isRoadView ? 'filled' : 'default'}
            w={60}
            h={60}
            p={5}
            onClick={mapRoadView}
          >
            <Flex align={'center'} direction={'column'}>
              <IconDeviceComputerCamera />
              <Text fz={11}>거리뷰</Text>
            </Flex>
          </Button>
          <Button
            // classNames={{ root: classes.controlButtonBottom }}
            loading={currentPosLoading}
            // loaderPosition="center"
            variant="default"
            w={60}
            h={60}
            p={5}
            onClick={mapCurrentLocation}
          >
            {!currentPosLoading && (
              <Flex align={'center'} direction={'column'}>
                <IconViewfinder />
                <Text fz={11}>현위치</Text>
              </Flex>
            )}
          </Button>
        </Stack>
        <Stack>
          {/* <Stack spacing={0}> */}
          <Button
            // classNames={{ root: classes.controlButtonTop }}
            value="plus"
            variant="default"
            w={60}
            h={60}
            p={5}
            onClick={(e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => mapZoom(e)}
          >
            <Flex align={'center'} direction={'column'}>
              <IconPlus />
              <Text fz={11}>확대</Text>
            </Flex>
          </Button>
          <Button
            // classNames={{ root: classes.controlButtonBottom }}
            value="minus"
            variant="default"
            w={60}
            h={60}
            p={5}
            onClick={(e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => mapZoom(e)}
          >
            <Flex align={'center'} direction={'column'}>
              <IconMinus />
              <Text fz={11}>축소</Text>
            </Flex>
          </Button>
        </Stack>

        {/* 저장.인쇄 모달 */}
        <PrintModal
          close={close}
          opened={opened}
          mapImage={mapImage}
          setMapImage={setMapImage}
          imageLoading={imageLoading}
        />
      </Stack>
      {/* 파노라마 뷰 */}
      <div
        ref={panoramaRef}
        id="pano"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: onPanorama ? 'block' : 'none',
          zIndex: 9999,
        }}
      >
        {onPanorama && (
          <MapPanorama
            miniMapInstance={miniMapInstance}
            miniMapRef={miniMapRef}
            panoramaRef={panoramaRef}
            onPanorama={onPanorama}
            setOnPanorama={setOnPanorama}
            pointerRef={pointerRef}
            panoramaInstance={panoramaInstance}
            panoramaInfo={panoramaInfo}
          />
        )}
      </div>
    </>
  );
};

export default MapControl;
