variable "azure_region" {
  description = "Azure region for resources"
  type        = string
  default     = "East US"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "demo"
}

variable "project" {
  description = "Project name"
  type        = string
  default     = "gitops"
}

variable "vm_size" {
  description = "Azure VM size"
  type        = string
  default     = "Standard_B1s"
}

variable "create_storage" {
  description = "Whether to create storage account"
  type        = bool
  default     = false
}
