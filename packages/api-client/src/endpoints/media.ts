import axios from "axios";
import { apiClient, toBrowserUrl } from "../client";
import type {
  UploadRequest,
  UploadResponse,
  MediaRead,
  DownloadResponse,
} from "@flockloop/shared-types";

export const mediaApi = {
  getUploadUrl: (data: UploadRequest) =>
    apiClient
      .post<UploadResponse>("/media/upload-url", data)
      .then((r) => r.data),

  confirmUpload: (mediaId: string) =>
    apiClient
      .post<MediaRead>(`/media/${mediaId}/confirm`)
      .then((r) => r.data),

  getDownloadUrl: (mediaId: string) =>
    apiClient
      .get<DownloadResponse>(`/media/${mediaId}/download-url`)
      .then((r) => r.data)
      .then((d) => ({ ...d, download_url: toBrowserUrl(d.download_url) })),

  /** Direct upload to S3 via presigned URL */
  uploadToS3: (
    uploadUrl: string,
    file: Blob | File,
    contentType: string,
    onProgress?: (progress: number) => void,
  ) =>
    axios.put(toBrowserUrl(uploadUrl), file, {
      headers: { "Content-Type": contentType },
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          onProgress(Math.round((event.loaded * 100) / event.total));
        }
      },
    }),
};
