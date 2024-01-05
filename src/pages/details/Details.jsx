import React from 'react'
import { useParams } from 'react-router-dom'
import useFetch from '../../hooks/useFetch';
import DetailsBanner from './detailsBanner/DetailsBanner';

const Details = () => {
  // const { mediaType, id } = useParams();
  // const { data: credits, loading: creditsLoading } = useFetch(`/${mediaType}/${id}/credits`);

  return (
    <div> <DetailsBanner /> </div>
  )
}

export default Details