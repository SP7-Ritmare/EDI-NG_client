/**
 * Created by fabio on 24/03/2017.
 */

export interface IVisualisation {
    type: string,
    show: string
};

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
        {type: 'string', show: 'textbox'},
        {type: 'boolean', show: 'boolean'},
        {type: 'codelist', show: 'combobox'},
        {type: 'text', show: 'textarea'}
    ];
    static defaultVisualisation = 'textbox';

    static findFor(type: string) {
        for ( let v of Visualisation.visualisations ) {
            if ( v.type === type ) {
                return v.show;
            }
        }
        return Visualisation.defaultVisualisation;
    }
}