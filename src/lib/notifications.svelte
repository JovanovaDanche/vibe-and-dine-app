<script>
  export let message = '';
  export let type = 'success';
  export let show = false;
</script>

{#if show}
  <div class="notification {type}">
    <span class="text">{message}</span>
  </div>
{/if}

<style>
.notification {
  position: fixed;
  bottom: 30px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 8px 14px;
  border-radius: 14px;
  color: #fff;
  font-weight: 500;
  font-size: 0.75rem;

  animation: fadeIn 0.3s ease, fadeOut 0.3s ease 2.7s;
  z-index: 99999;
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
  backdrop-filter: blur(6px);
}
.success {
  background:#a8e6a3;
  color: #1b371b;
}
.error {
  background:#f28b82; 
  color: #3b0a0a;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(20px); }
}
</style>