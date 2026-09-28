import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FestaLab — Mockups de festa com imagem realista',
    short_name: 'FestaLab',
    description:
      'Monte o mockup da decoração e gere uma imagem realista para apresentar ao cliente.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#FAFAF8',
    theme_color: '#EA580C',
    lang: 'pt-BR',
    categories: ['design', 'graphics', 'photo'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
