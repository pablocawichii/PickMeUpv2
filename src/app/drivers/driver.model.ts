import { Car } from './car.model'
export class Driver {
	public id?: string;
	public email: string;
	public name: string;
	public lkl: {lat: number, lng: number};
	public status: string;
	public cars: Car[];
	public currentCar: number;
	public currentPickup?: string;
	public priv?: string;
	public rating: number;

	constructor(email: string, name: string, status: string, id: string, priv: string) {
		this.id = id;
		this.email = email;
		this.name = name;
		this.lkl = {lat: 0, lng: 0};
		this.status = status;
		this.cars = []
		this.currentCar = -1;
		this.priv = priv;
		this.rating = 3;
	}
}