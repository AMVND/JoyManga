import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Search from './pages/Search';
import MangaDetail from './pages/MangaDetail';
import Reader from './pages/Reader';
import NotFound from './pages/NotFound';

// HashRouter: chạy đúng trên GitHub Pages kể cả khi tải lại trang (F5) hoặc mở link trực tiếp.
export default function App() {
  return (
    <HashRouter>
      <NavBar />
      <main className="container page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/manga/:id" element={<MangaDetail />} />
          <Route path="/chapter/:id" element={<Reader />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </HashRouter>
  );
}
