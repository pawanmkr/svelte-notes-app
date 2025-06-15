<script lang="ts">
  import type { Note } from "$lib/api";
  import { createEventDispatcher } from "svelte";

  export let note: Note;
  export let isEditing = false;
  export let disabled = false;

  const dispatch = createEventDispatcher<{
    edit: { id: number };
    delete: { id: number };
    save: { id: number; title: string; content: string };
    cancel: void;
  }>();

  let editTitle = note.title;
  let editContent = note.content;

  function handleEdit() {
    const noteId = Number(note.id);
    console.log("Edit clicked for note:", noteId, typeof noteId); // debug log
    if (disabled || isNaN(noteId)) return;
    dispatch("edit", { id: noteId });
  }

  function handleDelete() {
    const noteId = Number(note.id);
    console.log("Delete clicked for note:", noteId, typeof noteId);
    if (disabled || isNaN(noteId)) return;
    dispatch("delete", { id: noteId });
  }

  function handleSave(e: SubmitEvent) {
    e.preventDefault();
    const noteId = Number(note.id);
    console.log("Save clicked for note:", noteId, typeof noteId);
    if (disabled || isNaN(noteId)) return;
    dispatch("save", {
      id: noteId,
      title: editTitle,
      content: editContent,
    });
  }

  function handleCancel() {
    const noteId = Number(note.id);
    console.log("Cancel clicked for note:", noteId, typeof noteId);
    if (disabled || isNaN(noteId)) return;
    editTitle = note.title;
    editContent = note.content;
    dispatch("cancel");
  }
</script>

<div class="card p-4 mb-4 {disabled ? 'opacity-75' : ''}">
  {#if isEditing}
    <form on:submit={handleSave} class="space-y-4">
      <div>
        <label
          for="title-{note.id}"
          class="block text-sm font-medium text-primary">Title</label
        >
        <input
          type="text"
          id="title-{note.id}"
          bind:value={editTitle}
          class="input mt-1"
          required
          {disabled}
        />
      </div>
      <div>
        <label
          for="content-{note.id}"
          class="block text-sm font-medium text-primary">Content</label
        >
        <textarea
          id="content-{note.id}"
          bind:value={editContent}
          rows="3"
          class="input mt-1"
          required
          {disabled}
        ></textarea>
      </div>
      <div class="flex justify-end space-x-2">
        <button
          type="button"
          class="btn btn-secondary"
          on:click={handleCancel}
          {disabled}
        >
          Cancel
        </button>
        <button type="submit" class="btn btn-primary" {disabled}>
          {disabled ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  {:else}
    <div class="space-y-2">
      <h3 class="text-lg font-medium text-primary">{note.title}</h3>
      <p class="text-secondary">{note.content}</p>
      <p class="text-sm text-muted">
        Created: {new Date(note.createdAt).toLocaleDateString()}
      </p>
      <div class="flex justify-end space-x-2 mt-4">
        <button
          type="button"
          class="btn btn-secondary"
          on:click={handleEdit}
          {disabled}
        >
          Edit
        </button>
        <button
          type="button"
          class="btn btn-danger"
          on:click={handleDelete}
          {disabled}
        >
          Delete
        </button>
      </div>
    </div>
  {/if}
</div>
