terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "gitops-cost-estimator"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Service     = "demo"
    }
  }
}

# Web Server EC2 Instance
resource "aws_instance" "webserver" {
  ami           = "ami-0c55b159cbfafe1f0"  # Ubuntu 20.04 LTS
  instance_type = var.instance_type
  
  tags = {
    Name = "demo-webserver"
  }
}

# Security Group
resource "aws_security_group" "allow_web" {
  name        = "allow_web_${var.environment}"
  description = "Allow web traffic"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "allow-web"
  }
}

# EBS Volume for storage
resource "aws_ebs_volume" "data_storage" {
  availability_zone = "${var.aws_region}a"
  size              = var.ebs_size
  type              = "gp3"
  encrypted         = true

  tags = {
    Name = "data-storage"
  }
}

# RDS Database (optional add-on)
resource "aws_db_instance" "main" {
  count              = var.create_database ? 1 : 0
  identifier         = "demo-db"
  engine             = "mysql"
  engine_version     = "8.0.35"
  instance_class     = "db.t4g.micro"
  allocated_storage  = 20
  storage_type       = "gp3"
  storage_encrypted  = true
  username           = "admin"
  password           = "DemoPass123!"
  skip_final_snapshot = true
  copy_tags_to_snapshot = true

  enabled_cloudwatch_logs_exports = ["error", "general", "slowquery"]

  tags = {
    Name        = "demo-database"
    Environment = "demo"
    Service     = "gitops-demo"
    Project     = "cost-estimator"
  }
}

# Output for documentation
output "instance_ip" {
  value       = aws_instance.webserver.public_ip
  description = "Public IP of the web server"
}

output "total_monthly_cost_estimate" {
  value       = "See Infracost report"
  description = "Total estimated monthly cost"
}
