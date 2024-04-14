import React, { useState } from "react";
import { AbstractMesh, Scene, Vector3 } from "@babylonjs/core";

import useStore from "../useStore";

import { ActionIcon, Select, Slider } from "@mantine/core";
import { Target, PlayerPlay, PlayerPause, Repeat } from "tabler-icons-react";
import styles from "../styles/Player.module.scss";

const speedOptions = [
  { label: "x0.25", value: "0.25" },
  { label: "x0.5", value: "0.5" },
  { label: "x0.75", value: "0.75" },
  { label: "x1.0", value: "1" },
  { label: "x2.0", value: "2" },
  { label: "x4.0", value: "4" },
  { label: "x8.0", value: "8" }
];

type PlaybackControlsTypes = {
  totalFrames?: number;
  isPlaying?: boolean;
  loop?: boolean;
  cameraLock?: boolean;
  play?: () => void;
  pause?: () => void;
  toggleLoop?: (loop: boolean) => void;
  toggleCameraLock?: (cameraLock: boolean) => void;
  onSeek?: (targetFrame: number) => void;
  onSpeedChange?: (playBackSpeed: number) => void;
};

const PlaybackControls = (props: PlaybackControlsTypes) => {
  const {
    totalFrames = 200,
    isPlaying = false,
    loop = true,
    cameraLock = true,
    play,
    pause,
    toggleLoop,
    toggleCameraLock,
    onSeek,
    onSpeedChange
  } = props;

  const [isCameraLocked, setIsCameraLocked] = useState<boolean>(cameraLock);
  const [isLooping, setIsLooping] = useState<boolean>(loop);
  const [_isPlaying, setIsPlaying] = useState<boolean>(isPlaying);
  const [speed, setSpeed] = useState<number>(1);

  const [frame, setFrame] = useStore((state) => [
    state.animation.frame,
    state.setFrame
  ]);
  const sceneRef: Scene = useStore((state) => state.player.sceneRef);
  const modelRef: AbstractMesh = useStore((state) => state.player.modelRef);
  const setCameraTarget = useStore((state) => state.setCameraLookAt);

  const _onSpeedChange = (value: string) => {
    const speed = parseFloat(value);
    setSpeed(speed);
    if (sceneRef) {
      sceneRef!.animationGroups[0]!.speedRatio = speed;
    }

    if (onSpeedChange) onSpeedChange(speed);
  };

  const _onSliderChange = (value: number) => {
    setFrame(value);
    if (sceneRef) {
      sceneRef.animationGroups[0]!.goToFrame(value);
    }

    if (onSeek) onSeek(value);
  };

  const _toggleCameraLock = () => {
    const newCameraLock = !isCameraLocked;
    setIsCameraLocked(newCameraLock);

    if (sceneRef && modelRef) {
      const camera = sceneRef.getCameraByName("arcCamera");

      if (newCameraLock) {
        const pos = modelRef.getAbsolutePosition();
        setCameraTarget(new Vector3(pos.x, pos.y, pos.z));
      } else {
        setCameraTarget(new Vector3(0, -2, -3));
      }
    }

    if (toggleCameraLock) toggleCameraLock(!cameraLock);
  };

  const _toggleLoop = () => {
    setIsLooping(!isLooping);

    if (toggleLoop) toggleLoop(!isLooping);
  };

  const _playAnimation = () => {
    setIsPlaying(true);
    console.log("play func", sceneRef);
    if (sceneRef) {
      console.log("SHOULD LOOP", isLooping);
      if (!isLooping) {
        sceneRef?.animationGroups[0]?.onAnimationEndObservable.addOnce(() => {
          setIsPlaying(false);
          setFrame(0);
        });
      }

      sceneRef.animationGroups[0]!.play(isLooping);
    }

    if (play) play();
  };

  const _pauseAnimation = () => {
    setIsPlaying(false);
    if (sceneRef) {
      sceneRef.animationGroups[0]!.pause();
    }

    if (pause) pause();
  };

  const handlePlayOrPause = (isPlaying: boolean) => {
    console.log("HANDLEPLAYPAUSE");
    if (isPlaying) {
      _pauseAnimation();
    } else {
      _playAnimation();
    }
  };

  return (
    <div className={styles["PlaybackControls"]}>
      <div className={styles["PlaybackControls__leftSide"]}>
        <ActionIcon
          className={styles["PlaybackControls__loopBtn"]}
          onClick={_toggleLoop}
        >
          <Repeat color={isLooping ? "#f5f5f5" : "#8D8D90"} />
        </ActionIcon>
        <ActionIcon className={styles["PlaybackControls__speedSelect"]}>
          <Select
            className={styles["PlaybackControls__speedSelect--value"]}
            data={speedOptions}
            dropdownPosition={"top"}
            onChange={_onSpeedChange}
            rightSection={<></>}
            rightSectionWidth={0}
            value={speed.toString()}
          />
        </ActionIcon>
        <ActionIcon
          className={styles["PlaybackControls__cameraLockBtn"]}
          onClick={_toggleCameraLock}
        >
          <Target color={isCameraLocked ? "#f5f5f5" : "#8D8D90"} />
        </ActionIcon>
        <ActionIcon
          className={styles["PlaybackControls__playBtn"]}
          onClick={() =>
            handlePlayOrPause(
              sceneRef?.animationGroups[0]?.isPlaying ? true : false
            )
          }
        >
          {!sceneRef?.animationGroups[0]?.isPlaying ? (
            <PlayerPlay />
          ) : (
            <PlayerPause />
          )}
        </ActionIcon>
      </div>
      <div className={styles["PlaybackControls__centerSide"]}>
        <Slider
          style={{ width: "100%" }}
          min={0}
          max={totalFrames}
          onChange={_onSliderChange}
          value={frame}
        />
      </div>
    </div>
  );
};

export default PlaybackControls;
