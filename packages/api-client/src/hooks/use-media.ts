import { queryOptions, skipToken, useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { mediaApi } from "../endpoints/media";
import type { UploadRequest, MediaType } from "@flockloop/shared-types";
import { useState } from "react";

export const mediaOptions = {
  downloadUrl: (mediaId: string) =>
    queryOptions({
      queryKey: ["media", "download-url", mediaId],
      queryFn: mediaId ? () => mediaApi.getDownloadUrl(mediaId) : skipToken,
      staleTime: 1000 * 60 * 30, // 30 min (presigned URLs expire in 1hr)
    }),
};

export function useDownloadUrl(mediaId: string) {
  return useSuspenseQuery(mediaOptions.downloadUrl(mediaId));
}

/** Full 3-step upload: get presigned URL → upload to S3 → confirm */
export function useMediaUpload() {
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: async ({
      file,
      mediaType,
    }: {
      file: File;
      mediaType: MediaType;
    }) => {
      setProgress(0);

      // Step 1: get presigned upload URL
      const { media_id, upload_url } = await mediaApi.getUploadUrl({
        filename: file.name,
        content_type: file.type,
        media_type: mediaType,
      });

      // Step 2: upload directly to S3
      await mediaApi.uploadToS3(upload_url, file, file.type, setProgress);

      // Step 3: confirm upload
      const media = await mediaApi.confirmUpload(media_id);
      return media;
    },
  });

  return { ...mutation, progress };
}
