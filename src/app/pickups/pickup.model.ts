export class Pickup {
	public id?: string;
	public cust?: string;
	public driver?: string;
	public dateTime: Date;
	public dateTimeSeconds?: number;
	public status: string;
	public dropOffStatus?: string;
	public stars?:  number;
	public rating?: string;
	public location: {lat: number, lng: number};
	public dropOffLocation?: {lat: number, lng: number};

	constructor(location, dateTime: Date){
		this.location = location;
		this.dateTime = dateTime;
		this.status = "unclaimed";
	}
}