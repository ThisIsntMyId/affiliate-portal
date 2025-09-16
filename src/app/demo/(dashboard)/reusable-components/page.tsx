"use client"

import { useState } from "react"
import { Trash2, Save, Download, User, CreditCard, TrendingUp, Settings } from "lucide-react"
import { ActionButton } from "@/components/ActionButton"
import { AlertBanner } from "@/components/AlertBanner"
import { ContentCard } from "@/components/ContentCard"
import { StatusIndicator } from "@/components/StatusIndicator"
import { ModalForm } from "@/components/ModalForm"
import { FormFieldConfig } from "@/components/DynamicForm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ReusableComponentsDemoPage() {
  const [showAlert, setShowAlert] = useState(true)
  const [userName, setUserName] = useState("John Doe")
  const [userEmail, setUserEmail] = useState("john@example.com")

  // Mock async functions
  const saveUser = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log("User saved successfully!")
  }

  const deleteUser = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log("User deleted successfully!")
  }

  const downloadReport = async () => {
    await new Promise(resolve => setTimeout(resolve, 3000))
    console.log("Report downloaded successfully!")
  }

  const handleRenewal = () => {
    console.log("Renewal initiated!")
  }

  // ModalForm demo
  const userFormConfig: FormFieldConfig[] = [
    {
      name: "name",
      label: "Full Name",
      type: "input",
      placeholder: "Enter full name",
      required: true,
      description: "Enter the user's full name"
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "Enter email address",
      required: true,
      description: "Enter a valid email address"
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      placeholder: "Select a role",
      required: true,
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
        { label: "Moderator", value: "moderator" }
      ]
    },
    {
      name: "isActive",
      label: "Active User",
      type: "switch",
      description: "Enable or disable this user account"
    }
  ]

  const handleUserSubmit = async (values: Record<string, unknown>) => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log("🚀 User form submitted:", values)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Reusable Components Demo</h1>
        <p className="text-lg text-muted-foreground mb-4">
          Interactive examples of our custom reusable components
        </p>
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>Tip:</strong> Open your browser console to see the async actions in action!
          </p>
        </div>
      </div>

      {/* AlertBanner Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">AlertBanner Component</h2>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Different Alert Types</h3>
          
          {showAlert && (
            <AlertBanner
              title="System Maintenance"
              description="Scheduled maintenance will occur tonight from 2-4 AM EST. Some features may be temporarily unavailable."
              style="warning"
              onClose={() => setShowAlert(false)}
            />
          )}

          <AlertBanner
            title="New Feature Available"
            description="Check out our latest dashboard improvements and analytics features."
            buttonTitle="Learn More"
            buttonUrl="/features"
            style="info"
          />

          <AlertBanner
            title="Payment Required"
            description="Your subscription will expire in 3 days. Renew now to avoid service interruption."
            buttonTitle="Renew Now"
            buttonAction={handleRenewal}
            style="danger"
          />

          <AlertBanner
            title="Payment Successful"
            description="Your payment of $99.00 has been processed successfully. Thank you for your business!"
            style="success"
          />
        </div>
      </section>

      {/* ActionButton Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">ActionButton Component</h2>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Action Buttons</h3>
          
          <div className="flex flex-wrap gap-4">
            <ActionButton
              onClick={saveUser}
              loadingText="Saving..."
              variant="default"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </ActionButton>

            <ActionButton
              onClick={downloadReport}
              loadingText="Downloading..."
              variant="outline"
            >
              <Download className="h-4 w-4" />
              Download Report
            </ActionButton>

            <ActionButton
              onClick={deleteUser}
              confirmation={{
                enabled: true,
                title: "Delete User",
                description: "This action cannot be undone. Are you sure you want to delete this user?",
                confirmText: "Delete",
                cancelText: "Cancel",
                icon: <Trash2 className="h-6 w-6 text-red-500" />
              }}
              variant="destructive"
            >
              <Trash2 className="h-4 w-4" />
              Delete User
            </ActionButton>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Different Sizes</h3>
          
          <div className="flex flex-wrap items-center gap-4">
            <ActionButton
              onClick={saveUser}
              size="sm"
              loadingText="Saving..."
            >
              Small Button
            </ActionButton>

            <ActionButton
              onClick={saveUser}
              size="default"
              loadingText="Saving..."
            >
              Default Button
            </ActionButton>

            <ActionButton
              onClick={saveUser}
              size="lg"
              loadingText="Saving..."
            >
              Large Button
            </ActionButton>
          </div>
        </div>
      </section>

      {/* StatusIndicator Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">StatusIndicator Component</h2>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">All Status Types</h3>
          
          <div className="flex flex-wrap gap-4">
            <StatusIndicator status="success">Active</StatusIndicator>
            <StatusIndicator status="warning">Pending</StatusIndicator>
            <StatusIndicator status="error">Failed</StatusIndicator>
            <StatusIndicator status="info">Processing</StatusIndicator>
            <StatusIndicator status="neutral">Inactive</StatusIndicator>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">With Custom Labels</h3>
          
          <div className="flex flex-wrap gap-4">
            <StatusIndicator status="success" label="Approved" />
            <StatusIndicator status="warning" label="Under Review" />
            <StatusIndicator status="error" label="Rejected" />
            <StatusIndicator status="info" label="In Progress" />
            <StatusIndicator status="neutral" label="Draft" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Without Icons</h3>
          
          <div className="flex flex-wrap gap-4">
            <StatusIndicator status="success" showIcon={false}>
              Completed
            </StatusIndicator>
            <StatusIndicator status="warning" showIcon={false}>
              Waiting
            </StatusIndicator>
            <StatusIndicator status="error" showIcon={false}>
              Error
            </StatusIndicator>
          </div>
        </div>
      </section>

      {/* ContentCard Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">ContentCard Component</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ContentCard
            title="User Profile"
            description="Manage your account settings and preferences"
            content={
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                </div>
              </div>
            }
            footer={
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <ActionButton onClick={saveUser} loadingText="Saving...">
                  Save Changes
                </ActionButton>
              </div>
            }
          />

          <ContentCard
            title="Payment Status"
            description="Current subscription and billing information"
            content={
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <StatusIndicator status="success">Active</StatusIndicator>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Plan</span>
                  <span className="font-medium">Pro Plan</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Next Billing</span>
                  <span className="font-medium">Jan 15, 2024</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="font-medium">$99.00</span>
                </div>
              </div>
            }
            footer={
              <div className="flex justify-between items-center">
                <Button variant="outline" size="sm" className="mr-2">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Update Payment
                </Button>
                <Button variant="outline" size="sm" className="mr-2">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Plan
                </Button>
              </div>
            }
          />
        </div>

        <ContentCard
          title="Analytics Overview"
          description="Key performance metrics and trends"
          content={
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">$12,345</div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
                <StatusIndicator status="success" className="mt-2">+12%</StatusIndicator>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <User className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">1,234</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
                <StatusIndicator status="success" className="mt-2">+5%</StatusIndicator>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <CreditCard className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold">3.2%</div>
                <div className="text-sm text-muted-foreground">Conversion Rate</div>
                <StatusIndicator status="warning" className="mt-2">-0.5%</StatusIndicator>
              </div>
            </div>
          }
          footer={
            <div className="flex justify-between items-center w-full">
              <StatusIndicator status="info">Last updated 2 minutes ago</StatusIndicator>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          }
        />
      </section>

      {/* Combined Example */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Combined Example</h2>
        
        <ContentCard
          title="Affiliate Dashboard"
          description="Manage your affiliate program and track performance"
          content={
            <div className="space-y-6">
              <AlertBanner
                title="Welcome to your dashboard!"
                description="You've earned $1,234 in commissions this month. Keep up the great work!"
                style="success"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Account Status</span>
                    <StatusIndicator status="success">Verified</StatusIndicator>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Commission Rate</span>
                    <span className="text-sm">5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Earnings</span>
                    <span className="text-sm font-bold">$12,345</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Active Campaigns</span>
                    <span className="text-sm">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Pending Payout</span>
                    <span className="text-sm font-bold">$456</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Next Payout</span>
                    <span className="text-sm">Jan 15, 2024</span>
                  </div>
                </div>
              </div>
            </div>
          }
          footer={
            <div className="flex justify-between items-center w-full">
              <div className="flex gap-2">
                <StatusIndicator status="info">All systems operational</StatusIndicator>
              </div>
              <div className="flex gap-2">
                <ActionButton
                  onClick={downloadReport}
                  variant="outline"
                  loadingText="Generating..."
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </ActionButton>
                <ActionButton
                  onClick={saveUser}
                  loadingText="Saving..."
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </ActionButton>
              </div>
            </div>
          }
        />
      </section>

      {/* ModalForm Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">ModalForm Component</h2>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Modal Forms</h3>
          
          <div className="flex flex-wrap gap-4">
            <ModalForm
              modalTitle="Create New User"
              modalDescription="Fill in the details to create a new user account."
              config={userFormConfig}
              onSubmit={handleUserSubmit}
              defaultValues={{
                isActive: true,
                role: "user"
              }}
              saveText="Create User"
              cancelText="Cancel"
              loadingText="Creating..."
            >
              <User className="h-4 w-4 mr-2" />
              Create User
            </ModalForm>

            <ModalForm
              modalTitle="Edit Profile"
              modalDescription="Update your profile information."
              config={userFormConfig}
              onSubmit={handleUserSubmit}
              defaultValues={{
                name: "John Doe",
                email: "john@example.com",
                role: "admin",
                isActive: true
              }}
              saveText="Update Profile"
              cancelText="Cancel"
              loadingText="Updating..."
              variant="outline"
            >
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </ModalForm>

            <ModalForm
              modalTitle="Quick Settings"
              modalDescription="Configure your preferences."
              config={[
                {
                  name: "notifications",
                  label: "Email Notifications",
                  type: "switch",
                  description: "Receive email notifications"
                },
                {
                  name: "theme",
                  label: "Theme",
                  type: "select",
                  options: [
                    { label: "Light", value: "light" },
                    { label: "Dark", value: "dark" },
                    { label: "System", value: "system" }
                  ]
                }
              ]}
              onSubmit={async (values) => {
                await new Promise(resolve => setTimeout(resolve, 1000))
                console.log("Settings updated:", values)
              }}
              saveText="Save Settings"
              cancelText="Cancel"
              loadingText="Saving..."
              variant="secondary"
            >
              <Settings className="h-4 w-4 mr-2" />
              Quick Settings
            </ModalForm>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Advanced Modal Forms</h3>
          
          <div className="flex flex-wrap gap-4">
            <ModalForm
              modalTitle="Campaign Configuration"
              modalDescription="Set up a new marketing campaign with detailed configuration options."
              config={[
                {
                  name: "campaignName",
                  label: "Campaign Name",
                  type: "input",
                  placeholder: "Enter campaign name",
                  required: true
                },
                {
                  name: "description",
                  label: "Description",
                  type: "textarea",
                  placeholder: "Describe your campaign",
                  colSpan: 2
                },
                {
                  name: "budget",
                  label: "Budget",
                  type: "number",
                  placeholder: "Enter budget amount",
                  prefix: "$",
                  required: true
                },
                {
                  name: "startDate",
                  label: "Start Date",
                  type: "date",
                  required: true
                },
                {
                  name: "channels",
                  label: "Marketing Channels",
                  type: "checkboxgroup",
                  options: [
                    { label: "Email", value: "email" },
                    { label: "Social Media", value: "social" },
                    { label: "Google Ads", value: "google" },
                    { label: "Facebook Ads", value: "facebook" }
                  ]
                },
                {
                  name: "isActive",
                  label: "Active Campaign",
                  type: "switch",
                  description: "Enable this campaign immediately"
                }
              ]}
              onSubmit={async (values) => {
                await new Promise(resolve => setTimeout(resolve, 2500))
                console.log("Campaign created:", values)
              }}
              saveText="Create Campaign"
              cancelText="Cancel"
              loadingText="Creating Campaign..."
              gridCols={2}
              variant="default"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Create Campaign
            </ModalForm>
          </div>
        </div>
      </section>

      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold text-center mb-6">Component Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <h3 className="font-semibold mb-2">ActionButton</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✅ Async operation handling</li>
              <li>✅ Loading states</li>
              <li>✅ Confirmation dialogs</li>
              <li>✅ Error handling</li>
            </ul>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <h3 className="font-semibold mb-2">AlertBanner</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✅ 4 style variants</li>
              <li>✅ CTA buttons</li>
              <li>✅ Auto-dismissible</li>
              <li>✅ Custom icons</li>
            </ul>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <h3 className="font-semibold mb-2">ContentCard</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✅ Simplified API</li>
              <li>✅ Optional props</li>
              <li>✅ Flexible content</li>
              <li>✅ Footer actions</li>
            </ul>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <h3 className="font-semibold mb-2">StatusIndicator</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✅ 5 status types</li>
              <li>✅ Consistent styling</li>
              <li>✅ Icon support</li>
              <li>✅ Custom labels</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
