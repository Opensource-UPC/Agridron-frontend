/**
 * Triggers the browser download of a text file generated on the client.
 * @param filename - Name of the downloaded file.
 * @param content - Text content of the file.
 * @param mimeType - MIME type of the file.
 */
export function downloadTextFile(filename: string, content: string, mimeType: string): void {
    const blob = new Blob([content], {type: mimeType});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
}
