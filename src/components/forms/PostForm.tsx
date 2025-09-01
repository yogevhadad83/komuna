"use client";
import React from "react";

type Props = {
  onSubmitAction: (formData: FormData) => void | Promise<void>;
};

export default function PostForm({ onSubmitAction }: Props) {
  return (
    <form action={onSubmitAction} className="space-y-4 max-w-xl">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="kind" className="block text-sm mb-1">
            Kind
          </label>
          <select
            id="kind"
            name="kind"
            required
            className="w-full rounded-md border px-3 py-2 bg-white"
            defaultValue="item"
          >
            <option value="item">Item</option>
            <option value="service">Service</option>
          </select>
        </div>
        <div>
          <label htmlFor="intent" className="block text-sm mb-1">
            Intent
          </label>
          <select
            id="intent"
            name="intent"
            required
            className="w-full rounded-md border px-3 py-2 bg-white"
            defaultValue="offer"
          >
            <option value="offer">Offer</option>
            <option value="need">Need</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm mb-1">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className="w-full rounded-md border px-3 py-2"
          placeholder="Short summary"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          className="w-full rounded-md border px-3 py-2"
          placeholder="Add details to help others understand"
        />
      </div>

      <div>
        <label htmlFor="location_text" className="block text-sm mb-1">
          Location (optional)
        </label>
        <input
          id="location_text"
          name="location_text"
          type="text"
          className="w-full rounded-md border px-3 py-2"
          placeholder="Neighborhood / City"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700"
        >
          Create Post
        </button>
      </div>
    </form>
  );
}
