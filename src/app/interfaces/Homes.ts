export interface IHome{
    nickname: string,
    summary: string,
    addressStreet1: string,
    addressStreet2: string,
    addressCity: string,
    addressState: string,
    addressZipCode: string,
    averageRate: number,
    nbrRooms: number,
    tenants: Iterable<ITenant>,
    homeImagePath: string;
}


export interface ITenant{
    firstName: string,
    lastName: string,
    midInit: string
}
