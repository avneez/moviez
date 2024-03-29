import React, { useRef } from "react";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import Img from "../lazyLoadImages/Img";
import PosterFallback from "../../assets/no-poster.png";
import CircleRating from "../circleRating/CircleRating"
import Genres from "../genres/Genres";

import "./style.scss";

const Carousel = ({ data, loading, endpoint }) => {
  const carouselContainer = useRef();
  const { url } = useSelector((state) => state.home);
  const navigate = useNavigate();

  const navigation = (dir) => {
    const container =  carouselContainer.current;
    console.log('container',container,'cc',carouselContainer);
    const scrollAmount = dir === "left" ? container.scrollLeft - (container.offsetWidth + 20 ) : container.scrollLeft + (container.offsetWidth + 20);
    console.log('scrollamount',scrollAmount)
    container.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });
  } 

  const skItem = () =>{
    return (
      <div className="skeletonItem">
        <div className="posterBlock skeleton"></div>
        <div className="textBlock">
          <div className="title skeleton"></div>
          <div className="date skeleton"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="carousel">
      <ContentWrapper>
        <BsFillArrowLeftCircleFill
          className="carouselLeftNav arrow"
          onClick={() => navigation("left")}
        />
        <BsFillArrowRightCircleFill
          className="carouselRightNav arrow"
          onClick={() => navigation("right")}
        />

        {!loading ? (
          <div className="carouselItems" ref={carouselContainer}>
            {data?.map((item) => {
              const posterUrl = url.poster + item.poster_path || PosterFallback;
              return (
                <div key={item.id} className="carouselItem" onClick={()=>navigate(`/${item.media_type || endpoint}/${item.id}`)}>
                  <div className="posterBlock">
                    <Img src={posterUrl} alt={item.poster_path} />
                    <CircleRating rating={item.vote_average.toFixed(1)}/>
                    <Genres genresData={item.genre_ids.slice(0,2)}/>
                  </div>
                  <div className="textBlock">
                    <span className="title">{item.title || item.name}</span>
                    <span className="date">
                      {dayjs(item.release_date).format("MMM D, YYYY")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="loadingSkeleton">
            {skItem()}
            {skItem()}
            {skItem()}
            {skItem()}
            {skItem()}
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

export default Carousel;
