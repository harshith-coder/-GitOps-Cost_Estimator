# 🚀 GitOps Cost Estimator - Setup Guide

## Prerequisites Installation

### Windows (Using Chocolatey)

If you don't have Chocolatey, install it first:
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

Then install prerequisites:
```powershell
choco install terraform -y
choco install infracost -y
choco install nodejs -y
choco install git -y
```

Verify installations:
```powershell
terraform --version
infracost --version
node --version
git --version
```

### macOS (Using Homebrew)

```bash
brew install terraform
brew install infracost
brew install node
brew install git
```

Verify:
```bash
terraform --version
infracost --version
node --version
git --version
```

### Linux (Ubuntu/Debian)

```bash
# Install Terraform
wget https://apt.releases.hashicorp.com/gpg
sudo apt-key add gpg
sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
sudo apt-get update && sudo apt-get install terraform

# Install Infracost
curl -s https://raw.githubusercontent.com/infracost/infracost/master/scripts/install.sh | bash

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
terraform --version
infracost --version
node --version
```

---

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/gitops-cost-estimator.git
cd gitops-cost-estimator
```

Or if already downloaded:

```bash
cd gitops-cost-estimator
```

### 2. Verify Project Structure

```bash
# Windows
tree /F

# macOS/Linux
tree -L 3
```

You should see:
```
gitops-cost-estimator/
├── infra/
│   ├── aws/
│   ├── azure/
│   └── gcp/
├── scripts/
├── .github/
├── config/
├── examples/
├── package.json
└── README.md
```

### 3. Install Node Dependencies

```bash
npm install
```

This reads `package.json` and prepares the environment.

---

## Phase 1️⃣: Local Testing

### Test AWS Cost Estimation

```bash
# Run cost estimation
npm run estimate

# Or specifically for AWS
npm run estimate:aws
```

**Expected Output:**
```
🚀 GitOps Infrastructure Cost Estimator
📍 Step 1: Detecting cloud provider...
✓ AWS provider detected

🏗️  Estimating costs for AWS...
Step 1️⃣: Initializing Terraform for aws...
✓ Terraform initialized

Step 2️⃣: Creating Terraform plan for aws...
✓ Plan created

Step 3️⃣: Running Infracost analysis...
✓ Cost analysis complete

💰 COST BREAKDOWN:
Provider: AWS
Total Estimated Monthly Cost: $25.50
```

### Files Generated

After running, you'll have:
- `pr-comment.md` - Formatted PR comment
- `cost-history.json` - Historical tracking
- `.terraform/` in each infra directory

All good? ✅ Move to Phase 2!

---

## Phase 2️⃣: GitHub Setup

### Create GitHub Repository

1. Go to https://github.com/new
2. Create repository: `gitops-cost-estimator`
3. Choose **Public** (for course submission)
4. Skip README/License (we have them)

### Push Code to GitHub

```bash
# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: GitOps Cost Estimator - Phase 1-4"

# Create main branch
git branch -M main

# Add remote
git remote add origin https://github.com/yourusername/gitops-cost-estimator.git

# Push to GitHub
git push -u origin main
```

### Enable GitHub Actions

1. Go to your repository on GitHub
2. Click **Actions** tab
3. If prompted, click **Understand workflows**
4. Click **I understand, run workflows**

### Test PR with Cost Estimation

1. Create feature branch:
```bash
git checkout -b feature/test-cost-estimation
```

2. Modify AWS config to increase cost:
```bash
# Edit infra/aws/terraform.tfvars
instance_type = "t2.small"
```

3. Push and create PR:
```bash
git add infra/aws/terraform.tfvars
git commit -m "test: upgrade instance type"
git push origin feature/test-cost-estimation
```

4. Go to GitHub repo and click **Compare & pull request**

5. **Wait 2-3 minutes** for Actions to complete

6. Refresh PR page - you should see **cost comment** from GitHub Actions! 🎉

---

## Phase 3️⃣: Test Cost Alerts

### Trigger Warning Alert

Modify `infra/aws/terraform.tfvars`:
```hcl
instance_type   = "t3.medium"     # More expensive
create_database = true             # Add RDS
```

Run locally:
```bash
npm run estimate
```

You'll see:
```
⚠️ Cost Alerts
⚠️ WARNING: Cost exceeds WARNING threshold ($100)
```

### Your PR Comment Should Show

```markdown
### ⚠️ Cost Alerts

