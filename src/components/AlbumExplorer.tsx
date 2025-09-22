'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as Select from '@radix-ui/react-select';

interface Album {
  id: string;
  title: string;
  'first-release-date': string;
  'primary-type': string;
}

interface AlbumExplorerProps {
  defaultAlbums: Album[];
}

async function fetchAlbums({
  artist,
  decade,
  style,
}: {
  artist?: string;
  decade?: string;
  style?: string;
}) {
  const queryParts = ['tag:jazz'];
  if (style) {
    queryParts.push(`tag:${style}`);
  }
  if (artist) {
    queryParts.push(`artist:${artist}`);
  }
  if (decade) {
    queryParts.push(`date:${decade}-01-01 TO ${decade}-12-31`);
  }

  const query = encodeURIComponent(queryParts.join(' AND '));

  const res = await fetch(
    `https://musicbrainz.org/ws/2/release-group?query=${query}&fmt=json&limit=20`,
    {
      headers: { 'User-Agent': 'JazzExplorer/1.0.0 (you@example.com)' },
    },
  );

  if (!res.ok) {
    throw new Error('Failed to fetch albums');
  }
  const data = await res.json();
  return data['release-groups'] as Album[];
}

export default function AlbumExplorer({ defaultAlbums }: AlbumExplorerProps) {
  const [artist, setArtist] = useState('');
  const [decade, setDecade] = useState('');
  const [style, setStyle] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['albums', artist, decade, style],
    queryFn: () => fetchAlbums({ artist, decade, style }),
    initialData: defaultAlbums,
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Album Explorer</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search artist..."
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className="px-4 opacity-90 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
        />

        <Select.Root value={decade} onValueChange={setDecade}>
          <Select.Trigger className="bg-custom px-4 py-2 border rounded-md w-32">
            <Select.Value placeholder="decade" />
          </Select.Trigger>
          <Select.Content className="bg-custom rounded-md shadow-lg mt-1">
            {['1950', '1960', '1970', '1980', '1990', '2000', '2010'].map((d) => (
              <Select.Item key={d} value={d} className="px-4 py-2 hover:bg-neutral-800">
                {d}s
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        <Select.Root value={style} onValueChange={setStyle}>
          <Select.Trigger className="bg-custom text-neutral-800 px-4 py-2 border rounded-md w-32">
            <Select.Value placeholder="style" />
          </Select.Trigger>
          <Select.Content className="bg-custom text-neutral-800  rounded-md shadow-lg mt-1">
            {['Bebop', 'Cool', 'Swing', 'Free', 'Fusion', 'Hard Bop'].map((s) => (
              <Select.Item key={s} value={s} className="px-4 py-2 hover:bg-gray-300">
                {s}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-amber-400 text-neutral-900 font-semibold rounded-md hover:bg-amber-300 transition"
        >
          Search
        </button>
      </div>

      {/* Albums List */}
      {isLoading ? (
        <p>Loading albums...</p>
      ) : (
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data?.map((album) => (
            <li
              key={album.id}
              className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow hover:shadow-lg transition"
            >
              <h2 className="font-semibold text-amber-400">{album.title}</h2>
              <p className="text-neutral-700 dark:text-neutral-300">
                {album['first-release-date']} — {album['primary-type']}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
