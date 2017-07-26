export interface IValueObject {
    c?: string;
    l?: string;
    uri?: string;
    label?: string;
    languageNeutral?: string;
    urn?: string;
    // boolean properties
    useCode: boolean;
    useUrn: boolean;
    useLanguageNeutral: boolean;
}

export class ValueObject implements IValueObject {
    public c?: string;
    public l?: string;
    public uri?: string;
    public label?: string;
    public languageNeutral?: string;
    public urn?: string;
    useCode: boolean = false;
    useUrn: boolean = false;
    useLanguageNeutral: boolean = false;

    get value() {
        if ( this.useCode ) {
            return this.c;
        } else if ( this.useUrn ) {
            return this.urn;
        } else if ( this.useLanguageNeutral ) {
            return this.languageNeutral;
        } else {
            return this.label;
        }
    }

    set value(value: any) {
        if ( this.useCode ) {
            this.c = value;
        } else if ( this.useUrn ) {
            this.urn = value;
        } else if ( this.useLanguageNeutral ) {
            this.languageNeutral = value;
        } else {
            this.label = value;
        }
    }
}