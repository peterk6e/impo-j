'use client';
import { useQuery } from '@tanstack/react-query';

interface Album {
  id: string;
  title: string;
  year: string;
  'first-release-date': string;
  'primary-type': string;
}

async function fetchAlbums({
  artist,
  year,
  style,
}: {
  artist?: string;
  year?: number;
  style?: string;
}) {
  const queryParts = [];
  if (style) {
    queryParts.push(`tag:${style}`);
  }
  if (artist) {
    queryParts.push(`artist:${artist}`);
  }
  if (year) {
    queryParts.push(`date:${year}`);
  }
  const query = encodeURIComponent(queryParts.join(' AND '));

  const res = await fetch(
    `https://musicbrainz.org/ws/2/release-group?query=${query}&fmt=json&limit=20`,
    {
      headers: { 'User-Agent': 'JazzExplorer/1.0.0 (you@example.com)' },
    },
  );

  console.log('Response object:', res);

  if (!res.ok) {
    throw new Error('Failed to fetch albums');
  }
  const data = await res.json();
  return data['release-groups'] as Album[];
}
export default function AlbumList({ defaultAlbums }: { defaultAlbums: Album[] }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['albums', 'jazz'],
    queryFn: () => fetchAlbums({ style: 'jazz' }),
    initialData: defaultAlbums,
  });

  if (isLoading) {
    return <p>Loading..."</p>;
  }
  if (error) {
    return <p>Error loading albums.</p>;
  }

  return (
    <ul>
      {data?.map((album) => (
        <li key={album.id}>
          {album.title} ({album['first-release-date']})
        </li>
      ))}
    </ul>
  );
}
