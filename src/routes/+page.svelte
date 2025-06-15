<script lang="ts">
  import { onMount } from "svelte";
  import type { Note } from "$lib/api";
  import { getNotes, createNote, updateNote, deleteNote } from "$lib/api";
  import NoteComponent from "$lib/components/Note.svelte";
  import ConfirmModal from "$lib/components/ConfirmModal.svelte";
  import NotesFilter from "$lib/components/NotesFilter.svelte";
  import Pagination from "$lib/components/Pagination.svelte";

  let notes: Note[] = [];
  let filteredNotes: Note[] = [];
  let paginatedNotes: Note[] = [];
  let loading = true;
  let error: string | null = null;
  let editingNoteId: number | null = null;
  let showCreateForm = false;
  let showDeleteModal = false;
  let noteToDelete: Note | null = null;
  let operationInProgress = false;

  // Filter and sort state
  let searchQuery = "";
  let sortBy: "createdAt" | "title" = "createdAt";
  let sortOrder: "asc" | "desc" = "desc";

  // Pagination state
  let currentPage = 1;
  let itemsPerPage = 10;

  // Form data
  let newTitle = "";
  let newContent = "";

  // Filter, sort and paginate notes
  $: {
    filteredNotes = notes
      .filter((note) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        const multiplier = sortOrder === "asc" ? 1 : -1;
        if (sortBy === "createdAt") {
          return (
            multiplier *
            (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          );
        } else {
          return multiplier * a.title.localeCompare(b.title);
        }
      });

    // Reset to first page when filter/sort changes
    if (currentPage > Math.ceil(filteredNotes.length / itemsPerPage)) {
      currentPage = 1;
    }

    // Paginate the filtered notes
    const start = (currentPage - 1) * itemsPerPage;
    paginatedNotes = filteredNotes.slice(start, start + itemsPerPage);
  }

  onMount(async () => {
    try {
      notes = await getNotes();
    } catch (e) {
      console.error("Error loading notes:", e);
      error = "Failed to load notes. Please try again later.";
    } finally {
      loading = false;
    }
  });

  function handleSearch(event: CustomEvent<string>) {
    searchQuery = event.detail;
  }

  function handleSort(
    event: CustomEvent<{ by: "createdAt" | "title"; order: "asc" | "desc" }>
  ) {
    sortBy = event.detail.by;
    sortOrder = event.detail.order;
  }

  async function handleCreate(event: SubmitEvent) {
    event.preventDefault();
    if (operationInProgress) return;

    operationInProgress = true;
    const optimisticNote: Note = {
      id: Date.now(), // Temporary ID
      title: newTitle,
      content: newContent,
      createdAt: new Date().toISOString(),
    };

    try {
      // Optimistic update
      notes = [optimisticNote, ...notes];
      const newNote = await createNote({
        title: newTitle,
        content: newContent,
      });
      // Replace optimistic note with real one
      notes = notes.map((note) =>
        note.id === optimisticNote.id ? newNote : note
      );
      newTitle = "";
      newContent = "";
      showCreateForm = false;
    } catch (e) {
      // Rollback on error
      notes = notes.filter((note) => note.id !== optimisticNote.id);
      console.error("Error creating note:", e);
      error = "Failed to create note. Please try again.";
    } finally {
      operationInProgress = false;
    }
  }

  function handleEdit(event: CustomEvent<{ id: number | string }>) {
    console.log("Edit event received:", event.detail); // Debug log
    const id = Number(event.detail.id);
    if (isNaN(id)) {
      console.error("Invalid note ID in edit event:", event.detail.id);
      return;
    }
    editingNoteId = id;
  }

  async function handleSave(
    event: CustomEvent<{ id: number | string; title: string; content: string }>
  ) {
    console.log("Save event received:", event.detail); // Debug log
    if (operationInProgress) return;

    const id = Number(event.detail.id);
    if (isNaN(id)) {
      console.error("Invalid note ID in save event:", event.detail.id);
      return;
    }

    const { title, content } = event.detail;
    operationInProgress = true;
    const originalNote = notes.find((n) => n.id === id);
    if (!originalNote) {
      console.error("Note not found for update:", id);
      return;
    }

    // Optimistic update
    const optimisticNote = { ...originalNote, title, content };
    notes = notes.map((note) => (note.id === id ? optimisticNote : note));

    try {
      const updatedNote = await updateNote(id, { title, content });
      notes = notes.map((note) => (note.id === id ? updatedNote : note));
      editingNoteId = null;
    } catch (e) {
      // Rollback on error
      notes = notes.map((note) => (note.id === id ? originalNote : note));
      console.error("Error updating note:", e);
      error = "Failed to update note. Please try again.";
    } finally {
      operationInProgress = false;
    }
  }

  function handleDelete(event: CustomEvent<{ id: number | string }>) {
    console.log("Delete event received:", event.detail); // Debug log
    const id = Number(event.detail.id);
    if (isNaN(id)) {
      console.error("Invalid note ID in delete event:", event.detail.id);
      error = "Invalid note ID";
      return;
    }

    const note = notes.find((n) => n.id === id);
    if (!note) {
      console.error("Note not found for deletion:", id);
      error = "Note not found";
      return;
    }

    noteToDelete = note;
    showDeleteModal = true;
  }

  async function confirmDelete() {
    if (!noteToDelete || operationInProgress) return;

    const noteId = noteToDelete.id;
    // Close modal immediately
    showDeleteModal = false;
    noteToDelete = null;

    operationInProgress = true;
    // Optimistic update
    notes = notes.filter((note) => note.id !== noteId);

    try {
      await deleteNote(noteId);
    } catch (e) {
      // Rollback on error
      if (noteToDelete) {
        notes = [...notes, noteToDelete];
      }
      console.error("Error deleting note:", e);
      error = "Failed to delete note. Please try again.";
    } finally {
      operationInProgress = false;
    }
  }

  function handleCancel() {
    editingNoteId = null;
  }

  function handlePageChange(page: number) {
    currentPage = page;
  }
