# GitOps Infrastructure Cost Estimator

A sophisticated, **multi-cloud enabled** tool that integrates into GitHub pull request workflows to automatically estimate and report cloud infrastructure cost changes before deployment. Now supports AWS, Azure, and GCP with automatic provider detection!

📊 **[Course Project - Phases 1-4] Advanced Implementation**

---

## 🎯 Features

### Phase 1️⃣ - Local Cost Estimation
- ✅ Determines infrastructure costs using Terraform + Infracost
- ✅ Analyzes resources across multiple cloud providers
- ✅ Generates detailed cost breakdown reports
- ✅ Works entirely locally before any deployment

### Phase 2️⃣ - GitHub Actions Integration
- ✅ Automatic PR trigger on Terraform changes
- ✅ Posts cost estimates as PR comments
- ✅ Seamless GitHub workflow integration
- ✅ Cost reports stored as artifacts

### Phase 3️⃣ - Cost Analysis & Alerts
- ✅ Compares costs with previous estimates
- ✅ Shows percentage changes (📈 increase, 📉 decrease)
- ✅ **Warning alerts** when cost exceeds $100/month
- ✅ **Critical alerts** when cost exceeds $500/month
- ✅ Professional formatted cost reports

### Phase 4️⃣ - Multi-Cloud Support
- ✅ **AWS** - EC2, EBS, RDS, Security Groups
- ✅ **Azure** - Virtual Machines, Storage, Networks
- ✅ **GCP** - Compute Instances, Storage, SQL
- ✅ Auto-detects which provider(s) are being used
- ✅ Unified cost breakdown across all providers
- ✅ Deploy to multiple clouds simultaneously

---

## 📁 Project Structure

```
gitops-cost-estimator/
│
├── infra/                              # Infrastructure as Code
│   ├── aws/                           # AWS Terraform configs
│   │   ├── main.tf                    # AWS resources (EC2, EBS, RDS, Security Groups)
│   │   ├── variables.tf               # AWS input variables
│   │   └── terraform.tfvars           # AWS values
│   │
│   ├── azure/                         # Azure Terraform configs
│   │   ├── main.tf                    # Azure resources (VM, Storage, Network)
│   │   ├── variables.tf               # Azure input variables
│   │   └── terraform.tfvars           # Azure values
│   │
│   └── gcp/                           # GCP Terraform configs
│       ├── main.tf                    # GCP resources (Compute, Storage, SQL)
│       ├── variables.tf               # GCP input variables
│       └── terraform.tfvars           # GCP values
│
├── scripts/
│   └── estimate-cost.js               # Main cost estimation engine (Phases 1-4)
│
├── .github/
│   └── workflows/
│       └── cost-check.yml             # GitHub Actions workflow (Phase 2)
│
├── package.json                       # Node.js dependencies
├── README.md                          # This file
└── .gitignore
```

---

## 🚀 Quick Start

### Prerequisites

Ensure you have these installed:
```bash
# Windows - Using Chocolatey
choco install terraform infracost nodejs -y

# macOS - Using Homebrew
brew install terraform infracost node

# Verify installations
terraform --version
infracost --version
node --version
```

### Phase 1️⃣: Local Testing

1. **Clone/Download the project:**
```bash
cd gitops-cost-estimator
```

2. **Install Node dependencies:**
```bash
npm install
```

3. **Run cost estimation:**
```bash
npm run estimate
```

**Expected Output:**
```
=========================================================================================
🚀 GitOps Infrastructure Cost Estimator
Multi-Cloud Cost Analysis Tool (Phases 1-4)
=========================================================================================

📍 Step 1: Detecting cloud provider...
✓ AWS provider detected

✓ Found 1 provider(s): AWS

🏗️  Estimating costs for AWS...
📁 Infrastructure path: infra/aws

Step 1️⃣: Initializing Terraform for aws...
✓ Terraform initialized

Step 2️⃣: Creating Terraform plan for aws...
✓ Plan created

Step 3️⃣: Running Infracost analysis...
✓ Cost analysis complete

💰 COST BREAKDOWN:

Provider: AWS
Total Estimated Monthly Cost: $25.50

📋 Resource Details:
──────────────────────────────────────────────────────────────────────────────────────
➕ aws_instance.webserver
   Type: aws_instance | Cost: $7.50/month
➕ aws_ebs_volume.data_storage
   Type: aws_ebs_volume | Cost: $18.00/month
```

---

### Phase 2️⃣: GitHub Integration

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit: GitOps Cost Estimator"
git branch -M main
git remote add origin https://github.com/yourusername/gitops-cost-estimator.git
git push -u origin main
```

2. **Enable GitHub Actions:**
   - Go to your repository
   - Click **Actions** tab
   - Enable workflows

3. **Create a test PR:**
   - Create a new branch: `git checkout -b feature/update-instance`
   - Modify `infra/aws/terraform.tfvars`: change `instance_type = "t2.small"`
   - Push: `git push origin feature/update-instance`
   - Open PR on GitHub
   - **See cost estimate automatically posted!** 🚀

---

### Phase 3️⃣: Testing Cost Alerts

The system automatically generates alerts when costs exceed thresholds:

**Try this:**

1. Modify `infra/aws/terraform.tfvars`:
```hcl
instance_type = "t3.large"        # More expensive
create_database = true            # Add RDS database
```

2. Run estimation again:
```bash
npm run estimate
```

**You'll see:**
```
⚠️ Cost Alerts

