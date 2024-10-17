import { Container } from "./HomeStyle";
import React, { useState, useEffect } from "react";
// import Summary from "./Manga-summary";
// import Chapter from "./Chapter";
// import Footer from "./Footer";
const Home = () => {
    // const [chaps, setChap] = useState({});
    // function fetch_keys(chaps) {
    //     var keys = Object.keys(chaps);
    //     return keys;
    // }
    // useEffect(() => {
    //     const fetchChapters = async () => {
    //         try {
    //             const response = await fetch("http://localhost:3001/chapter.json");
    //             if (!response.ok) {
    //                 throw new Error("Failed to fetch chapters");
    //             }
    //             const data = await response.json();
    //             setChap(data);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };
    //     fetchChapters();
    // }, []);
    return (
        <Container>
            {/* <Summary latest={Math.max(...fetch_keys(chaps))} />
            <Chapter chaps={chaps} />
            <Footer /> */}
        </Container>
    );
};
export default Home;