import AlbumExplorer from '@/components/AlbumExplorer';

export default async function ScaleExplorerPage() {
  const res = await fetch(
    'https://musicbrainz.org/ws/2/release-group?query=tag:jazz&fmt=json&limit=10',
    {
      headers: { 'User-Agent': 'JazzExplorer/1.0.0 (you@example.com)' },
    },
  );
  const data = await res.json();
  const defaultAlbums = data['release-groups'];

  return <AlbumExplorer defaultAlbums={defaultAlbums} />;
}
