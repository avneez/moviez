import { useEffect } from "react";
import { BrowserRouter,Routes, Route  } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDataFromApi } from "./utils/api";
import { getApiConfiguration } from "./store/homeSlice";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Details from "./pages/details/Details";
import SearchResult from "./pages/searchResult/SearchResult";
import Explore from "./pages/explore/Explore";
import PageNotFound from "./pages/404/PageNotFound";

function App() {
  const dispatch = useDispatch();
  const {data} = useSelector((store) => store.home);

  useEffect(() => {
    apiTesting();
  }, []);

  const apiTesting = () => {
    fetchDataFromApi("/movie/popular").then((res) => {
      console.log('res',res);
      dispatch(getApiConfiguration(res));
    });
  };

  return (
    <>
      <div style={{ color: "white" }} className="App">
        App
        {data?.total_pages}
      </div>
    </>
  );
}

export default App;
