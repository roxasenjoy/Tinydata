import {AbstractControl} from '@angular/forms';
export class Validator{

    static ValidPassword(AC: AbstractControl) {
        let password = AC.get('password')!.value; // to get value in input tag
        let confirmPassword = AC.get('confirmPassword')!.value; // to get value in input tag
        if(password.length > 0 && password.length < 6) {
            AC.get('password')!.setErrors( {FormatPassword: true} );
            return false;
        }else if(password != confirmPassword) {
            AC.get('confirmPassword')!.setErrors( {MatchPassword: true} );
            return false;
        } else {
            return true;
        }
    }
}
