
import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import Card  from "../components/Card";
import { CreateContentModal } from "../components/CreateContentModal";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { Sidebar } from "../components/Sidebar";
import { useContent } from "../hooks/useContent";
import { BACKEND_URL } from "../config";
import axios from "axios";

export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const { contents, refresh, deleteContent } = useContent();
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});

  const handleDelete = async (contentId: string) => {
    if (!contentId) return;
    
    try {
      setIsDeleting(prev => ({ ...prev, [contentId]: true }));
      await deleteContent(contentId);
      // The content will be automatically removed from the UI by the useContent hook
    } catch (error) {
      console.error('Failed to delete content:', error);
      // You might want to show an error toast/notification here
    } finally {
      setIsDeleting(prev => {
        const newState = { ...prev };
        delete newState[contentId];
        return newState;
      });
    }
  };

  useEffect(() => {
    refresh();
  }, [modalOpen]);

  return (
    <div>
      <Sidebar />
      <div className="p-4 ml-72 min-h-screen bg-gray-100 border-2">
        <CreateContentModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
          }}
        />
        <div className="flex justify-end gap-4 mb-2">
          <Button
            onClick={() => {
              setModalOpen(true);
            }}
            variant="primary"
            text="Add content"
            startIcon={<PlusIcon />}
          ></Button>
          <Button
            onClick={async () => {
              const response = await axios.post(
                `${BACKEND_URL}/api/v1/brain/share`,
                {
                  share: true,
                },
                {
                  headers: {
                    Authorization: localStorage.getItem("token"),
                  },
                }
              );
              const shareUrl = `http://localhost:5173/share/${response.data.hash}`;
              alert(shareUrl);
            }}
            variant="secondary"
            text="Share buzz"
            startIcon={<ShareIcon />}
          ></Button>
        </div>
       
        

        <div className="flex gap-4 flex-wrap">
          {contents.length > 0 ? (
            contents.map(({ id, type, link, title, contentId }) => (
              <Card
                key={id}
                type={(type === 'twitter' ? 'twitter' : 'youtube') as 'twitter' | 'youtube'}
                link={link || "#"}
                title={title || "Untitled"}
                contentId={contentId || id}
                onDelete={handleDelete}
                isDeleting={isDeleting[contentId || id] || false}
              />
            ))
          ) : (
            <p>No content available</p>
          )}
        </div>
      </div>
    </div>
  );
}
