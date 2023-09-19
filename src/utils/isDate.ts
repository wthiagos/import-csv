import dayjs from "dayjs";
import {formatDate} from "./formatDate";

export const isDate = (value: string | Date | number | undefined | null): boolean => {
    const date = formatDate(value);

    return dayjs(date, 'DD/MM/YYYY').isValid();
}