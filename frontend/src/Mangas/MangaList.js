import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MangaList = ({ language }) => {
  const [mangaList, setMangaList] = useState([]);
  const [page, setPage] = useState(0);
  const [limit] = useState(20); // Items per page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMangaList = async () => {
      setLoading(true);
      setError(null);
      try {
        const offset = page * limit;
        const response = await axios.get('https://api.mangadex.org/manga', {
          params: { limit, offset, "includes[]": "cover_art" },
        });
        // Filter manga that have a title in the chosen language.
        const filtered = response.data.data.filter((manga) => {
          const titles = manga.attributes.title;
          return titles && titles[language];
        });
        setMangaList(filtered);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMangaList();
  }, [page, limit, language]);

  const handleMangaClick = (id) => {
    navigate(`/manga/${id}?lang=${language}`);
  };

  return (
    <div className="container my-4">
      <h1>Manga List</h1>
      {loading && <p>Loading manga...</p>}
      {error && <p>Error loading manga: {error.message}</p>}
      <div className="row">
        {mangaList.map((manga) => {
          // Find cover_art relationship that has a valid fileName.
          const coverRel = manga.relationships?.find(
            (rel) => rel.type === 'cover_art' && rel.attributes?.fileName
          );
          const coverUrl = coverRel?.attributes?.fileName
            ? `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}`
            : 'https://via.placeholder.com/150';

          return (
            <div key={manga.id} className="col-md-3 mb-4">
              <div
                className="card h-100"
                style={{ cursor: 'pointer' }}
                onClick={() => handleMangaClick(manga.id)}
              >
                <img
                  src={coverUrl}
                  className="card-img-top"
                  alt={manga.attributes.title[language] || 'Manga Cover'}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {manga.attributes.title[language] || 'No title available'}
                  </h5>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center">
        <button
          className="btn btn-secondary"
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
        >
          Previous
        </button>
        <span>Page {page + 1}</span>
        <button
          className="btn btn-secondary"
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MangaList;