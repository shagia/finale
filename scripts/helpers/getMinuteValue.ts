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

export function getRoundedMinuteFromMicroseconds(timeInMicroseconds: number): string {
    const timeInSeconds = timeInMicroseconds / 10000000;
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    
    const formattedSeconds = String(seconds).padStart(2, '0');
    
    if (hours > 0) {
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        return `${formattedHours}h:${formattedMinutes}m:${formattedSeconds}s`;
    } else {
        const formattedMinutes = String(minutes).padStart(2, '0');
        return `${formattedMinutes}m:${formattedSeconds}s`;
    }
}

