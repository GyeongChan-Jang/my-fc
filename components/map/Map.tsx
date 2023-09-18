import { Container as MapDiv, NaverMap } from 'react-naver-maps';

function Map() {
  return (
    <MapDiv
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <NaverMap />
    </MapDiv>
  );
}

export default Map;
