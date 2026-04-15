"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, ChevronDown, ChevronUp, Code } from "lucide-react";
import { API_BASE_URL } from "@/services/api";

export default function PublicAPIDocumentation() {
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<{ [key: string]: string }>({});

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

  const endpoints = [
    {
      id: "send-sms",
      title: "Send SMS",
      method: "POST",
      endpoint: "/api/messaging/sendRequest",
      fullUrl: `${API_BASE_URL}/api/messaging/sendRequest`,
      description: "Send SMS to a single recipient",
      request: {
        recipient: "8801772411171",
        message: "Hello SMS",
        packageToken: "your_package_token_here",
      },
      response: {
        success: true,
        message: "SMS sent successfully",
        data: {
          messageId: "msg_123456",
          status: "sent",
        },
      },
      curlExample: `curl -X POST ${API_BASE_URL}/api/messaging/sendRequest \\
  -H "Content-Type: application/json" \\
  -d '{
    "recipient": "8801772411171",
    "message": "Hello SMS",
    "packageToken": "your_package_token_here"
  }'`,
      jsExample: `const response = await fetch('${API_BASE_URL}/api/messaging/sendRequest', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    recipient: '8801772411171',
    message: 'Hello SMS',
    packageToken: 'your_package_token_here'
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
    'packageToken': 'your_package_token_here'
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
      notes: "Message must be 160 characters or less.",
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
        packageToken: "your_package_token_here",
      },
      response: {
        success: true,
        message: "Bulk SMS sent",
        data: {
          status: "Sent to 2 recipients, 0 failed",
        },
      },
      curlExample: `curl -X POST ${API_BASE_URL}/api/messaging/sendBulkRequest \\
  -H "Content-Type: application/json" \\
  -d '{
    "recipients": ["8801772411171", "8801234567890"],
    "message": "Hello SMS",
    "packageToken": "your_package_token_here"
  }'`,
      jsExample: `const response = await fetch('${API_BASE_URL}/api/messaging/sendBulkRequest', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    recipients: ['8801772411171', '8801234567890'],
    message: 'Hello SMS',
    packageToken: 'your_package_token_here'
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
    'packageToken': 'your_package_token_here'
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
      notes: "Message must be 160 characters or less.",
    },
    {
      id: "generate-otp",
      title: "Generate & Send OTP",
      method: "GET",
      endpoint: "/api/messaging/otp",
      fullUrl: `${API_BASE_URL}/api/messaging/otp`,
      description: "Generate a 4-digit OTP and send it via SMS",
      request: {
        recipient: "8801772411171",
        packageToken: "your_package_token_here",
        expiry: 5,
      },
      response: {
        success: true,
        message: "OTP sent successfully",
        data: {
          otp: "1234",
          expiry: "2026-03-29T10:30:00Z",
          messageId: "msg_789012",
        },
      },
      curlExample: `curl -G "${API_BASE_URL}/api/messaging/otp" \\
  --data-urlencode "recipient=8801772411171" \\
  --data-urlencode "packageToken=your_package_token_here" \\
  --data-urlencode "expiry=5"`,
      jsExample: `const params = new URLSearchParams({
  recipient: '8801772411171',
  packageToken: 'your_package_token_here',
  expiry: '5'
});

const response = await fetch(\`${API_BASE_URL}/api/messaging/otp?\${params}\`, {
  method: 'GET'
});

const data = await response.json();
console.log(data);`,
      pythonExample: `import requests

url = '${API_BASE_URL}/api/messaging/otp'
params = {
    'recipient': '8801772411171',
    'packageToken': 'your_package_token_here',
    'expiry': 5
}

response = requests.get(url, params=params)
print(response.json())`,
      notes: "The OTP is 4 digits numeric. Expiry time is in minutes.",
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
        <h4 className="text-pink-600 font-semibold mb-3 flex items-center gap-2">
          <Code size={18} />
          Code Examples
        </h4>

        {/* Tab Buttons */}
        <div className="flex gap-2 mb-4 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTab(endpoint.id, tab.id)}
              className={`px-4 py-2 font-semibold text-sm transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? "text-pink-600 border-b-2 border-pink-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Code Block */}
        <div className="bg-gray-50 rounded p-4 border border-gray-200 flex items-start justify-between group">
          <pre className="text-gray-800 text-xs overflow-x-auto flex-1 font-mono">
            {getCode()}
          </pre>
          <button
            onClick={() => copyToClipboard(getCode(), `code-${endpoint.id}`)}
            className="ml-4 shrink-0 hover:bg-gray-200 p-2 rounded transition-colors"
            title="Copy code"
          >
            {copied === `code-${endpoint.id}` ? (
              <Check size={18} className="text-green-600" />
            ) : (
              <Copy size={18} className="text-gray-600 hover:text-pink-600" />
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            API Documentation
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl">
            Complete guide to integrate o-sms SMS Gateway API into your
            application
          </p>
        </div>

        {/* Getting Started */}
        <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-6 sm:p-8 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            🚀 Getting Started
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Base URL:</strong>{" "}
              <code className="bg-white px-3 py-1 rounded text-pink-600 border border-pink-200">
                {API_BASE_URL}
              </code>
            </p>
            <p>
              <strong>Content-Type:</strong>{" "}
              <code className="bg-white px-3 py-1 rounded text-pink-600 border border-pink-200">
                application/json
              </code>
            </p>
            <p>
              <strong>Authentication:</strong> Include your package token in the
              request body
            </p>
          </div>
        </div>

        {/* Authentication Info */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 sm:p-8 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            🔐 Authentication
          </h2>
          <p className="text-gray-700 mb-4">
            All requests require your unique <strong>Package Token</strong> to
            be included in the request body:
          </p>
          <div className="bg-white rounded p-4 border border-blue-200 flex items-center justify-between group mb-4">
            <code className="text-pink-600 text-sm break-all">
              "packageToken": "your_package_token_here"
            </code>
            <button
              onClick={() =>
                copyToClipboard(
                  '"packageToken": "your_package_token_here"',
                  "auth-token",
                )
              }
              className="shrink-0 ml-4"
            >
              {copied === "auth-token" ? (
                <Check size={18} className="text-green-600" />
              ) : (
                <Copy size={18} className="text-gray-600 hover:text-pink-600" />
              )}
            </button>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded p-4">
            <p className="text-amber-900 text-sm mb-3">
              <strong>💡 How to get your Package Token:</strong>
            </p>
            <ol className="text-amber-900 text-sm space-y-2 list-decimal list-inside">
              <li>Sign up or log in to your o-sms account</li>
              <li>Select a package from your dashboard</li>
              <li>
                Your package token will be displayed in the API documentation
                section
              </li>
            </ol>
            <Link href="/user-register">
              <button className="inline-block mt-4 px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-colors">
                Get Your Package Token →
              </button>
            </Link>
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-4 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            API Endpoints
          </h2>
          {endpoints.map((endpoint) => (
            <div
              key={endpoint.id}
              className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header - Clickable to expand/collapse */}
              <div
                onClick={() => toggleEndpoint(endpoint.id)}
                className="bg-gray-50 px-6 py-4 border-b-2 border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    {endpoint.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    {endpoint.description}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-semibold whitespace-nowrap">
                    {endpoint.method}
                  </span>
                  {expandedEndpoint === endpoint.id ? (
                    <ChevronUp className="text-pink-600 shrink-0" size={20} />
                  ) : (
                    <ChevronDown className="text-gray-400 shrink-0" size={20} />
                  )}
                </div>
              </div>

              {/* Content - Only show when expanded */}
              {expandedEndpoint === endpoint.id && (
                <div className="p-6 sm:p-8 space-y-6 border-t-2 border-gray-200">
                  {/* Full URL */}
                  <div>
                    <h4 className="text-pink-600 font-semibold mb-2">
                      Full URL
                    </h4>
                    <div className="bg-gray-50 rounded p-4 border border-gray-200 flex items-center justify-between group">
                      <code className="text-gray-800 text-sm break-all">
                        {endpoint.method} {endpoint.fullUrl}
                      </code>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            `${endpoint.method} ${endpoint.fullUrl}`,
                            `fullurl-${endpoint.id}`,
                          )
                        }
                        className="ml-4 shrink-0 hover:bg-gray-200 p-2 rounded transition-colors"
                      >
                        {copied === `fullurl-${endpoint.id}` ? (
                          <Check size={18} className="text-green-600" />
                        ) : (
                          <Copy
                            size={18}
                            className="text-gray-600 hover:text-pink-600"
                          />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Request Body */}
                  <div>
                    <h4 className="text-pink-600 font-semibold mb-2">
                      Request Body
                    </h4>
                    <div className="bg-gray-50 rounded p-4 border border-gray-200 flex items-start justify-between group">
                      <pre className="text-gray-800 text-sm overflow-x-auto flex-1 font-mono">
                        {JSON.stringify(endpoint.request, null, 2)}
                      </pre>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            JSON.stringify(endpoint.request, null, 2),
                            `request-${endpoint.id}`,
                          )
                        }
                        className="ml-4 shrink-0 hover:bg-gray-200 p-2 rounded transition-colors"
                      >
                        {copied === `request-${endpoint.id}` ? (
                          <Check size={18} className="text-green-600" />
                        ) : (
                          <Copy
                            size={18}
                            className="text-gray-600 hover:text-pink-600"
                          />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Response */}
                  <div>
                    <h4 className="text-pink-600 font-semibold mb-2">
                      Response
                    </h4>
                    <div className="bg-gray-50 rounded p-4 border border-gray-200 flex items-start justify-between group">
                      <pre className="text-gray-800 text-sm overflow-x-auto flex-1 font-mono">
                        {JSON.stringify(endpoint.response, null, 2)}
                      </pre>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            JSON.stringify(endpoint.response, null, 2),
                            `response-${endpoint.id}`,
                          )
                        }
                        className="ml-4 shrink-0 hover:bg-gray-200 p-2 rounded transition-colors"
                      >
                        {copied === `response-${endpoint.id}` ? (
                          <Check size={18} className="text-green-600" />
                        ) : (
                          <Copy
                            size={18}
                            className="text-gray-600 hover:text-pink-600"
                          />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Code Examples with Tabs */}
                  <CodeTab endpoint={endpoint} />

                  {/* Notes */}
                  {endpoint.notes && (
                    <div className="bg-amber-50 border border-amber-200 rounded p-4">
                      <p className="text-amber-900 text-sm">
                        <strong>⚠️ Note:</strong> {endpoint.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
