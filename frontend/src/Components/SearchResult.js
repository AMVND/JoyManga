import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Extract search query from URL
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }
    
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        // Fetch manga search results including cover art relationship
        const searchRes = await axios.get('https://api.mangadex.org/manga', {
          params: {
            title: query,
            limit: 10,
            "includes[]": "cover_art",
          },
        });
        const mangas = searchRes.data.data;
        
        // For each manga, fetch the latest updated chapter from the feed.
        // We'll use the English language for the chapter feed.
        const mangasWithLatest = await Promise.all(
          mangas.map(async (manga) => {
            try {
              const feedRes = await axios.get(`https://api.mangadex.org/manga/${manga.id}/feed`, {
                params: {
                  "translatedLanguage[]": ['en'],
                  limit: 1,
                  "order[updatedAt]": "desc",
                },
              });
              manga.latestChapter = feedRes.data.data[0] || null;
            } catch (err) {
              manga.latestChapter = null;
            }
            return manga;
          })
        );
        setResults(mangasWithLatest);
        setError(null);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  // Helper function to construct the cover image URL.
  const getCoverUrl = (manga) => {
    const coverRel = manga.relationships?.find(
      (rel) => rel.type === 'cover_art' && rel.attributes?.fileName
    );
    return coverRel?.attributes?.fileName
      ? `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}`
      : 'https://via.placeholder.com/150';
  };

  if (loading) return <p>Loading search results...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mt-4">
      <h2>Search Results for "{query}"</h2>
      {results.length > 0 ? (
        <ul className="list-group">
          {results.map((manga) => (
            <li key={manga.id} className="list-group-item">
              <div className="row">
                <div className="col-md-2">
                  <img
                    src={getCoverUrl(manga)}
                    alt={manga.attributes.title.en || 'Unknown Title'}
                    className="img-fluid"
                  />
                </div>
                <div className="col-md-10">
                  <h5>
                    <Link to={`/manga/${manga.id}?lang=en`}>
                      {manga.attributes.title.en || 'Unknown Title'}
                    </Link>
                  </h5>
                  {manga.latestChapter ? (
                    <p>
                      Latest Chapter:{" "}
                      {manga.latestChapter.attributes.chapter ||
                        "Oneshot"}{" "}
                      - {manga.latestChapter.attributes.title || "No Title"}
                      <br />
                      Updated:{" "}
                      {new Date(
                        manga.latestChapter.attributes.updatedAt
                      ).toLocaleString()}
                    </p>
                  ) : (
                    <p>No chapters found.</p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;
