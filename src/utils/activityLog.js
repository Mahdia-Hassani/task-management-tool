import { readData, writeData } from './fileManager.js';
import { generateId } from './idGenerator.js';

export function logActivity({ userId, projectId = null, taskId = null, action, details }) {
  const logs = readData('activityLog.json');
  const newLog = {
    id: generateId('ACT', logs),
    userId,
    projectId,
    taskId,
    action,
    details,
    timestamp: new Date().toISOString()
  };
  logs.push(newLog);
  writeData('activityLog.json', logs);
  return newLog;
}
