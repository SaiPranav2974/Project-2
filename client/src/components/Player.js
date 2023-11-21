import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  SetCurrentSong,
  SetCurrentSongIndex,
  SetIsPlaying,
  SetCurrentTime,
} from "../redux/userSlice";

function Player() {
  const [volume, setVolume] = useState(0.5);
  const [shuffleOn, setShuffleOn] = useState(false);
  const dispatch = useDispatch();
  const { currentSong, currentSongIndex, allSongs, isPlaying, currentTime } =
    useSelector((state) => state.user);
  const audioRef = React.createRef();

  const onPlay = () => {
    audioRef.current.play();
    dispatch(SetIsPlaying(true));
  };
  const onPause = () => {
    audioRef.current.pause();
    dispatch(SetIsPlaying(false));
  };

  const onPrev = () => {
    if (currentSongIndex !== 0 && !shuffleOn) {
      dispatch(SetCurrentSongIndex(currentSongIndex - 1));
      dispatch(SetCurrentSong(allSongs[currentSongIndex - 1]));
    } else {
      const randomIndex = Math.floor(Math.random() * allSongs.length);
      dispatch(SetCurrentSongIndex(randomIndex));
      dispatch(SetCurrentSong(allSongs[randomIndex]));
    }
  };

  const onNext = () => {
    if (currentSongIndex !== allSongs.length - 1 && !shuffleOn) {
      dispatch(SetCurrentSongIndex(currentSongIndex + 1));
      dispatch(SetCurrentSong(allSongs[currentSongIndex + 1]));
    } else {
      const randomIndex = Math.floor(Math.random() * allSongs.length);
      dispatch(SetCurrentSongIndex(randomIndex));
      dispatch(SetCurrentSong(allSongs[randomIndex]));
    }
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [currentSong]);

  useEffect(() => {
    if (!currentSong && allSongs.length > 0) {
      dispatch(SetCurrentSong(allSongs[0]));
    }
  }, [allSongs]);

  useEffect(() => {
    if (currentTime) {
      audioRef.current.currentTime = currentTime;
    }
  }, []);
  return (
    <div className="absolute bottom-0 left-0 right-0 p-5 shadow-lg bg-black border-grey">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 w-96">
          <img
            className="h-20 w-24"
            src="https://img.freepik.com/free-vector/abstract-flat-line-with-music-note-motion-shapes-pattern-cover-design-poster-banner-decoration_460848-15092.jpg"
            alt="img"
          />
          <div className="text-white">
            <h1>{currentSong?.title}</h1>
            <h1>
              {currentSong?.artist},{currentSong?.album},{currentSong?.year}
            </h1>
          </div>
        </div>
        <div className="w-96 flex flex-col items-center w-full">
          <audio
            src={currentSong?.src}
            ref={audioRef}
            onTimeUpdate={(e) => {
              dispatch(SetCurrentTime(e.target.currentTime));
            }}
          ></audio>
          <div className="flex gap-3 text-white">
            <i class="ri-skip-back-line text-4xl" onClick={onPrev}></i>
            {isPlaying ? (
              <i class="ri-pause-line text-4xl" onClick={onPause}></i>
            ) : (
              <i class="ri-play-line text-4xl" onClick={onPlay}></i>
            )}
            <i class="ri-skip-forward-line text-4xl" onClick={onNext}></i>
          </div>
          <div className="flex gap-3 items-center w-full">
            <i
              className={`ri-shuffle-line text-xl text-white ${
                shuffleOn && "text-orange-500 font-semibold"
              }`}
              onClick={() => {
                setShuffleOn(!shuffleOn);
              }}
            ></i>
              <h1 className="text-white">
                {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60)}
              </h1>
              <input
                type="range"
                className="p-0 w-full justify-center align-middle"
                min={0}
                max={Number(currentSong?.duration)}
                value={currentTime}
                onChange={(e) => {
                  audioRef.current.currentTime = parseInt(e.target.value);
                  dispatch(SetCurrentTime(parseInt(e.target.value)));
                }}
              />
            <h1 className="text-white">{currentSong?.duration}</h1>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <i
            className="ri-volume-mute-line text-2xl text-white"
            onClick={() => {
              setVolume(0);
              audioRef.current.volume = 0;
            }}
          ></i>
          <input
            type="range"
            className="p-0"
            min={0}
            max={1}
            step={0.1}
            value={volume}
            onChange={(e) => {
              audioRef.current.volume = e.target.value;
              setVolume(e.target.value);
            }}
          />
          <i
            className="ri-volume-up-line text-2xl text-white"
            onClick={() => {
              setVolume(1);
              audioRef.current.volume = 1;
            }}
          ></i>
        </div>
      </div>
    </div>
  );
}

export default Player;
