export function getMinute(timeInSeconds: number): string {
    const minutes = Math.floor(timeInSeconds / 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    return `${formattedMinutes}`;
}

export function getSecond(timeInSeconds: number): string {
    const seconds = Math.floor(timeInSeconds % 60);
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedSeconds}`;
}

export function getRoundedMinute(timeInSeconds: number): string {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}