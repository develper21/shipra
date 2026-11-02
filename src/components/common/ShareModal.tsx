'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, Send, Mail, MessageSquare } from "@/components/icons";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  appName: string;
  shareUrl: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  appName,
  shareUrl
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`Download and test the latest build of ${appName} on AppLaunch:`);

  const shareChannels = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-emerald-500 hover:bg-emerald-600',
      href: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-sky-500 hover:bg-sky-600',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-indigo-600 hover:bg-indigo-700',
      href: `mailto:?subject=Test ${appName} Build&body=${encodedText}%0A%0A${encodedUrl}`
    },
    {
      name: 'SMS',
      icon: MessageSquare,
      color: 'bg-violet-600 hover:bg-violet-700',
      href: `sms:?body=${encodedText}%20${encodedUrl}`
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-zinc-900 dark:text-white text-base">
              Share {appName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Quick Copy Link Box */}
          <div>
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
              Direct Install Link
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200 select-all focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Social Channels (DIST-04) */}
          <div>
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
              Share to Testers & Clients
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {shareChannels.map((channel, i) => {
                const Icon = channel.icon;
                return (
                  <a
                    key={i}
                    href={channel.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] ${channel.color}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{channel.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 text-center text-[11px] text-zinc-400">
          Testers on Android can install directly with 1 tap. Desktop visitors get a QR code.
        </div>
      </div>
    </div>
  );
};
