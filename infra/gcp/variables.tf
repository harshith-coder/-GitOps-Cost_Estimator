variable "gcp_project_id" {
  description = "GCP Project ID"
  type        = string
  default     = "my-project-id"
}

variable "gcp_region" {
  description = "GCP region"
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "demo"
}

variable "machine_type" {
  description = "GCP compute instance machine type"
  type        = string
  default     = "e2-micro"
}

variable "boot_disk_size" {
  description = "Boot disk size in GB"
  type        = number
  default     = 20
}

variable "create_storage" {
  description = "Whether to create Cloud Storage bucket"
  type        = bool
  default     = false
}

variable "create_database" {
  description = "Whether to create Cloud SQL instance"
  type        = bool
  default     = false
}
