import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import {
  getAllUsers,
  addUser,
  searchUsers,
  updateUser,
  deactivateUser,
  getUserProfile,
} from "./modules/users/userService.js";

const rl = readline.createInterface({ input, output });
let currentUser = null;

function createDefaultAdmin() {
  const data = getAllUsers();
  if (data.totalUsers === 0) {
    addUser({
      fullName: "Admin",
      email: "admin@company.com",
      role: "admin",
    });
  }
}

async function login() {
  console.log("\n--- Task Management Login ---");
  console.log("Default admin: admin@company.com");

  while (!currentUser) {
    const val = (await rl.question('Email or ID (or "exit"): ')).trim();

    if (val === "exit") {
      rl.close();
      process.exit(0);
    }

    const found = searchUsers(val);
    const user = found.find(
      (u) => u.email === val.toLowerCase() || u.id === val.toUpperCase(),
    );

    if (!user) {
      console.log("User not found.\n");
    } else if (user.status === "deactivated") {
      console.log("Account is deactivated.\n");
    } else {
      currentUser = user;
      console.log(`\nWelcome ${user.fullName}!`);
    }
  }
}

async function usersMenu() {
  while (true) {
    console.log("\n--- Users Menu ---");
    console.log("1. All Users");
    console.log("2. Search User");
    console.log("3. User Profile");

    if (currentUser.role === "admin") {
      console.log("4. Add User");
      console.log("5. Update User");
      console.log("6. Deactivate User");
    }
    console.log("0. Back");

    const op = (await rl.question("Select: ")).trim();

    if (op === "0") break;

    if (op === "1") {
      const p = await rl.question("Page (1): ");
      const page = Number(p) || 1;
      const res = getAllUsers(page, 5);
      console.log(`Page ${res.currentPage} / ${res.totalPages}`);
      console.table(res.users);
    } else if (op === "2") {
      const q = await rl.question("Search: ");
      console.table(searchUsers(q));
    } else if (op === "3") {
      const id = (await rl.question("User ID: ")).trim().toUpperCase();
      const profile = getUserProfile(id);
      if (!profile) {
        console.log("Not found.");
      } else {
        console.log(profile);
      }
    } else if (op === "4" && currentUser.role === "admin") {
      const fullName = await rl.question("Name: ");
      const email = await rl.question("Email: ");
      const role = (await rl.question("Role (admin/member): "))
        .trim()
        .toLowerCase();

      const res = addUser({ fullName, email, role }, currentUser.id);
      console.log(res.success ? `Added: ${res.user.id}` : res.message);
    } else if (op === "5" && currentUser.role === "admin") {
      const id = (await rl.question("User ID: ")).trim().toUpperCase();
      const fullName = await rl.question("New Name (Enter to skip): ");
      const email = await rl.question("New Email (Enter to skip): ");
      const role = await rl.question("New Role (Enter to skip): ");

      const updatedFields = {};
      if (fullName.trim()) updatedFields.fullName = fullName.trim();
      if (email.trim()) updatedFields.email = email.trim();
      if (role.trim()) updatedFields.role = role.trim().toLowerCase();

      const res = updateUser(id, updatedFields, currentUser.id);
      console.log(res.success ? "Updated." : res.message);
    } else if (op === "6" && currentUser.role === "admin") {
      const id = (await rl.question("User ID: ")).trim().toUpperCase();
      const res = deactivateUser(id, currentUser.id);
      console.log(res.success ? "Deactivated." : res.message);
    } else {
      console.log("Invalid choice.");
    }
  }
}

async function main() {
  createDefaultAdmin();

  while (true) {
    if (!currentUser) {
      await login();
    }

    console.log("\n=== Main Menu ===");
    console.log("1. Users");
    console.log("2. Projects");
    console.log("3. Tasks");
    console.log("4. Workflow");
    console.log("5. Activity Log");
    console.log("6. Search & Labels");
    console.log("7. Reports");
    console.log("8. Logout");
    console.log("0. Exit");

    const choice = (await rl.question("Menu: ")).trim();

    if (choice === "1") {
      await usersMenu();
    } else if (["2", "3", "4", "5", "6", "7"].includes(choice)) {
      console.log("Not ready yet.");
    } else if (choice === "8") {
      currentUser = null;
      console.log("Logged out.");
    } else if (choice === "0") {
      rl.close();
      break;
    } else {
      console.log("Invalid choice.");
    }
  }
}

main();