</script>

<div class="container mx-auto px-4 py-8 max-w-4xl">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-3xl font-bold">My Notes</h1>
    <button
      type="button"
      class="btn btn-primary"
      on:click={() => (showCreateForm = !showCreateForm)}
      disabled={operationInProgress}
    >
      {showCreateForm ? "Cancel" : "New Note"}
    </button>
  </div>

  {#if error}
    <div
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
      role="alert"
    >
      <p>{error}</p>
      <button
        type="button"
        class="float-right text-red-700 hover:text-red-900"
        on:click={() => (error = null)}
      >
        ×
      </button>
    </div>
  {/if}

  {#if showCreateForm}
    <form
      on:submit|preventDefault={handleCreate}
      class="bg-white rounded-lg shadow p-4 mb-8"
    >
      <h2 class="text-xl font-semibold mb-4">Create New Note</h2>
      <div class="space-y-4">
        <div>
          <label for="new-title" class="block text-sm font-medium text-gray-700"
            >Title</label
          >
          <input
            type="text"
            id="new-title"
            bind:value={newTitle}
            class="input mt-1"
            required
            disabled={operationInProgress}
          />
        </div>
        <div>
          <label
            for="new-content"
            class="block text-sm font-medium text-gray-700">Content</label
          >
          <textarea
            id="new-content"
            bind:value={newContent}
            rows="3"
            class="input mt-1"
            required
            disabled={operationInProgress}
          ></textarea>
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            class="btn btn-primary"
            disabled={operationInProgress}
          >
            {operationInProgress ? "Creating..." : "Create Note"}
          </button>
        </div>
      </div>
    </form>
  {/if}

  {#if loading}
    <div class="text-center py-8">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"
      ></div>
      <p class="mt-2 text-gray-600">Loading notes...</p>
    </div>
  {:else if notes.length === 0}
    <div class="text-center py-8 bg-white rounded-lg shadow">
      <p class="text-gray-600">No notes yet. Create your first note!</p>
    </div>
  {:else}
    <NotesFilter
      {searchQuery}
      {sortBy}
      {sortOrder}
      on:search={handleSearch}
      on:sort={handleSort}
    />

    {#if filteredNotes.length === 0}
      <div class="text-center py-8 bg-white rounded-lg shadow">
        <p class="text-gray-600">No notes found matching your search.</p>
      </div>
    {:else}
      <div class="space-y-4">
        {#each paginatedNotes as note (note.id)}
          <NoteComponent
            {note}
            isEditing={editingNoteId === note.id}
            on:edit={handleEdit}
            on:delete={handleDelete}
            on:save={handleSave}
            on:cancel={handleCancel}
            disabled={operationInProgress}
          />
        {/each}
      </div>

      <Pagination
        bind:currentPage
        totalItems={filteredNotes.length}
        {itemsPerPage}
        on:pageChange={({ detail }) => handlePageChange(detail)}
      />
    {/if}
  {/if}
</div>

<ConfirmModal
  isOpen={showDeleteModal}
  title="Delete Note"
  message="Are you sure you want to delete this note? This action cannot be undone."
  confirmText="Delete"
  cancelText="Cancel"
  type="danger"
  on:confirm={confirmDelete}
  on:cancel={() => {
    showDeleteModal = false;
    noteToDelete = null;
  }}
/>
