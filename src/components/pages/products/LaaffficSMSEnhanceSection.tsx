// components/LaaffficSMSEnhanceSection.tsx
"use client";

import React, { useState } from "react";
import { Gamepad2, Landmark, Blocks } from "lucide-react";

type UseCase = {
  title: string;
  description?: string; // optional if you want to add short desc
  imageUrl: string;
};

type Tab = {
  name: string;
  icon: React.ReactNode;
  useCases: UseCase[];
};

const tabs: Tab[] = [
  {
    name: "iGaming",
    icon: <Gamepad2 className="h-8 w-8" />,
    useCases: [
      {
        title: "Promotional Offers & Bonuses",
        imageUrl: "https://thumbs.dreamstime.com/b/d-illustretion-online-mobile-casino-smart-phone-chips-96992260.jpg",
      },
      {
        title: "Tournament & Event Alerts",
        imageUrl: "https://c8.alamy.com/comp/2Y03B83/mobile-casino-app-cartoon-icon-smartphone-with-jackpot-money-2Y03B83.jpg",
      },
      {
        title: "Loyalty & VIP Notifications",
        imageUrl: "https://thumbs.dreamstime.com/b/experience-thrill-generative-ai-casino-slot-jackpot-realistic-graphics-showcase-massive-win-witness-electrifying-357719301.jpg",
      },
    ],
  },
  {
    name: "Fintech",
    icon: <Landmark className="h-8 w-8" />,
    useCases: [
      {
        title: "Insurance and Investment Recommendations",
        imageUrl: "https://thumbs.dreamstime.com/b/financial-advisor-giving-advice-budget-planning-wealth-management-investment-strategy-saving-income-tax-mortgage-expense-405200652.jpg",
      },
      {
        title: "Credit Approval Notifications",
        imageUrl: "https://thumbs.dreamstime.com/b/isometric-vector-illustration-mobile-payment-app-displaying-transaction-confirmation-smartphone-screen-showing-loan-407868633.jpg",
      },
      {
        title: "Repayment Reminders",
        imageUrl: "https://thumbs.dreamstime.com/b/day-payment-calendar-cash-money-debit-card-d-icon-isometric-vector-illustration-day-payment-calendar-cash-321031875.jpg",
      },
    ],
  },
  {
    name: "Blockchain",
    icon: <Blocks className="h-8 w-8" />,
    useCases: [
      {
        title: "Transaction Confirmations",
        imageUrl: "https://thumbs.dreamstime.com/b/electronic-contract-isometric-banner-e-signature-smart-web-blockchain-cryptocurrency-etherium-document-mobile-screen-digital-156597203.jpg",
      },
      {
        title: "Wallet Activity Alerts",
        imageUrl: "https://thumbs.dreamstime.com/b/laptop-displaying-defi-network-links-smart-contract-approval-badge-digital-coin-ideal-blockchain-cryptocurrency-411908091.jpg",
      },
      {
        title: "Smart Contract Execution Notices",
        imageUrl: "https://thumbs.dreamstime.com/b/blockchain-network-integrating-smart-contracts-decentralized-applications-secure-transactions-illustration-represents-414169936.jpg",
      },
    ],
  },
];

export default function LaaffficSMSEnhanceSection() {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].name);

  const currentTab = tabs.find((tab) => tab.name === activeTab) || tabs[0];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-pink-500 to-purple-600 text-white">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        {/* Title */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Enhance Your Business Using
          </h2>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mt-2">
            Laafffic SMS
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white/20 backdrop-blur-sm rounded-full p-2 border border-white/30">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`
                  flex items-center gap-3 px-6 py-4 rounded-full transition-all duration-300
                  ${
                    activeTab === tab.name
                      ? "bg-white text-purple-700 shadow-lg"
                      : "text-white hover:bg-white/30"
                  }
                `}
              >
                {tab.icon}
                <span className="font-semibold text-lg">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Use Cases Grid - 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {currentTab.useCases.map((useCase, idx) => (
            <div
              key={idx}
              className="bg-white/15 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl border border-white/20 flex flex-col items-center text-center p-8 hover:scale-[1.03] transition-transform duration-300"
            >
              {/* Illustration */}
              <div className="w-48 h-48 md:w-64 md:h-64 mb-6">
                <img
                  src={useCase.imageUrl}
                  alt={useCase.title}
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-bold mb-3">
                {useCase.title}
              </h3>

              {/* Optional short description */}
              {useCase.description && (
                <p className="text-base opacity-90">{useCase.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}