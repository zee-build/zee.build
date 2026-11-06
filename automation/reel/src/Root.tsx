import React from "react";
import { Composition } from "remotion";
import { Vox } from "./Vox";
import { StyleHook, StyleZee } from "./v2/Frames";
import { Ep01, EP01_FRAMES } from "./v3/Ep01";
import { Style02Open, Style02Cash } from "./v4/Style02";
import { Ep02, EP02_FRAMES } from "./v5/Ep02";
import { Style03Queue, Style03Cta } from "./v6/Style03";
import { Ep03, EP03_FRAMES } from "./v6/Ep03";
import { Illo } from "./illo/Illos";
import { CoverEp01, ReelCover } from "./v7/Cover";
import { Short, shortMetadata, type ShortProps } from "./v7/Short";

export const Root: React.FC = () => (
  <>
    <Composition id="VoxEp01" component={Vox} durationInFrames={400} fps={30} width={1080} height={1920} />
    <Composition id="StyleHook" component={StyleHook} durationInFrames={120} fps={30} width={1080} height={1920} />
    <Composition id="StyleZee" component={StyleZee} durationInFrames={120} fps={30} width={1080} height={1920} />
    <Composition id="Ep01" component={Ep01} durationInFrames={EP01_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="Style02Open" component={Style02Open} durationInFrames={90} fps={30} width={1080} height={1920} />
    <Composition id="Style02Cash" component={Style02Cash} durationInFrames={90} fps={30} width={1080} height={1920} />
    <Composition id="Ep02" component={Ep02} durationInFrames={EP02_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="Style03Queue" component={Style03Queue} durationInFrames={90} fps={30} width={1080} height={1920} />
    <Composition id="Style03Cta" component={Style03Cta} durationInFrames={90} fps={30} width={1080} height={1920} />
    <Composition id="Ep03" component={Ep03} durationInFrames={EP03_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="Illo" component={Illo} durationInFrames={1} fps={30} width={900} height={900} defaultProps={{ kind: "cage-inbox" as const }} />
    <Composition id="Short" component={Short} calculateMetadata={shortMetadata} durationInFrames={900} fps={30} width={1080} height={1920}
      defaultProps={{ slug: "x", banner: "", kicker: "", scenes: [], lines: [], words: [], total: 1 } as ShortProps} />
    <Composition id="ReelCover" component={ReelCover} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ headline: "", label: "" }} />
    <Composition id="CoverEp01" component={CoverEp01} durationInFrames={1} fps={30} width={1080} height={1920} />
  </>
);
