import { readData, writeData } from "../../utils/fileManager.js";
import { generateId } from "../../utils/idGenerator.js";
import { isNotEmpty, isValidEmail } from "../../utils/validator.js";
import { logActivity } from "../../utils/activityLog.js";

const FILE = "users.json";
const ROLES = ["admin", "member"];

const getUsers = () => readData(FILE) || [];
const saveUsers = (users) => writeData(FILE, users);

export function getAllUsers(page = 1, limit = 5) {
  const users = getUsers();
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * limit;

  return {
    users: users.slice(start, start + limit),
    totalUsers: users.length,
    totalPages: Math.max(1, Math.ceil(users.length / limit)),
    currentPage: safePage,
  };
}

export function getUserById(id) {
  return getUsers().find((u) => u.id === id) || null;
}

export function addUser(data, adminId = "SYSTEM") {
  const { fullName, email, role } = data;

  if (!isNotEmpty(fullName))
    return { success: false, message: "Name is required." };
  if (!isValidEmail(email))
    return { success: false, message: "Invalid email." };
  if (!ROLES.includes(role))
    return { success: false, message: "Invalid role." };

  const users = getUsers();
  const cleanEmail = email.trim().toLowerCase();

  if (users.some((u) => u.email === cleanEmail)) {
    return { success: false, message: "Email already exists." };
  }

  const newUser = {
    id: generateId("USR", users),
    fullName: fullName.trim(),
    email: cleanEmail,
    role,
    status: "active",
  };

  users.push(newUser);
  saveUsers(users);

  logActivity({
    userId: adminId,
    action: "ADD_USER",
    details: `Added user ${newUser.fullName} (${newUser.id})`,
  });

  return { success: true, user: newUser };
}

export function searchUsers(text = "") {
  const query = text.trim().toLowerCase();
  const users = getUsers();

  if (!query) return users;

  return users.filter(
    (u) =>
      u.id.toLowerCase().includes(query) ||
      u.fullName.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query),
  );
}

export function updateUser(id, data, adminId = "SYSTEM") {
  const users = getUsers();
  const user = users.find((u) => u.id === id);

  if (!user) return { success: false, message: "User not found." };

  if (data.fullName !== undefined) {
    if (!isNotEmpty(data.fullName))
      return { success: false, message: "Name cannot be empty." };
    user.fullName = data.fullName.trim();
  }

  if (data.email !== undefined) {
    if (!isValidEmail(data.email))
      return { success: false, message: "Invalid email." };

    const cleanEmail = data.email.trim().toLowerCase();
    const exists = users.some((u) => u.email === cleanEmail && u.id !== id);
    if (exists) return { success: false, message: "Email already exists." };

    user.email = cleanEmail;
  }

  if (data.role !== undefined) {
    if (!ROLES.includes(data.role))
      return { success: false, message: "Invalid role." };
    user.role = data.role;
  }

  saveUsers(users);

  logActivity({
    userId: adminId,
    action: "UPDATE_USER",
    details: `Updated user ${id}`,
  });

  return { success: true, user };
}

export function deactivateUser(id, adminId = "SYSTEM") {
  const users = getUsers();
  const user = users.find((u) => u.id === id);

  if (!user) return { success: false, message: "User not found." };
  if (user.status === "deactivated")
    return { success: false, message: "Already deactivated." };

  user.status = "deactivated";
  saveUsers(users);

  logActivity({
    userId: adminId,
    action: "DEACTIVATE_USER",
    details: `Deactivated user ${user.fullName} (${user.id})`,
  });

  return { success: true, user };
}

export function getUserProfile(id) {
  const user = getUserById(id);
  if (!user) return null;

  const tasks = readData("tasks.json") || [];
  return {
    ...user,
    tasks: tasks.filter((t) => t.assigneeId === id),
  };
}
