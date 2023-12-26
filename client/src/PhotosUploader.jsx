import React, { useState } from "react";
import axios from "axios";

function PhotosUploader({ addedPhotos, onChange }) {
  const [photoLink, setPhotoLink] = useState("");

  /* ---------------------------- Add photo by link --------------------------- */
  /**
   * The function `addPhotoByLink` is an asynchronous function that uploads a photo by its link and adds
   * the filename to a list of photos.
   */
  const addPhotoByLink = async (ev) => {
    ev.preventDefault();
    const { data: filename } = await axios.post(
      "/upload-by-link",
      { link: photoLink },
      { withCredentials: true }
    );
    /* The `onChange` function is a callback function that is passed as a prop to the `PhotosUploader`
 component. It is used to update the list of added photos when a new photo is uploaded. */
    onChange((prev) => {
      return [...prev, filename];
    });
    setPhotoLink("");
  };

  /* ------------------------- Upload photos from disk ------------------------ */
  /**
   * The function `uploadPhoto` is an asynchronous function that handles the uploading of photos by
   * appending them to a FormData object and making a POST request to a server endpoint using axios.
   */
  const uploadPhoto = async (ev) => {
    ev.preventDefault();
    const files = ev.target.files;
    const data = new FormData();

    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }

    try {
      axios
        .post("/upload", data, {
          headers: { "Content-type": "multipart/form-data" },
          withCredentials: true,
        })
        .then((response) => {
          /* In the code snippet, `data: filenames` is destructuring the `data` property from
          the response object returned by the axios POST request. It assigns the value of
          the `data` property to a variable named `filenames`. This allows us to access the
          response data more easily and use it in the subsequent logic. */
          const { data: filenames } = response;
          onChange((prev) => {
            return [...prev, ...filenames];
          });
        });
    } catch (error) {
      console.error("Error al subir la foto:", error);
    }
  };

  return (
    <>
      {/* The code snippet is rendering a div element with a flex layout and a
      gap of 2 units between its child elements. Inside the div, there is an
      input element and a button element. */}
      <div className="flex gap-2">
        <input
          value={photoLink}
          onChange={(ev) => setPhotoLink(ev.target.value)}
          type="text"
          placeholder={"Add using a link ... jpg"}
        />
        <button
          onClick={addPhotoByLink}
          className="bg-gray-200 grow px-4 rounded-2xl"
        >
          Add&nbsp;photo
        </button>
      </div>
      {/* The code snippet is rendering a section that displays the added photos
      and allows the user to upload more photos. */}
      <div className=" grid grid-cols-3 gap-4 mt-2 md:grid-cols-4 lg:grid-col-6">
        {addedPhotos.length > 0 &&
          addedPhotos.map((link) => (
            <div className="h-44 flex" key={link}>
              <img
                className="rounded-2xl w-full object-cover"
                src={"http://localhost:4000/uploads/" + link}
                alt=""
              />
            </div>
          ))}
        <label className="h-44 cursor-pointer items-center flex gap-1 justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
          <input
            type="file"
            multiple
            className="hidden"
            onChange={uploadPhoto}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
            />
          </svg>
          Upload
        </label>
      </div>
    </>
  );
}

export default PhotosUploader;
