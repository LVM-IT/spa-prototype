import {Address} from './address';
import {Zahlungsweise} from './zahlungsweise';

export class DefaultValues {

    public geburtsdatum: string;
    public anschrift: Address;
    public zahlungsweise: Array<Zahlungsweise>;
}