⚠️ WARNING: Cost exceeds WARNING threshold ($100)
```

Perfect! Alerts working ✅

---

## Phase 4️⃣: Multi-Cloud Testing

### Enable Azure Provider

Edit `infra/azure/terraform.tfvars`:
```hcl
azure_region    = "East US"
vm_size         = "Standard_B1s"
create_storage  = false
```

### Enable GCP Provider

Edit `infra/gcp/terraform.tfvars`:
```hcl
gcp_project_id  = "my-test-project"   # Use your GCP project
gcp_region      = "us-central1"
machine_type    = "e2-micro"
```

### Test Multi-Cloud Estimation

```bash
npm run estimate
```

**Output will show:**
- AWS costs
- Azure costs  
- GCP costs
- Combined total

---

## 📊 Quick Commands Reference

```bash
# Estimation
npm run estimate                # All providers
npm run estimate:aws           # AWS only
npm run estimate:azure         # Azure only
npm run estimate:gcp           # GCP only

# Terraform
npm run plan                   # Create plans
npm run clean                  # Clean up .terraform files

# Testing
npm run test                   # Run tests
npm run docs                   # Show documentation
```

---

## 🔧 Troubleshooting

### Error: "command not found: terraform"

**Solution:** Terraform not installed or not in PATH
```bash
# Windows - Reinstall via Chocolatey
choco install terraform -y

# macOS
brew install terraform

# Verify
terraform --version
```

### Error: "command not found: infracost"

**Solution:** Infracost not installed
```bash
# Windows
choco install infracost -y

# macOS
brew install infracost

# Linux/Manual
curl -fsSL https://raw.githubusercontent.com/infracost/infracost/master/scripts/install.sh | bash

# Verify
infracost --version
```

### GitHub Actions Not Running

**Solution:** Check Actions settings
1. Go to repo **Settings**
2. Under **Actions**, click **Runners**
3. Ensure "Allow all actions and reusable workflows" is selected

### PR Comment Not Posting

**Solution:** Check workflow logs
1. Go to **Actions** tab on GitHub
2. Click the failed workflow
3. Expand logs to debug
4. Usually: Infracost CLI not installed in runner

### Cost Numbers Look Wrong

**Solution:** Check Terraform syntax
```bash
cd infra/aws
terraform validate

cd ../azure
terraform validate

cd ../gcp
terraform validate
```

---

## 📝 Next Steps

1. ✅ Complete phase 1 (local) - Done
2. ✅ Complete phase 2 (GitHub Actions) - Do this
3. ✅ Complete phase 3 (cost alerts) - Test with expensive resources
4. ✅ Complete phase 4 (multi-cloud) - Enable all 3 providers
5. 📸 Take screenshots for your presentation
6. 🎬 Record demo video (optional)
7. 📋 Prepare presentation slides
8. 🎓 Submit to course instructor

---

## 🎓 Course Submission Checklist

- [ ] All 4 phases implemented
- [ ] GitHub repository created and public
- [ ] GitHub Actions workflow working
- [ ] PR comment posts cost estimates
- [ ] Cost alerts show for high costs
- [ ] Multi-cloud support for AWS, Azure, GCP
- [ ] README documented
- [ ] Code committed and pushed
- [ ] Demo runs without errors
- [ ] Screenshots/video captured

---

## 📮 Support

If you get stuck:
1. Check this guide section
2. Check README.md
3. View GitHub Actions logs
4. Run `npm run estimate` locally to debug

---

**Ready? Let's build! 🚀**
