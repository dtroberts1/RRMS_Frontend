import {ICarouselImage} from './CarouselImage';

export interface IRoom{
    Id:number,
    RoomName: string,
    Dimensions: string,
    IsMaster: boolean,
    HasCloset: boolean,
    HasCeilingFan: boolean,
    HasPrivateBath: boolean,
    MonthlyRate: boolean,
    HomeId,    
    RoomImages: Iterable<ICarouselImage>
}