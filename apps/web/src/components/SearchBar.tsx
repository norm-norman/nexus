'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSubmit: (url: string) => Promise<void>;
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await onSubmit(url.trim());
      setUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-xl px-4">
      <form
        onSubmit={handleSubmit}
        className="flex items-center bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
      >
        <input
          type="url"
          placeholder="Paste an iCal URL (.ics)…"
          className="flex-1 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 outline-none bg-transparent"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Loading…' : 'Add'}
        </button>
      </form>

      {error && (
        <div className="mt-2 px-4 py-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
