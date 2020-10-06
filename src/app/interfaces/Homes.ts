import { IRoom } from './Rooms';

export interface IHome{
    id:number,
    nickname: string,
    summary: string,
    addressStreet1: string,
    addressStreet2: string,
    addressCity: string,
    addressState: string,
    addressZipCode: string,
    averageRate: number,
    tenants: Iterable<ITenant>,
    homeImagePath: string;
    rooms: Iterable<IRoom>
}


export interface ITenant{
    firstName: string,
    lastName: string,
    midInit: string
}
