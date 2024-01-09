import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class GlobalService {


	/**
	 * 
	 * @param result (En SECONDE)
	 * @returns 
	 */
	secondsToHms(result: any) {

		let resultInSeconds = parseInt(result);

		let hours = Math.floor(resultInSeconds / 3600);
		let minutes = Math.floor((resultInSeconds % 3600) / 60);
		let seconds = Math.floor((resultInSeconds % 3600) % 60);

		let hoursDisplay = hours > 0 ? hours + " h " : "";
		let minutesDisplay = minutes > 0 ? minutes + " min " : "";
		let secondsDisplay = seconds > 0 ? seconds + " s" : "";

		if (resultInSeconds === 0) {
			return '--';
		}

		if (hours > 0) {
			return hoursDisplay + minutesDisplay.trim();
		}

		if (minutes > 0) {
			return minutesDisplay + secondsDisplay;
		}

		return secondsDisplay;
		;

	}
}
