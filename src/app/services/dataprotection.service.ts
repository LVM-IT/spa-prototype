import {Injectable} from 'angular2/core';

@Injectable()
export class DataProtectionService {
    
    private _hideProtectedData: boolean = false;

    public toggleProtectedData(): void {
        this._hideProtectedData = !this._hideProtectedData;
    }

    public get isProtected(): boolean {
        return this._hideProtectedData;
    }

}
