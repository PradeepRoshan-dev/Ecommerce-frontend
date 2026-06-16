import React, { useEffect, useState } from "react";
import "./Banner.css";

function Banner() {

  const banners = [

    {
  category: "Gaming Laptops",
  title: "High-Performance Gaming Laptops",
  content:
    "Experience ultra-smooth gameplay with powerful gaming laptops featuring advanced graphics, high refresh rates, and cutting-edge performance.",
  image: "gamelaptop.png"
},

{
  category: "Gaming Phones",
  title: "Next-Gen Gaming Smartphones",
  content:
    "Dominate every match with gaming phones built for speed, featuring powerful processors, immersive displays, and long-lasting battery life.",
  image: "setup.png"
},

{
  category: "Gadgets",
  title: "Premium Gaming Gadgets",
  content:
    "Upgrade your setup with gaming keyboards, mice, headsets, controllers, and gadgets designed for precision and comfort.",
  image: "electronicimg.png"
},

{
  category: "Gaming Chairs",
  title: "Ultimate Comfort Gaming Chairs",
  content:
    "Stay comfortable during long gaming sessions with ergonomic gaming chairs built for support, style, and performance.",
  image: "chair.png"
},

{
  category: "Gaming Toys",
  title: "Fun Gaming Collectibles & Toys",
  content:
    "Explore action figures, collectibles, gaming-themed toys, and merchandise inspired by your favorite games and characters.",
  image: "bench.png"
}

  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {

    const slider = setInterval(() => {

      if(current === banners.length - 1){
        setCurrent(0);
      }

      else{
        setCurrent(current + 1);
      }

    }, 4000);

    return () => clearInterval(slider);

  }, [current]);

  return (

    <div className="banner">

      {/* LEFT SIDE */}

      <div className="banner-left">

        <h4>
          NEW COLLECTION - <span className="categories"> {banners[current].category} </span>
        </h4>

        <h1>
          {banners[current].title}
        </h1>

        <p>
          {banners[current].content}
        </p>

        <button>
          Shop Now
        </button>

      </div>

      {/* RIGHT SIDE */}

      <div className="banner-right">

        

        <img
          className="banner-image"
          src={banners[current].image}
          alt="banner"
        />

        <h1 className="background-text">
          {banners[current].category}
        </h1>

      </div>

    </div>

  );
}

export default Banner;