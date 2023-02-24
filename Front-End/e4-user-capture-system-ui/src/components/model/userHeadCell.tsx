import { UserModel } from "./userModel";

export type UserHeadCell = {
    id: keyof UserModel;
    label: string;
};
