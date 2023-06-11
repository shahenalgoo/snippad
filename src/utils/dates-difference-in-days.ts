/**
 * Calculate the number of days between now and date sent as argument
 * 
 */

export const daysLeft = (date: Date) => {
    const daysLimit = 30;

    const now = new Date();
    const lastUpdated = new Date(date);
    const daysDifference = dateDiffInDays(lastUpdated, now);

    return daysLimit - daysDifference;

    function dateDiffInDays(a: Date, b: Date) {
        const _MS_PER_DAY = 1000 * 60 * 60 * 24;

        // Discard the time and time-zone information.
        const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }
}