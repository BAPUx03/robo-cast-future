import { useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Trash2 } from "lucide-react";
import { isAboutPhotoUrl, type AboutFieldPhoto } from "@/lib/about-field-gallery";

type FieldGalleryEditorProps = {
  photos: AboutFieldPhoto[];
  onChange: (photos: AboutFieldPhoto[]) => void;
};

export function FieldGalleryEditor({ photos, onChange }: FieldGalleryEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  function updatePhoto(id: string, patch: Partial<AboutFieldPhoto>) {
    onChange(photos.map((photo) => (photo.id === id ? { ...photo, ...patch } : photo)));
  }

  function movePhoto(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= photos.length) return;
    const next = [...photos];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    onChange(next);
  }

  function addPhoto() {
    const id = crypto.randomUUID();
    onChange([...photos, { id, title: "", description: "", image_url: "", alt_text: "" }]);
    setEditingId(id);
  }

  return (
    <section className="min-w-0 border-t border-border pt-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold">Modtech in the field</h3>
          <p className="mt-1 max-w-xl text-xs leading-relaxed text-muted-foreground">
            Add, edit, reorder or remove the photos in the About page scroller. Changes appear
            publicly after you save this page.
          </p>
        </div>
        <button
          type="button"
          disabled={photos.length >= 12}
          onClick={addPhoto}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-brand/50 px-4 py-2 text-xs font-semibold text-brand transition hover:bg-brand/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ImagePlus className="h-4 w-4" /> Add photo
        </button>
      </div>

      {photos.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">
          No photos. This section will be hidden until you add and save one.
        </p>
      ) : (
        <div className="mt-4 grid gap-3">
          {photos.map((photo, index) => {
            const expanded = editingId === photo.id;
            return (
              <div
                key={photo.id}
                className="min-w-0 overflow-hidden rounded-xl border border-border bg-background"
              >
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`field-photo-editor-${photo.id}`}
                  onClick={() => setEditingId(expanded ? null : photo.id)}
                  className="flex w-full min-w-0 items-center gap-3 p-3 text-left transition hover:bg-secondary/40"
                >
                  {isAboutPhotoUrl(photo.image_url) ? (
                    <img
                      src={photo.image_url}
                      alt=""
                      className="h-14 w-16 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <span className="grid h-14 w-16 shrink-0 place-items-center rounded-lg bg-secondary text-muted-foreground">
                      <ImagePlus className="h-5 w-5" />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-sm font-semibold">
                      {String(index + 1).padStart(2, "0")}. {photo.title || "New photo"}
                    </span>
                    <span className="mt-1 block truncate text-xs text-muted-foreground">
                      {photo.image_url || "Image URL needed"}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-brand">{expanded ? "Close" : "Edit"}</span>
                </button>

                {expanded && (
                  <div
                    id={`field-photo-editor-${photo.id}`}
                    className="grid gap-4 border-t border-border p-4 sm:grid-cols-2"
                  >
                    <label className="min-w-0 text-xs font-medium">
                      Title
                      <input
                        value={photo.title}
                        maxLength={100}
                        onChange={(event) => updatePhoto(photo.id, { title: event.target.value })}
                        className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-brand"
                      />
                    </label>
                    <label className="min-w-0 text-xs font-medium">
                      Image URL or site path
                      <input
                        value={photo.image_url}
                        inputMode="url"
                        placeholder="/gallery/photo.webp or https://..."
                        onChange={(event) =>
                          updatePhoto(photo.id, { image_url: event.target.value })
                        }
                        className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-brand"
                      />
                    </label>
                    <label className="min-w-0 text-xs font-medium sm:col-span-2">
                      Image description for accessibility
                      <input
                        value={photo.alt_text}
                        maxLength={180}
                        onChange={(event) =>
                          updatePhoto(photo.id, { alt_text: event.target.value })
                        }
                        className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-brand"
                      />
                    </label>
                    <label className="min-w-0 text-xs font-medium sm:col-span-2">
                      Caption
                      <textarea
                        value={photo.description}
                        maxLength={240}
                        rows={2}
                        onChange={(event) =>
                          updatePhoto(photo.id, { description: event.target.value })
                        }
                        className="mt-2 w-full resize-y rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-brand"
                      />
                    </label>
                    <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => movePhoto(index, -1)}
                        className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border px-3 text-xs disabled:opacity-40"
                      >
                        <ArrowUp className="h-3.5 w-3.5" /> Move up
                      </button>
                      <button
                        type="button"
                        disabled={index === photos.length - 1}
                        onClick={() => movePhoto(index, 1)}
                        className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border px-3 text-xs disabled:opacity-40"
                      >
                        <ArrowDown className="h-3.5 w-3.5" /> Move down
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onChange(photos.filter((item) => item.id !== photo.id));
                          setEditingId(null);
                        }}
                        className="ml-auto inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-destructive/40 px-3 text-xs text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
