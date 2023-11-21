import React from "react";
import SongList from "../components/SongsList";
import Playlists from "../components/Playlists";
import Player from "../components/Player";
function Home() {
  return (
    <>
      <div className="flex w-180 gap-5">
        <div className="w-3/5 h-full">
          <SongList />
        </div>
        <div className="w-2/5">
          <Playlists />
        </div>
      </div>
      <Player />
    </>
  );
}

export default Home;
