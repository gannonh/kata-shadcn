import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const title = "Nested Tabs";

const Example = () => (
  <Tabs className="w-full max-w-2xl" defaultValue="profile">
    <TabsList>
      <TabsTrigger value="profile">Profile</TabsTrigger>
      <TabsTrigger value="settings">Settings</TabsTrigger>
      <TabsTrigger value="billing">Billing</TabsTrigger>
    </TabsList>
    <TabsContent value="profile">
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Profile</h3>
        <Tabs defaultValue="personal">
          <TabsList>
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="social">Social Links</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          <TabsContent value="personal">
            <div className="mt-4 space-y-3 rounded-md border p-4">
              <div>
                <p className="text-sm font-medium">Full Name</p>
                <p className="text-sm text-muted-foreground">John Doe</p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">
                  john.doe@example.com
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">
                  San Francisco, CA
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="social">
            <div className="mt-4 space-y-3 rounded-md border p-4">
              <div>
                <p className="text-sm font-medium">Twitter</p>
                <p className="text-sm text-muted-foreground">@johndoe</p>
              </div>
              <div>
                <p className="text-sm font-medium">GitHub</p>
                <p className="text-sm text-muted-foreground">
                  github.com/johndoe
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Website</p>
                <p className="text-sm text-muted-foreground">johndoe.com</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="preferences">
            <div className="mt-4 space-y-3 rounded-md border p-4">
              <div>
                <p className="text-sm font-medium">Language</p>
                <p className="text-sm text-muted-foreground">English</p>
              </div>
              <div>
                <p className="text-sm font-medium">Timezone</p>
                <p className="text-sm text-muted-foreground">
                  Pacific Time (PT)
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">System Default</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TabsContent>
    <TabsContent value="settings">
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Settings</h3>
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <div className="mt-4 space-y-3 rounded-md border p-4">
              <div>
                <p className="text-sm font-medium">Account Status</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
              <div>
                <p className="text-sm font-medium">Member Since</p>
                <p className="text-sm text-muted-foreground">January 2024</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="security">
            <div className="mt-4 space-y-3 rounded-md border p-4">
              <div>
                <p className="text-sm font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Enabled</p>
              </div>
              <div>
                <p className="text-sm font-medium">Last Password Change</p>
                <p className="text-sm text-muted-foreground">30 days ago</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="privacy">
            <div className="mt-4 space-y-3 rounded-md border p-4">
              <div>
                <p className="text-sm font-medium">Profile Visibility</p>
                <p className="text-sm text-muted-foreground">Public</p>
              </div>
              <div>
                <p className="text-sm font-medium">Data Sharing</p>
                <p className="text-sm text-muted-foreground">Disabled</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TabsContent>
    <TabsContent value="billing">
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Billing</h3>
        <Tabs defaultValue="plan">
          <TabsList>
            <TabsTrigger value="plan">Current Plan</TabsTrigger>
            <TabsTrigger value="payment">Payment Method</TabsTrigger>
            <TabsTrigger value="history">Billing History</TabsTrigger>
          </TabsList>
          <TabsContent value="plan">
            <div className="mt-4 space-y-3 rounded-md border p-4">
              <div>
                <p className="text-sm font-medium">Plan</p>
                <p className="text-sm text-muted-foreground">Professional</p>
              </div>
              <div>
                <p className="text-sm font-medium">Price</p>
                <p className="text-sm text-muted-foreground">$29/month</p>
              </div>
              <div>
                <p className="text-sm font-medium">Next Billing Date</p>
                <p className="text-sm text-muted-foreground">
                  February 1, 2024
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="payment">
            <div className="mt-4 space-y-3 rounded-md border p-4">
              <div>
                <p className="text-sm font-medium">Payment Method</p>
                <p className="text-sm text-muted-foreground">
                  •••• •••• •••• 4242
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Expires</p>
                <p className="text-sm text-muted-foreground">12/2025</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="history">
            <div className="mt-4 space-y-3 rounded-md border p-4">
              <div>
                <p className="text-sm font-medium">January 2024</p>
                <p className="text-sm text-muted-foreground">$29.00 - Paid</p>
              </div>
              <div>
                <p className="text-sm font-medium">December 2023</p>
                <p className="text-sm text-muted-foreground">$29.00 - Paid</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TabsContent>
  </Tabs>
);

export default Example;
