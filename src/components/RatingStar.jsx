import React from 'react'

const RatingStar = ({rating}) => {
    const stars = [];
    for (let index = 1; index < 5; index++) {
        stars.push(<i key={index} className={`ri-star${index <= rating ? '-fill' : '-line'}`}></i>)
    }
  return (
    <div>
       {stars}
    </div>
  )
}

export default RatingStar