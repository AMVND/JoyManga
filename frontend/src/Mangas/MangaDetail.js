import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { LanguageContext } from '../Components/LanguageContext';

const MangaDetail = () => {
  const { id } = useParams();
  const { language } = useContext(LanguageContext); // current language from context

  const [manga, setManga] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [chapterPage, setChapterPage] = useState(0);
  const chapterLimit = 10; // chapters per page
  const [totalChapters, setTotalChapters] = useState(0);
  const [order, setOrder] = useState('asc'); // 'asc' for oldest->newest, 'desc' for newest->oldest
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch manga details for display purposes.
  useEffect(() => {
    const fetchMangaDetail = async () => {
      try {
        const response = await axios.get(`https://api.mangadex.org/manga/${id}`, {
          params: { "includes[]": "cover_art" },
        });
        setManga(response.data.data);
      } catch (err) {
        setError(err);
      }
    };
    fetchMangaDetail();
  }, [id]);

  // Fetch chapters using selected language, pagination and order.
  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);
      try {
        const offset = chapterPage * chapterLimit;
        const response = await axios.get(`https://api.mangadex.org/manga/${id}/feed`, {
          params: {
            "translatedLanguage[]": [language],
            limit: chapterLimit,
            offset,
            "order[updatedAt]": order,
            "includes[]": ["user"], // include uploader info
          },
        });
        setChapters(response.data.data);
        if (response.data.total) {
          setTotalChapters(response.data.total);
        }
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChapters();
  }, [id, language, chapterPage, order]);

  if (loading) return <p>Loading chapters...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const totalPages = totalChapters ? Math.ceil(totalChapters / chapterLimit) : 1;

  return (
    <div className="container my-4">
      <h1>{manga?.attributes.title.en || 'No Title'}</h1>
      <p>{manga?.attributes.description.en}</p>
      <h2>Chapters (Language: {language.toUpperCase()})</h2>
      {/* Filter dropdown to choose chapter order */}
      <div className="mb-3">
        <label htmlFor="orderSelect" className="form-label">
          Order by update:
        </label>
        <select
          id="orderSelect"
          className="form-select"
          value={order}
          onChange={(e) => {
            setChapterPage(0); // reset page to 0 on order change
            setOrder(e.target.value);
          }}
        >
          <option value="asc">Oldest to Newest</option>
          <option value="desc">Newest to Oldest</option>
        </select>
      </div>
      {chapters.length > 0 ? (
        <ul className="list-group">
          {chapters.map((chapter) => {
            // Retrieve uploader from relationships (if available)
            const uploaderRel = chapter.relationships?.find(
              (rel) => rel.type === 'user' && rel.attributes?.username
            );
            const uploaderName = uploaderRel ? uploaderRel.attributes.username : 'Unknown';
            const updatedAt = chapter.attributes.updatedAt
              ? new Date(chapter.attributes.updatedAt).toLocaleString()
              : 'N/A';

            return (
              <li key={chapter.id} className="list-group-item">
                <div>
                  <strong>
                    {chapter.attributes.chapter
                      ? `Chapter ${chapter.attributes.chapter}`
                      : 'Oneshot'}
                  </strong>
                </div>
                <div>{chapter.attributes.title || 'No title'}</div>
                <div>
                  <small>
                    Updated: {updatedAt} by {uploaderName}
                  </small>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No chapters found in the selected language.</p>
      )}
      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center my-3">
        <button
          className="btn btn-secondary"
          onClick={() => setChapterPage((prev) => Math.max(prev - 1, 0))}
          disabled={chapterPage === 0}
        >
          Previous
        </button>
        <span>
          Page {chapterPage + 1} of {totalPages}
        </span>
        <button
          className="btn btn-secondary"
          onClick={() => setChapterPage((prev) => prev + 1)}
          disabled={chapterPage + 1 >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MangaDetail;