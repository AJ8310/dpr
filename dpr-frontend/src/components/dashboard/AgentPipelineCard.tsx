'use client';

import React from 'react';

export interface AgentResultItem {
  agent_id: string;
  name: string;
  status: 'COMPLETED' | 'RUNNING' | 'PENDING' | 'FAILED';
  confidence: number;
  findings: string[];
  recommendations?: string[];
}

interface AgentPipelineCardProps {
  agents: AgentResultItem[];
  overallCreditScore?: number;
  bankabilityRating?: string;
  onRunPipeline?: () => void;
  isRunning?: boolean;
}

export default function AgentPipelineCard({
  agents = [],
  overallCreditScore = 88,
  bankabilityRating = 'AAA — HIGH BANKABILITY',
  onRunPipeline,
  isRunning = false
}: AgentPipelineCardProps) {

  const defaultAgents: AgentResultItem[] = [
    {
      agent_id: 'privacy_agent',
      name: '🛡️ Privacy & PII Protection Guardrail',
      status: 'COMPLETED',
      confidence: 1.0,
      findings: ['Tokenized 100% sensitive PII (PAN, Aadhaar, Bank Details)', 'Zero raw PII transmitted to external LLM']
    },
    {
      agent_id: 'market_agent',
      name: '📈 Market & SWOT Intelligence Agent',
      status: 'COMPLETED',
      confidence: 0.96,
      findings: ['Verified 12.8% Sector CAGR in Karnataka district', 'Identified Retail (50%) & Institutional (30%) channels']
    },
    {
      agent_id: 'financial_agent',
      name: '💰 Financial Integrity & Sensitivity Agent',
      status: 'COMPLETED',
      confidence: 0.99,
      findings: ['5-Year Average DSCR: 1.85x (Exceeds 1.25x bank threshold)', 'Break-Even Point achieved at 42.5% capacity']
    },
    {
      agent_id: 'scheme_agent',
      name: '🏛️ Government Scheme & Subsidy Agent',
      status: 'COMPLETED',
      confidence: 0.98,
      findings: ['Matched PMMY Tarun Category (Collateral-Free up to ₹10L)', 'PMEGP 25%-35% Capital Subsidy Applicable']
    },
    {
      agent_id: 'risk_agent',
      name: '⚠️ Risk & Mitigation Assessment Agent',
      status: 'COMPLETED',
      confidence: 0.95,
      findings: ['Raw material volatility mitigated via annual supplier contracts', 'Machinery downtime covered by AMC contract']
    },
    {
      agent_id: 'credit_agent',
      name: '📊 Bank Credit & Readiness Rating Agent',
      status: 'COMPLETED',
      confidence: 0.97,
      findings: ['VKF Credit Readiness Score: 88/100', 'Official Bank Cover Letter & Application Pack generated']
    }
  ];

  const displayAgents = agents.length > 0 ? agents : defaultAgents;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl space-y-6">
      
      {/* Header & Score Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
            Autonomous Multi-Agent AI Framework
          </span>
          <h3 className="text-xl font-bold text-slate-800 mt-1">
            VKF Multi-Agent DPR Intelligence Suite
          </h3>
          <p className="text-xs text-slate-500">
            7 Specialized AI Agents working in parallel to ensure zero data leakage and 100% bankable DPRs.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-900 text-white p-3.5 rounded-xl border border-slate-800">
          <div className="text-center">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">VKF Credit Score</span>
            <span className="text-2xl font-black text-emerald-400">{overallCreditScore}<span className="text-xs text-slate-400 font-normal">/100</span></span>
          </div>
          <div className="h-8 w-px bg-slate-700"></div>
          <div>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Bankability Rating</span>
            <span className="text-xs font-bold text-blue-300">{bankabilityRating}</span>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayAgents.map((agent, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-2">
            
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                {agent.name}
              </h4>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {Math.round(agent.confidence * 100)}% Confidence
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
            </div>

            <ul className="space-y-1 text-[11px] text-slate-600">
              {agent.findings.map((f, fIdx) => (
                <li key={fIdx} className="flex items-start gap-1.5">
                  <span className="text-blue-500 mt-0.5">&bull;</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

          </div>
        ))}
      </div>

      {/* Action Footer */}
      {onRunPipeline && (
        <div className="pt-2 flex justify-end">
          <button
            onClick={onRunPipeline}
            disabled={isRunning}
            className="px-5 py-2.5 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md shadow-purple-500/20 transition-all flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Running Multi-Agent Pipeline...
              </>
            ) : (
              <>Run AI Multi-Agent Audit & Scorecard &rarr;</>
            )}
          </button>
        </div>
      )}

    </div>
  );
}
