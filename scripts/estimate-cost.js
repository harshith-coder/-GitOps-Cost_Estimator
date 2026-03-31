const { exec } = require('child_process');
const { readFileSync, writeFileSync, existsSync } = require('fs');
const path = require('path');

// ANSI Color codes for terminal output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
};

// ============================================
// PHASE 1: Basic cost estimation
// PHASE 2: GitHub PR comment integration
// PHASE 3: Cost comparison & alerts
// PHASE 4: Multi-cloud support (AWS, Azure, GCP)
// ============================================

class CostEstimator {
  constructor() {
    this.reports = {};
    this.costHistory = {};
    this.threshold = {
      warning: 100,
      critical: 500
    };
  }

  log(msg, color = 'reset') {
    console.log(`${colors[color]}${msg}${colors.reset}`);
  }

  runCommand(cmd) {
    return new Promise((resolve, reject) => {
      exec(cmd, { shell: true, cwd: process.cwd() }, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  }

  async detectProvider() {
    // PHASE 4: Auto-detect cloud provider from Terraform files
    this.log('\n📍 Step 1: Detecting cloud provider...', 'cyan');
    
    // Check for AWS
    if (existsSync('infra/aws/main.tf')) {
      this.log('✓ AWS provider detected', 'green');
      return 'aws';
    }
    
    // Check for Azure
    if (existsSync('infra/azure/main.tf')) {
      this.log('✓ Azure provider detected', 'green');
      return 'azure';
    }
    
    // Check for GCP
    if (existsSync('infra/gcp/main.tf')) {
      this.log('✓ GCP provider detected', 'green');
      return 'gcp';
    }

    // Fallback to AWS
    this.log('⚠ No provider detected, defaulting to AWS', 'yellow');
    return 'aws';
  }

  async getProviderPath(provider) {
    // PHASE 4: Get the correct infrastructure path for the provider
    const providerMap = {
      aws: 'infra/aws',
      azure: 'infra/azure',
      gcp: 'infra/gcp'
    };
    return providerMap[provider] || 'infra/aws';
  }

  async estimateForProvider(provider) {
    const infraPath = await this.getProviderPath(provider);
    
    this.log(`\n🏗️  Estimating costs for ${provider.toUpperCase()}...`, 'magenta');
    this.log(`📁 Infrastructure path: ${infraPath}\n`, 'dim');

    try {
      // PHASE 1: Initialize Terraform
      this.log(`Step 1️⃣: Initializing Terraform for ${provider}...`, 'blue');
      await this.runCommand(`cd ${infraPath} && terraform init`);
      this.log('✓ Terraform initialized\n', 'green');

      // PHASE 1: Create Terraform plan
      this.log(`Step 2️⃣: Creating Terraform plan for ${provider}...`, 'blue');
      await this.runCommand(`cd ${infraPath} && terraform plan -out=tfplan`);
      this.log('✓ Plan created\n', 'green');

      // PHASE 1: Run Infracost
      this.log(`Step 3️⃣: Running Infracost analysis...`, 'blue');
      const costOutput = await this.runCommand(
        `infracost breakdown --path ${infraPath}/tfplan --format json`
      );
      
      const costData = JSON.parse(costOutput);
      this.log('✓ Cost analysis complete\n', 'green');

      // Parse cost data
      const totalCost = costData.totalMonthlyCost || 0;
      const resources = costData.breakdown?.[0]?.resources || [];

      return {
        provider,
        totalCost,
        resources,
        breakdown: costData.breakdown?.[0] || {}
      };

    } catch (error) {
      this.log(`❌ Error estimating costs for ${provider}: ${error.message}`, 'red');
      return {
        provider,
        totalCost: 0,
        resources: [],
        error: error.message
      };
    }
  }

  // PHASE 3: Compare costs with previous estimates
  compareCosts(currentCost, previousCost = null) {
    if (previousCost === null) {
      return {
        symbol: '📊',
        text: `First estimation`,
        diff: 0,
        percentage: 0
      };
    }

    const diff = currentCost - previousCost;
    const percentage = previousCost > 0 ? ((diff / previousCost) * 100).toFixed(2) : 0;

    if (diff > 0) {
      return {
        symbol: '📈',
        text: `increased by $${diff.toFixed(2)} (+${percentage}%)`,
        diff,
        percentage
      };
    } else if (diff < 0) {
      return {
        symbol: '📉',
        text: `decreased by $${Math.abs(diff).toFixed(2)} (${percentage}%)`,
        diff,
        percentage
      };
    } else {
      return {
        symbol: '➡️',
        text: 'stayed the same',
        diff: 0,
        percentage: 0
      };
    }
  }

  // PHASE 3: Generate cost alerts
  generateAlerts(totalCost) {
    const alerts = [];

    if (totalCost > this.threshold.critical) {
      alerts.push({
        level: 'critical',
        icon: '🚨',
        message: `Cost exceeds CRITICAL threshold ($${this.threshold.critical})`
      });
    } else if (totalCost > this.threshold.warning) {
      alerts.push({
        level: 'warning',
        icon: '⚠️',
        message: `Cost exceeds WARNING threshold ($${this.threshold.warning})`
      });
    }

    return alerts;
  }

  // Display cost breakdown in console
  displayCostBreakdown(report) {
    this.log('\n💰 COST BREAKDOWN:\n', 'bold');
    this.log(`Provider: ${report.provider.toUpperCase()}`, 'cyan');
    this.log(`Total Estimated Monthly Cost: $${report.totalCost.toFixed(2)}`, 'green');

    if (report.resources.length > 0) {
      this.log('\n📋 Resource Details:', 'bold');
      this.log('─'.repeat(90));

      report.resources.forEach(resource => {
        const resourceCost = resource.monthlyCost || 0;
        const status = resourceCost > 0 ? '➕' : (resourceCost < 0 ? '➖' : '➡️');
        this.log(`${status} ${resource.name}`);
        this.log(`   Type: ${resource.resourceType} | Cost: $${resourceCost.toFixed(2)}/month`);
      });
    } else {
      this.log('No resources found', 'yellow');
    }
  }

  // PHASE 2/3: Generate PR comment
  generatePRComment(reports) {
    let comment = `## 💰 Cloud Cost Impact Analysis\n\n`;
    
    const totalMultiCloudCost = Object.values(reports).reduce((sum, r) => sum + r.totalCost, 0);
    comment += `**Total Estimated Monthly Cost: $${totalMultiCloudCost.toFixed(2)}**\n\n`;

    // PHASE 4: Multi-cloud breakdown
    if (Object.keys(reports).length > 1) {
      comment += `### Cloud Provider Breakdown\n\n`;
      for (const [provider, report] of Object.entries(reports)) {
        if (!report.error) {
          comment += `**${provider.toUpperCase()}**: $${report.totalCost.toFixed(2)}/month\n`;
        }
      }
      comment += `\n`;
    }

    // Detailed resource breakdown
    comment += `### Resource Breakdown\n\n`;
    
    for (const [provider, report] of Object.entries(reports)) {
      if (report.error) continue;

      const resources = report.resources || [];
      const addedResources = resources.filter(r => r.monthlyCost > 0);

      if (addedResources.length > 0) {
        comment += `#### ${provider.toUpperCase()} Resources\n`;
        comment += `| Resource | Type | Cost/Month |\n`;
        comment += `|----------|------|------------|\n`;

        addedResources.forEach(r => {
          comment += `| ${r.name} | ${r.resourceType} | $${(r.monthlyCost || 0).toFixed(2)} |\n`;
        });
        comment += `\n`;
      }
    }

    // PHASE 3: Alerts
    const alerts = this.generateAlerts(totalMultiCloudCost);
    if (alerts.length > 0) {
      comment += `### ⚠️ Cost Alerts\n\n`;
      alerts.forEach(alert => {
        comment += `${alert.icon} **${alert.level.toUpperCase()}**: ${alert.message}\n`;
      });
      comment += `\n`;
    }

    comment += `---\n`;
    comment += `*Generated by GitOps Cost Estimator*\n`;
    comment += `*Powered by Infracost & Terraform*`;

    return comment;
  }

  async estimateAllProviders() {
    this.log('\n' + '='.repeat(90), 'bold');
    this.log('🚀 GitOps Infrastructure Cost Estimator', 'bold');
    this.log('Multi-Cloud Cost Analysis Tool (Phases 1-4)', 'bold');
    this.log('='.repeat(90), 'bold');

    const detectedProvider = await this.detectProvider();
    
    // Determine which providers to estimate
    const providersToCheck = ['aws', 'azure', 'gcp'];
    const enabledProviders = [];

    for (const provider of providersToCheck) {
      const infraPath = await this.getProviderPath(provider);
      if (existsSync(`${infraPath}/main.tf`)) {
        enabledProviders.push(provider);
      }
    }

    this.log(`\n✓ Found ${enabledProviders.length} provider(s): ${enabledProviders.join(', ').toUpperCase()}\n`, 'green');

    // PHASE 4: Estimate costs for all enabled providers
    const reports = {};
    for (const provider of enabledProviders) {
      const report = await this.estimateForProvider(provider);
      reports[provider] = report;
      this.displayCostBreakdown(report);
    }

    // Generate PR comment
    this.log('\n' + '='.repeat(90), 'bold');
    this.log('📝 GENERATING PR COMMENT', 'bold');
    this.log('='.repeat(90), 'bold');
    
    const prComment = this.generatePRComment(reports);
    
    this.log('\n' + '─'.repeat(90));
    this.log(prComment);
    this.log('─'.repeat(90));

    // Save PR comment to file for GitHub Actions
    writeFileSync('pr-comment.md', prComment);
    this.log('\n✅ Comment saved to: pr-comment.md', 'green');

    // Save cost history for Phase 3
    const timestamp = new Date().toISOString();
    const costHistoryFile = 'cost-history.json';
    let history = {};
    
    if (existsSync(costHistoryFile)) {
      history = JSON.parse(readFileSync(costHistoryFile, 'utf8'));
    }

    history[timestamp] = reports;
    writeFileSync(costHistoryFile, JSON.stringify(history, null, 2));

    return { success: true, reports, prComment };
  }
}

// Main execution
async function main() {
  try {
    const estimator = new CostEstimator();
    const result = await estimator.estimateAllProviders();
    
    if (result.success) {
      console.log('\n' + '='.repeat(90));
      console.log('✅ COST ESTIMATION COMPLETE!', 'green');
      console.log('='.repeat(90));
    }
  } catch (error) {
    const red = '\x1b[31m';
    const reset = '\x1b[0m';
    console.error(`${red}❌ Fatal Error: ${error.message}${reset}`);
    process.exit(1);
  }
}

main();
