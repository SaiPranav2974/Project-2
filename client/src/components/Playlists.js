import React, { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  SetSelectedPlaylist,
  SetSelectedPlaylistForEdit,
  setUser,
} from "../redux/userSlice";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";

function Playlists() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, allSongs, selectedPlaylist } = useSelector(
    (state) => state.user
  );
  const allPlaylists = [
    {
      name: "All Songs",
      songs: allSongs,
    },
    ...user.playlists,
  ];

  const onDelete = async (name) => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post(
        "/api/songs/delete-playlist",
        {
          name,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        toast.success("Playlist deleted successfully");
        dispatch(
          SetSelectedPlaylist({
            name: "All Songs",
            songs: allSongs,
          })
        );
        dispatch(
          SetSelectedPlaylist({
            name: "All Songs",
            songs: allSongs,
          })
        );
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (!selectedPlaylist && allSongs.length > 0) {
      dispatch(SetSelectedPlaylist(allPlaylists[0]));
    }
  }, [selectedPlaylist, allSongs]);

  return (
    <div>
      <div className=" flex text-white justify-between w-full">
        <h1>Your Playlist</h1>
        <h1
          className="underline cursor-pointer"
          onClick={() => {
            navigate("/create-edit-playlist");
          }}
        >
          Create playlist
        </h1>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-10">
        {allPlaylists?.map((playlist, index) => {
          const isSelected = playlist?.name === selectedPlaylist?.name;
          return (
            <div
              className={`flex flex-col gap-3 shadow border cursor-pointer rounded p-2 ${
                isSelected && "border-orange-500"
              }`}
              onClick={() => {
                dispatch(SetSelectedPlaylist(playlist));
              }}
            >
              <h1 className="text-3xl text-white">{playlist?.name}</h1>
              <h1 className="text-xl text-white">{playlist?.songs?.length}</h1>
              <div className="flex gap-3 justify-between">
                <i
                  className="ri-delete-bin-line text-2xl text-white"
                  onClick={() => {
                    onDelete(playlist.name);
                  }}
                ></i>

                <i
                  className="ri-pencil-line text-2xl text-white"
                  onClick={() => {
                    dispatch(SetSelectedPlaylistForEdit(playlist));
                    navigate(`/create-edit-playlist`);
                  }}
                ></i>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Playlists;
