# Example: GCP Cost Scenario

# This file shows a typical GCP infrastructure scenario
# Modify values and run:
#   npm run estimate:gcp

gcp_project_id  = "my-project-id"            # Replace with your GCP project ID
gcp_region      = "us-central1"
environment     = "demo"
machine_type    = "e2-micro"                 # Change to: e2-small, n1-standard-1, etc.
boot_disk_size  = 20
create_storage  = false                      # Set to true to add Cloud Storage
create_database = false                      # Set to true to add Cloud SQL

# Cost estimate with these values: ~$8/month (e2-micro)
# Cost if you add storage: +$0.05/month
# Cost if you add Cloud SQL: +$15/month (total ~$23/month)
# Cost if you upgrade to n1-standard-1: ~$40/month
