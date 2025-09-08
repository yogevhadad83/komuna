"use client";
import React from "react";

type Props = {
  onSubmitAction: (formData: FormData) => void | Promise<void>;
};

export default function PostForm({ onSubmitAction }: Props) {
  return (
    <form action={onSubmitAction} className="panel p-6 md:p-8 space-y-7 max-w-2xl">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="kind" className="text-xs font-medium tracking-wide uppercase text-[var(--color-fg-soft)]">Kind</label>
          <select id="kind" name="kind" required defaultValue="item" className="w-full">
            <option value="item">Item</option>
            <option value="service">Service</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="intent" className="text-xs font-medium tracking-wide uppercase text-[var(--color-fg-soft)]">Intent</label>
          <select id="intent" name="intent" required defaultValue="offer" className="w-full">
            <option value="offer">Offer</option>
            <option value="need">Need</option>
          </select>
        </div>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="title" className="text-xs font-medium tracking-wide uppercase text-[var(--color-fg-soft)]">Title</label>
        <input id="title" name="title" type="text" required placeholder="Short summary" className="w-full" />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="description" className="text-xs font-medium tracking-wide uppercase text-[var(--color-fg-soft)]">Description</label>
        <textarea id="description" name="description" required rows={6} placeholder="Add helpful details, context, condition, timing..." className="w-full" />
        <p className="text-[11px] text-[var(--color-fg-soft)]">Be specific. This helps others understand how to help or what you offer.</p>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="location_text" className="text-xs font-medium tracking-wide uppercase text-[var(--color-fg-soft)]">Location (optional)</label>
        <input id="location_text" name="location_text" type="text" placeholder="Neighborhood / City" className="w-full" />
      </div>
      <div className="pt-2 flex items-center gap-3">
        <button type="submit" className="relative inline-flex items-center h-11 rounded-md px-6 text-[14px] font-medium bg-[var(--color-brand)] text-white shadow-sm hover:brightness-110 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-brand)] ring-offset-white dark:ring-offset-transparent">Create Post</button>
        <span className="text-[11px] text-[var(--color-fg-soft)]">You can edit or close this later.</span>
      </div>
    </form>
  );
}
