import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import PerksLabels from "../PerksLabels";
import PhotosUploader from "../PhotosUploader";
import AccountNav from "../AccountNav";
import axios from "axios";

function PlacesFormPage() {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);

  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const fetchPlace = async () => {
      if (!id) {
        return;
      }

      const response = await axios.get("/places/" + id);
      const { data } = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
    };
    fetchPlace();
  }, [id]);

  const inputHeader = (text) => {
    return <h2 className="text-md mt-4">{text}</h2>;
  };

  const inputDescription = (text) => {
    return <p className="text-gray-500 text-sm"> {text}</p>;
  };

  const preInput = (header, description) => {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  };

  const savePlace = async (ev) => {
    ev.preventDefault();
    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
    };

    if (id) {
      // Update
      console.log(id);
      await axios.put(
        "/places",
        { id, ...placeData },
        {
          withCredentials: true,
        }
      );

      setRedirect(true);
    } else {
      // Create
      await axios.post("/places", placeData, {
        withCredentials: true,
      });

      setRedirect(true);
    }
  };

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }

  return (
    <div>
      <AccountNav />
      <form onSubmit={savePlace}>
        {preInput("Title", "Title for your place. Should be short and catchy")}

        <input
          type="text"
          placeholder="title, ex: My lovely place"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
        />
        {preInput("Address", "Address to this place")}

        <input
          type="text"
          placeholder="address"
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
        />
        {preInput("Photos", "More = better")}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
        {preInput("Description", "Description of the place")}

        <textarea
          className=""
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        ></textarea>
        {preInput("Perks", "Select all the perks of your place")}

        <PerksLabels selected={perks} onChange={setPerks} />
        <div>
          {preInput("Extra info", "House rules, etc")}

          <textarea
            value={extraInfo}
            onChange={(ev) => setExtraInfo(ev.target.value)}
          />
        </div>

        <div>
          {preInput(
            "Check in&out times",
            " Add the chech in and out times, remember to have some time window for cleaning the room"
          )}
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <div>
            <h3 className="mt-2 -mb-1">Check in time</h3>
            <input
              type="text"
              placeholder="14:00"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Check out time</h3>
            <input
              type="text"
              placeholder="11"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Max number of guests</h3>
            <input
              type="number"
              name=""
              id=""
              value={maxGuests}
              onChange={(ev) => setMaxGuests(ev.target.value)}
            />
          </div>
        </div>
        <button className="primary my-4">Save</button>
      </form>{" "}
    </div>
  );
}

export default PlacesFormPage;
