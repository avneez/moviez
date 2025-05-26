import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import "./style.scss";
import { fetchDataFromApi, fetchDataFromAltApi } from "../../utils/api";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import MovieCard from "../../components/movieCard/MovieCard";
import Spinner from "../../components/spinner/Spinner";
import noResults from "../../assets/noResults.png";



const SearchResult = () => {
  const [data, setData] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const { query } = useParams();
  const [altApi, setAltApi] = useState(false)


  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const res = await fetchDataFromApi(
        `/search/multi?query=${query}&page=${pageNum}`
      );
      setData(res);
      setPageNum((prev) => prev + 1);
    } catch (err) {
      // If TMDB fails or times out
      const fallback = await fetchDataFromAltApi(query);
      setData(fallback);
      setAltApi(true)
    } finally {
      setLoading(false);
      console.log(data, 'data**')
    }
  };

  const fetchNextPageData = () => {
    fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then(
      (res) => {
        if (data?.results) {
          setData({
            ...data,
            results: [...data.results, ...res.results],
          });
        } else {
          setData(res);
        }
        setPageNum((prev) => prev + 1);
      }
    );
  };

  useEffect(() => {
    setPageNum(1);
    fetchInitialData();
  }, [query]);

  return (
    <div className="searchResultsPage">
      {(!data?.total_results || loading) && <Spinner initial={true} />}
      {(data?.total_results > 0 || !loading) && (
        <ContentWrapper>
          {data?.results?.length > 0 ? (
            <>
              <div className="pageTitle">
                {data?.total_results > 0 ? `Search ${data?.total_results > 1
                    ? "results"
                    : "result"
                  } of '${query}'` : 'Data not available at this moment.'}
              </div>
              <InfiniteScroll
                className="content"
                dataLength={data?.results?.length || []}
                next={fetchNextPageData}
                hasMore={!altApi ? pageNum <= data?.total_pages : false}
                loader={<Spinner />}
              >
                {data?.results.map((item, index) => {
                  if (item.media_type === "person") return;
                  return (
                    <MovieCard
                      key={index}
                      data={item}
                      fromSearch={true}
                    />
                  );
                })}
              </InfiniteScroll>
            </>
          ) : (
            <span className="resultNotFound">
              Sorry, Results not found!
              <img src={noResults} alt="no-result" />
            </span>
          )}
        </ContentWrapper>
      )}
    </div>
  );
};

export default SearchResult;