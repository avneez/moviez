import { useState, useEffect } from "react";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useFetch from "../../../hooks/useFetch";
import Img from "../../../components/lazyLoadImages/Img";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";

const HeroBanner = () => {
  const [query, setQuery] = useState("");
  const [background, setBackground] = useState("");
  const navigate = useNavigate();
  const { url } = useSelector((state) => state.home);

  const { data, loading } = useFetch("/movie/upcoming");

  useEffect(() => {
    const TMDB_IMAGE_BASE = url?.backdrop;
    const bg = TMDB_IMAGE_BASE ? TMDB_IMAGE_BASE + data?.results[Math.floor(Math.random() * 20)]?.backdrop_path : data?.results[Math.floor(Math.random() * 20)]?.backdrop_path;

    setBackground(bg);
  }, [data,url]);

  const searchQueryHandler = (e) => {
    if ((e.key === "Enter"  || e.type === "click") && query.length > 0) {
      navigate(`/search/${query}`);
    }
  };

  return (
    <div className="heroBanner">
      {!loading && (
        <div className="backdrop-img">
          <Img
            src={background}
            onError={(e) => {
              e.target.src = "/fallback.jpg";
            }}
          />
        </div>
      )}

      <div className="opacity-layer"></div>
      <ContentWrapper>
        <div className="heroBannerContent">
          <span className="title">Welcome</span>
          <span className="subTitle">
            To the world of movies, where you can discover millions of movies.
            Explore now.
          </span>
          <div className="searchInput">
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => setQuery(e.target.value)}
              onKeyUp={(e)=>searchQueryHandler(e)}
            />
            <button onClick={(e)=>searchQueryHandler(e)}>Search</button>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default HeroBanner;
