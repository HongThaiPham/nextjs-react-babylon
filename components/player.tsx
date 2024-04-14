import React from "react";
import { EngineOptions } from "@babylonjs/core";

import SceneView from "./sceneView";
import PlaybackControls from "./playerControls";
import styles from "../styles/Player.module.scss";

type PlayerProps = {
  assetUrl: string | null;
};

const Player = ({ assetUrl, ...rest }: PlayerProps) => {
  const engineOptions: EngineOptions = {
    deterministicLockstep: true,
    lockstepMaxSteps: 4
  };

  return (
    <div className={styles["AnimationPlayer"]}>
      <SceneView
        antialias
        adaptToDeviceRatio
        className={styles["render-canvas"]}
        showFps={false}
        engineOptions={engineOptions}
        {...rest}
      ></SceneView>
      <PlaybackControls />
    </div>
  );
};

export default Player;
