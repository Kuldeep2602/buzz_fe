


import { useRef, useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import  {Input } from "./Input";
import { BACKEND_URL } from "../config";
import axios from "axios";

export enum ContentType {
  Youtube = "youtube",
  Twitter = "twitter",
  Note = "note"
}

interface CreateContentModalProps {
  open: boolean;
  onClose: () => void;
}

// Controlled component
export function CreateContentModal({ open, onClose }: CreateContentModalProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const [type, setType] = useState(ContentType.Youtube);

  async function addContent() {
    const title = titleRef.current?.value;
    const link = type === ContentType.Note ? noteRef.current?.value : linkRef.current?.value;

    await axios.post(
      `${BACKEND_URL}/api/v1/content`,
      { 
        link, 
        title, 
        type,
        content: type === ContentType.Note ? noteRef.current?.value : undefined
      },
      {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      }
    );

    onClose();
  }

  // Don't render the modal if it's closed
  if (!open) return null;

  return (
    <div
      // BACKDROP + WRAPPER
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-600/40 backdrop-blur-md"
      onClick={onClose}
    >
      {/* MODAL CONTENT */}
      <div
        className="relative bg-white w-80 p-6 rounded-lg shadow-xl"
        // Stop click from closing modal when clicking inside
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <CrossIcon />
        </button>

        {/* Modal Title (Optional) */}
        <h2 className="text-xl font-semibold mb-4 text-center">Add Content</h2>

        {/* Input Fields */}
        <div className="mb-4 space-y-4">
          <Input
            reference={titleRef}
            placeholder="Title"
            className="w-full"
          />
          
          {type !== ContentType.Note ? (
            <Input
              reference={linkRef}
              placeholder={type === ContentType.Youtube ? "YouTube URL" : "Twitter URL"}
              className="w-full"
            />
          ) : (
            <div className="w-full">
              <textarea
                ref={noteRef}
                placeholder="Write your note here..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>
          )}
        </div>

        {/* Type Selection */}
        <div className="mb-4 text-center">
          <h1 className="font-medium mb-2">Type</h1>
          <div className="flex gap-2 justify-center">
            <Button
              text="YouTube"
              variant={type === ContentType.Youtube ? "primary" : "secondary"}
              onClick={() => setType(ContentType.Youtube)}
            />
            <Button
              text="Twitter"
              variant={type === ContentType.Twitter ? "primary" : "secondary"}
              onClick={() => setType(ContentType.Twitter)}
            />
            <Button
              text="Note"
              variant={type === ContentType.Note ? "primary" : "secondary"}
              onClick={() => setType(ContentType.Note)}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button onClick={addContent} variant="primary" text="Submit" />
        </div>
      </div>
    </div>
  );
}
