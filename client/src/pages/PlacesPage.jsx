import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import PerksLabels from "../PerksLabels";
import PhotosUploader from "../PhotosUploader";

function PlacesPage() {
  const { action } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);

  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);

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

  return (
    <div>
      {action !== "new" && (
        <div className="text-center">
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
        </div>
      )}
      {action === "new" && (
        <div>
          <form>
            {preInput(
              "Title",
              "Title for your place. Should be short and catchy"
            )}

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
            <PhotosUploader
              addedPhotos={addedPhotos}
              onChange={setAddedPhotos}
            />
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
      )}
    </div>
  );
}

export default PlacesPage;
