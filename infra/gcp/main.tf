terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

# Compute Instance
resource "google_compute_instance" "demo" {
  name         = "demo-instance-${var.environment}"
  machine_type = var.machine_type
  zone         = "${var.gcp_region}-a"

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2004-lts"
      size  = var.boot_disk_size
      type  = "pd-standard"
    }
  }

  network_interface {
    network = "default"

    access_config {
      # Ephemeral IP
    }
  }

  tags = ["http", "https"]

  metadata = {
    enable-oslogin = "TRUE"
  }

  labels = {
    environment = var.environment
    project     = "gitops-cost-estimator"
  }
}

# Cloud Storage Bucket
resource "google_storage_bucket" "demo" {
  count         = var.create_storage ? 1 : 0
  name          = "${var.gcp_project_id}-demo-${var.environment}"
  location      = var.gcp_region
  force_destroy = true

  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }

  labels = {
    environment = var.environment
  }
}

# Cloud SQL Instance (MySQL)
resource "google_sql_database_instance" "main" {
  count            = var.create_database ? 1 : 0
  name             = "demo-db-${var.environment}"
  database_version = "MYSQL_8_0"
  region           = var.gcp_region

  settings {
    tier = "db-f1-micro"

    backup_configuration {
      enabled = true
    }

    ip_configuration {
      require_ssl = false
    }
  }

  deletion_protection = false
}

# Network VPC
resource "google_compute_network" "vpc_network" {
  name                    = "vpc-${var.environment}"
  auto_create_subnetworks = true
}

# Firewall Rule
resource "google_compute_firewall" "allow_web" {
  name    = "allow-web-${var.environment}"
  network = google_compute_network.vpc_network.name

  allow {
    protocol = "tcp"
    ports    = ["80", "443", "22"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["http", "https"]
}

output "instance_external_ip" {
  value       = google_compute_instance.demo.network_interface[0].access_config[0].nat_ip
  description = "External IP of the compute instance"
}
