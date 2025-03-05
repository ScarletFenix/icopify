import AdminLayout from "./layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Users, Globe } from "lucide-react";

const AdminPage = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow-lg p-4 border border-gray-200">
            <CardHeader className="flex items-center space-x-3">
              <Users className="text-blue-500 w-8 h-8" />
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">1,245</p>
              <p className="text-gray-500 text-sm">Active users on the platform</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg p-4 border border-gray-200">
            <CardHeader className="flex items-center space-x-3">
              <Globe className="text-green-500 w-8 h-8" />
              <CardTitle>Total Sites</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">567</p>
              <p className="text-gray-500 text-sm">Verified sites listed</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg p-4 border border-gray-200">
            <CardHeader className="flex items-center space-x-3">
              <BarChart className="text-purple-500 w-8 h-8" />
              <CardTitle>Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">32</p>
              <p className="text-gray-500 text-sm">Pending user/site reports</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
          <div className="bg-white shadow-md rounded-lg p-4">
            <ul className="divide-y divide-gray-200">
              <li className="py-3 flex justify-between">
                <span>User <strong>JohnDoe</strong> added a new site</span>
                <span className="text-gray-500 text-sm">2 hours ago</span>
              </li>
              <li className="py-3 flex justify-between">
                <span>Admin approved <strong>ExampleSite.com</strong></span>
                <span className="text-gray-500 text-sm">5 hours ago</span>
              </li>
              <li className="py-3 flex justify-between">
                <span>User <strong>JaneSmith</strong> reported a site</span>
                <span className="text-gray-500 text-sm">1 day ago</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPage;
