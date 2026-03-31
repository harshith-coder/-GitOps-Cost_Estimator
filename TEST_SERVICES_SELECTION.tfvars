# TEST CASE: Production Web Application with RDS Database
# This demonstrates cost estimation for a real-world scenario
# Services Selected: EC2, EBS Storage, RDS Database, Security Groups (AWS)

# CONFIGURATION FOR TESTING:
# Environment: Production
# Instance Type: t2.medium (upgraded for demo)
# Database: MySQL 8.0.39 on db.t4g.small (larger for demo)
# Storage: 50GB gp3 (increased for demo)
# Region: us-east-1

aws_region        = "us-east-1"
instance_type     = "t2.medium"        # SELECTED: Medium instance for production
ebs_size          = 50                 # SELECTED: 50GB storage (up from 20GB)
environment       = "prod"             # SELECTED: Production environment
create_database   = true               # SELECTED: YES - Create RDS database
