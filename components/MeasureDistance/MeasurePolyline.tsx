import { Dispatch, RefObject, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { Marker, Polyline, useListener, useNavermaps } from 'react-naver-maps';
import DistanceInfoPointer from '../Pointer/DistanceInfoPointer';
export interface MilestoneObject {
  meter: number | undefined;
  point: naver.maps.LatLng;
}

type MeasurePolylineProps = {
  mapRef: RefObject<naver.maps.Map>;
  id: string;
  drawingId?: string;
  setDistanceArray: Dispatch<SetStateAction<string[]>>;
  endDrawing: () => void;
};

export const fromMetersToText = (meters: number | undefined) => {
  if (meters === 0 || !meters) return '';
  if (meters < 1000) return `${meters.toFixed(0)}m`;
  else return `${(meters / 1000).toFixed(1)}km`;
};

const milestoneHtml = (meter?: number, html?: string) => `
    <div
        key=${meter}
        style="position:relative; width: 16px; height:16px; background-color: #fff; border:3px solid red; border-radius:10px; transform: translate(-8px, -8px)"
    >
        ${
          html
            ? html
            : `<div style="background-color:#fff; border-radius:4px; width:50px; text-align:center; transform: translate(-40%, calc(-100% - 7px));" >
            <span style="font-size:14px; color: red">${fromMetersToText(meter)}</span>
        </div>`
        }
    </div>
`;

const finishMileStoneHtml = (meter: number | undefined, id: string) => `
    <div style="position:absolute; top:10px; left: 20px; width:150px; height:90px; background-color:white; padding:10px; border:1px solid #6659EE;">
        <div style="display:flex; border-bottom: 1px solid black; padding:4px 0; margin-bottom:7px; justify-content: space-between;">
            <span>총 거리</span>
            <span>${fromMetersToText(meter)}</span>
        </div>
        <button id="${id}" style="width:100%; height:30px; cursor:pointer; border: 0; background-color: #7367F0; padding: 3px; border-radius:3px;">
            <img src="/svg/eraser.svg">
            <span style="color:white; font-weight: bold;">지우기</span>
        </button>
    </div>
`;

const MeasurePolyline = ({
  mapRef,
  id,
  drawingId,
  setDistanceArray,
  endDrawing,
}: // deleteDistanceId,
MeasurePolylineProps) => {
  const navermaps = useNavermaps();

  const distanceInfoRef = useRef<HTMLDivElement>(null);

  // 폴리라인 좌표
  // const [tempPath, setTempPath] = useState<naver.maps.LatLng[]>([]);

  // 거리 정보 infoRef
  // const distanceInfoRef = useRef<HTMLDivElement>(null);

  // 현재 위치 폴리라인 좌표
  const [clickedPath, setClickedPath] = useState<naver.maps.LatLng | null>(null);

  // 임시 폴리라인 Ref
  const tempPolylineRef = useRef<naver.maps.Polyline | null>(null);

  // 임시 폴리라인 좌표
  const [tempPolylinePath, setTempPolylinePath] = useState<naver.maps.LatLng[]>([]);

  // Milestone 좌표
  const [mileStone, setMilestone] = useState<MilestoneObject[]>([]);

  // 실제 거리측정 폴리라인 Ref
  const polylineRef = useRef<naver.maps.Polyline | null>(null);

  // 실제 거리측정 폴리라인 path
  const [polylinePath, setPolylinePath] = useState<naver.maps.LatLng[]>([]);

  // mousemove 이벤트 리스너
  const mousemoveListener = useRef<naver.maps.MapEventListener | null>(null);

  // 측정 종료 상태
  const isFinished = useMemo(() => {
    return drawingId !== id;
  }, [drawingId]);

  const deleteBtnId = `distanceClose_${id}`;

  // 거리측정 폴리라인 제거
  const deleteDistanceId = (id: string) => {
    setDistanceArray((prev) => prev.filter((item) => item !== id));
  };

  useListener(mapRef?.current, 'click', (e) => {
    if (isFinished) return;
    let point = e.coord;

    mousemoveListener.current = navermaps?.Event.addListener(mapRef?.current, 'mousemove', (e) =>
      onMouseMoveDistance(e, point)
    );

    const meter = parseInt(tempPolylineRef?.current?.getDistance().toString() || '0');

    setPolylinePath((prev) => [...prev, point]);

    setMilestone((prev) => [
      ...prev,
      {
        meter,
        point,
      },
    ]);
  });

  // 마우스 우클릭 이벤트
  useListener(mapRef?.current, 'rightclick', (e) => {
    if (mileStone.length < 2) {
      deleteDistanceId(id);
      endDrawing();
    }
    finishDistance();

    // mousemove 이벤트 리스너 제거
    mousemoveListener.current && navermaps?.Event.removeListener(mousemoveListener.current);
  });

  // ESC 키 이벤트
  useListener(mapRef?.current, 'keydown', (e) => {
    if (isFinished) return;
    if (e.domEvent.code === 'Escape') {
      if (mileStone.length < 2) {
        deleteDistanceId(id);
        endDrawing();
      }
      finishDistance();
      // mousemove 이벤트 리스너 제거
      mousemoveListener.current && navermaps?.Event.removeListener(mousemoveListener.current);
    }
  });

  const onMouseMoveDistance = (e: any, point: any) => {
    const proj = mapRef?.current?.getProjection();
    const coord = proj?.fromOffsetToCoord(e.offset) as naver.maps.LatLng;

    let tempPaths = [...tempPolylinePath];
    if (tempPaths.length > mileStone.length) {
      tempPaths.pop();
    }

    tempPaths = [...tempPaths, point, coord];

    setTempPolylinePath(tempPaths);
  };

  const finishDistance = () => {
    navermaps.Event.clearListeners(mapRef?.current, 'mousemove');

    setTempPolylinePath([]);

    endDrawing();
  };

  // 총 거리 인포창 닫기
  useEffect(() => {
    if (isFinished) {
      const distanceClose = document.getElementById(deleteBtnId);
      let closeEvent: any;

      closeEvent = distanceClose?.addEventListener('click', (e) => {
        distanceClose.removeEventListener('click', closeEvent);
        deleteDistanceId(id);
      });

      return () => {
        distanceClose?.removeEventListener('click', closeEvent);
      };
    }
  }, [isFinished]);

  return (
    <>
      {/* 임시 폴리라인 */}
      {tempPolylinePath.length > 1 && (
        <Polyline
          strokeStyle={'dash'}
          strokeColor="red"
          ref={tempPolylineRef}
          path={tempPolylinePath.slice(-2)}
        />
      )}

      {/* 실제 거리 폴리라인 */}
      {polylinePath.length > 1 && (
        <Polyline
          strokeColor="red"
          strokeWeight={3}
          ref={polylineRef}
          path={polylinePath.slice(0, mileStone.length)}
        />
      )}

      {/* 거리 표시 마일스톤 */}
      {mileStone.map((ms, index) => (
        <Marker
          icon={{
            content: milestoneHtml(
              ms.meter,
              isFinished && index + 1 === mileStone.length ? '<div />' : undefined
            ),
          }}
          key={index}
          position={ms.point}
        />
      ))}

      {/* 거리정보 info */}
      {mileStone.length > 1 && (
        <Marker
          zIndex={100}
          icon={{
            content: milestoneHtml(
              undefined,
              finishMileStoneHtml(polylineRef.current?.getDistance(), deleteBtnId)
            ),
          }}
          position={mileStone.at(-1)?.point}
          visible={isFinished}
        />
      )}

      {/* 실제 거리측정 포인터 info  */}
      {tempPolylinePath.length > 1 && !isFinished && (
        <DistanceInfoPointer
          distanceInfoRef={distanceInfoRef}
          distance={polylineRef.current?.getDistance()}
        />
      )}
    </>
  );
};

export default MeasurePolyline;
