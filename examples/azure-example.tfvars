# Example: Azure Cost Scenario

# This file shows a typical Azure infrastructure scenario
# Modify values and run:
#   npm run estimate:azure

azure_region    = "East US"
environment     = "demo"
project         = "gitops"
vm_size         = "Standard_B1s"              # Change to: Standard_B2s, Standard_B4ms, etc.
create_storage  = false                      # Set to true to add storage account

# Cost estimate with these values: ~$20/month (Standard_B1s)
# Cost if you add storage: +$0.50/month (total ~$20.50/month)
# Cost if you upgrade to Standard_B2s: ~$40/month
