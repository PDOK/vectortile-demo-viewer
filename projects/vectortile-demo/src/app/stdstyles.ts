
import { Fill, RegularShape, Stroke, Style } from 'ol/style.js';
const stroke = new Stroke({ color: 'black', width: 2 });
const fill = new Fill({ color: 'red' });

export const stdstyles = {
    square: new Style({
        image: new RegularShape({
            fill: fill,
            stroke: stroke,
            points: 4,
            radius: 10,
            angle: Math.PI / 4,
        }),
    }),
    rectangle: new Style({
        image: new RegularShape({
            fill: fill,
            stroke: stroke,
            radius: 10 / Math.SQRT2,
            radius2: 10,
            points: 4,
            angle: 0,
            scale: [1, 0.5],
        }),
    }),
    triangle: new Style({
        image: new RegularShape({
            fill: fill,
            stroke: stroke,
            points: 3,
            radius: 10,
            rotation: Math.PI / 4,
            angle: 0,
        }),
    }),
    star: new Style({
        image: new RegularShape({
            fill: fill,
            stroke: stroke,
            points: 5,
            radius: 10,
            radius2: 4,
            angle: 0,
        }),
    }),
    cross: new Style({
        image: new RegularShape({
            fill: fill,
            stroke: stroke,
            points: 4,
            radius: 10,
            radius2: 0,
            angle: 0,
        }),
    }),
    x: new Style({
        image: new RegularShape({
            fill: fill,
            stroke: stroke,
            points: 4,
            radius: 10,
            radius2: 0,
            angle: Math.PI / 4,
        }),
    }),
    stacked: [
        new Style({
            image: new RegularShape({
                fill: fill,
                stroke: stroke,
                points: 4,
                radius: 5,
                angle: Math.PI / 4,
                displacement: [0, 10],
            }),
        }),
        new Style({
            image: new RegularShape({
                fill: fill,
                stroke: stroke,
                points: 4,
                radius: 10,
                angle: Math.PI / 4,
            }),
        }),
    ],
};
