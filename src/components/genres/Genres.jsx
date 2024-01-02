import React from "react";
import {useSelector} from "react-redux"

import './style.scss';

const Genres = ({genresData}) => {
    const { genres } = useSelector((state) => state.home)

    return (
        <div className="genres">
            {genresData?.map((genre) => {
                if(!genres[genre]?.name) return;
                return (
                    <div className="genre">
                        {genres[genre]?.name}
                    </div>
                )
            })}</div>
    )
}

export default Genres;