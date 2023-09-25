import React,{ useState } from 'react';
import './style.scss'
import { useNavigate } from 'react-router-dom';

const HeroBanner = () => {
const [query, setQuery] = useState('');
const navigate = useNavigate();

const searchQueryHandler = (e)=>{
  if(e.key === 'Enter' && query.length>0){
    navigate(`/search/${query}`)
  }
}

  return (
    <div className="heroBanner">
      <div className="wrapper">
        <div className="heroBannerContent">
          <span className="title">Welcome</span>
          <span className="subTitle">
            To the world of movies, where you can discover millions of movies.
            Explore now.
          </span>
          <div className="searchInput">
            <input type="text"
            placeholder='Search'
            onChange={(e)=> setQuery(e.target.value)}
            onKeyUp={searchQueryHandler}
            />
            <button onClick={
              ()=>console.log('search')
            }>Search</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroBanner