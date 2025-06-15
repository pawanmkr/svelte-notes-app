<script lang="ts">
  export let currentPage = 1;
  export let totalItems = 0;
  export let itemsPerPage = 10;
  export let maxPages = 5;

  $: totalPages = Math.ceil(totalItems / itemsPerPage);
  $: startPage = Math.max(
    1,
    Math.min(currentPage - Math.floor(maxPages / 2), totalPages - maxPages + 1)
  );
  $: endPage = Math.min(startPage + maxPages - 1, totalPages);
  $: pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  function handlePageChange(page: number) {
    if (page < 1 || page > totalPages || page === currentPage) return;
    currentPage = page;
  }
</script>

{#if totalPages > 1}
  <div class="flex justify-center items-center space-x-2 mt-4">
    <!-- First Page -->
    <button
      type="button"
      class="btn btn-secondary px-3 py-1"
      disabled={currentPage === 1}
      on:click={() => handlePageChange(1)}
    >
      «
    </button>

    <!-- Previous Page -->
    <button
      type="button"
      class="btn btn-secondary px-3 py-1"
      disabled={currentPage === 1}
      on:click={() => handlePageChange(currentPage - 1)}
    >
      ‹
    </button>

    <!-- Page Numbers -->
    {#each pages as page}
      <button
        type="button"
        class="btn {page === currentPage
          ? 'btn-primary'
          : 'btn-secondary'} px-3 py-1"
        on:click={() => handlePageChange(page)}
      >
        {page}
      </button>
    {/each}

    <!-- Next Page -->
    <button
      type="button"
      class="btn btn-secondary px-3 py-1"
      disabled={currentPage === totalPages}
      on:click={() => handlePageChange(currentPage + 1)}
    >
      ›
    </button>

    <!-- Last Page -->
    <button
      type="button"
      class="btn btn-secondary px-3 py-1"
      disabled={currentPage === totalPages}
      on:click={() => handlePageChange(totalPages)}
    >
      »
    </button>
  </div>

  <div class="text-center text-sm text-gray-600 mt-2">
    Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to {Math.min(
      currentPage * itemsPerPage,
      totalItems
    )} of {totalItems} notes
  </div>
{/if}
