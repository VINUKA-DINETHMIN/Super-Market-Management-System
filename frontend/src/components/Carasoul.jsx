import React, { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel'

export const Carasoul = (props) => {
    const [carouselHeight, setCarouselHeight] = useState(300);

    const handleResize = () => {
        // Adjust the height based on screen width or any other condition
        const newHeight = window.innerWidth > 300 ? 300 : 150;
        setCarouselHeight(newHeight);
    };

    useEffect(() => {
        // Attach the resize event listener when the component mounts
        window.addEventListener('resize', handleResize);

        // Detach the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    var items = [
        {
            src: "https://static.vecteezy.com/system/resources/previews/000/267/866/original/vector-special-offer-creative-sale-banner-design.jpg"
        },
        {
            src: "https://th.bing.com/th/id/OIP.znakn1pFcY2eo1B7d_IZzQAAAA?w=197&h=197&c=7&r=0&o=5&dpr=1.3&pid=1.7"
        }
    ]

    return (
        <div className='relative'>
        <Carousel height={carouselHeight}  indicatorContainerProps={{ style: { display: 'none' } }}>
            {
                items.map((item, i) => <img src={item.src} className='w-full h-full object-cover' key={i} />)
            }
        </Carousel>
        </div>
    )
}