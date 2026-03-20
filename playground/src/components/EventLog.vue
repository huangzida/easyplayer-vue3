<script setup lang="ts">
import { computed } from 'vue';
import type { EventHistory } from '@/types';

const props = defineProps<{
  events: EventHistory[];
  maxLogs?: number;
}>();

const emit = defineEmits<{
  (e: 'clear'): void;
  (e: 'export'): void;
}>();

const displayEvents = computed(() => {
  return props.events.slice(0, props.maxLogs || 50);
});

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const ms = date.getMilliseconds().toString().padStart(3, '0');
  return `${hours}:${minutes}:${seconds}.${ms}`;
};

const formatData = (data: any) => {
  if (data === undefined) return '';
  if (data === null) return 'null';
  if (typeof data === 'object') {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  }
  return String(data);
};

const getEventClass = (event: string) => {
  if (event.includes('error') || event.includes('Error')) return 'event-error';
  if (event.includes('timeout')) return 'event-warning';
  if (event.includes('play') || event.includes('pause')) return 'event-playback';
  if (event.includes('kBps')) return 'event-network';
  return 'event-info';
};

const exportHistory = () => {
  const data = JSON.stringify(props.events, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `easyplayer-events-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  emit('export');
};
</script>

<template>
  <div class="event-log">
    <div class="log-header">
      <h3 class="log-title">Event Log</h3>
      <div class="log-actions">
        <span class="log-count">{{ events.length }} events</span>
        <button class="action-btn" title="Export history" @click="exportHistory">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
        </button>
        <button class="action-btn" title="Clear logs" @click="emit('clear')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>

    <div class="log-content">
      <div v-if="displayEvents.length === 0" class="log-empty">
        <span>No events yet</span>
      </div>
      <div v-else class="log-list">
        <div
          v-for="(event, index) in displayEvents"
          :key="`${event.timestamp}-${index}`"
          :class="['log-item', getEventClass(event.event)]"
        >
          <span class="log-time">{{ formatTime(event.timestamp) }}</span>
          <span class="log-event">{{ event.event }}</span>
          <span v-if="event.data !== undefined" class="log-data">
            {{ formatData(event.data) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.event-log {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.log-header {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.log-title {
  font-size: 16px;
  font-weight: 600;
  color: #f1f5f9;
  margin: 0;
}

.log-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.log-count {
  font-size: 12px;
  color: #64748b;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.action-btn {
  padding: 6px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
  border-color: rgba(255, 255, 255, 0.2);
}

.log-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}

.log-content::-webkit-scrollbar {
  width: 6px;
}

.log-content::-webkit-scrollbar-track {
  background: transparent;
}

.log-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.log-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

.log-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #64748b;
  font-size: 14px;
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.log-item {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  gap: 4px 12px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  font-size: 13px;
  transition: all 0.2s;
}

.log-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.12);
}

.log-time {
  color: #64748b;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  grid-row: 1 / 2;
  grid-column: 1 / 2;
}

.log-event {
  color: #e2e8f0;
  font-weight: 500;
  grid-row: 1 / 2;
  grid-column: 2 / 3;
}

.log-data {
  grid-row: 2 / 3;
  grid-column: 1 / 3;
  color: #94a3b8;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 60px;
  overflow-y: auto;
}

.event-error {
  border-left: 3px solid #ef4444;
}

.event-error .log-event {
  color: #fca5a5;
}

.event-warning {
  border-left: 3px solid #f59e0b;
}

.event-warning .log-event {
  color: #fcd34d;
}

.event-playback .log-event {
  color: #34d399;
}

.event-network {
  border-left: 3px solid #38bdf8;
}

.event-network .log-event {
  color: #7dd3fc;
}

.event-info {
  border-left: 3px solid #a78bfa;
}

.event-info .log-event {
  color: #c4b5fd;
}
</style>
