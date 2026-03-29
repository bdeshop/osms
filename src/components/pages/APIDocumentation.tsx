"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Copy,
  Check,
  Send,
  ChevronDown,
  ChevronUp,
  Code,
  Loader,
} from "lucide-react";
import { packageAPI, API_BASE_URL, API_BASE } from "@/services/api";

interface PackageData {
  _id: string;
  name: string;
  description: string;
  messageCount: number;
  costPerMessage: number;
  totalPrice: number;
  features: string[];
  isActive: boolean;
  packageToken: string;
}

export default function APIDocumentation() {
  const router = useRouter();
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<{ [key: string]: string }>({});
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentSelection();
  }, []);

  const fetchCurrentSelection = async () => {
    try {
      setLoading(true);
      const response = (await packageAPI.getSelectionInfo()) as any;
      if (response.success && response.data) {
        setSelectedPackage(response.data.packageId);
      } else {
        setSelectedPackage(null);
      }
    } catch (err) {
      console.error("Failed to fetch selection:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleEndpoint = (id: string) => {
    setExpandedEndpoint(expandedEndpoint === id ? null : id);
  };

  const setTab = (endpointId: string, tab: string) => {
    setActiveTab((prev) => ({ ...prev, [endpointId]: tab }));
  };

  const getActiveTab = (endpointId: string) => activeTab[endpointId] || "curl";

  // Get package token from localStorage or use placeholder
  const packageToken =
    selectedPackage?.packageToken || "your_package_token_here";

  const endpoints = [
    {
      id: "send-sms",
      title: "Send SMS",
      method: "POST",
      endpoint: "/api/messaging/sendRequest",
      fullUrl: `${API_BASE_URL}/api/messaging/sendRequest`,
      description: "Send SMS to a single recipient using your package token",
      request: {
        recipient: "8801772411171",
        message: "Hello SMS",
        packageToken: packageToken,
      },
      response: {
        success: true,
        message: "SMS sent successfully",
        data: {
          success: true,
          messageId: "msg_123456",
          status: "sent",
        },
      },
      curlExample: `curl -X POST ${API_BASE_URL}/api/messaging/sendRequest \\
  -H "Content-Type: application/json" \\
  -d '{
    "recipient": "8801772411171",
    "message": "Hello SMS",
    "packageToken": "${packageToken}"
  }'`,
      jsExample: `const response = await fetch('${API_BASE_URL}/api/messaging/sendRequest', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    recipient: '8801772411171',
    message: 'Hello SMS',
    packageToken: '${packageToken}'
  })
});

const data = await response.json();
console.log(data);`,
      pythonExample: `import requests

url = '${API_BASE_URL}/api/messaging/sendRequest'
headers = {
    'Content-Type': 'application/json'
}
payload = {
    'recipient': '8801772411171',
    'message': 'Hello SMS',
    'packageToken': '${packageToken}'
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
      notes:
        "Message must be 160 characters or less. Use the package token from your selected package.",
    },
    {
      id: "send-bulk",
      title: "Send Bulk SMS",
      method: "POST",
      endpoint: "/api/messaging/sendBulkRequest",
      fullUrl: `${API_BASE_URL}/api/messaging/sendBulkRequest`,
      description: "Send SMS to multiple recipients at once",
      request: {
        recipients: ["8801772411171", "8801234567890"],
        message: "Hello SMS",
        packageToken: packageToken,
      },
      response: {
        success: true,
        message: "Bulk SMS sent",
        data: {
          success: true,
          status: "Sent to 2 recipients, 0 failed",
        },
      },
      curlExample: `curl -X POST ${API_BASE_URL}/api/messaging/sendBulkRequest \\
  -H "Content-Type: application/json" \\
  -d '{
    "recipients": ["8801772411171", "8801234567890"],
    "message": "Hello SMS",
    "packageToken": "${packageToken}"
  }'`,
      jsExample: `const response = await fetch('${API_BASE_URL}/api/messaging/sendBulkRequest', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    recipients: ['8801772411171', '8801234567890'],
    message: 'Hello SMS',
    packageToken: '${packageToken}'
  })
});

const data = await response.json();
console.log(data);`,
      pythonExample: `import requests

url = '${API_BASE_URL}/api/messaging/sendBulkRequest'
headers = {
    'Content-Type': 'application/json'
}
payload = {
    'recipients': ['8801772411171', '8801234567890'],
    'message': 'Hello SMS',
    'packageToken': '${packageToken}'
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
      notes:
        "Message must be 160 characters or less. Use the package token from your selected package.",
    },
    {
      id: "view-history",
      title: "View History",
      method: "GET",
      endpoint: "/api/messaging/history/{token}",
      fullUrl: `${API_BASE_URL}/api/messaging/history/${packageToken}`,
      description: "View message history for a specific package token",
      request: null,
      response: {
        success: true,
        data: [
          {
            recipient: "8801772411171",
            message: "Hello SMS",
            status: "sent",
            createdAt: "2026-03-14T...",
          },
        ],
      },
      curlExample: `curl -X GET ${API_BASE_URL}/api/messaging/history/${packageToken}`,
      jsExample: `const response = await fetch('${API_BASE_URL}/api/messaging/history/${packageToken}', {
  method: 'GET'
});

const data = await response.json();
console.log(data);`,
      pythonExample: `import requests

url = '${API_BASE_URL}/api/messaging/history/${packageToken}'

response = requests.get(url)
print(response.json())`,
      notes:
        "This is a public endpoint that returns all messages sent using this specific token.",
    },
    {
      id: "generate-otp",
      title: "Generate & Send OTP",
      method: "GET",
      endpoint: "/api/messaging/otp",
      fullUrl: `${API_BASE_URL}/api/messaging/otp`,
      description: "Generate a 4-digit OTP and send it via SMS (Billed to wallet)",
      request: {
        recipient: "8801772411171",
        packageToken: packageToken,
        expiry: 5
      },
      response: {
        success: true,
        message: "OTP sent successfully",
        data: {
          otp: "1234",
          expiry: "2026-03-29T...",
          messageId: "msg_789012",
          cost: 2.0
        }
      },
      curlExample: `curl -G "${API_BASE_URL}/api/messaging/otp" \\
  --data-urlencode "recipient=8801772411171" \\
  --data-urlencode "packageToken=${packageToken}" \\
  --data-urlencode "expiry=5"`,
      jsExample: `const response = await fetch(\`${API_BASE_URL}/api/messaging/otp?recipient=8801772411171&packageToken=${packageToken}&expiry=5\`, {
  method: 'GET'
});

const data = await response.json();
console.log(data);`,
      pythonExample: `import requests

url = '${API_BASE_URL}/api/messaging/otp'
params = {
    'recipient': '8801772411171',
    'packageToken': '${packageToken}',
    'expiry': 5
}

response = requests.get(url, params=params)
print(response.json())`,
      notes: "The OTP is 4 digits numeric. The cost is deducted from your balance based on the plan rate.",
    },
    {
      id: "verify-otp",
      title: "Verify OTP",
      method: "POST",
      endpoint: "/api/messaging/verify-otp",
      fullUrl: `${API_BASE_URL}/api/messaging/verify-otp`,
      description: "Verify a 4-digit code sent to a specific number",
      request: {
        recipient: "8801772411171",
        code: "1234"
      },
      response: {
        success: true,
        message: "OTP verified successfully"
      },
      curlExample: `curl -X POST ${API_BASE_URL}/api/messaging/verify-otp \\
  -H "Content-Type: application/json" \\
  -d '{
    "recipient": "8801772411171",
    "code": "1234"
  }'`,
      jsExample: `const response = await fetch('${API_BASE_URL}/api/messaging/verify-otp', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    recipient: '8801772411171',
    code: '1234'
  })
});

const data = await response.json();
console.log(data);`,
      pythonExample: `import requests

url = '${API_BASE_URL}/api/messaging/verify-otp'
payload = {
    'recipient': '8801772411171',
    'code': '1234'
}

response = requests.post(url, json=payload)
print(response.json())`,
      notes: "OTP can only be verified once. After a successful verification, the code is invalidated.",
    },
    {
      id: "purchase-package",
      title: "Purchase Package",
      method: "POST",
      endpoint: "/api/payment/initiate",
      fullUrl: `${API_BASE_URL}/api/payment/initiate`,
      description: "Initiate a package purchase using OraclePay",
      request: {
        packageId: "PACKAGE_ID_HERE",
        success_redirect_url: "https://your-site.com/payment-success",
      },
      response: {
        success: true,
        payment_page_url: "https://oraclepay.com/pay/...",
      },
      curlExample: `curl -X POST ${API_BASE_URL}/api/payment/initiate \\
  -H "Content-Type: application/json" \\
  -d '{
    "packageId": "PACKAGE_ID_HERE",
    "success_redirect_url": "https://your-site.com/payment-success"
  }'`,
      jsExample: `const response = await fetch('${API_BASE_URL}/api/payment/initiate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    packageId: 'PACKAGE_ID_HERE',
    success_redirect_url: 'https://your-site.com/payment-success'
  })
});

const data = await response.json();
if (data.payment_page_url) {
  window.location.href = data.payment_page_url;
}`,
      pythonExample: `import requests

url = '${API_BASE_URL}/api/payment/initiate'
payload = {
    'packageId': 'PACKAGE_ID_HERE',
    'success_redirect_url': 'https://your-site.com/payment-success'
}

response = requests.post(url, json=payload)
print(response.json())`,
      notes:
        "The backend returns a payment_page_url. Promptly redirect the user's browser to this URL to complete payment.",
    },
    {
      id: "recharge-wallet",
      title: "Recharge Wallet",
      method: "POST",
      endpoint: "/api/payment/recharge",
      fullUrl: `${API_BASE_URL}/api/payment/recharge`,
      description: "Add money to account balance (Requires Admin Approval)",
      request: {
        amount: 500,
        success_redirect_url: "https://your-site.com/recharge-status",
      },
      response: {
        success: true,
        payment_page_url: "https://oraclepay.com/pay/...",
      },
      curlExample: `curl -X POST ${API_BASE_URL}/api/payment/recharge \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 500,
    "success_redirect_url": "https://your-site.com/recharge-status"
  }'`,
      jsExample: `const response = await fetch('${API_BASE_URL}/api/payment/recharge', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 500,
    success_redirect_url: 'https://your-site.com/recharge-status'
  })
});

const data = await response.json();
if (data.payment_page_url) {
  window.location.href = data.payment_page_url;
}`,
      pythonExample: `import requests

url = '${API_BASE_URL}/api/payment/recharge'
payload = {
    'amount': 500,
    'success_redirect_url': 'https://your-site.com/recharge-status'
}

response = requests.post(url, json=payload)
print(response.json())`,
      notes:
        "After payment, money won't show up immediately. An administrator must approve it first in the Admin Panel.",
    },
  ];

  const CodeTab = ({ endpoint }: { endpoint: (typeof endpoints)[0] }) => {
    const activeTab = getActiveTab(endpoint.id);
    const tabs = [
      { id: "curl", label: "cURL", icon: "🔧" },
      { id: "js", label: "JavaScript", icon: "⚡" },
      { id: "python", label: "Python", icon: "🐍" },
    ];

    const getCode = () => {
      switch (activeTab) {
        case "curl":
          return endpoint.curlExample;
        case "js":
          return endpoint.jsExample;
        case "python":
          return endpoint.pythonExample;
        default:
          return endpoint.curlExample;
      }
    };

    return (
      <div>
        <h4 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
          <Code size={18} />
          Code Examples
        </h4>

        {/* Tab Buttons */}
        <div className="flex gap-2 mb-4 border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTab(endpoint.id, tab.id)}
              className={`px-4 py-2 font-semibold text-sm transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? "text-amber-400 border-b-2 border-amber-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Code Block */}
        <div className="bg-gray-900 rounded p-4 border border-gray-700 flex items-start justify-between group">
          <pre className="text-gray-300 text-xs overflow-x-auto flex-1 font-mono">
            {getCode()}
          </pre>
          <button
            onClick={() => copyToClipboard(getCode(), `code-${endpoint.id}`)}
            className="ml-4 shrink-0 hover:bg-gray-800 p-2 rounded transition-colors"
            title="Copy code"
          >
            {copied === `code-${endpoint.id}` ? (
              <Check size={18} className="text-green-400" />
            ) : (
              <Copy size={18} className="text-gray-400 hover:text-amber-400" />
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            API Documentation
          </h1>
          <p className="text-gray-400">
            Complete guide to integrate SMS Gateway API into your application
          </p>
        </div>

        {/* Getting Started */}
        <div className="bg-linear-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/30 rounded-lg p-6 mb-8">
          <h2 className="text-white font-bold text-xl mb-4">
            🚀 Getting Started
          </h2>
          <div className="space-y-3 text-gray-300">
            <p>
              <strong>Base URL:</strong>{" "}
              <code className="bg-gray-900 px-2 py-1 rounded text-amber-400">
                {API_BASE_URL}
              </code>
            </p>
            <p>
              <strong>Authentication:</strong> All requests require a Bearer
              token in the Authorization header
            </p>
            <p>
              <strong>Content-Type:</strong>{" "}
              <code className="bg-gray-900 px-2 py-1 rounded text-amber-400">
                application/json
              </code>
            </p>
          </div>
        </div>

        {/* Selected Package Info */}
        {loading ? (
          <div className="bg-linear-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-6 mb-8 flex items-center justify-center">
            <Loader className="animate-spin text-amber-500 mr-3" size={24} />
            <span className="text-gray-300">
              Loading package information...
            </span>
          </div>
        ) : selectedPackage ? (
          <div className="bg-linear-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-lg p-6 mb-8">
            <h2 className="text-white font-bold text-xl mb-4">
              ✅ Currently Selected Package
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-gray-300 mb-6">
              <div className="bg-gray-900/50 rounded p-4 border border-gray-700">
                <p className="text-gray-400 text-sm mb-1">Package Name</p>
                <p className="text-white font-semibold">
                  {selectedPackage.name}
                </p>
              </div>
              <div className="bg-gray-900/50 rounded p-4 border border-gray-700">
                <p className="text-gray-400 text-sm mb-1">Cost Per Message</p>
                <p className="text-white font-semibold">
                  ৳{selectedPackage.costPerMessage}
                </p>
              </div>
              <div className="bg-gray-900/50 rounded p-4 border border-gray-700">
                <p className="text-gray-400 text-sm mb-1">Messages</p>
                <p className="text-white font-semibold">
                  {selectedPackage.messageCount}
                </p>
              </div>
              <div className="bg-gray-900/50 rounded p-4 border border-gray-700">
                <p className="text-gray-400 text-sm mb-1">Total Price</p>
                <p className="text-white font-semibold">
                  ৳{selectedPackage.totalPrice}
                </p>
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded p-4">
              <p className="text-blue-400 text-sm">
                <strong>✓ Ready to use:</strong> Your package token is now
                available in all API examples below. You can copy the examples
                and use them directly in your application.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-linear-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30 rounded-lg p-6 mb-8">
            <h2 className="text-white font-bold text-xl mb-2">
              ⚠️ No Package Selected
            </h2>
            <p className="text-yellow-400 mb-4">
              You haven't selected a package yet. Please select a package to see
              your package token and cost in the API examples below.
            </p>
            <button
              onClick={() => router.push("/user/packages")}
              className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Select a Package
            </button>
          </div>
        )}

        {/* Authentication Info */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 mb-8">
          <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
            🔐 Authentication
          </h2>
          <p className="text-gray-300 mb-4">
            All requests require your unique <strong>Package Token</strong> to
            be included in the request:
          </p>
          <div className="space-y-3 mb-4">
            <div className="bg-gray-900 rounded p-4 border border-gray-700 flex items-center justify-between group">
              <code className="text-amber-400 text-sm break-all">
                "packageToken": "{packageToken}"
              </code>
              <button
                onClick={() =>
                  copyToClipboard(
                    `"packageToken": "${packageToken}"`,
                    "auth-token",
                  )
                }
                className="shrink-0 ml-4"
              >
                {copied === "auth-token" ? (
                  <Check size={18} className="text-green-400" />
                ) : (
                  <Copy
                    size={18}
                    className="text-gray-400 hover:text-amber-400"
                  />
                )}
              </button>
            </div>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded p-4">
            <p className="text-red-400 text-sm">
              <strong>⚠️ Important:</strong> Never share your package token with
              anyone. Keep it private and secure. Each token is unique to your
              package and should be treated like a password.
            </p>
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-4 mb-12">
          {endpoints.map((endpoint) => (
            <div
              key={endpoint.id}
              className="bg-linear-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* Header - Clickable to expand/collapse */}
              <div
                onClick={() => toggleEndpoint(endpoint.id)}
                className="bg-gray-700/50 px-6 py-4 border-b border-gray-700 flex items-center justify-between cursor-pointer hover:bg-gray-700/70 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg">
                    {endpoint.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {endpoint.description}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded text-sm font-semibold whitespace-nowrap">
                    {endpoint.method}
                  </span>
                  {expandedEndpoint === endpoint.id ? (
                    <ChevronUp className="text-amber-400 shrink-0" size={20} />
                  ) : (
                    <ChevronDown className="text-gray-400 shrink-0" size={20} />
                  )}
                </div>
              </div>

              {/* Content - Only show when expanded */}
              {expandedEndpoint === endpoint.id && (
                <div className="p-6 space-y-6">
                  {/* Full URL */}
                  <div>
                    <h4 className="text-amber-400 font-semibold mb-2">
                      Full URL
                    </h4>
                    <div className="bg-gray-900 rounded p-4 border border-gray-700 flex items-center justify-between group">
                      <code className="text-gray-300 text-sm break-all">
                        {endpoint.method} {endpoint.fullUrl}
                      </code>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            `${endpoint.method} ${endpoint.fullUrl}`,
                            `fullurl-${endpoint.id}`,
                          )
                        }
                        className="ml-4 shrink-0 hover:bg-gray-800 p-2 rounded transition-colors"
                      >
                        {copied === `fullurl-${endpoint.id}` ? (
                          <Check size={18} className="text-green-400" />
                        ) : (
                          <Copy
                            size={18}
                            className="text-gray-400 hover:text-amber-400"
                          />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Request Body */}
                  <div>
                    <h4 className="text-amber-400 font-semibold mb-2">
                      Request Body
                    </h4>
                    <div className="bg-gray-900 rounded p-4 border border-gray-700 flex items-start justify-between group">
                      <pre className="text-gray-300 text-sm overflow-x-auto flex-1 font-mono">
                        {JSON.stringify(endpoint.request, null, 2)}
                      </pre>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            JSON.stringify(endpoint.request, null, 2),
                            `request-${endpoint.id}`,
                          )
                        }
                        className="ml-4 shrink-0 hover:bg-gray-800 p-2 rounded transition-colors"
                      >
                        {copied === `request-${endpoint.id}` ? (
                          <Check size={18} className="text-green-400" />
                        ) : (
                          <Copy
                            size={18}
                            className="text-gray-400 hover:text-amber-400"
                          />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Response */}
                  <div>
                    <h4 className="text-amber-400 font-semibold mb-2">
                      Response
                    </h4>
                    <div className="bg-gray-900 rounded p-4 border border-gray-700 flex items-start justify-between group">
                      <pre className="text-gray-300 text-sm overflow-x-auto flex-1 font-mono">
                        {JSON.stringify(endpoint.response, null, 2)}
                      </pre>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            JSON.stringify(endpoint.response, null, 2),
                            `response-${endpoint.id}`,
                          )
                        }
                        className="ml-4 shrink-0 hover:bg-gray-800 p-2 rounded transition-colors"
                      >
                        {copied === `response-${endpoint.id}` ? (
                          <Check size={18} className="text-green-400" />
                        ) : (
                          <Copy
                            size={18}
                            className="text-gray-400 hover:text-amber-400"
                          />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Code Examples with Tabs */}
                  <CodeTab endpoint={endpoint} />

                  {/* Notes */}
                  {endpoint.notes && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded p-4">
                      <p className="text-amber-400 text-sm">
                        <strong>⚠️ Note:</strong> {endpoint.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Test Section */}
        <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6 shadow-lg">
          <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
            <Send size={20} />
            Interactive Testing
          </h2>
          <p className="text-gray-400 mb-4">
            Test the API endpoints directly with Swagger UI:
          </p>
          <a
            href={`${API_BASE}/api-docs`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Open Swagger UI →
          </a>
        </div>
      </div>
    </div>
  );
}
