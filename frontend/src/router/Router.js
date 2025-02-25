import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home'
import MangaList from '../Mangas/MangaDetail';
import MangaDetail from '../Mangas/MangaDetail';
import SearchResults from '../Components/SearchResult';
// import Profile from './Profile';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/manga" element={<MangaList />} />
      <Route path="/manga/:id" element={<MangaDetail />} />
      <Route path="/search" element={<SearchResults />} />
      {/* <Route path="/profile" element={<Profile />} /> */}
    </Routes>
  );
};

export default Router;
