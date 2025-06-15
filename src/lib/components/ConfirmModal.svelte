<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let isOpen = false;
  export let title = "Confirm Action";
  export let message = "Are you sure you want to proceed?";
  export let confirmText = "Confirm";
  export let cancelText = "Cancel";
  export let type: "danger" | "warning" | "info" = "warning";

  const dispatch = createEventDispatcher<{
    confirm: void;
    cancel: void;
  }>();

  function handleConfirm() {
    dispatch("confirm");
  }

  function handleCancel() {
    dispatch("cancel");
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  }
</script>

{#if isOpen}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    on:click={handleBackdropClick}
    on:keydown={(e) => e.key === "Escape" && handleCancel()}
    role="presentation"
    tabindex="-1"
  >
    <div
      class="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <h3 id="modal-title" class="text-lg font-medium mb-2">{title}</h3>
      <p class="text-gray-600 mb-6">{message}</p>
      <div class="flex justify-end space-x-3">
        <button type="button" class="btn btn-secondary" on:click={handleCancel}>
          {cancelText}
        </button>
        <button
          type="button"
          class="btn {type === 'danger'
            ? 'btn-danger'
            : type === 'warning'
              ? 'btn-warning'
              : 'btn-primary'}"
          on:click={handleConfirm}
        >
          {confirmText}
        </button>
      </div>
    </div>
  </div>
{/if}
