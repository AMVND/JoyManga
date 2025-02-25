// Home.js
import React, { useContext } from 'react';
import MangaList from '../../Mangas/MangaList';
import { LanguageContext } from '../../Components/LanguageContext';

const Home = () => {
  const { language } = useContext(LanguageContext);

  return (
    <div className="container" style={{ paddingTop: '80px' }}>
      <MangaList language={language} />
    </div>
  );
};

export default Home;
