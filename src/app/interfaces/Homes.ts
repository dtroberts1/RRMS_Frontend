import { IRoom } from './Rooms';
import {IProspect} from './Prospect';
import {ICarouselImage} from './CarouselImage';

export interface IHome{
    Id:number,
    Nickname: string,
    Summary: string,
    AddressStreet1: string,
    AddressStreet2: string,
    AddressCity: string,
    AddressState: string,
    AddressZipCode: string,
    HomeImagePath: string,
    Rooms: Iterable<IRoom>,
    Prospects: Iterable<IProspect>,
    LandlordId: number,
    HomeImages: Iterable<ICarouselImage>

}