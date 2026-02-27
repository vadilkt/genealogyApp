import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
dayjs.locale('fr');

export const formatDate = (date: string | Date, format = 'DD/MM/YYYY'): string => {
    return dayjs(date).format(format);
};

export const formatDateTime = (date: string | Date, format = 'DD/MM/YYYY HH:mm'): string => {
    return dayjs(date).format(format);
};

export const fromNow = (date: string | Date): string => {
    return dayjs(date).fromNow();
};

export const isValidDate = (date: string, format?: string): boolean => {
    return dayjs(date, format, true).isValid();
};

export { dayjs };