⚠️ WARNING: Cost exceeds WARNING threshold ($100)
```

---

### Phase 4️⃣: Multi-Cloud Testing

**To estimate costs across multiple clouds:**

1. **Enable additional providers** in their `terraform.tfvars` files
2. **Run estimation:**
```bash
npm run estimate
```

**The tool will automatically:**
- ✅ Detect AWS, Azure, and GCP providers
- ✅ Initialize each Terraform configuration
- ✅ Run cost analysis for all clouds
- ✅ Generate unified cost report
- ✅ Post combined PR comment

**Example Multi-Cloud Output:**
```
## 💰 Cloud Cost Impact Analysis

**Total Estimated Monthly Cost: $245.50**

### Cloud Provider Breakdown

**AWS**: $95.50/month
**AZURE**: $80.00/month
**GCP**: $70.00/month
```

---

## 📋 Supported Resources

### AWS
- EC2 Instances (t2, t3, m5, etc.)
- EBS Volumes
- RDS Databases
- Security Groups
- Elastic IPs

### Azure
- Virtual Machines (Standard_B1s, Standard_B2s)
- Storage Accounts
- Virtual Networks
- Public IPs
- Network Security Groups

### GCP
- Compute Engine Instances (e2, n1, n2)
- Cloud Storage Buckets
- Cloud SQL Databases
- Networks & Firewalls
- Static IPs

---

## 🔧 Configuration

### Cost Thresholds (Phase 3)

Edit `scripts/estimate-cost.js` to modify alert thresholds:
```javascript
this.threshold = {
  warning: 100,    // Alert if cost > $100/month
  critical: 500    // Critical alert if cost > $500/month
};
```

### GitHub Actions Settings

Set up GitHub Actions secret for Infracost API (optional):
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add `INFRACOST_API_KEY` (get from https://www.infracost.io)
3. Update workflow if needed

---

## 📊 Outputs

### Local Execution
- **Console output** - Real-time cost breakdown
- **pr-comment.md** - Formatted PR comment
- **cost-history.json** - Historical cost tracking

### GitHub Actions
- **PR Comment** - Automatic cost estimate on each PR
- **Artifact** - Cost reports saved for 30 days
- **Validation** - Terraform syntax validation across all providers

---

## 🎓 Learning Outcomes

This project demonstrates:

### Phase 1: Infrastructure-as-Code
- Terraform configuration for multiple clouds
- Resource modeling and variables
- Cost estimation fundamentals

### Phase 2: CI/CD Integration
- GitHub Actions workflows
- GitHub API integration
- Automated PR comments

### Phase 3: Data Analysis
- Cost comparison logic
- Alert systems
- Threshold-based automation

### Phase 4: Multi-Cloud Architecture
- Provider abstraction
- Unified cost reporting
- Infrastructure portability

---

## 🚦 Usage Examples

### Example 1: Estimate AWS Costs
```bash
npm run estimate
# Detects AWS, analyzes costs, posts PR comment
```

### Example 2: Estimate Specific Provider
```bash
npm run estimate:aws
# AWS only
```

```bash
npm run estimate:azure
# Azure only
```

### Example 3: Test Cost Alerts
```bash
# Modify terraform.tfvars to increase costs
# Run estimation
npm run estimate
# See ⚠️ alerts if cost exceeds threshold
```

### Example 4: Multi-Cloud Deployment
```bash
# Enable Azure and GCP in their tfvars files
npm run estimate
# Gets unified cost across all 3 clouds!
```

---

## 🔐 Security Notes

- ⚠️ Never commit AWS/Azure/GCP credentials
- ✅ Use environment variables or IAM roles
- ✅ Keep API keys in GitHub Secrets
- ✅ Review PR comments for sensitive data

---

## 📈 Future Enhancements

- Dashboard for cost trends
- Slack notifications
- Cost anomaly detection
- Budget enforcement
- CLI tool for local development
- Terraform module marketplace integration

---

## 🤝 Contributing

Contributions welcome! Please follow:
1. Create feature branch
2. Make changes
3. Test locally
4. Submit PR

---

## 📝 License

MIT License - See LICENSE file

---

## 📞 Support

For issues or questions:
- Check GitHub Issues
- Review README section relevant to your problem
- Test with sample Terraform first

---

## 🏆 Course Project Info

**Project**: GitOps Infrastructure Cost Estimator
**Phases**: 4 (Complete implementation)
**Duration**: 11-12 hours
**Difficulty**: Advanced
**Skills**: Terraform, Node.js, GitHub Actions, Cloud Platforms

**Grading Rubric:**
- ✅ Phase 1 (Local): 25% - Local cost estimation working
- ✅ Phase 2 (GitHub): 25% - PR comments posting
- ✅ Phase 3 (Alerts): 25% - Cost comparison & alerts
- ✅ Phase 4 (Multi-Cloud): 25% - AWS + Azure + GCP support

---

## 🎉 Ready to Start?

1. Install prerequisites: `choco install terraform infracost nodejs`
2. Run Phase 1: `npm run estimate`
3. See Phase 2: Create PR on GitHub
4. Test Phase 3: Modify costs and see alerts
5. Try Phase 4: Enable other cloud providers

**Happy coding! 🚀**
