aws_region      = "us-east-1"
instance_type   = "t2.large"   # PROD: Upgraded to large for production
ebs_size        = 100          # PROD: Increased storage for growth
environment     = "prod"       # TEST: Production environment
create_database = true         # TEST: With database
