export interface Employer{
    MgrEmailAddress : string;
    MgrUsername: string;
    MgrFName : string;
    MgrLName : string;
    MgrMdInit : string;
    addressStreet1: string,
    addressStreet2: string,
    addressCity: string,
    addressState: string,
    addressZipCode: string,
    prospectJobTitle: string,
    startDate: Date,
    endDate: Date,
    current: boolean,
    salaryType: SalaryType,
    prospectID: number,
}

export enum SalaryType {
    hourly = 1,
    annual = 2,
  }