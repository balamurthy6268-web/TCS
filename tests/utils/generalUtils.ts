import { matchesGlob } from "path/win32";

export class generalUtils {

    /**
     * Method to take a String, pattern to match and returns a boolean promise
     * 
     */
    async matchesPattern(str: string, pattern: string | RegExp): Promise<boolean> {
        const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
        return regex.test(str);
    }
    


}