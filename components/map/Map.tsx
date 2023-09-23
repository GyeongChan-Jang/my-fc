// 'use client';

import { useEffect, useRef, useState } from 'react';
import { Container as MapDiv, NaverMap, useNavermaps } from 'react-naver-maps';
import MapOverlayControl from '../MapOverlayControl/MapOverlayControl';
import MapControl from '../MapControl/MapControl';
import { useDebouncedState } from '@mantine/hooks';
import { useToggle } from 'react-use';
import MeasurePolyline from '../MeasureDistance/MeasurePolyline';

function Map() {
  const [init, setInit] = useState(false);
  const [mapType, setMapType] = useState<string | undefined>(undefined);

  const mapRef = useRef<naver.maps.Map>(null);

  // 로드뷰 포인터 Ref
  const pointerRef = useRef<HTMLDivElement>(null);

  const [navermaps, setNavermaps] = useState<typeof naver.maps | undefined>(undefined);

  // 지도 중앙 좌표
  const [center, setCenter] = useState<{ lat: string; lgt: string }>({
    lat: '37.5657',
    lgt: '126.9769',
  }); // [lat, lng

  // 선택된 지역 정보
  // const [selectedRegion, setSelectedRegion] = useState<
  //     SiRegionInfo | DongRegionInfo | GuRegionInfo | null
  // >(null);
  const [selectedRegion, setSelectedRegion] = useState(null);

  // 로드뷰 포인트 생성
  const [isRoadView, setIsRoadView] = useState<boolean>(false);

  // 거리 측정 아이디
  const [drawingId, setDrawingId] = useState<string>();

  // 거리측정 개수 배열
  const [distanceArray, setDistanceArray] = useState<string[]>([]);

  // 반경 그리기 아이디
  const [radiusId, setRadiusId] = useState<string>();

  // 반경 그리기 개수 배열
  const [radiusArray, setRadiusArray] = useState<string[]>([]);

  // 맵 오버레이 컨트롤 상태
  // 행정동 선택
  const [isDong, dongToggle] = useToggle(false);

  // 반경 그리기 상태
  const [isRadius, radiusToggle] = useToggle(false);

  // 행정동 선택 마우스 포인터 위치
  const [position, setPosition] = useDebouncedState<{ lat: string; lgt: string }>(
    { lat: '', lgt: '' },
    500
  );

  // 거리측정 종료
  const endDrawing = () => {
    setDrawingId(undefined);
  };

  return (
    <MapDiv
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <>
        <MapOverlayControl
          isDong={isDong}
          dongToggle={dongToggle}
          isRadius={isRadius}
          radiusToggle={radiusToggle}
          setRadiusArray={setRadiusArray}
        />
        <MapControl
          mapRef={mapRef}
          mapType={mapType}
          setMapType={setMapType}
          isRoadView={isRoadView}
          setIsRoadView={setIsRoadView}
          pointerRef={pointerRef}
          endDrawing={endDrawing}
          drawingId={drawingId}
          setDrawingId={setDrawingId}
          setDistanceArray={setDistanceArray}
        />
      </>
      <NaverMap
        defaultZoom={12}
        defaultCenter={{ lat: 37.5657, lng: 126.9769 }}
        ref={mapRef}
        mapTypeId={mapType}
      >
        {/* 거리 측정 */}
        {distanceArray.map((id) => (
          <MeasurePolyline
            key={id}
            id={id}
            mapRef={mapRef}
            setDistanceArray={setDistanceArray}
            drawingId={drawingId}
            endDrawing={endDrawing}
          />
        ))}
      </NaverMap>
    </MapDiv>
  );
}

export default Map;
