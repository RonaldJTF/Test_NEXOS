export interface User{
    userId: number;
    appointmentId: number;
    name: string;
    age: number;
    hireDate: Date,
    appointment: Appointment
}

export interface Appointment{
    appointmentId: number;
    name: string;
}