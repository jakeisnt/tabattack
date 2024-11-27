#!/usr/bin/env bun

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, resolve, relative, dirname } from "path";

const importmap = JSON.parse(readFileSync("importmap.json", "utf-8"));
const distDir = resolve("extension-dist");

function fixImports(content: string, filePath: string): string {
  let newContent = content;
  
  // Replace all @/ imports with their mapped paths
  Object.entries(importmap.imports).forEach(([from, to]) => {
    const escapedFrom = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`from ["']${escapedFrom}([^"']*?)["']`, "g");
    
    newContent = newContent.replace(regex, (match, importPath) => {
      // Calculate relative path from current file to target
      const targetPath = join(distDir, to.slice(2), importPath);
      const relativePath = relative(dirname(filePath), targetPath);
      const normalizedPath = relativePath.startsWith(".") ? relativePath : "./" + relativePath;
      
      return `from "${normalizedPath}"`;
    });
  });

  return newContent;
}

function processDirectory(dir: string) {
  const files = readdirSync(dir);

  files.forEach(file => {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith(".js")) {
      console.log(`Processing ${fullPath}`);
      const content = readFileSync(fullPath, "utf-8");
      const fixedContent = fixImports(content, fullPath);
      writeFileSync(fullPath, fixedContent);
    }
  });
}

// First run tsc with custom outDir
console.log("Running TypeScript compilation for extension...");
const { execSync } = require("child_process");
try {
  execSync("tsc --outDir extension-dist", { stdio: "inherit" });
} catch (error) {
  console.error("TypeScript compilation failed:", error);
  process.exit(1);
}

// Then fix imports
console.log("Fixing imports...");
processDirectory(distDir);
console.log("Extension build complete!");
