"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

type CarouselData = {
  img: string;
  name: string;
};

const data: CarouselData[] = [
  { img: `/images/slider/sliderImg_1.jpg`, name: `logotype` },
  { img: `/images/slider/sliderImg_2.jpg`, name: `logotype` },
  { img: `/images/slider/sliderImg_3.jpg`, name: `logotype` },
];

const Banner: React.FC = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      AOS.init({ duration: 1000 });
    }
  }, []);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Show only 1 slide at a time
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    adaptiveHeight: true, // Auto adjusts height based on image
    responsive: [
      {
        breakpoint: 1024, // Tablets & smaller screens
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 767, // Mobile view
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="w-full mt-0">
      <Slider {...settings}>
        {data.map((d, index) => (
          <div key={index} className="flex justify-center">
            <Image
              src={d.img}
              alt={d.name}
              width={1200} // Adjust for better clarity
              height={500}
              
              // className="h-auto w-auto object-cover border-2 border-blue-700 rounded-lg"
              className="w-full h-68 md:h-96 lg:h-[500px] object-cover "
              data-aos="zoom-in"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;
