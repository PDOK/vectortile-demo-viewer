
import { DrawColor } from "./color";
export enum LegendLevel {


    d1_layer = "Detailnivo eenvoudig",
    d2_details = "Detailnivo uitgebreid",

}

export interface IProperties {
    [key: string]: string
}
export interface IColorMap {
    getItems(isText: boolean) : Map<string, DrawColor>;
    setShowAll(checked: boolean): void;
    getLegendLevel(): LegendLevel;
    setSelector(selector: LegendLevel): void;
    clear(): void;
    has(label: string): boolean;
    set(label: string, newvalue: DrawColor): void;
    selector(props: IProperties): string;
    //items: Map<string, DrawColor>;
}

export class ColorMap implements IColorMap {
    private legendLevel: LegendLevel;
    getLegendLevel(): LegendLevel {
        return this.legendLevel;
    };
    setSelector(selector: LegendLevel): void {
        this.legendLevel = selector;
        this.clear();
    }
    get(title: string) {
        return this.items.get(title);
    }
    has(title: string) {
        return this.items.has(title);
    }
    set(title: string, newcolor: DrawColor) {
        this.items.set(title, newcolor)
    }
    clear() {
        this.items.clear();
    }
    items: Map<string, DrawColor>;
    constructor(s: LegendLevel) {
        this.legendLevel = s;
        this.items = new Map<string, DrawColor>();
    }
    getItems(isText: boolean): Map<string, DrawColor> {
        return new Map<string, DrawColor>([...this.items.entries()].filter(x => x[1].isText() === isText).sort());
    }
    setShowAll(checked: boolean): void {
        this.items.forEach((x) => { x.show = checked })

    }

    selector(props: IProperties): string {
        if (this.legendLevel === LegendLevel.d2_details) {
            return this.getTitle(props["layer"], props);
        }
        else {
            return props['layer'];
        }


    }

    private getTitle(layername: string, props: IProperties): string {
        var title = ""
        title = gettext(title, 'type');
        title = gettext(title, 'plus_type');
        title = gettext(title, 'functie');
        title = gettext(title, 'fysiek_voorkomen');
        if (title === "") {
            title = layername;

        }
        return  title.trim() 

        function gettext(intitle: string, index: string): string {
            if (props[index]) {
                return (intitle + ' ' + props[index]);
            } else {
                return (title)
            }

        }
    }



}