import React, { Component } from 'react';
import axios from 'axios';
import MangaCard from './MangaCard';
import { LanguageContext } from '../Components/LanguageContext';

class MangaList extends Component {
  static contextType = LanguageContext;

  state = {
    mangaList: [],
    mangaStats: {}, // will store stats keyed by mangaId
    loading: true,
    error: null,
    page: 0,
    limit: 12,
    total: 0,
  };

  componentDidMount() {
    this.fetchMangaList();
  }

  componentDidUpdate(_, prevState) {
    // If page changed, fetch again
    if (prevState.page !== this.state.page) {
      this.fetchMangaList();
    }
  }

  async fetchMangaList() {
    this.setState({ loading: true });
    const { page, limit } = this.state;
    try {
      // 1) Fetch a page of manga
      const mangaRes = await axios.get('https://api.mangadex.org/manga', {
        params: {
          limit,
          offset: page * limit,
          'includes[]': 'cover_art',
        },
      });

      const mangaData = mangaRes.data.data;
      const total = mangaRes.data.total || 0;

      // 2) Gather all manga IDs
      const mangaIds = mangaData.map((manga) => manga.id);

      // 3) Fetch statistics for all these IDs
      //    The /statistics/manga endpoint expects ?manga[]=id1&manga[]=id2...
      //    or a body in older versions. We'll assume query params are supported:
      //    e.g., GET /statistics/manga?manga[]=id1&manga[]=id2
      let statsDict = {};
      if (mangaIds.length > 0) {
        const statsRes = await axios.get('https://api.mangadex.org/statistics/manga', {
          params: {
            'manga[]': mangaIds, // array of IDs
          },
        });
        // statsRes.data.statistics is keyed by ID
        // e.g. statsRes.data.statistics[mangaId] = { ... }
        statsDict = statsRes.data.statistics || {};
      }

      this.setState({
        mangaList: mangaData,
        mangaStats: statsDict,
        total,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching manga or stats:', error);
      this.setState({ error, loading: false });
    }
  }

  handleNext = () => {
    this.setState((prev) => ({ page: prev.page + 1 }));
  };

  handlePrev = () => {
    this.setState((prev) => ({ page: Math.max(prev.page - 1, 0) }));
  };

  render() {
    const { mangaList, mangaStats, loading, error, page, limit, total } = this.state;
    const { language } = this.context;
    const totalPages = Math.ceil(total / limit);

    if (loading) return <p>Loading manga list...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
      <>
      <div className="container">
        <h2>Manga List</h2>
        <div className="row sm-8">
          {mangaList.map((manga) => {
            const stats = mangaStats[manga.id] || null; 
            return (
              <div key={manga.id} className="col-md-4">
                <MangaCard manga={manga} language={language} stats={stats} />
              </div>
            );
          })}
        </div>
        <div className="sm-4">
          {mangaList.map((manga) => {
            const stats = mangaStats[manga.id] || null; 
            return (
              <div key={manga.id} className="col-md-4">
                <MangaCard manga={manga} language={language} stats={stats} />
              </div>
            );
          })}
        </div>
        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center my-3">
          <button
            className="btn btn-secondary"
            onClick={this.handlePrev}
            disabled={page === 0}
          >
            Previous
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button
            className="btn btn-secondary"
            onClick={this.handleNext}
            disabled={page + 1 >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
      </>
    );
  }
}

export default MangaList;