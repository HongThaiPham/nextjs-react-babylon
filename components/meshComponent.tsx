import React, { Suspense, useEffect, useState } from "react";
import { Model, ILoadedModel, useBeforeRender } from "react-babylonjs";
import { Vector3, AbstractMesh, Scene } from "@babylonjs/core";

import useStore, { AppState } from "../useStore";

const MeshComponent: React.FC<{ position: Vector3 }> = ({
  position = new Vector3(0, 0, 0)
}) => {
  const sceneRef: Scene = useStore((state: AppState) => state.player.sceneRef);
  const [modelRef, setModelRef] = useStore((state: AppState) => [
    state.player.modelRef,
    state.setModelRef
  ]);
  const setCameraTarget = useStore((state: AppState) => state.setCameraLookAt);
  const setTotalFrames = useStore((state: AppState) => state.setTotalFrames);
  const [frame, setFrame] = useStore((state: AppState) => [
    state.animation.frame,
    state.setFrame
  ]);

  const baseUrl = `${window.origin}/junkrat/`; // test model with animations;
  const [modelLoaded, setModelLoaded] = useState(false);

  // useBeforeRender((scene) => {
  //   if (scene?.animationGroups[0]?.isPlaying) {
  //       console.log('before Render: ', scene.isReady());
  //       let ra = scene.animationGroups[0]?.targetedAnimations[0]?.animation.runtimeAnimations;
  //       if (ra && ra.length) {
  //           const currentFrame = parseInt(ra[0]!.currentFrame.toFixed());
  //           setFrame(currentFrame);
  //           // const time = currentFrame / 60;
  //       }
  //   }
  // });

  function onModelLoaded(model: ILoadedModel) {
    if (model instanceof AbstractMesh) {
      setModelRef(model);
      const animationGroups = model.animationGroups
        ? model.animationGroups[0]
        : null;
      console.log("model animation: ", animationGroups);

      const totalFrames = model.animationGroups
        ? model.animationGroups[0]!.to
        : 0;

      setTotalFrames(totalFrames);
      setCameraTarget(position);
      console.log("onModelLoaded: ", model);
    }

    if (sceneRef) {
      sceneRef.animationGroups[0]?.stop();
      setFrame(0);
    }
  }

  return (
    <Suspense fallback={<box name="fallback" position={position} />}>
      <Model
        name="rkkModel"
        rootUrl={baseUrl}
        sceneFilename={"scene.gltf"}
        scaleToDimension={1}
        position={position}
        onModelLoaded={onModelLoaded}
      />
    </Suspense>
  );
};

export default MeshComponent;
