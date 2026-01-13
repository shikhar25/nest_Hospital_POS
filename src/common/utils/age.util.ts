/**
 * Calculates age from date of birth.
 * Always correct, no stale data.
 */
export function calculateAge(dob: Date): number {
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();

    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    // If birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
}
