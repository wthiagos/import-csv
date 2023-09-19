import dayjs from "dayjs";

export const formatDate = (value: string | Date | number | undefined | null): string | null => {
    let date = value;

    if (!date)
        return null;

    if (typeof (date) === 'string' && (date.match(/\//g)?.length || []) === 2) {
        const [
            day,
            month,
            year
        ] = date.split('/')

        date = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year.padStart(4, '0')}`
    } else {
        return null;
    }

    return dayjs(date, 'DD/MM/YYYY').format('DD/MM/YYYY');
}