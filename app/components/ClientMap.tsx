'use client';

import dynamic from 'next/dynamic';

const MapWithNoSSR = dynamic(() => import('./Map'), {
  ssr: false,
});

export default function ClientMap({ center }: { center: [number, number] }) {
  return <MapWithNoSSR center={center} />;
}