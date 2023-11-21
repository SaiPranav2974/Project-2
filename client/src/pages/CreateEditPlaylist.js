import React, { useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { setUser, SetSelectedPlaylistForEdit, SetSelectedPlaylist } from "../redux/userSlice";
import Player from "../components/Player";

function CreateEditPlaylist() {
  const [name, setName] = React.useState("");
  const [selectedSongs, setSelectedSongs] = React.useState([]);
  const { allSongs, selectedPlaylistForEdit } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectUnselectSong = (song) => {
    if (selectedSongs.find((s) => s._id === song._id)) {
      setSelectedSongs(selectedSongs.filter((s) => s._id !== song._id));
    } else {
      setSelectedSongs([...selectedSongs, song]);
    }
  };

  const onAdd = async () => {
    if (name.trim().length === 0 || selectedSongs.length === 0) {
      toast.error("Please fill all fields");
    } else {
      try {
        dispatch(ShowLoading());
        const response = await axios.post(
          "/api/songs/add-playlist",
          {
            name,
            songs: selectedSongs,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        dispatch(HideLoading());
        if (response.data.success) {
          toast.success("Playlist updated successfully");
          dispatch(setUser(response.data.data))
          dispatch(SetSelectedPlaylistForEdit(null))
          setName("");
          setSelectedSongs([]);
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        dispatch(HideLoading());
        toast.error("Something went wrong");
      }
    }
  };

  const onEdit = async () => {
    if (name.trim().length === 0 || selectedSongs.length === 0) {
      toast.error("Please fill all fields");
    } else {
      try {
        dispatch(ShowLoading());
        const response = await axios.post(
          "/api/songs/update-playlist",
          {
            name,
            songs: selectedSongs,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        dispatch(HideLoading());
        if (response.data.success) {
          toast.success("Playlist updated successfully");
          dispatch(setUser(response.data.data));
          dispatch(SetSelectedPlaylistForEdit(null));
          dispatch(SetSelectedPlaylist({
            name: 'All Songs',
            songs: allSongs
          }))
          dispatch(
            SetSelectedPlaylist({
              name: "All Songs",
              songs: allSongs,
            })
          );
          setName("");
          setSelectedSongs([]);
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        dispatch(HideLoading());
        toast.error("Something went wrong");
      }
    }
  };

  useEffect(() => {
    if (selectedPlaylistForEdit) {
      setName(selectedPlaylistForEdit.name);
      setSelectedSongs(selectedPlaylistForEdit.songs);
    }
  }, [selectedPlaylistForEdit]);

  return (
    <div style={{ paddingBottom: "80px", overflowY: "scroll", height: "100vh" }}>
      <div className="flex items-center gap-5 text-white">
        <i
          className="ri-arrow-left-line text-3xl"
          onClick={() => {
            navigate("/");
          }}
        ></i>
        <h1 className="text-xl text-white">Create Playlist</h1>
      </div>
      <div className="flex justify-between gap-3 mt-5">
        <input
          className="W-96"
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <button
          className="bg-orange-500 text-white py-2 px-5"
          onClick={() => {
            if (selectedPlaylistForEdit) {
              onEdit();
            } else {
              onAdd();
            }
          }}
        >
          Save
        </button>
      </div>
      <h1 className="my-5 text-2xl text-white">Selected Songs-{selectedSongs.length}</h1>
      <div className="grid grid-cols-3 gap-3">
        {allSongs.map((song, index) => {
          const isSelected = selectedSongs.find((s) => s.id === song._id);
          return (
            <div
              key={index}
              className={`p-2 flex items-center shadow justify-between border cursor-pointer border-gray-300 rounded ${isSelected && 'border-orange-500'}`}
              onClick={() => selectUnselectSong(song)}
            >
              <div>
                <h1 className="text-white">{song.title}</h1>
                <h1 className="text-white">
                  {song.artist} {song.album}
                  {song.year}
                </h1>
              </div>
            </div>
          );
        })}
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-5 shadow-lg bg-black border-grey text-white">
        <Player />
      </div>
    </div>
  );
}

export default CreateEditPlaylist;
