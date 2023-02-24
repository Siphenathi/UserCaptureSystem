import { UserModel } from "./userModel";
import { SortingOrder } from "./sortingOrder";

export type UserEnhancedTableProps = {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof UserModel) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: SortingOrder;
    orderBy: string;
    rowCount: number;
  }