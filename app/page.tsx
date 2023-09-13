'use client';

// import Map from '@/components/map/Map';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/map/Map'), {
  ssr: false,
});

export default function HomePage() {
  return (
    <>
      <Map />
      <div>asdf</div>
    </>
  );
}
