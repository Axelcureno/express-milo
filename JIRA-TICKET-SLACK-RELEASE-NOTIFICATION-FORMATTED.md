MWPW-XXXXX: Add Slack Release Notification with Test Mode Support

Issue Type: Story
Priority: Medium
Labels: slack, automation, release, notification, testing

Summary
Implement automated Slack notifications for Express Milo releases with comprehensive test mode capabilities to ensure reliable release communications and safe testing.

Description

Background
Currently, release notifications are manual. We need an automated system that:
- Notifies the team when new code is deployed to production
- Provides safe testing capabilities without affecting production channels
- Includes proper formatting and Jira ticket integration
- Supports multiple trigger methods for flexibility

User Story
As a developer/team member, I want to receive automated Slack notifications when releases are deployed so that I can stay informed about what's been released and test the notification system safely.

Acceptance Criteria

Core Functionality
- [ ] Automatic Production Notifications
  - [ ] Send Slack notification when code is pushed to main branch
  - [ ] Include release details: branch, commit, test URLs, changes
  - [ ] Route to production Slack channel

- [ ] Test Mode Support
  - [ ] Manual trigger via GitHub Actions UI with test mode checkbox
  - [ ] Label-based testing with test-release-notification label
  - [ ] Test notifications include (TEST MODE) prefix
  - [ ] Route test notifications to separate test channel

- [ ] Slack Message Formatting
  - [ ] Structured multi-section layout with colored bars
  - [ ] Short commit SHA (7 characters) for clean display
  - [ ] Clickable test URLs and commit links
  - [ ] Jira ticket auto-extraction and linking
  - [ ] Professional formatting with emojis and clear hierarchy

Technical Requirements
- [ ] Workflow Configuration
  - [ ] Support push to main branch trigger
  - [ ] Support workflow_dispatch with test mode input
  - [ ] Support pull_request with label trigger
  - [ ] Proper environment variable handling for webhook URLs

- [ ] Error Handling
  - [ ] Robust error handling for webhook failures
  - [ ] Fallback notification system
  - [ ] Proper step output management
  - [ ] Graceful handling of missing data

- [ ] Documentation
  - [ ] Comprehensive workflow documentation
  - [ ] Configuration requirements
  - [ ] Testing instructions
  - [ ] Troubleshooting guide

Technical Implementation

Workflow Features
- Triggers: push (main), workflow_dispatch, pull_request (labeled)
- Environment Variables: SLACK_WEBHOOK_URL, SLACK_WEBHOOK_URL_TEST
- Steps: Checkout, Extract PRs, Get Short SHA, Send Notification
- Error Handling: Fallback notification on failure

Configuration Requirements

GitHub Secrets
- SLACK_WEBHOOK_URL - Production Slack webhook URL
- SLACK_WEBHOOK_URL_TEST - Test Slack webhook URL

GitHub Labels
- test-release-notification - For label-based testing

Testing Strategy

Manual Testing
1. Use GitHub Actions UI → "Run workflow" button
2. Check "Test mode" checkbox
3. Verify test notification sent to test channel with (TEST MODE) prefix

Label-Based Testing
1. Add test-release-notification label to any PR
2. Verify test notification sent to test channel
3. Remove label and verify no additional notifications

Production Testing
1. Push to main branch
2. Verify production notification sent to main channel
3. Verify proper formatting and Jira ticket linking

Definition of Done
- [ ] All acceptance criteria met
- [ ] Workflow successfully triggers on all configured events
- [ ] Test mode properly routes to test channel
- [ ] Production mode properly routes to production channel
- [ ] Slack messages properly formatted with all required elements
- [ ] Jira ticket extraction and linking working
- [ ] Error handling and fallback notifications working
- [ ] Documentation complete and accurate
- [ ] All tests passing
- [ ] Code reviewed and approved

Business Value
- Automated Communication: Eliminates manual release notification overhead
- Team Visibility: Ensures all team members are informed of deployments
- Safe Testing: Prevents accidental production notifications during testing
- Professional Presentation: Clean, structured notifications improve team communication
- Traceability: Jira ticket integration improves change tracking

Dependencies
- GitHub Actions workflow permissions
- Slack webhook URLs for production and test channels
- Access to create GitHub labels

Risks & Mitigation
- Risk: Webhook URL exposure
  - Mitigation: Use GitHub secrets for webhook URLs
- Risk: Test notifications sent to production
  - Mitigation: Separate webhook URLs and test mode indicators
- Risk: Workflow failures
  - Mitigation: Robust error handling and fallback notifications

Acceptance Testing
1. Manual Trigger Test: Verify test mode checkbox works
2. Label Trigger Test: Verify label-based testing works
3. Production Trigger Test: Verify main branch push triggers notification
4. Formatting Test: Verify Slack message formatting is correct
5. Jira Integration Test: Verify Jira tickets are extracted and linked
6. Error Handling Test: Verify fallback notifications work

Notes
- This feature enhances team communication and release visibility
- Test mode ensures safe testing without affecting production
- Jira integration improves traceability and change management


