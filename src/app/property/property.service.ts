import { Property } from "./property.model";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
	providedIn: "root"
})
export class PropertyService {
	private properties: Property[] = [];
	private pleaseId = new Subject<any>();
	private propertiesUpdated: Subject<Property[]> = new Subject();

	constructor(private http: HttpClient) {}

	postId(id: string) {
		this.pleaseId.next({ text: id });
	}

	getId(): Observable<any> {
		return this.pleaseId.asObservable();
	}

	public getProperties() {
		return this.http
			.get<{ message: string; properties: any }>(
				"http://localhost:3000/api/properties"
			)
			.pipe(
				map(propertiesData => {
					return propertiesData.properties.map(property => {
						return {
							id: property._id,
							landlord: property.landlord,
							address: property.address,
							apartmentType: property.apartmentType,
							roomType: property.roomType,
							isDedicatedSetup: property.isDedicatedSetup,
							genderAccommodated: property.genderAccommodated,
							numberOfStudents: property.numberOfStudents,
							numberOfRooms: property.numberOfRooms,
							numberOfBathrooms: property.numberOfBathrooms,
							amenities: property.amenities,
							spaces: property.spaces,
							policies: property.policies,
							description: property.description,
							rent: property.rent,
							rating: property.rating,
							reviews: property.reviews
						};
					});
				})
			)
			.subscribe(properties => {
				this.properties = properties;
				this.propertiesUpdated.next([...this.properties]);
			});
	}

	public getProperty(id: string) {
		return this.http.get<{
			_id: string;
			landlord: {
				name: {
					first: string;
					last: string;
				};
				email: string;
				phone: string;
				avatar: string;
			};
			address: {
				houseNumber: string;
				street: string;
				area: string;
				city: string;
				geo: {
					lat: number;
					lng: number;
				};
			};
			apartmentType: string;
			roomType: string;
			isDedicatedSetup: boolean;
			genderAccommodated: string;
			numberOfStudents: number;
			numberOfRooms: number;
			numberOfBathrooms: number;
			amenities: {
				essential: Array<any>;
				safety: Array<any>;
			};
			spaces: Array<any>;
			policies: Array<any>;
			description: string;
			rent: number;
			rating: number;
			reviews: number;
		}>("http://localhost:3000/api/properties/" + id);
	}

	public addProperty(newProperty: Property) {
		const property: Property = newProperty;
		this.http
			.post<{ message: string }>(
				"http://localhost:3000/api/properties",
				property
			)
			.subscribe(() => {
				this.properties.push(property);
				this.propertiesUpdated.next([...this.properties]);
			});
	}

	getPropertyUpdateListener() {
		return this.propertiesUpdated.asObservable();
	}

	public getPropertyById(id: string): Property {
		for (const property of this.properties) {
			if (property.id === id) {
				return property;
			}
		}
	}
}
