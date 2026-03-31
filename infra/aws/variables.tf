variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"

  validation {
    condition     = contains(["t2.micro", "t2.small", "t2.medium", "t3.micro", "t3.small", "t3.medium"], var.instance_type)
    error_message = "Instance type must be a valid EC2 type."
  }
}

variable "ebs_size" {
  description = "EBS volume size in GB"
  type        = number
  default     = 20

  validation {
    condition     = var.ebs_size >= 10 && var.ebs_size <= 1000
    error_message = "EBS size must be between 10 and 1000 GB."
  }
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "demo"
}

variable "create_database" {
  description = "Whether to create RDS database"
  type        = bool
  default     = false
}
