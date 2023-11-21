import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  SetCurrentSong,
  SetCurrentSongIndex,
  SetSelectedPlaylist,
} from "../redux/userSlice";

function SongsList() {
  const { currentSong, selectedPlaylist, allSongs } = useSelector(
    (state) => state.user
  );
  const [songsToPlay, setSongsToPlay] = React.useState([]);
  const dispatch = useDispatch();
  const [searchKey, setSearchKey] = React.useState("");

  useEffect(() => {
    if (selectedPlaylist) {
      if (
        selectedPlaylist &&
        selectedPlaylist.name === "All Songs" &&
        searchKey !== ""
      ) {
        const tempSongs = [];

        selectedPlaylist.songs.forEach((song) => {
          if (JSON.stringify(song).toLowerCase().includes(searchKey)) {
            tempSongs.push(song);
          }
        });

        setSongsToPlay(tempSongs);
      } else {
        setSongsToPlay(selectedPlaylist?.songs);
      }
    }
  }, [selectedPlaylist, searchKey]);

  return (
    <div className="flex flex-col gap-3">
      <div className="pl-3 pr-6">
        <input
          type="text"
          placeholder="Song, Artist, Album"
          className="rounded w-full p-2 border-2 border-gray-300 focus:outline-none focus:border-active"
          onFocus={() =>
            dispatch(
              SetSelectedPlaylist({
                name: "All Songs",
                songs: allSongs,
              })
            )
          }
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
        />
      </div>
      <div className="overflow-y-scroll h-[54vh] p-3 border-t border-b border-gray-300">
        {songsToPlay.map((song, index) => {
          const isPlaying = currentSong?._id === song._id;
          return (
            <div
              className={`p-2 text-white flex items-center justify-between cursor-pointer ${
                isPlaying &&
                "shadow rounded text-active font-bold border-active border-2"
              }`}
              onClick={() => {
                dispatch(SetCurrentSong(song));
                dispatch(SetCurrentSongIndex(index));
              }}
            >
              <div>
                <h1 className="text-lg font-semibold">{song.title}</h1>
                <h1 className="text-sm">
                  {song.artist} {song.album} {song.year}
                </h1>
              </div>
              <div>
                <h1>{song.duration}</h1>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SongsList;
