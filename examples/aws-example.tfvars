# Example: AWS Cost Scenario

# This file shows a typical AWS infrastructure scenario
# Modify values and run:
#   npm run estimate:aws

# Basic web server setup
aws_region      = "us-east-1"
instance_type   = "t2.micro"        # Change to: t2.small, t2.medium, t3.micro, etc.
ebs_size        = 20                # Storage size in GB
environment     = "demo"
create_database = false             # Set to true to add $30/month RDS

# Cost estimate with these values: ~$25/month (t2.micro)
# Cost if you upgrade to t3.small: ~$30/month
# Cost if you add RDS: +$30/month (total ~$55-60/month)
