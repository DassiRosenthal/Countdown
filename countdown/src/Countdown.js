import React, { useEffect, useState } from 'react';


export default function Countdown(props) {
    const images1 = ['0.jpg', 'A.jpg', '1.jpg', 'B.jpg', '2.jpg', '4.jpg', '3.jpg', 'C-2.jpg', 'D-2.jpg',];
    const images2 = ['3-2.jpg', 'B.jpg', '2.jpg', 'C-2.jpg', '4.jpg', '1.jpg', 'D-2.jpg', 'A.jpg', '0-2.jpg'];
    const [timeLeft, setTimeLeft] = useState(new Date('December 5, 2024 06:00:00') - new Date());
    const [timeDisplay, setTimeDisplay] = useState(1);
    const [page, setPage] = useState(0);
    const [displayCover, setDisplayCover] = useState(true);


    useEffect(() => {
        setTimeout(() => {
            setDisplayCover(false);
        }, 1000)
    }, [])

    useEffect(() => {
        setTimeout(() => {
            setTimeLeft(new Date('December 5, 2024 18:45:00') - new Date());
        }, 1000)
    }, [timeLeft])

    useEffect(() => {
        if (!displayCover) {
            setTimeout(() => {
                if (page < images1.length - 1) {
                    setPage(page + 1)
                }
                else {
                    setPage(0)
                }
            }, 6000)
        }
    }, [page, displayCover, images1.length])

    useEffect(() => {
        if (!displayCover) {
            setTimeout(() => {
                if (timeDisplay < 4) {
                    setTimeDisplay(timeDisplay + 1)
                }
                else {
                    setTimeDisplay(1)
                }
            }, 4000)
        }
    }, [timeDisplay, displayCover])


    return (
        <div className={`outer-div`}>
            {displayCover && <div><div className='mazel-tov'>MAZEL TOV!</div></div>}
            <><div className='time-left-div'>
                {timeDisplay === 1 ?
                    <div>{Math.round(timeLeft / 86400000).toLocaleString()} days</div>
                    : timeDisplay === 2 ?
                        <div>{Math.round(timeLeft / 3600000).toLocaleString()} hours</div>
                        : timeDisplay === 3 ?
                            <div>{Math.round(timeLeft / 60000).toLocaleString()} minutes</div>
                            : timeDisplay === 4 ?
                                <div>{Math.round(timeLeft / 1000).toLocaleString()} seconds</div>
                                : <div className='cant-wait'>Can't wait!</div>}

            </div>

                <div>{images1.map((img, index) =>
                    <img src={img} alt='background'
                        className={`image-1 ${page === index ? 'background-image' : (page - 1 === index || (index === images1.length - 1 && page === 0)) ? 'leave' : 'hide'}`}
                    />
                )}</div>
                <div> {images2.map((img, index) =>
                    <img src={img} alt='background' key={index}
                        className={`image-2 ${page === index ? 'background-image' : (page - 1 === index || (index === images1.length - 1 && page === 0)) ? 'leave' : 'hide'}`}
                    />
                )}</div></>
        </div>
    )
}
