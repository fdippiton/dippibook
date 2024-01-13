import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Index() {
  const [places, setPlaces] = useState([]);

  /* -------------------------------------------------------------------------- */
  /*                               Get all places                               */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const fetchPlaces = async () => {
      const response = await axios.get("/places");
      const { data } = response;
      setPlaces([...data]);
    };
    fetchPlaces();
  }, []);

  return (
    <div className="mt-8 gap-x-8 gap-y-10 grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
      {places.length > 0 &&
        places.map((place) => (
          <div>
            <div className="bg-gray-500  rounded-2xl flex">
              {place.photos?.[0] && (
                <img
                  src={"http://localhost:4000/uploads/" + place.photos[0]}
                  alt=""
                  className="object-cover rounded-2xl aspect-square"
                />
              )}
            </div>
            <h3 className="font-bold ">{place.address}</h3>
            <h2 className="text-sm text-gray-500">{place.title}</h2>
            <div>$ {place.price} per night</div>
          </div>
        ))}
      {/* <Link
            to={"/account/places/" + place._id}
            className="flex cursor-pointer bg-gray-100 gap-4 p-4 rounded-2xl mb-3"
            key={place._id}
          >
            <div className="w-96 h-48 bg-gray-300  rounded-2xl">
              {place.photos.length > 0 && (
                <img
                  className="w-full h-full object-cover rounded-2xl"
                  src={"http://localhost:4000/uploads/" + place.photos[0]}
                  alt=""
                />
              )}
            </div>
            <div className=" ">
              <h2 className="text-xl text-start">{place.title}</h2>
              <p className="text-sm ">{place.description}</p>
            </div>
          </Link> */}
    </div>
  );
}

export default Index;
