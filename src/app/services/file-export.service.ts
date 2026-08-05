import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileExportService {
  downloadFile(response: HttpResponse<Blob>): void {
    const disposition = response.headers.get('content-disposition');
    const blob = response.body;

    if (!disposition || !blob) {
      return;
    }

    const fileNamePart = disposition.split(';').find((part) => part.trim().startsWith('filename='));
    let fileName = fileNamePart?.split('=')[1]?.trim() ?? 'download';

    if (fileName.startsWith('"') && fileName.endsWith('"')) {
      fileName = fileName.slice(1, -1);
    }

    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }
}
