
import Feature from 'ol/Feature'
import Fill from "ol/style/Fill"
import Stroke from "ol/style/Stroke"
import Style from "ol/style/Style"
import Text from "ol/style/Text"

import { Geometry } from "ol/geom"
import { RegularShape } from "ol/style"

import CircleStyle from "ol/style/Circle"


export type LabelType = { text: string; rotation: number; font: string; backgroundfill: Fill }
export type Annotation = LabelType | false

export function getFillColor(st: void | Style | Style[]) {

    let color: string | number[] | CanvasGradient | CanvasPattern = "'#000000"

    if (st instanceof Array) {
        for (const element of st) {
            const fill = element.getFill()
            if (fill) {
                if (fill.getColor()) {
                    color = fill.getColor() as string
                }
            }
            else {
                //do nothing 
                if (typeof element.getImage() === 'function') {
                    const image = element.getImage() as CircleStyle

                    if (typeof image.getFill() === 'function') {
                        const imagefill = image.getFill()

                        if (imagefill) {
                            if (imagefill.getColor()) {
                                color = imagefill.getColor() as string
                            }

                        }
                    }
                }
            }
        }
    }
    else {
        const stStyle = st as any
        const colcolor = stStyle.fill_.color_ as string | number[] | CanvasGradient | CanvasPattern
        color = colcolor
    }

    if (color instanceof CanvasPattern) {
        // not yet  const canvas = true;
        // not yet implemented boomgaard
    }

    return (color)
}

export class DrawColor {
    isText() {
        if (this.annotation === false) {
            return false
        }
        else {
            return true
        }
    }

    label: string

    r: number
    b: number
    g: number
    a: number
    type = '';
    private _rbgString = '';
    mapbox: boolean
    annotation: Annotation

    public get sampleText(): string {
        if (this.annotation === false) {
            return ""
        }
        else {
            return this.annotation['text']
        }
    }



    style: Style | undefined


    public get rbgString() {
        return this._rbgString
    }
    public set rbgString(value) {
        const rgba = this.parse_rgb_string(value)

        this.r = rgba[0]
        this.g = rgba[1]
        this.b = rgba[2]
        if (rgba.length === 4) {
            this.a = rgba[3]
        }
        else { this.a = 1 }

        this._rbgString = this.makerbgString()



    }
    private _show = true;
    readonly legendfeature: Feature<Geometry> | any
    setRbg(r: number, b: number, g: number) {
        this.r = r
        this.b = b
        this.g = g
    }

    public get show(): boolean {
        return this._show
    }
    public set show(value: boolean) {
        this._show = value
        if (!this._show) {
            this.a = 0

        }
        else {
            this.a = 1

        }


    }





    constructor(label: string, alegendfeature: Feature<Geometry>, mapbox: boolean, anno: Annotation) {


        this.mapbox = mapbox
        this.legendfeature = alegendfeature
        this.type = this.legendfeature.type_
        const a = 0.7
        switch (this.type) {
            case 'Point':
                {

                    this.r = Math.round(Math.random() * 255)
                    this.g = Math.round(Math.random() * 255)
                    this.b = Math.round(Math.random() * 255)
                    this.a = a
                    break

                }
            case 'Polygon':
                {


                    this.r = Math.round(Math.random() * 255)
                    this.g = Math.round(Math.random() * 255)
                    this.b = Math.round(Math.random() * 255)
                    this.a = a

                    this._rbgString = this.makerbgString()
                    break
                }

            case 'LineString':
                {

                    this.r = 0
                    this.g = 0
                    this.b = 0
                    this.a = a
                    break
                }
            default: {


                console.log(this.type + " not supported")
                this.r = 0
                this.g = 0
                this.b = 0
                this.a = a
                break
            }
        }

        this.label = label
        this.annotation = anno



    }


    decimalHashString(hashstring: string) {
        let sum = 0
        for (let i = 0; i < hashstring.length; i++) {
            const j = hashstring.codePointAt(i)
            if (j) {
                sum += (i + 1) * j / (1 << 8)
            }
            else {
                sum += (i + 1) * 100 / (1 << 8)
            }

        }
        return sum % 1
    }

    parse_rgb_string(rgb: string): number[] {
        if (typeof rgb.replace === 'function') {
            const rgbout = (rgb.replace(/[^\d,]/g, '').split(',')) as unknown as number[]
            return rgbout
        }
        else {
            return [0, 0, 0, 0]
        }


    }

    backgroundRbgString() {
        return { 'background-color': `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})` }
    }

    textcolorRbgString() {
        return { 'color': `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})` }
    }


    private makerbgString() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`
    }









    showfreshstyle(labeltext: Annotation, currentstyle: void | Style | Style[]) {




        if (this.mapbox) {
            return currentstyle
        }

        else {
            const newFill = new Fill({ color: `rgb(${this.r}, ${this.g}, ${this.b}, ${this.a})` })
            let newText = new Text({})
            const newImage = new RegularShape({
                fill: new Fill({
                    color: `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`

                }),
                stroke: new Stroke({
                    color: `rgb(${this.r}, ${this.g}, ${this.b}, ${this.a})`
                }),
                points: 4,
                radius: 10
                // angle: Math.PI / 4,
            })

            if (labeltext) {
                newText = new Text({
                    font: labeltext.font,
                    text: `${labeltext.text}`,
                    rotation: labeltext.rotation,
                    fill: newFill,
                    backgroundFill: labeltext.backgroundfill,
                    padding: [3, 3, 3, 3],

                    stroke: new Stroke({
                        color: `rgb(${this.r}, ${this.g}, ${this.b}, ${this.a})`, width: 2
                    })

                })
            }

            if (currentstyle instanceof Array) {
                for (const element of currentstyle) {
                    const fill = element.getFill()
                    if (fill) {
                        if (fill.getColor()) {
                            //element.setFill(newFill)
                        }
                    }
                    else {


                        const image = element.getImage() as CircleStyle
                        if (image) {



                            if (image.getFill()!) {
                                const imagefill = image.getFill()!
                                if (imagefill.getColor()) {
                                    newImage.setFill(newFill)
                                }

                            }
                        }
                    }
                }
            }


            const aimage = new RegularShape({
                fill: new Fill({
                    color: `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`

                }),
                stroke: new Stroke({
                    color: `rgb(${this.r}, ${this.g}, ${this.b}, ${this.a})`
                }),
                points: 4,
                radius: 10,
                angle: Math.PI / 4,
            })






            this.style = new Style({
                fill: new Fill({
                    color: `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`

                }),
                stroke: new Stroke({
                    color: `rgb(${this.r}, ${this.g}, ${this.b}, ${this.a})`
                }),
                text: newText,
                image: newImage

            }
            )


            return this.style
        }

    }
}


