
import Fill from "ol/style/Fill";
import Text from "ol/style/Text";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import Feature from 'ol/Feature';

import { Geometry, Polygon } from "ol/geom";
import RenderFeature from "ol/render/Feature";



export class DrawColor {

    label: string;
    r: number;
    b: number;
    g: number;
    a: number;
    type: string = '';
    private _rbgString = '';
    mapbox: boolean;
    public get rbgString() {
        return this._rbgString;
    }
    public set rbgString(value) {
        var rgba = this.parse_rgb_string(value);

        this.r = rgba[0];
        this.g = rgba[1];
        this.b = rgba[2];
        if (rgba.length === 4) {
            this.a = rgba[3]
        }
        else { this.a = 1 }

        this._rbgString = this.makerbgString();



    }
    private _show: boolean = true;
    readonly legendfeature: Feature<Geometry> | any;
    setRbg(r: number, b: number, g: number) {
        this.r = r;
        this.b = b;
        this.g = g;
    }

    public get show(): boolean {
        return this._show;
    }
    public set show(value: boolean) {
        this._show = value;
        if (!this._show) {
            // this.r = 0;
            // this.b = 0;
            // this.g = 0;
            this.a = 0;

        }
        else {
            this.a = 1;

        }


    }



    /*
    constructor(r: number, b: number, g: number, feature: Feature<Geometry> ) {
        this.r = r;
        this.b = b;
        this.g = g
    }
    */

    constructor(label: string, alegendfeature: Feature<Geometry>, hashstring = '', mapbox: boolean = false) {


        this.mapbox = mapbox;
        this.legendfeature = alegendfeature;
        //this.legendfeature.flatCoordinates_ = {};
        //  this.legendfeature.properties_ = {};

        this.type = this.legendfeature.type_;
        this.label = label;

        if (hashstring === '') {
            this.r = Math.round(Math.random() * 255);
            this.g = Math.round(Math.random() * 255);
            this.b = Math.round(Math.random() * 255);
            this.a = 1;
        }
        else {

            this.r = Math.round(this.decimalHash(hashstring) * 255);
            this.g = Math.round(this.decimalHash(hashstring) * 255);
            this.b = Math.round(this.decimalHash(hashstring) * 255);
            this.a = 1;
        }
        this._rbgString = this.makerbgString();
    }

    decimalHash(hashstring: string) {
        let sum = 0;
        for (let i = 0; i < hashstring.length; i++) {
            var j = hashstring.codePointAt(i);
            if (j) {
                sum += (i + 1) * j / (1 << 8);
            }
            else {
                sum += (i + 1) * 100 / (1 << 8);
            }

        }
        return sum % 1;
    }

    parse_rgb_string(rgb: string): number[] {
        if (typeof rgb.replace === 'function') {
           var rgbout = (rgb.replace(/[^\d,]/g, '').split(',')) as unknown as number[];
            return rgbout;
        }
        else {
            return [0, 0, 0, 0];
        }


    }

    backgroundRbgString() {
        return { 'background-color': `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})` };
    }

    private makerbgString() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }








    style(labeltext: { text: any; rotation: any; }, font: string): Style {



        return (
            new Style({
                fill: new Fill({
                    color: `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`

                }),
                stroke: new Stroke({
                    color: `rgb(${this.r}, ${this.g}, ${this.b}, ${this.a})`
                }),
                text: new Text({
                    font: font,
                    text: `${labeltext.text}`,
                    rotation: labeltext.rotation,
                    fill: new Fill({ color: `rgb(${this.r}, ${this.g}, ${this.b}, ${this.a})` }),
                    stroke: new Stroke({
                        color: `rgb(${this.r}, ${this.g}, ${this.b}, ${this.a})`, width: 2
                    })
                }

                )



            }))
    }
}