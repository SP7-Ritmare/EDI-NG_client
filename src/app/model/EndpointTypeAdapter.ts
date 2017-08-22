import {Response} from '@angular/http';
import {IFunction} from './EndpointType';
import {availableContexts, Logger} from '../utils/logger';
/**
 * Created by fabio on 08/03/2017.
 */

export class EndpointTypeAdapter {
    static logger = new Logger(availableContexts.ENDPOINTTYPE);
    static sparqlAdapter(dataset: any): any[] {
        EndpointTypeAdapter.logger.log('SPARQL adapter', dataset);
            let data = (dataset as any).results.bindings;
            let results: any[] = [];
            for ( let i = 0; i < data.length; i++ ) {
                let record: any = {};
                record.ttValue = ( data[i].c ? data[i].c.value : ( data[i].uri ? data[i].uri.value : "" ) );
                for ( let field in data[i] ) {
                    if ( data[i].hasOwnProperty(field) ) {
                        record[field] = data[i][field].value;
                    }
                }
                results.push(record);
            }
            EndpointTypeAdapter.logger.log('SPARQL adapter results: ', results);
            return results;
    }

    static jsonAdapter(res: any): any[] {
        let retVal = res.json();
        EndpointTypeAdapter.logger.log('JSON adapter');
        return retVal;
    }
}
