/**
 * API client for FreeConvert backend integration
 * Logic: Real backend communication with FastAPI endpoints for file processing
 */

// Types for API responses
export interface PresignedURLRequest {
  file_name: string;
  file_type: string;
  file_size: number;
}

export interface PresignedURLResponse {
  upload_url: string;
  file_key: string;
  bucket: string;
  region: string;
  expires_in: number;
  max_file_size: number;
}

export interface JobStatusResponse {
  id: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  tool_type: "merge" | "compress" | "reduce" | "jpg-to-pdf";
  input_files: string[];
  result_key?: string;
  error_message?: string;
  created_at: string;
  completed_at?: string;
  compression_level?: string;
}

export interface StartJobRequest {
  tool_type: "merge" | "compress" | "reduce" | "jpg-to-pdf";
  file_keys: string[];
  compression_level?: "low" | "medium" | "high";
}

export interface StartJobResponse {
  job_id: string;
  status: string;
  message: string;
}

export interface DownloadResponse {
  download_url: string;
  expires_in: number;
  file_name: string;
}

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}/api/v1${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Unknown error" }));
      throw new Error(
        error.message || `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    return response.json();
  }

  // Upload endpoints
  async getPresignedUploadUrl(
    request: PresignedURLRequest,
  ): Promise<PresignedURLResponse> {
    return this.request<PresignedURLResponse>("/upload/presigned-url", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async confirmUpload(
    fileKey: string,
  ): Promise<{ status: string; file_key: string; file_size: number }> {
    return this.request<{
      status: string;
      file_key: string;
      file_size: number;
    }>("/upload/confirm-upload", {
      method: "POST",
      body: JSON.stringify({ file_key: fileKey }),
    });
  }

  async cleanupUpload(
    fileKey: string,
  ): Promise<{ status: string; message: string }> {
    return this.request<{ status: string; message: string }>(
      `/upload/cleanup-upload`,
      {
        method: "DELETE",
        body: JSON.stringify({ file_key: fileKey }),
      },
    );
  }

  // Job endpoints
  async startJob(request: StartJobRequest): Promise<StartJobResponse> {
    return this.request<StartJobResponse>("/job/start", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async getJobStatus(jobId: string): Promise<JobStatusResponse> {
    return this.request<JobStatusResponse>(`/job/${jobId}/status`, {
      method: "GET",
    });
  }

  async getUserJobs(): Promise<JobStatusResponse[]> {
    return this.request<JobStatusResponse[]>("/job/my-jobs", {
      method: "GET",
    });
  }

  // Download endpoints
  async getDownloadUrl(jobId: string): Promise<DownloadResponse> {
    return this.request<DownloadResponse>(`/download/${jobId}`, {
      method: "GET",
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; service: string }> {
    return this.request<{ status: string; service: string }>("/health", {
      method: "GET",
    });
  }

  // Utility methods
  async uploadFileToS3(
    file: File,
    presignedData: PresignedURLResponse,
  ): Promise<void> {
    try {
      // Determine correct Content-Type
      let contentType = file.type || "application/octet-stream";

      // Fallback for common file types if browser doesn't detect
      if (!file.type) {
        const fileName = file.name.toLowerCase();
        if (fileName.endsWith(".pdf")) {
          contentType = "application/pdf";
        } else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
          contentType = "image/jpeg";
        } else if (fileName.endsWith(".png")) {
          contentType = "image/png";
        }
      }

      console.log(
        `[Upload] Starting S3 upload: ${file.name} (${file.size} bytes, ${contentType})`,
      );

      const response = await fetch(presignedData.upload_url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": contentType,
        },
      });

      if (!response.ok) {
        // Try to get the error details from S3
        let errorMessage = response.statusText;
        try {
          const errorBody = await response.text();
          if (errorBody) {
            errorMessage = errorBody.substring(0, 200); // Limit error message length
          }
        } catch (e) {
          // Ignore error parsing issues
        }

        console.error(
          `[Upload] S3 Error for ${file.name}: HTTP ${response.status}`,
        );
        console.error(`[Upload] Error Details: ${errorMessage}`);

        throw new Error(
          `HTTP ${response.status}: ${errorMessage || response.statusText}`,
        );
      }

      console.log(`[Upload] Successfully uploaded ${file.name} to S3`);
    } catch (error) {
      console.error(`[Upload] Failed for ${file.name}:`, error);
      throw error;
    }
  }

  // Poll job status with interval
  async pollJobStatus(
    jobId: string,
    onStatusUpdate: (status: JobStatusResponse) => void,
    intervalMs: number = 2000,
    maxAttempts: number = 300, // 10 minutes max
  ): Promise<JobStatusResponse> {
    let attempts = 0;

    const poll = async (): Promise<JobStatusResponse> => {
      const status = await this.getJobStatus(jobId);
      onStatusUpdate(status);

      if (status.status === "COMPLETED" || status.status === "FAILED") {
        return status;
      }

      attempts++;
      if (attempts >= maxAttempts) {
        throw new Error("Job polling timeout exceeded");
      }

      await new Promise((resolve) => setTimeout(resolve, intervalMs));
      return poll();
    };

    return poll();
  }
}

// Export singleton instance
export const api = new ApiClient();
