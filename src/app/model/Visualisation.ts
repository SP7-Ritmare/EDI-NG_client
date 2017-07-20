/**
 * Created by fabio on 24/03/2017.
 */

export interface IVisualisation {
    types: string[],
    show: string
}
;

/*
 case 'text':
 this.show = 'textarea';
 break;
 case 'string':
 this.show = 'textbox';
 break;
 case 'boolean':
 this.show = 'boolean';
 break;
 case 'codelist':
 this.show = 'combobox';
 break;

 */
export class Visualisation {
    static visualisations: IVisualisation[] = [
        {
            types: [
                'string',
                'select',
                'copy',
                'string',
                'URN',
                'URI',
                'URL',
                'int',
                'real',
                'double',
                'text',
                'dependent',
                'ref',
                'autonumber',
                'hidden'

            ], show: 'textbox'
        },
        {types: ['boolean'], show: 'boolean'},
        {types: ['boundingBox'], show: 'boundingBox'},
        {types: ['codelist'], show: 'combobox'},
        {types: ['text'], show: 'textarea'},
        {types: ['date'], show: 'date'},
        {types: ['UUID'], show: 'UUID'},
        {types: ['dateRange'], show: 'dateRange'},
        {types: ['sensorID'], show: 'label'}
    ];
    static defaultVisualisation = 'textbox';

    static findFor(type: string) {
        for (let v of Visualisation.visualisations) {
            if (v.types.indexOf(type) > -1) {
                return v.show;
            }
        }
        return Visualisation.defaultVisualisation;
    }
}