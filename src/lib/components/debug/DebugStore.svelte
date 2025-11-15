<!--
  Composant de débogage pour afficher le
  contenu en temps réel des stores Svelte.
-->
<script lang="ts">
  // 1. Importer les stores que nous voulons surveiller
  import { events } from '$lib/stores/event-store';
  import { chat } from '$lib/stores/chat-store';

  /**
   * Une fonction 'replacer' pour JSON.stringify
   * pour gérer les types de données complexes (ex: Map, Set)
   * et éviter les références circulaires.
   */
  function replacer(key: string, value: any) {
    if (value instanceof Map) {
      return { _type: 'Map', data: Array.from(value.entries()) };
    }
    if (value instanceof Set) {
      return { _type: 'Set', data: Array.from(value.values()) };
    }
    return value;
  }
</script>

<div class="debug-store-tab">
  
  <!-- Store: chatStore -->
  <div class="store-display">
    <h3>chat (Chat Store)</h3>
    <pre>{JSON.stringify($chat, replacer, 2)}</pre>
  </div>
  
  <!-- Store: eventStore -->
  <div class="store-display">
    <h3>events (Last SSE Event)</h3>
    <pre>{JSON.stringify($events, replacer, 2)}</pre>
  </div>

</div>

<style>
  .debug-store-tab {
    font-family: 'Inter', sans-serif;
    color: white;
    padding: 0.5rem;
  }

  .store-display {
    margin-bottom: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.1);
  }

  .store-display h3 {
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    margin: 0;
    padding: 0.5rem 0.75rem;
    background-color: rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .store-display pre {
    font-family:
      ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
      monospace;
    font-size: 0.8rem;
    overflow-x: auto;
    color: white;
    padding: 0.75rem;
    margin: 0;
  }
</style>