import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AccountNav from "../AccountNav";
import axios from "axios";

function PlacesPage() {
  const [places, setPlaces] = useState([]);

  /* -------------------------------------------------------------------------- */
  /*                              Get User's Places                             */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get("/user-places", {
          withCredentials: true,
        });
        const { data } = response;
        setPlaces(data);
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    };

    fetchPlaces();
  }, []);

  return (
    <div>
      <AccountNav />

      <div className="text-center">
        {/* ----------------------------- Add new accommodation link ----------------------------- */}
        <Link
          className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
          to={"/account/places/new"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add new place
        </Link>

        {/* ----------------------------- Accommodations List ----------------------------- */}
        <div className="mt-5">
          {places.length > 0 &&
            places.map((place) => (
              <Link
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
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

export default PlacesPage;
