<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let searchQuery = "";
  export let sortBy: "createdAt" | "title" = "createdAt";
  export let sortOrder: "asc" | "desc" = "desc";

  const dispatch = createEventDispatcher<{
    search: string;
    sort: { by: "createdAt" | "title"; order: "asc" | "desc" };
  }>();

  function handleSearch(e: Event) {
    const target = e.target as HTMLInputElement;
    dispatch("search", target.value);
  }

  function handleSort(by: "createdAt" | "title") {
    if (sortBy === by) {
      // Toggle sort order if clicking the same field
      sortOrder = sortOrder === "asc" ? "desc" : "asc";
    } else {
      // Default to descending for new sort field
      sortBy = by;
      sortOrder = "desc";
    }
    dispatch("sort", { by: sortBy, order: sortOrder });
  }
</script>

<div class="card p-4 mb-4">
  <div class="flex flex-col sm:flex-row gap-4">
    <!-- Search -->
    <div class="flex-1">
      <label for="search" class="sr-only text-primary">Search notes</label>
      <div class="relative">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <svg
            class="h-5 w-5 text-muted"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <input
          type="text"
          id="search"
          class="input pl-10"
          placeholder="Search notes..."
          value={searchQuery}
          on:input={handleSearch}
        />
      </div>
    </div>

    <!-- Sort -->
    <div class="flex gap-2">
      <button
        type="button"
        class="btn {sortBy === 'createdAt' ? 'btn-primary' : 'btn-secondary'}"
        on:click={() => handleSort("createdAt")}
      >
        <span class="text-primary">Date</span>
        {sortBy === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
      </button>
      <button
        type="button"
        class="btn {sortBy === 'title' ? 'btn-primary' : 'btn-secondary'}"
        on:click={() => handleSort("title")}
      >
        <span class="text-primary">Title</span>
        {sortBy === "title" && (sortOrder === "asc" ? "↑" : "↓")}
      </button>
    </div>
  </div>
</div>
